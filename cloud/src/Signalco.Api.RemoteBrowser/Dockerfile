# See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

RUN apt-get update && \
    apt install -y libglib2.0-0 libnss3 libatk1.0-0 libatk-bridge2.0-0 libcups2 libdrm2 libxkbcommon0 libxcomposite1 libxdamage1 libxfixes3 libxrandr2 libgbm1 libasound2 libpango-1.0-0 libpangocairo-1.0-0

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src
# COPY ["Signalco.Api.RemoteBrowser/Signalco.Api.RemoteBrowser.csproj", "Signalco.Api.RemoteBrowser/"]

COPY . .
RUN dotnet restore "Signalco.Api.RemoteBrowser.csproj"
RUN dotnet build "Signalco.Api.RemoteBrowser.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Signalco.Api.RemoteBrowser.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Signalco.Api.RemoteBrowser.dll"]