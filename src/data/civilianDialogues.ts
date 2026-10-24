export interface DialogueLine {
  speaker: 'helmi' | 'matti';
  speakerName: string;
  role: string;
  avatar: string; // Image path or fallback
  text: string;
  expression?: 'skeptical' | 'happy' | 'explaining' | 'surprised';
}

export interface CivilianScenario {
  id: string;
  title: string;
  subtitle: string;
  lines: DialogueLine[];
}

export const CIVILIAN_DIALOGUES: Record<string, CivilianScenario> = {
  // Triggered right after Phase 1 construction
  phase1: {
    id: 'phase1',
    title: 'Local Neighborhood Debrief',
    subtitle: 'Civilians react to the newly cleared site and facility',
    lines: [
      {
        speaker: 'helmi',
        speakerName: 'Helmi Lindholm',
        role: 'Jogging Club & Nature Resident',
        avatar: '/assets/characters/civilian_skeptic.png',
        text: 'Wait! You cleared 3.2 acres of trees right beside our forest jogging trail! Where will the owls go, and what about constant humming from giant cooling fans?',
        expression: 'skeptical',
      },
      {
        speaker: 'matti',
        speakerName: 'Matti Korhonen',
        role: 'District Heating Resident & Technician',
        avatar: '/assets/characters/civilian_supporter.png',
        text: 'Helmi, look closer! The city kept 18.5 acres (85%) of the surrounding pine forest untouched. That single wind turbine powers the clean site, and sub-zero Nordic air cools the servers under a quiet 55 dB limit!',
        expression: 'explaining',
      },
      {
        speaker: 'helmi',
        speakerName: 'Helmi Lindholm',
        role: 'Jogging Club & Nature Resident',
        avatar: '/assets/characters/civilian_skeptic.png',
        text: 'Really? But what do our neighborhood families get out of having a 5 MW server building right next to our homes?',
        expression: 'surprised',
      },
      {
        speaker: 'matti',
        speakerName: 'Matti Korhonen',
        role: 'District Heating Resident & Technician',
        avatar: '/assets/characters/civilian_supporter.png',
        text: 'Every kilowatt of computing turns into clean heat! Their underground pipes are pumping 4.5 MW of thermal water straight into 350 local homes this winter. My family will stay cozy with zero fossil fuels!',
        expression: 'happy',
      },
    ],
  },

  // Triggered after upgrading to Level 2 (Mid-scale expansion)
  level2: {
    id: 'level2',
    title: 'Expansion Feedback',
    subtitle: 'Town reaction to new server bays and turbines',
    lines: [
      {
        speaker: 'helmi',
        speakerName: 'Helmi Lindholm',
        role: 'Jogging Club & Nature Resident',
        avatar: '/assets/characters/civilian_skeptic.png',
        text: 'Hold on, Mayor! You expanded the campus to 37.5 MW! Won’t this facility strain our regional electrical grid during freezing winter peaks?',
        expression: 'skeptical',
      },
      {
        speaker: 'matti',
        speakerName: 'Matti Korhonen',
        role: 'District Heating Resident & Technician',
        avatar: '/assets/characters/civilian_supporter.png',
        text: 'That’s the beauty of it! Notice the 2 wind turbines spinning now and the solar microgrid on the roof? The campus generates clean energy and buffers peak surges while running on 100% green Finnish power.',
        expression: 'explaining',
      },
      {
        speaker: 'helmi',
        speakerName: 'Helmi Lindholm',
        role: 'Jogging Club & Nature Resident',
        avatar: '/assets/characters/civilian_supporter.png',
        text: 'Wait... my kids told me the public swimming pool was warmer this week. Is that connected too?',
        expression: 'surprised',
      },
      {
        speaker: 'matti',
        speakerName: 'Matti Korhonen',
        role: 'District Heating Resident & Technician',
        avatar: '/assets/characters/civilian_supporter.png',
        text: 'Yes! The 25–28 MW of recovered heat now warms ~2,000 homes, the municipal swimming pool, and local schools. Plus, 55 local tech specialists and technicians got permanent full-time careers here!',
        expression: 'happy',
      },
    ],
  },

  // Triggered after upgrading to Level 3 (Hyperscale Nordic Hub)
  level3: {
    id: 'level3',
    title: 'Hyperscale Nordic Hub Debrief',
    subtitle: 'The town reflects on the world-class sustainable campus',
    lines: [
      {
        speaker: 'helmi',
        speakerName: 'Helmi Lindholm',
        role: 'Jogging Club & Nature Resident',
        avatar: '/assets/characters/civilian_skeptic.png',
        text: 'This campus is world-class with 120 MW of computing! But with all this cloud traffic, shouldn’t we worry about industrial traffic and air pollution in Tampere?',
        expression: 'skeptical',
      },
      {
        speaker: 'matti',
        speakerName: 'Matti Korhonen',
        role: 'District Heating Resident & Technician',
        avatar: '/assets/characters/civilian_supporter.png',
        text: 'Zero exhaust and zero freight pollution! The data travels through silent underground optical cables, 3 giant wind turbines generate green energy, and the facility runs on 100% carbon-free power.',
        expression: 'explaining',
      },
      {
        speaker: 'helmi',
        speakerName: 'Helmi Lindholm',
        role: 'Jogging Club & Nature Resident',
        avatar: '/assets/characters/civilian_skeptic.png',
        text: 'And our walking paths and wildlife corridors are still thriving right beside the campus border!',
        expression: 'happy',
      },
      {
        speaker: 'matti',
        speakerName: 'Matti Korhonen',
        role: 'District Heating Resident & Technician',
        avatar: '/assets/characters/civilian_supporter.png',
        text: 'Exactly! 250 high-tech jobs, 80–90 MW of heating across Tampere, and €15 million in yearly city taxes for our public parks. That’s true Nordic circular engineering!',
        expression: 'happy',
      },
    ],
  },
}
