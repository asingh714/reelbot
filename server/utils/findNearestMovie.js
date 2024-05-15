import dotenv from "dotenv";
dotenv.config();

import { createClient } from "@supabase/supabase-js";
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_API_KEY
);

const previouslyReturnedIds = new Set();

export async function findNearestMovie(embedding) {
  try {
    const { data, error } = await supabase.rpc("match_movies", {
      query_embedding: embedding,
      match_threshold: 0.5,
      match_count: 1,
      excluded_ids: Array.from(previouslyReturnedIds),
    });

    if (error) {
      console.error("Error with RPC call:", error);
      return { match: "Error fetching recommendations.", id: null };
    }

    if (!data || data.length === 0) {
      return { match: "No new recommendations available.", id: null };
    }

    console.log("data", data);

    for (const movie of data) {
      if (!previouslyReturnedIds.has(movie.movie_id)) {
        previouslyReturnedIds.add(movie.movie_id);
        return { match: movie.content, id: movie.movie_id };
      }
    }

    return { match: "No new recommendations available.", id: null };
  } catch (err) {
    console.error("Error with search:", err);
    return { match: "Error fetching recommendations.", id: null };
  }
}
