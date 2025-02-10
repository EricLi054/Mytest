# myRAC

[![Codacy Badge](https://app.codacy.com/project/badge/Grade/7bc9b5d4365547b3b5e9df86aa788fe5)](https://app.codacy.com?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)

> New experiences should be built in the [RAC Digial Repo](https://github.com/racwa/rac-digital)

## Setting Up Development Environment

This repository uses Dapr for communication between components, as well as getting secrets and configuration.

### Recommended Extensions

The follow extensions are recommended to be used with this codebase:

- Prettier - Code formatter **_required_**
- Testing _(optional)_
  - C# Dev Kit
  - Jest by Orta
  - Playwright Test for VSCode

### Dapr

Steps to install Dapr can be found here: https://docs.dapr.io/getting-started/install-dapr-cli/

1. To run the application as is connecting the components to Azure services, initialise dapr in slim mode:

```bash
dapr init --slim
```

2. We use a dedicated dapr config file to resolve dapr instance names via sqlite. To initialise sqlite, create a .dapr folder in the C:\Users\Public directory before running the tasks.json shortcut. The name resolution database will be created automatically and re-used on every application run.
3. If you're using local dapr components like a Redis image or local keystore, you need to initialise dapr using Podman
   - Follow the instructions on this page to initialise Dapr using the Podman runtime: https://docs.dapr.io/reference/cli/dapr-init/
4. You will need to 'uninstall' dapr to switch between the two with

```bash
dapr uninstall --container-runtime podman
```

When Dapr is initialised it will created 3 containers, only 1 of them is required which is called dapr_placement. This container must be running anytime you want to run an application using Dapr.

In your %userprofile%.dapr folder, there will be some default components and a config file. Delete the default components out of the folder and delete from line 5 of the config.yaml.

After this, we need to create 2 components in the components folder which we will utilise for running our application, one for App Config and one for Keyvault, these can be found in the dapr-components folder.

### PNPM

The frontend application for this repo enforces using the pnpm package manager, install instructions can be found here: https://pnpm.io/installation

After this, to install your dependecies

```bash
pnpm i
```

### Automated Linting

A Git Hook has been created to automatically run code format checks on every git commit

This is to prevent pipelines failing as they have in-built format protection in them

To enable this locally, run

```bash
git config --local core.hooksPath .githooks/
```

### Running the application

You will need to initally run a `az login` if you are connecting to Azure resources for the secrets and configuration.

To run the application there is a vs code tasks which runs both the front and backend code. You can find this under the .vscode folder.

In the vs code top menu, go to File > Preferences > Keyboard Shortcuts

Click the Open Keyboard Shortcuts (JSON) button in the top right corner, and add the following JSON to setup a shortcut:

```json
[
  {
    "key": "ctrl+alt+d",
    "command": "workbench.action.tasks.runTask",
    "args": "Run Dapr"
  }
]
```

### How to run the project in Github Codespaces

1. Create a new codespace

   1. From GitHub/browser in this repo either from https://github.com/racwa/next-rac-com-au/ itself, under \`<> Code\`\` button

   2. From VS Code

      1. Install GitHub Codespaces extension

      2. Ctrl-Shift-P and choose "Codespaces: Create New Codespace..." or "Connect to Codespace"

2. In Terminal, run az login with the right AD credentials that has access to the azure app configuration resource

3. Follow [frontend setup instructions for codespaces](./frontend/README.md/#codespaces)
