"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const words_json_1 = __importDefault(require("../data/words.json"));
const typedWordsData = words_json_1.default;
function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    const queryParam = req.query.query;
    const langParam = req.query.lang;
    if (!queryParam || typeof queryParam !== 'string') {
        return res.status(400).json({ error: 'Missing or invalid query parameter' });
    }
    const query = queryParam.toLowerCase().trim();
    const lang = (typeof langParam === 'string' ? langParam : 'uk');
    if (!typedWordsData[lang]) {
        return res.status(400).json({ error: 'Language not supported' });
    }
    const langWords = typedWordsData[lang];
    const suggestions = langWords.filter(word => word.toLowerCase().startsWith(query));
    return res.status(200).json(suggestions);
}
//# sourceMappingURL=suggestions.js.map