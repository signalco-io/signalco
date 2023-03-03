namespace Signal.Core.Exceptions;

public class ApiErrorDto
{
    public string Code { get; }

    public string Message { get; }

    public ApiErrorDto(string code, string message = "")
    {
        this.Code = code;
        this.Message = message;
    }
}