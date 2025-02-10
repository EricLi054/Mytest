terraform {
  required_version = ">= 1.7.4"
}

data "azurerm_resource_group" "rg" {
  name = var.resourceGroupName
}


resource "azurerm_web_application_firewall_policy" "policy" {
  name                = var.name
  resource_group_name = data.azurerm_resource_group.rg.name
  location            = var.location
  tags                = merge(data.azurerm_resource_group.rg.tags, var.tags)

  dynamic "custom_rules" {
    for_each = var.properties.customRules
    content {
      enabled              = try(custom_rules.value.enabled, true)
      name                 = try(custom_rules.value.name, null)
      priority             = custom_rules.value.priority
      rule_type            = custom_rules.value.ruleType
      action               = custom_rules.value.action
      rate_limit_duration  = try(custom_rules.value.rateLimitDuration, null)
      rate_limit_threshold = try(custom_rules.value.rateLimitThreshold, null)
      group_rate_limit_by  = try(custom_rules.value.groupRateLimitBy, null)

      dynamic "match_conditions" {
        for_each = try(custom_rules.value.matchConditions, {})
        content {

          dynamic "match_variables" {
            for_each = match_conditions.value.matchVariables
            content {
              variable_name = match_variables.value.variableName
              selector      = try(match_variables.value.selector, null)
            }
          }

          match_values       = try(match_conditions.value.matchValues, [])
          operator           = match_conditions.value.operator
          negation_condition = try(match_conditions.value.negationCondition, false)
          transforms         = try(match_conditions.value.transforms, [])
        }
      }

    }
  }

  policy_settings {
    enabled                          = try(var.properties.policySettings.enabled, null)
    mode                             = try(var.properties.policySettings.mode, null)
    request_body_check               = try(var.properties.policySettings.requestBodyCheck, null)
    file_upload_limit_in_mb          = try(var.properties.policySettings.fileUploadLimitInMb, null)
    max_request_body_size_in_kb      = try(var.properties.policySettings.maxRequestBodySizeInKb, null)
    request_body_inspect_limit_in_kb = try(var.properties.policySettings.requestBodyInspectLimitInKB, null)
  }

  managed_rules {

    dynamic "exclusion" {
      for_each = var.properties.managedRules.exclusions
      content {
        match_variable          = exclusion.value.matchVariable
        selector                = exclusion.value.selector
        selector_match_operator = exclusion.value.selectorMatchOperator
        dynamic "excluded_rule_set" {
          for_each = exclusion.value.exclusionManagedRuleSets
          content {
            type    = try(excluded_rule_set.value.type, null)
            version = try(excluded_rule_set.value.version, null)

            dynamic "rule_group" {
              for_each = excluded_rule_set.value.ruleGroups
              content {
                rule_group_name = rule_group.value.ruleGroupName
                excluded_rules  = rule_group.value.rules
              }

            }

          }

        }
      }
    }

    dynamic "managed_rule_set" {
      for_each = var.properties.managedRules.managedRuleSets
      content {
        type    = managed_rule_set.value.ruleSetType
        version = managed_rule_set.value.ruleSetVersion

        dynamic "rule_group_override" {
          for_each = managed_rule_set.value.ruleGroupOverrides
          content {
            rule_group_name = rule_group_override.value.ruleGroupName

            dynamic "rule" {
              for_each = rule_group_override.value.rules
              content {
                id      = rule.value.ruleId
                action  = try(rule.value.action, null)
                enabled = try(rule.value.state, null)
              }

            }

          }
        }

      }

    }
  }
}
