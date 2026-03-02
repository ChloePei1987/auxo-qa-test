# Automation Test Suite – Candidate Exercise

## Overview

This repository contains a **minimal Cypress automation suite** created specifically for a technical assessment.

Selectors and logic are mostly kept within step files to keep the setup lightweight.

The purpose of this exercise is not to deliver a production-ready framework, but to understand how you:
- Read and reason about existing automation code
- Improve stability and reliability
- Make sensible testing and design decisions

Some parts of this suite are intentionally **basic or slightly unstable** to give you room to improve them.

---

## Tech Stack

- Cypress
- TypeScript
- Cucumber (BDD) via `@badeball/cypress-cucumber-preprocessor`
- Node.js / npm

The setup intentionally avoids heavy abstractions or frameworks.

---

## Prerequisites

- Node.js v18.x or v20.x (LTS recommended)
- npm v9+

---

## Installation

From the root of the repository, install dependencies:

npm install

---

## Configuration

Before running the tests, you must update the login credentials used by Cypress.

In the cypress.env.json file, update the username and password values with the credentials provided to you.

---

## Running the Tests

Open Cypress Test Runner:

npx cypress open

Run Tests Headlessly:

npx cypress run

---

## Project Structure (High Level)
auxo-qa-practical/
├─ cypress/
│  ├─ e2e/
│  │  └─ features/
│  │     └─ job_management/
│  │        └─ jobs.feature     # Gherkin feature file
│  ├─ support/
│  │  ├─ step_definitions/
│  │  │  └─ jobs.steps.ts       # Step definitions for job scenarios
│  │  ├─ commands.ts            # Custom Cypress commands
│  │  └─ e2e.ts                 # Global test setup/support
│  └─ cypress.config.ts         # Cypress configuration
├─ cypress.env.json              # Environment-specific config
├─ package.json                  # Project dependencies and scripts
├─ tsconfig.json                 # TypeScript configuration
└─ README.md                     # Project documentation
