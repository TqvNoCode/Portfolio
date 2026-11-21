export interface ProjectArchitectureLayer {
  name: string;
  description: string;
  tech: string[];
}

export interface ProjectDecision {
  title: string;
  rationale: string;
  outcome: string;
}

export interface FeaturedProject {
  id: string;
  title: string;
  subtitle: string;
  positioning: string;
  phase: string;
  summary: string;
  problem: string;
  goals: string[];
  techStack: {
    category: string;
    items: string[];
  }[];
  architecture: ProjectArchitectureLayer[];
  engineeringDecisions: ProjectDecision[];
  verification: {
    testFramework: string;
    auditScope: string;
    packaging: string;
    highlights: string[];
  };
  links: {
    github: string;
    liveDemo?: string; // Optional marked placeholder if not deployed to web
    docs?: string;
  };
}

export const FEATURED_PROJECT: FeaturedProject = {
  id: 'mathweave-studio',
  title: 'MathWeave Studio',
  subtitle: 'Mathematical Computation, Step-by-Step Verification & Visualization',
  positioning: 'Desktop Computing Application for Linux',
  phase: 'Phase 1 Stability (Active MVP)',
  summary:
    'MathWeave Studio is a dedicated application engineered to assist in mathematical computation, step-by-step problem resolution, result verification, and interactive visualization of mathematical objects, including differential equations (ODEs) and multi-dimensional surfaces.',
  problem:
    'Mathematical reasoning and numerical computation software often suffers from opaque black-box calculations, heavy web runtimes, or fragmented tooling that makes inspecting intermediate steps and verifying differential equation solutions cumbersome.',
  goals: [
    'Deliver transparent step-by-step mathematical problem solving and verification.',
    'Provide high-performance ODE (Ordinary Differential Equation) numerical and analytical calculation pipelines.',
    'Enable interactive visualization for 3D surfaces and mathematical geometry.',
    'Package a lean, native-feeling desktop experience for Linux workstations with PyInstaller and uv.',
  ],
  techStack: [
    {
      category: 'Core Language & Runtime',
      items: ['Python 3.12+', 'uv Package Manager'],
    },
    {
      category: 'Computation & Analysis',
      items: ['Symbolic / Numerical Solvers', 'ODE Calculation Engine'],
    },
    {
      category: 'Packaging & Desktop',
      items: ['PyInstaller (.spec)', 'Linux .desktop Entry', 'Standalone launch scripts'],
    },
    {
      category: 'Quality & Testing',
      items: ['Pytest Test Suite', 'Targeted ODE Audit Bundles', 'Phase Stability Verification'],
    },
  ],
  architecture: [
    {
      name: '1. Expression Parsing & AST Pipeline',
      description: 'Parses raw mathematical expressions, sanitizes inputs, and constructs syntax trees for evaluation.',
      tech: ['Custom Tokenizer', 'Abstract Syntax Trees'],
    },
    {
      name: '2. Calculation & ODE Solver Engine',
      description: 'Executes analytical and numerical steps, validating boundary conditions and generating intermediate solution paths.',
      tech: ['ODE Solvers', 'Step-by-Step Tracers'],
    },
    {
      name: '3. Interactive Visualization Surface',
      description: 'Renders curves, coordinate vectors, and 3D surface projections with responsive user manipulation.',
      tech: ['3D Plotting Engine', 'Viewport Canvas'],
    },
    {
      name: '4. Native Linux Desktop Shell',
      description: 'Encapsulates the runtime with launch.sh, desktop entry specifications, and standalone binary builds.',
      tech: ['PyInstaller', 'XDG Desktop Integration'],
    },
  ],
  engineeringDecisions: [
    {
      title: 'Adoption of uv for Deterministic Dependency Management',
      rationale:
        'Standard pip workflows are slow and prone to environment drift across Linux distributions. uv provides sub-second resolution and strict lockfile reproducibility.',
      outcome:
        'Eliminated virtual environment setup friction and ensured rapid CI test runs with pytest.',
    },
    {
      title: 'Multi-Round Targeted ODE Review & Verification',
      rationale:
        'Mathematical accuracy in differential equation solving cannot rely on simple sanity checks; corner cases in numerical convergence require systematic audits.',
      outcome:
        'Established dedicated ODE review bundles and regression tests to verify boundary conditions before merging into phase stability branches.',
    },
    {
      title: 'Self-Contained Linux Packaging via PyInstaller Spec',
      rationale:
        'Avoid requiring users to manually manage Python versions and system libraries to run the application.',
      outcome:
        'Shipped standalone Linux builds accompanied by .desktop integration and automated launcher scripts.',
    },
  ],
  verification: {
    testFramework: 'Pytest (automated suite via `uv run pytest -q`)',
    auditScope: 'Multi-round ODE solver stability audit and numerical precision checks',
    packaging: 'Standalone PyInstaller executable with .desktop metadata',
    highlights: [
      'Comprehensive unit and regression tests for equation parsing.',
      'Audited differential equation solver pipelines under strict boundary conditions.',
      'Verified zero-drift desktop builds on Arch Linux.',
    ],
  },
  links: {
    github: 'https://github.com/TqvNoCode/MathWeave-Studio',
    liveDemo: undefined, // Not a web SaaS — native desktop app, clearly communicated
  },
};
