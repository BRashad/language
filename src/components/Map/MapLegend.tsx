import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Etymology } from '../../types';

interface MapLegendProps {
  etymology: Etymology[];
}

export function MapLegend({ etymology }: MapLegendProps) {
  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-4">
        {etymology.map((entry, index) => (
          <div key={index} className="flex items-center">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${
                index === 0 ? 'bg-emerald-500' : 
                index === etymology.length - 1 ? 'bg-blue-500' : 
                'bg-amber-500'
              }`} />
              <span className="text-sm font-medium text-gray-700">
                {entry.language} ({entry.year})
              </span>
            </div>
            {index < etymology.length - 1 && (
              <ArrowRight className="mx-2 text-gray-400" size={16} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}