// 프로필 정보 객체
export const profile = {
  name: "강은택",
  position: "Backend Engineer",
  bio: "Java/Spring, AWS, ERP, API 서버 운영",
  email: "ket3613@naver.com",
  avatar: "/file.svg",
  role: "Admin",
  links: [
    { label: "GitHub", href: "https://github.com/ket3613" },
  ],
  skills: [
    { name: "Java", years: 6 },
    { name: "Spring/Spring Boot", years: 5 },
    { name: "OracleDB/SQL", years: 5 },
    { name: "AWS", years: 4 },
    { name: "Docker", years: 4 },
    { name: "React", years: 3 },
  ],
  highlights: ["API 설계", "대용량 트래픽 운영", "모니터링/알림", "ERP 커스텀"],
  experience: [
    { period: "2022–2025", role: "Backend Eng.", org: "Hanjin Information Systems", note: "ERP·API 서버 운영, 성능개선" },
    { period: "2019–2022", role: "Backend Eng.", org: "WideTNS", note: "J2EE·Oracle 기반 시스템" }
  ],
  resumeUrl: "/resume.pdf"
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
  pdfPath?: string | null;   // 서버 저장 경로 (UUID.pdf)
  pdfName?: string | null;   // 원본 파일명
  imagePath?: string | null; // 서버 저장 경로 (UUID.확장자)
  imageName?: string | null; // 원본 파일명
  url?: string;
  repoUrl?: string;
};

export type Stack = {
  stackName: string;
  category: number | string;
  categoryName?: string;
};

// 인증이 필요한 보호된 이미지 목록 (레거시 - 미사용)
export const protectedImages = [
  { id: "img1", alt: "프로젝트 대시보드", src: "/file.svg" },
  { id: "img2", alt: "시스템 아키텍처", src: "/file.svg" }
];
