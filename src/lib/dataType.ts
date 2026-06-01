export type Skill = {
    skillName: string;
    year: number;
    category: number;
    imagePath: string;
    level?: string;   // 실무 / 사이드 / 학습
    usedIn?: string;  // 쉼표 구분 프로젝트명
};

export type Experience = {
    period: string;
    role: string;
    org: string;
    note: string;
    startDate: string;
    endDate?: string | null;
    stack?: string;  // 쉼표 구분 기술명
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

export type ServerStats = {
    status: "online" | "offline";
    uptime_seconds: number;
    cpu_usage_percent: number;
    cpu_temp_celsius: number;
    memory: { used_bytes: number; total_bytes: number };
    disk:   { used_bytes: number; total_bytes: number };
    updated_at: string;
};
