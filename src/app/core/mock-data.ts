import mockDataJson from './mock-data.json';
import { Tab, Device, Sensor } from '../shared/models';

export const mockData: Tab[] = mockDataJson.tabs.map((tab) => ({
  id: tab.id,
  title: tab.title,
  cards: tab.cards.map((card) => ({
    id: card.id,
    title: card.title,
    layout: card.layout as
      | 'singleDevice'
      | 'horizontalLayout'
      | 'verticalLayout',
    items: card.items.map((item) => {
      return item.type === 'device'
        ? ({
            type: 'device',
            icon: item.icon,
            label: item.label,
            state: item.state,
          } as Device)
        : ({
            type: 'sensor',
            icon: item.icon,
            label: item.label,
            value: item.value,
          } as Sensor);
    }),
  })),
}));
