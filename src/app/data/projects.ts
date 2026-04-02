import imgAndroidBeto from "../../../graphic-assets/android-beto/01_beto_hero_image.png";
import imgCarpooling from "../../../graphic-assets/carpooling-app/01_carpooling_app_hero_image.png";
import imgMariaHache from "../../../graphic-assets/maria-hache/01_maria_hache_hero_image.png";
import imgModularStoryboards from "../../../graphic-assets/modular-storyboards/01_modular_storyboards_hero_image.png";
import imgWinterCircus from "../../../graphic-assets/wintercircus/01_wintercircus_hero_image.png";

export type Project = {
  id: string;
  title: string;
  platform: string;
  image: string;
};

export const projects: Project[] = [
  {
    id: "android-beto",
    title: "BETTER TOGETHER",
    platform: "Android",
    image: imgAndroidBeto,
  },
  {
    id: "carpooling-app",
    title: "CARPOOLING APP",
    platform: "Mobile",
    image: imgCarpooling,
  },
  {
    id: "maria-hache",
    title: "MARIA HACHE",
    platform: "Web",
    image: imgMariaHache,
  },
  {
    id: "modular-storyboards",
    title: "MODULAR STORYBOARDS",
    platform: "Desktop",
    image: imgModularStoryboards,
  },
  {
    id: "wintercircus",
    title: "WINTER CIRCUS",
    platform: "Web",
    image: imgWinterCircus,
  },
];
