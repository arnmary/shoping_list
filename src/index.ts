// 🔹 Тип для структури слів у JSON
interface WordsData {
  [key: string]: string[];
}

// 🔹 Імпортуємо необхідні модулі
import express from "express";               // Express — фреймворк для створення сервера
import cors from "cors";                     // CORS — для дозволу запитів з інших доменів
import wordsDataJson from "../data/words.json"; // Імпортуємо JSON із підказками на різних мовах

// 🔹 Приводимо JSON до типу WordsData
const wordsData = wordsDataJson as WordsData;

// 🔹 Ініціалізуємо додаток Express
const app = express();
const port = 3000; // Порт, на якому запускатиметься сервер

// 🔹 Дозволяємо крос-доменні запити
app.use(cors());

/**
 * 🔹 Роут для обробки автопідказок.
 * Очікує два параметри:
 *  - query: текст, який вводить користувач
 *  - lang: мова (наприклад, 'uk', 'en', 'pl', 'ru')
 */
app.get("/api/suggestions", (req, res) => {
  const query = (req.query.query as string)?.toLowerCase() || ""; // Отримуємо текст запиту
  const lang = (req.query.lang as string) || "uk";                // Отримуємо мову запиту (за замовчуванням — 'uk')

  const langWords = wordsData[lang] || []; // Список слів для обраної мови
  const result = langWords.filter((word: string) =>
    word.toLowerCase().startsWith(query)
  ); // Фільтруємо слова за введеним запитом

  res.json(result); // Повертаємо результат у форматі JSON
});

// 🔹 Запускаємо сервер
app.listen(port, () => {
  console.log(`✅ Сервер запущено на http://localhost:${port}`);
});






