'use client';

import { useState, useRef, useEffect } from 'react';

type SourceType = 'wire' | 'loop' | 'dipole';

interface MagneticSource {
  id: number;
  type: SourceType;
  x: number;
  y: number;
  current: number; // Current magnitude (positive or negative for direction)
  rotation: number; // For dipoles (0-360 degrees)
}

export default function MagneticFieldVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [sources, setSources] = useState<MagneticSource[]>([
    { id: 1, type: 'wire', x: 200, y: 250, current: 1, rotation: 0 },
    { id: 2, type: 'wire', x: 400, y: 250, current: -1, rotation: 0 }
  ]);
  const [showFieldLines, setShowFieldLines] = useState(true);
  const [showVectors, setShowVectors] = useState(false);
  const [selectedSource, setSelectedSource] = useState<number | null>(null);
  const [nextId, setNextId] = useState(3);
  
  const canvasWidth = 600;
  const canvasHeight = 500;
  const mu0 = 1; // Simplified permeability constant for visualization

  useEffect(() => {
    drawField();
  }, [sources, showFieldLines, showVectors]);

  const getMagneticField = (x: number, y: number): { bx: number; by: number; magnitude: number } => {
    let bx = 0;
    let by = 0;

    sources.forEach(source => {
      const dx = x - source.x;
      const dy = y - source.y;
      const distSq = dx * dx + dy * dy;
      const dist = Math.sqrt(distSq);

      if (dist > 5) {
        if (source.type === 'wire') {
          // Circular field around wire (into or out of page effect shown as circulation)
          // B = (μ₀ I) / (2π r), direction perpendicular to radius
          const fieldMag = (mu0 * Math.abs(source.current)) / (2 * Math.PI * dist);
          const sign = source.current > 0 ? 1 : -1;
          
          // Perpendicular direction (right-hand rule)
          bx += sign * fieldMag * (-dy / dist);
          by += sign * fieldMag * (dx / dist);
          
        } else if (source.type === 'loop') {
          // Simplified current loop - creates dipole-like field
          const r = 30; // Loop radius
          if (dist > r) {
            // Approximate as magnetic dipole
            const m = source.current * Math.PI * r * r; // Magnetic moment
            const cosTheta = dy / dist;
            const sinTheta = dx / dist;
            
            // Dipole field components
            const fieldMag = (mu0 * m) / (dist * dist * dist);
            bx += fieldMag * 3 * cosTheta * sinTheta;
            by += fieldMag * (3 * cosTheta * cosTheta - 1);
          }
          
        } else if (source.type === 'dipole') {
          // Bar magnet / magnetic dipole
          const angle = (source.rotation * Math.PI) / 180;
          const mx = Math.cos(angle);
          const my = Math.sin(angle);
          
          // Magnetic dipole field
          const m = source.current * 500; // Magnetic moment
          const r3 = dist * dist * dist;
          
          const dotProduct = (dx * mx + dy * my);
          bx += (mu0 / (4 * Math.PI)) * (3 * dotProduct * dx / (r3 * dist * dist) - mx / r3);
          by += (mu0 / (4 * Math.PI)) * (3 * dotProduct * dy / (r3 * dist * dist) - my / r3);
        }
      }
    });

    const magnitude = Math.sqrt(bx * bx + by * by);
    return { bx, by, magnitude };
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
      const field = getMagneticField(x, y);
      
      if (field.magnitude < 0.05) break;
      
      // Normalize and scale
      const nx = (field.bx / field.magnitude) * stepSize * direction;
      const ny = (field.by / field.magnitude) * stepSize * direction;
      
      x += nx;
      y += ny;

      // Check bounds
      if (x < 0 || x > canvasWidth || y < 0 || y > canvasHeight) break;

      // Check if near any source
      let nearSource = false;
      for (const source of sources) {
        const dist = Math.sqrt((x - source.x) ** 2 + (y - source.y) ** 2);
        const threshold = source.type === 'loop' ? 35 : 15;
        if (dist < threshold) {
          nearSource = true;
          break;
        }
      }
      if (nearSource) break;

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
      ctx.strokeStyle = '#8b5cf6';
      ctx.lineWidth = 1.5;
      
      sources.forEach(source => {
        if (source.type === 'wire') {
          // Draw circular field lines around wire
          const numCircles = 8;
          for (let i = 1; i <= numCircles; i++) {
            const radius = i * 20;
            ctx.beginPath();
            if (source.current > 0) {
              ctx.arc(source.x, source.y, radius, 0, 2 * Math.PI);
            } else {
              ctx.arc(source.x, source.y, radius, 0, 2 * Math.PI);
            }
            ctx.stroke();
            
            // Draw direction arrows
            const angle = Math.PI / 4;
            const arrowX = source.x + radius * Math.cos(angle);
            const arrowY = source.y + radius * Math.sin(angle);
            
            const tangentAngle = angle + (source.current > 0 ? Math.PI / 2 : -Math.PI / 2);
            const arrowSize = 8;
            
            ctx.beginPath();
            ctx.moveTo(arrowX, arrowY);
            ctx.lineTo(
              arrowX - arrowSize * Math.cos(tangentAngle - Math.PI / 6),
              arrowY - arrowSize * Math.sin(tangentAngle - Math.PI / 6)
            );
            ctx.moveTo(arrowX, arrowY);
            ctx.lineTo(
              arrowX - arrowSize * Math.cos(tangentAngle + Math.PI / 6),
              arrowY - arrowSize * Math.sin(tangentAngle + Math.PI / 6)
            );
            ctx.stroke();
          }
        } else if (source.type === 'loop' || source.type === 'dipole') {
          // Draw field lines from poles
          const numLines = 12;
          const angle = source.type === 'dipole' ? (source.rotation * Math.PI) / 180 : Math.PI / 2;
          
          for (let i = 0; i < numLines; i++) {
            const offsetAngle = angle + (i / numLines) * 2 * Math.PI;
            const startRadius = source.type === 'loop' ? 35 : 20;
            const startX = source.x + Math.cos(offsetAngle) * startRadius;
            const startY = source.y + Math.sin(offsetAngle) * startRadius;
            
            // Draw from north pole
            if (Math.cos(offsetAngle - angle) > 0) {
              drawFieldLine(ctx, startX, startY, 1);
            }
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
          // Skip if too close to a source
          let tooClose = false;
          for (const source of sources) {
            const dist = Math.sqrt((x - source.x) ** 2 + (y - source.y) ** 2);
            const threshold = source.type === 'loop' ? 40 : 25;
            if (dist < threshold) {
              tooClose = true;
              break;
            }
          }
          if (tooClose) continue;

          const field = getMagneticField(x, y);
          if (field.magnitude > 0.05) {
            const scale = Math.min(15 / field.magnitude, 15);
            const bx = (field.bx / field.magnitude) * scale;
            const by = (field.by / field.magnitude) * scale;

            // Draw arrow
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + bx, y + by);
            ctx.stroke();

            // Arrow head
            const angle = Math.atan2(by, bx);
            ctx.beginPath();
            ctx.moveTo(x + bx, y + by);
            ctx.lineTo(
              x + bx - 5 * Math.cos(angle - Math.PI / 6),
              y + by - 5 * Math.sin(angle - Math.PI / 6)
            );
            ctx.lineTo(
              x + bx - 5 * Math.cos(angle + Math.PI / 6),
              y + by - 5 * Math.sin(angle + Math.PI / 6)
            );
            ctx.lineTo(x + bx, y + by);
            ctx.fill();
          }
        }
      }
    }

    // Draw sources
    sources.forEach(source => {
      if (source.type === 'wire') {
        // Draw wire (current into/out of page)
        ctx.beginPath();
        ctx.arc(source.x, source.y, 15, 0, 2 * Math.PI);
        ctx.fillStyle = source.current > 0 ? '#f59e0b' : '#06b6d4';
        ctx.fill();
        ctx.strokeStyle = source.current > 0 ? '#d97706' : '#0891b2';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Symbol: dot (out) or cross (in)
        ctx.strokeStyle = '#ffffff';
        ctx.fillStyle = '#ffffff';
        ctx.lineWidth = 2;
        
        if (source.current > 0) {
          // Dot (current out of page)
          ctx.beginPath();
          ctx.arc(source.x, source.y, 3, 0, 2 * Math.PI);
          ctx.fill();
        } else {
          // Cross (current into page)
          ctx.beginPath();
          ctx.moveTo(source.x - 6, source.y - 6);
          ctx.lineTo(source.x + 6, source.y + 6);
          ctx.moveTo(source.x + 6, source.y - 6);
          ctx.lineTo(source.x - 6, source.y + 6);
          ctx.stroke();
        }
        
      } else if (source.type === 'loop') {
        // Draw current loop
        ctx.beginPath();
        ctx.arc(source.x, source.y, 30, 0, 2 * Math.PI);
        ctx.strokeStyle = '#8b5cf6';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // Arrow showing current direction
        const arrowAngle = Math.PI / 4;
        ctx.fillStyle = '#8b5cf6';
        ctx.beginPath();
        const arrowX = source.x + 30 * Math.cos(arrowAngle);
        const arrowY = source.y + 30 * Math.sin(arrowAngle);
        const tangent = arrowAngle + (source.current > 0 ? Math.PI / 2 : -Math.PI / 2);
        
        ctx.moveTo(arrowX, arrowY);
        ctx.lineTo(arrowX - 8 * Math.cos(tangent - 0.3), arrowY - 8 * Math.sin(tangent - 0.3));
        ctx.lineTo(arrowX - 8 * Math.cos(tangent + 0.3), arrowY - 8 * Math.sin(tangent + 0.3));
        ctx.closePath();
        ctx.fill();
        
      } else if (source.type === 'dipole') {
        // Draw bar magnet
        const angle = (source.rotation * Math.PI) / 180;
        const length = 40;
        const width = 20;
        
        ctx.save();
        ctx.translate(source.x, source.y);
        ctx.rotate(angle);
        
        // North pole (red)
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(-length/2, -width/2, length/2, width);
        
        // South pole (blue)
        ctx.fillStyle = '#3b82f6';
        ctx.fillRect(0, -width/2, length/2, width);
        
        // Border
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.strokeRect(-length/2, -width/2, length, width);
        
        // Labels
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('N', -length/4, 0);
        ctx.fillText('S', length/4, 0);
        
        ctx.restore();
      }
    });
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if clicking on existing source
    for (const source of sources) {
      const dist = Math.sqrt((x - source.x) ** 2 + (y - source.y) ** 2);
      const threshold = source.type === 'loop' ? 30 : source.type === 'dipole' ? 25 : 15;
      if (dist < threshold) {
        setSelectedSource(source.id);
        return;
      }
    }

    setSelectedSource(null);
  };

  const addSource = (type: SourceType) => {
    const newSource: MagneticSource = {
      id: nextId,
      type,
      x: canvasWidth / 2,
      y: canvasHeight / 2,
      current: 1,
      rotation: 0
    };
    setSources([...sources, newSource]);
    setNextId(nextId + 1);
  };

  const removeSelectedSource = () => {
    if (selectedSource !== null) {
      setSources(sources.filter(s => s.id !== selectedSource));
      setSelectedSource(null);
    }
  };

  const flipSelectedCurrent = () => {
    if (selectedSource !== null) {
      setSources(sources.map(s => 
        s.id === selectedSource ? { ...s, current: -s.current } : s
      ));
    }
  };

  const rotateSelectedDipole = () => {
    if (selectedSource !== null) {
      setSources(sources.map(s => 
        s.id === selectedSource ? { ...s, rotation: (s.rotation + 45) % 360 } : s
      ));
    }
  };

  const clearAll = () => {
    setSources([]);
    setSelectedSource(null);
  };

  const resetToDefault = () => {
    setSources([
      { id: 1, type: 'wire', x: 200, y: 250, current: 1, rotation: 0 },
      { id: 2, type: 'wire', x: 400, y: 250, current: -1, rotation: 0 }
    ]);
    setNextId(3);
    setSelectedSource(null);
  };

  const selectedSourceData = sources.find(s => s.id === selectedSource);

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
          {/* Add Sources */}
          <div>
            <div className="text-sm font-medium text-gray-700 mb-2">Add Magnetic Source</div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => addSource('wire')}
                className="px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600"
              >
                Current Wire
              </button>
              <button
                onClick={() => addSource('loop')}
                className="px-4 py-2 bg-purple-500 text-white rounded-lg text-sm font-medium hover:bg-purple-600"
              >
                Current Loop
              </button>
              <button
                onClick={() => addSource('dipole')}
                className="px-4 py-2 bg-indigo-500 text-white rounded-lg text-sm font-medium hover:bg-indigo-600"
              >
                Bar Magnet
              </button>
            </div>
          </div>

          {/* Selected Source Controls */}
          {selectedSourceData && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-sm font-medium text-blue-900 mb-2">
                Selected: {selectedSourceData.type === 'wire' ? 'Current Wire' : 
                          selectedSourceData.type === 'loop' ? 'Current Loop' : 'Bar Magnet'}
              </div>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={flipSelectedCurrent}
                  className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                >
                  Flip Direction
                </button>
                {selectedSourceData.type === 'dipole' && (
                  <button
                    onClick={rotateSelectedDipole}
                    className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                  >
                    Rotate 45°
                  </button>
                )}
                <button
                  onClick={removeSelectedSource}
                  className="px-3 py-1.5 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                >
                  Remove
                </button>
              </div>
            </div>
          )}

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
              Reset Default
            </button>
            <button
              onClick={clearAll}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50"
            >
              Clear All
            </button>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="border border-gray-200 rounded-lg p-4 bg-purple-50">
        <div className="text-sm text-purple-900">
          <p className="font-medium mb-2">💡 How to Use:</p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li><strong>Current Wire:</strong> Shows circular field lines (⊙ = out, ⊗ = in)</li>
            <li><strong>Current Loop:</strong> Creates dipole field like a bar magnet</li>
            <li><strong>Bar Magnet:</strong> N (red) and S (blue) poles with dipole field</li>
            <li>Click sources to select, then flip direction or rotate</li>
            <li>Field lines show magnetic field direction (closed loops)</li>
            <li>Right-hand rule: Thumb = current, fingers = field direction</li>
          </ul>
        </div>
      </div>

      {/* Source List */}
      {sources.length > 0 && (
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <div className="text-xs font-semibold text-gray-700 mb-2">Current Sources ({sources.length})</div>
          <div className="grid grid-cols-2 gap-2">
            {sources.map(source => (
              <div
                key={source.id}
                className={`p-2 rounded border ${
                  selectedSource === source.id
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {source.type === 'wire' ? '🔌 Wire' : 
                     source.type === 'loop' ? '⭕ Loop' : '🧲 Magnet'} #{source.id}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                    source.type === 'wire' 
                      ? source.current > 0 ? 'bg-amber-100 text-amber-700' : 'bg-cyan-100 text-cyan-700'
                      : source.type === 'loop'
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-indigo-100 text-indigo-700'
                  }`}>
                    {source.type === 'wire' ? (source.current > 0 ? '⊙ Out' : '⊗ In') :
                     source.type === 'loop' ? (source.current > 0 ? '↻ CCW' : '↺ CW') :
                     `${source.rotation}°`}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Position: ({Math.round(source.x)}, {Math.round(source.y)})
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
