terraform {
  required_version = ">= 1.7.4"
}

data "azurerm_client_config" "current" {}
data "azurerm_subscription" "current" {}

locals {
  # get a list of all rgs in play so we can look up their tags
  rglist = setunion(
    [for i in var.KeyVaults : i.resourceGroupName],
    [for i in var.configurationStores : i.resourceGroupName],
    [for i in var.workspaces : i.resourceGroupName],
    [for i in var.userAssignedIdentities : i.resourceGroupName],
    [for i in var.managedEnvironments : i.resourceGroupName]
  )

}

data "azurerm_resource_group" "rg" {
  for_each = local.rglist
  name     = each.value
}

output "rglist" {
  value = local.rglist
}
resource "azurerm_key_vault" "kv" {
  for_each = var.KeyVaults

  name                        = each.key
  location                    = each.value.location
  resource_group_name         = each.value.resourceGroupName
  tags                        = merge(data.azurerm_resource_group.rg[each.value.resourceGroupName].tags, each.value.tags)
  enabled_for_disk_encryption = each.value.properties.enabledForDiskEncryption
  tenant_id                   = data.azurerm_client_config.current.tenant_id
  soft_delete_retention_days  = each.value.properties.softDeleteRetentionInDays
  purge_protection_enabled    = each.value.properties.enablePurgeProtection
  enable_rbac_authorization   = each.value.properties.enableRbacAuthorization

  sku_name = each.value.properties.sku.name

}

resource "azurerm_app_configuration" "appconfig" {
  for_each            = var.configurationStores
  name                = each.key
  location            = each.value.location
  resource_group_name = each.value.resourceGroupName
  tags                = merge(data.azurerm_resource_group.rg[each.value.resourceGroupName].tags, each.value.tags)
  sku                 = each.value.sku.name

  local_auth_enabled = !each.value.properties.disableLocalAuth
  # public_network_access      = "Enabled"
  purge_protection_enabled   = each.value.properties.enablePurgeProtection
  soft_delete_retention_days = each.value.properties.softDeleteRetentionInDays

}

resource "azurerm_log_analytics_workspace" "laws" {
  for_each = var.workspaces

  name                               = each.key
  location                           = each.value.location
  resource_group_name                = each.value.resourceGroupName
  allow_resource_only_permissions    = each.value.properties.features.enableLogAccessUsingOnlyResourcePermissions
  daily_quota_gb                     = each.value.properties.workspaceCapping.dailyQuotaGb
  internet_ingestion_enabled         = each.value.properties.publicNetworkAccessForIngestion
  internet_query_enabled             = each.value.properties.publicNetworkAccessForQuery
  local_authentication_disabled      = each.value.properties.features.disableLocalAuth
  reservation_capacity_in_gb_per_day = each.value.properties.workspaceCapping.dailyQuotaGb
  retention_in_days                  = each.value.properties.retentionInDays
  sku                                = each.value.properties.sku.name
  tags                               = merge(data.azurerm_resource_group.rg[each.value.resourceGroupName].tags, each.value.tags)
}

resource "azurerm_application_insights" "app_insights" {
  for_each = var.appInsights

  name                = each.key
  location            = each.value.location
  resource_group_name = each.value.resourceGroupName
  application_type    = each.value.applicationType
  workspace_id        = azurerm_log_analytics_workspace.laws[each.value.workspace].id
  tags                = merge(data.azurerm_resource_group.rg[each.value.resourceGroupName].tags, each.value.tags)
}

data "azurerm_key_vault_secret" "web_tests" {
  for_each = { for header in flatten([for webTest in var.webTests : flatten([for header in webTest.request.keyVaultHeaders : header])]) : header.secretName => header }

  name         = each.value.secretName
  key_vault_id = azurerm_key_vault.kv[each.value.vaultName].id
}

resource "azurerm_application_insights_standard_web_test" "web_tests" {
  for_each = var.webTests

  name                    = each.key
  resource_group_name     = each.value.resourceGroupName
  location                = each.value.location
  application_insights_id = azurerm_application_insights.app_insights[each.value.appInsightsName].id
  geo_locations           = each.value.geoLocations
  enabled                 = each.value.enabled
  frequency               = each.value.frequency
  retry_enabled           = each.value.retryEnabled
  timeout                 = each.value.timeout

  request {
    url                              = each.value.request.url
    body                             = each.value.request.body
    follow_redirects_enabled         = each.value.request.followRedirectsEnabled
    http_verb                        = each.value.request.httpVerb
    parse_dependent_requests_enabled = each.value.request.parseDependentRequestsEnabled

    dynamic "header" {
      for_each = each.value.request.headers

      content {
        name  = header.key
        value = header.value
      }
    }

    dynamic "header" {
      for_each = each.value.request.keyVaultHeaders

      content {
        name  = header.value.name
        value = data.azurerm_key_vault_secret.web_tests[header.value.secretName].value
      }
    }
  }

  validation_rules {
    expected_status_code        = each.value.validationRules.expectedStatusCode
    ssl_cert_remaining_lifetime = each.value.validationRules.sslCertRemainingLifetime
    ssl_check_enabled           = each.value.validationRules.sslCheckEnabled

    dynamic "content" {
      for_each = each.value.validationRules.content[*]

      content {
        content_match      = content.value.contentMatch
        ignore_case        = content.value.ignoreCase
        pass_if_text_found = content.value.passIfTextFound
      }
    }
  }

  tags = merge(data.azurerm_resource_group.rg[each.value.resourceGroupName].tags, each.value.tags)
}

data "azurerm_key_vault_secret" "action_group_uri" {
  for_each = { for webhook in flatten([for action_group in var.actionGroups : flatten([for webhook in action_group.webhookReceivers : webhook])]) : webhook.secretName => webhook }

  name         = each.value.secretName
  key_vault_id = azurerm_key_vault.kv[each.value.vaultName].id
}

resource "azurerm_user_assigned_identity" "identity" {
  for_each = var.userAssignedIdentities

  name                = each.key
  location            = each.value.location
  resource_group_name = each.value.resourceGroupName
  tags                = merge(data.azurerm_resource_group.rg[each.value.resourceGroupName].tags, each.value.tags)
}

data "azurerm_user_assigned_identity" "identity" {
  for_each = var.managedEnvironments

  name                = each.value.userAssignedIdentity
  resource_group_name = each.value.uamiResourceGroupName
}


data "azurerm_subnet" "subnet" {
  for_each = var.managedEnvironments

  name                 = each.value.subnet
  virtual_network_name = each.value.vnet
  resource_group_name  = each.value.vnetresourceGroupName
}

resource "azurerm_container_app_environment" "environment" {
  for_each = var.managedEnvironments

  name                               = each.key
  location                           = each.value.location
  resource_group_name                = each.value.resourceGroupName
  tags                               = merge(data.azurerm_resource_group.rg[each.value.resourceGroupName].tags, each.value.tags)
  log_analytics_workspace_id         = azurerm_log_analytics_workspace.laws[each.value.workspace].id
  infrastructure_subnet_id           = data.azurerm_subnet.subnet[each.key].id
  internal_load_balancer_enabled     = true
  zone_redundancy_enabled            = each.value.properties.zoneRedundant
  infrastructure_resource_group_name = "${each.value.resourceGroupName}-managed"
  mutual_tls_enabled                 = try(each.value.properties.peerAuthentication, false)

  dynamic "workload_profile" {
    for_each = each.value.properties.workloadProfiles == null ? [] : each.value.properties.workloadProfiles

    content {
      name                  = workload_profile.value.name
      workload_profile_type = workload_profile.value.workloadProfileType
      maximum_count         = workload_profile.value.maximumCount
      minimum_count         = workload_profile.value.minimumCount
    }
  }
}

locals {
  daprList = flatten([
    for mekey, mevalue in var.managedEnvironments :
    [
      for daprkey, daprvalue in mevalue.properties.daprConfiguration :
      {
        "mekey"     = mekey
        "daprkey"   = daprkey
        "daprvalue" = daprvalue.properties
      }
    ]
  ])

  daprMap = { for d in local.daprList : "${d.mekey}-${d.daprkey}" => d }

}


resource "azurerm_container_app_environment_dapr_component" "appconfig" {
  for_each = local.daprMap

  name                         = each.value.daprkey
  container_app_environment_id = azurerm_container_app_environment.environment[each.value.mekey].id
  component_type               = each.value.daprvalue.componentType
  version                      = each.value.daprvalue.version
  ignore_errors                = each.value.daprvalue.ignoreErrors
  init_timeout                 = try(each.value.daprvalue.initTimeout, null)

  dynamic "metadata" {
    for_each = [for d in each.value.daprvalue.metadata : d if d.name != "azureClientId"]

    content {
      name        = metadata.value.name
      value       = try(metadata.value.value, null)
      secret_name = try(metadata.value.secretRef, null)
    }
  }

  # Use Managed Identity for azureClientId if value not specified
  dynamic "metadata" {
    for_each = [for d in each.value.daprvalue.metadata : d if d.name == "azureClientId"]
    content {
      name  = metadata.value.name
      value = try(metadata.value.value != null, false) ? metadata.value.value : data.azurerm_user_assigned_identity.identity[each.value.mekey].client_id
    }
  }

  scopes = each.value.daprvalue.scopes
}

locals {
  sslCertList = flatten([
    for mekey, mevalue in var.managedEnvironments :
    [
      for cert in try(mevalue.sslCertificateSecrets, []) :
      {
        "mekey"      = mekey
        "secretName" = cert.secretName
        "vaultName"  = cert.vaultName
      }
    ]
  ])

  sslCertMap = { for c in local.sslCertList : "${c.mekey}-${c.vaultName}-${c.secretName}" => c }

}


data "azurerm_key_vault_secret" "sslCertificates" {
  for_each = local.sslCertMap

  name         = each.value.secretName
  key_vault_id = azurerm_key_vault.kv[each.value.vaultName].id
}

resource "azurerm_container_app_environment_certificate" "sslCertificate" {
  for_each = local.sslCertMap

  name                         = each.value.secretName
  container_app_environment_id = azurerm_container_app_environment.environment[each.value.mekey].id
  certificate_blob_base64      = data.azurerm_key_vault_secret.sslCertificates[each.key].value
  certificate_password         = ""

  tags = merge(data.azurerm_resource_group.rg[azurerm_container_app_environment.environment[each.value.mekey].resource_group_name].tags, azurerm_container_app_environment.environment[each.value.mekey].tags)

  lifecycle {
    ignore_changes = all
  }
}