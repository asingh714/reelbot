import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import morgan from "morgan";
import axios from "axios";
import OpenAI from "openai";

import { movieGenre } from "./utils/movieGenre.js";

const app = express();
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(morgan("tiny"));
app.use(express.json());

// OPEN AI CONFIG
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.get("/getMovies", async (req, res) => {
  try {
    const response = await axios.get(
      "https://api.themoviedb.org/3/discover/movie",
      {
        params: {
          include_adult: true,
          include_video: true,
          language: "en-US",
          sort_by: "popularity.desc",
          page: 2,
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
      content += `Title: ${movie.title}. `;
      content += `Movie Overview: ${movie.overview}. `;
      content += `Release Date: ${movie.release_date}. `;
      content += `Rating: ${movie.vote_average}. `;
      content += `Popularity: ${movie.popularity}. `;
      content += `Movie is for adults: ${movie.adult}. `;
      content += `Genres: ${movie.genre_ids.map((id) => movieGenre[id])}. `;
      return {
        content: content,
        movie_id: movie.id,
      };
    });

    res.status(200).json(info);
  } catch (error) {
    console.error("Error fetching movie data:", error);
    res.status(500).send("Error while fetching movie data");
  }
});

/*
What to do: 

1. Get movie data from TMDB API - which is a list. 
2. For each movie, combine the details into a single string.
3. split documents function 

insert into supabase

id: automatic 

title 
overview
release_date 
vote_average 
popularity
adult: false
genres: [] --> figure out how to get types 

embedding 

movie_id: 466420 
*/

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

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
