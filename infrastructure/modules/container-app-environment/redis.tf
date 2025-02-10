resource "azurerm_redis_cache" "redis" {
  for_each = var.redis

  name                = each.key
  location            = each.value.location
  resource_group_name = each.value.resourceGroupName
  tags                = merge(data.azurerm_resource_group.rg[each.value.resourceGroupName].tags, each.value.tags)
  redis_version       = each.value.properties.redisVersion
  capacity            = each.value.properties.sku.capacity
  family              = each.value.properties.sku.family
  sku_name            = each.value.properties.sku.name
  enable_non_ssl_port = each.value.properties.enableNonSslPort
  zones               = try(each.value.zones, null)

  # identity {
  # }

  public_network_access_enabled = each.value.properties.publicNetworkAccess
  minimum_tls_version           = "1.2"

  redis_configuration {
    maxmemory_reserved                      = try(each.value.properties.redisConfiguration.maxmemory-reserved, null)
    maxmemory_delta                         = try(each.value.properties.redisConfiguration.maxmemory-delta, null)
    active_directory_authentication_enabled = each.value.properties.redisConfiguration.aad-enabled
    enable_authentication                   = true
    maxfragmentationmemory_reserved         = try(each.value.properties.redisConfiguration.maxfragmentationmemory-reserved, null)
  }

  dynamic "patch_schedule" {
    for_each = each.value.patchSchedules.properties.scheduleEntries
    content {
      day_of_week        = patch_schedule.value.dayOfWeek
      start_hour_utc     = patch_schedule.value.startHourUtc
      maintenance_window = patch_schedule.value.maintenanceWindow
    }
  }

}

locals {
  redisFWRules = flatten([
    for rkey, rvalue in var.redis :
    [
      for rulekey, rulevalue in rvalue.firewallRules :
      {
        "rkey"      = rkey
        "rulekey"   = rulekey
        "rulevalue" = rulevalue
      }
    ]
  ])

  redisFWRulesMap = { for r in local.redisFWRules : "${r.rkey}-${r.rulekey}" => r }

}

resource "azurerm_redis_firewall_rule" "firewall_rule" {
  for_each = local.redisFWRulesMap

  name                = replace(each.key, "-", "_")
  redis_cache_name    = azurerm_redis_cache.redis[each.value.rkey].name
  resource_group_name = azurerm_redis_cache.redis[each.value.rkey].resource_group_name
  start_ip            = each.value.rulevalue.properties.startIP
  end_ip              = each.value.rulevalue.properties.endIP
}


locals {
  uamis = flatten([
    for rkey, rvalue in var.redis :
    [
      for access_policy_name, assignments in try(rvalue.accessPolicyAssignments.userAssignedManagedIdentities, {}) :
      [for a in assignments :
        {
          "rkey"               = rkey
          "access_policy_name" = access_policy_name
          "name"               = a.name
          "resourceGroupName"  = a.resourceGroupName
        }
      ]
    ]
  ])

  uamisMap = { for a in local.uamis : "${a.rkey}-${a.access_policy_name}-${a.name}-${a.resourceGroupName}" => a }

}

data "azurerm_user_assigned_identity" "uami" {
  for_each = local.uamisMap

  name                = each.value.name
  resource_group_name = each.value.resourceGroupName
}

resource "azurerm_redis_cache_access_policy_assignment" "uami" {
  for_each = local.uamisMap

  name               = each.key
  redis_cache_id     = azurerm_redis_cache.redis[each.value.rkey].id
  access_policy_name = each.value.access_policy_name
  object_id          = data.azurerm_user_assigned_identity.uami[each.key].principal_id
  object_id_alias    = data.azurerm_user_assigned_identity.uami[each.key].name
}