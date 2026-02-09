import { UserProfile, MBTIType } from './types';

export const EXTERNAL_LINKS = {
  MBTI_TEST: "https://www.16personalities.com/ch/%E4%BA%BA%E6%A0%BC%E6%B5%8B%E8%AF%95", // Chinese version
  JUNG_FUNCTIONS_TEST: "https://sakinorva.net/functions?lang=cn", // Chinese version
  ASTRO_CHART: "https://www.astro.com/horoscopes",
};

export const DEFAULT_FUNCTIONS = {
  Ni: 25, Ne: 25, Si: 25, Se: 25,
  Ti: 25, Te: 25, Fi: 25, Fe: 25
};

export const FUNCTION_DESCRIPTIONS: Record<string, string> = {
  Ni: "内倾直觉 (Ni) - 洞察力、预见未来、深层模式识别",
  Ne: "外倾直觉 (Ne) - 可能性、发散思维、创意联结",
  Si: "内倾感觉 (Si) - 记忆、细节、传统、身体感受",
  Se: "外倾感觉 (Se) - 活在当下、行动力、感官体验",
  Ti: "内倾思考 (Ti) - 逻辑架构、精确分析、解构原理",
  Te: "外倾思考 (Te) - 效率、组织、执行力、客观标准",
  Fi: "内倾情感 (Fi) - 核心价值观、真诚、个人情感",
  Fe: "外倾情感 (Fe) - 和谐、共情、社会规范、人际动力"
};

export const WIKI_CONTENT = [
  {
    title: "荣格八维 (Jungian Cognitive Functions)",
    content: "荣格八维是MBTI的底层理论基础。它描述了人类大脑获取信息（感知 Perceiving）和做出决定（判断 Judging）的八种特定模式。每个人都使用所有八种功能，但有些功能比其他功能更发达。前四个功能构成你的'功能栈'。例如，INTJ的主导功能是Ni（内倾直觉），辅助功能是Te（外倾思考）。"
  },
  {
    title: "八字 (BaZi / Four Pillars)",
    content: "八字是中国传统的命理系统，基于一个人出生的年、月、日、时。每个时间单位由'天干'和'地支'组成，共八个字。其中'日主'（出生日的天干）代表核心自我。通过分析五行（金木水火土）的生克关系，可以揭示性格优劣势及运势走向。"
  },
  {
    title: "合盘与契合度 (Synastry)",
    content: "合盘不仅看两个人是否性格相似，更看是否'互补'与'共振'。在八字中，我们寻找五行的互补（如火旺需水）；在MBTI中，我们常观察认知功能的互动（如Ni与Ne的火花，或Ti与Fe的平衡）。"
  }
];

export const EXAMPLE_PROFILE_A: UserProfile = {
  id: 'example_a',
  name: '林先生 (案例)',
  gender: 'Male',
  birthDate: '1990-05-15',
  birthTime: '08:30',
  birthLocation: 'Shanghai, China',
  mbti: MBTIType.INTJ,
  functions: { Ni: 45, Ne: 20, Si: 15, Se: 10, Ti: 30, Te: 40, Fi: 25, Fe: 15 }
};

export const EXAMPLE_PROFILE_B: UserProfile = {
  id: 'example_b',
  name: '陈小姐 (案例)',
  gender: 'Female',
  birthDate: '1992-10-20',
  birthTime: '14:00',
  birthLocation: 'Beijing, China',
  mbti: MBTIType.ENFP,
  functions: { Ni: 20, Ne: 48, Si: 10, Se: 30, Ti: 15, Te: 25, Fi: 40, Fe: 25 }
};
