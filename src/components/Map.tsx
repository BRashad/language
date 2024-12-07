import React, { useRef, useEffect } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { motion } from 'framer-motion';
import { MapPin, ArrowRight } from 'lucide-react';
import { Etymology } from '../types';

interface MapProps {
  etymology: Etymology[];
}

export function Map({ etymology }: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const sortedEtymology = [...etymology].sort((a, b) => a.year - b.year);

  useEffect(() => {
    if (!map.current && mapContainer.current) {
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: {
          version: 8,
          sources: {
            osm: {
              type: 'raster',
              tiles: [
                'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
                'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
                'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png'
              ],
              tileSize: 256,
              attribution: '© OpenStreetMap contributors'
            }
          },
          layers: [
            {
              id: 'osm',
              type: 'raster',
              source: 'osm',
              minzoom: 0,
              maxzoom: 19
            }
          ]
        },
        center: [65, 45],
        zoom: 3
      });

      // Add navigation controls
      map.current.addControl(new maplibregl.NavigationControl());

      // Add markers and connections when map loads
      map.current.on('load', () => {
        // Add a source for the route line
        map.current?.addSource('route', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: sortedEtymology.map(entry => [entry.location.lng, entry.location.lat])
            }
          }
        });

        // Add the line layer
        map.current?.addLayer({
          id: 'route',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#4B5563',
            'line-width': 2,
            'line-dasharray': [2, 2]
          }
        });

        // Add markers
        sortedEtymology.forEach((entry, index) => {
          const el = document.createElement('div');
          el.className = 'custom-marker';
          el.style.width = '24px';
          el.style.height = '24px';
          el.style.borderRadius = '50%';
          el.style.backgroundColor = index === 0 ? '#10B981' : 
                                   index === sortedEtymology.length - 1 ? '#3B82F6' : 
                                   '#F59E0B';
          el.style.border = '2px solid white';
          el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';

          const popup = new maplibregl.Popup({ offset: 25 })
            .setHTML(`
              <div class="p-2">
                <div class="font-bold">${entry.form}${entry.originalScript ? ` (${entry.originalScript})` : ''}</div>
                <div class="text-sm">${entry.language}, ${entry.year}</div>
                <div class="text-sm italic">${entry.meaning}</div>
              </div>
            `);

          new maplibregl.Marker(el)
            .setLngLat([entry.location.lng, entry.location.lat])
            .setPopup(popup)
            .addTo(map.current!);
        });
      });
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [etymology]);

  return (
    <div className="w-full max-w-4xl mx-auto mt-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <MapPin className="text-blue-500" />
          Geographical Evolution
        </h3>
        
        <div className="mb-6">
          <div className="flex flex-wrap gap-4">
            {sortedEtymology.map((entry, index) => (
              <div key={index} className="flex items-center">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${
                    index === 0 ? 'bg-emerald-500' : 
                    index === sortedEtymology.length - 1 ? 'bg-blue-500' : 
                    'bg-amber-500'
                  }`} />
                  <span className="text-sm font-medium text-gray-700">
                    {entry.language} ({entry.year})
                  </span>
                </div>
                {index < sortedEtymology.length - 1 && (
                  <ArrowRight className="mx-2 text-gray-400" size={16} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div ref={mapContainer} className="w-full h-[400px] rounded-lg overflow-hidden" />

        <div className="mt-6 space-y-4">
          <p className="text-sm text-gray-600">
            This map traces the geographical journey of the word through different languages and regions over time.
            Click on the markers to see detailed information about each stage of the word's evolution.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {sortedEtymology.map((entry, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg"
              >
                <div className={`w-2 h-2 mt-2 rounded-full ${
                  index === 0 ? 'bg-emerald-500' : 
                  index === sortedEtymology.length - 1 ? 'bg-blue-500' : 
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
        </div>
      </div>
    </div>
  );
}