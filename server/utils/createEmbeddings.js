import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function createEmbedding(input) {
  const embeddingResponse = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input,
  });
  return embeddingResponse.data[0].embedding;
}
