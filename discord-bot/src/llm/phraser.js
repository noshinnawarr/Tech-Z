// src/llm/phraser.js
// Rephrases an already-correct formatter string (formatters.js) into a warmer,
// conversational reply using Groq's free-tier API (OpenAI-compatible chat
// completions, running open models like Llama 3 fast). The LLM only rewords the
// text — it never recomputes counts itself, which is what caused vague/wrong
// numbers when it was asked to count devices from raw JSON directly. Falls back
// to the plain formatter text if no key is set or the request fails for any
// reason, so the bot never breaks because of the LLM call.

const { GROQ_API_KEY, GROQ_MODEL } = require('../config');

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

const SYSTEM_PROMPT =
  'You are a friendly office assistant bot replying in a Discord channel. You will be given ' +
  'an already-correct factual summary of office device status or power usage. Rewrite it in ' +
  'a warm, natural, conversational tone — but you must keep every number and room name exactly ' +
  'as given. Never use vague words like "some", "a few", "several", or "a couple" in place of a ' +
  'number — always state the exact count for every room mentioned in the input, for both fans ' +
  'and lights. Do not drop any room, do not invent or recompute numbers, do not add new facts. ' +
  'Keep it to 2-4 sentences. No markdown, no bullet lists, no code blocks, no restating this ' +
  'instruction.\n\n' +
  'Example input: "Drawing Room: 1 fan ON, 2 lights ON.\\nWork Room 1: all off.\\nWork Room 2: ' +
  '2 fans ON, 3 lights ON."\n' +
  'Good output: "Right now the Drawing Room has 1 fan and 2 lights on, Work Room 1 is ' +
  'completely quiet with everything off, and Work Room 2 is busy with 2 fans and all 3 lights on!"';

async function phrase(fallbackText) {
  if (!GROQ_API_KEY) return fallbackText;
  try {
    const res = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        temperature: 0.4,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: fallbackText },
        ],
      }),
    });
    if (!res.ok) throw new Error(`groq ${res.status}`);
    const data = await res.json();
    const text = data.choices?.[0]?.message?.content?.trim();
    return text || fallbackText;
  } catch (err) {
    console.error('LLM phrasing failed (Groq), falling back to template reply:', err.message);
    return fallbackText;
  }
}

module.exports = { phrase };
