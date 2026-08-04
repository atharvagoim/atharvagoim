import {
  FaReact, FaNodeJs, FaEthereum, FaGithub, FaJs, FaJava, FaGitAlt, FaDocker,
  FaAws, FaLinux, FaHtml5, FaCss3Alt, FaPhp, FaFigma, FaPython, FaVuejs, FaRobot,
} from "react-icons/fa";
import {
  SiMongodb, SiExpress, SiTypescript, SiTailwindcss, SiFirebase, SiMysql,
  SiPostman, SiCplusplus, SiGit, SiVercel, SiNetlify, SiNextdotjs, SiAngular,
  SiNestjs, SiPostgresql, SiRedis, SiGraphql, SiBootstrap, SiSass,
  SiKubernetes, SiGooglecloud, SiGitlab, SiSolidity, SiRedux, SiJest,
  SiWebpack, SiNpm, SiFlutter, SiDjango, SiSpring, SiPrisma, SiSupabase,
  SiThreedotjs, SiSocketdotio, SiJquery, SiC, SiSqlite, SiVite,
} from "react-icons/si";
import { VscVscode } from "react-icons/vsc";

// Curated set of preset icons available in the admin "Icon Picker".
// key -> { label, Icon, color } — color is the default tailwind-ish hex used
// when this icon is picked (can be overridden per-skill).
export const ICON_LIBRARY = {
  react: { label: "React", Icon: FaReact, color: "#22d3ee" },
  nextjs: { label: "Next.js", Icon: SiNextdotjs, color: "#e5e5e5" },
  vue: { label: "Vue.js", Icon: FaVuejs, color: "#4ade80" },
  angular: { label: "Angular", Icon: SiAngular, color: "#f87171" },
  nodejs: { label: "Node.js", Icon: FaNodeJs, color: "#4ade80" },
  express: { label: "Express", Icon: SiExpress, color: "#e5e5e5" },
  nestjs: { label: "NestJS", Icon: SiNestjs, color: "#f87171" },
  mongodb: { label: "MongoDB", Icon: SiMongodb, color: "#4ade80" },
  mysql: { label: "MySQL", Icon: SiMysql, color: "#38bdf8" },
  postgresql: { label: "PostgreSQL", Icon: SiPostgresql, color: "#60a5fa" },
  sqlite: { label: "SQLite", Icon: SiSqlite, color: "#60a5fa" },
  redis: { label: "Redis", Icon: SiRedis, color: "#f87171" },
  graphql: { label: "GraphQL", Icon: SiGraphql, color: "#f472b6" },
  firebase: { label: "Firebase", Icon: SiFirebase, color: "#facc15" },
  supabase: { label: "Supabase", Icon: SiSupabase, color: "#4ade80" },
  prisma: { label: "Prisma", Icon: SiPrisma, color: "#e5e5e5" },
  javascript: { label: "JavaScript", Icon: FaJs, color: "#facc15" },
  typescript: { label: "TypeScript", Icon: SiTypescript, color: "#60a5fa" },
  python: { label: "Python", Icon: FaPython, color: "#facc15" },
  java: { label: "Java", Icon: FaJava, color: "#f97316" },
  cpp: { label: "C++", Icon: SiCplusplus, color: "#60a5fa" },
  c: { label: "C", Icon: SiC, color: "#93c5fd" },
  php: { label: "PHP", Icon: FaPhp, color: "#a78bfa" },
  django: { label: "Django", Icon: SiDjango, color: "#4ade80" },
  spring: { label: "Spring", Icon: SiSpring, color: "#4ade80" },
  html5: { label: "HTML5", Icon: FaHtml5, color: "#f97316" },
  css3: { label: "CSS3", Icon: FaCss3Alt, color: "#60a5fa" },
  tailwind: { label: "Tailwind CSS", Icon: SiTailwindcss, color: "#67e8f9" },
  bootstrap: { label: "Bootstrap", Icon: SiBootstrap, color: "#a78bfa" },
  sass: { label: "Sass", Icon: SiSass, color: "#f472b6" },
  jquery: { label: "jQuery", Icon: SiJquery, color: "#60a5fa" },
  redux: { label: "Redux", Icon: SiRedux, color: "#a78bfa" },
  threejs: { label: "Three.js", Icon: SiThreedotjs, color: "#e5e5e5" },
  socketio: { label: "Socket.IO", Icon: SiSocketdotio, color: "#e5e5e5" },
  vite: { label: "Vite", Icon: SiVite, color: "#a78bfa" },
  webpack: { label: "Webpack", Icon: SiWebpack, color: "#60a5fa" },
  jest: { label: "Jest", Icon: SiJest, color: "#f87171" },
  npm: { label: "npm", Icon: SiNpm, color: "#f87171" },
  blockchain: { label: "Blockchain", Icon: FaEthereum, color: "#a78bfa" },
  solidity: { label: "Solidity", Icon: SiSolidity, color: "#e5e5e5" },
  openai: { label: "OpenAI / AI", Icon: FaRobot, color: "#e5e5e5" },
  flutter: { label: "Flutter", Icon: SiFlutter, color: "#60a5fa" },
  docker: { label: "Docker", Icon: FaDocker, color: "#60a5fa" },
  kubernetes: { label: "Kubernetes", Icon: SiKubernetes, color: "#60a5fa" },
  aws: { label: "AWS", Icon: FaAws, color: "#f97316" },
  googlecloud: { label: "Google Cloud", Icon: SiGooglecloud, color: "#facc15" },
  linux: { label: "Linux", Icon: FaLinux, color: "#e5e5e5" },
  git: { label: "Git", Icon: SiGit, color: "#f97316" },
  gitalt: { label: "Git (alt)", Icon: FaGitAlt, color: "#f97316" },
  github: { label: "GitHub", Icon: FaGithub, color: "#e5e5e5" },
  gitlab: { label: "GitLab", Icon: SiGitlab, color: "#f97316" },
  vercel: { label: "Vercel", Icon: SiVercel, color: "#e5e5e5" },
  netlify: { label: "Netlify", Icon: SiNetlify, color: "#67e8f9" },
  vscode: { label: "VS Code", Icon: VscVscode, color: "#60a5fa" },
  postman: { label: "Postman", Icon: SiPostman, color: "#fb923c" },
  figma: { label: "Figma", Icon: FaFigma, color: "#f472b6" },
};

export const ICON_KEYS = Object.keys(ICON_LIBRARY);

export function getIconEntry(iconKey) {
  return ICON_LIBRARY[iconKey] || null;
}
