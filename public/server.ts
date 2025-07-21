interface WordsData {
  [key: string]: string[];
}

// Import modules
import express from "express"; // Express — for creating server
import cors from "cors";       // CORS — for to allow requests from others domains (from a client)
import wordsDataJson from "../data/words.json"; // Import JSON with hints in different languages 
const wordsData = wordsDataJson as WordsData;

//Initializing app Express
const app = express();
const port = 3000; // Port, the server will run

//  Add cros-domain request
app.use(cors());

/**
 * Router for processing auto prompts
 * Waiting query — text of the request, lang (for example, 'uk', 'en', 'pl', 'ru')
 */
app.get("/api/suggestions", (req, res) => {
  const query = (req.query.query as string)?.toLowerCase() || ""; // Request from user
  const lang = (req.query.lang as string) || "uk";                // Language for the query (default- ukrainian)

  const langWords = wordsData[lang] || []; //  Waiting list the words for chosen language
  // Filfer worlds
  const result = langWords.filter((word: string) => word.toLowerCase().startsWith(query));

  res.json(result); // Return result as JSON
});

//  Start the server and log messages
app.listen(port, () => {
  console.log(`✅ Server started at http://localhost:${port}`);
});

