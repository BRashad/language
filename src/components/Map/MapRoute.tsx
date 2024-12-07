import { useEffect } from 'react';
import maplibregl from 'maplibre-gl';
import { Etymology } from '../../types';

interface MapRouteProps {
  etymology: Etymology[];
  map: maplibregl.Map;
}

export class MapRoute {
  private map: maplibregl.Map;
  private etymology: Etymology[];

  constructor({ etymology, map }: MapRouteProps) {
    this.map = map;
    this.etymology = etymology;
    this.addRoute();
  }

  private addRoute() {
    const coordinates = this.etymology.map(entry => [entry.location.lng, entry.location.lat]);

    this.map.addSource('route', {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates
        }
      }
    });

    this.map.addLayer({
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
  }
}