import React, { useState, useEffect, useRef } from 'react';
import './styles.scss';
import type { Point } from '../../types';

interface BottomSheetProps {
  points: Point[];
  onPointSelect: (point: Point) => void;
  selectedPoint: Point | null;
}

type SheetState = 'min' | 'mid' | 'max';

const BottomSheet: React.FC<BottomSheetProps> = ({
  points,
  onPointSelect,
  selectedPoint
}) => {
  const [sheetState, setSheetState] = useState<SheetState>('min'); // min = 1/3, mid = 2/3, max = полный экран (опционально)
  const [isDragging, setIsDragging] = useState(false);
  const startY = useRef<number>(0);
  const currentY = useRef<number>(0);
  const sheetRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Функция для определения высоты в зависимости от состояния
  const getSheetHeight = (state: SheetState): string => {
    switch(state) {
      case 'min':
        return '33vh'; // 1/3 экрана
      case 'mid':
        return '66vh'; // 2/3 экрана
      case 'max':
        return '90vh'; // почти полный экран
      default:
        return '33vh';
    }
  };

  // Обновляем высоту при изменении состояния
  useEffect(() => {
    if (sheetRef.current) {
      sheetRef.current.style.height = getSheetHeight(sheetState);
    }
  }, [sheetState]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    startY.current = e.touches[0].clientY;
    currentY.current = e.touches[0].clientY;
    
    if (sheetRef.current) {
      sheetRef.current.style.transition = 'none';
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !sheetRef.current) return;
    
    currentY.current = e.touches[0].clientY;
    const deltaY = currentY.current - startY.current;
    
    // Предотвращаем скролл контента при драге за хедер
    if (contentRef.current && deltaY < 0 && sheetState === 'max') {
      // Если тянем вверх и уже максимальная высота, разрешаем скролл контента
      return;
    }
    
    e.preventDefault();
    
    // Рассчитываем новую высоту
    const currentHeight = parseFloat(getSheetHeight(sheetState));
    const windowHeight = window.innerHeight;
    const deltaHeight = -deltaY; // Инвертируем, потому что тянем вверх для увеличения
    const newHeight = Math.min(windowHeight * 0.9, Math.max(windowHeight * 0.33, currentHeight + deltaHeight));
    
    sheetRef.current.style.height = `${newHeight}px`;
  };

  const handleTouchEnd = () => {
    if (!isDragging || !sheetRef.current) return;
    
    setIsDragging(false);
    sheetRef.current.style.transition = 'height 0.3s ease-out';
    
    const currentHeight = parseFloat(sheetRef.current.style.height);
    const windowHeight = window.innerHeight;
    const minHeight = windowHeight * 0.33;
    const midHeight = windowHeight * 0.66;
    
    // Определяем, к какому состоянию нужно перейти
    if (currentHeight < minHeight + (midHeight - minHeight) / 2) {
      setSheetState('min');
    } else if (currentHeight < midHeight + (windowHeight * 0.9 - midHeight) / 2) {
      setSheetState('mid');
    } else {
      setSheetState('max');
    }
  };

  // Сброс состояния при выборе новой точки
  useEffect(() => {
    if (selectedPoint) {
      // Можно автоматически раскрывать панель при выборе точки
      // setSheetState('mid');
    }
  }, [selectedPoint]);

  return (
    <div 
      ref={sheetRef}
      className={`bottom-sheet bottom-sheet--${sheetState}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      <div className="bottom-sheet__header">
        <div className="bottom-sheet__drag-handle" />
        <div className="bottom-sheet__indicator">
          <span className={`bottom-sheet__dot ${sheetState === 'min' ? 'bottom-sheet__dot--active' : ''}`} />
          <span className={`bottom-sheet__dot ${sheetState === 'mid' ? 'bottom-sheet__dot--active' : ''}`} />
          <span className={`bottom-sheet__dot ${sheetState === 'max' ? 'bottom-sheet__dot--active' : ''}`} />
        </div>
      </div>
      
      <div ref={contentRef} className="bottom-sheet__content">
        {selectedPoint ? (
          // Детальный вид выбранной точки
          <div className="bottom-sheet__selected-section">
            <div className="bottom-sheet__selected-header">
              <h2 className="bottom-sheet__title">{selectedPoint.name}</h2>
              <button 
                className="bottom-sheet__back-button"
                onClick={() => onPointSelect(points[0])} // Возврат к списку
              >
                ← К списку
              </button>
            </div>
            
            <div className="bottom-sheet__selected-info">
              <p className="bottom-sheet__description">{selectedPoint.description}</p>
              <p className="bottom-sheet__address">{selectedPoint.address}</p>
              <div className="bottom-sheet__coordinates">
                <span>Широта: {selectedPoint.coordinates.lat.toFixed(4)}</span>
                <span>Долгота: {selectedPoint.coordinates.lng.toFixed(4)}</span>
              </div>
            </div>
            
            <button 
              className="bottom-sheet__action-button"
              onClick={() => window.open(`https://maps.yandex.ru/?ll=${selectedPoint.coordinates.lng},${selectedPoint.coordinates.lat}&z=17`, '_blank')}
            >
              Открыть в Яндекс Картах
            </button>
          </div>
        ) : (
          // Список точек
          <>
            <h2 className="bottom-sheet__title">Интересные места</h2>
            <p className="bottom-sheet__subtitle">Выберите точку на карте</p>
            
            <div className="bottom-sheet__points-list">
              {points.map(point => (
                <div
                  key={point.id}
                  className="bottom-sheet__point-item"
                  onClick={() => onPointSelect(point)}
                >
                  <div className="bottom-sheet__point-info">
                    <h4>{point.name}</h4>
                    <p>{point.description}</p>
                    <span className="bottom-sheet__point-address">{point.address}</span>
                  </div>
                  <div className="bottom-sheet__point-arrow">→</div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BottomSheet;