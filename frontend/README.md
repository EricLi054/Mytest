## Getting setup and starting development

### Local development

1. Install pnpm https://pnpm.io/
   a. Run `npm install -g pnpm`

2. Connect to Azure Artifact feed
   1. copy .npmrc.sample to .npmrc

   2. Run `vsts-npm-auth -config .npmrc` to authenticate with the feed.

      a. You may need to install vsts-npm-auth first (`npm i -g vsts-npm-auth`).

      b. You may get an error regarding a PowerShell script not being digitally signed, use the following command to allow the script to run in your current session `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass`

      c. You may also get an error saying `Couldn't get an authentication token for https://racwa.pkgs.visualstudio.com/_packaging/racwa-design-feed/npm/registry/.` If this happens run  `vsts-npm-auth -F -config .npmrc` which will force the regeneration of a PAT for the credential helper.

3. Run `pnpm i`

4. Copy .env.sample to .env

5. Run `Client Run` task in VS Code or follow instructions from [here](../README.md/#running-the-application).

### Codespaces

1. If you have generated a local token already using the local development instructions, copy and paste the contents of %UserProfile/.npmrc into frontend/.npmrc replacing the auth token content entirely.

2. Otherwise, follow the below instructions to get a new token
   1. Generate a [Personal Access Token](https://dev.azure.com/racwa/_details/security/tokens) with Packaging read & write scopes.

   2. Base64 encode the token

      `node -e "require('readline') .createInterface({input:process.stdin,output:process.stdout,historySize:0}) .question('PAT> ',p => { b64=Buffer.from(p.trim()).toString('base64');console.log(b64);process.exit(); })"`

   3. Copy the base64 encoded string in the placeholder in .npmrc \[BASE64\_ENCODED\_PERSONAL\_ACCESS\_TOKEN]

3. Run `pnpm i`

4. Run `Client Run` task in VS Code or follow instructions from [here](../README.md).

## Testing setup

1. There are 3 testing scripts in the package.json

   a. `pnpm test:e2e`: This is to run the Playwright end-to-end tests. In order for these to work locally you first need to run npx playwright install to download the required browsers.

   b. `pnpm test`: This is to run the Jest unit tests in interactive mode.

   c. `pnpm test:ci`: This is to run the Jest unit tests and just reporting pass/fail.

Please refer to https://rac-wa.atlassian.net/wiki/spaces/DD/pages/3540353062/Playwright+Automation+Testing for specific information on the Playwright scope and implementation.

## Additional Tips

1. As of NextJS 9.4 environment variables can be passed through via an `.env.local` file. Simply create the `env.local` file and use the examples in the `env.sample` for how to store them. Follow RAC standards for passing through the variables through in pipelines.

## Other design notes:

Please refer to https://rac-wa.atlassian.net/wiki/spaces/DD/pages/3072622616/Frontend+Design.

### In general keep these aspects in mind:

* Proper File Import Management

  * Using import aliases makes file imports much easier to read in React/Next, it helps to make things absolute instead of relative to the current importing file which is helpful for many reasons.

  * In Next/React, a lot of import statements are typically used which can become messy if it is not managed, the standard order of imports:

    * Built in (e.g. react)

    * Third party (e.g. material UI)

    * Project file imports (user made components/libraries)

  * We can also use linting libraries to help us manage these things

* Bundle size management

  * An important aspect of maintaining a performant website is to keep your bundle size low which in turn reduces load times.

  * There are many things that can be done to help this, some include:

    * Removing unused dependencies

    * Lazy loading scripts that aren’t initially needed

    * Minifying scripts/css

* Utilisation of React Hooks

  * React hooks are a powerful tool to extract logic that is reused between components and centralise it to improve maintainability of our services.

  * Hooks are also a great way to access a piece of shared data rather than passing it down between layers upon layers of components.

* Minimal Business Logic in Frontend

  * Business logic should be shielded from the front end to make visual changes maintainable and require less chance of messing up logic.

  * Logic should be kept in our backend services and our front end should essentially be a dumb renderer of data and content.
