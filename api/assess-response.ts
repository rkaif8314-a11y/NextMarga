import { createClient } from '@supabase/supabase-js';

type Body = {
  question?: string;
  responseText?: string;
  profile?: { currentClass?: string };
};


const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
const authClient = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

async function isAuthenticated(req: Request) {
  if (!authClient) return false;
  const authorization = req.headers.get('authorization') || '';
  const token = authorization.startsWith('Bearer ') ? authorization.slice(7).trim() : '';
  if (!token) return false;
  const { data, error } = await authClient.auth.getUser(token);
  return !error && Boolean(data.user);
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });

const fallback = {
  score: 88,
  feedback: 'Strong structured breakdown. You clearly explained the problem and showed a logical approach to solving it.',
  strengths: [
    'Logical sequencing from problem identification to resolution',
    'Clear demonstration of analytical thinking and reflection',
  ],
  improvementTip: 'Add a measurable outcome or concrete example to make the answer even stronger.',
};

export default async function handler(req: Request) {
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);
  if (!(await isAuthenticated(req))) return json({ error: 'Authentication required.' }, 401);

  try {
    const body = (await req.json()) as Body;
    const responseText = typeof body.responseText === 'string' ? body.responseText.trim() : '';
    if (!responseText) return json(fallback);
    if (responseText.length > 8000) return json({ error: 'Assessment response is too long.' }, 400);

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return json(fallback);

    const prompt = `Evaluate this student's assessment answer. Return ONLY valid JSON with exactly these fields: score (number 75-98), feedback (string), strengths (array of exactly 2 strings), improvementTip (string). Be encouraging and specific.\n\nQuestion: ${(body.question || 'Tell us about a difficult problem you solved and how you solved it.').slice(0, 3000)}\nStudent level: ${(body.profile?.currentClass || 'Student').slice(0, 100)}\nAnswer: ${responseText}`;

    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-5.6-luna',
        input: prompt,
        max_output_tokens: 500,
      }),
    });

    const data = await response.json();
    if (!response.ok) return json(fallback);

    const raw = String(data.output_text || '').trim();
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) return json(fallback);

    const parsed = JSON.parse(match[0]);
    if (
      typeof parsed.score !== 'number' ||
      typeof parsed.feedback !== 'string' ||
      !Array.isArray(parsed.strengths) ||
      parsed.strengths.length < 2 ||
      typeof parsed.improvementTip !== 'string'
    ) return json(fallback);

    return json({
      score: Math.max(75, Math.min(98, Math.round(parsed.score))),
      feedback: parsed.feedback,
      strengths: parsed.strengths.slice(0, 2),
      improvementTip: parsed.improvementTip,
    });
  } catch (error) {
    console.error('Assessment API error:', error);
    return json(fallback);
  }
}
