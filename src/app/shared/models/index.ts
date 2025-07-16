export interface Device {
  icon: string;
  label: string;
  state: boolean;
}

export interface Sensor {
  icon: string;
  label: string;
  value: {
    amount: number;
    unit: string;
  };
}

export type CardItem = Device | Sensor;

export type CardLayout = 'single' | 'horizontal' | 'vertical';

export interface Card {
  id: string;
  title: string;
  layout: CardLayout;
  items: CardItem[];
}
