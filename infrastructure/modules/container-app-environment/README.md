# container-app-environment

Deploys the resources required for the container app environment:

- azurerm_key_vault
- azurerm_app_configuration
- azurerm_user_assigned_identity (used by container app environment)
- azurerm_log_analytics_workspace
- azurerm_key_vault_secret (Data)
- azurerm_container_app_environment
- azurerm_container_app_environment_dapr_component