# ReelBot: AI-Powered Movie Recommendation


[![Home Page](/client/src/assets/ReelBot_1.png)](https://www.reelbot.co/)

[![Chat Page](/client/src/assets/ReelBot_2.png)](https://www.reelbot.co/)

[![Chat Page](/client/src/assets/ReelBot_3.png)](https://www.reelbot.co/)

[![Chat Page](/client/src/assets/ReelBot_4.png)](https://www.reelbot.co/)

## About This Project

ReelBot is a cutting-edge AI chatbot designed to transform how people discover movies. Leveraging an extensive database of thousands of films, ReelBot provides personalized movie recommendations tailored to individual tastes. Through a simple chat interface, users can receive movie suggestions complete with titles, descriptions, and trailer links, making the search for the next great movie effortless and enjoyable.

### AI-Powered Movie Recommendations
At the heart of ReelBot lies an innovative use of artificial intelligence to revolutionize the way users discover movies. This project combines several advanced AI techniques to provide highly personalized and accurate movie recommendations. Here's how we leverage AI:

#### Vector Embeddings for Precise Matching
Vector embeddings are a powerful tool in AI that allow us to represent complex movie data in a format that machines can understand and process efficiently. By converting movie attributes, such as genre, plot descriptions, and metadata, into vector embeddings, ReelBot can perform nuanced analysis and comparisons. This process uses natural language processing (NLP) techniques to understand the context and nuances of user queries, ensuring that the recommendations are not just based on keyword matches but on a deep understanding of the user's preferences.

#### Storing in a Vector Database
The vector embeddings created from our extensive movie database are stored in a specialized vector database. This database is optimized for high-speed similarity searches, enabling ReelBot to quickly find and recommend movies that closely match the user's preferences as expressed through their queries. This approach significantly improves the relevance of recommendations compared to traditional search methods.

#### AI-Driven Matching
Utilizing AI, ReelBot analyses the vector embeddings to find the best match within the vector database. This involves calculating the similarity between the user's query vector embedding and the movie vector embeddings stored in the database. The AI algorithm considers various factors, including thematic elements, viewer ratings, and contextual relevance, to select the most appropriate movie recommendation for the user.

#### Conversation History for Personalized Recommendations
ReelBot goes beyond single interactions by storing the conversation history of each user. This historical data allows the AI to learn from past interactions, further refining its understanding of the user's movie preferences over time. By analyzing the types of movies previously recommended and the user's feedback on those recommendations, ReelBot can tailor its future recommendations even more closely to the user's taste.


## Contact

**Aman Singh**

- Email: [amsingh714@gmail.com](mailto:amsingh714@gmail.com)
- Portfolio: [amans.dev](https://amans.dev)
- Project Link: [ReelBot](https://www.reelbot.co/)


## Features
- **Personalized Recommendations**: Utilizes AI to analyze user queries and deliver movie recommendations that match their preferences.
- **Vector Embedding Technology**: Advanced AI algorithms create vector embeddings from movie metadata for precise matching.
- **Vector Database Integration**: Efficiently stores and retrieves vector embeddings to find the best movie matches.
- **User Conversation History**: Maintains a history of user interactions to refine and personalize recommendations over time.
- **Extensive Movie Database**: Access to thousands of movies across various genres and eras.
- **Interactive Chat Interface**: Easy-to-use chat application that engages users in a conversational movie discovery experience.



## Technologies

### Backend

- **Node.js & Express**: For server-side logic and API endpoints.
- **Supabase**: An open-source Firebase alternative for database management and authentication.
- **Axios**: Promise-based HTTP client for making requests to external APIs.
- **OpenAI & Langchain**: For AI-driven functionalities, including vector embedding creation and natural language processing.
- **JWT & Bcryptjs**: For secure authentication and user session management.
- **Morgan & Cookie-parser**: For logging and cookie handling.

### Frontend

- **React**: For building the user interface with a component-based architecture.
- **React Router**: For client-side routing.
- **Framer Motion**: For animations and transitions.
- **Sass**: For advanced styling options with CSS pre-processing.
- **Vite**: As a build tool and development environment for modern web projects.

### AI
- **OpenAI's API**: Powers the AI chatbot, enabling it to understand natural language queries and generate responses.
- **Vector Embedding and Database**: Utilizes AI to create vector embeddings from movie data, stored in a vector database for efficient matching.


### Installation

1. Clone the repository:
   ```git clone https://github.com/asingh714/reelbot```
   
2. Install NPM packages for both server and client:

	```		
	# For the server
	cd server
	npm install
	
	# For the client
	cd client
	npm install
	```
3. Start the server: ```npm run server```
4. Run the client application: ```npm run dev```
5. You will need to provide your own keys 