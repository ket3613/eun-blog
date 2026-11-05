export type Skill = {
    skillName: string;
    year: number;
    category: number;
    imagePath: string;
    level?: string;
    usedIn?: string;
    categoryName?: string;
};

export type Experience = {
    period: string;
    role: string;
    org: string;
    note: string;
    startDate: string;
    endDate?: string | null;
    stack?: string;
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

export type Stack = {
    stackName: string;
    category: number | string;
    categoryName?: string;
};

export type Project = {
    id: number | string;
    name: string;
    summary: string;
    description: string | null;
    stack: Stack[];
    year?: string;
    image?: string;
    myRole?: string;
    pdfPath?: string | null; // 서버 저장 경로 (UUID.pdf)
    pdfName?: string | null; // 원본 파일명
    url?: string;
    repoUrl?: string;
};
