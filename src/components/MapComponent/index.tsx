import { useEffect, useRef, forwardRef, useImperativeHandle, useState } from 'react';
import './styles.scss';
import type { Point } from '../../types';
import { MARIUPOL_CENTER } from '../../types';

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
  const [isMapReady, setIsMapReady] = useState(false);

  useImperativeHandle(ref, () => ({
    panTo: (coordinates: [number, number], options?: any) => {
      if (mapInstance.current) {
        mapInstance.current.panTo(coordinates, options);
      }
    }
  }));

  // Проверка загрузки Яндекс карт
  useEffect(() => {
    const checkYandexMaps = () => {
      if (window.ymaps) {
        console.log('Yandex Maps загружен');
        setIsMapReady(true);
      } else {
        setTimeout(checkYandexMaps, 100);
      }
    };

    checkYandexMaps();
  }, []);

  // Инициализация карты
  useEffect(() => {
    if (!isMapReady || !mapContainer.current || mapInstance.current) return;

    window.ymaps.ready(() => {
      if (mapInstance.current) return;

      // Создаем карту с центром в Мариуполе
      mapInstance.current = new window.ymaps.Map(mapContainer.current, {
        center: [MARIUPOL_CENTER.lat, MARIUPOL_CENTER.lng],
        zoom: 13,
        controls: ['zoomControl', 'fullscreenControl']
      });

      console.log('Карта инициализирована с центром в Мариуполе');

      // Создание меток для всех точек
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

      console.log(`Добавлено ${markersRef.current.length} меток в Мариуполе`);
    });

    return () => {
      if (mapInstance.current) {
        mapInstance.current.destroy();
        mapInstance.current = null;
      }
    };
  }, [isMapReady]);

  // Обновление выделенной метки
  useEffect(() => {
    if (!mapInstance.current || !selectedPoint) return;

    markersRef.current.forEach((marker, index) => {
      const isSelected = points[index].id === selectedPoint.id;
      marker.options.set('iconColor', isSelected ? '#e24a4a' : '#4a90e2');
    });
  }, [selectedPoint]);

  if (!isMapReady) {
    return <div className="map-loading">Загрузка карты...</div>;
  }

  return <div ref={mapContainer} className="map-component" />;
});

export default MapComponent;