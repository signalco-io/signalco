namespace Signal.Core.Exceptions;

public class ApiErrorDto(string code, string message = "")
{
    public string Code { get; } = code;

    public string Message { get; } = message;
}