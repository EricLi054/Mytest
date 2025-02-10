terraform {
  required_version = ">= 1.7.4"
}

data "azurerm_resource_group" "rg" {
  name = var.resourceGroupName
}

data "azurerm_key_vault" "keyvault" {
  name                = var.keyVaultName
  resource_group_name = var.resourceGroupName
}

data "azurerm_app_configuration" "appconfig" {
  name                = var.appConfigName
  resource_group_name = var.resourceGroupName
}

data "azurerm_key_vault_secret" "secret" {
  for_each = { for s in var.properties.configuration.secrets : s.name => s }

  name         = each.value.name
  key_vault_id = data.azurerm_key_vault.keyvault.id
}

data "azurerm_app_configuration_key" "config" {
  for_each = { for s in var.properties.configuration.environmentVariables : s.configKey => s }

  key                    = each.value.configKey
  configuration_store_id = data.azurerm_app_configuration.appconfig.id
}

data "azurerm_container_app_environment" "env" {
  name                = var.managedEnvironmentName
  resource_group_name = var.resourceGroupName
}

data "azurerm_container_app_environment_certificate" "sslCertificate" {
  for_each = toset([for c in var.properties.configuration.ingress.customDomains : c.certificateName])

  name                         = each.key
  container_app_environment_id = data.azurerm_container_app_environment.env.id
}

data "azurerm_application_insights" "appinsights" {
  for_each            = toset(var.appInsightsName != null ? [var.appInsightsName] : [])
  name                = each.value
  resource_group_name = var.resourceGroupName
}

resource "azurerm_container_app" "app" {
  name                         = var.pr_instance == true ? "${var.name}-${var.prInstanceSlot}" : var.name
  resource_group_name          = var.resourceGroupName
  container_app_environment_id = data.azurerm_container_app_environment.env.id
  revision_mode                = var.properties.configuration.activeRevisionsMode
  tags                         = merge(data.azurerm_resource_group.rg.tags, var.tags)
  workload_profile_name        = try(var.properties.workloadProfileName, null)

  template {
    min_replicas = var.properties.template.scale.minReplicas
    max_replicas = var.properties.template.scale.maxReplicas

    dynamic "http_scale_rule" {
      for_each = [for r in try(var.properties.template.scale.rules, []) : r if try(r.http.metadata.concurrentRequests, 0) > 0]
      content {
        name                = http_scale_rule.value.name
        concurrent_requests = http_scale_rule.value.http.metadata.concurrentRequests
      }
    }

    dynamic "container" {
      for_each = var.properties.template.containers

      content {
        name   = container.value.name
        cpu    = container.value.resources.cpu
        memory = container.value.resources.memory
        # ephemeralStorage = container.value.resources.ephemeralStorage # in preview and not available now
        image = "${container.value.image}:${var.image_version}"

        dynamic "liveness_probe" {
          for_each = [for c in container.value.probes : c if c.type == "Liveness"]
          content {
            failure_count_threshold = liveness_probe.value.failureThreshold
            initial_delay           = liveness_probe.value.initialDelaySeconds
            interval_seconds        = liveness_probe.value.periodSeconds
            path                    = liveness_probe.value.httpGet.path
            port                    = liveness_probe.value.httpGet.port
            transport               = liveness_probe.value.httpGet.scheme
          }
        }

        dynamic "readiness_probe" {
          for_each = [for c in container.value.probes : c if c.type == "Readiness"]
          content {
            failure_count_threshold = readiness_probe.value.failureThreshold
            interval_seconds        = readiness_probe.value.periodSeconds
            path                    = readiness_probe.value.httpGet.path
            port                    = readiness_probe.value.httpGet.port
            transport               = readiness_probe.value.httpGet.scheme
            success_count_threshold = readiness_probe.value.successThreshold
            timeout                 = readiness_probe.value.timeoutSeconds
          }
        }

        dynamic "startup_probe" {
          for_each = [for c in container.value.probes : c if c.type == "Startup"]
          content {
            failure_count_threshold = startup_probe.value.failureThreshold
            interval_seconds        = startup_probe.value.periodSeconds
            path                    = startup_probe.value.httpGet.path
            port                    = startup_probe.value.httpGet.port
            transport               = startup_probe.value.httpGet.scheme
            timeout                 = startup_probe.value.timeoutSeconds
          }
        }

        dynamic "env" {
          for_each = [for c in container.value.env : c if !contains(["BACKEND_APP_ID", "NEXTAUTH_URL"], c.name)]
          content {
            name        = env.value.name
            value       = try(env.value.value, null)
            secret_name = try(env.value.secretRef, null)
          }
        }

        dynamic "env" {
          for_each = [for c in container.value.env : c if contains(["BACKEND_APP_ID"], c.name)]
          content {
            name        = env.value.name
            value       = var.pr_instance == true ? try("${env.value.value}-${var.prInstanceSlot}", null) : try(env.value.value, null)
            secret_name = try(env.value.secretRef, null)
          }
        }

        dynamic "env" {
          for_each = [for c in container.value.env : c if contains(["NEXTAUTH_URL"], c.name)]
          content {
            name        = env.value.name
            value       = var.pr_instance == true ? try(replace(env.value.value, ".ractest.com.au", "-${var.prInstanceSlot}.ractest.com.au"), null) : try(env.value.value, null)
            secret_name = try(env.value.secretRef, null)
          }
        }

        dynamic "env" {
          for_each = var.properties.configuration.environmentVariables
          content {
            name  = env.value.name
            value = data.azurerm_app_configuration_key.config[env.value.configKey].value
          }

        }

      }

    }

  }

  dynamic "registry" {
    for_each = var.properties.configuration.registries

    content {
      server               = registry.value.server
      identity             = try(registry.value.identity, null)
      username             = try(registry.value.username, null)
      password_secret_name = try(registry.value.passwordSecretRef, null)
    }

  }

  dynamic "secret" {
    for_each = toset(var.appInsightsName != null ? [var.appInsightsName] : [])

    content {
      name  = "app-insights-connection-string"
      value = data.azurerm_application_insights.appinsights[secret.value].connection_string
    }
  }

  dynamic "secret" {
    for_each = var.properties.configuration.secrets
    content {
      name  = secret.value.name
      value = data.azurerm_key_vault_secret.secret[secret.value.name].value
    }
  }

  dynamic "identity" {
    for_each = var.identity == {} ? [] : [1]
    content {
      type         = var.identity.type
      identity_ids = var.identity.userAssignedIdentities
    }
  }

  dapr {
    app_id       = var.pr_instance == true ? "${var.properties.configuration.dapr.appId}-${var.prInstanceSlot}" : var.properties.configuration.dapr.appId
    app_port     = var.properties.configuration.dapr.appPort
    app_protocol = var.properties.configuration.dapr.appProtocol
  }

  ingress {
    external_enabled = var.properties.configuration.ingress.external
    target_port      = var.properties.configuration.ingress.targetPort
    dynamic "traffic_weight" {
      for_each = var.properties.configuration.ingress.traffic
      content {
        latest_revision = traffic_weight.value.latestRevision
        percentage      = traffic_weight.value.weight
      }
    }

    dynamic "ip_security_restriction" {
      for_each = var.properties.configuration.ingress.ipSecurityRestrictions

      content {
        name             = ip_security_restriction.value.name
        description      = ip_security_restriction.value.description
        action           = ip_security_restriction.value.action
        ip_address_range = ip_security_restriction.value.ipAddressRange
      }

    }

    dynamic "custom_domain" {
      for_each = var.properties.configuration.ingress.customDomains

      content {
        name                     = var.pr_instance == true ? replace("${custom_domain.value.name}", ".ractest.com.au", "-${var.prInstanceSlot}.ractest.com.au") : custom_domain.value.name
        certificate_binding_type = custom_domain.value.certificateBindingType
        certificate_id           = data.azurerm_container_app_environment_certificate.sslCertificate[custom_domain.value.certificateName].id
      }

    }

  }



}

