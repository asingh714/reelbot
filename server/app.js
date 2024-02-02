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
    let page = 160;
    let movies = [];
    let totalPages = 175;

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

const chatMessage = [
  {
    role: "system",
    content: `You are an enthusiastic movie expert who loves recommending movies to people. You will be given two pieces of information: some context about various movies and a question from the user about movie recommendations. Your objective is to provide an informative, in-depth answer to the user about a movie. If the answer is not given in the context, find the answer in the conversation history if possible. Feel free to include any relevant additional information you might be aware of about the movie recommendation. If you are unsure and cannot find the answer, say, "Sorry, I don't know the answer." Please do not make up the answer. And never share the Movie ID in your answer.`,
  },
];

app.post("/movieRec", authenticate, async (req, res) => {
  const { input } = req.body;

  console.log("INPUT", input);
  try {
    const embedding = await createEmbedding(input);
    const { match, id } = await findNearestMovie(embedding);

    chatMessage.push({
      role: "user",
      content: `Context: ${match} Question: ${input} Movie id: ${id}`,
    });

    const { choices } = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
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
