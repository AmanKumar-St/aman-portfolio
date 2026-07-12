export const personalData = {
  name: "Aman Kumar",
  title: "Aspiring AI/ML Engineer",
  linkedin: "https://www.linkedin.com/in/aman-kumar-81464417a/",
  bio: "Driven by curiosity at the intersection of artificial intelligence, cybersecurity, and creative engineering. I build things that matter — from intelligent systems to immersive web experiences. Every line of code is a step toward a future where technology feels alive.",
  avatarPlaceholder: true,
  skills: {
    "AI & Machine Learning": ["Python", "TensorFlow", "PyTorch"],
    "Cybersecurity": ["Network Security", "Pentesting"],
    "Frontend Development": ["React", "Vite", "GSAP", "TailwindCSS", "Figma", "Appwrite"]
  },
  projects: [
    {
      title: "OnePiece Tribute",
      tagline: "\"If you don't take risks, you can't create a future.\" — Monkey D. Luffy",
      tech: ["Vite.js", "GSAP", "TailwindCSS", "Figma"],
      link: "https://github.com/AmanKumar-St/OP-Tribute-website.git",
      type: "treasure",
      description: "A tribute page honoring the greatest anime ever created. Built with smooth animations and pixel-perfect design."
    },
    {
      title: "Movie App",
      tagline: "Browse trending movies, search titles, and explore TMDB content",
      tech: ["React.js", "Appwrite", "TailwindCSS", "TMDB API"],
      link: null,
      type: "reel",
      description: "Full-stack React movie app with Appwrite backend, TMDB API integration, responsive design, and sleek modern UI."
    }
  ],
  experience: [
    {
      role: "Cybersecurity Intern",
      company: "Acmegrade",
      period: "",
      description: "Hands-on experience in network security, vulnerability assessment, and security operations."
    },
    {
      role: "B.Tech Computer Science",
      company: "Punjab Technical University",
      period: "",
      description: "Comprehensive education in computer science with focus on AI, ML, and cybersecurity."
    }
  ]
};

export const skillColors = {
  "AI & Machine Learning": { primary: "#7C6FE0", secondary: "#5A4BD1" },
  "Cybersecurity": { primary: "#4ECDC4", secondary: "#36B5AD" },
  "Frontend Development": { primary: "#D4A853", secondary: "#C49A3E" }
};
