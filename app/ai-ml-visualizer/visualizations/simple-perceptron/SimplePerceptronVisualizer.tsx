'use client';

import { useState, useEffect, useRef } from 'react';

interface DataPoint {
  x: number;
  y: number;
  label: number; // 0 or 1
}

export default function SimplePerceptronVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Perceptron parameters
  const [weight1, setWeight1] = useState(0.5);
  const [weight2, setWeight2] = useState(0.5);
  const [bias, setBias] = useState(0);
  const [learningRate, setLearningRate] = useState(0.1);
  
  // Training state
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([]);
  const [isTraining, setIsTraining] = useState(false);
  const [epoch, setEpoch] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  
  // Generate random data points
  const generateData = (count: number = 50) => {
    const newPoints: DataPoint[] = [];
    for (let i = 0; i < count; i++) {
      const x = Math.random() * 10;
      const y = Math.random() * 10;
      // Simple linear separation: y > x means label 1
      const label = y > x ? 1 : 0;
      newPoints.push({ x, y, label });
    }
    setDataPoints(newPoints);
    setEpoch(0);
  };
  
  // Perceptron activation function (step function)
  const activate = (sum: number): number => {
    return sum >= 0 ? 1 : 0;
  };
  
  // Predict for a single point
  const predict = (x: number, y: number, w1: number, w2: number, b: number): number => {
    const sum = x * w1 + y * w2 + b;
    return activate(sum);
  };
  
  // Calculate current accuracy
  const calculateAccuracy = (w1: number, w2: number, b: number): number => {
    if (dataPoints.length === 0) return 0;
    let correct = 0;
    dataPoints.forEach(point => {
      const prediction = predict(point.x, point.y, w1, w2, b);
      if (prediction === point.label) correct++;
    });
    return (correct / dataPoints.length) * 100;
  };
  
  // Train one epoch
  const trainEpoch = () => {
    let newWeight1 = weight1;
    let newWeight2 = weight2;
    let newBias = bias;
    
    dataPoints.forEach(point => {
      const prediction = predict(point.x, point.y, newWeight1, newWeight2, newBias);
      const error = point.label - prediction;
      
      // Update weights and bias
      newWeight1 += learningRate * error * point.x;
      newWeight2 += learningRate * error * point.y;
      newBias += learningRate * error;
    });
    
    setWeight1(newWeight1);
    setWeight2(newWeight2);
    setBias(newBias);
    setEpoch(e => e + 1);
    
    const acc = calculateAccuracy(newWeight1, newWeight2, newBias);
    setAccuracy(acc);
  };
  
  // Auto-training
  useEffect(() => {
    if (!isTraining) return;
    
    const interval = setInterval(() => {
      trainEpoch();
      if (accuracy >= 98) {
        setIsTraining(false);
      }
    }, 100);
    
    return () => clearInterval(interval);
  }, [isTraining, accuracy]);
  
  // Draw visualization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const padding = 40;
    const scale = (canvas.width - 2 * padding) / 10;
    
    // Draw grid
    ctx.strokeStyle = '#E5E7EB';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 10; i++) {
      // Vertical lines
      ctx.beginPath();
      ctx.moveTo(padding + i * scale, padding);
      ctx.lineTo(padding + i * scale, canvas.height - padding);
      ctx.stroke();
      
      // Horizontal lines
      ctx.beginPath();
      ctx.moveTo(padding, padding + i * scale);
      ctx.lineTo(canvas.width - padding, padding + i * scale);
      ctx.stroke();
    }
    
    // Draw decision boundary (if weights are not zero)
    if (Math.abs(weight2) > 0.001) {
      ctx.strokeStyle = '#6366F1';
      ctx.lineWidth = 3;
      ctx.beginPath();
      
      // Line equation: w1*x + w2*y + b = 0
      // y = (-w1*x - b) / w2
      const x1 = 0;
      const y1 = (-weight1 * x1 - bias) / weight2;
      const x2 = 10;
      const y2 = (-weight1 * x2 - bias) / weight2;
      
      ctx.moveTo(padding + x1 * scale, canvas.height - padding - y1 * scale);
      ctx.lineTo(padding + x2 * scale, canvas.height - padding - y2 * scale);
      ctx.stroke();
      
      // Label for decision boundary
      ctx.fillStyle = '#6366F1';
      ctx.font = 'bold 12px Arial';
      ctx.fillText('Decision Boundary', padding + 5 * scale, padding - 10);
    }
    
    // Draw data points
    dataPoints.forEach(point => {
      const px = padding + point.x * scale;
      const py = canvas.height - padding - point.y * scale;
      
      const prediction = predict(point.x, point.y, weight1, weight2, bias);
      const isCorrect = prediction === point.label;
      
      // Draw point
      ctx.beginPath();
      ctx.arc(px, py, 6, 0, 2 * Math.PI);
      
      if (point.label === 1) {
        ctx.fillStyle = isCorrect ? '#10B981' : '#FCA5A5';
      } else {
        ctx.fillStyle = isCorrect ? '#3B82F6' : '#FCA5A5';
      }
      ctx.fill();
      
      ctx.strokeStyle = '#1F2937';
      ctx.lineWidth = 2;
      ctx.stroke();
    });
    
    // Draw axes labels
    ctx.fillStyle = '#6B7280';
    ctx.font = '14px Arial';
    ctx.fillText('x', canvas.width - padding + 10, canvas.height - padding + 5);
    ctx.fillText('y', padding - 10, padding - 10);
    
  }, [dataPoints, weight1, weight2, bias]);
  
  // Initialize with data
  useEffect(() => {
    generateData();
  }, []);
  
  // Update accuracy when weights change
  useEffect(() => {
    const acc = calculateAccuracy(weight1, weight2, bias);
    setAccuracy(acc);
  }, [weight1, weight2, bias, dataPoints]);

  return (
    <div className="space-y-6">
      {/* Introduction */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">The Perceptron</h3>
        <p className="text-gray-700 mb-3">
          A perceptron is the simplest type of artificial neuron. It takes inputs, multiplies them by weights, 
          adds a bias, and produces an output through an activation function.
        </p>
        <div className="bg-white rounded-lg p-4 border border-blue-200">
          <p className="text-sm font-mono text-gray-800">
            output = activate(w₁·x + w₂·y + b)
          </p>
          <p className="text-xs text-gray-600 mt-2">
            The perceptron learns by adjusting weights and bias to minimize prediction errors.
          </p>
        </div>
      </div>

      {/* Canvas */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Visualization</h3>
        <canvas
          ref={canvasRef}
          width={600}
          height={600}
          className="w-full border border-gray-300 rounded"
        />
        <div className="mt-4 flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-gray-900"></div>
            <span className="text-gray-700">Class 0 (Below line)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-500 border-2 border-gray-900"></div>
            <span className="text-gray-700">Class 1 (Above line)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-300 border-2 border-gray-900"></div>
            <span className="text-gray-700">Misclassified</span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Parameters</h3>
        
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Weight 1 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Weight 1 (w₁): {weight1.toFixed(3)}
            </label>
            <input
              type="range"
              min="-2"
              max="2"
              step="0.1"
              value={weight1}
              onChange={(e) => setWeight1(Number(e.target.value))}
              disabled={isTraining}
              className="w-full"
            />
          </div>

          {/* Weight 2 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Weight 2 (w₂): {weight2.toFixed(3)}
            </label>
            <input
              type="range"
              min="-2"
              max="2"
              step="0.1"
              value={weight2}
              onChange={(e) => setWeight2(Number(e.target.value))}
              disabled={isTraining}
              className="w-full"
            />
          </div>

          {/* Bias */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bias (b): {bias.toFixed(3)}
            </label>
            <input
              type="range"
              min="-5"
              max="5"
              step="0.1"
              value={bias}
              onChange={(e) => setBias(Number(e.target.value))}
              disabled={isTraining}
              className="w-full"
            />
          </div>

          {/* Learning Rate */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Learning Rate: {learningRate.toFixed(2)}
            </label>
            <input
              type="range"
              min="0.01"
              max="0.5"
              step="0.01"
              value={learningRate}
              onChange={(e) => setLearningRate(Number(e.target.value))}
              disabled={isTraining}
              className="w-full"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setIsTraining(!isTraining)}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              isTraining
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            {isTraining ? 'Stop Training' : 'Start Training'}
          </button>
          <button
            onClick={trainEpoch}
            disabled={isTraining}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Train 1 Epoch
          </button>
          <button
            onClick={() => {
              setWeight1(0.5);
              setWeight2(0.5);
              setBias(0);
              setEpoch(0);
              setIsTraining(false);
            }}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Reset Weights
          </button>
          <button
            onClick={() => generateData()}
            disabled={isTraining}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            New Data
          </button>
        </div>
      </div>

      {/* Training Stats */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Training Statistics</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 border border-indigo-100">
            <div className="text-xs text-gray-500 mb-1">Epoch</div>
            <div className="text-2xl font-bold text-indigo-600">{epoch}</div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-indigo-100">
            <div className="text-xs text-gray-500 mb-1">Accuracy</div>
            <div className="text-2xl font-bold text-green-600">{accuracy.toFixed(1)}%</div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-indigo-100">
            <div className="text-xs text-gray-500 mb-1">Data Points</div>
            <div className="text-2xl font-bold text-blue-600">{dataPoints.length}</div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-indigo-100">
            <div className="text-xs text-gray-500 mb-1">Status</div>
            <div className="text-sm font-semibold text-purple-600">
              {isTraining ? 'Training...' : 'Ready'}
            </div>
          </div>
        </div>
      </div>

      {/* How it Works */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">How the Perceptron Learns</h3>
        <div className="space-y-4 text-sm text-gray-700">
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-semibold">1</span>
            <div>
              <strong>Forward Pass:</strong> Calculate output = activate(w₁·x + w₂·y + b)
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-semibold">2</span>
            <div>
              <strong>Calculate Error:</strong> error = actual_label - predicted_label
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-semibold">3</span>
            <div>
              <strong>Update Weights:</strong> w₁ = w₁ + learning_rate × error × x
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-semibold">4</span>
            <div>
              <strong>Repeat:</strong> Continue until accuracy is satisfactory
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
