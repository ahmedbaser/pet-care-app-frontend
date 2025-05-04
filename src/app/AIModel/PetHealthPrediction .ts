interface CustomInputs {
    bloodPressure?: string;
    heartRate: string;
    temperature: string;
    [key: string]: string | number | undefined;
}


export interface PetHealthData {
    petName: string;
    species: string;
    breed?: string;
    age: number;
    weight: number;
    gender: string;
    activityLevel: string;
    diet: string;
    vaccinationStatus: string;
    pastIllnesses: string;
    currentSymptoms: string;
    lastVetVisit: string;
    medications: string;
    spayedNeutered: string;
    customInputs?: CustomInputs;
}
