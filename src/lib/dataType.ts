export type Skill = {
    name: string;
    years: number;
};

export type Experience = {
    period: string;
    role: string;
    org: string;
    note: string;
};

export type Profile = {
    name: string;
    position: string;
    bio: string;
    email: string;
    avatar: string;
    role: string;
    links: { label: string; href: string }[];
    skills: Skill[];
    highlights: string[];
    experience: Experience[];
    resumeUrl: string;
};
/* -------------강은택 프로필 받아오는 VO----------------*/
