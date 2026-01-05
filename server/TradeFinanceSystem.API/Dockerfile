# Build Stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["TradeFinanceSystem.API.csproj", "."]
RUN dotnet restore "./TradeFinanceSystem.API.csproj"
COPY . .
WORKDIR "/src/."
RUN dotnet build "TradeFinanceSystem.API.csproj" -c Release -o /app/build

# Publish Stage
FROM build AS publish
RUN dotnet publish "TradeFinanceSystem.API.csproj" -c Release -o /app/publish

# Runtime Stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080
ENTRYPOINT ["dotnet", "TradeFinanceSystem.API.dll"]
