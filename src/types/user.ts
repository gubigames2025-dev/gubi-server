export interface RegisterRequest {
    // 1
    fullName: string;
    email: string;
    password: string;
    country: string;
    phone: string;
    birthDate: string;
    gender: string;
    customGender: string;
    location: string;

    // 2
    userInterests: string[];
    customInterest: string;
    workPreference: string;
    workEnvironment: string;
    companyType: string;
    userSkills: string[];
    customSkill: string;

    // 3
    grade: string;
    wantsFaculty: string;
    currentInstitution: string;
    institution: string;
    courseName: string;
    startCourseDate: string;
    endCourseDate: string;
    studyFormat: string;
    needsFinancialSupport: string;
    wantsFinancialInfo: string;

    // 4
    twoYearGoals: string[];
    workWhileStudying: string;
    hasInternshipExperience: string;

    // 5
    softSkills: string[];
    skillsToImprove: string[];
    hardSkills: string[];
    learningPreference: string;
    studyFrequency: string;

    // 6
    currentDifficulties: string[];
    thoughtAboutQuitting: string;
    internetAccess: string;
    availableDevices: string[];

    // 7
    participatesInSocialProgram: string;
    socialProgram: string;
    householdSize: string;
    peopleWithIncome: string;

    // 8
    howFoundUs: string;
    customHowFoundUs: string;
    acceptsTerms: boolean;
    acceptsDataUsage: boolean;
}