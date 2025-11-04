export interface Skill {
  id: string;
  name: string;
  description: string;
  vocabularyIds: string[];
  grammarRuleIds?: string[];
  difficulty: number;
  xpReward: number;
  prerequisites: string[];
  unitId: string;
  lessonId: string;
  order: number;
}

export interface Lesson {
  id: string;
  name: string;
  description: string;
  skills: Skill[];
  unitId: string;
  order: number;
  unlockLevel?: number;
}

export interface Unit {
  id: string;
  name: string;
  description: string;
  lessons: Lesson[];
  order: number;
  unlockLevel?: number;
}

export interface Path {
  id: string;
  name: string;
  description: string;
  units: Unit[];
  totalXP: number;
}

export interface SkillProgress {
  skillId: string;
  crowns: number;
  lastPracticed: Date;
  masteryLevel: number;
  completed: boolean;
  isLocked: boolean;
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

