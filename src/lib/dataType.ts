export type Skill = {
    skillName: string;
    year: number;
    category: number;
    imagePath: string;
};

export type Experience = {
    period: string;
    role: string;
    org: string;
    note: string;
    startDate: string;
    endDate?: string | null;
};

export type Profile = {
    name: string;
    title: string;
    bio: string;
    email: string;
    avatar: string;
    role: string;
    links: string;
    skills: Skill[];
    highlights: string[];
    experience: Experience[];
    resumeUrl?: string | null;
};

export type ApiResponse<T = Profile> = {
    success: boolean;
    data: T;
    error: string;
};
