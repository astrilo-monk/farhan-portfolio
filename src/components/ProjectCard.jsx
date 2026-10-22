import { ArrowUpRight } from "lucide-react";

export function ProjectLinks({ project }) {
  return (
    <div className="proj-links">
      <a href={project.repo} target="_blank" rel="noreferrer">
        {project.repoLabel ? project.repoLabel.toLowerCase() : "repo"} <ArrowUpRight size={12} />
      </a>
      {project.live && (
        <a className="live" href={project.live} target="_blank" rel="noreferrer">
          live <ArrowUpRight size={12} />
        </a>
      )}
    </div>
  );
}

export default function ProjectCard({ project }) {
  const Icon = project.icon;

  return (
    <article className="card proj-card reveal">
      <div className="proj-top">
        <span className="proj-name">
          <Icon size={15} />
          {project.title}
        </span>
        {project.status ? <span className="badge-wip">{project.status.toLowerCase()}</span> : <span className="proj-year">{project.year}</span>}
      </div>
      <p className="proj-desc">{project.description}</p>
      <div className="tags">
        {project.tags.map((tag) => (
          <span key={tag} className="tag">
            {tag}
          </span>
        ))}
      </div>
      <ProjectLinks project={project} />
    </article>
  );
}
