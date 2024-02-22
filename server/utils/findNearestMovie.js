import dotenv from "dotenv";
dotenv.config();

import { createClient } from "@supabase/supabase-js";
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_API_KEY
);

// Utility functions for finding the nearest movie to a given embedding
export async function findNearestMovie(embedding) {
  const { data } = await supabase.rpc("match_movies", {
    query_embedding: embedding,
    match_threshold: 0.5,
    match_count: 1,
  });

  console.log("data", data);

  return { match: data[0].content, id: data[0].movie_id };
}
