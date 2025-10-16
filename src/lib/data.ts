export const profile = {
  name: "강은택",
  title: "Backend Engineer",
  bio: "Java/Spring, AWS, ERP, API 서버 운영",
  email: "ket3613@example.com",
  avatar: "/1.jpg",
  links: [
    { label: "GitHub", href: "https://github.com/ket3613" },
    { label: "Blog", href: "#" }
  ],
  skills: [
    { name: "Java", level: 90 },
    { name: "Spring/Spring Boot", level: 85 },
    { name: "OracleDB/SQL", level: 80 },
    { name: "AWS", level: 75 },
    { name: "Docker", level: 70 },
    { name: "React", level: 60 }
  ],
  highlights: ["API 설계", "대용량 트래픽 운영", "모니터링/알림", "ERP 커스텀"],
  experience: [
    { period: "2022–2025", role: "Backend Eng.", org: "Hanjin Information Systems", note: "ERP·API 서버 운영, 성능개선" },
    { period: "2019–2022", role: "Backend Eng.", org: "WideTNS", note: "J2EE·Oracle 기반 시스템" }
  ],
  resumeUrl: "/resume.pdf" // 없으면 버튼 숨김
};

export type Project = { id: string; name: string; summary: string; stack: string[]; url?: string };

export const projects: Project[] = [
  { id: "p1", name: "IFMOR 고도화", summary: "항공 기내식 ERP 개선", stack: ["Java","Spring","Oracle"], url: "#" },
  { id: "p2", name: "API Gateway", summary: "Apigee 기반 인증/사용량 관리", stack: ["Apigee","OAuth2","Kong"], url: "#" }
];

export const protectedImages = [
  { id: "img1", alt: "프로젝트 대시보드", src: "/placeholder/1.png" },
  { id: "img2", alt: "시스템 아키텍처", src: "/placeholder/2.png" }
];