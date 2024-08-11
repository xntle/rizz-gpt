import { appBarClasses } from '@mui/material';
import { NextResponse } from 'next/server'; // Import NextResponse from Next.js for handling responses
import OpenAI from 'openai'; // Import OpenAI library for interacting with the OpenAI API


// System prompt for the AI, providing guidelines on how to respond to users
const systemPrompt = `You are an AI-powered customer support assistant for Amazon. 
1. Customer will inquire you about features of the app such as how to track orders, how to return items, how to contact customer service, etc.
2. Your job is to answer them in a polite and helpful manner. 
3. Provide links when necessary, maybe even perform some action so that the user doesn't have to.
4. If you are unable to answer the question, you can ask the user to contact customer service.
`;

// const dotenv = require('dotenv');
// dotenv.config();

// POST function to handle incoming requests
export async function POST(req) {
  
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  
  const data = await req.json() // Parse the JSON body of the incoming request

  // Create a chat completion request to the OpenAI API
  const completion = await openai.chat.completions.create({
    messages: [{role: 'system', content: systemPrompt}, ...data], // Include the system prompt and user messages
    model: "gpt-4o-mini",
    stream: true, // Enable streaming responses
  })

  // Create a ReadableStream to handle the streaming response
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder() // Create a TextEncoder to convert strings to Uint8Array
      try {
        // Iterate over the streamed chunks of the response
        for await (const chunk of completion) {
          const content = chunk.choices[0]?.delta?.content // Extract the content from the chunk
          if (content) {
            const text = encoder.encode(content) // Encode the content to Uint8Array
            controller.enqueue(text) // Enqueue the encoded text to the stream
          }
        }
      } catch (err) {
        controller.error(err) // Handle any errors that occur during streaming
      } finally {
        controller.close() // Close the stream when done
      }
    },
  })

  return new NextResponse(stream) // Return the stream as the response
}
