import dotenv from "dotenv";
dotenv.config();

import { createClient } from "@supabase/supabase-js";
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_API_KEY
);
export async function findNearestMovie(embedding) {
  const { data } = await supabase.rpc("match_movies", {
    query_embedding: embedding,
    match_threshold: 0.5,
    match_count: 3,
  });

  console.log("data", data);

  const items = data
    .map((item) => {
      return item.content;
    })
    .join("\n");
  // return data[0].content;
  return items;
}
