'use client';

import { useState } from 'react';
import Link from 'next/link';
import GiscusComments from '@/components/ui/GiscusComments';
import ProjectileMotionVisualizer from './ProjectileMotionVisualizer';

export default function ProjectileMotionPage() {
  const [selectedLanguage, setSelectedLanguage] = useState<'python' | 'javascript' | 'equations'>('python');

  const codeExamples = {
    python: `import numpy as np
import matplotlib.pyplot as plt

# Projectile Motion Simulation

# ==========================================
# PARAMETERS
# ==========================================

v0 = 25.0        # Initial velocity (m/s)
angle = 45.0     # Launch angle (degrees)
h0 = 0.0         # Initial height (m)
g = 9.81         # Gravitational acceleration (m/s²)

# Convert angle to radians
angle_rad = np.radians(angle)

# Velocity components
vx = v0 * np.cos(angle_rad)  # Horizontal component
vy = v0 * np.sin(angle_rad)  # Vertical component

print(f"Initial velocity: {v0} m/s at {angle}°")
print(f"Horizontal velocity: {vx:.2f} m/s")
print(f"Vertical velocity: {vy:.2f} m/s")

# ==========================================
# KINEMATIC EQUATIONS
# ==========================================

# Position as function of time:
# x(t) = vx * t
# y(t) = h0 + vy * t - 0.5 * g * t²

# Velocity as function of time:
# vx(t) = vx (constant)
# vy(t) = vy - g * t

# ==========================================
# CALCULATE KEY VALUES
# ==========================================

# Time of flight (when y = 0)
# Solve: 0 = h0 + vy*t - 0.5*g*t²
# Using quadratic formula: t = (vy ± sqrt(vy² + 2*g*h0)) / g

discriminant = vy**2 + 2*g*h0
if discriminant >= 0:
    t_flight = (vy + np.sqrt(discriminant)) / g
else:
    t_flight = 0
    print("Warning: Invalid parameters (negative flight time)")

# Maximum height (when vy = 0)
# At apex: vy - g*t = 0, so t = vy/g
t_max_height = vy / g
max_height = h0 + vy * t_max_height - 0.5 * g * t_max_height**2

# Range (horizontal distance)
range_distance = vx * t_flight

print(f"\\nTime of flight: {t_flight:.2f} s")
print(f"Maximum height: {max_height:.2f} m")
print(f"Range: {range_distance:.2f} m")

# ==========================================
# SIMULATE TRAJECTORY
# ==========================================

# Create time array
dt = 0.01  # Time step (s)
time_array = np.arange(0, t_flight + dt, dt)

# Calculate position at each time step
x_positions = vx * time_array
y_positions = h0 + vy * time_array - 0.5 * g * time_array**2

# Filter out negative heights (after landing)
valid_indices = y_positions >= 0
x_positions = x_positions[valid_indices]
y_positions = y_positions[valid_indices]
time_array = time_array[valid_indices]

print(f"\\nSimulated {len(time_array)} trajectory points")

# ==========================================
# ANALYZE SPECIFIC TIME POINTS
# ==========================================

def analyze_time(t):
    """Analyze projectile state at time t"""
    x = vx * t
    y = h0 + vy * t - 0.5 * g * t**2
    
    vx_t = vx  # Constant
    vy_t = vy - g * t
    
    speed = np.sqrt(vx_t**2 + vy_t**2)
    angle_t = np.degrees(np.arctan2(vy_t, vx_t))
    
    print(f"\\n--- Time t = {t:.2f} s ---")
    print(f"Position: ({x:.2f}, {y:.2f}) m")
    print(f"Velocity: ({vx_t:.2f}, {vy_t:.2f}) m/s")
    print(f"Speed: {speed:.2f} m/s")
    print(f"Angle: {angle_t:.1f}°")
    
    return x, y, vx_t, vy_t, speed

# Analyze at launch, apex, and landing
print("\\n" + "="*40)
print("TRAJECTORY ANALYSIS")
print("="*40)

analyze_time(0)  # Launch
analyze_time(t_max_height)  # Apex
analyze_time(t_flight)  # Landing

# ==========================================
# ENERGY ANALYSIS
# ==========================================

def calculate_energy(t, mass=1.0):
    """Calculate kinetic and potential energy"""
    y = h0 + vy * t - 0.5 * g * t**2
    vy_t = vy - g * t
    
    KE = 0.5 * mass * (vx**2 + vy_t**2)
    PE = mass * g * y
    total_E = KE + PE
    
    return KE, PE, total_E

print("\\n" + "="*40)
print("ENERGY CONSERVATION (m = 1 kg)")
print("="*40)

for t in [0, t_max_height, t_flight]:
    KE, PE, E_total = calculate_energy(t)
    print(f"\\nt = {t:.2f} s:")
    print(f"  KE = {KE:.2f} J")
    print(f"  PE = {PE:.2f} J")
    print(f"  Total = {E_total:.2f} J")

# ==========================================
# VISUALIZATION
# ==========================================

plt.figure(figsize=(12, 8))

# Subplot 1: Trajectory
plt.subplot(2, 2, 1)
plt.plot(x_positions, y_positions, 'b-', linewidth=2, label='Trajectory')
plt.plot([x_positions[0]], [y_positions[0]], 'go', markersize=10, label='Launch')
plt.plot([x_positions[-1]], [y_positions[-1]], 'ro', markersize=10, label='Landing')
plt.xlabel('Distance (m)')
plt.ylabel('Height (m)')
plt.title('Projectile Trajectory')
plt.grid(True, alpha=0.3)
plt.legend()
plt.axis('equal')

# Subplot 2: Height vs Time
plt.subplot(2, 2, 2)
plt.plot(time_array, y_positions, 'g-', linewidth=2)
plt.axhline(y=max_height, color='r', linestyle='--', alpha=0.5, label=f'Max: {max_height:.1f} m')
plt.xlabel('Time (s)')
plt.ylabel('Height (m)')
plt.title('Height vs Time')
plt.grid(True, alpha=0.3)
plt.legend()

# Subplot 3: Velocity Components
plt.subplot(2, 2, 3)
vx_array = np.full_like(time_array, vx)
vy_array = vy - g * time_array
plt.plot(time_array, vx_array, 'b-', linewidth=2, label='vx (horizontal)')
plt.plot(time_array, vy_array, 'r-', linewidth=2, label='vy (vertical)')
plt.axhline(y=0, color='k', linestyle='-', alpha=0.3)
plt.xlabel('Time (s)')
plt.ylabel('Velocity (m/s)')
plt.title('Velocity Components')
plt.grid(True, alpha=0.3)
plt.legend()

# Subplot 4: Energy
plt.subplot(2, 2, 4)
KE_array = 0.5 * (vx**2 + (vy - g * time_array)**2)
PE_array = g * y_positions
E_total_array = KE_array + PE_array

plt.plot(time_array, KE_array, 'b-', linewidth=2, label='Kinetic Energy')
plt.plot(time_array, PE_array, 'r-', linewidth=2, label='Potential Energy')
plt.plot(time_array, E_total_array, 'k--', linewidth=2, label='Total Energy')
plt.xlabel('Time (s)')
plt.ylabel('Energy (J/kg)')
plt.title('Energy vs Time')
plt.grid(True, alpha=0.3)
plt.legend()

plt.tight_layout()
plt.show()

# ==========================================
# OPTIMAL ANGLE FOR MAX RANGE
# ==========================================

print("\\n" + "="*40)
print("OPTIMAL LAUNCH ANGLE")
print("="*40)

angles = np.linspace(0, 90, 91)
ranges = []

for ang in angles:
    ang_rad = np.radians(ang)
    vx_temp = v0 * np.cos(ang_rad)
    vy_temp = v0 * np.sin(ang_rad)
    
    disc = vy_temp**2 + 2*g*h0
    if disc >= 0:
        t_temp = (vy_temp + np.sqrt(disc)) / g
        r_temp = vx_temp * t_temp
        ranges.append(r_temp)
    else:
        ranges.append(0)

max_range_idx = np.argmax(ranges)
optimal_angle = angles[max_range_idx]
max_range = ranges[max_range_idx]

print(f"For v0 = {v0} m/s and h0 = {h0} m:")
print(f"Optimal angle: {optimal_angle:.1f}°")
print(f"Maximum range: {max_range:.2f} m")
print(f"\\nNote: For h0 = 0, optimal angle is 45°")`,

    javascript: `// Projectile Motion Simulation

// ==========================================
// PARAMETERS
// ==========================================

const v0 = 25.0;        // Initial velocity (m/s)
const angle = 45.0;     // Launch angle (degrees)
const h0 = 0.0;         // Initial height (m)
const g = 9.81;         // Gravitational acceleration (m/s²)

// Convert angle to radians
const angleRad = (angle * Math.PI) / 180;

// Velocity components
const vx = v0 * Math.cos(angleRad);  // Horizontal component
const vy = v0 * Math.sin(angleRad);  // Vertical component

console.log(\`Initial velocity: \${v0} m/s at \${angle}°\`);
console.log(\`Horizontal velocity: \${vx.toFixed(2)} m/s\`);
console.log(\`Vertical velocity: \${vy.toFixed(2)} m/s\`);

// ==========================================
// CALCULATE KEY VALUES
// ==========================================

// Time of flight (when y = 0)
const discriminant = vy ** 2 + 2 * g * h0;
const tFlight = discriminant >= 0 
  ? (vy + Math.sqrt(discriminant)) / g 
  : 0;

// Maximum height
const tMaxHeight = vy / g;
const maxHeight = h0 + vy * tMaxHeight - 0.5 * g * tMaxHeight ** 2;

// Range
const range = vx * tFlight;

console.log(\`\\nTime of flight: \${tFlight.toFixed(2)} s\`);
console.log(\`Maximum height: \${maxHeight.toFixed(2)} m\`);
console.log(\`Range: \${range.toFixed(2)} m\`);

// ==========================================
// SIMULATE TRAJECTORY
// ==========================================

function simulateTrajectory(dt = 0.01) {
  const trajectory = [];
  
  for (let t = 0; t <= tFlight; t += dt) {
    const x = vx * t;
    const y = h0 + vy * t - 0.5 * g * t ** 2;
    
    if (y >= 0) {
      trajectory.push({ t, x, y });
    }
  }
  
  return trajectory;
}

const trajectory = simulateTrajectory();
console.log(\`\\nSimulated \${trajectory.length} trajectory points\`);

// ==========================================
// ANALYZE SPECIFIC TIME POINT
// ==========================================

function analyzeTime(t) {
  const x = vx * t;
  const y = h0 + vy * t - 0.5 * g * t ** 2;
  
  const vxT = vx;  // Constant
  const vyT = vy - g * t;
  
  const speed = Math.sqrt(vxT ** 2 + vyT ** 2);
  const angleT = (Math.atan2(vyT, vxT) * 180) / Math.PI;
  
  console.log(\`\\n--- Time t = \${t.toFixed(2)} s ---\`);
  console.log(\`Position: (\${x.toFixed(2)}, \${y.toFixed(2)}) m\`);
  console.log(\`Velocity: (\${vxT.toFixed(2)}, \${vyT.toFixed(2)}) m/s\`);
  console.log(\`Speed: \${speed.toFixed(2)} m/s\`);
  console.log(\`Angle: \${angleT.toFixed(1)}°\`);
  
  return { x, y, vx: vxT, vy: vyT, speed, angle: angleT };
}

console.log("\\n" + "=".repeat(40));
console.log("TRAJECTORY ANALYSIS");
console.log("=".repeat(40));

analyzeTime(0);           // Launch
analyzeTime(tMaxHeight);  // Apex
analyzeTime(tFlight);     // Landing

// ==========================================
// ENERGY ANALYSIS
// ==========================================

function calculateEnergy(t, mass = 1.0) {
  const y = h0 + vy * t - 0.5 * g * t ** 2;
  const vyT = vy - g * t;
  
  const KE = 0.5 * mass * (vx ** 2 + vyT ** 2);
  const PE = mass * g * y;
  const totalE = KE + PE;
  
  return { KE, PE, totalE };
}

console.log("\\n" + "=".repeat(40));
console.log("ENERGY CONSERVATION (m = 1 kg)");
console.log("=".repeat(40));

[0, tMaxHeight, tFlight].forEach(t => {
  const { KE, PE, totalE } = calculateEnergy(t);
  console.log(\`\\nt = \${t.toFixed(2)} s:\`);
  console.log(\`  KE = \${KE.toFixed(2)} J\`);
  console.log(\`  PE = \${PE.toFixed(2)} J\`);
  console.log(\`  Total = \${totalE.toFixed(2)} J\`);
});

// ==========================================
// CANVAS VISUALIZATION
// ==========================================

function drawTrajectory(canvas) {
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  
  // Clear canvas
  ctx.clearRect(0, 0, width, height);
  
  // Scaling
  const padding = 40;
  const scaleX = (width - 2 * padding) / range;
  const scaleY = (height - 2 * padding) / maxHeight;
  
  const toX = (x) => padding + x * scaleX;
  const toY = (y) => height - padding - y * scaleY;
  
  // Draw trajectory
  ctx.strokeStyle = '#3b82f6';
  ctx.lineWidth = 2;
  ctx.beginPath();
  
  trajectory.forEach((point, i) => {
    if (i === 0) {
      ctx.moveTo(toX(point.x), toY(point.y));
    } else {
      ctx.lineTo(toX(point.x), toY(point.y));
    }
  });
  
  ctx.stroke();
  
  // Mark launch and landing points
  ctx.fillStyle = '#10b981';
  ctx.beginPath();
  ctx.arc(toX(0), toY(h0), 6, 0, 2 * Math.PI);
  ctx.fill();
  
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.arc(toX(range), toY(0), 6, 0, 2 * Math.PI);
  ctx.fill();
}

// ==========================================
// OPTIMAL ANGLE
// ==========================================

function findOptimalAngle() {
  let maxRange = 0;
  let optimalAngle = 0;
  
  for (let ang = 0; ang <= 90; ang++) {
    const angRad = (ang * Math.PI) / 180;
    const vxTemp = v0 * Math.cos(angRad);
    const vyTemp = v0 * Math.sin(angRad);
    
    const disc = vyTemp ** 2 + 2 * g * h0;
    if (disc >= 0) {
      const tTemp = (vyTemp + Math.sqrt(disc)) / g;
      const rTemp = vxTemp * tTemp;
      
      if (rTemp > maxRange) {
        maxRange = rTemp;
        optimalAngle = ang;
      }
    }
  }
  
  return { optimalAngle, maxRange };
}

const optimal = findOptimalAngle();
console.log("\\n" + "=".repeat(40));
console.log("OPTIMAL LAUNCH ANGLE");
console.log("=".repeat(40));
console.log(\`Optimal angle: \${optimal.optimalAngle}°\`);
console.log(\`Maximum range: \${optimal.maxRange.toFixed(2)} m\`);`,

    equations: `PROJECTILE MOTION EQUATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━

Projectile motion describes the path of an object thrown 
or projected into the air, subject only to gravity.


BASIC ASSUMPTIONS
━━━━━━━━━━━━━━━━
• Air resistance is negligible
• Gravity is constant (g = 9.81 m/s²)
• Motion is in 2D (x-y plane)
• Only vertical acceleration (no horizontal)


INITIAL CONDITIONS
━━━━━━━━━━━━━━━━━━

v₀ = initial velocity (m/s)
θ = launch angle (degrees or radians)
h₀ = initial height (m)

Velocity components:
    vₓ = v₀ cos(θ)     (horizontal)
    vᵧ = v₀ sin(θ)     (vertical)


POSITION EQUATIONS
━━━━━━━━━━━━━━━━━━

Horizontal position (constant velocity):
    x(t) = vₓ · t

Vertical position (constant acceleration):
    y(t) = h₀ + vᵧ · t - ½g · t²

Combined trajectory equation (eliminate t):
    y = h₀ + x·tan(θ) - (g·x²)/(2v₀²cos²(θ))

This is a parabola!


VELOCITY EQUATIONS
━━━━━━━━━━━━━━━━━━

Horizontal velocity (constant):
    vₓ(t) = v₀ cos(θ)

Vertical velocity (linear change):
    vᵧ(t) = v₀ sin(θ) - g·t

Total velocity magnitude:
    v(t) = √(vₓ² + vᵧ²)

Velocity angle:
    φ(t) = arctan(vᵧ/vₓ)


KEY CALCULATIONS
━━━━━━━━━━━━━━━━

1. TIME OF FLIGHT (when y = 0)
   ━━━━━━━━━━━━━━━━━━━━━━━━━
   Solve: 0 = h₀ + vᵧ·t - ½g·t²
   
   Using quadratic formula:
   t = (vᵧ ± √(vᵧ² + 2gh₀))/g
   
   Take positive root:
   t_flight = (v₀sin(θ) + √(v₀²sin²(θ) + 2gh₀))/g
   
   Special case (h₀ = 0):
   t_flight = (2v₀sin(θ))/g


2. MAXIMUM HEIGHT
   ━━━━━━━━━━━━━━━
   At apex, vᵧ = 0:
   0 = v₀sin(θ) - g·t_max
   
   t_max = v₀sin(θ)/g
   
   Substitute into y(t):
   h_max = h₀ + (v₀²sin²(θ))/(2g)


3. RANGE (horizontal distance)
   ━━━━━━━━━━━━━━━━━━━━━━━━━━
   R = vₓ · t_flight
   R = v₀cos(θ) · t_flight
   
   Special case (h₀ = 0):
   R = (v₀²sin(2θ))/g
   
   Maximum range at θ = 45° (when h₀ = 0)


ENERGY CONSERVATION
━━━━━━━━━━━━━━━━━━━

Initial energy:
    E₀ = ½mv₀² + mgh₀

At time t:
    KE = ½m(vₓ² + vᵧ²)
    PE = mgy(t)
    Total = KE + PE = E₀ (conserved)


WORKED EXAMPLE
━━━━━━━━━━━━━━

Given:
    v₀ = 20 m/s
    θ = 30°
    h₀ = 0 m
    g = 9.81 m/s²

Step 1: Velocity components
    vₓ = 20·cos(30°) = 20·(√3/2) ≈ 17.32 m/s
    vᵧ = 20·sin(30°) = 20·(1/2) = 10 m/s

Step 2: Time of flight
    t = 2vᵧ/g = 2(10)/9.81 ≈ 2.04 s

Step 3: Maximum height
    h_max = vᵧ²/(2g) = 100/(2·9.81) ≈ 5.10 m

Step 4: Range
    R = vₓ·t = 17.32·2.04 ≈ 35.3 m

Alternatively:
    R = v₀²sin(2θ)/g
      = 400·sin(60°)/9.81
      = 400·(√3/2)/9.81
      ≈ 35.3 m ✓


SPECIAL ANGLES
━━━━━━━━━━━━━━

θ = 0°:   Horizontal launch
          - No initial vertical velocity
          - Minimal range for given v₀

θ = 45°:  Optimal for max range (h₀ = 0)
          - vₓ = vᵧ
          - R_max = v₀²/g

θ = 90°:  Vertical launch
          - No horizontal motion
          - Maximum height for given v₀


COMPLEMENTARY ANGLES
━━━━━━━━━━━━━━━━━━━━

Angles θ and (90° - θ) give same range when h₀ = 0:
    Range(θ) = Range(90° - θ)

Examples:
    30° and 60° → same range
    20° and 70° → same range
    
But different trajectories:
    • Lower angle: flatter, faster, less time
    • Higher angle: higher peak, slower, more time


REALISTIC CONSIDERATIONS
━━━━━━━━━━━━━━━━━━━━━━━

Our equations ignore:
1. Air resistance (drag)
   - Reduces range and max height
   - Terminal velocity limits speed

2. Wind effects
   - Horizontal: changes range
   - Vertical: affects trajectory

3. Spin (Magnus effect)
   - Curves trajectory
   - Important in sports

4. Earth's rotation (Coriolis)
   - Significant for long-range projectiles

5. Varying gravity
   - Changes with altitude
   - Only matters at extreme heights`
  };

  return (
    <div className="min-h-screen bg-white pt-28">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="mb-8 text-sm">
          <ol className="flex items-center gap-2 text-gray-500">
            <li><Link href="/" className="hover:text-gray-900">Home</Link></li>
            <li>/</li>
            <li><Link href="/physics-visualizer" className="hover:text-gray-900">Physics Visualizer</Link></li>
            <li>/</li>
            <li><Link href="/physics-visualizer/mechanics" className="hover:text-gray-900">Mechanics</Link></li>
            <li>/</li>
            <li className="text-gray-900 font-medium">Projectile Motion</li>
          </ol>
        </nav>

        <article className="space-y-8">
          <header className="space-y-4 pb-8 border-b border-gray-200">
            <div className="flex items-center gap-2 text-sm">
              <span className="px-2 py-1 bg-gray-200 text-gray-900 rounded font-medium">Mechanics</span>
              <span className="text-gray-400">•</span>
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded font-medium">Beginner</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              Projectile Motion
            </h1>
            
            <p className="text-xl text-gray-600 leading-relaxed">
              Explore 2D motion under gravity. Launch projectiles at different angles and velocities to understand parabolic trajectories, range, and time of flight.
            </p>
          </header>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">What is Projectile Motion?</h2>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 space-y-4">
              <p className="text-gray-700">
                <strong>Projectile motion</strong> describes the motion of an object thrown or projected into the air, 
                subject only to the acceleration of gravity. The object is called a projectile, and its path is called its trajectory.
              </p>
              
              <div className="space-y-2">
                <p className="font-semibold text-gray-900">Key Characteristics:</p>
                <ul className="space-y-1 text-gray-700 list-disc list-inside">
                  <li><strong>Horizontal motion:</strong> Constant velocity (no acceleration)</li>
                  <li><strong>Vertical motion:</strong> Constant acceleration due to gravity (g = 9.81 m/s²)</li>
                  <li><strong>Independence:</strong> Horizontal and vertical motions are independent</li>
                  <li><strong>Trajectory:</strong> Forms a parabolic path</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Interactive Simulation</h2>
            <p className="text-gray-600">
              Adjust the initial velocity, launch angle, and height. Watch the projectile follow its parabolic path 
              and see velocity vectors change in real-time.
            </p>
            <ProjectileMotionVisualizer />
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Understanding the Physics</h2>
            <div className="space-y-4">
              <div className="bg-gray-100 border-l-4 border-gray-900 p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Velocity Components</h3>
                <p className="text-sm text-gray-900 mb-2">
                  The initial velocity can be broken into horizontal (v<sub>x</sub>) and vertical (v<sub>y</sub>) components:
                </p>
                <div className="bg-white p-3 rounded border border-gray-300 font-mono text-sm space-y-1">
                  <div>v<sub>x</sub> = v<sub>0</sub> cos(θ)  <span className="text-gray-600">(constant)</span></div>
                  <div>v<sub>y</sub> = v<sub>0</sub> sin(θ) - gt  <span className="text-gray-600">(decreases with time)</span></div>
                </div>
              </div>

              <div className="bg-gray-100 border-l-4 border-gray-900 p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Position Equations</h3>
                <p className="text-sm text-gray-900 mb-2">
                  The position at any time t is given by:
                </p>
                <div className="bg-white p-3 rounded border border-gray-300 font-mono text-sm space-y-1">
                  <div>x(t) = v<sub>x</sub> · t</div>
                  <div>y(t) = h<sub>0</sub> + v<sub>y</sub> · t - ½gt²</div>
                </div>
              </div>

              <div className="bg-green-50 border-l-4 border-green-500 p-4">
                <h3 className="font-semibold text-green-900 mb-2">Optimal Angle</h3>
                <p className="text-sm text-green-800">
                  For maximum range on level ground (h<sub>0</sub> = 0), the optimal launch angle is <strong>45°</strong>. 
                  At this angle, the horizontal and vertical components are equal, maximizing the distance traveled.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Implementation</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedLanguage('python')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    selectedLanguage === 'python'
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Python
                </button>
                <button
                  onClick={() => setSelectedLanguage('javascript')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    selectedLanguage === 'javascript'
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  JavaScript
                </button>
                <button
                  onClick={() => setSelectedLanguage('equations')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    selectedLanguage === 'equations'
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Equations
                </button>
              </div>
            </div>

            <div className="bg-gray-900 rounded-lg overflow-hidden">
              <div className="px-4 py-3 bg-gray-800 border-b border-gray-700 flex items-center justify-between">
                <span className="text-sm text-gray-300 font-medium">
                  {selectedLanguage === 'equations' ? 'Physics Equations' : selectedLanguage === 'python' ? 'projectile.py' : 'projectile.js'}
                </span>
              </div>
              <pre className="p-4 overflow-x-auto max-h-[600px]">
                <code className="text-sm text-gray-100 whitespace-pre-wrap break-words">
                  {codeExamples[selectedLanguage]}
                </code>
              </pre>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Real-World Applications</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-100 border border-gray-300 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">🏀 Sports</h3>
                <p className="text-gray-900 text-sm">
                  Basketball shots, football passes, golf swings - all follow projectile motion
                </p>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-900 mb-2">💧 Water Fountains</h3>
                <p className="text-green-800 text-sm">
                  Water jets form parabolic arcs based on nozzle angle and pressure
                </p>
              </div>

              <div className="bg-gray-100 border border-gray-300 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">🚀 Ballistics</h3>
                <p className="text-gray-900 text-sm">
                  Artillery shells and rockets follow projectile paths (ignoring air resistance)
                </p>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h3 className="font-semibold text-orange-900 mb-2">🎮 Game Physics</h3>
                <p className="text-orange-800 text-sm">
                  Video games simulate projectile motion for realistic object throwing
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Related Topics</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="border border-gray-200 rounded-lg p-4 hover:border-gray-400 transition-colors opacity-60 cursor-not-allowed">
                <h3 className="font-semibold text-gray-700 mb-1 flex items-center justify-between">
                  Newton's Laws
                  <span className="text-xs text-gray-500">Coming Soon</span>
                </h3>
                <p className="text-sm text-gray-500">Understand forces and motion principles</p>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4 hover:border-gray-400 transition-colors opacity-60 cursor-not-allowed">
                <h3 className="font-semibold text-gray-700 mb-1 flex items-center justify-between">
                  Energy Conservation
                  <span className="text-xs text-gray-500">Coming Soon</span>
                </h3>
                <p className="text-sm text-gray-500">Track kinetic and potential energy transformations</p>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4 hover:border-gray-400 transition-colors opacity-60 cursor-not-allowed">
                <h3 className="font-semibold text-gray-700 mb-1 flex items-center justify-between">
                  Air Resistance
                  <span className="text-xs text-gray-500">Coming Soon</span>
                </h3>
                <p className="text-sm text-gray-500">See how drag affects trajectory</p>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4 hover:border-gray-400 transition-colors opacity-60 cursor-not-allowed">
                <h3 className="font-semibold text-gray-700 mb-1 flex items-center justify-between">
                  Collisions
                  <span className="text-xs text-gray-500">Coming Soon</span>
                </h3>
                <p className="text-sm text-gray-500">Analyze momentum and energy in collisions</p>
              </div>
            </div>
          </section>

          <section className="pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Discussion</h2>
            <GiscusComments />
          </section>
        </article>
      </div>
    </div>
  );
}
