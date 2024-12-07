import React, { useRef, useEffect } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { MapPin } from 'lucide-react';
import { Etymology } from '../../types';
import { MapMarker } from './MapMarker';
import { MapRoute } from './MapRoute';
import { MapLegend } from './MapLegend';
import { MapDetails } from './MapDetails';

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
                'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
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

      map.current.addControl(new maplibregl.NavigationControl());

      map.current.on('load', () => {
        if (map.current) {
          // Add route
          new MapRoute({ etymology: sortedEtymology, map: map.current });

          // Add markers
          sortedEtymology.forEach((entry, index) => {
            new MapMarker({
              entry,
              index,
              total: sortedEtymology.length,
              map: map.current!
            });
          });
        }
      });
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [sortedEtymology]);

  return (
    <div className="w-full max-w-4xl mx-auto mt-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <MapPin className="text-blue-500" />
          Geographical Evolution
        </h3>
        
        <MapLegend etymology={sortedEtymology} />

        <div ref={mapContainer} className="w-full h-[400px] rounded-lg overflow-hidden" />

        <div className="mt-6 space-y-4">
          <p className="text-sm text-gray-600">
            This map traces the geographical journey of the word through different languages and regions over time.
            Click on the markers to see detailed information about each stage of the word's evolution.
          </p>
          
          <MapDetails etymology={sortedEtymology} />
        </div>
      </div>
    </div>
  );
}