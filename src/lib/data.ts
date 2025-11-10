
// 프로필 정보 객체
export const profile = {
    name: "강은택",
    title: "Backend Engineer",
    bio: "Java/Spring, AWS, ERP, API 서버 운영",
    email: "ket3613@example.com",
    avatar: "/file.svg", // 프로필 이미지 경로 (임시 더미)
    role:"Admin",
    links: [
        { label: "GitHub", href: "https://github.com/ket3613" },
        { label: "Blog", href: "#" }
    ],
    // 기술 스택과 숙련도 목록
    skills: [
        { name: "Java", years: 6 },
        { name: "Spring/Spring Boot", years: 5 },
        { name: "OracleDB/SQL", years: 5 },
        { name: "AWS", years: 4 },
        { name: "Docker", years: 4 },
        { name: "React", years: 3 }
    ],
    // 주요 강점
    highlights: ["API 설계", "대용량 트래픽 운영", "모니터링/알림", "ERP 커스텀"],
    // 경력 사항
    experience: [
        { period: "2022–2025", role: "Backend Eng.", org: "Hanjin Information Systems", note: "ERP·API 서버 운영, 성능개선" },
        { period: "2019–2022", role: "Backend Eng.", org: "WideTNS", note: "J2EE·Oracle 기반 시스템" }
    ],
    resumeUrl: "/resume.pdf" // 이력서 PDF 경로 (없으면 버튼 숨김)
};

// 프로젝트 타입 정의
export type Project = {
    id: string;
    name: string;
    summary: string;
    description: string;
    stack: string[];
    url?: string; // 기존 단일 URL(보존)
    demoUrl?: string; // 데모 링크
    repoUrl?: string; // GitHub 등 저장소 링크
    image?: string; // 카드 썸네일
    year?: number; // 진행 연도
};

// 프로젝트 목록
export const projects: Project[] = [
    {
        id: "p1",
        name: "IFMOR",
        summary: "항공 기내식 ERP 개선 — 주문/생산/원가 모듈 성능 최적화",
        description: "",
        stack: ["Java", "Spring", "Oracle", "JMS"],
        year: 2024,
        image: "/file.svg",
        repoUrl: "#"
    },
    {
        id: "p2",
        name: "IFSF",
        summary: "Apigee 기반 인증·라우팅·사용량 관리 정책 설계 및 운영",
        description: "",
        stack: ["Apigee", "OAuth2", "Kong", "Grafana"],
        year: 2023,
        image: "/file.svg",
        demoUrl: "#"
    },
    {
        id: "p3",
        name: "BCO",
        summary: "주문상태·장애 알림을 위한 Pub/Sub & WebSocket 기반 알림 허브",
        description: "",
        stack: ["Spring Boot", "Kafka", "Redis", "WebSocket"],
        year: 2025,
        image: "/file.svg",
        repoUrl: "#",
        demoUrl: "#"
    },
    {
        id: "p4",
        name: "MPMD",
        summary: "ETL 파이프라인으로 집계/리포팅 자동화 및 원가분석 대시보드",
        description: "",
        stack: ["Python", "Airflow", "S3", "Athena"],
        year: 2022,
        image: "/file.svg",
        repoUrl: "#"
    },
    {
        id: "p5",
        name: "eun-taek-api",
        summary: "개인 api서버 ",
        description: "개인 backend 사용을 위한 api 서버 ",
        stack: ["Python", "Airflow", "S3", "Athena"],
        year: 2022,
        image: "/file.svg",
        repoUrl: "#"
    },
    {
        id: "p6",
        name: "eun-taek-blog",
        summary: "react 구성된 개인 플로그",
        description: "",
        stack: ["Python", "Airflow", "S3", "Athena"],
        year: 2022,
        image: "/next.svg",
        repoUrl: "#"
    }
];

// 인증이 필요한 보호된 이미지 목록
export const protectedImages = [
    { id: "img1", alt: "프로젝트 대시보드", src: "/file.svg" },
    { id: "img2", alt: "시스템 아키텍처", src: "/file.svg" }
];