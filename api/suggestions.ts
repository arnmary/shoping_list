import { VercelRequest, VercelResponse } from '@vercel/node';
import wordsData from '../data/words.json';

type WordsData = {
  [key: string]: string[];
};

type LangCode = 'uk' | 'ru' | 'en' | 'pl';

// Приведемо імпортовані дані до типу WordsData
const typedWordsData: WordsData = wordsData;

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const queryParam = req.query.query;
  const langParam = req.query.lang;

  if (!queryParam || typeof queryParam !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid query parameter' });
  }

  const query = queryParam.toLowerCase().trim();
  const lang = (typeof langParam === 'string' ? langParam : 'uk') as LangCode;

  if (!typedWordsData[lang]) {
    return res.status(400).json({ error: 'Language not supported' });
  }

  const langWords = typedWordsData[lang];

  const suggestions = langWords.filter(word =>
    word.toLowerCase().startsWith(query)
  );

  return res.status(200).json(suggestions);
}



