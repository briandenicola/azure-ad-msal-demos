FROM mcr.microsoft.com/dotnet/sdk:6.0 AS builder
WORKDIR /app
COPY . .
RUN dotnet restore 
RUN dotnet publish -c Release --nologo -o publish/linux

FROM bjd145/utils:3.10
ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update && apt-get install -y krb5-user aspnetcore-runtime-6.0
WORKDIR /app
COPY --from=builder /app/publish/linux .