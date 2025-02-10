# Content Script Generation

## Content Types

To generate Content Type scripts, you will need to have the contentful cli installed and be authentication with it.

### Generating the Content Type script

To generate the script, run the following command:

```bash
contentful merge export --space-id <space> --te <target> --se <source> --output-file <output_name>
```

### Applying the Content Type script

To apply this change to an environment, run the following command:

```bash
contentful space migration --space-id <space> --environment-id <target> --yes <migration_file>
```

We then need to verify that the script contains all required changes using the Merge app in the Contentful web application, as sometimes it misses a change.

The script then needs to be touched up manually if any issues arise.

## Content

To generate Content scripts, we need to have the contentful-merge cli installed, and the Content Types for environments you are comparing must be an exact match.

### Generating the Content change set

To get the initial change set, run the following command:

```bash
contentful-merge create --cda-token <cda_token> --space <space> --source <source> --target <target> --output-file <output_file>
```

This CLI also is not perfect, so we need to manually review the change set to ensure it is appropriate:

1. Ensure no Content in master is being overriden or deleted that is newer than what our branch contains.

2. We must re-order our Content additions to ensure no items reference something that does not exist. We have created a script to do this re-ordering which is contained in the `scripts` folder and can be run with the following command:

```bash
node scripts/content-reorder.js --input <input_file> --output <output_file>
```

### Applying the Content change set

To apply the verified change set, run the following command:

```bash
contentful-merge apply --cma-token <cma_token> --space <space> --environment <target> --file <content_changeset> --yes
```

## Verifying Content scripts

Once our scripts are generated, we should run them against a clean copy of master and run a smoke test against this environment to ensure things are working as expected.

1. Create new environment from master
2. Apply Content Type script
3. Apply Content changes
4. Smoke test locally against this environment
5. Point UAT to this environment for verification prior to go-live
