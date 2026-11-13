export type Skill = {
    skillName: string;
    year?: number | null;
    category: number;
    imagePath?: string | null;
    level?: string | null;
    usedIn?: string | null;
    categoryName?: string;
};

export type Experience = {
    role: string;
    org: string;
    note: string;
    startDate: string;
    endDate?: string | null;
    stack?: string | null;
};

export type Competency = { title: string; description: string };

export type Highlight = { value: string; label: string; note?: string | null };

export type Credential = {
    type: "학력" | "자격증" | "교육" | "수상";
    title: string;
    issuer?: string | null;
    period?: string | null;
    note?: string | null;
};

export type VersionUpgrade = {
    projectId?: number | null;
    projectName?: string | null;
    fromVersion: string;
    toVersion: string;
    note?: string | null;
};

export type Profile = {
    name: string;
    title: string;
    headline?: string | null;
    bio: string;
    email: string;
    links: string;
    skills: Skill[];
    experience: Experience[];
    competencies: Competency[];
    highlights: Highlight[];
    credentials: Credential[];
    upgrades: VersionUpgrade[];
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

export type Metric = { label: string; value: string };

/** 프로젝트 안에서 한 일. solution·decision 은 줄바꿈으로 항목을 구분한다. */
export type Achievement = {
    id: number;
    title: string;
    period?: string | null;
    background?: string | null;
    solution?: string | null;
    decision?: string | null;
    result?: string | null;
    resumeLine?: string | null;
};

export type Troubleshooting = {
    id: number;
    projectId?: number | null;
    projectName?: string | null;
    title: string;
    symptom?: string | null;
    cause?: string | null;
    resolution?: string | null;
    lesson?: string | null;
};

export type Project = {
    id: number | string;
    name: string;
    kind?: "WORK" | "PERSONAL";
    org?: string | null;
    period?: string | null;
    year?: string | null;
    summary: string;
    description: string | null;
    myRole?: string | null;
    image?: string | null;
    url?: string | null;
    repoUrl?: string | null;
    featured?: boolean;
    pdfName?: string | null; // 원본 파일명 (있으면 PDF 내려받기 가능)
    stack: Stack[];
    metrics: Metric[];
    achievements: Achievement[];
    troubleshooting?: Troubleshooting[]; // 단건 조회에서만 포함
};
