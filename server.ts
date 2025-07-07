// Імпортуємо необхідні модулі
import express from "express"; // Express — фреймворк для створення сервера
import cors from "cors";       // CORS — для дозволу запитів з інших доменів (наприклад, з клієнта)
import wordsData from "./data/words.json"; // Імпортуємо JSON з підказками на різних мовах

// Ініціалізуємо додаток Express
const app = express();
const port = 3000; // Порт, на якому працюватиме сервер

// Дозволяємо крос-доменні запити
app.use(cors());

/**
 * Роут для обробки автопідказок.
 * Очікує query — текст запиту, lang — мову (наприклад, 'uk', 'en', 'pl', 'ru')
 */
app.get("/api/suggestions", (req, res) => {
  const query = (req.query.query as string)?.toLowerCase() || ""; // Запит від користувача
  const lang = (req.query.lang as string) || "uk";                // Мова запиту (за замовчуванням — українська)

  const langWords = wordsData[lang] || []; // Отримуємо список слів для обраної мови
  // Фільтруємо слова, які починаються з введеного тексту
  const result = langWords.filter((word: string) => word.toLowerCase().startsWith(query));

  res.json(result); // Повертаємо результат як JSON
});

// Запускаємо сервер і логуємо повідомлення
app.listen(port, () => {
  console.log(`✅ Server started at http://localhost:${port}`);
});

