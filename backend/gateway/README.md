## Local Environment Setup

1.  **[OPTIONAL] Replace variables in the environment file**

    | Variable                  | Location                                                                                                                 |
    | ------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
    | CONTENTFUL_ALIAS          | [Fetch from Contentful](https://app.contentful.com/) or leave `master` to target current production environment          |
    | HORIZONS_CONTENTFUL_ALIAS | [Fetch from Horizons Contentful](https://app.contentful.com/) or leave `master` to target current production environment |

2.  **Check your mesh configuration**

    Ensure your relevant subgraphs are defined in the `mesh.config.ts`.

    By default, the config is set up to target your local GraphQL Subgraphs (located under the `backend/subgraphs` folder.)

    You can target other environments in your `mesh.config.ts` with `https://supergraph-gateway-dev.ractest.com.au/graphql` or `https://supergraph-gateway-sit.ractest.com.au/graphql`.

3.  **Generate and run the Gateway Locally**

    You have multiple methods to run the gateway locally, choose what works best for you:

    **1. Visual Studio Code Task**

    - Ensure you are in Visual Studio Code
    - Terminal > Run Task > Run GraphQL Gateway (Local)

    **2. pnpm Command**

    - Run `pnpm gateway` from the root of this repository

    **3. Command Line (PowerShell)**

    - Open PowerShell
    - Navigate to the `rac-digital/backend` folder
    - In PowerShell, run `.\run-supergraph-gateway.ps1`
