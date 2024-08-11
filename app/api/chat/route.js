import { NextResponse } from 'next/server'; // Import NextResponse from Next.js for handling responses
import OpenAI from 'openai'; // Import OpenAI library for interacting with the OpenAI API
import { Pinecone } from '@pinecone-database/pinecone';
import { OpenAIEmbeddings } from "@langchain/openai";

// Set the embedding model
const embedModel = "text-embedding-3-small"; // Correct embedding model

// Initialize OpenAI Embeddings (using LangChain)
const embeddings = new OpenAIEmbeddings({
    openaiApiKey: process.env.OPENAI_API_KEY, // Pass the API key for embedding requests
    modelName: embedModel // Use the correct embedding model
});


const openai_client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY // Initialize OpenAI with your API key
});

// Initialize Pinecone Client
const pc = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY, // Load Pinecone API key from environment variables
});

// Get Pinecone Index
const pineconeIndex = pc.Index(process.env.PIPECONE_INDEX_NAME); // Load the index name from environment variables

async function performRAG(conversation) {
    // Extract the relevant part of the conversation history
    const lastFewMessages = conversation.slice(-6).map(msg => `${msg.role}: ${msg.content}`).join("\n");

    // Identify the last user message (question)
    const lastMessage = conversation.filter(msg => msg.role === 'user').pop().content;

    // Generate the embedding for the entire conversation history
    const rawQueryEmbedding = await openai_client.embeddings.create({
        input: lastMessage,
        model: embedModel // Use the correct embedding model
    });

    const queryEmbedding = rawQueryEmbedding.data[0].embedding;

    // Query the Pinecone index for top matches
    const topMatches = await pineconeIndex.namespace(process.env.PIPECONE_NAMESPACE_NAME).query({
        vector: queryEmbedding,
        topK: 310,
        includeMetadata: true,
    });

    // Retrieve the contexts from the matched documents
    const contexts = topMatches.matches.map(match => match.metadata.text);

    // Construct the augmented query with the context and last message as the question
    const augmentedQuery = `<CONTEXT>\n${contexts.slice(0, 10).join("\n\n-------\n\n")}\n-------\n</CONTEXT>\n\n\n\nMY CONVERSATION:\n${lastFewMessages}\n\nMy QUESTION:\n${lastMessage}`;

    // Define the system prompt
    const systemPrompt = `"You are one of the best C++ instructors, known for your expertise and ability to explain complex concepts clearly. Your knowledge is strictly limited to the context provided. If you encounter a question or topic that is outside the provided context, respond by saying, "Unfortunately, that's way beyond my pay grade, but I can help with C++ tho." However, if someone greets you or asks something within C++, respond in a friendly and helpful manner."`;

    // Get the response from the OpenAI chat completion
    const res = await openai_client.chat.completions.create({
        model: "gpt-4o-mini", // Make sure this is the correct model for your use case
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: augmentedQuery }
        ],
        stream: true // Enable streaming for the response
    });

    return res;
}

// System prompt for the AI, providing guidelines on how to respond to users
// const systemPrompt = `You are an AI-powered customer support assistant for Amazon. 
// 1. Customer will inquire you about features of the app such as how to track orders, how to return items, how to contact customer service, etc.
// 2. Your job is to answer them in a polite and helpful manner. 
// 3. Provide links when necessary, maybe even perform some action so that the user doesn't have to.
// 4. If you are unable to answer the question, you can ask the user to contact customer service.
// `;

// POST function to handle incoming requests
export async function POST(req) {

  // const openai = new OpenAI() // Create a new instance of the OpenAI client
  const data = await req.json() // Parse the JSON body of the incoming request

  // Create a chat completion request to the OpenAI API
  // const completion = await openai.chat.completions.create({
  //   messages: [{role: 'system', content: systemPrompt}, ...data], // Include the system prompt and user messages
  //   model: 'gpt-4o-mini', // Specify the model to use
  //   stream: true, // Enable streaming responses
  // })

  const completion = await performRAG(data);

  // Create a ReadableStream to handle the streaming response
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder(); // Create a TextEncoder to convert strings to Uint8Array
      try {
        // Iterate over the streamed chunks of the response
        for await (const chunk of completion) {
          const content = chunk.choices[0]?.delta?.content; // Extract the content from the chunk
          if (content) {
            const text = encoder.encode(content); // Encode the content to Uint8Array
            controller.enqueue(text); // Enqueue the encoded text to the stream
          }
        }
      } catch (err) {
        controller.error(err); // Handle any errors that occur during streaming
      } finally {
        controller.close(); // Close the stream when done
      }
    },
  });

  return new NextResponse(stream) // Return the stream as the response
}
