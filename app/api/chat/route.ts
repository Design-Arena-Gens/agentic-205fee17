import { z } from 'zod';
import OpenAI from 'openai';

export const runtime = 'nodejs';

const MessageSchema = z.object({
  id: z.string(),
  role: z.enum(['system', 'user', 'assistant']),
  content: z.string()
});

const BodySchema = z.object({
  messages: z.array(MessageSchema),
  model: z.string().default('gpt-4o-mini')
});

function buildPrompt(messages: Array<{ role: string; content: string }>) {
  // Convert to OpenAI format and ensure a default system prompt exists
  const hasSystem = messages.some(m => m.role === 'system');
  const base: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = hasSystem
    ? []
    : [{ role: 'system', content: 'You are a helpful, concise AI assistant.' }];
  for (const m of messages) {
    if (m.role === 'system' || m.role === 'user' || m.role === 'assistant') {
      base.push({ role: m.role, content: m.content });
    }
  }
  return base;
}

function mockReply(latestUser: string) {
  const suggestions = [
    'Would you like a concise summary or a step-by-step guide?',
    'Should I provide examples or code snippets?',
    'I can compare pros/cons or give best practices.'
  ];
  return [
    `Here?s a thoughtful response based on your message:`,
    '',
    summarize(latestUser),
    '',
    'Next steps:',
    `- ${suggestions[0]}`,
    `- ${suggestions[1]}`,
    `- ${suggestions[2]}`
  ].join('\n');
}

function summarize(text: string) {
  const t = text.trim();
  if (t.length <= 220) return `?${t}?`;
  // naive summarization
  const words = t.split(/\s+/);
  return `?${words.slice(0, 60).join(' ')} ??`;
}

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const { messages, model } = BodySchema.parse(json);

    const latestUser = [...messages].reverse().find(m => m.role === 'user')?.content ?? '';

    const apiKey = process.env.OPENAI_API_KEY;
    if (apiKey) {
      const client = new OpenAI({ apiKey });
      const response = await client.chat.completions.create({
        model,
        messages: buildPrompt(messages),
        temperature: 0.4,
        max_tokens: 800
      });
      const reply = response.choices[0]?.message?.content || mockReply(latestUser);
      return Response.json({ reply });
    }

    // Fallback deterministic reply when no API key is configured
    const reply = mockReply(latestUser);
    return Response.json({ reply });
  } catch (err: unknown) {
    return new Response(JSON.stringify({ error: 'Invalid request' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }
}
