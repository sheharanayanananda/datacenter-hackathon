import { DataCenterLevel } from '../types/game'

export type InspectableCategory =
  | 'datacenter'
  | 'house'
  | 'carpark'
  | 'forest'
  | 'road'
  | 'wind'
  | 'solar'
  | 'tower'
  | 'lake'
  | 'rock'

export interface InspectableStatItem {
  label: string;
  value: string;
  iconName: 'zap' | 'flame' | 'shield' | 'truck' | 'trees' | 'battery' | 'gauge' | 'coins' | 'cpu' | 'waves' | 'droplets';
  color: 'emerald' | 'amber' | 'sky' | 'purple' | 'rose' | 'teal';
}

export interface InspectableObjectData {
  id: string;
  category: InspectableCategory;
  title: string;
  subtitle: string;
  position: [number, number, number];
  badge: string;
  badgeColor: string;
  stats?: InspectableStatItem[];
  ecoHighlight: string;
  description?: string;
  hasDetails?: boolean;
}

export function getInspectableObjectData(
  category: InspectableCategory,
  level: DataCenterLevel,
  options?: {
    id?: string;
    customTitle?: string;
    position?: [number, number, number];
    customData?: Record<string, any>;
  }
): InspectableObjectData {
  switch (category) {
    case 'datacenter': {
      const pflops = level === 1 ? '15 PFLOPS' : level === 2 ? '85 PFLOPS' : '350 PFLOPS'
      const wasteHeat = level === 1 ? '4.5 MW' : level === 2 ? '28 MW' : '90 MW'
      const pue = level === 1 ? '1.14 PUE' : level === 2 ? '1.09 PUE' : '1.06 PUE'
      const activeUnits = level === 1 ? '1 of 4 Halls' : level === 2 ? '3 of 4 Halls' : 'All 4 Halls (Peak)'

      return {
        id: options?.id || 'datacenter',
        category: 'datacenter',
        title: options?.customTitle || 'Data Center',
        subtitle: `Tampere Zero-Emission Compute Hub • ${activeUnits}`,
        position: options?.position || [10.0, 2.2, -5.5],
        badge: 'Zero Emission',
        badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        stats: [
          { label: 'Compute Power', value: pflops, iconName: 'cpu', color: 'sky' },
          { label: 'Heat Output', value: wasteHeat, iconName: 'flame', color: 'amber' },
          { label: 'Efficiency', value: pue, iconName: 'gauge', color: 'emerald' },
        ],
        ecoHighlight:
          '97% of server electrical power is recovered as 65°C hot water and injected directly into Tampere municipal district heating.',
      }
    }

    case 'house': {
      const houseId = options?.id || 'house'
      const name = options?.customTitle || 'Civilian Residence'
      return {
        id: houseId,
        category: 'house',
        title: name,
        subtitle: 'District Heated Home',
        position: options?.position || [-13.5, 1.4, 2.6],
        badge: 'Civilian Home',
        badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
        stats: [
          { label: 'Heat Source', value: 'Data Center', iconName: 'flame', color: 'amber' },
          { label: 'Living Room', value: '+21.5°C', iconName: 'shield', color: 'emerald' },
          { label: 'Energy Bill', value: '-40% Cost', iconName: 'coins', color: 'teal' },
        ],
        ecoHighlight:
          'Heated entirely by datacenter servers. Zero fossil fuel boilers needed even during -20°C Finnish winter nights.',
      }
    }

    case 'carpark': {
      return {
        id: options?.id || 'carpark',
        category: 'carpark',
        title: options?.customTitle || 'Carpark',
        subtitle: 'Smart Charging & V2G Battery Grid',
        position: options?.position || [22.8, 0.4, -8.5],
        badge: 'V2G Storage',
        badgeColor: 'bg-sky-100 text-sky-800 border-sky-300',
        stats: [
          { label: 'Smart Chargers', value: '8 Fast Stalls', iconName: 'zap', color: 'sky' },
          { label: 'Daily Commuters', value: level === 1 ? '20 Staff' : level === 2 ? '55 Staff' : '250 Staff', iconName: 'battery', color: 'emerald' },
          { label: 'Peak Buffer', value: 'Active V2G', iconName: 'gauge', color: 'purple' },
        ],
        ecoHighlight:
          'Parked electric vehicles feed energy back into the campus microgrid during datacenter compute spikes, stabilizing the city grid.',
      }
    }

    case 'forest': {
      const kept = level === 1 ? '85% Kept' : level === 2 ? '75% Kept' : '65% Kept'
      const co2 = level === 1 ? '18.5 t/yr' : level === 2 ? '15.2 t/yr' : '12.8 t/yr'
      return {
        id: options?.id || 'forest',
        category: 'forest',
        title: options?.customTitle || 'Pine Forest',
        subtitle: 'Lake Näsijärvi Ecological Buffer Zone',
        position: options?.position || [-2.0, 1.8, 5.0],
        badge: 'Protected Habitat',
        badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        stats: [
          { label: 'Forest Kept', value: kept, iconName: 'trees', color: 'emerald' },
          { label: 'CO₂ Absorbed', value: co2, iconName: 'shield', color: 'teal' },
          { label: 'Noise Shield', value: '-12 dB', iconName: 'gauge', color: 'sky' },
        ],
        ecoHighlight:
          'Preserved pine forest acts as a natural acoustic dampener and bio-filtration watershed protecting Lake Näsijärvi water purity.',
      }
    }

    case 'road': {
      const flow = level === 1 ? '5 EV / wk' : level === 2 ? '1-3 EV / d' : 'Smart Logistics'
      return {
        id: options?.id || 'road',
        category: 'road',
        title: options?.customTitle || 'Road',
        subtitle: 'Low-Noise Permeable Smart Pavement',
        position: options?.position || [20.0, 0.4, -8.5],
        badge: 'Eco Transit',
        badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
        stats: [
          { label: 'Fleet Traffic', value: flow, iconName: 'truck', color: 'purple' },
          { label: 'Street Paving', value: 'Low-Noise', iconName: 'shield', color: 'teal' },
          { label: 'Lighting', value: 'Solar LED', iconName: 'zap', color: 'amber' },
        ],
        ecoHighlight:
          'Heavy datacenter freight and server deliveries are routed around residential zones to maximize pedestrian safety and tranquility.',
      }
    }

    case 'wind': {
      const gen = level === 1 ? '5.0 MW' : level === 2 ? '18.5 MW' : '40.0 MW'
      return {
        id: options?.id || 'wind-1',
        category: 'wind',
        title: options?.customTitle || 'Wind Turbine',
        subtitle: 'Renewable Power',
        position: options?.position || [11.0, 4.6, 9.5],
        badge: '100% Renewable',
        badgeColor: 'bg-teal-100 text-teal-800 border-teal-300',
        stats: [
          { label: 'Clean Power', value: gen, iconName: 'zap', color: 'teal' },
          { label: 'Capacity Factor', value: '42% High', iconName: 'gauge', color: 'sky' },
          { label: 'Carbon Cost', value: '0 g CO₂', iconName: 'shield', color: 'emerald' },
        ],
        ecoHighlight:
          'Direct wind feed powers hyperscale servers with 100% hourly matched renewable electricity without carbon footprint.',
      }
    }

    case 'solar': {
      const cap = level === 1 ? 'Planning' : level === 2 ? '2.5 MW' : '10.0 MW'
      return {
        id: options?.id || 'solar',
        category: 'solar',
        title: options?.customTitle || 'Solar Farm',
        subtitle: 'Sub-Zero High Efficiency Ground Array',
        position: options?.position || [14.0, 0.8, -14.0],
        badge: 'Solar Array',
        badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
        stats: [
          { label: 'Peak Yield', value: cap, iconName: 'zap', color: 'amber' },
          { label: 'Bifacial Gain', value: '+18% Snow', iconName: 'gauge', color: 'sky' },
          { label: 'Inverters', value: '99.2% Eff.', iconName: 'shield', color: 'emerald' },
        ],
        ecoHighlight:
          'Snow reflects sunlight onto the rear of bifacial solar panels, boosting winter output precisely during high compute demand.',
      }
    }

    case 'tower': {
      return {
        id: options?.id || 'tower',
        category: 'tower',
        title: options?.customTitle || 'Näsinneula Tower',
        subtitle: 'Tampere Historic Architectural Icon',
        position: options?.position || [-5.0, 7.8, -6.0],
        badge: 'City Icon',
        badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
        stats: [
          { label: 'Tower Height', value: '168 meters', iconName: 'shield', color: 'sky' },
          { label: 'Lake View', value: 'Näsijärvi', iconName: 'trees', color: 'teal' },
          { label: 'Symbol', value: 'Innovation', iconName: 'zap', color: 'amber' },
        ],
        ecoHighlight:
          'Stands proudly over Lake Näsijärvi, witnessing Tampere\'s evolution into Europe\'s benchmark sustainable digital city.',
      }
    }

    case 'lake': {
      return {
        id: options?.id || 'lake-nasijarvi',
        category: 'lake',
        title: options?.customTitle || 'Lake Näsijärvi',
        subtitle: 'Natural Nordic Lake',
        position: options?.position || [-16.0, 0.4, -19.5],
        badge: 'Natural Lake',
        badgeColor: 'bg-sky-100 text-sky-800 border-sky-300',
        stats: [
          { label: 'Surface Area', value: '256 km²', iconName: 'waves', color: 'sky' },
          { label: 'Max Depth', value: '61 m', iconName: 'gauge', color: 'teal' },
          { label: 'Water Quality', value: 'Pristine', iconName: 'shield', color: 'emerald' },
        ],
        ecoHighlight:
          'A pristine natural oligotrophic lake in Pirkanmaa, forming the centerpiece of Tampere\'s natural landscape and ecosystem.',
      }
    }

    case 'rock': {
      return {
        id: options?.id || 'granite-rocks',
        category: 'rock',
        title: options?.customTitle || 'Rocks',
        subtitle: 'Landscape',
        position: options?.position || [-10.0, 1.2, -14.0],
        badge: 'Terrain',
        badgeColor: 'bg-slate-100 text-slate-800 border-slate-300',
        stats: [],
        hasDetails: false,
        ecoHighlight: 'Just natural rocks scattered along the terrain.',
        description: 'Just natural rocks scattered along the terrain.',
      }
    }
  }
}
