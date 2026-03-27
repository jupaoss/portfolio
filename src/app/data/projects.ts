import imgImage from "@/assets/home/project_1_better_together/c89e008f1c0974e021ee6f4e45d74cff3d25471b.png";

export type Project = {
  id: string;
  title: string;
  platform: string;
  image: string;
};

export const projects: Project[] = [
  {
    id: "1",
    title: "BETTER TOGETHER",
    platform: "Android",
    image: imgImage,
  },
  {
    id: "2",
    title: "URBAN PULSE",
    platform: "iOS",
    image: imgImage,
  },
  {
    id: "3",
    title: "MINIMAL SPACES",
    platform: "Web",
    image: imgImage,
  },
  {
    id: "4",
    title: "CREATIVE FLOW",
    platform: "Desktop",
    image: imgImage,
  },
  {
    id: "5",
    title: "DIGITAL DREAMS",
    platform: "Mobile",
    image: imgImage,
  },
  {
    id: "6",
    title: "MODERN DESIGN",
    platform: "Android",
    image: imgImage,
  },
];