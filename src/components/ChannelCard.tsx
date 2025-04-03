import React from 'react'
import { Channel } from '../types'
import { ProgramList } from './ProgramList'
import { Tv2 } from 'lucide-react'

interface ChannelCardProps {
  channel: Channel
}

export const ChannelCard: React.FC<ChannelCardProps> = ({ channel }) => {
  const today = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="flex items-center mb-2">
        {channel.logo && (
          <img src={channel.logo} alt={`${channel.name} logo`} className="w-8 h-8 mr-2" />
        )}
        <Tv2 className="w-5 h-5 mr-2 text-gray-500" />
        <h2 className="text-xl font-semibold text-gray-800">{channel.name}</h2>
      </div>
      <p className="text-gray-600 text-sm mb-2">Programmes du {today}</p> {/* Affichage de la date */}
      <ProgramList programs={channel.programs} />
    </div>
  )
}
