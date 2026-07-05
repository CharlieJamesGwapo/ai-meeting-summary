import { SummaryRequest, SummaryResponse } from './types';

export const summarizeTranscript = async (
  req: SummaryRequest
): Promise<SummaryResponse> => {
  const { transcript, apiKey } = req;

  if (!apiKey) {
    throw new Error('API key is required. Please set it in settings.');
  }

  if (!transcript || transcript.trim().length === 0) {
    throw new Error('Transcript is required.');
  }

  const prompt = `Analyze the following meeting transcript and provide a structured summary. Return the response as valid JSON with this exact structure:
{
  "summary": "A concise 2-3 sentence overview of the meeting",
  "keyDecisions": ["decision 1", "decision 2", "decision 3"],
  "actionItems": [
    {"id": "1", "text": "action item text", "assignee": "person name or empty string", "completed": false, "priority": "high"},
    {"id": "2", "text": "another action", "assignee": "person name or empty string", "completed": false, "priority": "medium"}
  ],
  "attendees": ["Name 1", "Name 2", "Name 3"],
  "topics": ["topic 1", "topic 2", "topic 3"],
  "sentiment": {
    "tone": "positive",
    "score": 0.75
  },
  "duration": "1 hour 30 minutes"
}

Important:
- Extract actual attendee names from the transcript if available
- List 3-5 key decisions made in the meeting
- List 3-5 action items with assigned owners where mentioned
- Extract main discussion topics
- Sentiment score should be 0-1, tone should be "positive", "neutral", or "negative"
- If duration is not mentioned, estimate from context or use "unknown"
- Priority values must be "low", "medium", or "high"
- assignee should be an empty string if not mentioned
- id for actionItems should be unique strings like "1", "2", etc.

Meeting Transcript:
${transcript}`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.error?.message || 'Failed to summarize transcript'
      );
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    // Extract JSON from the response (in case it's wrapped in markdown code blocks)
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid response format from API');
    }

    const parsed = JSON.parse(jsonMatch[0]);

    return {
      summary: parsed.summary || '',
      keyDecisions: Array.isArray(parsed.keyDecisions)
        ? parsed.keyDecisions
        : [],
      actionItems: Array.isArray(parsed.actionItems) ? parsed.actionItems : [],
      attendees: Array.isArray(parsed.attendees) ? parsed.attendees : [],
      topics: Array.isArray(parsed.topics) ? parsed.topics : [],
      sentiment: parsed.sentiment || { tone: 'neutral', score: 0.5 },
      duration: parsed.duration || 'unknown',
    };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to summarize transcript');
  }
};
