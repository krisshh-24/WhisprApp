import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

export const maxDuration = 30;
export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const prompt = `Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform like qooh.me, and should be suited for a diverse audience. Avoid personal or sensitive topics, focusing on universal themes that encourage friendly reactions. For example, output should be structured like this: 'What's a hobby you have recently started?||If you could have dinner with any historical figure, who would it be?||What's a simple thing that makes you happy?'.`;

    const result = await streamText({
      model: openai('gpt-4o'),
      prompt,
    });

    return result.toDataStreamResponse();
  } catch (err) {
    console.error('An unexpected error occurred', err);
    return new Response('Internal Server Error', { status: 500 });
  }
}
