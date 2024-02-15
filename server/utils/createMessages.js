import dotenv from "dotenv";
dotenv.config();

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_API_KEY
);

export async function startNewConversation() {
  const { data, error } = await supabase
    .from("conversations")
    .insert([{}])
    .single();


  if (error) throw new Error("Failed to start a new conversation");
  return data.id;
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
