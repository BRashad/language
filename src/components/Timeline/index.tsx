import React from 'react';
import { History } from 'lucide-react';
import { TimelineEntry } from './TimelineEntry';
import { TimelineConnector } from './TimelineConnector';
import { Etymology } from '../../types';

interface TimelineProps {
  etymology: Etymology[];
}

export function Timeline({ etymology }: TimelineProps) {
  const sortedEtymology = [...etymology].sort((a, b) => a.year - b.year);

  return (
    <div className="w-full max-w-4xl mx-auto mt-8">
      <div className="flex items-center justify-center gap-3 mb-8">
        <History className="text-blue-600" size={24} />
        <h3 className="text-2xl font-semibold text-gray-800">Word Evolution</h3>
      </div>

      <div className="relative bg-gray-50 rounded-2xl p-8">
        <TimelineConnector />
        {sortedEtymology.map((entry, index) => (
          <TimelineEntry
            key={index}
            entry={entry}
            index={index}
            isFirst={index === 0}
            isLast={index === sortedEtymology.length - 1}
          />
        ))}
      </div>
    </div>
  );
}