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

const calculateAge = (dob) => {
  if (!dob) {
    return null;
  }

  const birthDate = new Date(dob);

  if (Number.isNaN(birthDate.getTime())) {
    return null;
  }

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age -= 1;
  }

  return age;
};

const escapeHtml = (value) =>
  String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

const formatLeadText = (payload) => {
  const quoteData = payload.quoteData || {};
  const answers = payload.answers || {};
  const scoreData = payload.scoreData || {};
  const age = calculateAge(quoteData.dob);

  return [
    'New Financial Foundation Lead',
    '',
    `Name: ${valueOrDash(quoteData.name)}`,
    `Contact: ${valueOrDash(quoteData.phone)}`,
    `Email: ${valueOrDash(quoteData.email)}`,
    `Age: ${valueOrDash(age)}`,
    `Budget: ${valueOrDash(quoteData.budget)}`,
    `Fortress Score: ${scoreData.score != null ? `${scoreData.score}/100` : '-'}`,
    `Priority Goal: ${valueOrDash(quoteData.goal || answers.priorities)}`,
    `Emergency Fund: ${valueOrDash(answers.emergencyFund)}`,
    `Existing Protection: ${valueOrDash(answers.protection)}`,
    '',
    'Full JSON Payload:',
    JSON.stringify(payload, null, 2)
  ].join('\n');
};

const formatLeadHtml = (payload) => {
  const quoteData = payload.quoteData || {};
  const answers = payload.answers || {};
  const scoreData = payload.scoreData || {};
  const age = calculateAge(quoteData.dob);

  const rows = [
    ['Name', quoteData.name],
    ['Contact', quoteData.phone],
    ['Email', quoteData.email],
    ['Age', age ?? '-'],
    ['Budget', quoteData.budget],
    ['Fortress Score', scoreData.score != null ? `${scoreData.score}/100` : '-'],
    ['Priority Goal', quoteData.goal || valueOrDash(answers.priorities)],
    ['Emergency Fund', answers.emergencyFund],
    ['Existing Protection', answers.protection],
    ['Submitted At', payload.submittedAt]
  ];

  const tableRows = rows
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;font-weight:700;color:#334155;">${escapeHtml(label)}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;color:#0f172a;">${escapeHtml(valueOrDash(value))}</td>
        </tr>`
    )
    .join('');

  return `
    <div style="font-family:Arial,sans-serif;color:#0f172a;line-height:1.5;">
      <h1 style="font-size:20px;margin:0 0 16px;">New Financial Foundation Lead</h1>
      <table style="border-collapse:collapse;width:100%;max-width:720px;border:1px solid #e2e8f0;">
        <tbody>${tableRows}</tbody>
      </table>
      <h2 style="font-size:16px;margin:24px 0 8px;">Full JSON Payload</h2>
      <pre style="white-space:pre-wrap;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:12px;font-size:12px;">${escapeHtml(
        JSON.stringify(payload, null, 2)
      )}</pre>
    </div>
  `;
};

export async function onRequestPost({ request, env }) {
  try {
    if (!env.SEND_EMAIL) {
      return jsonResponse({ error: 'Missing SEND_EMAIL binding.' }, 500);
    }

    if (!env.EMAIL_TO || !env.EMAIL_FROM) {
      return jsonResponse({ error: 'Missing EMAIL_TO or EMAIL_FROM environment variable.' }, 500);
    }

    const payload = await request.json();
    const quoteData = payload.quoteData || {};

    if (!quoteData.name || !quoteData.phone || !quoteData.consent) {
      return jsonResponse({ error: 'Missing required lead fields.' }, 400);
    }

    const result = await env.SEND_EMAIL.send({
      to: env.EMAIL_TO,
      from: env.EMAIL_FROM,
      subject: `New Financial Foundation Lead: ${quoteData.name}`,
      html: formatLeadHtml(payload),
      text: formatLeadText(payload)
    });

    return jsonResponse({ ok: true, messageId: result.messageId });
  } catch (error) {
    console.error('Email sending failed:', error.code, error.message);
    return jsonResponse({ error: 'Submission failed.' }, 500);
  }
}
