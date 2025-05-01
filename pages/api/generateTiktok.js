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

  const prompt = `Tu es un expert TikTok. Crée un contenu viral avec un bon RPM pour une vidéo de type "${type}" sur le sujet "${topic}". Donne :\n1. Un hook.\n2. Une description.\n3. Une liste de hashtags.\nFormat :\nHook: ...\nDescription: ...\nHashtags: #...`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8,
    });

    res.status(200).json({ result: completion.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
