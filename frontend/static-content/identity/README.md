# Identity Static Content

This project manages the ADB2C HTML templates used to style the registration flow in myRAC. These templates are built in Astro, exported as HTML then deployed to Azure Storage Accounts

## Running

Locally, they work identically to our other monorepo apps:

```bash
pnpm dev --filter=@racwa/identity-static-content
```

You can then browse to the relevant pages at `localhost:3000`

## Environments

| Environment | Storage Account    | Url                                                  |
| ----------- | ------------------ | ---------------------------------------------------- |
| DEV         | adb2cstaticcontdev | https://adb2cstaticcontdev.ractest.com.au/dev/*.html |
| SIT         | adb2cstaticcontsit | https://adb2cstaticcontsit.ractest.com.au/sit/*.html |
| UAT         |                    |                                                      |
| PRD         |                    |                                                      |

## Templates

The templates in place are:

| Template       | Usage                                                                                |
| -------------- | ------------------------------------------------------------------------------------ |
| sign-up        | Register a new account using email, validating it with OTP and setting your password |
| password-reset | Change a forgotten password after you verify your email with OTP                     |
