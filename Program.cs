var builder = WebApplication.CreateBuilder(args);

// Add controllers for API
builder.Services.AddControllers();

var app = builder.Build();

// Serve static files from wwwroot
app.UseStaticFiles();

// Map API controllers
app.MapControllers();

// Run the application
app.Run();
