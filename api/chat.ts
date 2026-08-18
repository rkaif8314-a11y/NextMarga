type ChatBody = {
  message?: string;
  profile?: {
    fullName?: string;
    currentClass?: string;
    educationalBoard?: string;
    state?: string;
    city?: string;
    interests?: string[];
    targetPath?: string;
  };
  conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>;
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });

export default async function handler(req: Request) {
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return json({
      reply: 'CareerAI is in demo mode. Add OPENAI_API_KEY to the Vercel project environment variables to enable AI responses.',
      demoMode: true,
    });
  }

  try {
    const body = (await req.json()) as ChatBody;
    const profile = body.profile ?? {};
    const profileSummary = [
      `Name: ${profile.fullName || 'Student'}`,
      `Class/Level: ${profile.currentClass || 'Student'}`,
      `Board: ${profile.educationalBoard || 'Not specified'}`,
      `Location: ${[profile.city, profile.state].filter(Boolean).join(', ') || 'India'}`,
      `Interests: ${(profile.interests || []).join(', ') || 'STEM'}`,
      `Goal: ${profile.targetPath || 'Career exploration'}`,
    ].join('\n');

    const system = `You are NextMarga CareerAI, a precise and encouraging opportunity advisor for students and early-career learners.\n\nStudent profile:\n${profileSummary}\n\nGive practical, age-appropriate guidance about scholarships, competitions, internships, hackathons, research, entrance exams, skills, and career roadmaps. Never invent deadlines or eligibility. When current dates or eligibility matter, tell the user to verify the official organizer source. Use concise headings and bullets.`;

    const history = (body.conversationHistory || []).slice(-8).map((m) => ({
      role: m.role,
      content: m.content,
    }));

    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-5.6',
        instructions: system,
        input: [...history, { role: 'user', content: body.message || 'What opportunities should I prepare for next?' }],
        max_output_tokens: 900,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      console.error('OpenAI error:', data);
      return json({
        reply: 'CareerAI could not complete that request right now. Please try again in a moment.',
        demoMode: true,
      }, 200);
    }

    return json({ reply: data.output_text || 'I could not generate a response. Please try again.' });
  } catch (error) {
    console.error('Chat API error:', error);
    return json({ reply: 'CareerAI is temporarily unavailable. Please try again.', demoMode: true }, 200);
  }
}
