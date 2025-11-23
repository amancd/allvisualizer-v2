'use client';

import { useState, useRef, useEffect } from 'react';

interface Charge {
  id: number;
  x: number;
  y: number;
  charge: number;
}

export default function ElectricFieldLinesVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [charges, setCharges] = useState<Charge[]>([
    { id: 1, x: 200, y: 250, charge: 1 },
    { id: 2, x: 400, y: 250, charge: -1 }
  ]);
  const [showFieldLines, setShowFieldLines] = useState(true);
  const [showVectors, setShowVectors] = useState(false);
  const [selectedCharge, setSelectedCharge] = useState<number | null>(null);
  const [nextId, setNextId] = useState(3);
  
  const canvasWidth = 600;
  const canvasHeight = 500;
  const k = 8.99; // Simplified Coulomb's constant for visualization

  useEffect(() => {
    drawField();
  }, [charges, showFieldLines, showVectors]);

  const getElectricField = (x: number, y: number): { ex: number; ey: number; magnitude: number } => {
    let ex = 0;
    let ey = 0;

    charges.forEach(charge => {
      const dx = x - charge.x;
      const dy = y - charge.y;
      const distSq = dx * dx + dy * dy;
      const dist = Math.sqrt(distSq);

      if (dist > 5) { // Avoid singularity at charge location
        const fieldMag = (k * charge.charge) / distSq;
        ex += fieldMag * (dx / dist);
        ey += fieldMag * (dy / dist);
      }
    });

    const magnitude = Math.sqrt(ex * ex + ey * ey);
    return { ex, ey, magnitude };
  };

  const drawFieldLine = (
    ctx: CanvasRenderingContext2D,
    startX: number,
    startY: number,
    direction: number
  ) => {
    const maxSteps = 500;
    const stepSize = 2;
    let x = startX;
    let y = startY;

    ctx.beginPath();
    ctx.moveTo(x, y);

    for (let i = 0; i < maxSteps; i++) {
      const field = getElectricField(x, y);
      
      if (field.magnitude < 0.1) break;
      
      // Normalize and scale
      const nx = (field.ex / field.magnitude) * stepSize * direction;
      const ny = (field.ey / field.magnitude) * stepSize * direction;
      
      x += nx;
      y += ny;

      // Check bounds
      if (x < 0 || x > canvasWidth || y < 0 || y > canvasHeight) break;

      // Check if near any charge
      let nearCharge = false;
      for (const charge of charges) {
        const dist = Math.sqrt((x - charge.x) ** 2 + (y - charge.y) ** 2);
        if (dist < 15) {
          nearCharge = true;
          break;
        }
      }
      if (nearCharge) break;

      ctx.lineTo(x, y);
    }

    ctx.stroke();
  };

  const drawField = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Draw field lines
    if (showFieldLines) {
      charges.forEach(charge => {
        if (charge.charge > 0) {
          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = 1;
          
          // Draw lines emanating from positive charge
          const numLines = 16;
          for (let i = 0; i < numLines; i++) {
            const angle = (i / numLines) * 2 * Math.PI;
            const startX = charge.x + Math.cos(angle) * 15;
            const startY = charge.y + Math.sin(angle) * 15;
            drawFieldLine(ctx, startX, startY, 1);
          }
        }
      });
    }

    // Draw field vectors
    if (showVectors) {
      const gridSize = 40;
      ctx.strokeStyle = '#3b82f6';
      ctx.fillStyle = '#3b82f6';
      ctx.lineWidth = 1.5;

      for (let x = gridSize; x < canvasWidth; x += gridSize) {
        for (let y = gridSize; y < canvasHeight; y += gridSize) {
          // Skip if too close to a charge
          let tooClose = false;
          for (const charge of charges) {
            const dist = Math.sqrt((x - charge.x) ** 2 + (y - charge.y) ** 2);
            if (dist < 30) {
              tooClose = true;
              break;
            }
          }
          if (tooClose) continue;

          const field = getElectricField(x, y);
          if (field.magnitude > 0.1) {
            const scale = Math.min(15 / field.magnitude, 15);
            const ex = (field.ex / field.magnitude) * scale;
            const ey = (field.ey / field.magnitude) * scale;

            // Draw arrow
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + ex, y + ey);
            ctx.stroke();

            // Arrow head
            const angle = Math.atan2(ey, ex);
            ctx.beginPath();
            ctx.moveTo(x + ex, y + ey);
            ctx.lineTo(
              x + ex - 5 * Math.cos(angle - Math.PI / 6),
              y + ey - 5 * Math.sin(angle - Math.PI / 6)
            );
            ctx.lineTo(
              x + ex - 5 * Math.cos(angle + Math.PI / 6),
              y + ey - 5 * Math.sin(angle + Math.PI / 6)
            );
            ctx.lineTo(x + ex, y + ey);
            ctx.fill();
          }
        }
      }
    }

    // Draw charges
    charges.forEach(charge => {
      ctx.beginPath();
      ctx.arc(charge.x, charge.y, 12, 0, 2 * Math.PI);
      ctx.fillStyle = charge.charge > 0 ? '#ef4444' : '#3b82f6';
      ctx.fill();
      ctx.strokeStyle = charge.charge > 0 ? '#b91c1c' : '#1d4ed8';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw + or - sign
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(charge.charge > 0 ? '+' : '−', charge.x, charge.y);
    });
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if clicking on existing charge
    for (const charge of charges) {
      const dist = Math.sqrt((x - charge.x) ** 2 + (y - charge.y) ** 2);
      if (dist < 12) {
        setSelectedCharge(charge.id);
        return;
      }
    }

    setSelectedCharge(null);
  };

  const addCharge = (chargeValue: number) => {
    const newCharge: Charge = {
      id: nextId,
      x: canvasWidth / 2,
      y: canvasHeight / 2,
      charge: chargeValue
    };
    setCharges([...charges, newCharge]);
    setNextId(nextId + 1);
  };

  const removeSelectedCharge = () => {
    if (selectedCharge !== null) {
      setCharges(charges.filter(c => c.id !== selectedCharge));
      setSelectedCharge(null);
    }
  };

  const clearAllCharges = () => {
    setCharges([]);
    setSelectedCharge(null);
  };

  const resetToDefault = () => {
    setCharges([
      { id: 1, x: 200, y: 250, charge: 1 },
      { id: 2, x: 400, y: 250, charge: -1 }
    ]);
    setNextId(3);
    setSelectedCharge(null);
  };

  return (
    <div className="space-y-6">
      {/* Canvas */}
      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
        <canvas
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          onClick={handleCanvasClick}
          className="border border-gray-300 bg-white cursor-crosshair mx-auto block"
        />
      </div>

      {/* Controls */}
      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
        <div className="text-xs font-semibold text-gray-700 mb-3">Controls</div>
        <div className="space-y-4">
          {/* Add Charges */}
          <div>
            <div className="text-sm font-medium text-gray-700 mb-2">Add Charge</div>
            <div className="flex gap-2">
              <button
                onClick={() => addCharge(1)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600"
              >
                + Positive
              </button>
              <button
                onClick={() => addCharge(-1)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600"
              >
                − Negative
              </button>
              <button
                onClick={removeSelectedCharge}
                disabled={selectedCharge === null}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Remove Selected
              </button>
            </div>
          </div>

          {/* Display Options */}
          <div>
            <div className="text-sm font-medium text-gray-700 mb-2">Display Options</div>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showFieldLines}
                  onChange={(e) => setShowFieldLines(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700">Field Lines</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showVectors}
                  onChange={(e) => setShowVectors(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700">Field Vectors</span>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={resetToDefault}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50"
            >
              Reset to Dipole
            </button>
            <button
              onClick={clearAllCharges}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50"
            >
              Clear All
            </button>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="border border-gray-200 rounded-lg p-4 bg-blue-50">
        <div className="text-sm text-blue-900">
          <p className="font-medium mb-2">💡 How to Use:</p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Add positive (+) or negative (−) charges to the canvas</li>
            <li>Click on charges to select them, then remove if desired</li>
            <li>Toggle field lines to see electric field direction</li>
            <li>Toggle vectors to see field strength and direction at grid points</li>
            <li>Field lines point away from + charges and toward − charges</li>
          </ul>
        </div>
      </div>

      {/* Charge List */}
      {charges.length > 0 && (
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <div className="text-xs font-semibold text-gray-700 mb-2">Current Charges ({charges.length})</div>
          <div className="grid grid-cols-2 gap-2">
            {charges.map(charge => (
              <div
                key={charge.id}
                className={`p-2 rounded border ${
                  selectedCharge === charge.id
                    ? 'border-gray-600 bg-white'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    Charge {charge.id}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                    charge.charge > 0
                      ? 'bg-red-100 text-red-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {charge.charge > 0 ? '+' : '−'}{Math.abs(charge.charge)}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Position: ({Math.round(charge.x)}, {Math.round(charge.y)})
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
