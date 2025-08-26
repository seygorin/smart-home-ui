export interface SensorValue {
  amount: number;
  unit: string;
}

export interface CardItemBase {
  icon: string;
  label: string;
}

export interface Sensor extends CardItemBase {
  type: 'sensor';
  value: SensorValue;
}

export interface Device extends CardItemBase {
  type: 'device';
  state: boolean;
}

export type CardItem = Sensor | Device;

export interface Card {
  id: string;
  title: string;
  layout: 'singleDevice' | 'horizontalLayout' | 'verticalLayout';
  items: CardItem[];
}

export interface Tab {
  id: string;
  title: string;
  cards: Card[];
}
