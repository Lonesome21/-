
export enum MBTIType {
  INTJ = 'INTJ', INTP = 'INTP', ENTJ = 'ENTJ', ENTP = 'ENTP',
  INFJ = 'INFJ', INFP = 'INFP', ENFJ = 'ENFJ', ENFP = 'ENFP',
  ISTJ = 'ISTJ', ISFJ = 'ISFJ', ESTJ = 'ESTJ', ESFJ = 'ESFJ',
  ISTP = 'ISTP', ISFP = 'ISFP', ESTP = 'ESTP', ESFP = 'ESFP'
}

export interface CognitiveFunctions {
  Ni: number; Ne: number; Si: number; Se: number;
  Ti: number; Te: number; Fi: number; Fe: number;
}

export interface UserProfile {
  id: string;
  name: string;
  birthDate: string;
  birthTime: string;
  birthLocation: string;
  mbti: MBTIType | '';
  functions: CognitiveFunctions;
  gender: 'Male' | 'Female' | 'Other';
}

export type AnalysisMode = 'SINGLE' | 'MATCH';

export interface FiveElementData {
  name: string;
  value: number;
  label: string;
  color: string;
}

export interface TenGodData {
  name: string; 
  value: number; 
  label: string; 
}

export interface Shensha {
  name: string; 
  description: string; 
  type: 'good' | 'bad';
}

export interface PillarAnalysis {
  title: string; 
  tags: string[]; 
  content: string; 
}

export interface AnalysisJSON {
  type: 'SINGLE' | 'MATCH';
  scores: { overall: number; love: number; career: number; wealth: number; };
  oneLiner: string; 
  comprehensiveAnalysis: string; 
  crossAnalysis: { title: string; content: string; };
  bazi: {
    dayMaster: string; 
    structure: string; 
    elements: FiveElementData[];
    tenGods: TenGodData[]; 
    tenGodsAnalysis: string; 
    shensha: Shensha[]; 
    pillars: PillarAnalysis[]; 
    yearlyFortune: string; 
    elementalInteraction: { cycle: string; analysis: string; }[];
  };
  astro: {
    keywords: { surface: string; actual: string; hidden: string; };
    daily: { score: number; title: string; poem: string; luckyColor: string; luckyFood: string; advice: string; };
    placements: any[];
    houseAnalysis: string; 
    significantHouses: { house: string; analysis: string; }[];
  };
  psych: {
    mbtiType: string;
    strengths: string[];
    weaknesses: string[];
    analysis: { title: string; content: string }[];
  };
  advice: { career: string; relationships: string; selfGrowth: string; };
}

export interface FavoriteItem {
  id: string;
  timestamp: number;
  mode: AnalysisMode;
  user1Name: string;
  user2Name?: string;
  result: string; 
}

export interface CommunityPost {
  id: string;
  author: string;
  content: string;
  likes: number;
  timestamp: number;
  topic: string;
  aiReply?: string;
}

// Added ChatMessage interface to resolve missing export error
export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}
