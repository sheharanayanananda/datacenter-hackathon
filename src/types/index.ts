export interface CityStats {
  money: number;
  level: number;
  xp: number;
  xpNeeded: number;
  energyPercent: number;
  heatRecyclingActive: boolean;
  jobsCreated: number;
  greenEnergyMw: number;
  heatOutputMwh: number;
  housesHeated: number;
}

export type InspectionTab = 'overview' | 'energy' | 'heat' | 'jobs';

export interface HouseInfo {
  id: string;
  position: [number, number, number];
  rotation: number;
  color: 'yellow' | 'red' | 'slate' | 'brown';
  scale?: number;
  heatConnected: boolean;
  name: string;
}
