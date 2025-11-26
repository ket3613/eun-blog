
// 프로필 정보 객체
export const profile = {
    name: "강은택",
    position: "Backend Engineer",
    bio: "Java/Spring, AWS, ERP, API 서버 운영",
    email: "ket3613@naver.com",
    avatar: "/file.svg", // 프로필 이미지 경로 (임시 더미)
    role:"Admin",
    links: [
        { label: "GitHub", href: "https://github.com/ket3613" },
    ],
    // 기술 스택과 숙련도 목록
    skills: [
        { name: "Java", years: 6 },
        { name: "Spring/Spring Boot", years: 5 },
        { name: "OracleDB/SQL", years: 5 },
        { name: "AWS", years: 4 },
        { name: "Docker", years: 4 },
        { name: "React", years: 3 },
        { name: "test1", years: 4 },
        { name: "test2", years: 4 },
        { name: "test3", years: 3 },
        { name: "test4", years: 4 },
        { name: "test5", years: 3 }
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
    repoUrl?: string; // GitHub 등 저장소 링크
    image?: string; // 카드 썸네일
    year?: number; // 진행 연도
};

// Programming Languages : Java, Javascript, Typescript, Python, C++, C#
// Backend & Frameworks
// - Framework : Spring, Spring Boot,
// - Server / Application : REST API, Web Application
// Library : MyBatis, Spring Data JPA
// ORM : JPA, Hibernate, MyBatis
// DB : OracleDB, PostgreSQL, MySQL
// Data : DataDog, Grafana, Kafka, RabbitMQ
// Cloude : AWS, Docker
// CI/CD : Jenkins, Github
// Others : Git, Maven, Gradle, Jenkinsfile, Dockerfile, Jenkinsfile, Jenkins Pipeline,
// IDE : Eclipse, Visual Studio Code, IntelliJ IDEA, AndroidStudio, PyCharm, WebStorm, DataGrip, DBeaver
// OS : Windows, Linux


// 프로젝트 목록
export const projects: Project[] = [
    {
        id: "p1",
        name: "ORACLE ERP 기내식 운영",
        summary: "항공 기내식 ERP 주문 최적화 및 운영",
        description: "",
        stack: ["Oracle ERP", "OracleDB"],
        year: 2023,
        image: "/file.svg",
        repoUrl: "#"
    },
    {
        id: "p2",
        name: "ORACLE ERP 홈페이지",
        summary: "ERP 접속 홈페이지 관리",
        description: "",
        stack: ["SpringBoot", "JSP", "jQuery", "PostgreSQL", "Okta", "AWS" ],
        year: 2025,
        image: "/file.svg",
        repoUrl: "#"
    },
    {
        id: "p3",
        name: "IFMOR",
        summary: "기내식 API 서버 운영 및 개발",
        description: "",
        stack: ["SpringBoot", "Java", "AWS","OracleDB","APIGee","JSP","jQuery","datadog"],
        year: 2023,
        image: "/file.svg"
    },
    {
        id: "p4",
        name: "IFSF",
        summary: "기내운영 FeedBack 공유 사이트",
        description: "",
        stack: ["SpringBoot", "Java", "AWS","OracleDB","APIGee","JSP","jQuery","datadog"],
        year: 2023,
        image: "/file.svg",
        repoUrl: "#"
    },
    {
        id: "p5",
        name: "CBS",
        summary: "기내 하기물품 관리 시스템",
        description: "",
        stack: ["SpringBoot", "Java", "OracleDB", "JSP", "jQuery", "datadog"],
        year: 2023,
        image: "/file.svg",
        repoUrl: "#"
    },
    {
        id: "p6",
        name: "MPMD",
        summary: "MMS 문자과금 시스템",
        description: "",
        stack: ["SpringBoot", "Java","OracleDB","RabbitMQ","shellScript","Linux","Grafana"],
        year: 2022,
        image: "/file.svg",
        repoUrl: "#"
    },
    {
        id: "p7",
        name: "SPOP",
        summary: "과금 관련 웹페이지 ",
        description: "",
        stack: ["SpringBoot", "Java", "OracleDB", "JSP", "jQuery","shellScript", "Linux","Grafana"],
        year: 2023,
        image: "/next.svg",
        repoUrl: "#"
    },
    {
        id: "p8",
        name: "CoinTrading",
        summary: "코인 매매 프로그램 (개인프로젝트)",
        description: "여러 사이트에대한 정보를 조합해서 매매 및 매도 자동 프로그램",
        stack: ["Python", "FastAPI", "docker-compose", "Athena"],
        year: 2024,
        image: "/next.svg",
        repoUrl: "#"
    },
    {
        id: "p9",
        name: "eun-blog",
        summary: "개인 홈페이지구성(개인프로젝트)",
        description: "cloudflare 도메인 구성으로 서브도메인 생성으로 API,jenkins,docker-compose 사용한 서버구성",
        stack: ["React", "Nextjs", "Vercel", "Cloudflare","docker-compose",
            "SpringBoot", "Java","PostgreSQL","JenKins", "GitHub", "Raspberry pi 5"],
        year: 2025,
        image: "/next.svg",
        repoUrl: "#"
    }
];

// 인증이 필요한 보호된 이미지 목록
export const protectedImages = [
    { id: "img1", alt: "프로젝트 대시보드", src: "/file.svg" },
    { id: "img2", alt: "시스템 아키텍처", src: "/file.svg" }
];