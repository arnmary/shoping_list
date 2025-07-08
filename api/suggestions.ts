// 🔹 Імпорт типів для функцій у Vercel
import { VercelRequest, VercelResponse } from '@vercel/node';

// 🔹 Імпортуємо список слів із JSON
import wordsData from '../data/words.json';

// 🔹 Обмежуємо допустимі коди мов
type LangCode = 'uk' | 'ru' | 'en' | 'pl';

/**
 * 🔹 Основний обробник запиту до /api/suggestions
 *    - Очікує параметри query (текст) і lang (код мови)
 */
export default function handler(req: VercelRequest, res: VercelResponse) {
  const query = (req.query.query as string)?.toLowerCase() || ''; // Отримуємо текст запиту
  const lang = (req.query.lang as LangCode) || 'uk';              // Отримуємо мову запиту

  const langWords = wordsData[lang] || []; // Отримуємо список слів відповідної мови

  // 🔸 Фільтруємо слова, що починаються з введеного тексту
  const result = langWords.filter(word =>
    word.toLowerCase().startsWith(query)
  );

  // 🔸 Повертаємо результат як JSON
  res.status(200).json(result);
}

