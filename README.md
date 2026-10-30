<div align="center">

# AllVisualizer

### Interactive Learning Through Visualization

[![License: CC BY-NC 4.0](https://img.shields.io/badge/License-CC%20BY--NC%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc/4.0/)
[![Next.js](https://img.shields.io/badge/Next.js-14+-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0+-38B2AC)](https://tailwindcss.com/)

[Live Demo](https://allvisualizer.com) · [Report Bug](https://github.com/amancd/allvisualizer-v2/issues) · [Request Feature](https://github.com/amancd/allvisualizer-v2/issues)

</div>

---

## Overview

AllVisualizer is an open-source educational platform that transforms abstract concepts into intuitive visual experiences. Built with modern web technologies, it provides interactive visualizations across Computer Science, Mathematics, Physics, and Artificial Intelligence to enhance learning and comprehension.

**Live Platform**: [https://allvisualizer.com](https://allvisualizer.com)

### Mission

To democratize quality education by making complex concepts accessible through interactive visualization, enabling learners worldwide to develop deeper understanding through visual and hands-on learning experiences.

### Sustainability Model

AllVisualizer is free to use and open source. To maintain and improve the platform, we display non-intrusive Google AdSense advertisements that help cover hosting costs and development expenses. This allows us to keep the platform accessible to everyone while ensuring long-term sustainability.

## Key Features

### Interactive Visualizations
- Real-time algorithm execution with step-by-step breakdowns
- Dynamic mathematical transformations and graphing
- Physics simulations with adjustable parameters
- Neural network training visualization

### Comprehensive Coverage
- **Data Structures & Algorithms**: Sorting, searching, graph algorithms, dynamic programming
- **Mathematics**: Calculus, linear algebra, optimization, matrix operations
- **Physics**: Classical mechanics, Newton's laws, projectile motion
- **Machine Learning**: Neural networks, perceptron learning, backpropagation

### Educational Tools
- Complexity analysis and performance metrics
- Interactive problem-solving environments
- Community discussions powered by GitHub (Giscus integration)
- Mobile-responsive design for learning on any device

### Modern Architecture
- Built with Next.js 14+ App Router for optimal performance
- TypeScript for type safety and developer experience
- Server-side rendering and static site generation
- Fully responsive design with Tailwind CSS

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running Locally](#running-locally)
- [Project Structure](#project-structure)
- [Available Visualizations](#available-visualizations)
- [Technology Stack](#technology-stack)
- [Configuration](#configuration)
- [Contributing](#contributing)
- [Roadmap](#roadmap)
- [License and Usage](#license-and-usage)
- [Support the Project](#support-the-project)
- [Contact](#contact)

## Getting Started

### Prerequisites

- Node.js 18.0 or higher
- npm 9.0 or higher (or yarn 1.22+)
- Git

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/amancd/allvisualizer-v2.git
   cd allvisualizer-v2
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Configure environment variables (optional)
   ```bash
   cp .env.example .env.local
   ```

### Running Locally

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

Build for production:

```bash
npm run build
npm start
```

## Project Structure

```
allvisualizer-v2/
├── app/                                    # Next.js App Router
│   ├── (routes)/
│   │   ├── about/                         # About page
│   │   ├── contact/                       # Contact page
│   │   ├── privacy-policy/                # Privacy policy
│   │   └── terms-and-conditions/          # Terms of service
│   ├── dsa-visualizer/                    # DSA section
│   │   ├── [category]/                    # Dynamic category pages
│   │   └── problems/                      # Individual problems
│   │       ├── two-sum/
│   │       ├── reverse-linked-list/
│   │       └── best-time-to-buy-sell-stock/
│   ├── math-visualizer/                   # Mathematics section
│   │   ├── calculus/
│   │   ├── linear-algebra/
│   │   └── problems/
│   │       ├── derivatives/
│   │       ├── chain-rule/
│   │       ├── integration-basics/
│   │       ├── matrix-operations/
│   │       ├── determinants/
│   │       └── optimization/
│   ├── physics-visualizer/                # Physics section
│   │   ├── mechanics/
│   │   └── simulations/
│   │       ├── projectile-motion/
│   │       └── newtons-laws/
│   ├── ai-ml-visualizer/                  # AI/ML section
│   │   ├── neural-networks/
│   │   └── visualizations/
│   │       └── simple-perceptron/
│   ├── layout.tsx                         # Root layout
│   ├── page.tsx                           # Homepage
│   └── globals.css                        # Global styles
├── components/
│   ├── layout/
│   │   ├── Header.tsx                     # Navigation header
│   │   └── Footer.tsx                     # Site footer
│   ├── ui/
│   │   └── GiscusComments.tsx             # GitHub discussions
│   └── visualizers/
│       └── TwoSumVisualizer.tsx           # Reusable visualizers
├── config/
│   └── giscus.ts                          # Centralized config
├── public/                                 # Static assets
│   └── robots.txt
├── next.config.ts                         # Next.js configuration
├── tailwind.config.ts                     # Tailwind configuration
├── tsconfig.json                          # TypeScript configuration
└── package.json                           # Dependencies
```

## Available Visualizations

### Data Structures & Algorithms
- **Arrays**: Two Sum, Best Time to Buy and Sell Stock
- **Linked Lists**: Reverse Linked List
- **More coming soon**: Sorting algorithms, trees, graphs, dynamic programming

### Mathematics
- **Calculus**: Derivatives, Chain Rule, Integration Basics, Optimization
- **Linear Algebra**: Matrix Operations, Determinants

### Physics
- **Classical Mechanics**: Newton's Laws, Projectile Motion

### Artificial Intelligence & Machine Learning
- **Neural Networks**: Simple Perceptron, Backpropagation

## Technology Stack

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript 5.0+
- **Styling**: Tailwind CSS 3.0+
- **UI Components**: Custom React components

### Features
- **Comments**: GitHub Discussions via Giscus
- **Analytics**: Ready for integration
- **SEO**: Metadata API, sitemap generation
- **Performance**: Server-side rendering, static generation

### Development Tools
- **Linting**: ESLint
- **Formatting**: Prettier (recommended)
- **Version Control**: Git

## Configuration

### Giscus Comments

The project uses centralized Giscus configuration in `/config/giscus.ts`:

```typescript
export const giscusConfig = {
  repo: "amancd/allvisualizer-v2",
  repoId: "YOUR_REPO_ID",
  category: "Show and tell",
  categoryId: "YOUR_CATEGORY_ID",
  mapping: "pathname",
  reactionsEnabled: "1",
  emitMetadata: "0",
  inputPosition: "bottom",
  theme: "light",
  lang: "en",
  loading: "lazy"
};
```

To set up:
1. Enable GitHub Discussions on your repository
2. Install Giscus app: https://github.com/apps/giscus
3. Get your repository and category IDs from https://giscus.app
4. Update the values in `/config/giscus.ts`

### Metadata

Update site metadata in `app/layout.tsx` for SEO optimization.

## Contributing

We welcome contributions from the community! Here's how you can help:

### Reporting Bugs

- Use the [GitHub Issues](https://github.com/amancd/allvisualizer-v2/issues) page
- Check if the issue already exists before creating a new one
- Include detailed steps to reproduce
- Provide screenshots if applicable

### Suggesting Features

- Open an issue with the `enhancement` label
- Describe the feature and its use case
- Explain why it would benefit the project

### Submitting Pull Requests

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Standards

- Follow TypeScript best practices
- Use meaningful variable and function names
- Add comments for complex logic
- Ensure responsive design
- Test on multiple browsers
- Run `npm run lint` before committing

## Roadmap

### Version 2.0 (Current)
- [x] Core platform architecture
- [x] DSA visualizations (Arrays, Linked Lists)
- [x] Math visualizations (Calculus, Linear Algebra)
- [x] Physics simulations (Mechanics)
- [x] AI/ML visualizations (Neural Networks)
- [x] GitHub Discussions integration
- [x] Mobile responsive design

### Version 2.1 (Upcoming)
- [ ] More DSA problems (Trees, Graphs, Dynamic Programming)
- [ ] Advanced calculus topics
- [ ] Additional physics simulations
- [ ] Deep learning visualizations
- [ ] User progress tracking
- [ ] Interactive code playground

### Version 3.0 (Future)
- [ ] User authentication
- [ ] Personal learning paths
- [ ] Achievement system
- [ ] API for developers
- [ ] Mobile native apps
- [ ] Multilingual support

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

**Project Maintainer**: Aman Singh

- GitHub: [@amancd](https://github.com/amancd)
- Project Repository: [allvisualizer-v2](https://github.com/amancd/allvisualizer-v2)
- Website: [AllVisualizer](https://allvisualizer.vercel.app)

## Acknowledgments

- Inspired by the need for better visual learning tools in STEM education
- Built with modern web technologies and best practices
- Community-driven development approach

---

<div align="center">

**Made with passion for education and open source**

[⬆ Back to Top](#allvisualizer)

</div>
- Graphs & Graph Algorithms
- Dynamic Programming
- Recursion & Backtracking
- Hashing

## Technologies Used

- **Framework**: Next.js 16+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Heroicons (via SVG)
- **Community**: Discord Integration

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## License and Usage

This project is licensed under the **Creative Commons Attribution-NonCommercial 4.0 International License (CC BY-NC 4.0)**.

### What This Means

**You are free to:**
- Share — copy and redistribute the material in any medium or format
- Adapt — remix, transform, and build upon the material for non-commercial purposes
- Use the code for learning, education, and personal projects

**Under the following terms:**
- **Attribution** — You must give appropriate credit, provide a link to the license, and indicate if changes were made
- **NonCommercial** — You may not use the material for commercial purposes without explicit permission

### Commercial Use

If you wish to use AllVisualizer or its codebase for commercial purposes, please contact us at nkcoderz@gmail.com for licensing arrangements.

**Why Non-Commercial?**
The platform is sustained through Google AdSense revenue to cover hosting and development costs. Allowing unrestricted commercial use would undermine this sustainability model and the platform's accessibility mission.

For full license details, see the [LICENSE](LICENSE) file or visit [Creative Commons BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/).

## Support the Project

AllVisualizer is free to use and will always remain accessible to learners worldwide. To sustain and improve the platform, we rely on:

### Current Support Model
- **Google AdSense**: Non-intrusive advertisements help cover hosting costs and development expenses
- **Community Contributions**: Bug reports, feature requests, and code contributions

### How You Can Help
1. **Use and Share**: Share AllVisualizer with students, educators, and learners
2. **Contribute**: Submit bug reports, feature requests, or pull requests
3. **Provide Feedback**: Help us improve by sharing your learning experience
4. **Support Development**: The ads displayed on the platform directly fund ongoing development

Every bit of support helps us maintain free, quality educational resources for everyone.

## Contact

**Project Maintainer**: Aman Singh

- GitHub: [@amancd](https://github.com/amancd)
- Email: nkcoderz@gmail.com
- Website: [https://allvisualizer.com](https://allvisualizer.com)
- Repository: [allvisualizer-v2](https://github.com/amancd/allvisualizer-v2)

---

<div align="center">

**Built with dedication for learners worldwide**

*Making complex concepts accessible through visualization*

[⬆ Back to Top](#allvisualizer)

</div>
