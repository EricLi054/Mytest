data "azurerm_client_config" "current" {}

locals {
  # join and decode all container app definition yaml files
  containerApps = yamldecode(join("\n", [
    for filename in fileset(path.module, "resources/container-app/*.yaml") : file(filename)
  ]))

}

module "container-app" {
  for_each               = local.containerApps
  source                 = "../../modules/container-app"
  name                   = each.key
  resourceGroupName      = each.value.resourceGroupName
  managedEnvironmentName = each.value.managedEnvironmentName
  keyVaultName           = each.value.keyVaultName
  appConfigName          = each.value.appConfigName
  tags                   = try(each.value.tags, {})
  properties             = each.value.properties
  identity               = try(each.value.identity, {})
  image_version          = var.image_version
  appInsightsName        = each.value.appInsightsName
}

output "latest_revision_fqdns" {
  value = [for apps in module.container-app : apps.latest_revision_fqdn]
}
