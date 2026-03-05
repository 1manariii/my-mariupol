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
    name: 'Драматический театр',
    description: 'Мариупольский академический драматический театр',
    coordinates: { lat: 47.095833, lng: 37.548611 },
    address: 'Театральная площадь, 1'
  },
  {
    id: 2,
    name: 'Морской порт',
    description: 'Мариупольский морской торговый порт',
    coordinates: { lat: 47.058889, lng: 37.507222 },
    address: 'проспект Лунина, 99'
  },
  {
    id: 3,
    name: 'Городской сад',
    description: 'Центральный парк культуры и отдыха',
    coordinates: { lat: 47.095278, lng: 37.540556 },
    address: 'проспект Мира, 80'
  },
  {
    id: 4,
    name: 'Собор Святого Архистратига Михаила',
    description: 'Кафедральный собор',
    coordinates: { lat: 47.101667, lng: 37.548889 },
    address: 'проспект Металлургов, 15'
  },
  {
    id: 5,
    name: 'Стадион имени Владимира Бойко',
    description: 'Главный стадион города, домашняя арена ФК "Мариуполь"',
    coordinates: { lat: 47.141795, lng: 37.565672 }, // Исправленные координаты
    address: 'парк Петровского'
  }
];

// Центр Мариуполя (можно оставить прежним или обновить)
export const MARIUPOL_CENTER = {
  lat: 47.095833, // или рассчитать среднее между всеми точками
  lng: 37.548611
};