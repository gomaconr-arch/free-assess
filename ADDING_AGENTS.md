# How To Add A New Agent

This guide is for adding a new agent or advisor to the assessment tool without changing code.

Each agent gets their own link:

```txt
https://assess.lablibre.com/agent_name
```

Example:

```txt
https://assess.lablibre.com/richard
```

When someone submits the form from that link, the assessment email goes to that agent's email address. The same form data is also sent to the connected external system.

## What You Need

Before adding an agent, prepare these details:

- Agent name
- Agent email address
- Agent link name, also called the slug
- Tool name to show on the page
- Headline text
- Short description text
- External system endpoint, if this agent should send data to a specific endpoint

## Agent Fields

Each agent is written as one JSON object:

```json
{
  "slug": "richard",
  "agentName": "Richard Badlisan",
  "agentEmail": "richard@example.com",
  "toolName": "Financial Foundation Check",
  "headline": "Check your financial foundation in minutes",
  "subheadline": "Answer a few quick questions and get a personalized snapshot of your savings, protection, and next best step.",
  "status": "active",
  "externalSystemEndpoint": "https://your-external-system.com/api/assessment-intake"
}
```

## What Each Field Means

`slug`

This is the public link name. If the slug is `richard`, the public link is:

```txt
https://assess.lablibre.com/richard
```

Use lowercase letters, numbers, hyphens, or underscores only. Avoid spaces.

Good examples:

```txt
richard
maria
juan_santos
agent-001
```

Avoid:

```txt
Richard Badlisan
maria@email.com
agent/name
```

`agentName`

The agent's display name.

`agentEmail`

The email address that receives the completed assessment submission.

`toolName`

The tool name shown on the first screen.

`headline`

The main headline shown on the first screen.

`subheadline`

The short supporting text shown below the headline.

`status`

Use `active` when the link should work.

Use `inactive` when the link should stop accepting submissions.

`externalSystemEndpoint`

The API endpoint that receives the same assessment payload. If all agents use the same external endpoint, ask the technical owner whether this field should be filled per agent or handled by the shared `EXTERNAL_SYSTEM_ENDPOINT` setting.

## Add Your First Agent

In Cloudflare Pages, set the `AGENTS_JSON` environment variable to this:

```txt
[{"slug":"richard","agentName":"Richard Badlisan","agentEmail":"richard@example.com","toolName":"Financial Foundation Check","headline":"Check your financial foundation in minutes","subheadline":"Answer a few quick questions and get a personalized snapshot of your savings, protection, and next best step.","status":"active","externalSystemEndpoint":"https://your-external-system.com/api/assessment-intake"}]
```

Then redeploy the Cloudflare Pages project.

The agent link will be:

```txt
https://assess.lablibre.com/richard
```

## Add More Than One Agent

For multiple agents, place each agent object inside the same list.

Example:

```txt
[{"slug":"richard","agentName":"Richard Badlisan","agentEmail":"richard@example.com","toolName":"Financial Foundation Check","headline":"Check your financial foundation in minutes","subheadline":"Answer a few quick questions and get a personalized snapshot of your savings, protection, and next best step.","status":"active","externalSystemEndpoint":"https://your-external-system.com/api/assessment-intake"},{"slug":"maria","agentName":"Maria Santos","agentEmail":"maria@example.com","toolName":"Maria's Financial Foundation Check","headline":"Start with a simple financial readiness check","subheadline":"Answer a few questions so Maria can review your profile and next step.","status":"active","externalSystemEndpoint":"https://your-external-system.com/api/assessment-intake"}]
```

This creates:

```txt
https://assess.lablibre.com/richard
https://assess.lablibre.com/maria
```

## How To Update `AGENTS_JSON` In Cloudflare

1. Open Cloudflare.
2. Go to Workers & Pages.
3. Open this Pages project.
4. Go to Settings.
5. Open Environment variables.
6. Find `AGENTS_JSON`.
7. Paste the updated agent list.
8. Save the variable.
9. Redeploy the Pages project.

If there are separate Production and Preview environment variables, update the correct environment.

## How To Temporarily Disable An Agent

Change:

```json
"status": "active"
```

to:

```json
"status": "inactive"
```

Then save and redeploy.

The link will show an unavailable page instead of accepting submissions.

## Testing Checklist

After adding or editing an agent:

1. Open the agent link.
2. Confirm the page loads.
3. Confirm the tool name, headline, and short description are correct.
4. Submit a test assessment.
5. Confirm the agent receives the email.
6. Confirm replying to the email goes to the submitted lead email.
7. Confirm the external system receives the payload.

## Common Mistakes

Invalid JSON

The full `AGENTS_JSON` value must start with `[` and end with `]`.

Missing comma between agents

Each agent object needs a comma between it and the next agent object.

Wrong email address

The form submission goes to `agentEmail`, so double-check it before testing.

Inactive status

If `status` is `inactive`, the public link will not accept submissions.

Slug typo

If the slug is `maria`, the link must be `/maria`. If someone opens `/maria-santos`, that is a different slug.

## Safe Template

Copy this template when adding a new agent:

```json
{
  "slug": "agent_slug_here",
  "agentName": "Agent Name Here",
  "agentEmail": "agent@example.com",
  "toolName": "Financial Foundation Check",
  "headline": "Check your financial foundation in minutes",
  "subheadline": "Answer a few quick questions and get a personalized snapshot of your savings, protection, and next best step.",
  "status": "active",
  "externalSystemEndpoint": "https://your-external-system.com/api/assessment-intake"
}
```
