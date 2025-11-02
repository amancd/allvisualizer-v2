# AllVisualizer - Interactive Learning Platform

AllVisualizer is a modern, WordPress-like educational platform built with Next.js and Tailwind CSS. It provides interactive visualizations for learning complex concepts in Data Structures, Algorithms, and more.

## Features

- 🎨 **Clean & Modern UI** - Built with Tailwind CSS for a responsive, beautiful design
- 🔍 **DSA Visualizer** - Interactive Data Structures and Algorithms visualizations
- 📚 **Category System** - Organized learning paths (DSA, Math, Physics, AI/ML coming soon)
- 💬 **Discord Integration** - Community discussions and comments powered by Discord
- 📱 **Fully Responsive** - Works seamlessly on desktop, tablet, and mobile devices
- ⚡ **Fast & Modern** - Built with Next.js 16+ App Router and TypeScript

## Pages

### Main Pages
- **Home** (`/`) - Hero section, features, categories showcase
- **DSA Visualizer** (`/dsa-visualizer`) - Data Structures & Algorithms visualization hub
- **About Us** (`/about`) - Mission and vision
- **Contact** (`/contact`) - Contact form and community links

### Legal Pages
- **Privacy Policy** (`/privacy-policy`) - Comprehensive privacy policy
- **Terms & Conditions** (`/terms-and-conditions`) - Terms of service

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Navigate to the project directory:
```bash
cd /home/amansingh/allvisualizer
```

2. Install dependencies (already done):
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
allvisualizer/
├── app/                          # Next.js App Router pages
│   ├── about/                    # About page
│   ├── contact/                  # Contact page
│   ├── dsa-visualizer/          # DSA Visualizer page
│   ├── privacy-policy/          # Privacy Policy page
│   ├── terms-and-conditions/    # Terms & Conditions page
│   ├── layout.tsx               # Root layout with header/footer
│   ├── page.tsx                 # Homepage
│   └── globals.css              # Global styles
├── components/
│   ├── layout/
│   │   ├── Header.tsx           # Navigation header
│   │   └── Footer.tsx           # Footer with links
│   └── ui/
│       ├── DiscordWidget.tsx    # Discord server widget
│       └── DiscordComments.tsx  # Discord comments section
├── public/                      # Static assets
└── package.json
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Customization

### Discord Integration

To integrate your Discord server:

1. Enable the widget on your Discord server:
   - Go to Server Settings → Widget
   - Enable the widget
   - Copy your Server ID

2. Update the Discord components with your Server ID:
   - Edit `components/ui/DiscordWidget.tsx`
   - Replace `YOUR_SERVER_ID` with your actual server ID

### Styling

- Primary colors can be customized in `tailwind.config.ts`
- Global styles are in `app/globals.css`
- Component-specific styles use Tailwind utility classes

## Future Enhancements

### Planned Features
- [ ] Interactive DSA visualizations (sorting, trees, graphs, etc.)
- [ ] Mathematics visualizers (calculus, geometry, etc.)
- [ ] Physics simulations
- [ ] AI/ML concept visualizations
- [ ] User authentication
- [ ] Progress tracking
- [ ] Code playground
- [ ] Video tutorials
- [ ] Blog/Articles section

### DSA Categories to Implement
- Arrays & Sorting Algorithms
- Linked Lists
- Stacks & Queues
- Trees & BST
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

## Contact

- Email: nkcoderz@gmail.com
- Discord: https://discord.gg/z4TgSrJQ

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

**Note**: This is the initial setup. Individual visualizers will be implemented in subsequent updates.

Built with ❤️ for learners worldwide who want to master complex concepts through visualization.
