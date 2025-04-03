import React from 'react'
import { Program } from '../types'

interface ProgramListProps {
  programs: Program[]
}

export const ProgramList: React.FC<ProgramListProps> = ({ programs }) => {
  return (
    <ul>
      {programs.map((program) => (
        <li key={program.id} className="mb-4 p-2 rounded-md bg-gray-50 shadow-sm">
          <div className="flex items-start">
            {program.vignette && (
              <img src={`/vignettes/${program.vignette}`} alt={program.title} className="w-20 h-auto mr-4 rounded-md" />
            )}
            <div>
              <div className="flex items-center mb-1">
                <span className="font-medium text-gray-700 mr-2">{program.time}</span>
                <span className="text-gray-800 font-semibold">{program.title}</span>
              </div>
              {program.summary && (
                <p className="text-sm text-gray-600 mt-1">{program.summary}</p>
              )}
              {program.description && (
                <p className="text-sm text-gray-600 mt-1 italic">{program.description}</p>
              )}
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}
