import { findDefaultAgent, getDefaultAgentSlug, toPublicAgent } from '../lib/agents.js';

const jsonResponse = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store'
    }
  });

export async function onRequestGet({ env }) {
  const defaultSlug = getDefaultAgentSlug(env);

  if (!defaultSlug) {
    return jsonResponse({ error: 'No default agent is configured.', defaultConfigured: false }, 404);
  }

  const agent = findDefaultAgent(env);

  if (!agent || agent.status !== 'active') {
    return jsonResponse({ error: 'Default agent is unavailable.', defaultConfigured: true }, 503);
  }

  return jsonResponse({ agent: toPublicAgent(agent), defaultConfigured: true });
}
