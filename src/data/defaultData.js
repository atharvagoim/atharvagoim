// Default content for the portfolio. Anything edited from /admin overrides
// this at runtime (stored in the browser via localStorage). To make admin
// edits permanent for every visitor, use "Export / copy data" in the admin
// panel and paste the result in here, then redeploy.

export const defaultData = {
  images: {
    hero: "https://i.postimg.cc/rm1jr8tm/761F1F47-2F3B-4B43-B1C2-2D0955593681.jpg",
    about: "https://i.postimg.cc/x8tp7058/9F02A6BF-8125-46DA-9F7F-E9EC6063B7F6.jpg",
    mindset: "https://i.postimg.cc/05f3XqtR/IMG-5795.jpg",
    // Where the hero cover image is focused when it gets cropped (background-position).
    heroPosition: { x: 50, y: 50 },
  },

  footer: {
    phone: "+919930598420",
    email: "atharvagoim7@gmail.com",
    github: "https://github.com/atharvagoim",
    linkedin: "https://www.linkedin.com/in/atharva-goim-489b1b3bb/",
    instagram: "https://www.instagram.com/atharvarevs/",
    resume: "https://drive.google.com/file/d/11uRngk_bGAyqAr2JBXMGr70Wm7nkbFE7/view?usp=sharing",
  },

  // category: "technology" | "tool" | "platform"
  skills: [
    { id: "s1", name: "React", category: "technology", iconKey: "react" },
    { id: "s2", name: "Node.js", category: "technology", iconKey: "nodejs" },
    { id: "s3", name: "MongoDB", category: "technology", iconKey: "mongodb" },
    { id: "s4", name: "Express", category: "technology", iconKey: "express" },
    { id: "s5", name: "JavaScript", category: "technology", iconKey: "javascript" },
    { id: "s6", name: "C++", category: "technology", iconKey: "cpp" },
    { id: "s7", name: "MySQL", category: "technology", iconKey: "mysql" },

    { id: "t1", name: "TypeScript", category: "tool", iconKey: "typescript" },
    { id: "t2", name: "Tailwind", category: "tool", iconKey: "tailwind" },
    { id: "t3", name: "Blockchain", category: "tool", iconKey: "blockchain" },
    { id: "t4", name: "Firebase", category: "tool", iconKey: "firebase" },
    { id: "t5", name: "VS Code", category: "tool", iconKey: "vscode" },
    { id: "t6", name: "Postman", category: "tool", iconKey: "postman" },
    { id: "t7", name: "Git", category: "tool", iconKey: "git" },

    { id: "p1", name: "GitHub", category: "platform", iconKey: "github" },
    { id: "p2", name: "Vercel", category: "platform", iconKey: "vercel" },
    { id: "p3", name: "Netlify", category: "platform", iconKey: "netlify" },
  ],

  projects: [
    {
      id: "pr1",
      title: "Blockchain URL Safety",
      desc: "A blockchain-powered URL verification platform designed to detect malicious links and improve browsing security using decentralized validation systems.",
      repository: "https://github.com/atharvagoim/Blockchain_URL_safety.git",
      certificate: "",
      image: "",
    },
    {
      id: "pr2",
      title: "Fin AI Expense Tracker",
      desc: "An AI-driven finance management application that tracks expenses, analyzes spending habits, and provides smart saving recommendations.",
      repository: "https://github.com/atharvagoim/FinAI.git",
      certificate: "",
      image: "",
    },
    {
      id: "pr3",
      title: "AI Customer Care",
      desc: "An intelligent customer support assistant built with AI automation to handle queries, improve response efficiency, and enhance user experience.",
      repository: "https://github.com/atharvagoim/AI-customer-care-.git",
      certificate: "",
      image: "",
    },
  ],

  // Personal blog posts — add your own from /admin.
  blogPosts: [],
};
