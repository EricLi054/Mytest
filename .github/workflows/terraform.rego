package terraform.analysis

import input as tfplan

########################
# Parameters for Policy
########################

blast_radius = 50
#------------------------------------------------------------------------
# Any request greater than 60 points fails automatic authorization
#------------------------------------------------------------------------
# Weights assigned for each operation on each resource-type
weights = {
    "azurerm_app_configuration": {"delete": 40, "create": 1, "modify": 5},
    "azurerm_application_gateway": {"delete": 50, "create": 1, "modify": 5},
    "azurerm_container_app_environment_certificate": {"delete": 50, "create": 1, "modify": 5},
    "azurerm_container_app_environment_dapr_component": {"delete": 40, "create": 1, "modify": 5},
    "azurerm_container_app_environment": {"delete": 40, "create": 1, "modify": 5},
    "azurerm_container_app": {"delete": 40, "create": 1, "modify": 5},
    "azurerm_key_vault": {"delete": 40, "create": 1, "modify": 5},
    "azurerm_log_analytics_workspace": {"delete": 40, "create": 1, "modify": 5},
    "azurerm_log_analytics_workspace": {"delete": 40, "create": 1, "modify": 5},
    "azurerm_public_ip": {"delete": 50, "create": 1, "modify": 5},
    "azurerm_redis_cache": {"delete": 50, "create": 1, "modify": 5},
    "azurerm_redis_cache_access_policy_assignment": {"delete": 50, "create": 1, "modify": 5},
    "azurerm_redis_firewall_rule": {"delete": 50, "create": 1, "modify": 5},
    "azurerm_resource_group": {"delete": 50, "create": 1, "modify": 5},
    "azurerm_resource_provider_registration": {"delete": 10, "create": 1, "modify": 5},
    "azurerm_role_assignment": {"delete": 40, "create": 1, "modify": 5},
    "azurerm_user_assigned_identity": {"delete": 40, "create": 1, "modify": 5},
    "azurerm_web_application_firewall_policy": {"delete": 40, "create": 1, "modify": 5},
    "azurerm_application_insights": {"delete": 40, "create": 1, "modify": 5},
    "azurerm_application_insights_standard_web_test": {"delete": 40, "create": 1, "modify": 5},
    "azurerm_monitor_action_group": {"delete": 40, "create": 1, "modify": 5},
    "azurerm_monitor_metric_alert": {"delete": 40, "create": 1, "modify": 5},
    "azurerm_monitor_scheduled_query_rules_alert_v2": {"delete": 40, "create": 1, "modify": 5}
}

# Consider exactly these resource types in calculations
resource_types = {
    "azurerm_app_configuration",
    "azurerm_application_gateway",
    "azurerm_container_app_environment_certificate",
    "azurerm_container_app_environment_dapr_component",
    "azurerm_container_app_environment",
    "azurerm_container_app",
    "azurerm_key_vault",
    "azurerm_log_analytics_workspace",
    "azurerm_log_analytics_workspace",
    "azurerm_public_ip",
    "azurerm_redis_cache",
    "azurerm_redis_cache_access_policy_assignment",
    "azurerm_redis_firewall_rule",
    "azurerm_resource_group",
    "azurerm_resource_provider_registration",
    "azurerm_role_assignment",
    "azurerm_user_assigned_identity",
    "azurerm_web_application_firewall_policy",
    "azurerm_application_insights",
    "azurerm_application_insights_standard_web_test",
    "azurerm_monitor_action_group",
    "azurerm_monitor_metric_alert",
    "azurerm_monitor_scheduled_query_rules_alert_v2"
}

#########
# Policy
#########

# Authorization holds if score for the plan is acceptable
default authz = false
authz {
    score < blast_radius
}

# Compute the score for a Terraform plan as the weighted sum of deletions, creations, modifications
score = s {
    all := [ x |
            some resource_type
            crud := weights[resource_type];
            del := crud["delete"] * num_deletes[resource_type];
            new := crud["create"] * num_creates[resource_type];
            mod := crud["modify"] * num_modifies[resource_type];
            x := del + new + mod
    ]
    s := sum(all)
}

####################
# Terraform Library
####################

# list of all resources of a given type
resources[resource_type] = all {
    some resource_type
    resource_types[resource_type]
    all := [name |
        name:= tfplan.resource_changes[_]
        name.type == resource_type
    ]
}

# number of creations of resources of a given type
num_creates[resource_type] = num {
    some resource_type
    resource_types[resource_type]
    all := resources[resource_type]
    creates := [res |  res:= all[_]; res.change.actions[_] == "create"]
    num := count(creates)
}


# number of deletions of resources of a given type
num_deletes[resource_type] = num {
    some resource_type
    resource_types[resource_type]
    all := resources[resource_type]
    deletions := [res |  res:= all[_]; res.change.actions[_] == "delete"]
    num := count(deletions)
}

# number of modifications to resources of a given type
num_modifies[resource_type] = num {
    some resource_type
    resource_types[resource_type]
    all := resources[resource_type]
    modifies := [res |  res:= all[_]; res.change.actions[_] == "update"]
    num := count(modifies)
}