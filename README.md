# AI-Assisted Playwright QA Automation

## Overview

This project demonstrates an end-to-end, AI-assisted QA workflow that starts with a Jira user story and produces maintainable Playwright tests. GitHub Copilot is used throughout the process to communicate with the configured MCP servers, interpret requirements, plan and generate tests, investigate failures, update documentation, and support GitHub integration. GitHub MCP provides the repository and GitHub workflow connection.

## QA Workflow

```text
                 GitHub Copilot
                       |
                       v
Jira User Story -> Atlassian MCP -> Playwright Planner -> Test Plan
                                      |
                                      v
                              Playwright Generator
                                      |
                                      v
                                Playwright Tests
                                      |
                                      v
                                Playwright Healer
                                      |
                                      v
                               GitHub MCP -> GitHub
```

## Test Coverage

The project contains exactly four test scenarios:

1. **UI E2E Purchase Flow**  
   Login -> Select Product -> Add to Cart -> Checkout -> Successful Purchase
2. **GET Products API**
3. **GET Product Details API**
4. **POST Order API**

The final Playwright run completed successfully with **12/12 browser test executions passing**.

## Technology

- Playwright Test
- TypeScript
- Playwright MCP
- Atlassian MCP
- GitHub MCP
- GitHub Copilot
- Jira
- GitHub Actions / CI-CD
- HTML Test Reports
- Page Object Model

## Project Structure

```text
.
├── .github/
│   └── workflows/
│       └── playwright.yml       # GitHub Actions workflow
├── .vscode/
│   └── mcp.json                 # MCP server configuration
├── specs/
│   └── README.md                # Test-plan directory notes
├── tests/
│   ├── seed.spec.ts             # UI E2E purchase flow
│   ├── example.spec.ts          # GET Products API
│   ├── get-product-details.spec.ts
│   └── post-order.spec.ts       # POST Order API
├── package.json                 # npm project and dependencies
├── package-lock.json             # Locked dependency versions
├── playwright.config.ts         # Playwright projects and HTML reporter
└── .gitignore                   # Ignored test artifacts and dependencies
```

## Running the Tests

Install dependencies and run the Playwright suite:

```bash
npm install
npx playwright test
npx playwright show-report
```

The Playwright configuration uses the HTML reporter. The GitHub Actions workflow also uploads the generated `playwright-report/` directory as a build artifact.

## Test Browsers

The configured browser projects are:

- Chromium
- Firefox
- WebKit

## AI-Assisted QA Workflow

- **Atlassian MCP** retrieves the Jira requirements for the source user story.
- **Planner** turns the requirements into a structured Playwright test plan.
- **Generator** creates the Playwright Test implementation from the plan.
- **Healer** investigates failing tests, inspects runtime behavior, and applies focused fixes.
- **GitHub Copilot** coordinates the workflow throughout the process, communicating with MCP servers and assisting with planning, implementation, debugging, documentation, and test maintenance.
- **GitHub MCP** supports repository operations and GitHub workflow integration.

## Results

- **12 tests passed**
- **0 failed**
- **HTML report generated**

## Notes

- No hard-coded credentials are used.
- No unnecessary hard-coded waits are used.
- Stable locators and response-based synchronization are used.
- API and UI tests are kept separate.
- Jira issue `QAT-1` remains the source user story.
