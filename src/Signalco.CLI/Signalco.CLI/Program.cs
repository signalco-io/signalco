using System.CommandLine.Invocation;
using System.CommandLine.Parsing;

var rootCommand = new RootCommand("Signalco CLI tool.");

var authLoginCommand = new Command("login", "Login with your account.");
authLoginCommand.SetHandler(HandleAuthLoginAsync);
authLoginCommand.AddValidator(Validate);
var authLogoutCommand = new Command("logout", "Logout with currently logged in account.");
var authWhoIsCommand = new Command("who", "Display currently logged in account.");

rootCommand.AddCommand(authLoginCommand);
rootCommand.AddCommand(authLogoutCommand);
rootCommand.AddCommand(authWhoIsCommand);

return await rootCommand.InvokeAsync(args);

async Task Validate(CommandResult symbolResult)
{
    symbolResult.
}

async Task HandleAuthLoginAsync(InvocationContext context)
{
    var cancellationToken = context.GetCancellationToken();
    
}