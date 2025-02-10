
#id - The ID of the Container App.
output "id" {
  value = azurerm_container_app.app.id
}

#custom_domain_verification_id - The ID of the Custom Domain Verification for this Container App.
output "custom_domain_verification_id" {
  value = azurerm_container_app.app.custom_domain_verification_id
}

#latest_revision_fqdn - The FQDN of the Latest Revision of the Container App.
output "latest_revision_fqdn" {
  value = azurerm_container_app.app.latest_revision_fqdn
}

#latest_revision_name - The name of the latest Container Revision.
output "latest_revision_name" {
  value = azurerm_container_app.app.latest_revision_name
}

#location - The location this Container App is deployed in. This is the same as the Environment in which it is deployed.
output "location" {
  value = azurerm_container_app.app.location
}

#outbound_ip_addresses - A list of the Public IP Addresses which the Container App uses for outbound network access.
output "outbound_ip_addresses" {
  value = azurerm_container_app.app.outbound_ip_addresses
}
