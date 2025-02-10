# Sample README

This README provides an overview of the `build-scan-patch-push-container` GitHub Action. 

## Purpose

The purpose of this action is to build, scan, patch, and push a container image to a container registry. It automates the process of containerizing an application, scanning it for vulnerabilities, applying necessary patches, and pushing the updated image to a registry.

## Local Development guide

Below are the steps you can follow to do interactive scanning for troubleshooting/changes when required.
1) Ensure you have [docker engine](https://docs.docker.com/engine/install/ubuntu/), [trivy](https://aquasecurity.github.io/trivy/v0.18.3/installation/) installed on your WSL2.
2) Clone this repo and navigate to a folder with Dockerfile defined, e.g. \frontend
```
docker build -f Dockerfile.ci -t frontend .
trivy image --scanners vuln --vuln-type os,library --ignore-unfixed --severity CRITICAL,HIGH -f json -o frontend.json frontend:latest
jq '.' frontend.json | grep "VulnerabilityID" | sort -u | wc -l
```

For more information, refer to the below:
- [Confluence documentation](https://rac-wa.atlassian.net/wiki/x/OgISzg)
- [Trivy Scanner](https://github.com/aquasecurity/trivy)