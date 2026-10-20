import { ArrowLeft } from "lucide-react";
import { projects } from "../projectsData";
import ProjectCard from "./ProjectCard";
import SectionHeading from "./SectionHeading";

export default function ProjectsPage() {
  const inProgress = projects.filter((project) => project.status).length;

  return (
    <section id="all-projects" className="container section projects-page">
      <a className="back-link fade-up" href="#projects">
        <ArrowLeft size={14} />
        BACK TO HOME
      </a>

      <SectionHeading index="ALL" title="ALL PROJECTS" accent="magenta" note={`// ${projects.length}_REPOSITORIES`} />

      <p className="projects-page-intro fade-up">
        Everything I have built or am building, straight from my GitHub. {inProgress} are still in progress and
        marked as such.
      </p>

      <div className="projects-grid">
        {projects.map((project, idx) => (
          <ProjectCard key={project.title} project={project} index={idx} />
        ))}
      </div>
    </section>
  );
}
