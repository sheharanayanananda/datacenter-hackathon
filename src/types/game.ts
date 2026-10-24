export type GameStage = 'CHARACTER_SELECT' | 'PERMIT_STAMP' | 'CONSTRUCTION_STORY' | 'SIMULATION'

export type DataCenterLevel = 1 | 2 | 3

export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  isGuest?: boolean;
}

export interface GameSave {
  id: number;
  user_id: number;
  character_id: string | null;
  game_stage: GameStage;
  level: DataCenterLevel;
  money: number;
  xp: number;
  xp_needed: number;
  permit_approved: number;
  permit_approved_at: string | null;
  story_dialog_seen: number;
  unlocked_impacts: string;
  playtime_seconds: number;
  updated_at: string;
}

export interface CharacterProfile {
  id: string;
  name: string;
  title: string;
  avatar: string;
  bio: string;
  quote: string;
  color: string;
  tag: string;
  isPlayable: boolean;
  statusBadge: string;
  learningFocus: string;
}

export type ImpactDimensionKey =
  | 'energy'
  | 'surroundings'
  | 'jobs'
  | 'transport'
  | 'land_use'
  | 'safety'
  | 'future'

export interface LevelImpactStats {
  level: DataCenterLevel;
  name: string;
  investmentCost: string;
  constructionTime: string;
  constructionWorkers: number;
  powerCapacityMw: number;
  energyConsumptionGwh: string;
  annualEnergyBill: string;
  gridShareTampere: string;
  coolingBonusPercent: number;
  permanentStaff: number;
  wasteHeatMw: string;
  homesHeatedDistrict: string;
  noiseLevel: string;
  waterUsagePerYear: string;
  trafficIntensity: string;
  taxRevenuePerYear: string;
  efficiencyRating: 'C' | 'A' | 'A+';
}
