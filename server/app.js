import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import morgan from "morgan";
import axios from "axios";
import OpenAI from "openai";
import cookieParser from "cookie-parser";
import { createClient } from "@supabase/supabase-js";

const app = express();
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(morgan("tiny"));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

import { movieGenre } from "./utils/movieGenre.js";
import { createEmbedding } from "./utils/createEmbeddings.js";
import { findNearestMovie } from "./utils/findNearestMovie.js";
import { login, register, logout } from "./auth.js";
import { authenticate } from "./utils/authenticate.js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_API_KEY
);

app.post("/register", register);
app.post("/login", login);
app.post("/logout", logout);

app.post("/postMovies", async (req, res) => {
  try {
    // NEED TO DO.
    let page = 176;
    let movies = [];
    let totalPages = 190;

    while (page <= totalPages) {
      const response = await axios.get(
        "https://api.themoviedb.org/3/discover/movie",
        {
          params: {
            include_adult: true,
            include_video: true,
            language: "en-US",
            sort_by: "popularity.desc",
            page: page,
          },
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${process.env.TMDB_READ_ACCESS_TOKEN}`,
          },
        }
      );

      movies = [...movies, ...response.data.results];
      page++;
    }

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

app.post("/movieRec", authenticate, async (req, res) => {
  const { input } = req.body;

  const chatMessage = [
    {
      role: "system",
      content: `You are an enthusiastic movie expert who loves recommending movies to people. You will be given two pieces of information - some context about a movies and a question.  Your main objective is to formulate an informative, in-depth answer to the question using the provided context. If the context is unclear or the user input is unrelated to movies, say, "Sorry, I don't know the answer." Please do not make up the answer. And never share the Movie ID in your answer.`,
    },
  ];
  console.log("INPUT", input);
  try {
    const embedding = await createEmbedding(input);
    const { match, id } = await findNearestMovie(embedding);

    chatMessage.push({
      role: "user",
      content: `Question: ${input}. Context: ${match}`,
    });

    console.log("chatMessage", chatMessage);

    const { choices } = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: chatMessage,
      temperature: 0.5,
      frequency_penalty: 0.5,
    });

    console.log("choices", choices);
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
