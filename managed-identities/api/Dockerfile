FROM mcr.microsoft.com/dotnet/sdk:6.0 AS builder
WORKDIR /app
COPY . .
RUN dotnet restore 
RUN dotnet publish -c Release --nologo -o publish/linux

FROM mcr.microsoft.com/dotnet/aspnet:7.0
WORKDIR /app
COPY --from=builder /app/out .
ENTRYPOINT ["dotnet", "api.dll"]