import { motion } from 'framer-motion';
import { Etymology } from '../../types';

interface MapDetailsProps {
  etymology: Etymology[];
}

export function MapDetails({ etymology }: MapDetailsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {etymology.map((entry, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg"
        >
          <div className={`w-2 h-2 mt-2 rounded-full ${
            index === 0 ? 'bg-emerald-500' : 
            index === etymology.length - 1 ? 'bg-blue-500' : 
            'bg-amber-500'
          }`} />
          <div>
            <div className="font-medium text-gray-800">
              {entry.form}
              {entry.originalScript && (
                <span className="text-gray-600 ml-2 font-arabic">
                  {entry.originalScript}
                </span>
              )}
            </div>
            <div className="text-gray-600 text-sm">
              {entry.language}, {entry.year}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}