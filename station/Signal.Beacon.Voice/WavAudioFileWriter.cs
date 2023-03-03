using System;
using System.Collections.Generic;
using System.IO;
using System.Text;

namespace Signal.Beacon.Voice;

public class WavAudioFileWriter : IDisposable
{
    private BinaryWriter? outputFileWriter;
    private int outputFileTotalSamples = 0;

    /// <summary>
    /// Writes the RIFF header for a file in WAV format
    /// </summary>
    /// <param name="writer">Output stream to WAV file</param>
    /// <param name="channelCount">Number of channels</param>     
    /// <param name="bitDepth">Number of bits per sample</param>     
    /// <param name="sampleRate">Sampling rate in Hz</param>
    /// <param name="totalSampleCount">Total number of samples written to the file</param>
    private static void WriteWavHeader(BinaryWriter writer, ushort channelCount, ushort bitDepth, int sampleRate, int totalSampleCount)
    {
        writer.Seek(0, SeekOrigin.Begin);         
        writer.Write(Encoding.ASCII.GetBytes("RIFF"));
        writer.Write((bitDepth / 8 * totalSampleCount) + 36);
        writer.Write(Encoding.ASCII.GetBytes("WAVE")); 
        writer.Write(Encoding.ASCII.GetBytes("fmt "));
        writer.Write(16); 
        writer.Write((ushort)1);
        writer.Write(channelCount);
        writer.Write(sampleRate);
        writer.Write(sampleRate * channelCount * bitDepth / 8);
        writer.Write((ushort)(channelCount * bitDepth / 8));
        writer.Write(bitDepth);
        writer.Write(Encoding.ASCII.GetBytes("data"));
        writer.Write(bitDepth / 8 * totalSampleCount);            
    }

    public void OpenWavFile(string fileName)
    {
        this.outputFileWriter = new BinaryWriter(new FileStream(fileName, FileMode.OpenOrCreate, FileAccess.Write));
        WriteWavHeader(this.outputFileWriter, 1, 16, 16000, 0);
    }

    public void WriteWavFile(IEnumerable<short> samples)
    {
        if (this.outputFileWriter == null)
            throw new Exception("Open WAV file first.");

        foreach (var sample in samples)
        {
            this.outputFileWriter.Write(sample);
            this.outputFileTotalSamples++;
        }
    }

    public void CloseWavFile()
    {
        if (this.outputFileWriter == null)
            throw new Exception("Open WAV file first.");

        WriteWavHeader(this.outputFileWriter, 1, 16, 16000, this.outputFileTotalSamples);
        this.outputFileWriter.Flush();
        this.outputFileWriter.Dispose();
    }

    public void Dispose()
    {
        this.CloseWavFile();
        this.outputFileWriter?.Dispose();
    }
}