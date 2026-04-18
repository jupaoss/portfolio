import { createBrowserRouter } from "react-router";
import { useParams } from "react-router";
import Home from "./pages/Home";
import BetterTogether from "./pages/BetterTogether";
import About from "./pages/About";
import CarpoolingApp from "./pages/CarpoolingApp";
import MariaHache from "./pages/MariaHache";
import ModularStoryboards from "./pages/ModularStoryboards";
import WinterCircus from "./pages/WinterCircus";

function BetterTogetherKeyed() {
  const { id } = useParams();
  return <BetterTogether key={id} />;
}

export const router = createBrowserRouter(
  [
    {
      path: "/",
      Component: Home,
    },
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
    {
      path: "/project/:id",
      Component: BetterTogetherKeyed,
    },
    {
      path: "/about",
      Component: About,
    },
  ],
  {
    basename: "/portfolio",
  }
);


