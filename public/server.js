"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const words_json_1 = __importDefault(require("../data/words.json"));
const wordsData = words_json_1.default;
const app = (0, express_1.default)();
const port = 3000;
app.use((0, cors_1.default)());
app.get("/api/suggestions", (req, res) => {
    const query = req.query.query?.toLowerCase() || "";
    const lang = req.query.lang || "uk";
    const langWords = wordsData[lang] || [];
    const result = langWords.filter((word) => word.toLowerCase().startsWith(query));
    res.json(result);
});
app.listen(port, () => {
    console.log(`✅ Server started at http://localhost:${port}`);
});
//# sourceMappingURL=server.js.map