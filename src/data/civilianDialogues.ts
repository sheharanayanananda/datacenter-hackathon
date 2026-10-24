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
        text: 'Wait! You just cleared trees right beside our forest jogging trail! Where will the owls go, and what about that constant humming noise from those giant cooling fans?',
        expression: 'skeptical',
      },
      {
        speaker: 'matti',
        speakerName: 'Matti Korhonen',
        role: 'District Heating Resident & Technician',
        avatar: '/assets/characters/civilian_supporter.png',
        text: 'Helmi, look closer! The city protected 18.5 acres (85%) of the surrounding pine forest untouched. And that cooling system uses free sub-zero Nordic air instead of loud chillers, so it stays under 55 dB!',
        expression: 'explaining',
      },
      {
        speaker: 'helmi',
        speakerName: 'Helmi Lindholm',
        role: 'Jogging Club & Nature Resident',
        avatar: '/assets/characters/civilian_skeptic.png',
        text: 'Really? But what do our neighborhood families get out of having a giant server building right next to our homes?',
        expression: 'surprised',
      },
      {
        speaker: 'matti',
        speakerName: 'Matti Korhonen',
        role: 'District Heating Resident & Technician',
        avatar: '/assets/characters/civilian_supporter.png',
        text: 'Every kilowatt of computing power turns directly into clean heat! Their underground pipes are pumping thermal water straight into 350 local homes this winter. My family will stay cozy with zero fossil fuels!',
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
        text: 'Hold on, Mayor! You just doubled the server halls! Won’t this huge datacenter strain our regional electrical grid during freezing winter peaks?',
        expression: 'skeptical',
      },
      {
        speaker: 'matti',
        speakerName: 'Matti Korhonen',
        role: 'District Heating Resident & Technician',
        avatar: '/assets/characters/civilian_supporter.png',
        text: 'That’s the beauty of it! Notice those 4 wind turbines and the 12,000 m² solar microgrid on the roof? The campus generates its own clean power and even feeds surplus electricity back into the city!',
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
        text: 'Yes! The excess 32 MW of heat is now piped straight into the municipal pool and local schools. Plus, 55 local tech specialists and electricians got full-time careers here!',
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
        text: 'This campus is world-class now! But with all this international cloud computing, shouldn’t we worry about industrial traffic and air pollution in Tampere?',
        expression: 'skeptical',
      },
      {
        speaker: 'matti',
        speakerName: 'Matti Korhonen',
        role: 'District Heating Resident & Technician',
        avatar: '/assets/characters/civilian_supporter.png',
        text: 'Zero exhaust and zero truck traffic! The data travels through silent underground optical glass cables, and 100% of the electricity comes from Finnish renewables.',
        expression: 'explaining',
      },
      {
        speaker: 'helmi',
        speakerName: 'Helmi Lindholm',
        role: 'Jogging Club & Nature Resident',
        avatar: '/assets/characters/civilian_skeptic.png',
        text: 'And our walking paths and bird sanctuaries are still thriving right beside the campus border!',
        expression: 'happy',
      },
      {
        speaker: 'matti',
        speakerName: 'Matti Korhonen',
        role: 'District Heating Resident & Technician',
        avatar: '/assets/characters/civilian_supporter.png',
        text: 'Exactly! 250 high-tech jobs, €15 million in city tax revenue for our community parks, and the cleanest heat network in Europe. Now that’s true Nordic symbiosis!',
        expression: 'happy',
      },
    ],
  },
}
