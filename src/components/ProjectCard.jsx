export default function ProjectCard({ project, index = 0 }) {
  const Icon = project.icon;

  return (
    <article className={`hud-panel corner-decor project-card fade-up d${(index % 5) + 1}`}>
      <div className="project-head">
        <div className={`hex-badge ${project.color}`}>
          <Icon size={20} />
        </div>
        {project.status ? <span className="status-wip">{project.status}</span> : <span>{project.year}</span>}
      </div>
      <h3>{project.title}</h3>
      <p>{project.description}</p>
      <div className="tag-row">
        {project.tags.map((tag) => (
          <span key={tag} className={`tag ${project.color}`}>
            {tag}
          </span>
        ))}
      </div>
      <div className="project-links">
        <a className="project-link" href={project.repo} target="_blank" rel="noreferrer">
          {project.repoLabel || "OPEN REPO"}
        </a>
        {project.live && (
          <a className="project-link live" href={project.live} target="_blank" rel="noreferrer">
            OPEN LIVE
          </a>
        )}
      </div>
    </article>
  );
}
