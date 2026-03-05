import React, { useState, useRef } from 'react';
import './App.css';
import MapComponent from './components/MapComponent';
import BottomSheet from './components/BottomSheet';
import { POINTS, type Point } from './types';

const App: React.FC = () => {
  const [selectedPoint, setSelectedPoint] = useState<Point | null>(null);
  const mapRef = useRef<any>(null);

  const handlePointSelect = (point: Point | null) => {
    console.log('handlePointSelect вызван с:', point);
    setSelectedPoint(point);
    
    if (point && mapRef.current) {
      console.log('Перемещаем карту к точке:', point.name);
      mapRef.current.panTo([point.coordinates.lat, point.coordinates.lng], {
        flying: true,
        duration: 300
      });
    }
  };

  return (
    <div className="app">
      <MapComponent
        ref={mapRef}
        selectedPoint={selectedPoint}
        points={POINTS}
        onPointClick={handlePointSelect}
      />
      <BottomSheet
        points={POINTS}
        onPointSelect={handlePointSelect}
        selectedPoint={selectedPoint}
      />
    </div>
  );
};

export default App;