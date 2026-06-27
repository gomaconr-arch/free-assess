import { findAgentBySlug, toPublicAgent } from '../../lib/agents.js';

const jsonResponse = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store'
    }
  });

export async function onRequestGet({ params, env }) {
  const agent = findAgentBySlug(env, params.slug);

  if (!agent || agent.status !== 'active') {
    return jsonResponse({ error: 'Agent link is unavailable.' }, 404);
  }

  return jsonResponse({ agent: toPublicAgent(agent) });
}
