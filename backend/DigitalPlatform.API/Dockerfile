FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /source

# copy csproj and restore as distinct layers
COPY *.csproj .
RUN dotnet restore --runtime linux-x64

# copy everything else and build app
COPY . .
RUN dotnet publish -c release --runtime linux-x64 --self-contained --no-restore -o /app

# final stage/image
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app .

# Install tzdata and set the timezone
ENV TZ=Australia/Perth

# set non-root user
USER $APP_UID

ENTRYPOINT ["dotnet", "DigitalPlatform.API.dll"]