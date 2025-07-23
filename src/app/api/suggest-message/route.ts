import { createOpenAI} from '@ai-sdk/openai';
import { streamText } from 'ai';
import { ApiError } from 'next/dist/server/api-utils';
import { NextResponse } from 'next/server';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const openai = createOpenAI({
   apiKey: process.env.OPENAI_API_KEY,
  compatibility: 'strict', // strict mode, enable when using the OpenAI API
});

export const runtime = 'edge'


export async function POST(req: Request) {
  try {
    const prompt = ""
    const { messages } = await req.json();

    const result = streamText({
      model: openai('gpt-4.1-2025-04-14'),
      messages,
      prompt
    });

    return result.toDataStreamResponse();
  } catch (error) {
    if (error instanceof ApiError) {
      const {name ,message} = error
      return NextResponse.json({
        name, message
      },{
        status: 400
      })
    } else {
      console.error("An unexpected error occurred:", error);
      return new Response(
        JSON.stringify({ error: "An unexpected error occurred" }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  }
}