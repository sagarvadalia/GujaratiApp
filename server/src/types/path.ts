export interface Skill {
  id: string;
  name: string;
  description: string;
  vocabularyIds: string[]; // Vocabulary items in this skill
  grammarRuleIds?: string[]; // Grammar rules covered
  difficulty: number; // 1-5 stars
  xpReward: number; // XP awarded for completing lesson
  prerequisites: string[]; // Skill IDs that must be completed first
  unitId: string; // Parent unit
  lessonId: string; // Parent lesson
  order: number; // Order within lesson
}

export interface Lesson {
  id: string;
  name: string;
  description: string;
  skills: Skill[];
  unitId: string; // Parent unit
  order: number; // Order within unit
  unlockLevel?: number; // Minimum level required to unlock
}

export interface Unit {
  id: string;
  name: string;
  description: string;
  lessons: Lesson[];
  order: number; // Order in path
  unlockLevel?: number; // Minimum level required to unlock
}

export interface Path {
  id: string;
  name: string;
  description: string;
  units: Unit[];
  totalXP: number; // Total XP available in path
}

export interface SkillProgress {
  skillId: string;
  crowns: number; // 0-5 crowns
  lastPracticed: Date;
  masteryLevel: number; // 0-100 mastery percentage
  completed: boolean;
  isLocked: boolean; // Based on prerequisites
}

export interface LessonProgress {
  lessonId: string;
  skillsProgress: SkillProgress[];
  completed: boolean;
  completedAt?: Date;
}

export interface UnitProgress {
  unitId: string;
  lessonsProgress: LessonProgress[];
  completed: boolean;
  completedAt?: Date;
}

export interface PathProgress {
  userId: string;
  pathId: string;
  unitsProgress: UnitProgress[];
  currentUnitId?: string;
  currentLessonId?: string;
  currentSkillId?: string;
  totalCrowns: number;
  totalXP: number;
}

