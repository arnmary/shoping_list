import { VercelRequest, VercelResponse } from '@vercel/node';
import wordsData from '../data/words.json';

export default function handler(req: VercelRequest, res: VercelResponse) {
  const query = (req.query.query as string || "").toLowerCase();
  const lang = (req.query.lang as string || "uk");

  const langWords = wordsData[lang] || [];
  const result = langWords.filter((word: string) =>
    word.toLowerCase().startsWith(query)
  );

  res.status(200).json(result);
}
