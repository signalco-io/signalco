using System.Threading;
using System.Threading.Tasks;

namespace Signal.Beacon.Core.Signal;

public interface ISignalVoiceClient
{
    Task<byte[]> GetTextAudioAsync(string text, CancellationToken cancellationToken);
}