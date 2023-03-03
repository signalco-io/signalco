using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.CognitiveServices.Speech;
using Signal.Core.Secrets;

namespace Signal.Infrastructure.AzureSpeech;

internal class VoiceSynthesizer : IVoiceSynthesizer
{
    private SpeechConfig? config;
    private readonly ISecretsProvider secretsProvider;
        
    public VoiceSynthesizer(ISecretsProvider secretsProvider)
    {
        this.secretsProvider = secretsProvider ?? throw new ArgumentNullException(nameof(secretsProvider));
    }

    private async Task EnsureSpeechConfigAsync(CancellationToken cancellationToken = default)
    {
        if (this.config != null)
            return;

        var key = await this.secretsProvider.GetSecretAsync(SecretKeys.AzureSpeech.SubscriptionKey, cancellationToken);
        var region = await this.secretsProvider.GetSecretAsync(SecretKeys.AzureSpeech.Region, cancellationToken);
        this.config = SpeechConfig.FromSubscription(key, region);
        this.config.SpeechSynthesisVoiceName = "en-US-AriaNeural";
        this.config.SetSpeechSynthesisOutputFormat(SpeechSynthesisOutputFormat.Riff16Khz16BitMonoPcm);
    }

    public async Task<byte[]> TextToAudioAsync(string text, CancellationToken cancellationToken = default)
    {
        await this.EnsureSpeechConfigAsync(cancellationToken);
            
        using var synthesizer = new SpeechSynthesizer(this.config, null);
        var result = await synthesizer.SpeakTextAsync(text);
        if (result.Reason != ResultReason.SynthesizingAudioCompleted)
            throw new Exception($"Reason not expected: {result.Reason}. ResultId: {result.ResultId}");

        return result.AudioData;
    }
}