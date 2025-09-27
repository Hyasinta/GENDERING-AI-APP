import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dayjs from 'dayjs';

export type ScheduleItem = {
  id: string;
  title: string;
  datetime: string;
  duration: number;
  speaker: string;
  venue: string;
  timestamp: number;
  dateAdded: string;
  description?: string;
  type?: string;
};

export type User = {
  name: string;
  email: string;
  organization: string;
  bio: string;
  role?: string;
  registrationDate: string;
  participantId: string;
};

export const STORAGE_KEYS = {
  user: 'conference-current-user',
  schedule: 'conference-schedule',
};

export function usePersistentState<T>(key: string, initial: T) {
  const [value, setValue] = React.useState<T>(initial);
  React.useEffect(() => {
    AsyncStorage.getItem(key).then((v) => {
      if (v) setValue(JSON.parse(v));
    });
  }, [key]);
  React.useEffect(() => {
    AsyncStorage.setItem(key, JSON.stringify(value)).catch(() => {});
  }, [key, value]);
  return [value, setValue] as const;
}

export function getFullAgenda(): ScheduleItem[] {
  const rawSessions: Array<{
    id: string; title: string; datetime: string; duration: number; speaker: string; venue: string; type?: string; description?: string;
  }> = [
    // Day 1 — Aug 20, 2025
    { id: 'opening-day1', title: 'Welcoming and Opening Remarks', datetime: 'August 20, 2025 09:00', duration: 15, speaker: 'Rebecca Ryakitimbo', venue: 'Main Hall', type: 'Opening' },
    { id: 'keynote-day1', title: 'Decolonizing AI: Bureaucratic Elites, Feminist Ethos, and Embodied Epistemologies', datetime: 'August 20, 2025 09:15', duration: 20, speaker: 'Lilian Njeri Mbuthi', venue: 'Main Hall', type: 'Keynote' },
    { id: 'grounding-day1', title: 'Story of Self and Power Analysis - A Grounding Exercise', datetime: 'August 20, 2025 09:40', duration: 60, speaker: 'Bridget Rhinohart', venue: 'Main Hall', type: 'Session' },
    { id: 'break-morning-day1', title: 'Coffee Break', datetime: 'August 20, 2025 10:40', duration: 45, speaker: '—', venue: 'Lounge', type: 'Break' },
    { id: 'panel-day1-2', title: 'Decolonial Perspectives on AI-Driven Violence in War and Conflict Zones', datetime: 'August 20, 2025 11:30', duration: 60, speaker: 'FIRN', venue: 'Main Hall', type: 'Panel' },
    { id: 'workshop-day1-1', title: 'Gender and AI Ethics, Governance, and Policy in Africa', datetime: 'August 20, 2025 12:30', duration: 60, speaker: 'Global Center on AI Governance', venue: 'Main Hall', type: 'Workshop' },
    { id: 'break-lunch-day1', title: 'Lunch Break', datetime: 'August 20, 2025 13:30', duration: 40, speaker: '—', venue: 'Dining Area', type: 'Break' },
    { id: 'lighttalk-day1', title: 'Lightning Talk', datetime: 'August 20, 2025 14:10', duration: 20, speaker: 'Irene Mwendwa', venue: 'Main Hall', type: 'Talk' },
    { id: 'workshop-day1-3', title: 'AI as a Gender Difference Leveler', datetime: 'August 20, 2025 14:30', duration: 60, speaker: 'National Coalition on Freedom of Expression and Content Moderation in Kenya', venue: 'Main Hall', type: 'Workshop' },
    { id: 'workshop-day1-4', title: 'Co-Designing a Gender-Inclusive AI Toolkit for Economic Policymaking in Africa', datetime: 'August 20, 2025 14:30', duration: 60, speaker: 'ACET, Rebecca, Jenniffer', venue: 'Room A', type: 'Workshop' },
    { id: 'break-afternoon-day1', title: 'Coffee Break', datetime: 'August 20, 2025 15:30', duration: 20, speaker: '—', venue: 'Lounge', type: 'Break' },
    { id: 'showcase-day1', title: 'African Women School of AI and Female Tech Exhibitors', datetime: 'August 20, 2025 15:50', duration: 40, speaker: 'Various exhibitors', venue: 'Main Hall', type: 'Showcase' },
    { id: 'closing-day1', title: 'Closing Remarks Day 1', datetime: 'August 20, 2025 16:30', duration: 15, speaker: 'Conference Organizers', venue: 'Main Hall', type: 'Closing' },

    // Day 2 — Aug 21, 2025
    { id: 'keynote-day2-1', title: 'Keynote Address: Setting Context for Feminist AI', datetime: 'August 21, 2025 09:00', duration: 20, speaker: 'Dr. Angela Ndaka', venue: 'Main Hall', type: 'Keynote' },
    { id: 'conversation-day2', title: '1:1 Conversations on AI and Arts Feminist Futures', datetime: 'August 21, 2025 09:20', duration: 40, speaker: 'Lisa Russel / Arts Envoy', venue: 'Main Hall', type: 'Session' },
    { id: 'keynote-day2-2', title: 'Keynote Address', datetime: 'August 21, 2025 10:00', duration: 20, speaker: 'Angela Chukunzira', venue: 'Main Hall', type: 'Keynote' },
    { id: 'break-morning-day2', title: 'Tea Break', datetime: 'August 21, 2025 10:20', duration: 20, speaker: '—', venue: 'Lounge', type: 'Break' },
    { id: 'panel-day2-1', title: 'Gendered Realities in AI: Who Builds, Who Benefits, Who Is Left Behind?', datetime: 'August 21, 2025 10:40', duration: 60, speaker: 'KICTANet', venue: 'Main Hall', type: 'Panel' },
    { id: 'workshop-day2-1', title: 'Creative Equity and Gendered Storytelling with ArtsEnvoy.ai', datetime: 'August 21, 2025 11:40', duration: 60, speaker: 'Lissa Russel', venue: 'Main Hall', type: 'Workshop' },
    { id: 'panel-day2-2', title: 'Our Bodies, Our Data, Our Futures', datetime: 'August 21, 2025 11:40', duration: 60, speaker: 'Nawi Afrifem Collective and African Feminism', venue: 'Room A', type: 'Panel' },
    { id: 'break-lunch-day2', title: 'Lunch Break', datetime: 'August 21, 2025 12:40', duration: 50, speaker: '—', venue: 'Dining Area', type: 'Break' },
    { id: 'keynote-day2-3', title: 'Feminist Intelligence: Using AI to Expose Digital Violence and Reclaim Power', datetime: 'August 21, 2025 13:30', duration: 20, speaker: 'Athandiwe Saba, Code for Africa', venue: 'Main Hall', type: 'Keynote' },
    { id: 'workshop-day2-2', title: 'Safe and Ethical AI to Address Gender Based Violence', datetime: 'August 21, 2025 13:50', duration: 60, speaker: 'UNFPA', venue: 'Main Hall', type: 'Workshop' },
    { id: 'lighttalk-day2', title: 'Decolonizing AI: Feminist Struggle for Justice, Inclusion and Accountability', datetime: 'August 21, 2025 14:50', duration: 20, speaker: 'Various speakers', venue: 'Main Hall', type: 'Talk' },
    { id: 'launch-day2', title: 'Special Launch Event', datetime: 'August 21, 2025 15:10', duration: 70, speaker: 'Conference Organizers', venue: 'Main Hall', type: 'Launch' },
    { id: 'closing-day2', title: 'Coffee Break and Closing Remarks for the Day', datetime: 'August 21, 2025 16:20', duration: 15, speaker: 'Conference Organizers', venue: 'Main Hall', type: 'Closing' },

    // Day 3 — Aug 22, 2025
    { id: 'workshop-day3-1', title: 'Counting What Matters: Feminist AI, Femicides, and Building Swahili Tools for Justice', datetime: 'August 22, 2025 09:00', duration: 30, speaker: 'Femicide Count Kenya, Data+Feminism Lab, DISCO Lab', venue: 'Main Hall', type: 'Workshop' },
    { id: 'keynote-day3', title: 'Digital Colonialism to Digital Liberation', datetime: 'August 22, 2025 09:40', duration: 10, speaker: 'Meriem Boudjadja', venue: 'Main Hall', type: 'Keynote' },
    { id: 'expert-day3', title: 'Expert Talks', datetime: 'August 22, 2025 10:00', duration: 20, speaker: 'Florence Ogonjo', venue: 'Main Hall', type: 'Talk' },
    { id: 'panel-day3-1', title: 'Invisible Scars: Healing the Mental Trauma of AI/Tech Work', datetime: 'August 22, 2025 11:20', duration: 60, speaker: 'African Content Moderators Union', venue: 'Main Hall', type: 'Panel' },
    { id: 'panel-day3-2', title: 'Reclaiming AI from the Margins: Queer Healing, Hustle, and Power in Rural Africa', datetime: 'August 22, 2025 11:20', duration: 60, speaker: 'Various speakers', venue: 'Room A', type: 'Panel' },
    { id: 'expert-session-day3', title: 'AI and Cybersecurity: Protecting Women and Girls in the Digital Age', datetime: 'August 22, 2025 12:20', duration: 60, speaker: 'Esther Mengi, Serensic Africa', venue: 'Room B', type: 'Expert Session' },
    { id: 'break-lunch-day3', title: 'Lunch Break', datetime: 'August 22, 2025 13:20', duration: 30, speaker: '—', venue: 'Dining Area', type: 'Break' },
    { id: 'keynote-day3-2', title: 'Keynote Address', datetime: 'August 22, 2025 13:50', duration: 20, speaker: 'Dr. Grace Githaiga', venue: 'Main Hall', type: 'Keynote' },
    { id: 'panel-day3-3', title: 'Designing Gender Just Infrastructures in Digital Agri-Food Systems', datetime: 'August 22, 2025 14:10', duration: 60, speaker: 'The InnoCatalyst Circle', venue: 'Main Hall', type: 'Panel' },
    { id: 'panel-day3-4', title: 'Inheritance: Young Women in AI Building What We Needed as Girls', datetime: 'August 22, 2025 14:10', duration: 60, speaker: 'Various speakers', venue: 'Room A', type: 'Panel' },
    { id: 'break-afternoon-day3', title: 'Coffee Break', datetime: 'August 22, 2025 15:10', duration: 20, speaker: '—', venue: 'Lounge', type: 'Break' },
    { id: 'panel-day3-5', title: "AI Can't Feel Pain: Reproductive Struggles, Toxic Work Spaces and the Feminist Data Gap", datetime: 'August 22, 2025 15:30', duration: 60, speaker: 'Waiting Womb Trust - Editah Hadassah', venue: 'Main Hall', type: 'Panel' },
    { id: 'workshop-day3-2', title: 'Healing, Hustle & Herstories: Feminist Tech for Rural Liberation', datetime: 'August 22, 2025 15:30', duration: 60, speaker: 'Otoyi M. Calary', venue: 'Room A', type: 'Workshop' },
    { id: 'lighttalk-day3', title: 'Bridging the Gender Data Gap: Foundations for Responsible and Equitable AI', datetime: 'August 22, 2025 16:30', duration: 20, speaker: 'Data2X', venue: 'Main Hall', type: 'Talk' },
    { id: 'closing-day3', title: 'Closing Remarks Day 3', datetime: 'August 22, 2025 16:50', duration: 10, speaker: 'Conference Organizers', venue: 'Main Hall', type: 'Closing' }
  ];

  return rawSessions.map((s) => ({
    ...s,
    timestamp: dayjs(s.datetime).toDate().getTime(),
    dateAdded: new Date().toISOString(),
  }));
}

export function formatTimeRemaining(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(total / 86400);
  const hours = Math.floor((total % 86400) / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  if (days > 0) return `${days}d ${hours}h remaining`;
  if (hours > 0) return `${hours}h ${minutes}m remaining`;
  return `${minutes}m remaining`;
}


