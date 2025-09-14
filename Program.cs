using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Hosting;
using System.Threading.Tasks;

var builder = WebApplication.CreateBuilder(args);

var app = builder.Build();

// Serve static files from wwwroot (HTML, JS, CSS, etc.)
app.UseStaticFiles();

// Redirect root URL "/" to index.html
app.MapGet("/", context =>
{
    context.Response.Redirect("/index.html");
    return Task.CompletedTask;
});

// Run the application
app.Run();
