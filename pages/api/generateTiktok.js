import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const { type, topic, lang = "fr", style = "" } = req.body;

  if (!type || !topic) {
    return res.status(400).json({ error: "Champs manquants" });
  }

  const stylePart = style ? ` avec un style ${style}` : '';
  const prompt = `Tu es un expert en vidéos TikTok virales.
Génère ce contenu en ${lang === 'en' ? 'anglais' : 'français'} pour une vidéo de type "${type}" sur le sujet "${topic}"${stylePart}, au format suivant :

Hook: ...
Description: ...
Hashtags: #hashtag1 #hashtag2 #hashtag3 ...

Réponds uniquement avec ces 3 lignes. Pas d'introduction, pas de titre, pas de remarques.`;

  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama3-8b-8192",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const output = response.data.choices[0].message.content;
    res.status(200).json({ result: output });

  } catch (error) {
    console.error("🔥 Erreur Groq API :", error.response?.data || error.message);
    res.status(500).json({ error: error.message });
  }
}
