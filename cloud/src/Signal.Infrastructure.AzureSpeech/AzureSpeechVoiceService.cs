using System.Threading;
using System.Threading.Tasks;
using Signal.Core.Voice;

namespace Signal.Infrastructure.AzureSpeech;

internal class AzureSpeechVoiceService(IVoiceSynthesizer voiceSynthesizer) : IVoiceService
{
    public async Task<byte[]> TextToAudioAsync(string text, CancellationToken cancellationToken = default)
    {
        // TODO: Cache text audio to reduce Azure usage

        return await voiceSynthesizer.TextToAudioAsync(text, cancellationToken);
    }
}