using System.Threading;
using System.Threading.Tasks;

namespace Signal.Core.Voice;

public interface IVoiceService
{
    Task<byte[]> TextToAudioAsync(string text, CancellationToken cancellationToken = default);
}