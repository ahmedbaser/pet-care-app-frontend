interface CustomInputs {
    [key: string] : string |  number | undefined
}




export interface BehavioralInsightsData  {
  petType: string;
  petAge: number;
  behaviorIssue: string;
  trainingHistory: string;
  activityLevel: string;
  customInputs: CustomInputs;
}

