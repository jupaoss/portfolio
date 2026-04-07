import imgAndroidBeto from "../../../graphic-assets/project_1_better_together/01_beto_hero_image.png";
import imgCarpooling from "../../../graphic-assets/project_2_carpooling-app/01_carpooling_app_hero_image.png";
import imgMariaHache from "../../../graphic-assets/project_3_maria_hache/01_maria_hache_hero_image.png";
import imgModularStoryboards from "../../../graphic-assets/project_4_modular_story_boards/01_modular_storyboards_hero_image.png";
import imgWinterCircus from "../../../graphic-assets/project_5_wintercircus/01_wintercircus_hero_image.png";

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
