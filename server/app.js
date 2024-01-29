import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import morgan from "morgan";
import axios from "axios";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

const app = express();
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(morgan("tiny"));
app.use(express.json());

import { movieGenre } from "./utils/movieGenre.js";
import { createEmbedding } from "./utils/createEmbeddings.js";
import { findNearestMovie } from "./utils/findNearestMovie.js";

// OPEN AI CONFIG
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_API_KEY
);

app.post("/getMovies", async (req, res) => {
  try {
    const response = await axios.get(
      "https://api.themoviedb.org/3/discover/movie",
      {
        params: {
          include_adult: true,
          include_video: true,
          language: "en-US",
          sort_by: "popularity.desc",
          page: 5,
        },
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${process.env.TMDB_READ_ACCESS_TOKEN}`,
        },
      }
    );
    const movies = response.data.results;

    const info = movies.map((movie) => {
      let content = "";
      content += `Movie Title: ${movie.title}. Movie ID: ${movie.id}. ${
        movie.title
      } Overview: ${movie.overview}. Release Date: ${
        movie.release_date
      }. Rating: ${movie.vote_average}. Popularity: ${
        movie.popularity
      }. Movie is for adults: ${movie.adult}. Genres: ${movie.genre_ids.map(
        (id) => movieGenre[id]
      )}.`;
      content += "\n";
      content += "\n";
      return content;
    });

    const embedding = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: info,
    });

    const data = [];
    embedding.data.forEach((item, index) => {
      const obj = {};
      obj["content"] = info[index];
      obj["embedding"] = item.embedding;
      obj["movie_id"] = movies[index].id;
      data.push(obj);
    });

    await supabase.from("movie").insert(data);
    res.status(200).json({ msg: "done" });
  } catch (error) {
    console.error("Error fetching movie data:", error);
    res.status(500).send("Error while fetching movie data");
  }
});

/* 
{
    "adult": false,
    "backdrop_path": "/1X7vow16X7CnCoexXh4H4F2yDJv.jpg",
    "genre_ids": [
        80,
        36,
        18
    ],
    "id": 466420,
    "original_language": "en",
    "original_title": "Killers of the Flower Moon",
    "overview": "When oil is discovered in 1920s Oklahoma under Osage Nation land, the Osage people are murdered one by one—until the FBI steps in to unravel the mystery.",
    "popularity": 428.415,
    "poster_path": "/dB6Krk806zeqd0YNp2ngQ9zXteH.jpg",
    "release_date": "2023-10-18",
    "title": "Killers of the Flower Moon",
    "video": false,
    "vote_average": 7.5,
    "vote_count": 2080
},


*/

const chatMessage = [
  {
    role: "system",
    content: `You are an enthusiastic movie expert who loves recommending movies to people. You will be given two pieces of information - some context about movies and a question. Your main job is to formulate a short answer to the question using the provided context. If the answer is not given in the context, find the answer in the conversation history if possible. If you are unsure and cannot find the answer, say, "Sorry, I don't know the answer." Please do not make up the answer. `,
  },
];

app.post("/movieRec", async (req, res) => {
  const { input } = req.body;
  try {
    const embedding = await createEmbedding(input);
    const { match, id } = await findNearestMovie(embedding);

    chatMessage.push({
      role: "user",
      content: `Context: ${match} Question: ${input} Movie id: ${id}`,
    });

    const { choices } = await openai.chat.completions.create({
      model: "gpt-4",
      messages: chatMessage,
      temperature: 0.5,
      frequency_penalty: 0.5,
    });

    chatMessage.push(choices[0].message);

    res.status(200).json({ answer: choices[0].message.content, id });
  } catch (error) {
    res.status(500).send("Error with search");
  }
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
