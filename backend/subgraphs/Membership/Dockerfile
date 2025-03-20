FROM mcr.microsoft.com/dotnet/aspnet:8.0@sha256:8757d38b7bef730a7723e28792b789c359fd24509a5cf6cb15143e4b44615fc0 AS runtime
COPY . ./app
ENV TZ=Australia/Perth
USER $APP_UID
WORKDIR /app
ENTRYPOINT ["dotnet", "Membership.dll"]