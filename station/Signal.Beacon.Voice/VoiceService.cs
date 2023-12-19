using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Threading;
using System.Threading.Tasks;
using Google.Cloud.Speech.V1;
using Google.Protobuf;
using Microsoft.Extensions.Logging;
using OpenTK.Audio.OpenAL;
using Pv;
using Signal.Beacon.Core.Architecture;
using Signal.Beacon.Core.Conducts;
using Signal.Beacon.Core.Workers;

namespace Signal.Beacon.Voice;

public class SpeechResultEvaluator
{
    private readonly ICommandHandler<ConductPublishCommand> publishConduct;
    private readonly ILogger<SpeechResultEvaluator> logger;


    public SpeechResultEvaluator(
        ICommandHandler<ConductPublishCommand> publishConduct,
        ILogger<SpeechResultEvaluator> logger)
    {
        this.publishConduct = publishConduct ?? throw new ArgumentNullException(nameof(publishConduct));
        this.logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }


    public Task EvaluateResultAsync(SpeechResult result, CancellationToken cancellationToken)
    {
        // TODO: Implement
        return Task.CompletedTask;
        //// Check confidence
        //if (result.Confidence < 0.75)
        //{
        //    this.logger.LogTrace("Confidence too low for result: {@Result}", result);
        //    return;
        //}

        //// Remove language specific characters
        //var decomposed = result.Transcript.Normalize(NormalizationForm.FormD);
        //var filtered = decomposed.Where(c => char.GetUnicodeCategory(c) != UnicodeCategory.NonSpacingMark);
        //var transcriptFiltered = new string(filtered.ToArray());

        //// TODO: Load language dictionary
        //var nonCategorizedWords = new List<string>();
        //var questionWords = new List<string> { "koliko", "zasto", "kako", "da li", "je li", "hoce li" };
        //var actionPositive = new List<string> { "ukljuci", "upali", "aktiviraj" };
        //var actionNegative = new List<string> { "iskljuci", "ugasi", "deaktiviraj" };
        //// TODO: Load device localized tags
        //var entityType = new List<string>
        //{

        //};
        //// TODO: Load areas localized
        //var areas = new List<string> {  };

        //var tokens = nonCategorizedWords
        //    .Union(questionWords)
        //    .Union(actionPositive)
        //    .Union(actionNegative)
        //    .Union(entityType)
        //    .Union(areas)
        //    .ToList();

        //var tokenized = this.Tokenize(transcriptFiltered, tokens).ToList();

        //var devices = (await this.devicesDao.GetAllAsync(cancellationToken)).ToList();
        //var deviceNames = devices.Select(d => d.Alias).ToList();

        //var matches = FuzzySharp.Process
        //    .ExtractTop(
        //        result.Transcript,
        //        deviceNames)
        //    .ToList();

        //var matchedDevice = devices[matches[0].Index];
    }

    private IEnumerable<string> Tokenize(string query, List<string> tokens)
    {
        var maxWords = tokens.Max(t => t.Count(tc => tc == ' ') + 1);

        var words = query
            .Split(new[] { " ", "-", ",", "!", "?", ";", ":" }, StringSplitOptions.RemoveEmptyEntries)
            .ToList();

        // Go through all words
        for (int i = 0; i < words.Count; i++)
        {
            // Match longest word-chain first
            for (int size = maxWords - 1; size >= 0; size--)
            {
                // Check out of bounds
                if (i + size < words.Count)
                {
                    // Construct word-chain
                    var wordChain = string.Join(" ", words.Skip(i).Take(size + 1));

                    // Try matching with tokens
                    var wordChainScore = FuzzySharp.Process.ExtractOne(wordChain, tokens, cutoff: 90);
                    if (wordChainScore is { Index: >= 0 })
                    {
                        yield return wordChain;
                        i += Math.Max(0, size - 1);
                        break;
                    }
                }
            }
        }
    }
}

public class SpeechScene
{
    public string Name { get; init; }

    public Dictionary<string, float> HotWords { get; } = new();
}

public record SpeechResult(string Transcript, double Confidence);

public record SpeechResults(IEnumerable<SpeechResult> Results);

public class GoogleSttClient
{
    private readonly GetNextFrameByteDelegate nextFrame;
    private readonly ILogger<GoogleSttClient> logger;
    private SpeechClient? client;
    private SpeechClient.StreamingRecognizeStream? recognitionStream;
    private StreamingRecognitionConfig? streamConfig;

    public GoogleSttClient(GetNextFrameByteDelegate nextFrame, ILogger<GoogleSttClient> logger)
    {
        this.nextFrame = nextFrame ?? throw new ArgumentNullException(nameof(nextFrame));
        this.logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public void Initialize()
    {
        // Create stream config
        if (this.streamConfig == null) { 
            this.streamConfig = new StreamingRecognitionConfig
            {
                Config = new RecognitionConfig
                {
                    Encoding = RecognitionConfig.Types.AudioEncoding.Linear16,
                    LanguageCode = "hr-HR",
                    SampleRateHertz = 16000,
                    EnableAutomaticPunctuation = true
                }
            };
        }

        // Create client
        if (this.client == null)
            this.client = SpeechClient.Create();
    }

    public async Task<SpeechResults?> ProcessAsync(CancellationToken cancellationToken)
    {
        var processCts = new CancellationTokenSource();

        try 
        { 
            // Begin streaming
            if (this.client == null ||
                this.streamConfig == null)
                throw new Exception("Initialize client before requesting processing.");
            this.recognitionStream = this.client.StreamingRecognize();
            await this.recognitionStream.WriteAsync(new StreamingRecognizeRequest
            {
                StreamingConfig = this.streamConfig
            });

            // Writing and reading thread
            var writingTask = Task.Run(() => this.WritingThreadAsync(processCts.Token), cancellationToken);

            var results = new List<SpeechResult>();
            await foreach (var result in this.ReadingThread()) 
            { 
                results.Add(result);
                break;
            }

            // Stop writing
            processCts.Cancel();
            await writingTask;

            return new SpeechResults(results);
        }
        catch(Exception ex)
        {
            this.logger.LogWarning(ex, "Failed to process speech.");
        }
        finally
        {
            if (!processCts.IsCancellationRequested)
                processCts.Cancel();
        }

        return null;
    }

    private async Task WritingThreadAsync(CancellationToken cancellationToken)
    {
        try
        {
            byte[] buffer = new byte[1024];
            while (!cancellationToken.IsCancellationRequested)
            {
                if (this.nextFrame(512, ref buffer))
                {
                    // Send audio data
                    await this.SendFrameAsync(buffer);
                }

                // Wait a bit for next frame
                Thread.Sleep(20);
            }
        }
        catch (Exception ex)
        {
            this.logger.LogWarning(ex, "Streaming audio from input device failed.");
            throw;
        }
    }

    private async IAsyncEnumerable<SpeechResult> ReadingThread()
    {
        if (this.recognitionStream == null) 
            throw new Exception("Initialize regognition stream before starting reading thread");

        // Read responses
        await foreach (var response in this.recognitionStream.GetResponseStream())
        {
            this.logger.LogTrace("Response {@Response}", response);

            if (response.Error != null)
            {
                this.HandleResponseError();
                break;
            }

            var finalResponse = response.Results.FirstOrDefault(r => r.IsFinal);
            if (finalResponse != null)
            {
                foreach (var alternative in finalResponse.Alternatives)
                    yield return new SpeechResult(alternative.Transcript, alternative.Confidence);
            }                    
        }
    }

    private void HandleResponseError()
    {
        throw new NotImplementedException();
    }

    private async Task CompleteAsync()
    {
        if (this.recognitionStream == null) 
            return;

        await this.recognitionStream.TryWriteCompleteAsync();
    }

    private async Task SendFrameAsync(byte[] audioData)
    {
        // Ignore if stream not started
        if (this.recognitionStream == null) 
            return;

        await this.recognitionStream.TryWriteAsync(new StreamingRecognizeRequest
        {
            AudioContent = ByteString.CopyFrom(audioData)
        });
    }
}

public delegate bool GetNextFrameByteDelegate(int frameLength, ref byte[] buffer);

public delegate bool GetNextFrameShortDelegate(int frameLength, ref short[] buffer);

public class PorcupineWakeWordClient : IDisposable
{
    private readonly GetNextFrameShortDelegate nextFrame;
    private readonly ILogger<PorcupineWakeWordClient> logger;

    private Porcupine? porcupine;
    private short[]? porcupineRecordingBuffer;
    private const float PorcupineSensitivity = 0.7f;
    private const string PorcupineModelFilePath = @"lib\common\porcupine_params.pv";

    public PorcupineWakeWordClient(
        GetNextFrameShortDelegate nextFrame,
        ILogger<PorcupineWakeWordClient> logger)
    {
        this.nextFrame = nextFrame ?? throw new ArgumentNullException(nameof(nextFrame));
        this.logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    // TODO: Deduplicate (original in VoiceService)
    private static string ExecutingLocation()
    {
        var executingLocation = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location);
        if (executingLocation == null)
            throw new Exception("Couldn't determine application executing location.");
        return executingLocation;
    }

    public void InitializePorcupine()
    {
        var executionLocation = ExecutingLocation();
        var porcupineVersion = typeof(Porcupine).Assembly.GetName().Version;
        if (porcupineVersion == null)
            throw new Exception("Couldn't determine Porcupine version.");

        // Locate profile file
        this.porcupine = Porcupine.FromBuiltInKeywords(
            Path.Combine(executionLocation, PorcupineModelFilePath),
            new [] {BuiltInKeyword.COMPUTER},
            Path.Combine(executionLocation, "Profiles"),
            new[] { PorcupineSensitivity });
        this.porcupineRecordingBuffer = new short[this.porcupine.FrameLength];
    }

    public void WaitForWakeWord(CancellationToken cancellationToken)
    {
        if (this.porcupine == null)
            throw new NullReferenceException("Porcupine is null. Initialize first.");
        if (this.porcupineRecordingBuffer == null)
            throw new NullReferenceException("PorcupineRecordingBuffer is null. Initialize first.");

        while (!cancellationToken.IsCancellationRequested)
        {
            if (this.nextFrame(this.porcupine.FrameLength, ref this.porcupineRecordingBuffer))
            {
                if (this.porcupine.Process(this.porcupineRecordingBuffer) >= 0)
                    return;
            }

            Thread.Sleep(20);
        }
    }

    public void Dispose()
    {
        this.porcupine?.Dispose();
    }
}

public class VoiceService : IWorkerService, IDisposable
{
    private readonly ILogger<VoiceService> logger;

    private readonly PorcupineWakeWordClient wakeWord;
    private readonly GoogleSttClient stt;

    private readonly List<SpeechScene> speechScenes = new();
    private ALCaptureDevice? captureDevice;

    private readonly List<AlSound> sounds = new();
    private ALContext? alContext;
    private int? alSource;

    private readonly SpeechResultEvaluator evaluator;


    public VoiceService(
        SpeechResultEvaluator speechResultEvaluator,
        ILogger<VoiceService> logger, 
        ILoggerFactory loggerFactory)
    {
        this.evaluator = speechResultEvaluator ?? throw new ArgumentNullException(nameof(speechResultEvaluator));
        this.logger = logger ?? throw new ArgumentNullException(nameof(logger));

        this.wakeWord = new PorcupineWakeWordClient(
            this.GetNextFrame,
            loggerFactory.CreateLogger<PorcupineWakeWordClient>());
        this.stt = new GoogleSttClient(
            this.GetNextFrameByte,
            loggerFactory.CreateLogger<GoogleSttClient>());
    }

    private void RegisterSpeechScene(SpeechScene scene)
    {
        var existingScene = this.speechScenes.FirstOrDefault(ss => ss.Name == scene.Name);
        if (existingScene != null)
            this.speechScenes.Remove(existingScene);
                
        this.speechScenes.Add(scene);
    }

    private void SetSpeechScene(string name)
    {
        var scene = this.speechScenes.FirstOrDefault(ss => ss.Name == name);
        if (scene == null)
        {
            this.logger.LogWarning("Can't switch to scene {SceneName} - not registered", name);
            return;
        }

        // TODO: Set hot words

        this.logger.LogDebug("Speech scene {SceneName} set", name);
    }
        
    private static string ExecutingLocation()
    {
        var executingLocation = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location);
        if (executingLocation == null)
            throw new Exception("Couldn't determine application executing location.");
        return executingLocation;
    }

    private IEnumerable<string> GetAvailableCaptureDevices()
    {
        var devices = ALC.GetStringList(GetEnumerationStringList.CaptureDeviceSpecifier).ToList();
        this.AlHasError();

        return devices;
    }

    private void InitializeCaptureDevice(string deviceName, int maxFrameLength)
    {
        if (string.IsNullOrWhiteSpace(deviceName))
            throw new ArgumentException("Value cannot be null or whitespace.", nameof(deviceName));
        if (maxFrameLength <= 0) throw new ArgumentOutOfRangeException(nameof(maxFrameLength));

        this.captureDevice = ALC.CaptureOpenDevice(deviceName, 16000, ALFormat.Mono16, maxFrameLength * 3);
        this.AlHasError();
    }

    private void StartCaptureDevice()
    {
        if (this.captureDevice == null)
            throw new NullReferenceException("Capture device not initialized.");

        ALC.CaptureStart(this.captureDevice.Value);
        this.AlHasError();
    }

    private void StopCaptureDevice()
    {
        if (this.captureDevice == null) 
            return;

        ALC.CaptureStop(this.captureDevice.Value);
        this.AlHasError();
    }

    private void DisposeCaptureDevice()
    {
        this.logger.LogDebug("Disposing capture devices...");

        this.StopCaptureDevice();

        if (this.captureDevice == null) 
            return;

        ALC.CaptureCloseDevice(this.captureDevice.Value);
        this.AlHasError();

        this.captureDevice = null;
    }

    private bool GetNextFrameByte(int frameLength, ref byte[] buffer)
    {
        if (this.captureDevice == null)
            throw new NullReferenceException("Capture device not initialized.");
        if (frameLength <= 0) throw new ArgumentOutOfRangeException(nameof(frameLength));

        var samples = ALC.GetInteger(this.captureDevice.Value, AlcGetInteger.CaptureSamples);
        if (samples < frameLength)
            return false;

        if (buffer == null) throw new ArgumentNullException(nameof(buffer));
        if (buffer.Length < frameLength)
            throw new ArgumentOutOfRangeException(nameof(buffer), "Buffer smaller than frame length.");

        ALC.CaptureSamples(this.captureDevice.Value, ref buffer[0], frameLength);
        this.AlHasError();
        return true;
    }

    private bool GetNextFrame(int frameLength, ref short[] buffer)
    {
        if (this.captureDevice == null)
            throw new NullReferenceException("Capture device not initialized.");
        if (frameLength <= 0) throw new ArgumentOutOfRangeException(nameof(frameLength));

        var samples = ALC.GetInteger(this.captureDevice.Value, AlcGetInteger.CaptureSamples);
        if (samples < frameLength)
            return false;

        if (buffer == null) throw new ArgumentNullException(nameof(buffer));
        if (buffer.Length < frameLength)
            throw new ArgumentOutOfRangeException(nameof(buffer), "Buffer smaller than frame length.");

        ALC.CaptureSamples(this.captureDevice.Value, ref buffer[0], frameLength);
        this.AlHasError();
        return true;
    }
        
    // Loads a wave/riff audio file.
    public static byte[] LoadWave(Stream stream, out int channels, out int bits, out int rate)
    {
        if (stream == null)
            throw new ArgumentNullException(nameof(stream));

        using BinaryReader reader = new(stream);

        // RIFF header
        string signature = new(reader.ReadChars(4));
        if (signature != "RIFF")
            throw new NotSupportedException("Specified stream is not a wave file.");

        _ = reader.ReadInt32();      //riff_chunk_size

        string format = new(reader.ReadChars(4));
        if (format != "WAVE")
            throw new NotSupportedException("Specified stream is not a wave file.");

        // WAVE header
        string formatSignature = new(reader.ReadChars(4));
        if (formatSignature != "fmt ")
            throw new NotSupportedException("Specified wave file is not supported.");

        _ = reader.ReadInt32();                     // format_chunk_size
        _ = reader.ReadInt16();                     // audio_format
        int numChannels = reader.ReadInt16();      // num_channels
        var sampleRate = reader.ReadInt32();       // sample_rate
        _ = reader.ReadInt32();                     // byte_rate
        _ = reader.ReadInt16();                     // block_align
        int bitsPerSample = reader.ReadInt16();   // bits_per_sample

        while (reader.PeekChar() == '\0')
        {
            // Ignore
            reader.ReadChar();
        }

        string dataSignature = new(reader.ReadChars(4));
        if (dataSignature != "data")
            throw new NotSupportedException("Specified wave file is not supported.");

        var dataLength = reader.ReadInt32();

        channels = numChannels;
        bits = bitsPerSample;
        rate = sampleRate;

        return reader.ReadBytes(dataLength);
    }

    public static ALFormat GetSoundFormat(int channels, int bits)
    {
        return channels switch
        {
            1 => bits == 8 ? ALFormat.Mono8 : ALFormat.Mono16,
            2 => bits == 8 ? ALFormat.Stereo8 : ALFormat.Stereo16,
            _ => throw new NotSupportedException("The specified sound format is not supported.")
        };
    }

        
    public Task StartAsync(string entityId, CancellationToken cancellationToken)
    {
        _ = Task.Run(async () =>
        {
            try
            {
                this.wakeWord.InitializePorcupine();
                this.stt.Initialize();
                this.InitializeSounds();

                await this.PlaySoundAsync("Hello.");

                var captureDeviceNames = this.GetAvailableCaptureDevices();
                var captureDeviceName = captureDeviceNames
                    .OrderByDescending(d => d.Contains("BT", StringComparison.InvariantCultureIgnoreCase))
                    .FirstOrDefault();
                if (captureDeviceName == null)
                    throw new Exception("No capture devices available");

                this.logger.LogDebug("Using input device: {InputDeviceName}", captureDeviceName);

                this.InitializeCaptureDevice(captureDeviceName, 1600);
                this.StartCaptureDevice();

                while (!cancellationToken.IsCancellationRequested)
                {
                    this.wakeWord.WaitForWakeWord(cancellationToken);
                    if (cancellationToken.IsCancellationRequested)
                        break;

                    _ = this.PlaySoundAsync("wake");
                    //var result = this.ProcessDeepSpeech(cancellationToken);
                    //var result = string.Empty;
                    var results = await this.stt.ProcessAsync(cancellationToken);

                    if (results == null || !results.Results.Any()) 
                    { 
                        _ = this.PlaySoundAsync("error");
                    }
                    else
                    {
                        foreach(var result in results.Results.OrderBy(r => r.Confidence))
                        {
                            if (await this.TryProcessResultAsync(result, cancellationToken))
                                break;
                        }

                        _ = this.PlaySoundAsync("error");
                    }
                }
            }
            catch (Exception ex)
            {
                this.logger.LogError(ex, "Worker failed.");
            }
        }, cancellationToken);

        return Task.CompletedTask;
    }

    private async Task<bool> TryProcessResultAsync(SpeechResult result, CancellationToken cancellationToken)
    {
        this.logger.LogTrace("Processing result: {@Result}", result);

        await this.evaluator.EvaluateResultAsync(result, cancellationToken);

        return false;
    }

    public Task StopAsync()
    {
        return Task.CompletedTask;
    }

    private void InitializeSounds()
    {
        try
        {
            var device = ALC.OpenDevice(null);
            this.AlHasError();
            this.alContext = ALC.CreateContext(device, new ALContextAttributes());
            this.AlHasError();

            // Set context
            ALC.MakeContextCurrent(this.alContext.Value);
            this.AlHasError();

            // Generate source
            this.alSource = AL.GenSource();
            this.AlHasError();
        }
        catch (DllNotFoundException ex) when (ex.Message.Contains("Could not load the dll 'openal32.dll'"))
        {
            this.logger.LogError(
                "Looks like OpenAL is not installed on this system. You can download it from https://www.openal.org/downloads/ or see more info on installing it there.");
        }
    }

    private Task TryCacheSoundAsync(string text)
    {
        throw new NotImplementedException();

        try
        {
            throw new NotImplementedException();
        }
        catch (Exception ex)
        {
            this.logger.LogWarning(ex, "Failed to cache sound for {Text}", text);
        }
    }

    private AlSound? LoadCachedSound(string text)
    {
        var executionLocation = ExecutingLocation();
        var soundPath = Path.Combine(executionLocation, "Sounds", "voice_" + text + ".wav");

        if (!File.Exists(soundPath))
            return null;

        var sound = this.WavToAudioSource("wake", soundPath);
        this.sounds.Add(sound);
        return sound;
    }

    private void DisposeSounds()
    {
        this.logger.LogDebug("Disposing sounds...");

        foreach (var alSound in this.sounds)
        {
            AL.DeleteBuffer(alSound.Buffer);
            this.AlHasError();
        }

        this.sounds.Clear();

        if (this.alSource != null)
        {
            AL.DeleteSource(this.alSource.Value);
            this.alSource = null;
            this.AlHasError();
        }

        if (this.alContext != null)
        {
            var device = ALC.GetContextsDevice(this.alContext.Value);
            ALC.SuspendContext(this.alContext.Value);
            ALC.DestroyContext(this.alContext.Value);
            if (!ALC.CloseDevice(device))
            {
                this.logger.LogDebug("AL failed to close device. Error code in next log entry.");
                this.AlHasError();
            }

            this.alContext = null;
        }
    }

    private async Task PlaySoundAsync(string name)
    {
        if (this.alContext == null)
        {
            this.logger.LogWarning("Can't play sound because context is null.");
            return;
        }

        if (this.alSource == null)
        {
            this.logger.LogWarning("Can't play sound because source is null");
            return;
        }

        try
        {
            var nameCleared = name.Trim().ToLowerInvariant();
            var sound = this.sounds.FirstOrDefault(s => s.Name == nameCleared);
            if (sound == null)
            {
                // Try load cached sound
                sound = this.LoadCachedSound(nameCleared);
                if (sound == null)
                {
                    await this.TryCacheSoundAsync(name);
                    sound = this.LoadCachedSound(nameCleared);
                    if (sound == null)
                    {
                        throw new Exception("Sound not found \"" + name + "\". Unable to generate cache.");
                    }
                }
            }

            await this.WaitSourceToStop();

            ALC.MakeContextCurrent(this.alContext.Value);
            this.AlHasError();

            AL.Source(this.alSource.Value, ALSourcei.Buffer, sound.Buffer);
            this.AlHasError();

            AL.SourcePlay(this.alSource.Value);
            this.AlHasError();

            await this.WaitSourceToStop();
        }
        catch (Exception ex)
        {
            this.logger.LogWarning(ex, "Failed to play sound.");
        }
    }

    private Task WaitSourceToStop()
    {
        if (!this.alSource.HasValue)
        {
            this.logger.LogWarning("Can't play sound because source is null");
            return Task.CompletedTask;
        }

        return Task.Run<Task>(async () =>
        {
            ALSourceState state;
            do
            {
                AL.GetSource(this.alSource.Value, ALGetSourcei.SourceState, out var rawState);
                if (this.AlHasError()) break;

                state = (ALSourceState) rawState;

                await Task.Delay(10);
            } while (state == ALSourceState.Playing);
        });
    }

    private bool AlHasError()
    {
        var errorCode = AL.GetError();
        if (errorCode == ALError.NoError)
            return false;

#if DEBUG
        if (Debugger.IsAttached)
            Debugger.Break();
#endif

        this.logger.LogDebug("AL error: {Error} ({ErrorCode})", AL.GetErrorString(errorCode), errorCode);
        return true;
    }

    private AlSound WavToAudioSource(string name, string wavPath)
    {
        var buffer = AL.GenBuffer();
        this.AlHasError();
            
        byte[] soundData = LoadWave(
            File.Open(wavPath, FileMode.Open),
            out var channels, out var bitsPerSample, out var sampleRate);

        AL.BufferData(buffer, GetSoundFormat(channels, bitsPerSample), soundData, sampleRate);
        this.AlHasError();

        return new AlSound
        {
            Name = name,
            Buffer = buffer
        };
    }

    private class AlSound
    {
        public string Name { get; init; }

        public int Buffer { get; init; }
    }

    public void Dispose()
    {
        var sw = Stopwatch.StartNew();
        this.logger.LogDebug("Disposing Voice service...");

        this.DisposePorcupine();
        this.DisposeCaptureDevice();
        this.DisposeSounds();
            
        sw.Stop();
        this.logger.LogDebug("Voice service disposed in {Elapsed}", sw.Elapsed);
    }

    private void DisposePorcupine()
    {
        this.logger.LogDebug("Disposing Porcupine...");

        this.wakeWord?.Dispose();
    }
}