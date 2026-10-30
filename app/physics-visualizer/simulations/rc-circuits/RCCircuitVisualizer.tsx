'use client';

import { useState, useRef, useEffect } from 'react';

type CircuitMode = 'charging' | 'discharging' | 'idle';

export default function RCCircuitVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  
  // Circuit parameters
  const [resistance, setResistance] = useState(1000); // Ohms
  const [capacitance, setCapacitance] = useState(100); // microFarads
  const [voltage, setVoltage] = useState(9); // Volts
  
  // Simulation state
  const [mode, setMode] = useState<CircuitMode>('idle');
  const [time, setTime] = useState(0);
  const [currentVoltage, setCurrentVoltage] = useState(0);
  const [currentCharge, setCurrentCharge] = useState(0);
  const [currentCurrent, setCurrentCurrent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Graph data
  const [voltageHistory, setVoltageHistory] = useState<number[]>([]);
  const [currentHistory, setCurrentHistory] = useState<number[]>([]);
  const [timeHistory, setTimeHistory] = useState<number[]>([]);
  
  const canvasWidth = 600;
  const canvasHeight = 400;
  
  // Calculate time constant
  const timeConstant = (resistance * capacitance) / 1000; // Convert μF to seconds
  
  useEffect(() => {
    drawCircuit();
  }, [mode, currentVoltage, currentCurrent, time]);

  useEffect(() => {
    if (isPlaying) {
      const startTime = Date.now();
      const initialTime = time;
      
      const animate = () => {
        const elapsed = (Date.now() - startTime) / 1000; // Convert to seconds
        const newTime = initialTime + elapsed;
        
        let newVoltage, newCurrent, newCharge;
        
        if (mode === 'charging') {
          // Charging equations
          const t = newTime;
          newVoltage = voltage * (1 - Math.exp(-t / timeConstant));
          newCurrent = (voltage / resistance) * Math.exp(-t / timeConstant) * 1000; // Convert to mA
          newCharge = capacitance * newVoltage; // microCoulombs
          
          // Stop when 99.9% charged (5 time constants)
          if (t >= 5 * timeConstant) {
            setIsPlaying(false);
          }
        } else if (mode === 'discharging') {
          // Discharging equations
          const t = newTime;
          const initialVoltage = voltage;
          newVoltage = initialVoltage * Math.exp(-t / timeConstant);
          newCurrent = -(initialVoltage / resistance) * Math.exp(-t / timeConstant) * 1000; // Convert to mA
          newCharge = capacitance * newVoltage; // microCoulombs
          
          // Stop when 99.9% discharged
          if (t >= 5 * timeConstant) {
            setIsPlaying(false);
          }
        } else {
          newVoltage = currentVoltage;
          newCurrent = 0;
          newCharge = currentCharge;
        }
        
        setTime(newTime);
        setCurrentVoltage(newVoltage);
        setCurrentCurrent(newCurrent);
        setCurrentCharge(newCharge);
        
        // Update history for graphs (limit to last 100 points)
        setVoltageHistory(prev => [...prev.slice(-99), newVoltage]);
        setCurrentHistory(prev => [...prev.slice(-99), newCurrent]);
        setTimeHistory(prev => [...prev.slice(-99), newTime]);
        
        if (isPlaying) {
          animationRef.current = requestAnimationFrame(animate);
        }
      };
      
      animationRef.current = requestAnimationFrame(animate);
      
      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }
  }, [isPlaying, mode, voltage, resistance, capacitance, timeConstant]);

  const drawCircuit = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    
    // Circuit dimensions
    const centerX = 300;
    const centerY = 200;
    const circuitWidth = 250;
    const circuitHeight = 150;
    
    // Draw wires
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;
    
    // Top wire
    ctx.beginPath();
    ctx.moveTo(centerX - circuitWidth/2, centerY - circuitHeight/2);
    ctx.lineTo(centerX + circuitWidth/2, centerY - circuitHeight/2);
    ctx.stroke();
    
    // Right wire
    ctx.beginPath();
    ctx.moveTo(centerX + circuitWidth/2, centerY - circuitHeight/2);
    ctx.lineTo(centerX + circuitWidth/2, centerY + circuitHeight/2);
    ctx.stroke();
    
    // Bottom wire
    ctx.beginPath();
    ctx.moveTo(centerX + circuitWidth/2, centerY + circuitHeight/2);
    ctx.lineTo(centerX - circuitWidth/2, centerY + circuitHeight/2);
    ctx.stroke();
    
    // Left wire
    ctx.beginPath();
    ctx.moveTo(centerX - circuitWidth/2, centerY + circuitHeight/2);
    ctx.lineTo(centerX - circuitWidth/2, centerY - circuitHeight/2);
    ctx.stroke();
    
    // Draw Battery (left side)
    const batteryX = centerX - circuitWidth/2;
    const batteryY = centerY;
    
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(batteryX - 15, batteryY - 20);
    ctx.lineTo(batteryX + 15, batteryY - 20);
    ctx.stroke();
    
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(batteryX - 10, batteryY + 20);
    ctx.lineTo(batteryX + 10, batteryY + 20);
    ctx.stroke();
    
    // + and - labels
    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('+', batteryX - 25, batteryY - 15);
    ctx.fillStyle = '#3b82f6';
    ctx.fillText('-', batteryX - 25, batteryY + 25);
    
    // Draw Resistor (top)
    const resistorX = centerX;
    const resistorY = centerY - circuitHeight/2;
    const resistorWidth = 60;
    const resistorHeight = 15;
    
    ctx.strokeStyle = '#ff6b6b';
    ctx.fillStyle = '#ffe0e0';
    ctx.lineWidth = 2;
    ctx.fillRect(resistorX - resistorWidth/2, resistorY - resistorHeight/2, resistorWidth, resistorHeight);
    ctx.strokeRect(resistorX - resistorWidth/2, resistorY - resistorHeight/2, resistorWidth, resistorHeight);
    
    // Resistor label
    ctx.fillStyle = '#000000';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`R = ${resistance}Ω`, resistorX, resistorY - 25);
    
    // Draw Capacitor (right side)
    const capX = centerX + circuitWidth/2;
    const capY = centerY;
    const plateLength = 40;
    const plateGap = 10;
    
    // Capacitor plates
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(capX - plateGap/2, capY - plateLength/2);
    ctx.lineTo(capX - plateGap/2, capY + plateLength/2);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(capX + plateGap/2, capY - plateLength/2);
    ctx.lineTo(capX + plateGap/2, capY + plateLength/2);
    ctx.stroke();
    
    // Charge indication on plates
    if (currentVoltage > 0.1) {
      const chargePercentage = currentVoltage / voltage;
      const numCharges = Math.floor(chargePercentage * 5);
      
      ctx.fillStyle = '#ef4444';
      for (let i = 0; i < numCharges; i++) {
        const y = capY - plateLength/2 + 10 + i * 15;
        ctx.beginPath();
        ctx.arc(capX - plateGap/2 - 8, y, 3, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillText('+', capX - plateGap/2 - 8, y + 1);
      }
      
      ctx.fillStyle = '#3b82f6';
      for (let i = 0; i < numCharges; i++) {
        const y = capY - plateLength/2 + 10 + i * 15;
        ctx.beginPath();
        ctx.arc(capX + plateGap/2 + 8, y, 3, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillText('-', capX + plateGap/2 + 8, y + 1);
      }
    }
    
    // Capacitor label
    ctx.fillStyle = '#000000';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`C = ${capacitance}μF`, capX + 50, capY);
    ctx.fillText(`V = ${currentVoltage.toFixed(2)}V`, capX + 50, capY + 15);
    
    // Draw Switch (bottom)
    const switchX = centerX;
    const switchY = centerY + circuitHeight/2;
    
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;
    
    if (mode === 'charging' || mode === 'discharging') {
      // Closed switch
      ctx.beginPath();
      ctx.moveTo(switchX - 20, switchY);
      ctx.lineTo(switchX + 20, switchY);
      ctx.stroke();
      
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(switchX, switchY, 8, 0, 2 * Math.PI);
      ctx.fill();
    } else {
      // Open switch
      ctx.beginPath();
      ctx.moveTo(switchX - 20, switchY);
      ctx.lineTo(switchX - 5, switchY - 10);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(switchX + 5, switchY);
      ctx.lineTo(switchX + 20, switchY);
      ctx.stroke();
      
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(switchX, switchY, 8, 0, 2 * Math.PI);
      ctx.fill();
    }
    
    // Current flow animation
    if (Math.abs(currentCurrent) > 0.01 && isPlaying) {
      const flowSpeed = Math.abs(currentCurrent) / 5;
      const numDots = 8;
      const dotSpacing = (circuitWidth * 2 + circuitHeight * 2) / numDots;
      
      ctx.fillStyle = mode === 'charging' ? '#fbbf24' : '#60a5fa';
      
      for (let i = 0; i < numDots; i++) {
        const offset = ((time * 100 * flowSpeed) % dotSpacing) + i * dotSpacing;
        let x, y;
        
        const totalPerimeter = circuitWidth * 2 + circuitHeight * 2;
        const pos = offset % totalPerimeter;
        
        if (mode === 'charging') {
          // Clockwise flow
          if (pos < circuitWidth) {
            x = centerX - circuitWidth/2 + pos;
            y = centerY - circuitHeight/2;
          } else if (pos < circuitWidth + circuitHeight) {
            x = centerX + circuitWidth/2;
            y = centerY - circuitHeight/2 + (pos - circuitWidth);
          } else if (pos < circuitWidth * 2 + circuitHeight) {
            x = centerX + circuitWidth/2 - (pos - circuitWidth - circuitHeight);
            y = centerY + circuitHeight/2;
          } else {
            x = centerX - circuitWidth/2;
            y = centerY + circuitHeight/2 - (pos - circuitWidth * 2 - circuitHeight);
          }
        } else {
          // Counter-clockwise flow
          if (pos < circuitWidth) {
            x = centerX + circuitWidth/2 - pos;
            y = centerY + circuitHeight/2;
          } else if (pos < circuitWidth + circuitHeight) {
            x = centerX - circuitWidth/2;
            y = centerY + circuitHeight/2 - (pos - circuitWidth);
          } else if (pos < circuitWidth * 2 + circuitHeight) {
            x = centerX - circuitWidth/2 + (pos - circuitWidth - circuitHeight);
            y = centerY - circuitHeight/2;
          } else {
            x = centerX + circuitWidth/2;
            y = centerY - circuitHeight/2 + (pos - circuitWidth * 2 - circuitHeight);
          }
        }
        
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fill();
      }
    }
  };

  const startCharging = () => {
    setMode('charging');
    setTime(0);
    setCurrentVoltage(0);
    setCurrentCharge(0);
    setCurrentCurrent(0);
    setVoltageHistory([]);
    setCurrentHistory([]);
    setTimeHistory([]);
    setIsPlaying(true);
  };

  const startDischarging = () => {
    setMode('discharging');
    setTime(0);
    setCurrentVoltage(voltage);
    setCurrentCharge(capacitance * voltage);
    setCurrentCurrent(0);
    setVoltageHistory([]);
    setCurrentHistory([]);
    setTimeHistory([]);
    setIsPlaying(true);
  };

  const reset = () => {
    setMode('idle');
    setTime(0);
    setCurrentVoltage(0);
    setCurrentCharge(0);
    setCurrentCurrent(0);
    setIsPlaying(false);
    setVoltageHistory([]);
    setCurrentHistory([]);
    setTimeHistory([]);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const energy = 0.5 * capacitance * currentVoltage * currentVoltage; // micro-Joules

  return (
    <div className="space-y-6">
      {/* Circuit Canvas */}
      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
        <div className="text-xs font-semibold text-gray-700 mb-3">RC Circuit Diagram</div>
        <canvas
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          className="border border-gray-300 bg-white mx-auto block"
        />
      </div>

      {/* Controls */}
      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
        <div className="text-xs font-semibold text-gray-700 mb-3">Circuit Parameters</div>
        <div className="grid sm:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Voltage (V): {voltage}V
            </label>
            <input
              type="range"
              min="3"
              max="12"
              step="1"
              value={voltage}
              onChange={(e) => setVoltage(Number(e.target.value))}
              disabled={isPlaying}
              className="w-full"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Resistance (Ω): {resistance}Ω
            </label>
            <input
              type="range"
              min="100"
              max="10000"
              step="100"
              value={resistance}
              onChange={(e) => setResistance(Number(e.target.value))}
              disabled={isPlaying}
              className="w-full"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Capacitance (μF): {capacitance}μF
            </label>
            <input
              type="range"
              min="10"
              max="1000"
              step="10"
              value={capacitance}
              onChange={(e) => setCapacitance(Number(e.target.value))}
              disabled={isPlaying}
              className="w-full"
            />
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={startCharging}
            disabled={isPlaying && mode === 'charging'}
            className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 disabled:opacity-50"
          >
            Start Charging
          </button>
          <button
            onClick={startDischarging}
            disabled={isPlaying && mode === 'discharging'}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 disabled:opacity-50"
          >
            Start Discharging
          </button>
          <button
            onClick={togglePlayPause}
            disabled={mode === 'idle'}
            className="px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600 disabled:opacity-50"
          >
            {isPlaying ? 'Pause' : 'Resume'}
          </button>
          <button
            onClick={reset}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-100"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Real-time Values */}
      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
        <div className="text-xs font-semibold text-gray-700 mb-3">Real-Time Measurements</div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <div className="text-xs text-gray-600 font-medium">Time</div>
            <div className="text-lg font-bold text-purple-600">{time.toFixed(3)}s</div>
            <div className="text-xs text-gray-500">τ = {timeConstant.toFixed(3)}s</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <div className="text-xs text-gray-600 font-medium">Voltage</div>
            <div className="text-lg font-bold text-green-600">{currentVoltage.toFixed(2)}V</div>
            <div className="text-xs text-gray-500">{((currentVoltage/voltage)*100).toFixed(1)}% of max</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <div className="text-xs text-gray-600 font-medium">Current</div>
            <div className="text-lg font-bold text-blue-600">{currentCurrent.toFixed(2)}mA</div>
            <div className="text-xs text-gray-500">{mode === 'idle' ? 'Idle' : mode === 'charging' ? 'Charging' : 'Discharging'}</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <div className="text-xs text-gray-600 font-medium">Energy</div>
            <div className="text-lg font-bold text-orange-600">{energy.toFixed(2)}μJ</div>
            <div className="text-xs text-gray-500">Stored</div>
          </div>
        </div>
      </div>

      {/* Graphs */}
      {voltageHistory.length > 1 && (
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <div className="text-xs font-semibold text-gray-700 mb-3">Graphs</div>
          <div className="grid sm:grid-cols-2 gap-4">
            {/* Voltage Graph */}
            <div className="bg-white border border-gray-200 rounded p-3">
              <div className="text-sm font-medium text-gray-700 mb-2">Voltage vs Time</div>
              <svg width="250" height="150" className="mx-auto">
                <polyline
                  points={voltageHistory.map((v, i) => {
                    const x = (i / voltageHistory.length) * 240 + 5;
                    const y = 140 - (v / voltage) * 130;
                    return `${x},${y}`;
                  }).join(' ')}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2"
                />
                <line x1="5" y1="10" x2="5" y2="140" stroke="#666" strokeWidth="1" />
                <line x1="5" y1="140" x2="245" y2="140" stroke="#666" strokeWidth="1" />
                <text x="125" y="155" fontSize="10" textAnchor="middle" fill="#666">Time</text>
                <text x="-70" y="8" fontSize="10" textAnchor="middle" fill="#666" transform="rotate(-90)">Voltage (V)</text>
              </svg>
            </div>

            {/* Current Graph */}
            <div className="bg-white border border-gray-200 rounded p-3">
              <div className="text-sm font-medium text-gray-700 mb-2">Current vs Time</div>
              <svg width="250" height="150" className="mx-auto">
                <polyline
                  points={currentHistory.map((c, i) => {
                    const x = (i / currentHistory.length) * 240 + 5;
                    const maxCurrent = Math.max(...currentHistory.map(Math.abs));
                    const y = 75 - (c / maxCurrent) * 60;
                    return `${x},${y}`;
                  }).join(' ')}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2"
                />
                <line x1="5" y1="10" x2="5" y2="140" stroke="#666" strokeWidth="1" />
                <line x1="5" y1="75" x2="245" y2="75" stroke="#999" strokeWidth="1" strokeDasharray="2,2" />
                <line x1="5" y1="140" x2="245" y2="140" stroke="#666" strokeWidth="1" />
                <text x="125" y="155" fontSize="10" textAnchor="middle" fill="#666">Time</text>
                <text x="-70" y="8" fontSize="10" textAnchor="middle" fill="#666" transform="rotate(-90)">Current (mA)</text>
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* Info */}
      <div className="border border-gray-200 rounded-lg p-4 bg-blue-50">
        <div className="text-sm text-blue-900">
          <p className="font-medium mb-2">💡 How to Use:</p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Adjust voltage, resistance, and capacitance using sliders</li>
            <li>Click "Start Charging" to charge the capacitor</li>
            <li>Click "Start Discharging" to discharge through resistor</li>
            <li>Watch the animated current flow (yellow dots = charging, blue = discharging)</li>
            <li>Observe exponential curves in voltage and current graphs</li>
            <li>Time constant τ = RC determines how fast the process occurs</li>
            <li>After 5τ, the capacitor is ~99% charged/discharged</li>
          </ul>
        </div>
      </div>

      {/* Time Constant Markers */}
      {mode !== 'idle' && (
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <div className="text-xs font-semibold text-gray-700 mb-2">Time Constant Milestones</div>
          <div className="grid grid-cols-5 gap-2 text-center text-xs">
            {[1, 2, 3, 4, 5].map(n => (
              <div key={n} className={`p-2 rounded ${time >= n * timeConstant ? 'bg-green-100 border border-green-300' : 'bg-white border border-gray-200'}`}>
                <div className="font-medium">{n}τ</div>
                <div className="text-gray-600">{(n * timeConstant).toFixed(2)}s</div>
                <div className="text-gray-500">{n === 1 ? '63.2%' : n === 2 ? '86.5%' : n === 3 ? '95%' : n === 4 ? '98.2%' : '99.3%'}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
