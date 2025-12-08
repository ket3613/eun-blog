import ProjectList from "@/components/ProjectList";
import { Project } from "@/lib/data";

async function getProjects(): Promise<Project[]> {
  try {
    const res = await fetch("https://api.euntaek.cc/api/projects/getProjects", {
      cache: "no-store", // Ensure fresh data
      headers: {
        accept: "*/*",
      },
    });

    if (!res.ok) {
      console.error("Failed to fetch projects:", res.status, res.statusText);
      throw new Error("Failed to fetch data");
    }

    const json = await res.json();
    if (json.success && Array.isArray(json.data)) {
      return json.data as Project[];
    }

    return [];
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
}

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <section className="min-h-screen py-24 px-4 sm:px-6 lg:px-8 bg-black">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] bg-blue-500/20 blur-[100px] rounded-full pointer-events-none" />
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 mb-4 relative z-10">
            Projects
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto relative z-10">
            운영/백엔드 중심의 실전 프로젝트 모음
          </p>
        </div>

        {/* List */}
        <ProjectList initialProjects={projects} />
      </div>
    </section>
  );
}