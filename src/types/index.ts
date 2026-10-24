export interface CityStats {
  money: number;
  level: number;
  xp: number;
  xpNeeded: number;
  energyPercent: number;
  jobsCreated: number;
  greenEnergyMw: number;
  computingPowerPflops: number;
}

export type InspectionTab = 'overview' | 'energy' | 'jobs';

export interface HouseInfo {
  id: string;
  position: [number, number, number];
  rotation: number;
  color: 'yellow' | 'red' | 'slate' | 'brown';
  scale?: number;
  name: string;
}
