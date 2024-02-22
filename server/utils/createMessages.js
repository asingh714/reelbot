import dotenv from "dotenv";
dotenv.config();
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_API_KEY
);

export async function startNewConversation() {
  const insertResponse = await supabase.from("conversations").insert([{}]);

  if (insertResponse.error) {
    console.error("Insert error:", insertResponse.error);
    throw new Error("Failed to start a new conversation");
  }

  const { data, error } = await supabase
    .from("conversations")
    .select("id")
    .order("created_at", { ascending: false })
    .limit(1);

  if (error) {
    console.error("Retrieval error:", error);
    throw new Error("Failed to retrieve new conversation ID");
  }

  if (data && data.length > 0) {
    return data[0].id;
  } else {
    throw new Error("No conversation ID found after insertion");
  }
}

export async function storeMessage(conversationId, role, content) {
  const { data, error } = await supabase
    .from("conversation_history")
    .insert([{ conversation_id: conversationId, role, content }]);

  if (error) {
    console.error("Store message error:", error.message);
    throw new Error(`Failed to store message: ${error.message}`);
  }
  return data;
}

export async function getConversationHistory(conversationId) {
  const { data, error } = await supabase
    .from("conversation_history")
    .select("role, content")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  if (error) throw new Error("Failed to retrieve conversation history");
  return data;
}
