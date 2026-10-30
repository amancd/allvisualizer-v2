import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Projectile Motion - Physics Simulation | AllVisualizer",
  description: "Interactive projectile motion simulator. Launch projectiles at different angles and velocities to understand parabolic trajectories, range, max height, and time of flight.",
  keywords: ["projectile motion", "physics simulation", "kinematics", "parabolic trajectory", "projectile simulator", "physics education"],
  openGraph: {
    title: "Projectile Motion Simulator - Interactive Physics | AllVisualizer",
    description: "Explore 2D motion under gravity with real-time trajectory visualization",
  },
};

export default function ProjectileMotionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
