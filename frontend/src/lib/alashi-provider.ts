type Input = { type: string; [key: string]: unknown };
export async function alashiResponse(instructions: string, content: Input[], generate = false) {
  if (!process.env.OPENAI_API_KEY) throw new Error('ALASHI’s AI connection is not configured yet. Please contact our team.');
  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST', headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
    signal: AbortSignal.timeout(generate ? 180000 : 60000),
    body: JSON.stringify({ model: process.env.ALASHI_CHAT_MODEL || 'gpt-4.1-mini', store: false, instructions,
      input: [{ role: 'user', content }], max_output_tokens: generate ? 1000 : 1800,
      ...(generate ? { tools: [{ type: 'image_generation' }], tool_choice: { type: 'image_generation' } } : { text: { format: { type: 'json_object' } } }),
    }),
  });
  if (!response.ok) throw new Error('ALASHI’s AI service is temporarily unavailable. Please try again or contact our team.');
  const result = await response.json();
  const text = (result.output || []).flatMap((item: { content?: { type: string; text?: string }[] }) => item.content || []).filter((item: { type: string }) => item.type === 'output_text').map((item: { text: string }) => item.text).join('');
  const image = (result.output || []).find((item: { type: string }) => item.type === 'image_generation_call')?.result;
  if (generate) { if (!image) throw new Error('No image was generated. Please try again.'); return { image: `data:image/png;base64,${image}`, text }; }
  return { text };
}
