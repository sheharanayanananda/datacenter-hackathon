import { LevelImpactStats, ImpactDimensionKey, DataCenterLevel } from '../types/game'

export const LEVEL_STATS: Record<DataCenterLevel, LevelImpactStats> = {
  1: {
    level: 1,
    name: 'Starter Data Facility',
    investmentCost: '50M €',
    constructionTime: '12 – 18 Months',
    constructionWorkers: 125,
    powerCapacityMw: 5.0,
    energyConsumptionGwh: '~43.8 GWh',
    annualEnergyBill: '~3.4M €',
    gridShareTampere: '~0.3% of Tampere grid',
    coolingBonusPercent: 50,
    permanentStaff: 20,
    wasteHeatMw: '4.5 MW',
    homesHeatedDistrict: '350 detached houses',
    noiseLevel: '55 dB (Cooling fans)',
    waterUsagePerYear: '500,000 L / year',
    trafficIntensity: '5 vehicles / week',
    taxRevenuePerYear: '~€200,000 / year',
    efficiencyRating: 'C',
  },
  2: {
    level: 2,
    name: 'Regional Campus (Google-Scale)',
    investmentCost: '300M €',
    constructionTime: '18 – 24 Months',
    constructionWorkers: 500,
    powerCapacityMw: 37.5,
    energyConsumptionGwh: '~328 GWh',
    annualEnergyBill: '~20M €',
    gridShareTampere: '~2 – 3% of Tampere grid',
    coolingBonusPercent: 50,
    permanentStaff: 55,
    wasteHeatMw: '25 – 28 MW',
    homesHeatedDistrict: 'Entire neighborhood (~2,000 homes)',
    noiseLevel: 'Noise barriers & industrial zoning required',
    waterUsagePerYear: '4,000,000 L / year',
    trafficIntensity: '1 – 3 heavy trucks / day',
    taxRevenuePerYear: '~€1 – 2M / year',
    efficiencyRating: 'A',
  },
  3: {
    level: 3,
    name: 'Hyperscale Mega-Hub (Peak Level)',
    investmentCost: '~€1 Billion',
    constructionTime: '2 – 3 Years',
    constructionWorkers: 1500,
    powerCapacityMw: 120.0,
    energyConsumptionGwh: '~1,000 GWh',
    annualEnergyBill: '~€60 – 70M',
    gridShareTampere: '~10 – 15% of Tampere grid',
    coolingBonusPercent: 50,
    permanentStaff: 250,
    wasteHeatMw: '80 – 90 MW',
    homesHeatedDistrict: 'Major share of Tampere district heating (peak load ~600 MW)',
    noiseLevel: 'Very large: 20–40m buildings & cooling towers',
    waterUsagePerYear: '10 – 30 Million L / year',
    trafficIntensity: 'Multiple heavy trucks / day',
    taxRevenuePerYear: '~€5 – 15M / year',
    efficiencyRating: 'A+',
  },
}

export interface ImpactDimensionDetail {
  key: ImpactDimensionKey;
  title: string;
  finnishTitle: string;
  icon: string;
  badge: string;
  color: string;
  description: string;
  detailsByLevel: Record<DataCenterLevel, {
    headline: string;
    points: string[];
    metricValue: string;
    metricLabel: string;
  }>;
}

export const IMPACT_DIMENSIONS: ImpactDimensionDetail[] = [
  {
    key: 'energy',
    title: 'Energy',
    finnishTitle: 'Energia',
    icon: '⚡',
    badge: 'Power & Grid',
    color: 'amber',
    description: 'Electricity consumption, grid stability, cold-climate free cooling, and renewable generation.',
    detailsByLevel: {
      1: {
        headline: '5 MW Starter Grid Load',
        points: [
          'Consumes ~43.8 GWh per year with an annual electricity bill of around €3.4M.',
          'Finland’s cold subarctic climate provides 100% free-air cooling for over 8 months, slashing cooling bills by 50%.',
          'Represents ~0.3% of Tampere region’s total electrical load, supported by 1 local wind turbine.',
        ],
        metricValue: '5 MW',
        metricLabel: 'Power Capacity',
      },
      2: {
        headline: '37.5 MW Regional Campus Load',
        points: [
          'Annual consumption jumps to ~328 GWh, with an annual electricity bill around €20M.',
          'Accounts for 2–3% of Tampere’s entire municipal electricity consumption.',
          'Paired with multiple wind turbines and an on-site solar microgrid to buffer peak grid surges.',
        ],
        metricValue: '37.5 MW',
        metricLabel: 'Power Capacity',
      },
      3: {
        headline: '120 MW Hyperscale Grid Anchor',
        points: [
          'Consumes ~1,000 GWh annually with an electricity bill of €60–70M/year.',
          'Demands 10–15% of Tampere’s total power, requiring dedicated high-voltage substation integration with Fingrid.',
          'Continuous subarctic free cooling saves tens of millions of euros annually compared to southern European facilities.',
        ],
        metricValue: '120 MW',
        metricLabel: 'Power Capacity',
      },
    },
  },
  {
    key: 'surroundings',
    title: 'Surroundings',
    finnishTitle: 'Ympäristö & Lämpö',
    icon: '🏡',
    badge: 'District Heating & Noise',
    color: 'emerald',
    description: 'Waste heat capture for home heating, acoustic management, and neighborhood integration.',
    detailsByLevel: {
      1: {
        headline: '4.5 MW Waste Heat to 350 Houses',
        points: [
          'Extracts 4.5 MW of warm coolant water, directly heating ~350 detached single-family homes through district pipes.',
          'Noise from cooling fans remains at 55 dB, comparable to a quiet suburban street or moderate conversation.',
          'Low visual footprint seamlessly blending into the surrounding birch and pine forest.',
        ],
        metricValue: '4.5 MW',
        metricLabel: 'Waste Heat Export',
      },
      2: {
        headline: '25–28 MW Heat for 2,000 Homes',
        points: [
          'Supplies enough thermal energy to heat an entire residential neighborhood of ~2,000 homes in winter.',
          'Acoustic sound-barrier walls and industrial zoning buffers are installed along residential borders.',
          'Replaces fossil peak-heating boilers in Tampereen Sähkölaitos district heating network.',
        ],
        metricValue: '25–28 MW',
        metricLabel: 'Waste Heat Export',
      },
      3: {
        headline: '80–90 MW Tampere City District Heat',
        points: [
          'Covers a massive fraction of Tampere’s peak 600 MW municipal district heating load.',
          'Very large visual and acoustic footprint: 20–40m tall server halls and exterior cooling heat exchangers.',
          'Massive glowing underground pipeline network channelling zero-emission warmth across the city.',
        ],
        metricValue: '80–90 MW',
        metricLabel: 'Waste Heat Export',
      },
    },
  },
  {
    key: 'jobs',
    title: 'Jobs',
    finnishTitle: 'Työpaikat',
    icon: '👷',
    badge: 'Employment',
    color: 'blue',
    description: 'Construction workforce surge versus high-tech permanent operational employment.',
    detailsByLevel: {
      1: {
        headline: '125 Builders & 20 Permanent Jobs',
        points: [
          'Employed 125 local Finnish construction workers, civil engineers, and electricians for 12–18 months.',
          'Supports 20 permanent on-site jobs: server technicians, security personnel, and network engineers.',
          'Generates secondary local business for catering, transport, and maintenance.',
        ],
        metricValue: '20 Jobs',
        metricLabel: 'Permanent Staff',
      },
      2: {
        headline: '500 Builders & 55 Permanent Jobs',
        points: [
          'Involved 500 construction workers during the 18–24 month expansion phase.',
          'Provides 55 permanent careers in cloud engineering, facility mechanical operations, and cybersecurity.',
          'Partnerships with Tampere University (TUNI) for technical apprenticeships and trainee programs.',
        ],
        metricValue: '55 Jobs',
        metricLabel: 'Permanent Staff',
      },
      3: {
        headline: '1,500 Builders & 250 Permanent Jobs',
        points: [
          'Peak construction mobilized 1,000–2,000 Finnish and European infrastructure specialists over 2–3 years.',
          '250 permanent high-salary positions anchors Tampere as a leading Nordic AI & cloud tech capital.',
          'Catalyzes hundreds of spin-off jobs in IT consulting, green energy services, and municipal logistics.',
        ],
        metricValue: '250 Jobs',
        metricLabel: 'Permanent Staff',
      },
    },
  },
  {
    key: 'transport',
    title: 'Transport',
    finnishTitle: 'Liikenne',
    icon: '🚛',
    badge: 'Logistics',
    color: 'purple',
    description: 'Heavy construction vehicle traffic, server delivery logistics, and daily employee commuting.',
    detailsByLevel: {
      1: {
        headline: '5 Deliveries per Week',
        points: [
          'Low transport footprint: only ~5 service vans and light delivery trucks per week.',
          'Construction phase caused minimal wear on local municipal asphalt roads.',
          'Employee carpool and electric bike charging facilities installed at the site entrance.',
        ],
        metricValue: '5 / wk',
        metricLabel: 'Vehicle Traffic',
      },
      2: {
        headline: '1–3 Heavy Freight Trucks Daily',
        points: [
          '1–3 heavy logistics trucks arrive each day transporting server racks, replacement hardware, and supplies.',
          'Dedicated turning lanes and heavy-load road upgrades constructed to prevent neighborhood congestion.',
          'Daily commuting by 55 staff members accommodated in the newly paved staff carpark.',
        ],
        metricValue: '1–3 / day',
        metricLabel: 'Heavy Trucks',
      },
      3: {
        headline: 'Frequent Heavy Freight & Logistics',
        points: [
          'Multiple daily heavy freight vehicles, component shipments, and hazardous maintenance transports.',
          'Direct logistical connection to Tampere ring road (Valtatie 12) ensures municipal streets remain safe.',
          'Full security inspection checkpoints and automated freight scanning gates.',
        ],
        metricValue: 'Multiple / day',
        metricLabel: 'Heavy Logistics',
      },
    },
  },
  {
    key: 'land_use',
    title: 'Land Use',
    finnishTitle: 'Maankäyttö',
    icon: '🌲',
    badge: 'Forest & Zoning',
    color: 'emerald',
    description: 'Forest area cleared, soil stabilization, industrial zoning boundaries, and nature compensation.',
    detailsByLevel: {
      1: {
        headline: 'Compact Forest Footprint',
        points: [
          'Only a small forest plot cleared for Building Lot 1, leaving 85% of surrounding pine trees intact.',
          'Citizen concerns addressed with strict tree preservation buffers around neighboring walking paths.',
          'Compact modular foundation with permeable drainage gravel.',
        ],
        metricValue: 'Low',
        metricLabel: 'Forest Impact',
      },
      2: {
        headline: 'Campus Perimeter Expansion',
        points: [
          'Cleared additional forest for 4 modular data halls and the solar microgrid lawn.',
          'Designated green compensation corridor preserves local wildlife paths towards Lake Näsijärvi.',
          'Official municipal zoning switched to High-Tech Industrial Microdistrict.',
        ],
        metricValue: 'Moderate',
        metricLabel: 'Forest Impact',
      },
      3: {
        headline: 'Full Campus Footprint',
        points: [
          'Full footprint realized across the industrial sector with complete road network, carparks, and substation.',
          'Compensated with municipality-funded reforestation projects in northern Pirkanmaa.',
          'Industrial boundary buffers strictly separate data operations from Tampere residential zones.',
        ],
        metricValue: 'High',
        metricLabel: 'Industrial Footprint',
      },
    },
  },
  {
    key: 'safety',
    title: 'Safety',
    finnishTitle: 'Turvallisuus',
    icon: '🛡️',
    badge: 'Reliability & Water',
    color: 'rose',
    description: 'Closed-loop cooling water management, electrical safety, grid frequency stabilization, and security.',
    detailsByLevel: {
      1: {
        headline: 'Closed-Loop Cooling Safety',
        points: [
          'Water consumption: ~500,000 L / year in a closed eco-loop with zero discharge into Lake Näsijärvi.',
          'Standard industrial fire suppression using inert argon gas that harms neither servers nor people.',
          'Dual redundant municipal electrical grid feeds prevent local power flickers.',
        ],
        metricValue: '500k L',
        metricLabel: 'Annual Water Use',
      },
      2: {
        headline: 'Industrial Noise & Grid Safeguards',
        points: [
          'Water consumption: ~4,000,000 L / year with advanced evaporative pre-cooling during summer peaks.',
          'Acoustic barriers protect residential sleep quality while battery banks support Fingrid grid frequency.',
          'Gated access control, CCTV, and 24/7 physical security perimeter.',
        ],
        metricValue: '4M L',
        metricLabel: 'Annual Water Use',
      },
      3: {
        headline: 'Critical National Infrastructure',
        points: [
          'Water consumption: 10–30 Million L / year for industrial heat exchangers and closed cooling towers.',
          'Classified as critical digital infrastructure with military-grade cyber-physical security and backup generators.',
          'Battery Energy Storage Systems (BESS) stabilize Tampere’s entire municipal electricity grid in milliseconds.',
        ],
        metricValue: '10–30M L',
        metricLabel: 'Annual Water Use',
      },
    },
  },
  {
    key: 'future',
    title: 'Future',
    finnishTitle: 'Tulevaisuus & Verot',
    icon: '🚀',
    badge: 'Taxes & Growth',
    color: 'amber',
    description: 'Municipal tax windfalls for Tampere, circular economy scalability, and community prosperity.',
    detailsByLevel: {
      1: {
        headline: '€200,000 Annual Tax Inflow',
        points: [
          'Generates ~€200,000 per year in local corporate and property taxes for Tampere municipality.',
          'Funds local youth recreation, library upgrades, and initial green energy feasibility studies.',
          'Initial test of circular economy: proving server heat can heat Finnish living rooms.',
        ],
        metricValue: '€200k / yr',
        metricLabel: 'Municipal Taxes',
      },
      2: {
        headline: '€1 – 2 Million Annual Tax Revenue',
        points: [
          'Yields €1–2M every year into Tampere municipal coffers from property taxes and business levies.',
          'Finances new daycare facilities, solar-powered bus stops, and public sports facilities.',
          'Establishes Tampere as a benchmark for green computing across the Nordic countries.',
        ],
        metricValue: '€1–2M / yr',
        metricLabel: 'Municipal Taxes',
      },
      3: {
        headline: '€5 – 15 Million Municipal Windfall',
        points: [
          'Delivers a massive €5–15M annual tax bonanza directly enriching Tampere’s public budget.',
          'Enables lower municipal tax rates for local residents while funding state-of-the-art schools and hospitals.',
          'Crown achievement: 100% circular zero-emission digital infrastructure powering Finland’s future.',
        ],
        metricValue: '€5–15M / yr',
        metricLabel: 'Municipal Taxes',
      },
    },
  },
]
