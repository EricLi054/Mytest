## Getting Started

To set up the local environment and run the application using Docker Compose, follow these steps:

1. Run the `pwsh ./setup-local.ps1` command to configure your environment and log in using the Azure CLI. This command will handle any necessary setup steps and authentication.

    ```powershell
    pwsh ./setup-local.ps1
    ```

2. Once the setup is complete, you can start the application using Docker Compose. Run the following command in the terminal:

    ```bash
    docker-compose up
    ```

    This command will build and start the containers defined in your `docker-compose.yml` file.

3. Wait for the containers to start up. You should see logs indicating the progress of the startup process.

4. Once the containers are up and running, you can access the application by navigating to `http://localhost:3000` in your web browser.

That's it! You have successfully set up the local environment and started the application using Docker Compose.