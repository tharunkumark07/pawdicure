export interface PetGuideCharacter {
  id: string;
  name: string;
  description: string;
  assetPath: string; // Placeholder paths
}

export interface GuideStep {
  id?: string;
  page: string;
  targetId: string;
  message: string;
  action?: string;
  nextRoute?: string;
  route?: string;
}

export interface GuideProgress {
  guideId: string;
  started: boolean;
  completed: boolean;
  skipped: boolean;
  currentStep: number;
  lastSeenAt: number;
}
