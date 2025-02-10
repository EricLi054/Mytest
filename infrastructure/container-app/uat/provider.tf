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
  subscription_id            = "4b737f05-03e2-4b5a-88a4-aa8264a39bed"

  features {}
}

# provider "azuread" {
#   tenant_id = "6f0e7657-1985-4cc9-9a41-d6ebe342d2e4"
# }
