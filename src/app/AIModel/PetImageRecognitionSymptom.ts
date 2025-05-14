interface CustomInputs {
    [key: string] : string | number | undefined;
}


export interface PetImageRecognitionSymptom {
    petType: string;
    petAge: string;
    symptomDescription: string;
    customInputs: CustomInputs;
}


