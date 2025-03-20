# RAC Digital Monorepo

[![Codacy Badge](https://app.codacy.com/project/badge/Grade/174280b5ea15407eaf6a964a47451549)](https://app.codacy.com?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)
[![Codacy Badge](https://app.codacy.com/project/badge/Coverage/174280b5ea15407eaf6a964a47451549)](https://app.codacy.com?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_coverage)

Current status for each frontend and backend pipeline within the Digital Platform.

| Application                 | Pipeline Status                                                                                                                                                                                                                      |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Codacy**                  | [![Codacy](https://github.com/racwa/rac-digital/actions/workflows/ci_codacy.yaml/badge.svg?branch=main)](https://github.com/racwa/rac-digital/actions/workflows/ci_codacy.yaml)                                                      |
| **Chromatic**               | [![Chromatic](https://github.com/racwa/rac-digital/actions/workflows/chromatic_release.yaml/badge.svg?branch=main)](https://github.com/racwa/rac-digital/actions/workflows/chromatic_release.yaml)                                   |
| **Trivy Cache**             | [![Trivy Cache](https://github.com/racwa/rac-digital/actions/workflows/trivy_cache.yaml/badge.svg?branch=main)](https://github.com/racwa/rac-digital/actions/workflows/trivy_cache.yaml)                                             |
| **Common**                  | [![Identity](https://github.com/racwa/rac-digital/actions/workflows/common_ci.yaml/badge.svg?branch=main)](https://github.com/racwa/rac-digital/actions/workflows/common_ci.yaml)                                                    |
| **Identity**                | [![Identity](https://github.com/racwa/rac-digital/actions/workflows/identity_ci.yaml/badge.svg?branch=main)](https://github.com/racwa/rac-digital/actions/workflows/identity_ci.yaml)                                                |
| **Identity Static Content** | [![Identity (Static Content)](https://github.com/racwa/rac-digital/actions/workflows/identity_static_content_ci.yaml/badge.svg?branch=main)](https://github.com/racwa/rac-digital/actions/workflows/identity_static_content_ci.yaml) |
| **Motoring**                | [![Motoring](https://github.com/racwa/rac-digital/actions/workflows/motoring_ci.yaml/badge.svg?branch=main)](https://github.com/racwa/rac-digital/actions/workflows/motoring_ci.yaml)                                                |
| **myRAC**                   | [![myRAC](https://github.com/racwa/rac-digital/actions/workflows/myrac_ci.yaml/badge.svg?branch=main)](https://github.com/racwa/rac-digital/actions/workflows/myrac_ci.yaml)                                                         |
| **Insurance Subgraph**      | [![Insurance Subgraph](https://github.com/racwa/rac-digital/actions/workflows/subgraph_insurance_release.yaml/badge.svg?branch=main)](https://github.com/racwa/rac-digital/actions/workflows/subgraph_insurance_release.yaml)        |
| **Membership Subgraph**     | [![Membership Subgraph](https://github.com/racwa/rac-digital/actions/workflows/subgraph_membership_release.yaml/badge.svg?branch=main)](https://github.com/racwa/rac-digital/actions/workflows/subgraph_membership_release.yaml)     |
| **Motoring Subgraph**       | [![Motoring Subgraph](https://github.com/racwa/rac-digital/actions/workflows/subgraph_motoring_release.yaml/badge.svg?branch=main)](https://github.com/racwa/rac-digital/actions/workflows/subgraph_motoring_release.yaml)           |
| **Person Subgraph**         | [![Person Subgraph](https://github.com/racwa/rac-digital/actions/workflows/subgraph_person_release.yaml/badge.svg?branch=main)](https://github.com/racwa/rac-digital/actions/workflows/subgraph_person_release.yaml)                 |
| **Supergraph Gateway**      | [![Supergraph Gateway](https://github.com/racwa/rac-digital/actions/workflows/supergraph_gateway_release.yaml/badge.svg?branch=main)](https://github.com/racwa/rac-digital/actions/workflows/supergraph_gateway_release.yaml)        |

<br />

## Contents

- [Prerequisites](#prerequisites)
  - [Read Confluence Documentation](#read-confluence-documentation)
  - [Setup Local Githook](#setup-local-githook)
- [Quick Start](#quick-start)
  - [Domain Application](#domain-application)
  - [Subgraph](#subgraph)
  - [GraphQL Gateway](#graphQL-gateway)
- [Packages Documentation](#quick-start)
  - [Purpose of Packages](#purpose-of-packages)
  - [Development and Maintenance Guidelines](#development-and-maintenance-guidelines)
  - [Communication and Collaboration](#communication-and-collaboration)
  - [Package Example](#package-example)

<br />

# Prerequisites

> [!IMPORTANT]  
> Before you begin development, please ensure you have completed all prerequisite activities first.

<br />

### Read Confluence Documentation

Read the Confluence documentation [here](https://rac-wa.atlassian.net/wiki/spaces/PDP/pages/3534389408/Building+Experiences) regarding how to build an experience.

<br />

### Setup Local Githook

We utilise a githook to keep a reference to your piece of work on each commit you do.\
It will prefix the commit message you create with the branch.

| Commit Message | No Githook Installed | Githook Installed        |
| -------------- | -------------------- | ------------------------ |
| My cool change | My cool change       | DED-9999: My cool change |

This helps with tracking git commit statistics in Jira, and helps discern what changes belong to what cards on a branch.\
Worth noting that since we squash the commits when merging to main, so you should only be seeing what was used for the PR title when viewing the commit history of main.\
But the githook can help when looking at old branches in pull requests that may have had other branches merged into it.

You can install the githook [here](https://github.com/racwa/raci-dev-tools/tree/main/Environment%20Setup).

<br />
<br />

# Quick Start

### Domain Application

The domain applications are the [Next.JS](https://nextjs.org/docs) applications which live under `frontend/apps/`.

<br />

**Setup Dependencies**

```bash
# Install dependencies
pnpm i
```

**Development**

```bash
# Start all development servers
pnpm dev

# Start specific development servers
pnpm dev --filter=@racwa/motoring
```

**Adding a package**

```
pnpm turbo gen package
```

<br />

### Subgraph

The subgraphs are .NET APIs which live under `backend/subgraphs/`.

View README [here](https://github.com/racwa/rac-digital/blob/main/backend/subgraphs/README.md) for setup and configuration instructions.

<br />

### GraphQL Gateway

The GraphQL gateway is located under `backend/gateway/`.

View README [here](https://github.com/racwa/rac-digital/blob/main/backend/gateway/README.md) for setup and configuration instructions.

<br />
<br />

# Packages Documentation

### Purpose of Packages

This monorepo includes a set of packages designed for internal use only. Each package follows these core principles:

1. **Built by the application using it:**
   Packages are built as part of the consuming application, avoiding the overhead of managing separate builders or bundlers.

2. **Internal-Only Scope:**
   Packages are exclusively available within this monorepo. They are not versioned or published externally, simplifying management and development.

3. **Single Responsibility Principle:**
   Each package is designed with a specific purpose. It's preferred to create multiple focused packages rather than a single package attempting to handle too much functionality.

4. **Comprehensive Documentation:**
   Every package includes detailed documentation that describes:
   - The purpose of the package.
   - Instructions for using the package, with examples if applicable.

<br />

### Development and Maintenance Guidelines

- **Testing:**
  All packages must include automated tests to ensure reliability. Tests should cover primary use cases and edge cases as appropriate.

- **Dependency Management:**
  Avoid unnecessary external dependencies. Use shared dependencies within the monorepo consistently to reduce redundancy.

- **Coding Standards:**
  Packages must adhere to shared coding conventions, including linting (ESLint) and formatting (Prettier). Ensure code is clean and maintainable.

- **Ownership:**
  All teams are responsible for its maintenance, including addressing bugs, adding features, and keeping documentation up-to-date.

- **Breaking Changes:**
  When introducing changes that may break existing functionality, coordinate updates across all dependent packages and applications within the monorepo.

<br />

### Communication and Collaboration

Packages should interact with each other using clearly defined contracts (e.g., TypeScript interfaces or APIs). Inter-package dependencies must be explicitly declared and managed to avoid unexpected behaviour.

<br />

### Package Example

Below is a template for documenting each package:

```markdown
# Package Name

## Purpose

Briefly describe the purpose of this package.

## Usage

### Installation

Provide instructions if applicable.

### Examples

Include code snippets showing common usage patterns.

## Notes

Any additional context, limitations, or important information.
```
