import { createBrowserRouter } from "react-router";
import { useParams } from "react-router";
import Home from "./pages/Home";
import BetterTogether from "./pages/BetterTogether";
import About from "./pages/About";
import CarpoolingApp from "./pages/CarpoolingApp";
import MariaHache from "./pages/MariaHache";
import ModularStoryboards from "./pages/ModularStoryboards";
import WinterCircus from "./pages/WinterCircus";

// Forces a full remount of BetterTogether when the project id changes,
// so the hero expand animation always runs from scratch.
function BetterTogetherKeyed() {
  const { id } = useParams();
  return <BetterTogether key={id} />;
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
  // Specific project pages — static routes take precedence over /:id
  {
    path: "/project/carpooling-app",
    Component: CarpoolingApp,
  },
  {
    path: "/project/maria-hache",
    Component: MariaHache,
  },
  {
    path: "/project/modular-storyboards",
    Component: ModularStoryboards,
  },
  {
    path: "/project/wintercircus",
    Component: WinterCircus,
  },
  // Dynamic route handles android-beto (and any future slug-based detail pages)
  {
    path: "/project/:id",
    Component: BetterTogetherKeyed,
  },
  {
    path: "/about",
    Component: About,
  },
]);
