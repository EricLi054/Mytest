terraform {
  backend "azurerm" {}

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.112.0"
    }
  }

  required_version = ">= 1.7.4"
}

provider "azurerm" {
  skip_provider_registration = true
  subscription_id            = "bc8c0622-7aa0-4a8b-8e07-9222ea6b0f02"

  features {}
}

# provider "azuread" {
#   tenant_id = "6f0e7657-1985-4cc9-9a41-d6ebe342d2e4"
# }
