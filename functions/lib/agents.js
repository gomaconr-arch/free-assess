const RESERVED_SLUGS = new Set(['api', 'assets', 'favicon.svg', 'thumbnail.jpg', 'social-preview.jpeg']);

const cleanString = (value) => String(value ?? '').trim();

export const normalizeAgentSlug = (value) =>
  cleanString(value)
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

const normalizeAgent = (agent) => {
  const slug = normalizeAgentSlug(agent?.slug);

  if (!slug || RESERVED_SLUGS.has(slug)) {
    return null;
  }

  return {
    slug,
    agentName: cleanString(agent.agentName || agent.name),
    agentEmail: cleanString(agent.agentEmail || agent.email),
    toolName: cleanString(agent.toolName) || 'Financial Foundation Check',
    headline: cleanString(agent.headline) || 'Check your financial foundation in minutes',
    subheadline:
      cleanString(agent.subheadline) ||
      'Answer a few questions and get a personalized readiness snapshot.',
    status: cleanString(agent.status || 'active').toLowerCase(),
    externalSystemEndpoint: cleanString(agent.externalSystemEndpoint || agent.webhookUrl)
  };
};

export const parseAgents = (env = {}) => {
  const rawAgents = cleanString(env.AGENTS_JSON);

  if (!rawAgents) {
    return [];
  }

  try {
    const parsed = JSON.parse(rawAgents);
    const agents = Array.isArray(parsed) ? parsed : parsed.agents;

    if (!Array.isArray(agents)) {
      console.error('AGENTS_JSON must be an array or an object with an agents array.');
      return [];
    }

    return agents.map(normalizeAgent).filter(Boolean);
  } catch (error) {
    console.error('Unable to parse AGENTS_JSON:', error.message);
    return [];
  }
};

export const findAgentBySlug = (env, slug) => {
  const normalizedSlug = normalizeAgentSlug(slug);

  if (!normalizedSlug) {
    return null;
  }

  return parseAgents(env).find((agent) => agent.slug === normalizedSlug) || null;
};

export const getDefaultAgentSlug = (env = {}) => normalizeAgentSlug(env.DEFAULT_AGENT_SLUG);

export const findDefaultAgent = (env = {}) => {
  const defaultSlug = getDefaultAgentSlug(env);

  if (!defaultSlug) {
    return null;
  }

  return findAgentBySlug(env, defaultSlug);
};

export const toPublicAgent = (agent) => ({
  slug: agent.slug,
  agentName: agent.agentName,
  toolName: agent.toolName,
  headline: agent.headline,
  subheadline: agent.subheadline,
  status: agent.status
});
