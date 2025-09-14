# === Build stage ===
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copy csproj and restore dependencies
COPY *.csproj ./
RUN dotnet restore

# Copy remaining files and publish project
COPY . ./
RUN dotnet publish -c Release -o out

# === Runtime stage ===
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app

# Copy files from build stage
COPY --from=build /app/out .

# Open port 80 for Render
EXPOSE 80

# Run the application
ENTRYPOINT ["dotnet", "WebFog.dll"]
