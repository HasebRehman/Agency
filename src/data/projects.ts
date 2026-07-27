export type Project = {
  tag: string;
  title: string;
  description: string;
  stack: string[];
  image: string;
  link: string;
};

export const projects: Project[] = [
  {
    tag: "Featured Project",
    title: "COTD.AI – AI-Powered Trading Intelligence Platform",
    description:
      "Developed COTD.AI, an AI-powered trading intelligence platform delivering 10K+ daily sentiment signals for global traders. Implemented full-stack architecture using React for frontend and Nest.js/Node.js for backend. Integrated blockchain for secure transaction tracking and real-time WebSocket APIs for live market data. Built AI models using TensorFlow and Python to generate trading signals, optimized database performance with MongoDB and PostgreSQL, and deployed scalable serverless functions on AWS Lambda.",
    stack: [
      "React.js",
      "Nest.js",
      "Node.js",
      "Blockchain",
      "Netlify",
      "TypeScript",
      "AWS Lambda",
      "MongoDB",
      "WebSockets",
      "REST APIs",
      "Docker",
      "GraphQL",
      "TensorFlow",
      "Python",
      "Redis",
      "PostgreSQL",
      "Jest",
    ],
    image: "/projects/1st.png",
    link: "https://cotd.ai/",
  },
  {
    tag: "Featured Project",
    title: "HIMS – Hospital Information Management System",
    description:
      "Developed the HIMS project using MERN technologies, encompassing both front-end and back-end development. Implemented modules for appointments, insurance, financial reporting, access configuration, employees, OPD, IPD, pathology, radiology, pharmacy, and blood bank management. Ensured seamless user experience and efficient data handling by integrating robust APIs and optimizing database performance.",
    stack: [
      "Node.js",
      "MongoDB",
      "Express.js",
      "AWS S3",
      "AWS EC2",
      "Microsoft Azure",
      "Docker",
      "Next.js",
      "SQL Server",
      "TypeScript",
      "Nest.js",
      "Memcached",
      "ElasticSearch",
      "Lambda Functions",
      "React.js",
      "Google Extensions",
    ],
    image: "/projects/2nd.png",
    link: "https://pakhims.com/login",
  },
  {
    tag: "Featured Project",
    title: "Sportecolytics – Sports Sustainability Dashboard",
    description:
      "Developed Sportecolytics, a comprehensive dashboard that enables sports organizations to track, analyze, and reduce over 100K tons of CO₂ emissions annually. Implemented the frontend using React and Next.js with responsive, interactive charts powered by Chart.js and D3.js. Built backend services with Node.js and Supabase for secure user authentication, real-time data management, and optimized database queries. Deployed the platform on Vercel for high performance and scalability.",
    stack: [
      "React.js",
      "Next.js",
      "Node.js",
      "Supabase",
      "Vercel",
      "TypeScript",
      "PostgreSQL",
      "REST APIs",
      "Chart.js",
      "D3.js",
      "Docker",
      "AWS S3",
      "Jest",
      "Tailwind CSS",
      "Redux",
    ],
    image: "/projects/3rd.png",
    link: "https://www.sportecolytics.com/",
  },
  {
    tag: "Featured Project",
    title: "TapMeSaveMe – NFC-based eCommerce Platform",
    description:
      "Developed TapMeSaveMe, an NFC-based eCommerce platform that enables seamless shopping experiences and powers over 50K product scans monthly. Integrated Shopify for product management and Firebase for authentication, real-time database updates, and analytics tracking. Built a responsive and modern frontend using Next.js and React.js, ensuring smooth user interactions across devices. Implemented secure payment flows, order tracking, and analytics dashboards.",
    stack: [
      "Next.js",
      "React.js",
      "Firebase",
      "Shopify API",
      "TypeScript",
      "Tailwind CSS",
      "Stripe",
      "Firestore",
      "Vercel",
      "Docker",
    ],
    image: "/projects/4th.png",
    link: "https://www.tapmesaveme.com/",
  },
  {
    tag: "Featured Project",
    title: "videotest.testrtc.com",
    description:
      "WebRTC testing tool for real-time video and audio quality checks, enabling 10K+ monthly test sessions with detailed performance metrics and diagnostics.",
    stack: ["React", "Node.js", "WebRTC", "AWS", "TypeScript"],
    image: "/projects/5.png",
    link: "https://videotest.testrtc.com/",
  },
  {
    tag: "Featured Project",
    title: "orijin.io",
    description:
      "Agriculture platform for farm management, digital payments, and EUDR compliance, supporting 100K+ farm records and... transactions with real-time insights.",
    stack: ["Express.js", "React", "Node.js", "MongoDB", "TypeScript"],
    image: "/projects/6.png",
    link: "https://orijin.io/",
  },
  {
    tag: "Featured Project",
    title: "AI Markdown Editor",
    description:
      "Collaborative WYSIWYG Markdown editor with AI integration, enabling seamless real-time editing for 5K+ concurrent users and... intelligent content suggestions.",
    stack: ["Tiptap", "Yjs", "Next.js", "RAG", "Hocus Pocus"],
    image: "/projects/7.png",
    link: "",
  },
  {
    tag: "Featured Project",
    title: "hellosenseai.com",
    description:
      "AI receptionist for small businesses, handling 1M+ customer calls and message monthly with automated scheduling,... messaging, and CRM integration.",
    stack: ["Lovable", "Supabase", "FastAPI", "Next.js", "VAPI"],
    image: "/projects/8.png",
    link: "https://hellosenseai.com/",
  },
  {
    tag: "Featured Project",
    title: "AI Voice Chatbot/Agent",
    description:
      "Automated AI voice assistant for financial institutions, processing 100K+ voice queries monthly with natural speech synthesis and... advanced workflows.",
    stack: ["Node.js", "VAPI", "n8n", "ElevenLabs", "SDKs", "RAG"],
    image: "/projects/9.png",
    link: "",
  },
  {
    tag: "Featured Project",
    title: "docus.ai",
    description:
      "Medical AI platform offering health assistant, AI doctor, and lab test interpretation, serving 500K+ patients... worldwide with secure, scalable infrastructure.",
    stack: ["Next.js", "Node.js", "Vercel", "AI Integrations"],
    image: "/projects/10.png",
    link: "https://docus.ai/",
  },
  {
    tag: "Featured Project",
    title: "qiyas.pro",
    description:
      "Quiz platform with multilingual support and admin dashboards, powering 50K+ quizzes completed monthly with real-time analytic... and user management.",
    stack: ["Loveable", "Next.js", "Supabase", "Vercel", "TypeScript"],
    image: "/projects/11.png",
    link: "https://qiyas.pro/landing",
  },
  {
    tag: "Featured Project",
    title: "Crypto Arbitrage Bot",
    description:
      "Low-latency trading bot executing 1K+ daily arbitrage trades with MetaMask/Phantom login, real-time order book syncing, and... adaptive cross-exchange strategies.",
    stack: ["Node.js", "Express.js", "Socket.IO", "CCXT Pro"],
    image: "/projects/12.png",
    link: "",
  },
];
