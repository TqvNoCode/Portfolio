export interface Profile {
  name: string;
  displayTitle: string;
  tagline: string;
  statement: string;
  aboutIntro: string;
  aboutPhilosophy: string;
  status: {
    state: string;
    location: string;
    focus: string;
  };
  social: {
    github: string;
    email: string;
    dotfilesRepo: string;
  };
  interests: string[];
}

export const PROFILE: Profile = {
  name: 'TQV',
  displayTitle: 'Software Development & AI Engineering',
  tagline: 'Building software. Exploring intelligence. Engineering ideas into reality.',
  statement:
    'Dedicated to building resilient software systems, investigating applied machine intelligence, and crafting deliberate, keyboard-driven Linux development environments.',
  aboutIntro:
    'I am a software developer working at the intersection of systems engineering, applied artificial intelligence, and developer tooling. My focus is on building software from first principles—understanding how code compiles, executes, and scales down to the terminal and operating system layers.',
  aboutPhilosophy:
    'I believe genuine software capability is demonstrated through what you build, test, and refine. Whether architecting mathematical visualization tools like MathWeave Studio or tuning an Arch Linux workstation with Neovim and Tmux, I value clarity, precision, and engineering rigor over superficial shortcuts.',
  status: {
    state: 'Active Building',
    location: 'Arch Linux Workstation',
    focus: 'Applied AI & Software Architecture',
  },
  social: {
    github: 'https://github.com/TqvNoCode',
    email: 'chienthuatcovua2@gmail.com',
    dotfilesRepo: 'https://github.com/TqvNoCode/Arch',
  },
  interests: [
    'Software Architecture & System Design',
    'Applied Artificial Intelligence & Machine Learning',
    'Mathematical Modeling & Numerical Computing',
    'Linux Ecosystem & Terminal Workflow Ergonomics',
    'Developer Tools & Code Optimization',
  ],
};
