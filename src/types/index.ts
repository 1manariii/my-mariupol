export interface Point {
  id: number;
  name: string;
  description: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  address: string;
}

export const POINTS: Point[] = [
  {
    id: 1,
    name: 'Красная площадь',
    description: 'Главная площадь Москвы',
    coordinates: { lat: 55.753994, lng: 37.622093 },
    address: 'Красная площадь, 1'
  },
  {
    id: 2,
    name: 'Московский Кремль',
    description: 'Исторический центр столицы',
    coordinates: { lat: 55.751574, lng: 37.617573 },
    address: 'Кремль'
  },
  {
    id: 3,
    name: 'Храм Василия Блаженного',
    description: 'Православный храм на Красной площади',
    coordinates: { lat: 55.752544, lng: 37.623421 },
    address: 'Красная площадь, 2'
  }
];