class UserPersonalInfo {
  constructor(
    profile_picture_url: string,
    firstName: string,
    lastname: string,
    jobTitle: string,
    linkedinProfileUrl: string,
    emailAddress: string,
    primaryDesignation: string,
    phoneNumbers: string
  ) {}
}

class UserOpenToWork {
  constructor(
    status: string,
    title: string,
    location: string,
    workplaceType: string
  ) {}
}

class UserWorkExperiance {
  constructor(
    jobTtile: string,
    companyName: string,
    jobType: string,
    startDate: string,
    endDate: string,
    location: string,
    description: string,
    responsibilities: string,
    skills: string
  ) {}
}

class UserEducation {
  constructor(
    instituteName: string,
    degree: string,
    startDate: string,
    endDate: string
  ) {}
}

class UserCertification {
  constructor() {}
}

class UserLanguage {
  constructor(name: string, proficiency: string) {}
}
class User {
  constructor(
    personalInfo: UserPersonalInfo,
    openToWork: UserOpenToWork,
    workExperiances: UserWorkExperiance[],
    educations: UserEducation[],
    certifications: UserCertification[],
    languages: UserLanguage[]
  ) {
    timestamps: new Date().toJSON();
  }
}

// popup.tsx

interface Profile {
  profileName: string;
  about: string;
  title: string;
  profileImageSrc: string;
}

interface EducationDetails {
  institute: string;
}
export interface licenseCertification {
  title: string;
  issuer: string;
}

export interface WorkExperience {
  jobTitle: string;
  company: string;
  duration: string;
}

export interface StoredData {
  profile?: {
    personalInfo: Profile;
    origin: string;
    skills: string[];
    educationDetails: EducationDetails[];
    licenseCertification: licenseCertification[];
    workExperience: WorkExperience[];
  };
}

export interface PopupUIProps {
  setProfile: any;
  // startScraping: () => void;
}
export interface InfoData {
  heading: string;
  profileEx: any;
}

// Upwork
export interface UpworkProfile {
  profileName: string;
  about: string;
  title: string;
  profileImageSrc: string;
  ProfileLink: string;
  level: string;
  location: string;
  status: string;
  totalHour: string;
  totalJob: string;
}

export interface StoredUpworkData {
  UpworkProfile?: {
    personalInfo: UpworkProfile;
    skills: string[];
  };
}
