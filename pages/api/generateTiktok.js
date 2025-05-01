import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const { type, topic } = req.body;

  if (!type || !topic) {
    return res.status(400).json({ error: "Champs manquants" });
  }

  const prompt = `Tu es un expert en création de vidéos virales TikTok. Pour une vidéo de type "${type}" sur le sujet "${topic}", génère impérativement les éléments suivants, dans ce format exact :

Hook: Une phrase d'accroche percutante
Description: Une description engageante
Hashtags: #hashtag1 #hashtag2 #hashtag3 ...

⚠️ Ne commence jamais ta réponse par un mot d’introduction. Ne mets aucun titre ou texte autour. Réponds uniquement avec :
Hook: ...
Description: ...
Hashtags: ...
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8,
    });

    if (!completion.choices || completion.choices.length === 0) {
      return res.status(500).json({ error: "Réponse OpenAI vide" });
    }

    res.status(200).json({ result: completion.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
