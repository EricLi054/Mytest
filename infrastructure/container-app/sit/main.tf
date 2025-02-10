data "azurerm_client_config" "current" {}

locals {
  # join and decode all container app definition yaml files
  caFromFile = yamldecode(join("\n", [
    for filename in fileset(path.module, "resources/container-app/*.yaml") : file(filename)
  ]))

  caAll = [for name, value in local.caFromFile : name]
  caPr  = [for name, value in local.caFromFile : name if try(value.prInstanceSlot != null, false)]

  caToDeployNames = var.pr_instance == true ? local.caPr : local.caAll

  sub = data.azurerm_client_config.current.subscription_id
}

module "container-app" {
  for_each               = toset(local.caToDeployNames)
  source                 = "../../modules/container-app"
  name                   = each.key
  resourceGroupName      = local.caFromFile[each.key].resourceGroupName
  managedEnvironmentName = local.caFromFile[each.key].managedEnvironmentName
  keyVaultName           = local.caFromFile[each.key].keyVaultName
  appConfigName          = local.caFromFile[each.key].appConfigName
  tags                   = try(local.caFromFile[each.key].tags, {})
  properties             = local.caFromFile[each.key].properties
  identity               = try(local.caFromFile[each.key].identity, {})
  image_version          = var.image_version
  appInsightsName        = local.caFromFile[each.key].appInsightsName
  pr_instance            = var.pr_instance
  prInstanceSlot         = try(local.caFromFile[each.key].prInstanceSlot, "")
}

output "latest_revision_fqdns" {
  value = [for apps in module.container-app : apps.latest_revision_fqdn]
}

