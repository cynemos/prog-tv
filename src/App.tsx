import React, { useState, useEffect } from 'react'
import { ChannelCard } from './components/ChannelCard'
import { fetchChannelsData } from './data'
import { Channel } from './types'
import { Tv } from 'lucide-react'

function App() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadChannels = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchChannelsData();
        setChannels(data);
      } catch (e) {
        setError('Erreur lors du chargement des programmes TV.');
        console.error("Erreur de Fetch API:", e);
      } finally {
        setLoading(false);
      }
    };

    loadChannels();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Chargement des programmes...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center">
          <Tv className="w-8 h-8 mr-2 text-blue-500" />
          Programme TV TNT du Soir
        </h1>
        <p className="text-gray-600">Découvrez les programmes TV de ce soir sur les chaînes de la TNT.</p>
      </header>
      <main className="container mx-auto">
        {channels.map((channel) => (
          <ChannelCard key={channel.id} channel={channel} />
        ))}
      </main>
      <footer className="text-center mt-8 text-gray-500">
        <p>© {new Date().getFullYear()} Mon Programme TV</p>
      </footer>
    </div>
  )
}

export default App
