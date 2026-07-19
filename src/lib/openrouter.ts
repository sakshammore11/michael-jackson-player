import { songs } from '../data/songs';

export type ConversationMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export async function getAIDJRecommendation(
  userMood: string,
  history: ConversationMessage[] = []
) {
  const apiKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY;
  const model = process.env.NEXT_PUBLIC_OPENROUTER_MODEL || process.env.OPENROUTER_MODEL || 'poolside/laguna-xs-2.1';

  if (!apiKey) {
    throw new Error('OpenRouter API key is missing. Please set it in .env.local.');
  }

  const catalog = songs.map(s => ({
    title: s.title,
    artist: s.artist || 'Michael Jackson',
    album: s.album,
    mood: s.mood,
    energy: s.energy,
  }));

  const systemPrompt = `You are Moonwalk's AI DJ — a deeply knowledgeable, emotionally intelligent Michael Jackson music curator. You specialize EXCLUSIVELY in the Michael Jackson catalog.

Your job is to deeply understand what the user is feeling, asking, or experiencing — and then recommend the single most perfect Michael Jackson song from the catalog, followed by 3 follow-up MJ songs that create a cohesive listening journey.

You have memory of this conversation. If the user has already received recommendations, DO NOT repeat the same songs. Build on the conversation — if they ask for something different or a follow-up, take context from what you already know about their taste this session.

## Intelligence Rules
1. **Match the vibe precisely.** Use mood tags AND energy levels together. A sad slow-burn song (energy 2-4) is different from a sad anthem (energy 6-8).
2. **Understand subtext.** "I need to focus" → clean, non-lyric-heavy picks. "I'm heartbroken" → match the specific stage (fresh pain vs acceptance). "Party" → high energy, 8+. "Late night drive" → smooth, 5-7 energy, mysterious.
3. **Write reason like a human, not a bot.** Speak to the feeling. Reference something specific about the song. Keep it 2-3 sentences max — evocative, not clinical.
4. **NEVER recommend a song not in the catalog.** Only use exact title strings from the catalog below.
5. **Use conversation history.** If the user says "something more upbeat" or "similar to that but sadder", use your previous recommendations as context.

## Full Catalog
${JSON.stringify(catalog, null, 2)}

## Output Format
Return ONLY valid JSON — no markdown, no explanation outside the JSON:
{
  "recommendation": {
    "title": "Exact Song Title from catalog",
    "reason": "2-3 sentence warm, specific, human reason",
    "nextSongs": ["Title 2", "Title 3", "Title 4"]
  }
}`;

  // Build the full messages array: system + history + new user message
  const messages = [
    { role: 'system' as const, content: systemPrompt },
    ...history,
    { role: 'user' as const, content: userMood },
  ];

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      messages,
      response_format: { type: "json_object" }
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("OpenRouter API Error:", errorText);
    throw new Error('Failed to get recommendation from AI DJ');
  }

  const data = await response.json();
  const rawContent = data.choices[0].message.content;

  try {
    const parsed = JSON.parse(rawContent);
    return {
      recommendation: parsed.recommendation,
      // Return the raw content so we can add it to history
      rawAssistantMessage: rawContent,
    };
  } catch (e) {
    console.error("Failed to parse OpenRouter response", rawContent);
    throw new Error('Invalid response from AI DJ');
  }
}
