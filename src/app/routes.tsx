import { createBrowserRouter } from "react-router";
import { useParams } from "react-router";
import Gallery from "./pages/Gallery";
import ProjectDetail from "./pages/ProjectDetail";

// Forces a full remount of ProjectDetail when the project id changes,
// so the hero expand animation always runs from scratch.
function ProjectDetailKeyed() {
  const { id } = useParams();
  return <ProjectDetail key={id} />;
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Gallery,
  },
  {
    path: "/project/:id",
    Component: ProjectDetailKeyed,
  },
]);
