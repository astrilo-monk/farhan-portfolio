import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import ActivityHeatmaps from "../components/ActivityHeatmaps";
import ProjectCard, { ProjectLinks } from "../components/ProjectCard";
import SectionHeading from "../components/SectionHeading";
import { featuredProjects, projects } from "../projectsData";

export default function WorkPage() {
  const [showAll, setShowAll] = useState(false);
  const rest = projects.filter((project) => !featuredProjects.includes(project));

  return (
    <>
      <section className="container page-head">
        <p className="sec-cmd">
          <span className="p">$</span> ls ~/work
        </p>
        <h1>Work</h1>
        <p className="page-lede">Live activity first, then everything I have built or am building.</p>
      </section>

      <section id="activity" className="container section tight">
        <SectionHeading cmd="git log --since=1.year" title="Activity" note="github + leetcode, live" />
        <ActivityHeatmaps />
      </section>

      <section id="projects" className="container section">
        <SectionHeading cmd="ls projects/" title="Projects" note={`${projects.length} repos`} />

        <div className="proj-grid">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}

          <button
            type="button"
            className="card show-all-card reveal"
            onClick={() => setShowAll((value) => !value)}
            aria-expanded={showAll}
            aria-controls="more-projects"
          >
            <span className="show-all-icon">{showAll ? <Minus size={22} /> : <Plus size={22} />}</span>
            <strong>{showAll ? "show fewer" : `show all ${projects.length} projects`}</strong>
            <span className="show-all-sub">{showAll ? "collapse the list" : `${rest.length} more builds, experiments and works in progress`}</span>
          </button>
        </div>

        {showAll && (
          <ul id="more-projects" className="proj-list">
            {rest.map((project) => (
              <li key={project.title} className="proj-row">
                <div className="pr-main">
                  <h3>
                    {project.title}
                    {project.status ? (
                      <span className="badge-wip">{project.status.toLowerCase()}</span>
                    ) : (
                      <span className="proj-year">{project.year}</span>
                    )}
                  </h3>
                  <p>{project.description}</p>
                  <div className="tags">
                    {project.tags.map((tag) => (
                      <span key={tag} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <ProjectLinks project={project} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
