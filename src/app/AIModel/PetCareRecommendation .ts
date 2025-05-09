interface CustomInputs {
    [key: string]: string | number | undefined;
}


export interface PetCareRecommendationData {
  petType: string;
  petHealthConcerns: string;
  petDietPreferences: string;
  activityLevel: string;
  weight: string;
  location: string;
  customInputs: CustomInputs;

}

