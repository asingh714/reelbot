import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

export async function splitDocuments(text) {
  try {
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 150,
      chunkOverlap: 15,
    });

    const output = await splitter.createDocuments([text]);

    return output;
  } catch (error) {
    console.error(`Error reading file: ${error}`);
    throw error;
  }
}
