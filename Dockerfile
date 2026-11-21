FROM mcr.microsoft.com/dotnet/sdk:11.0 AS build
WORKDIR /src

COPY NightwingSite.csproj .
RUN dotnet restore

COPY . .
RUN dotnet publish NightwingSite.csproj -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:11.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .

ENV ASPNETCORE_HTTP_PORTS=10000
EXPOSE 10000

ENTRYPOINT ["dotnet", "NightwingSite.dll"]
