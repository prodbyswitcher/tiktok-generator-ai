'use client';

import { useState } from 'react';

export default function Home() {
  const [type, setType] = useState('');
  const [topic, setTopic] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!type || !topic) return;
    setLoading(true);

    try {
      const res = await fetch('/api/generateTiktok', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, topic }),
      });

      const data = await res.json();

      const content = data.result || '';
      const hook = content.match(/Hook:(.*)/i)?.[1]?.trim();
      const description = content.match(/Description:(.*)/i)?.[1]?.trim();
      const hashtags = content.match(/Hashtags:(.*)/i)?.[1]?.trim().split(/\s+/);

      setResult({ hook, description, hashtags });
    } catch (err) {
      console.error('Erreur API:', err);
    } finally {
      setLoading(false);
    }
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

      <button
        onClick={generate}
        disabled={loading}
        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
      >
        {loading ? 'Génération...' : 'Générer l’idée 🎯'}
      </button>

      {result && (
        <div className="mt-6 border p-4 rounded bg-gray-50 space-y-2">
          <p><strong>🎯 Hook :</strong> {result.hook}</p>
          <p><strong>📝 Description :</strong> {result.description}</p>
          <p><strong>#️⃣ Hashtags :</strong> {result.hashtags.join(' ')}</p>
        </div>
      )}
    </main>
  );
}
