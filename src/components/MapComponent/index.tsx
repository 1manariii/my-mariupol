import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import './styles.scss';
import type { Point } from '../../types';

interface MapComponentProps {
  selectedPoint: Point | null;
  points: Point[];
  onPointClick: (point: Point) => void;
}

const MapComponent = forwardRef<any, MapComponentProps>(({ 
  selectedPoint, 
  points, 
  onPointClick 
}, ref) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  useImperativeHandle(ref, () => ({
    panTo: (coordinates: [number, number], options?: any) => {
      if (mapInstance.current) {
        mapInstance.current.panTo(coordinates, options);
      }
    }
  }));

  useEffect(() => {
    if (!mapContainer.current || !window.ymaps) return;

    window.ymaps.ready(() => {
      if (mapInstance.current) return;

      mapInstance.current = new window.ymaps.Map(mapContainer.current, {
        center: [55.751574, 37.617573],
        zoom: 12,
        controls: ['zoomControl', 'fullscreenControl']
      });

      // Создание меток
      points.forEach(point => {
        const marker = new window.ymaps.Placemark(
          [point.coordinates.lat, point.coordinates.lng],
          {
            hintContent: point.name,
            balloonContent: point.description
          },
          {
            preset: 'islands#icon',
            iconColor: '#4a90e2'
          }
        );

        marker.events.add('click', () => {
          onPointClick(point);
        });

        mapInstance.current.geoObjects.add(marker);
        markersRef.current.push(marker);
      });
    });

    return () => {
      if (mapInstance.current) {
        mapInstance.current.destroy();
        mapInstance.current = null;
      }
    };
  }, []);

  // Обновление выделенной метки
  useEffect(() => {
    if (!mapInstance.current || !selectedPoint) return;

    markersRef.current.forEach((marker, index) => {
      const isSelected = points[index].id === selectedPoint.id;
      marker.options.set('iconColor', isSelected ? '#e24a4a' : '#4a90e2');
    });
  }, [selectedPoint]);

  return <div ref={mapContainer} className="map-component" />;
});

export default MapComponent;