using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.NetworkInformation;
using System.Net.Sockets;
using System.Net;
using System.Runtime.InteropServices;
using System.Threading;
using System.Threading.Tasks;
using Makaretu.Dns;
using Makaretu.Dns.Resolving;
using Microsoft.Extensions.Logging;
using System.Collections.Concurrent;
using System.Security.Cryptography;

namespace Signal.Beacon.Application.Network.mDNS
{
    /// <summary>
    ///   Performs the magic to send and receive datagrams over multicast
    ///   sockets.
    /// </summary>
    internal class MulticastClient : IDisposable
    {
        private readonly ILogger<MulticastClient> log;

        /// <summary>
        ///   The port number assigned to Multicast DNS.
        /// </summary>
        /// <value>
        ///   Port number 5353.
        /// </value>
        public static readonly int MulticastPort = 5353;

        private static readonly IPAddress MulticastAddressIp4 = IPAddress.Parse("224.0.0.251");
        private static readonly IPAddress MulticastAddressIp6 = IPAddress.Parse("FF02::FB");
        private static readonly IPEndPoint MdnsEndpointIp6 = new(MulticastAddressIp6, MulticastPort);
        private static readonly IPEndPoint MdnsEndpointIp4 = new(MulticastAddressIp4, MulticastPort);

        private readonly List<UdpClient> receivers;
        private readonly ConcurrentDictionary<IPAddress, UdpClient> senders = new();

        public event EventHandler<UdpReceiveResult> MessageReceived;

        public MulticastClient(bool useIPv4, bool useIpv6, IEnumerable<NetworkInterface> nics,
            ILogger<MulticastClient> logger)
        {
            this.log = logger;

            // Setup the receivers.
            this.receivers = new List<UdpClient>();

            UdpClient receiver4 = null;
            if (useIPv4)
            {
                receiver4 = new UdpClient(AddressFamily.InterNetwork);
                receiver4.Client.SetSocketOption(SocketOptionLevel.Socket, SocketOptionName.ReuseAddress, true);
                receiver4.Client.Bind(new IPEndPoint(IPAddress.Any, MulticastPort));
                this.receivers.Add(receiver4);
            }

            UdpClient receiver6 = null;
            if (useIpv6)
            {
                receiver6 = new UdpClient(AddressFamily.InterNetworkV6);
                receiver6.Client.SetSocketOption(SocketOptionLevel.Socket, SocketOptionName.ReuseAddress, true);
#if NETSTANDARD2_0
                if (RuntimeInformation.IsOSPlatform(OSPlatform.Linux))
                {
                    LinuxHelper.ReuseAddresss(receiver6.Client);
                }
#endif
                receiver6.Client.Bind(new IPEndPoint(IPAddress.IPv6Any, MulticastPort));
                this.receivers.Add(receiver6);
            }

            // Get the IP addresses that we should send to.
            var addreses = nics
                .SelectMany(this.GetNetworkInterfaceLocalAddresses)
                .Where(a => (useIPv4 && a.AddressFamily == AddressFamily.InterNetwork)
                            || (useIpv6 && a.AddressFamily == AddressFamily.InterNetworkV6));
            foreach (var address in addreses)
            {
                if (this.senders.Keys.Contains(address))
                {
                    continue;
                }

                var localEndpoint = new IPEndPoint(address, MulticastPort);
                var sender = new UdpClient(address.AddressFamily);
                try
                {
                    switch (address.AddressFamily)
                    {
                        case AddressFamily.InterNetwork:
                            receiver4.Client.SetSocketOption(SocketOptionLevel.IP, SocketOptionName.AddMembership,
                                new MulticastOption(MulticastAddressIp4, address));
                            sender.Client.SetSocketOption(SocketOptionLevel.Socket, SocketOptionName.ReuseAddress,
                                true);
#if NETSTANDARD2_0
                            if (RuntimeInformation.IsOSPlatform(OSPlatform.Linux))
                            {
                                LinuxHelper.ReuseAddresss(sender.Client);
                            }
#endif
                            sender.Client.Bind(localEndpoint);
                            sender.Client.SetSocketOption(SocketOptionLevel.IP, SocketOptionName.AddMembership,
                                new MulticastOption(MulticastAddressIp4));
                            sender.Client.SetSocketOption(SocketOptionLevel.IP, SocketOptionName.MulticastLoopback,
                                true);
                            break;
                        case AddressFamily.InterNetworkV6:
                            receiver6.Client.SetSocketOption(SocketOptionLevel.IPv6, SocketOptionName.AddMembership,
                                new IPv6MulticastOption(MulticastAddressIp6, address.ScopeId));
                            sender.Client.SetSocketOption(SocketOptionLevel.Socket, SocketOptionName.ReuseAddress,
                                true);
                            sender.Client.Bind(localEndpoint);
                            sender.Client.SetSocketOption(SocketOptionLevel.IPv6, SocketOptionName.AddMembership,
                                new IPv6MulticastOption(MulticastAddressIp6));
                            sender.Client.SetSocketOption(SocketOptionLevel.IPv6, SocketOptionName.MulticastLoopback,
                                true);
                            break;
                        default:
                            throw new NotSupportedException($"Address family {address.AddressFamily}.");
                    }

                    this.log.LogDebug($"Will send via {localEndpoint}");
                    if (!this.senders.TryAdd(address, sender)) // Should not fail
                    {
                        sender.Dispose();
                    }
                }
                catch (SocketException ex) when (ex.SocketErrorCode == SocketError.AddressNotAvailable)
                {
                    // VPN NetworkInterfaces
                    sender.Dispose();
                }
                catch (Exception e)
                {
                    this.log.LogError($"Cannot setup send socket for {address}: {e.Message}");
                    sender.Dispose();
                }
            }

            // Start listening for messages.
            foreach (var r in this.receivers)
            {
                this.Listen(r);
            }
        }

        public async Task SendAsync(byte[] message)
        {
            foreach (var sender in this.senders)
            {
                try
                {
                    var endpoint = sender.Key.AddressFamily == AddressFamily.InterNetwork
                        ? MdnsEndpointIp4
                        : MdnsEndpointIp6;
                    await sender.Value.SendAsync(
                            message, message.Length,
                            endpoint)
                        .ConfigureAwait(false);
                }
                catch (Exception e)
                {
                    this.log.LogError($"Sender {sender.Key} failure: {e.Message}");
                    // eat it.
                }
            }
        }

        private void Listen(UdpClient receiver)
        {
            // ReceiveAsync does not support cancellation.  So the receiver is disposed
            // to stop it. See https://github.com/dotnet/corefx/issues/9848
            Task.Run(async () =>
            {
                try
                {
                    var task = receiver.ReceiveAsync();

                    _ = task.ContinueWith(x => this.Listen(receiver),
                        TaskContinuationOptions.OnlyOnRanToCompletion |
                        TaskContinuationOptions.RunContinuationsAsynchronously);

                    _ = task.ContinueWith(x => this.MessageReceived?.Invoke(this, x.Result),
                        TaskContinuationOptions.OnlyOnRanToCompletion |
                        TaskContinuationOptions.RunContinuationsAsynchronously);

                    await task.ConfigureAwait(false);
                }
                catch
                {
                    return;
                }
            });
        }

        private IEnumerable<IPAddress> GetNetworkInterfaceLocalAddresses(NetworkInterface nic)
        {
            return nic
                    .GetIPProperties()
                    .UnicastAddresses
                    .Select(x => x.Address)
                    .Where(x => x.AddressFamily != AddressFamily.InterNetworkV6 || x.IsIPv6LinkLocal)
                ;
        }

        #region IDisposable Support

        private bool disposedValue = false; // To detect redundant calls

        protected virtual void Dispose(bool disposing)
        {
            if (!this.disposedValue)
            {
                if (disposing)
                {
                    this.MessageReceived = null;

                    foreach (var receiver in this.receivers)
                    {
                        try
                        {
                            receiver.Dispose();
                        }
                        catch
                        {
                            // eat it.
                        }
                    }

                    this.receivers.Clear();

                    foreach (var address in this.senders.Keys)
                    {
                        if (this.senders.TryRemove(address, out var sender))
                        {
                            try
                            {
                                sender.Dispose();
                            }
                            catch
                            {
                                // eat it.
                            }
                        }
                    }

                    this.senders.Clear();
                }

                this.disposedValue = true;
            }
        }

        ~MulticastClient()
        {
            this.Dispose(false);
        }

        // This code added to correctly implement the disposable pattern.
        public void Dispose()
        {
            this.Dispose(true);
            GC.SuppressFinalize(this);
        }

        #endregion
    }

    /// <summary>
    ///   The event data for <see cref="MulticastService.QueryReceived"/> or
    ///   <see cref="MulticastService.AnswerReceived"/>.
    /// </summary>
    public class MessageEventArgs : EventArgs
    {
        public static readonly int MulticastPort = 5353;

        public MessageEventArgs(Message message, IPEndPoint? remoteEndPoint)
        {
            this.Message = message;
            this.RemoteEndPoint = remoteEndPoint;
        }

        /// <summary>
        ///   The DNS message.
        /// </summary>
        /// <value>
        ///   The received message.
        /// </value>
        public Message Message { get; }

        /// <summary>
        ///   The DNS message sender endpoint.
        /// </summary>
        /// <value>
        ///   The endpoint from the message was received.
        /// </value>
        public IPEndPoint? RemoteEndPoint { get; }

        /// <summary>
        ///   Determines if the sender is using legacy unicast DNS.
        /// </summary>
        /// <value>
        ///   <b>false</b> if the sender is using port 5353.
        /// </value>
        public bool? IsLegacyUnicast => this.RemoteEndPoint == null ? null : this.RemoteEndPoint.Port != MulticastPort;
    }

    /// <summary>
    ///   The event data for <see cref="MulticastService.NetworkInterfaceDiscovered"/>.
    /// </summary>
    public class NetworkInterfaceEventArgs : EventArgs
    {
        /// <summary>
        ///   The sequece of detected network interfaces.
        /// </summary>
        /// <value>
        ///   A sequence of network interfaces.
        /// </value>
        public IEnumerable<NetworkInterface> NetworkInterfaces { get; set; }
    }

    /// <summary>
    ///   Maintains a sequence of recent messages.
    /// </summary>
    /// <remarks>
    ///   <b>RecentMessages</b> is used to determine if a message has already been
    ///   processed within the specified <see cref="Interval"/>.
    /// </remarks>
    public class RecentMessages
    {
        /// <summary>
        ///   Recent messages.
        /// </summary>
        /// <value>
        ///   The key is the Base64 encoding of the MD5 hash of
        ///   a message and the value is when the message was seen.
        /// </value>
        public ConcurrentDictionary<string, DateTime> Messages = new();

        /// <summary>
        ///   The time interval used to determine if a message is recent.
        /// </summary>
        public TimeSpan Interval { get; set; } = TimeSpan.FromSeconds(1);

        /// <summary>
        ///   Try adding a message to the recent message list.
        /// </summary>
        /// <param name="message">
        ///   The binary representation of a message.
        /// </param>
        /// <returns>
        ///   <b>true</b> if the message, did not already exist; otherwise,
        ///   <b>false</b> the message exists within the <see cref="Interval"/>.
        /// </returns>
        public bool TryAdd(byte[] message)
        {
            this.Prune();
            return this.Messages.TryAdd(this.GetId(message), DateTime.Now);
        }

        /// <summary>
        ///   Remove any messages that are stale.
        /// </summary>
        /// <returns>
        ///   The number messages that were pruned.
        /// </returns>
        /// <remarks>
        ///   Anything older than an <see cref="Interval"/> ago is removed.
        /// </remarks>
        public int Prune()
        {
            var dead = DateTime.Now - this.Interval;
            var count = 0;

            foreach (var stale in this.Messages.Where(x => x.Value < dead))
            {
                if (this.Messages.TryRemove(stale.Key, out _))
                {
                    ++count;
                }
            }

            return count;
        }

        /// <summary>
        ///   Gets a unique ID for a message.
        /// </summary>
        /// <param name="message">
        ///   The binary representation of a message.
        /// </param>
        /// <returns>
        ///   The Base64 encoding of the MD5 hash of the <paramref name="message"/>.
        /// </returns>
        public string GetId(byte[] message)
        {
            // MD5 is okay because the hash is not used for security.
            using (HashAlgorithm hasher = MD5.Create())
            {
                return Convert.ToBase64String(hasher.ComputeHash(message));
            }
        }
    }

    /// <summary>
    ///   Muticast Domain Name Service.
    /// </summary>
    /// <remarks>
    ///   Sends and receives DNS queries and answers via the multicast mechachism
    ///   defined in <see href="https://tools.ietf.org/html/rfc6762"/>.
    ///   <para>
    ///   Use <see cref="Start"/> to start listening for multicast messages.
    ///   One of the events, <see cref="QueryReceived"/> or <see cref="AnswerReceived"/>, is
    ///   raised when a <see cref="Message"/> is received.
    ///   </para>
    /// </remarks>
    internal sealed class MulticastService : IResolver, IDisposable
    {
        // IP header (20 bytes for IPv4; 40 bytes for IPv6) and the UDP header(8 bytes).
        private const int packetOverhead = 48;
        private const int maxDatagramSize = Message.MaxLength;

        private static readonly TimeSpan maxLegacyUnicastTTL = TimeSpan.FromSeconds(10);
        private readonly ILogger<MulticastService> log;
        private readonly ILogger<MulticastClient> multicastClientLogger;

        private static readonly IPNetwork2[] LinkLocalNetworks = new[]
        {
            IPNetwork2.Parse("169.254.0.0/16"),
            IPNetwork2.Parse("fe80::/10")
        };

        private List<NetworkInterface> knownNics = new();
        private int maxPacketSize;

        /// <summary>
        ///   Recently sent messages.
        /// </summary>
        private RecentMessages sentMessages = new();

        /// <summary>
        ///   Recently received messages.
        /// </summary>
        private RecentMessages receivedMessages = new();

        /// <summary>
        ///   The multicast client.
        /// </summary>
        private MulticastClient client;

        /// <summary>
        ///   Use to send unicast IPv4 answers.
        /// </summary>
        private UdpClient unicastClientIp4 = new(AddressFamily.InterNetwork);

        /// <summary>
        ///   Use to send unicast IPv6 answers.
        /// </summary>
        private UdpClient unicastClientIp6 = new(AddressFamily.InterNetworkV6);

        /// <summary>
        ///   Function used for listening filtered network interfaces.
        /// </summary>
        private Func<IEnumerable<NetworkInterface>, IEnumerable<NetworkInterface>>? networkInterfacesFilter;

        /// <summary>
        ///   Set the default TTLs.
        /// </summary>
        /// <seealso cref="ResourceRecord.DefaultTTL"/>
        /// <seealso cref="ResourceRecord.DefaultHostTTL"/>
        static MulticastService()
        {

            // https://tools.ietf.org/html/rfc6762 section 10
            ResourceRecord.DefaultTTL = TimeSpan.FromMinutes(75);
            ResourceRecord.DefaultHostTTL = TimeSpan.FromSeconds(120);
        }

        /// <summary>
        ///   Raised when any local MDNS service sends a query.
        /// </summary>
        /// <value>
        ///   Contains the query <see cref="Message"/>.
        /// </value>
        /// <remarks>
        ///   Any exception throw by the event handler is simply logged and
        ///   then forgotten.
        /// </remarks>
        /// <seealso cref="SendQuery(Message)"/>
        public event EventHandler<MessageEventArgs> QueryReceived;

        /// <summary>
        ///   Raised when any link-local MDNS service responds to a query.
        /// </summary>
        /// <value>
        ///   Contains the answer <see cref="Message"/>.
        /// </value>
        /// <remarks>
        ///   Any exception throw by the event handler is simply logged and
        ///   then forgotten.
        /// </remarks>
        public event EventHandler<MessageEventArgs> AnswerReceived;

        /// <summary>
        ///   Raised when a DNS message is received that cannot be decoded.
        /// </summary>
        /// <value>
        ///   The DNS message as a byte array.
        /// </value>
        public event EventHandler<byte[]> MalformedMessage;

        /// <summary>
        ///   Raised when one or more network interfaces are discovered.
        /// </summary>
        /// <value>
        ///   Contains the network interface(s).
        /// </value>
        public event EventHandler<NetworkInterfaceEventArgs> NetworkInterfaceDiscovered;

        /// <summary>
        ///   Create a new instance of the <see cref="MulticastService"/> class.
        /// </summary>
        /// <param name="filter">
        ///   Multicast listener will be bound to result of filtering function.
        /// </param>
        public MulticastService(
            Func<IEnumerable<NetworkInterface>, IEnumerable<NetworkInterface>>? filter,
            ILogger<MulticastService> logger,
            ILogger<MulticastClient> multicastClientLogger)
        {
            this.log = logger;
            this.multicastClientLogger = multicastClientLogger;
            this.networkInterfacesFilter = filter;

            this.UseIpv4 = Socket.OSSupportsIPv4;
            this.UseIpv6 = Socket.OSSupportsIPv6;
            this.IgnoreDuplicateMessages = true;
        }

        /// <summary>
        ///   Send and receive on IPv4.
        /// </summary>
        /// <value>
        ///   Defaults to <b>true</b> if the OS supports it.
        /// </value>
        public bool UseIpv4 { get; set; }

        /// <summary>
        ///   Send and receive on IPv6.
        /// </summary>
        /// <value>
        ///   Defaults to <b>true</b> if the OS supports it.
        /// </value>
        public bool UseIpv6 { get; set; }

        /// <summary>
        ///   Determines if received messages are checked for duplicates.
        /// </summary>
        /// <value>
        ///   <b>true</b> to ignore duplicate messages. Defaults to <b>true</b>.
        /// </value>
        /// <remarks>
        ///   When set, a message that has been received within the last minute
        ///   will be ignored.
        /// </remarks>
        public bool IgnoreDuplicateMessages { get; set; }

        /// <summary>
        ///   Get the network interfaces that are useable.
        /// </summary>
        /// <returns>
        ///   A sequence of <see cref="NetworkInterface"/>.
        /// </returns>
        /// <remarks>
        ///   The following filters are applied
        ///   <list type="bullet">
        ///   <item><description>interface is enabled</description></item>
        ///   <item><description>interface is not a loopback</description></item>
        ///   </list>
        ///   <para>
        ///   If no network interface is operational, then the loopback interface(s)
        ///   are included (127.0.0.1 and/or ::1).
        ///   </para>
        /// </remarks>
        public static IEnumerable<NetworkInterface> GetNetworkInterfaces()
        {
            var nics = NetworkInterface.GetAllNetworkInterfaces()
                .Where(nic => nic.OperationalStatus == OperationalStatus.Up)
                .Where(nic => nic.NetworkInterfaceType != NetworkInterfaceType.Loopback)
                .ToArray();
            if (nics.Length > 0)
                return nics;

            // Special case: no operational NIC, then use loopbacks.
            return NetworkInterface.GetAllNetworkInterfaces()
                .Where(nic => nic.OperationalStatus == OperationalStatus.Up);
        }

        /// <summary>
        ///   Get the IP addresses of the local machine.
        /// </summary>
        /// <returns>
        ///   A sequence of IP addresses of the local machine.
        /// </returns>
        /// <remarks>
        ///   The loopback addresses (127.0.0.1 and ::1) are NOT included in the
        ///   returned sequences.
        /// </remarks>
        public static IEnumerable<IPAddress> GetIPAddresses()
        {
            return GetNetworkInterfaces()
                .SelectMany(nic => nic.GetIPProperties().UnicastAddresses)
                .Select(u => u.Address);
        }

        /// <summary>
        ///   Get the link local IP addresses of the local machine.
        /// </summary>
        /// <returns>
        ///   A sequence of IP addresses.
        /// </returns>
        /// <remarks>
        ///   All IPv4 addresses are considered link local.
        /// </remarks>
        /// <seealso href="https://en.wikipedia.org/wiki/Link-local_address"/>
        public static IEnumerable<IPAddress> GetLinkLocalAddresses()
        {
            return GetIPAddresses()
                .Where(a => a.AddressFamily == AddressFamily.InterNetwork ||
                            (a.AddressFamily == AddressFamily.InterNetworkV6 && a.IsIPv6LinkLocal));
        }

        /// <summary>
        ///   Start the service.
        /// </summary>
        public void Start()
        {
            this.maxPacketSize = maxDatagramSize - packetOverhead;

            this.knownNics.Clear();

            this.FindNetworkInterfaces();
        }

        /// <summary>
        ///   Stop the service.
        /// </summary>
        /// <remarks>
        ///   Clears all the event handlers.
        /// </remarks>
        public void Stop()
        {
            // All event handlers are cleared.
            this.QueryReceived = null;
            this.AnswerReceived = null;
            this.NetworkInterfaceDiscovered = null;

            // Stop current UDP listener
            this.client?.Dispose();
            this.client = null;
        }

        private void OnNetworkAddressChanged(object sender, EventArgs e) => this.FindNetworkInterfaces();

        private void FindNetworkInterfaces()
        {
            this.log.LogDebug("Finding network interfaces");

            try
            {
                var currentNics = GetNetworkInterfaces().ToList();

                var newNics = new List<NetworkInterface>();
                var oldNics = new List<NetworkInterface>();

                foreach (var nic in this.knownNics.Where(k => !currentNics.Any(n => k.Id == n.Id)))
                {
                    oldNics.Add(nic);

                    this.log.LogDebug($"Removed nic '{nic.Name}'.");
                }

                foreach (var nic in currentNics.Where(nic => !this.knownNics.Any(k => k.Id == nic.Id)))
                {
                    newNics.Add(nic);

                    this.log.LogDebug($"Found nic '{nic.Name}'.");
                }

                this.knownNics = currentNics;

                // Only create client if something has change.
                if (newNics.Any() || oldNics.Any())
                {
                    this.client?.Dispose();
                    this.client = new MulticastClient(
                        this.UseIpv4,
                        this.UseIpv6,
                        this.networkInterfacesFilter?.Invoke(this.knownNics) ?? this.knownNics,
                        multicastClientLogger);
                    this.client.MessageReceived += this.OnDnsMessage;
                }

                // Tell others.
                if (newNics.Any())
                {
                    this.NetworkInterfaceDiscovered?.Invoke(this, new NetworkInterfaceEventArgs
                    {
                        NetworkInterfaces = newNics
                    });
                }

                // Magic from @eshvatskyi
                //
                // I've seen situation when NetworkAddressChanged is not triggered
                // (wifi off, but NIC is not disabled, wifi - on, NIC was not changed
                // so no event). Rebinding fixes this.
                //
                // Do magic only on Windows.

                if (RuntimeInformation.IsOSPlatform(OSPlatform.Windows))
                {
                    NetworkChange.NetworkAddressChanged -= this.OnNetworkAddressChanged;
                    NetworkChange.NetworkAddressChanged += this.OnNetworkAddressChanged;
                }
            }
            catch (Exception e)
            {
                this.log.LogError("FindNics failed", e);
            }
        }

        /// <inheritdoc />
        public Task<Message> ResolveAsync(Message request, CancellationToken cancel = default(CancellationToken))
        {
            var tsc = new TaskCompletionSource<Message>();

            void checkResponse(object s, MessageEventArgs e)
            {
                var response = e.Message;
                if (request.Questions.All(q => response.Answers.Any(a => a.Name == q.Name)))
                {
                    this.AnswerReceived -= checkResponse;
                    tsc.SetResult(response);
                }
            }

            cancel.Register(() =>
            {
                this.AnswerReceived -= checkResponse;
                tsc.TrySetCanceled();
            });

            this.AnswerReceived += checkResponse;
            this.SendQuery(request);

            return tsc.Task;
        }

        /// <summary>
        ///   Ask for answers about a name.
        /// </summary>
        /// <param name="name">
        ///   A domain name that should end with ".local", e.g. "myservice.local".
        /// </param>
        /// <param name="klass">
        ///   The class, defaults to <see cref="DnsClass.IN"/>.
        /// </param>
        /// <param name="type">
        ///   The question type, defaults to <see cref="DnsType.ANY"/>.
        /// </param>
        /// <remarks>
        ///   Answers to any query are obtained on the <see cref="AnswerReceived"/>
        ///   event.
        /// </remarks>
        /// <exception cref="InvalidOperationException">
        ///   When the service has not started.
        /// </exception>
        public void SendQuery(DomainName name, DnsClass klass = DnsClass.IN, DnsType type = DnsType.ANY)
        {
            var msg = new Message
            {
                Opcode = MessageOperation.Query,
                QR = false
            };
            msg.Questions.Add(new Question
            {
                Name = name,
                Class = klass,
                Type = type
            });

            this.SendQuery(msg);
        }

        /// <summary>
        ///   Ask for answers about a name and accept unicast and/or broadcast response.
        /// </summary>
        /// <param name="name">
        ///   A domain name that should end with ".local", e.g. "myservice.local".
        /// </param>
        /// <param name="klass">
        ///   The class, defaults to <see cref="DnsClass.IN"/>.
        /// </param>
        /// <param name="type">
        ///   The question type, defaults to <see cref="DnsType.ANY"/>.
        /// </param>
        /// <remarks>
        ///   Send a "QU" question (unicast).  The most significat bit of the Class is set.
        ///   Answers to any query are obtained on the <see cref="AnswerReceived"/>
        ///   event.
        /// </remarks>
        /// <exception cref="InvalidOperationException">
        ///   When the service has not started.
        /// </exception>
        public void SendUnicastQuery(DomainName name, DnsClass klass = DnsClass.IN, DnsType type = DnsType.ANY)
        {
            var msg = new Message
            {
                Opcode = MessageOperation.Query,
                QR = false
            };
            msg.Questions.Add(new Question
            {
                Name = name,
                Class = (DnsClass) ((ushort) klass | 0x8000),
                Type = type
            });

            this.SendQuery(msg);
        }

        /// <summary>
        ///   Ask for answers.
        /// </summary>
        /// <param name="msg">
        ///   A query message.
        /// </param>
        /// <remarks>
        ///   Answers to any query are obtained on the <see cref="AnswerReceived"/>
        ///   event.
        /// </remarks>
        /// <exception cref="InvalidOperationException">
        ///   When the service has not started.
        /// </exception>
        /// <exception cref="ArgumentOutOfRangeException">
        ///   When the serialised <paramref name="msg"/> is too large.
        /// </exception>
        public void SendQuery(Message msg)
        {
            this.Send(msg, false);
        }

        /// <summary>
        ///   Send an answer to a query.
        /// </summary>
        /// <param name="answer">
        ///   The answer message.
        /// </param>
        /// <param name="checkDuplicate">
        ///   If <b>true</b>, then if the same <paramref name="answer"/> was
        ///   recently sent it will not be sent again.
        /// </param>
        /// <exception cref="InvalidOperationException">
        ///   When the service has not started.
        /// </exception>
        /// <exception cref="ArgumentOutOfRangeException">
        ///   When the serialized <paramref name="answer"/> is too large.
        /// </exception>
        /// <remarks>
        ///   <para>
        ///   The <see cref="Message.AA"/> flag is set to true,
        ///   the <see cref="Message.Id"/> set to zero and any questions are removed.
        ///   </para>
        ///   <para>
        ///   The <paramref name="answer"/> is <see cref="Message.Truncate">truncated</see>
        ///   if exceeds the maximum packet length.
        ///   </para>
        ///   <para>
        ///   <paramref name="checkDuplicate"/> should always be <b>true</b> except
        ///   when <see href="https://tools.ietf.org/html/rfc6762#section-8.1">answering a probe</see>.
        ///   </para>
        ///   <note type="caution">
        ///   If possible the <see cref="SendAnswer(Message, MessageEventArgs, bool)"/>
        ///   method should be used, so that legacy unicast queries are supported.
        ///   </note>
        /// </remarks>
        /// <see cref="QueryReceived"/>
        /// <seealso cref="Message.CreateResponse"/>
        public void SendAnswer(Message answer, bool checkDuplicate = true)
        {
            // All MDNS answers are authoritative and have a transaction
            // ID of zero.
            answer.AA = true;
            answer.Id = 0;

            // All MDNS answers must not contain any questions.
            answer.Questions.Clear();

            answer.Truncate(this.maxPacketSize);

            this.Send(answer, checkDuplicate);
        }

        /// <summary>
        ///   Send an answer to a query.
        /// </summary>
        /// <param name="answer">
        ///   The answer message.
        /// </param>
        /// <param name="query">
        ///   The query that is being answered.
        /// </param>
        /// <param name="checkDuplicate">
        ///   If <b>true</b>, then if the same <paramref name="answer"/> was
        ///   recently sent it will not be sent again.
        /// </param>
        /// <exception cref="InvalidOperationException">
        ///   When the service has not started.
        /// </exception>
        /// <exception cref="ArgumentOutOfRangeException">
        ///   When the serialised <paramref name="answer"/> is too large.
        /// </exception>
        /// <remarks>
        ///   <para>
        ///   If the <paramref name="query"/> is a standard multicast query (sent to port 5353), then
        ///   <see cref="SendAnswer(Message, bool)"/> is called.
        ///   </para>
        ///   <para>
        ///   Otherwise a legacy unicast reponse is sent to sender's end point.
        ///   The <see cref="Message.AA"/> flag is set to true,
        ///   the <see cref="Message.Id"/> is set to query's ID,
        ///   the <see cref="Message.Questions"/> is set to the query's questions,
        ///   and all resource record TTLs have a max value of 10 seconds.
        ///   </para>
        ///   <para>
        ///   The <paramref name="answer"/> is <see cref="Message.Truncate">truncated</see>
        ///   if exceeds the maximum packet length.
        ///   </para>
        ///   <para>
        ///   <paramref name="checkDuplicate"/> should always be <b>true</b> except
        ///   when <see href="https://tools.ietf.org/html/rfc6762#section-8.1">answering a probe</see>.
        ///   </para>
        /// </remarks>
        public void SendAnswer(Message answer, MessageEventArgs query, bool checkDuplicate = true)
        {
            if (query.RemoteEndPoint != null && !(query.IsLegacyUnicast ?? false))
            {
                this.SendAnswer(answer, checkDuplicate);
                return;
            }

            answer.AA = true;
            answer.Id = query.Message.Id;
            answer.Questions.Clear();
            answer.Questions.AddRange(query.Message.Questions);
            answer.Truncate(this.maxPacketSize);

            foreach (var r in answer.Answers)
            {
                r.TTL = (r.TTL > maxLegacyUnicastTTL) ? maxLegacyUnicastTTL : r.TTL;
            }

            foreach (var r in answer.AdditionalRecords)
            {
                r.TTL = (r.TTL > maxLegacyUnicastTTL) ? maxLegacyUnicastTTL : r.TTL;
            }

            foreach (var r in answer.AdditionalRecords)
            {
                r.TTL = (r.TTL > maxLegacyUnicastTTL) ? maxLegacyUnicastTTL : r.TTL;
            }

            this.Send(answer, checkDuplicate, query.RemoteEndPoint);
        }

        private void Send(Message msg, bool checkDuplicate, IPEndPoint remoteEndPoint = null)
        {
            var packet = msg.ToByteArray();
            if (packet.Length > this.maxPacketSize)
            {
                throw new ArgumentOutOfRangeException($"Exceeds max packet size of {this.maxPacketSize}.");
            }

            if (checkDuplicate && !this.sentMessages.TryAdd(packet))
            {
                return;
            }

            // Standard multicast reponse?
            if (remoteEndPoint == null)
            {
                this.client?.SendAsync(packet).GetAwaiter().GetResult();
            }
            // Unicast response
            else
            {
                var unicastClient = (remoteEndPoint.Address.AddressFamily == AddressFamily.InterNetwork)
                    ? this.unicastClientIp4
                    : this.unicastClientIp6;
                unicastClient.SendAsync(packet, packet.Length, remoteEndPoint).GetAwaiter().GetResult();
            }
        }

        /// <summary>
        ///   Called by the MulticastClient when a DNS message is received.
        /// </summary>
        /// <param name="sender">
        ///   The <see cref="MulticastClient"/> that got the message.
        /// </param>
        /// <param name="result">
        ///   The received message <see cref="UdpReceiveResult"/>.
        /// </param>
        /// <remarks>
        ///   Decodes the <paramref name="result"/> and then raises
        ///   either the <see cref="QueryReceived"/> or <see cref="AnswerReceived"/> event.
        ///   <para>
        ///   Multicast DNS messages received with an OPCODE or RCODE other than zero
        ///   are silently ignored.
        ///   </para>
        ///   <para>
        ///   If the message cannot be decoded, then the <see cref="MalformedMessage"/>
        ///   event is raised.
        ///   </para>
        /// </remarks>
        public void OnDnsMessage(object sender, UdpReceiveResult result)
        {
            // If recently received, then ignore.
            if (this.IgnoreDuplicateMessages && !this.receivedMessages.TryAdd(result.Buffer))
            {
                return;
            }

            var msg = new Message();
            try
            {
                msg.Read(result.Buffer, 0, result.Buffer.Length);
            }
            catch (Exception e)
            {
                this.log.LogWarning("Received malformed message", e);
                this.MalformedMessage?.Invoke(this, result.Buffer);
                return; // eat the exception
            }

            if (msg.Opcode != MessageOperation.Query || msg.Status != MessageStatus.NoError)
            {
                return;
            }

            // Dispatch the message.
            try
            {
                if (msg.IsQuery && msg.Questions.Count > 0)
                {
                    this.QueryReceived?.Invoke(this,
                        new MessageEventArgs(msg, result.RemoteEndPoint));
                }
                else if (msg.IsResponse && msg.Answers.Count > 0)
                {
                    this.AnswerReceived?.Invoke(this,
                        new MessageEventArgs(msg, result.RemoteEndPoint));
                }
            }
            catch (Exception e)
            {
                this.log.LogError("Receive handler failed", e);
                // eat the exception
            }
        }

        public void Dispose()
        {
            this.Stop();
        }
    }

    /// <summary>
    ///   The event data for <see cref="ServiceDiscovery.ServiceInstanceDiscovered"/>.
    /// </summary>
    public class ServiceInstanceDiscoveryEventArgs : MessageEventArgs
    {
        /// <summary>
        ///   The fully qualified name of the service instance.
        /// </summary>
        /// <value>
        ///   Typically of the form "<i>instance</i>._<i>service</i>._tcp.local".
        /// </value>
        /// <seealso cref="ServiceProfile.FullyQualifiedName"/>
        public DomainName ServiceInstanceName { get; set; }

        public ServiceInstanceDiscoveryEventArgs(Message message, IPEndPoint? remoteEndPoint, DomainName serviceInstanceName) : base(message, remoteEndPoint)
        {
            this.ServiceInstanceName = serviceInstanceName;
        }
    }

    /// <summary>
    ///   The event data for <see cref="ServiceDiscovery.ServiceInstanceShutdown"/>.
    /// </summary>
    public class ServiceInstanceShutdownEventArgs : MessageEventArgs
    {
        /// <summary>
        ///   The fully qualified name of the service instance.
        /// </summary>
        /// <value>
        ///   Typically of the form "<i>instance</i>._<i>service</i>._tcp.local".
        /// </value>
        /// <seealso cref="ServiceProfile.FullyQualifiedName"/>
        public DomainName ServiceInstanceName { get; set; }

        public ServiceInstanceShutdownEventArgs(Message message, IPEndPoint? remoteEndPoint, DomainName serviceInstanceName) : base(message, remoteEndPoint)
        {
            this.ServiceInstanceName = serviceInstanceName;
        }
    }

    /// <summary>
    ///   Defines a specific service that can be discovered.
    /// </summary>
    /// <seealso cref="ServiceDiscovery.Advertise(ServiceProfile)"/>
    public class ServiceProfile
    {
        // Enforce multicast defaults, especially TTL.
        static ServiceProfile()
        {
            // Make sure MulticastService is inited.
            ReferenceEquals(null, null);
        }

        /// <summary>
        ///   Creates a new instance of the <see cref="ServiceProfile"/> class.
        /// </summary>
        /// <remarks>
        ///   All details must be filled in by the caller, especially the <see cref="Resources"/>.
        /// </remarks>
        public ServiceProfile()
        {
        }

        /// <summary>
        ///   Creates a new instance of the <see cref="ServiceProfile"/> class
        ///   with the specified details.
        /// </summary>
        /// <param name="instanceName">
        ///    A unique identifier for the specific service instance.
        /// </param>
        /// <param name="serviceName">
        ///   The <see cref="ServiceName">name</see> of the service.
        /// </param>
        /// <param name="port">
        ///   The TCP/UDP port of the service.
        /// </param>
        /// <param name="addresses">
        ///   The IP addresses of the specific service instance. If <b>null</b> then
        ///   <see cref="MulticastService.GetIPAddresses"/> is used.
        /// </param>
        /// <remarks>
        ///   The SRV, TXT and A/AAAA resoruce records are added to the <see cref="Resources"/>.
        /// </remarks>
        public ServiceProfile(DomainName instanceName, DomainName serviceName, ushort port,
            IEnumerable<IPAddress> addresses = null)
        {
            this.InstanceName = instanceName;
            this.ServiceName = serviceName;
            var fqn = this.FullyQualifiedName;

            var simpleServiceName = new DomainName(this.ServiceName.ToString()
                .Replace("._tcp", "")
                .Replace("._udp", "")
                .Trim('_')
                .Replace("_", "-"));
            this.HostName = DomainName.Join(this.InstanceName, simpleServiceName, this.Domain);
            this.Resources.Add(new SRVRecord
            {
                Name = fqn,
                Port = port,
                Target = this.HostName
            });
            this.Resources.Add(new TXTRecord
            {
                Name = fqn,
                Strings = {"txtvers=1"}
            });

            foreach (var address in addresses ?? MulticastService.GetLinkLocalAddresses())
            {
                this.Resources.Add(AddressRecord.Create(this.HostName, address));
            }
        }

        /// <summary>
        ///   The top level domain (TLD) name of the service.
        /// </summary>
        /// <value>
        ///   Always "local".
        /// </value>
        public DomainName Domain { get; } = "local";

        /// <summary>
        ///   A unique name for the service.
        /// </summary>
        /// <value>
        ///   Typically of the form "_<i>service</i>._tcp".
        /// </value>
        /// <remarks>
        ///   It consists of a pair of DNS labels, following the
        ///   <see href="https://www.ietf.org/rfc/rfc2782.txt">SRV records</see> convention.
        ///   The first label of the pair is an underscore character (_) followed by
        ///   the <see href="https://tools.ietf.org/html/rfc6335">service name</see>.
        ///   The second label is either "_tcp" (for application
        ///   protocols that run over TCP) or "_udp" (for all others).
        /// </remarks>
        public DomainName ServiceName { get; set; }

        /// <summary>
        ///   A unique identifier for the service instance.
        /// </summary>
        /// <value>
        ///   Some unique value.
        /// </value>
        public DomainName InstanceName { get; set; }

        /// <summary>
        ///   The service name and domain.
        /// </summary>
        /// <value>
        ///   Typically of the form "_<i>service</i>._tcp.local".
        /// </value>
        public DomainName QualifiedServiceName => DomainName.Join(this.ServiceName, this.Domain);

        /// <summary>
        ///   The fully qualified name of the instance's host.
        /// </summary>
        /// <remarks>
        ///   This can be used to query the address records (A and AAAA)
        ///   of the service instance.
        /// </remarks>
        public DomainName HostName { get; set; }

        /// <summary>
        ///   The instance name, service name and domain.
        /// </summary>
        /// <value>
        ///   <see cref="InstanceName"/>.<see cref="ServiceName"/>.<see cref="Domain"/>
        /// </value>
        public DomainName FullyQualifiedName =>
            DomainName.Join(this.InstanceName, this.ServiceName, this.Domain);

        /// <summary>
        ///   DNS resource records that are used to locate the service instance.
        /// </summary>
        /// <value>
        ///   More information about the service.
        /// </value>
        /// <remarks>
        ///   All records should have the <see cref="ResourceRecord.Name"/> equal
        ///   to the <see cref="FullyQualifiedName"/> or the <see cref="HostName"/>.
        ///   <para>
        ///   At a minimum the <see cref="SRVRecord"/> and <see cref="TXTRecord"/>
        ///   records must be present.
        ///   Typically <see cref="AddressRecord">address records</see>
        ///   are also present and are associated with <see cref="HostName"/>.
        ///   </para>
        /// </remarks>
        public List<ResourceRecord> Resources { get; set; } = new();

        /// <summary>
        ///   A list of service features implemented by the service instance.
        /// </summary>
        /// <value>
        ///   The default is an empty list.
        /// </value>
        /// <seealso href="https://tools.ietf.org/html/rfc6763#section-7.1"/>
        public List<string> Subtypes { get; set; } = new();

        /// <summary>
        ///   Add a property of the service to the <see cref="TXTRecord"/>.
        /// </summary>
        /// <param name="key">
        ///   The name of the property.
        /// </param>
        /// <param name="value">
        ///   The value of the property.
        /// </param>
        public void AddProperty(string key, string value)
        {
            var txt = this.Resources.OfType<TXTRecord>().FirstOrDefault();
            if (txt == null)
            {
                txt = new TXTRecord {Name = this.FullyQualifiedName};
                this.Resources.Add(txt);
            }

            txt.Strings.Add(key + "=" + value);
        }
    }

    public interface IServiceDiscovery : IDisposable
    {
        bool Debug { get; set; }

        /// <summary>
        ///   Add the additional records into the answers.
        /// </summary>
        /// <value>
        ///   Defaults to <b>false</b>.
        /// </value>
        /// <remarks>
        ///   Some malformed systems, such as js-ipfs and go-ipfs, only examine
        ///   the <see cref="Message.Answers"/> and not the <see cref="Message.AdditionalRecords"/>.
        ///   Setting this to <b>true</b>, will move the additional records
        ///   into the answers.
        ///   <para>
        ///   This never done for DNS-SD answers.
        ///   </para>
        /// </remarks>
        bool AnswersContainsAdditionalRecords { get; set; }

        /// <summary>
        ///   Gets the name server.
        /// </summary>
        /// <value>
        ///   Is used to answer questions.
        /// </value>
        NameServer NameServer { get; }

        /// <summary>
        ///   Raised when a DNS-SD response is received.
        /// </summary>
        /// <value>
        ///   Contains the service name.
        /// </value>
        /// <remarks>
        ///   <b>ServiceDiscovery</b> passively monitors the network for any answers
        ///   to a DNS-SD query. When an answer is received this event is raised.
        ///   <para>
        ///   Use <see cref="ServiceDiscovery.QueryAllServices"/> to initiate a DNS-SD question.
        ///   </para>
        /// </remarks>
        event EventHandler<DomainName> ServiceDiscovered;

        /// <summary>
        ///   Raised when a service instance is discovered.
        /// </summary>
        /// <value>
        ///   Contains the service instance name.
        /// </value>
        /// <remarks>
        ///   <b>ServiceDiscovery</b> passively monitors the network for any answers.
        ///   When an answer containing a PTR to a service instance is received
        ///   this event is raised.
        /// </remarks>
        event EventHandler<ServiceInstanceDiscoveryEventArgs> ServiceInstanceDiscovered;

        /// <summary>
        ///   Raised when a service instance is shutting down.
        /// </summary>
        /// <value>
        ///   Contains the service instance name.
        /// </value>
        /// <remarks>
        ///   <b>ServiceDiscovery</b> passively monitors the network for any answers.
        ///   When an answer containing a PTR to a service instance with a
        ///   TTL of zero is received this event is raised.
        /// </remarks>
        event EventHandler<ServiceInstanceShutdownEventArgs> ServiceInstanceShutdown;

        void Start();

        /// <summary>
        ///    Asks other MDNS services to send their service names.
        /// </summary>
        /// <remarks>
        ///   When an answer is received the <see cref="ServiceDiscovery.ServiceDiscovered"/> event is raised.
        /// </remarks>
        void QueryAllServices();

        /// <summary>
        ///    Asks other MDNS services to send their service names;
        ///    accepts unicast and/or broadcast answers.
        /// </summary>
        /// <remarks>
        ///   When an answer is received the <see cref="ServiceDiscovery.ServiceDiscovered"/> event is raised.
        /// </remarks>
        void QueryUnicastAllServices();

        /// <summary>
        ///   Asks instances of the specified service to send details.
        /// </summary>
        /// <param name="service">
        ///   The service name to query. Typically of the form "_<i>service</i>._tcp".
        /// </param>
        /// <remarks>
        ///   When an answer is received the <see cref="ServiceDiscovery.ServiceInstanceDiscovered"/> event is raised.
        /// </remarks>
        /// <seealso cref="ServiceProfile.ServiceName"/>
        void QueryServiceInstances(DomainName service);

        /// <summary>
        ///   Asks instances of the specified service with the subtype to send details.
        /// </summary>
        /// <param name="service">
        ///   The service name to query. Typically of the form "_<i>service</i>._tcp".
        /// </param>
        /// <param name="subtype">
        ///   The feature that is needed.
        /// </param>
        /// <remarks>
        ///   When an answer is received the <see cref="ServiceDiscovery.ServiceInstanceDiscovered"/> event is raised.
        /// </remarks>
        /// <seealso cref="ServiceProfile.ServiceName"/>
        void QueryServiceInstances(DomainName service, string subtype);

        /// <summary>
        ///   Asks instances of the specified service to send details.
        ///   accepts unicast and/or broadcast answers.
        /// </summary>
        /// <param name="service">
        ///   The service name to query. Typically of the form "_<i>service</i>._tcp".
        /// </param>
        /// <remarks>
        ///   When an answer is received the <see cref="ServiceDiscovery.ServiceInstanceDiscovered"/> event is raised.
        /// </remarks>
        /// <seealso cref="ServiceProfile.ServiceName"/>
        void QueryUnicastServiceInstances(DomainName service);

        /// <summary>
        ///   Advertise a service profile.
        /// </summary>
        /// <param name="service">
        ///   The service profile.
        /// </param>
        /// <remarks>
        ///   Any queries for the service or service instance will be answered with
        ///   information from the profile.
        ///   <para>
        ///   Besides adding the profile's resource records to the <see cref="Catalog"/> PTR records are
        ///   created to support DNS-SD and reverse address mapping (DNS address lookup).
        ///   </para>
        /// </remarks>
        void Advertise(ServiceProfile service);

        /// <summary>
        ///    Sends an unsolicited MDNS response describing the
        ///    service profile.
        /// </summary>
        /// <param name="profile">
        ///   The profile to describe.
        /// </param>
        /// <remarks>
        ///   Sends a MDNS response <see cref="Message"/> containing the pointer
        ///   and resource records of the <paramref name="profile"/>.
        ///   <para>
        ///   To provide increased robustness against packet loss,
        ///   two unsolicited responses are sent one second apart.
        ///   </para>
        /// </remarks>
        void Announce(ServiceProfile profile);

        /// <summary>
        /// Sends a goodbye message for the provided
        /// profile and removes its pointer from the name sever.
        /// </summary>
        /// <param name="profile">The profile to send a goodbye message for.</param>
        void UnAdvertise(ServiceProfile profile);

        /// <summary>
        /// Sends a goodbye message for each announced service.
        /// </summary>
        void UnAdvertise();
    }

    /// <summary>
    ///   DNS based Service Discovery is a way of using standard DNS programming interfaces, servers,
    ///   and packet formats to browse the network for services.
    /// </summary>
    /// <seealso href="https://tools.ietf.org/html/rfc6763">RFC 6763 DNS-Based Service Discovery</seealso>
    public sealed class ServiceDiscovery : IServiceDiscovery
    {
        private readonly ILogger<ServiceDiscovery> log;
        private static readonly DomainName LocalDomain = new("local");
        private static readonly DomainName SubName = new("_sub");

        /// <summary>
        ///   The service discovery service name.
        /// </summary>
        /// <value>
        ///   The service name used to enumerate other services.
        /// </value>
        public static readonly DomainName ServiceName = new("_services._dns-sd._udp.local");

        private readonly bool ownsMdns;
        private readonly List<ServiceProfile> profiles = new();

        /// <summary>
        ///   Creates a new instance of the <see cref="ServiceDiscovery"/> class.
        /// </summary>
        public ServiceDiscovery(
            ILoggerFactory loggerFactory,
            ILogger<ServiceDiscovery> logger)
            : this(new MulticastService(
                null,
                loggerFactory.CreateLogger<MulticastService>(),
                loggerFactory.CreateLogger<MulticastClient>()), logger)
        {
            this.ownsMdns = true;
        }

        /// <summary>
        ///   Creates a new instance of the <see cref="ServiceDiscovery"/> class with
        ///   the specified <see cref="MulticastService"/>.
        /// </summary>
        /// <param name="mdns">
        ///   The underlying <see cref="MulticastService"/> to use.
        /// </param>
        private ServiceDiscovery(
            MulticastService mdns,
            ILogger<ServiceDiscovery> logger)
        {
            this.log = logger;
            this.Mdns = mdns;
            mdns.QueryReceived += this.OnQuery;
            mdns.AnswerReceived += this.OnAnswer;
        }

        /// <summary>
        ///   Gets the multicasting service.
        /// </summary>
        /// <value>
        ///   Is used to send and receive multicast <see cref="Message">DNS messages</see>.
        /// </value>
        private MulticastService Mdns { get; set; }

        public bool Debug { get; set; }

        /// <summary>
        ///   Add the additional records into the answers.
        /// </summary>
        /// <value>
        ///   Defaults to <b>false</b>.
        /// </value>
        /// <remarks>
        ///   Some malformed systems, such as js-ipfs and go-ipfs, only examine
        ///   the <see cref="Message.Answers"/> and not the <see cref="Message.AdditionalRecords"/>.
        ///   Setting this to <b>true</b>, will move the additional records
        ///   into the answers.
        ///   <para>
        ///   This never done for DNS-SD answers.
        ///   </para>
        /// </remarks>
        public bool AnswersContainsAdditionalRecords { get; set; }

        /// <summary>
        ///   Gets the name server.
        /// </summary>
        /// <value>
        ///   Is used to answer questions.
        /// </value>
        public NameServer NameServer { get; } = new()
        {
            Catalog = new Catalog(),
            AnswerAllQuestions = true
        };

        /// <summary>
        ///   Raised when a DNS-SD response is received.
        /// </summary>
        /// <value>
        ///   Contains the service name.
        /// </value>
        /// <remarks>
        ///   <b>ServiceDiscovery</b> passively monitors the network for any answers
        ///   to a DNS-SD query. When an answer is received this event is raised.
        ///   <para>
        ///   Use <see cref="QueryAllServices"/> to initiate a DNS-SD question.
        ///   </para>
        /// </remarks>
        public event EventHandler<DomainName> ServiceDiscovered;

        /// <summary>
        ///   Raised when a service instance is discovered.
        /// </summary>
        /// <value>
        ///   Contains the service instance name.
        /// </value>
        /// <remarks>
        ///   <b>ServiceDiscovery</b> passively monitors the network for any answers.
        ///   When an answer containing a PTR to a service instance is received
        ///   this event is raised.
        /// </remarks>
        public event EventHandler<ServiceInstanceDiscoveryEventArgs> ServiceInstanceDiscovered;

        /// <summary>
        ///   Raised when a service instance is shutting down.
        /// </summary>
        /// <value>
        ///   Contains the service instance name.
        /// </value>
        /// <remarks>
        ///   <b>ServiceDiscovery</b> passively monitors the network for any answers.
        ///   When an answer containing a PTR to a service instance with a
        ///   TTL of zero is received this event is raised.
        /// </remarks>
        public event EventHandler<ServiceInstanceShutdownEventArgs> ServiceInstanceShutdown;

        public void Start()
        {
            this.Mdns.Start();
        }

        /// <summary>
        ///    Asks other MDNS services to send their service names.
        /// </summary>
        /// <remarks>
        ///   When an answer is received the <see cref="ServiceDiscovered"/> event is raised.
        /// </remarks>
        public void QueryAllServices()
        {
            this.Mdns.SendQuery(ServiceName, type: DnsType.PTR);
        }

        /// <summary>
        ///    Asks other MDNS services to send their service names;
        ///    accepts unicast and/or broadcast answers.
        /// </summary>
        /// <remarks>
        ///   When an answer is received the <see cref="ServiceDiscovered"/> event is raised.
        /// </remarks>
        public void QueryUnicastAllServices()
        {
            this.Mdns.SendUnicastQuery(ServiceName, type: DnsType.PTR);
        }

        /// <summary>
        ///   Asks instances of the specified service to send details.
        /// </summary>
        /// <param name="service">
        ///   The service name to query. Typically of the form "_<i>service</i>._tcp".
        /// </param>
        /// <remarks>
        ///   When an answer is received the <see cref="ServiceInstanceDiscovered"/> event is raised.
        /// </remarks>
        /// <seealso cref="ServiceProfile.ServiceName"/>
        public void QueryServiceInstances(DomainName service)
        {
            this.Mdns.SendQuery(DomainName.Join(service, LocalDomain), type: DnsType.PTR);
        }

        /// <summary>
        ///   Asks instances of the specified service with the subtype to send details.
        /// </summary>
        /// <param name="service">
        ///   The service name to query. Typically of the form "_<i>service</i>._tcp".
        /// </param>
        /// <param name="subtype">
        ///   The feature that is needed.
        /// </param>
        /// <remarks>
        ///   When an answer is received the <see cref="ServiceInstanceDiscovered"/> event is raised.
        /// </remarks>
        /// <seealso cref="ServiceProfile.ServiceName"/>
        public void QueryServiceInstances(DomainName service, string subtype)
        {
            var name = DomainName.Join(
                new DomainName(subtype),
                SubName,
                service,
                LocalDomain);
            this.Mdns.SendQuery(name, type: DnsType.PTR);
        }

        /// <summary>
        ///   Asks instances of the specified service to send details.
        ///   accepts unicast and/or broadcast answers.
        /// </summary>
        /// <param name="service">
        ///   The service name to query. Typically of the form "_<i>service</i>._tcp".
        /// </param>
        /// <remarks>
        ///   When an answer is received the <see cref="ServiceInstanceDiscovered"/> event is raised.
        /// </remarks>
        /// <seealso cref="ServiceProfile.ServiceName"/>
        public void QueryUnicastServiceInstances(DomainName service)
        {
            this.Mdns.SendUnicastQuery(DomainName.Join(service, LocalDomain), type: DnsType.PTR);
        }

        /// <summary>
        ///   Advertise a service profile.
        /// </summary>
        /// <param name="service">
        ///   The service profile.
        /// </param>
        /// <remarks>
        ///   Any queries for the service or service instance will be answered with
        ///   information from the profile.
        ///   <para>
        ///   Besides adding the profile's resource records to the <see cref="Catalog"/> PTR records are
        ///   created to support DNS-SD and reverse address mapping (DNS address lookup).
        ///   </para>
        /// </remarks>
        public void Advertise(ServiceProfile service)
        {
            this.profiles.Add(service);

            var catalog = this.NameServer.Catalog;
            catalog.Add(
                new PTRRecord {Name = ServiceName, DomainName = service.QualifiedServiceName},
                authoritative: true);
            catalog.Add(
                new PTRRecord {Name = service.QualifiedServiceName, DomainName = service.FullyQualifiedName},
                authoritative: true);

            foreach (var subtype in service.Subtypes)
            {
                var ptr = new PTRRecord
                {
                    Name = DomainName.Join(
                        new DomainName(subtype),
                        SubName,
                        service.QualifiedServiceName),
                    DomainName = service.FullyQualifiedName
                };
                catalog.Add(ptr, authoritative: true);
            }

            foreach (var r in service.Resources)
            {
                catalog.Add(r, authoritative: true);
            }

            catalog.IncludeReverseLookupRecords();
        }

        /// <summary>
        ///    Sends an unsolicited MDNS response describing the
        ///    service profile.
        /// </summary>
        /// <param name="profile">
        ///   The profile to describe.
        /// </param>
        /// <remarks>
        ///   Sends a MDNS response <see cref="Message"/> containing the pointer
        ///   and resource records of the <paramref name="profile"/>.
        ///   <para>
        ///   To provide increased robustness against packet loss,
        ///   two unsolicited responses are sent one second apart.
        ///   </para>
        /// </remarks>
        public void Announce(ServiceProfile profile)
        {
            var message = new Message {QR = true};

            // Add the shared records.
            var ptrRecord = new PTRRecord
                {Name = profile.QualifiedServiceName, DomainName = profile.FullyQualifiedName};
            message.Answers.Add(ptrRecord);

            // Add the resource records.
            profile.Resources.ForEach((resource) => { message.Answers.Add(resource); });

            this.Mdns.SendAnswer(message, checkDuplicate: false);
            Task.Delay(1000).Wait();
            this.Mdns.SendAnswer(message, checkDuplicate: false);
        }

        /// <summary>
        /// Sends a goodbye message for the provided
        /// profile and removes its pointer from the name sever.
        /// </summary>
        /// <param name="profile">The profile to send a goodbye message for.</param>
        public void UnAdvertise(ServiceProfile profile)
        {
            var message = new Message {QR = true};
            var ptrRecord = new PTRRecord
            {
                Name = profile.QualifiedServiceName,
                DomainName = profile.FullyQualifiedName,
                TTL = TimeSpan.Zero
            };

            message.Answers.Add(ptrRecord);
            profile.Resources.ForEach((resource) =>
            {
                resource.TTL = TimeSpan.Zero;
                message.AdditionalRecords.Add(resource);
            });

            this.Mdns.SendAnswer(message);

            this.NameServer.Catalog.TryRemove(profile.QualifiedServiceName, out Node _);
        }

        /// <summary>
        /// Sends a goodbye message for each announced service.
        /// </summary>
        public void UnAdvertise()
        {
            this.profiles.ForEach(this.UnAdvertise);
        }

        private void OnAnswer(object? sender, MessageEventArgs e)
        {
            var msg = e.Message;

            if (this.Debug)
            {
                this.log.LogDebug($"Answer from {e.RemoteEndPoint}");
                this.log.LogTrace("Got answer: {@Msg}", msg);
            }

            // Any DNS-SD answers?

            var sd = msg.Answers
                .OfType<PTRRecord>()
                .Where(ptr => ptr.Name.IsSubdomainOf(LocalDomain));
            foreach (var ptr in sd)
            {
                if (ptr.Name == ServiceName)
                {
                    this.ServiceDiscovered?.Invoke(this, ptr.DomainName);
                }
                else if (ptr.TTL == TimeSpan.Zero)
                {
                    var args = new ServiceInstanceShutdownEventArgs(msg, null, ptr.DomainName);
                    this.ServiceInstanceShutdown?.Invoke(this, args);
                }
                else
                {
                    var args = new ServiceInstanceDiscoveryEventArgs(msg, null, ptr.DomainName);
                    this.ServiceInstanceDiscovered?.Invoke(this, args);
                }
            }
        }

        private void OnQuery(object? sender, MessageEventArgs e)
        {
            var request = e.Message;

            if (this.Debug)
            {
                this.log.LogDebug($"Query from {e.RemoteEndPoint}");
                this.log.LogTrace("Got query: {@Request}", request);
            }

            // Determine if this query is requesting a unicast response
            // and normalize the Class.
            var QU = false; // unicast query response?
            foreach (var r in request.Questions)
            {
                if (((ushort) r.Class & 0x8000) != 0)
                {
                    QU = true;
                    r.Class = (DnsClass) ((ushort) r.Class & 0x7fff);
                }
            }

            var response = this.NameServer.ResolveAsync(request).Result;

            if (response.Status != MessageStatus.NoError)
            {
                return;
            }

            // Many bonjour browsers don't like DNS-SD response
            // with additional records.
            if (response.Answers.Any(a => a.Name == ServiceName))
            {
                response.AdditionalRecords.Clear();
            }

            if (this.AnswersContainsAdditionalRecords)
            {
                response.Answers.AddRange(response.AdditionalRecords);
                response.AdditionalRecords.Clear();
            }

            if (response.Answers.All(a => a.Name != ServiceName))
            {
                ;
            }

            if (QU)
            {
                // TODO: Send a Unicast response if required.
                this.Mdns.SendAnswer(response, e);
            }
            else
            {
                this.Mdns.SendAnswer(response, e);
            }

            if (this.Debug)
            {
                this.log.LogDebug($"Sending answer");
                this.log.LogTrace("Sending answer: {@Response}", response);
                this.log.LogTrace($"Response time {(DateTime.Now - request.CreationTime).TotalMilliseconds}ms");
            }
        }

        public void Dispose()
        {
            this.Mdns.QueryReceived -= this.OnQuery;
            this.Mdns.AnswerReceived -= this.OnAnswer;
            if (this.ownsMdns)
            {
                this.Mdns.Dispose();
            }
        }
    }
}
