import { projects } from "@/lib/data";

export default function ProjectsPage() {
  return (
    <section>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>프로젝트</h1>
      <div style={{ display: "grid", gap: 12 }}>
        {projects.map(p => (
          <article key={p.id} style={{ border: "1px solid #1f232b", borderRadius: 12, padding: 16 }}>
            <h2 style={{ margin: "0 0 6px 0", fontSize: 18 }}>{p.name}</h2>
            <p style={{ margin: "0 0 10px 0", color: "#9aa0a6" }}>{p.summary}</p>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {p.stack.map(s => <span key={s} style={{ fontSize: 12, border: "1px solid #1f232b", padding: "4px 6px", borderRadius: 8 }}>{s}</span>)}
            </div>
          </article>
        ))}
      </div>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>프로젝트</h1>
      <div style={{ display: "grid", gap: 12 }}>
        {projects.map(p => (
          <article key={p.id} style={{ border: "1px solid #1f232b", borderRadius: 12, padding: 16 }}>
            <h2 style={{ margin: "0 0 6px 0", fontSize: 18 }}>{p.name}</h2>
            <p style={{ margin: "0 0 10px 0", color: "#9aa0a6" }}>{p.summary}</p>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {p.stack.map(s => <span key={s} style={{ fontSize: 12, border: "1px solid #1f232b", padding: "4px 6px", borderRadius: 8 }}>{s}</span>)}
            </div>
          </article>
        ))}
      </div>
    </section>

  );
}