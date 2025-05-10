interface CustomInputs {
    [key: string]: number | string | undefined;
}


export interface PetHealthAlertsData {
    petType: string;
    petAge: string;
    symptoms: string;
    duration: string;
    recentBehavior: string;
    customInputs: CustomInputs;
}





