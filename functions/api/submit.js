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

const normalizeEmailAddress = (value) => String(value ?? '').replace(/[\r\n<>,]+/g, '').trim();

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

const buildReportSections = (payload) => {
  const quoteData = payload.quoteData || {};
  const answers = payload.answers || {};
  const scoreData = payload.scoreData || {};
  const age = calculateAge(quoteData.dob);

  return [
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
        ['Birthdate', quoteData.dob],
        ['Age', age ?? '-'],
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
      title: 'Fortress Score',
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
};

const formatLeadText = (payload) => {
  const lines = ['New Financial Foundation Lead', ''];

  buildReportSections(payload).forEach((section) => {
    lines.push(section.title);
    section.rows.forEach(([label, value]) => {
      lines.push(`${label}: ${valueOrDash(value)}`);
    });
    lines.push('');
  });

  lines.push('Full JSON Payload:', JSON.stringify(payload, null, 2));

  return lines.join('\n');
};

const formatLeadHtml = (payload) => {
  const sections = buildReportSections(payload)
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
      <h1 style="font-size:20px;margin:0 0 16px;">New Financial Foundation Lead</h1>
      ${sections}
      <h2 style="font-size:16px;margin:24px 0 8px;">Full JSON Payload</h2>
      <pre style="white-space:pre-wrap;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:12px;font-size:12px;">${escapeHtml(
        JSON.stringify(payload, null, 2)
      )}</pre>
    </div>
  `;
};

export async function onRequestPost({ request, env }) {
  try {
    if (!env.CLOUDFLARE_ACCOUNT_ID || !env.CLOUDFLARE_EMAIL_API_TOKEN) {
      return jsonResponse({ error: 'Missing Cloudflare Email REST API configuration.' }, 500);
    }

    if (!env.EMAIL_TO || !env.EMAIL_FROM) {
      return jsonResponse({ error: 'Missing EMAIL_TO or EMAIL_FROM environment variable.' }, 500);
    }

    const payload = await request.json();
    const quoteData = payload.quoteData || {};

    if (!quoteData.name || !quoteData.phone || !quoteData.consent) {
      return jsonResponse({ error: 'Missing required lead fields.' }, 400);
    }

    const from = normalizeEmailAddress(env.EMAIL_FROM);
    const to = normalizeEmailAddress(env.EMAIL_TO);
    const subject = `New Financial Foundation Lead: ${quoteData.name}`;
    const emailResponse = await fetch(`https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ACCOUNT_ID}/email/sending/send`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.CLOUDFLARE_EMAIL_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        to,
        from,
        subject,
        text: formatLeadText(payload),
        html: formatLeadHtml(payload)
      })
    });

    const result = await emailResponse.json();

    if (!emailResponse.ok || !result.success) {
      console.error('Cloudflare Email REST API failed:', JSON.stringify(result));
      const message = result.errors?.[0]?.message || 'Cloudflare Email REST API failed.';
      return jsonResponse({ error: message }, emailResponse.status || 500);
    }

    return jsonResponse({ ok: true, result: result.result });
  } catch (error) {
    console.error('Email sending failed:', error.message);
    return jsonResponse({ error: 'Submission failed.' }, 500);
  }
}
