'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const [type, setType] = useState('');
  const [topic, setTopic] = useState('');
  const [lang, setLang] = useState('fr');
  const [style, setStyle] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!type || !topic) return;
    setLoading(true);

    try {
      const res = await fetch('/api/generateTiktok', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, topic, lang, style }),
      });

      const data = await res.json();

      if (!data.result) {
        setResult({ hook: 'Aucune réponse.', description: '', hashtags: [] });
        setLoading(false);
        return;
      }

      const content = data.result;
      console.log("📦 Réponse brute Groq :", content);

      const hook = content.match(/Hook:\s*(.*)/i)?.[1]?.replace(/^"|"$/g, '').trim() || 'Pas de hook détecté.';
      const description = content.match(/Description:\s*(.*)/i)?.[1]?.replace(/^"|"$/g, '').trim() || 'Pas de description détectée.';
      const hashtagsRaw = content.match(/Hashtags:\s*(.*)/i)?.[1]?.trim() || '';
      const hashtags = hashtagsRaw.split(/\s+/).filter(h => h.startsWith('#'));

      setResult({ hook, description, hashtags });
    } catch (err) {
      console.error('Erreur API:', err);
      setResult({ hook: 'Erreur serveur.', description: '', hashtags: [] });
    } finally {
      setLoading(false);
    }
  };

  const copyHashtags = () => {
    if (result?.hashtags?.length > 0) {
      navigator.clipboard.writeText(result.hashtags.join(' '));
      alert("Hashtags copiés dans le presse-papiers ✅");
    }
  };

  const resetForm = () => {
    setType('');
    setTopic('');
    setLang('fr');
    setStyle('');
    setResult(null);
  };

  return (
    <main className="p-8 max-w-xl mx-auto space-y-4 font-sans">
      <h1 className="text-3xl font-bold">🎥 Générateur TikTok IA</h1>

      <input
        type="text"
        placeholder="Type de TikTok (drôle, musique, info...)"
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="border border-gray-300 p-2 w-full rounded"
      />

      <input
        type="text"
        placeholder="Sujet (ex : IA, morning routine...)"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        className="border border-gray-300 p-2 w-full rounded"
      />

      <div className="flex items-center gap-2">
        <label className="text-sm">Langue :</label>
        <select
          value={lang}
          onChange={(e) => setLang(e.target.value)}
          className="border border-gray-300 p-2 rounded bg-white text-black"
        >
          <option value="fr">Français 🇫🇷</option>
          <option value="en">Anglais 🇬🇧</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm">Style :</label>
        <select
          value={style}
          onChange={(e) => setStyle(e.target.value)}
          className="border border-gray-300 p-2 rounded bg-white text-black"
        >
          <option value="">Libre</option>
          <option value="drôle">Drôle</option>
          <option value="inspirant">Inspirant</option>
          <option value="provocant">Provocant</option>
          <option value="éducatif">Éducatif</option>
        </select>
      </div>

      <div className="flex gap-4">
        <button
          onClick={generate}
          disabled={loading}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          {loading ? 'Génération...' : 'Générer l’idée 🎯'}
        </button>

        <button
          onClick={resetForm}
          className="bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300"
        >
          Réinitialiser
        </button>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="mt-6 border p-4 rounded bg-white shadow space-y-2 text-gray-800"
          >
            {result.hook && <p><strong>🎯 Hook :</strong> {result.hook}</p>}
            {result.description && <p><strong>📝 Description :</strong> {result.description}</p>}
            {Array.isArray(result.hashtags) && result.hashtags.length > 0 ? (
              <div>
                <p><strong>#️⃣ Hashtags :</strong> {result.hashtags.join(" ")}</p>
                <button
                  onClick={copyHashtags}
                  className="mt-2 text-sm text-blue-600 underline hover:text-blue-800"
                >
                  Copier les hashtags 📋
                </button>
              </div>
            ) : (
              <p><strong>#️⃣ Hashtags :</strong> Aucun hashtag trouvé.</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
