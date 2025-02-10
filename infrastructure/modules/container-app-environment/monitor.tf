resource "azurerm_monitor_action_group" "action_group" {
  for_each = var.actionGroups

  name                = each.key
  resource_group_name = each.value.resourceGroupName
  short_name          = each.value.shortName

  dynamic "email_receiver" {
    for_each = each.value.emailReceivers

    content {
      name                    = email_receiver.key
      email_address           = email_receiver.value.emailAddress
      use_common_alert_schema = email_receiver.value.useCommonAlertSchema
    }
  }

  dynamic "webhook_receiver" {
    for_each = each.value.webhookReceivers

    content {
      name                    = webhook_receiver.key
      service_uri             = data.azurerm_key_vault_secret.action_group_uri[webhook_receiver.value.secretName].value
      use_common_alert_schema = webhook_receiver.value.useCommonAlertSchema
    }
  }

  tags = merge(data.azurerm_resource_group.rg[each.value.resourceGroupName].tags, each.value.tags)
}

resource "azurerm_monitor_metric_alert" "alert" {
  for_each = var.webTestAlerts

  name                = each.key
  resource_group_name = each.value.resourceGroupName
  scopes              = [azurerm_application_insights_standard_web_test.web_tests[each.value.webTest].id, azurerm_application_insights.app_insights[each.value.appInsightsName].id]
  enabled             = each.value.enabled
  severity            = each.value.severity

  application_insights_web_test_location_availability_criteria {
    web_test_id           = azurerm_application_insights_standard_web_test.web_tests[each.value.webTest].id
    component_id          = azurerm_application_insights.app_insights[each.value.appInsightsName].id
    failed_location_count = each.value.failedLocationCount
  }

  action {
    action_group_id = azurerm_monitor_action_group.action_group[each.value.actionGroupName].id
  }

  tags = merge(data.azurerm_resource_group.rg[each.value.resourceGroupName].tags, each.value.tags)

  depends_on = [
    azurerm_monitor_action_group.action_group
  ]
}

resource "azurerm_monitor_scheduled_query_rules_alert_v2" "alert" {
  for_each = var.queryAlerts

  name                = each.key
  resource_group_name = each.value.resourceGroupName
  location            = each.value.resourceGroupNameLocation

  scopes  = [azurerm_log_analytics_workspace.laws[each.value.workspace].id]
  enabled = each.value.enabled

  evaluation_frequency = each.value.evaluationFrequency
  window_duration      = each.value.windowDuration
  severity             = each.value.severity
  criteria {
    query                   = each.value.query
    time_aggregation_method = each.value.timeAggregationMethod
    threshold               = each.value.threshold
    operator                = each.value.operator

    failing_periods {
      number_of_evaluation_periods             = each.value.failingPeriods.numberOfEvaluationPeriods
      minimum_failing_periods_to_trigger_alert = each.value.failingPeriods.minFailingPeriodsToAlert
    }
  }
  action {
    action_groups = [azurerm_monitor_action_group.action_group[each.value.actionGroupName].id]
  }
  tags = merge(data.azurerm_resource_group.rg[each.value.resourceGroupName].tags, each.value.tags)

  depends_on = [
    azurerm_monitor_action_group.action_group
  ]
}
