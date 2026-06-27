import { findAgentBySlug, getDefaultAgentSlug, normalizeAgentSlug } from '../lib/agents.js';

const jsonResponse = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json'
    }
  });

const valueOrDash = (value) => {
  if (Array.isArray(value)) {
    return value.length ? value.join(', ') : '-';
  }

  return value || '-';
};

const normalizeAge = (value) => {
  const age = Number(value);
  return Number.isFinite(age) && age >= 18 && age <= 99 ? Math.round(age) : null;
};

const escapeHtml = (value) =>
  String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

const normalizeEmailAddress = (value) => String(value ?? '').replace(/[\r\n<>,]+/g, '').trim();

const isEmailAddress = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizeEmailAddress(value));

const shouldRequireExternalForward = (env) => String(env.REQUIRE_EXTERNAL_FORWARD || '').toLowerCase() === 'true';

const OPTION_LABELS = {
  stage: {
    single_nodep: 'Single, no dependents',
    single_dep: 'Single, supporting family',
    married_nodep: 'Married, no kids yet',
    married_dep: 'Married, with kids'
  },
  income_stability: {
    very_stable: 'Very stable (Fixed salary)',
    somewhat: 'Somewhat stable (Variable/Freelance)',
    unpredictable: 'Unpredictable (Business/Gig)'
  },
  savings_habit: {
    consistent: 'I save a portion consistently',
    sometimes: 'I save whatever is left over',
    struggling: 'Hard to save right now'
  },
  emergencyFund: {
    1: 'Less than 1 month',
    2: '1 to 3 months',
    3: '3 to 6 months',
    4: 'More than 6 months'
  },
  protection: {
    hmo: 'Company HMO / Health Card',
    health_ins: 'Personal Health Insurance',
    life_ins: 'Life Insurance',
    critical: 'Critical Illness Coverage',
    none: 'None of the above yet'
  },
  dependents: {
    kids: 'Children',
    spouse: 'Spouse/Partner',
    parents: 'Parents/Siblings',
    none: 'No one right now'
  },
  priorities: {
    save: 'Build Emergency Fund',
    protect: 'Protect Family/Income',
    debt: 'Manage/Clear Debt',
    invest: 'Grow Wealth / Invest',
    health: 'Prepare a Health Fund'
  },
  goal: {
    family: 'Family Protection',
    health: 'Health & Illness Coverage',
    savings: 'Savings + Protection',
    invest: 'Investment Growth',
    explore: 'Still Exploring'
  },
  budget: {
    '<1500': 'Below PHP 1,500 / month',
    '1500-3000': 'PHP 1,500 - PHP 3,000 / month',
    '3000-5000': 'PHP 3,000 - PHP 5,000 / month',
    '5000+': 'PHP 5,000+ / month',
    unsure: 'Not sure yet'
  },
  gender: {
    Male: 'Male',
    Female: 'Female'
  }
};

const labelValue = (field, value) => {
  if (Array.isArray(value)) {
    return value.length ? value.map((item) => OPTION_LABELS[field]?.[item] || item).join(', ') : '-';
  }

  return OPTION_LABELS[field]?.[value] || valueOrDash(value);
};

const buildReportSections = (payload, agent = null) => {
  const quoteData = payload.quoteData || {};
  const answers = payload.answers || {};
  const scoreData = payload.scoreData || {};
  const age = normalizeAge(quoteData.age);
  const birthYear = quoteData.birthYear || (age ? new Date().getFullYear() - age : null);

  const sections = [
    {
      title: 'Lead Contact',
      rows: [
        ['Name', quoteData.name],
        ['Mobile Number', quoteData.phone],
        ['Email Address', quoteData.email],
        ['Consent', quoteData.consent ? 'Yes, agreed to email and follow-up guidance' : 'No']
      ]
    },
    {
      title: 'Life Snapshot',
      rows: [
        ['Life Stage', labelValue('stage', answers.stage)],
        ['Age (Year)', age && birthYear ? `${age} (${birthYear})` : '-'],
        ['Gender', labelValue('gender', quoteData.gender)]
      ]
    },
    {
      title: 'Cash Flow Check',
      rows: [
        ['Income Stability', labelValue('income_stability', answers.income_stability)],
        ['Savings Habit', labelValue('savings_habit', answers.savings_habit)]
      ]
    },
    {
      title: 'Safety Net',
      rows: [['Emergency Fund Coverage', labelValue('emergencyFund', answers.emergencyFund)]]
    },
    {
      title: 'Protection',
      rows: [
        ['Existing Protection', labelValue('protection', answers.protection)],
        ['Dependents', labelValue('dependents', answers.dependents)]
      ]
    },
    {
      title: 'Goals & Direction',
      rows: [['Top Priorities', labelValue('priorities', answers.priorities)]]
    },
    {
      title: 'Quote Review',
      rows: [
        ['Primary Focus', labelValue('goal', quoteData.goal)],
        ['Comfort Range', labelValue('budget', quoteData.budget)]
      ]
    },
    {
      title: 'Financial Foundation Score',
      rows: [
        ['Overall Score', scoreData.score != null ? `${scoreData.score}/100` : '-'],
        ['Persona', scoreData.persona?.title],
        ['Cash Flow & Income', scoreData.breakdown?.cashflow != null ? `${scoreData.breakdown.cashflow}/25` : '-'],
        ['Emergency Safety Net', scoreData.breakdown?.emergency != null ? `${scoreData.breakdown.emergency}/20` : '-'],
        ['Protection Coverage', scoreData.breakdown?.protection != null ? `${scoreData.breakdown.protection}/30` : '-'],
        ['Goals & Direction', scoreData.breakdown?.goals != null ? `${scoreData.breakdown.goals}/25` : '-'],
        ['Recommended Next Step', scoreData.cta?.buttonText],
        ['Submitted At', payload.submittedAt]
      ]
    }
  ];

  if (agent) {
    sections.unshift({
      title: 'Agent Routing',
      rows: [
        ['Agent', agent.agentName],
        ['Agent Slug', agent.slug],
        ['Tool Name', agent.toolName]
      ]
    });
  }

  return sections;
};

const formatLeadText = (payload, agent = null) => {
  const lines = [agent?.toolName ? `New ${agent.toolName} Lead` : 'New Financial Foundation Lead', ''];

  buildReportSections(payload, agent).forEach((section) => {
    lines.push(section.title);
    section.rows.forEach(([label, value]) => {
      lines.push(`${label}: ${valueOrDash(value)}`);
    });
    lines.push('');
  });

  lines.push('Full JSON Payload:', JSON.stringify(payload, null, 2));

  return lines.join('\n');
};

const formatLeadHtml = (payload, agent = null) => {
  const sections = buildReportSections(payload, agent)
    .map((section) => {
      const tableRows = section.rows
        .map(
          ([label, value]) => `
            <tr>
              <td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;font-weight:700;color:#334155;width:34%;">${escapeHtml(label)}</td>
              <td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;color:#0f172a;">${escapeHtml(valueOrDash(value))}</td>
            </tr>`
        )
        .join('');

      return `
        <h2 style="font-size:16px;margin:22px 0 8px;color:#0f172a;">${escapeHtml(section.title)}</h2>
        <table style="border-collapse:collapse;width:100%;max-width:760px;border:1px solid #e2e8f0;">
          <tbody>${tableRows}</tbody>
        </table>`;
    })
    .join('');

  return `
    <div style="font-family:Arial,sans-serif;color:#0f172a;line-height:1.5;">
      <h1 style="font-size:20px;margin:0 0 16px;">${escapeHtml(agent?.toolName ? `New ${agent.toolName} Lead` : 'New Financial Foundation Lead')}</h1>
      ${sections}
      <h2 style="font-size:16px;margin:24px 0 8px;">Full JSON Payload</h2>
      <pre style="white-space:pre-wrap;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:12px;font-size:12px;">${escapeHtml(
        JSON.stringify(payload, null, 2)
      )}</pre>
    </div>
  `;
};

const formatContactCopyText = (payload) => {
  const quoteData = payload.quoteData || {};
  const scoreData = payload.scoreData || {};

  return [
    `Hi ${quoteData.name || 'there'},`,
    '',
    `Your Financial Foundation Score is ${scoreData.score ?? '-'}/100.`,
    scoreData.persona?.title ? `Profile: ${scoreData.persona.title}` : null,
    labelValue('goal', quoteData.goal) ? `Suggested focus: ${labelValue('goal', quoteData.goal)}` : null,
    labelValue('budget', quoteData.budget) ? `Selected comfort range: ${labelValue('budget', quoteData.budget)}` : null,
    '',
    'Your beginner-friendly roadmap is being reviewed and matched to the profile you submitted.',
    'No payment or application is required.'
  ]
    .filter(Boolean)
    .join('\n');
};

const formatContactCopyHtml = (payload) => {
  const quoteData = payload.quoteData || {};
  const scoreData = payload.scoreData || {};

  return `
    <div style="font-family:Arial,sans-serif;color:#0f172a;line-height:1.5;">
      <h1 style="font-size:22px;margin:0 0 10px;">Your Financial Foundation Score is ${escapeHtml(scoreData.score ?? '-')}/100</h1>
      <p style="margin:0 0 18px;color:#475569;">Hi ${escapeHtml(quoteData.name || 'there')}, your profile summary is ready.</p>
      <table style="border-collapse:collapse;width:100%;max-width:620px;border:1px solid #e2e8f0;margin-bottom:18px;">
        <tbody>
          <tr>
            <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;font-weight:700;color:#334155;width:38%;">Profile</td>
            <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;color:#0f172a;">${escapeHtml(scoreData.persona?.title || '-')}</td>
          </tr>
          <tr>
            <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;font-weight:700;color:#334155;">Suggested Focus</td>
            <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;color:#0f172a;">${escapeHtml(labelValue('goal', quoteData.goal))}</td>
          </tr>
          <tr>
            <td style="padding:10px 12px;font-weight:700;color:#334155;">Comfort Range</td>
            <td style="padding:10px 12px;color:#0f172a;">${escapeHtml(labelValue('budget', quoteData.budget))}</td>
          </tr>
        </tbody>
      </table>
      <p style="margin:0;color:#475569;">Your beginner-friendly roadmap is being reviewed and matched to the profile you submitted. No payment or application is required.</p>
    </div>
  `;
};

const postCloudflareEmail = async ({ env, body }) => {
  const emailResponse = await fetch(`https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ACCOUNT_ID}/email/sending/send`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.CLOUDFLARE_EMAIL_API_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  const result = await emailResponse.json();
  return { emailResponse, result };
};

const sendCloudflareEmail = async ({ env, to, from, replyTo, subject, text, html }) => {
  const body = {
    to,
    from,
    subject,
    text,
    html
  };

  if (!replyTo) {
    return postCloudflareEmail({ env, body });
  }

  const responseWithReplyTo = await postCloudflareEmail({
    env,
    body: {
      ...body,
      reply_to: replyTo
    }
  });

  const errorText = JSON.stringify(responseWithReplyTo.result?.errors || responseWithReplyTo.result || '');

  if (responseWithReplyTo.emailResponse.ok || !/reply|unknown|field|schema|invalid/i.test(errorText)) {
    return responseWithReplyTo;
  }

  console.error('Cloudflare Email REST API rejected reply_to; retrying without Reply-To header.');
  return postCloudflareEmail({ env, body });
};

const forwardAssessmentPayload = async ({ env, agent, payload }) => {
  const endpoint = agent?.externalSystemEndpoint || env.EXTERNAL_SYSTEM_ENDPOINT;

  if (!endpoint) {
    return { attempted: false, sent: false, skipped: true };
  }

  const headers = {
    'Content-Type': 'application/json'
  };

  if (env.EXTERNAL_SYSTEM_API_TOKEN) {
    headers.Authorization = `Bearer ${env.EXTERNAL_SYSTEM_API_TOKEN}`;
  }

  if (env.EXTERNAL_SYSTEM_SHARED_SECRET) {
    headers['X-Assessment-Secret'] = env.EXTERNAL_SYSTEM_SHARED_SECRET;
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload)
  });

  let result = null;

  try {
    result = await response.json();
  } catch {
    result = { statusText: response.statusText };
  }

  if (!response.ok) {
    throw new Error(result?.error || result?.message || `External forwarding failed with status ${response.status}.`);
  }

  console.log(
    'External assessment forwarding response:',
    JSON.stringify({
      ok: result?.ok,
      leadId: result?.leadId,
      recommendationId: result?.recommendationId
    })
  );

  return { attempted: true, sent: true, status: response.status, result };
};

export async function onRequestPost({ request, env }) {
  try {
    if (!env.CLOUDFLARE_ACCOUNT_ID || !env.CLOUDFLARE_EMAIL_API_TOKEN) {
      return jsonResponse({ error: 'Missing Cloudflare Email REST API configuration.' }, 500);
    }

    if (!env.EMAIL_FROM) {
      return jsonResponse({ error: 'Missing EMAIL_FROM environment variable.' }, 500);
    }

    const payload = await request.json();
    const quoteData = payload.quoteData || {};
    const submittedAgentSlug = normalizeAgentSlug(payload.agentSlug || payload.agent?.slug);
    const defaultAgentSlug = getDefaultAgentSlug(env);
    const agentSlug = submittedAgentSlug || defaultAgentSlug;
    const agent = agentSlug ? findAgentBySlug(env, agentSlug) : null;

    if (submittedAgentSlug && (!agent || agent.status !== 'active')) {
      return jsonResponse({ error: 'This agent link is unavailable.' }, 404);
    }

    if (!submittedAgentSlug && defaultAgentSlug && (!agent || agent.status !== 'active')) {
      return jsonResponse({ error: 'Default agent routing is unavailable.' }, 500);
    }

    if (!agent && !env.EMAIL_TO) {
      return jsonResponse({ error: 'Missing agent routing or EMAIL_TO fallback.' }, 500);
    }

    if (!quoteData.name || !quoteData.phone || !quoteData.email || !quoteData.consent) {
      return jsonResponse({ error: 'Missing required lead fields.' }, 400);
    }

    const from = normalizeEmailAddress(env.EMAIL_FROM);
    const to = normalizeEmailAddress(agent?.agentEmail || env.EMAIL_TO);
    const contactEmail = normalizeEmailAddress(quoteData.email);

    if (!isEmailAddress(contactEmail)) {
      return jsonResponse({ error: 'Please enter a valid email address.' }, 400);
    }

    if (!isEmailAddress(to)) {
      return jsonResponse({ error: 'Agent email routing is not valid.' }, 500);
    }

    const subject = `New Financial Foundation Lead: ${quoteData.name}`;
    const { emailResponse, result } = await sendCloudflareEmail({
      env,
      to,
      from,
      replyTo: contactEmail,
      subject,
      text: formatLeadText(payload, agent),
      html: formatLeadHtml(payload, agent)
    });

    if (!emailResponse.ok || !result.success) {
      console.error('Cloudflare Email REST API failed:', JSON.stringify(result));
      const message = result.errors?.[0]?.message || 'Cloudflare Email REST API failed.';
      return jsonResponse({ error: message }, emailResponse.status || 500);
    }

    let contactCopy = { sent: false };

    if (String(env.SEND_CONTACT_COPY || '').toLowerCase() === 'true') {
      const copySubject = 'Your Financial Foundation Score and Roadmap';
      const copyResponse = await sendCloudflareEmail({
        env,
        to: contactEmail,
        from,
        subject: copySubject,
        text: formatContactCopyText(payload),
        html: formatContactCopyHtml(payload)
      });

      if (!copyResponse.emailResponse.ok || !copyResponse.result.success) {
        console.error('Cloudflare contact copy failed:', JSON.stringify(copyResponse.result));
        contactCopy = {
          sent: false,
          error: copyResponse.result.errors?.[0]?.message || 'Contact copy failed.'
        };
      } else {
        contactCopy = { sent: true };
      }
    }

    let forwarding = { attempted: false, sent: false };

    try {
      forwarding = await forwardAssessmentPayload({ env, agent, payload });
    } catch (error) {
      console.error('External assessment forwarding failed:', error.message);

      forwarding = {
        attempted: true,
        sent: false,
        error: error.message
      };

      if (shouldRequireExternalForward(env)) {
        return jsonResponse({ error: error.message, emailSent: true, contactCopy, forwarding }, 502);
      }
    }

    return jsonResponse({ ok: true, result: result.result, contactCopy, forwarding });
  } catch (error) {
    console.error('Email sending failed:', error.message);
    return jsonResponse({ error: 'Submission failed.' }, 500);
  }
}
