using System.Threading;
using System.Threading.Tasks;

namespace Signal.Infrastructure.AzureSpeech;

internal interface IVoiceSynthesizer
{
    Task<byte[]> TextToAudioAsync(string text, CancellationToken cancellationToken = default);
}