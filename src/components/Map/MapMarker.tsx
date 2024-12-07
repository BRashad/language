import maplibregl from 'maplibre-gl';
import { Etymology } from '../../types';

interface MapMarkerProps {
  entry: Etymology;
  index: number;
  total: number;
  map: maplibregl.Map;
}

export class MapMarker {
  private marker: maplibregl.Marker;

  constructor({ entry, index, total, map }: MapMarkerProps) {
    const el = document.createElement('div');
    el.className = 'custom-marker';
    el.style.width = '24px';
    el.style.height = '24px';
    el.style.borderRadius = '50%';
    el.style.backgroundColor = index === 0 ? '#10B981' : 
                             index === total - 1 ? '#3B82F6' : 
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

    this.marker = new maplibregl.Marker(el)
      .setLngLat([entry.location.lng, entry.location.lat])
      .setPopup(popup)
      .addTo(map);
  }
}