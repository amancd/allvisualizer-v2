'use client';

import { useState, useEffect } from 'react';

interface NetworkLayer {
  neurons: number[];
  weights?: number[][];
  biases?: number[];
  activations?: number[];
  deltas?: number[];
}

export default function BackpropagationVisualizer() {
  const [input1, setInput1] = useState(0.5);
  const [input2, setInput2] = useState(0.3);
  const [targetOutput, setTargetOutput] = useState(0.8);
  const [learningRate, setLearningRate] = useState(0.5);
  const [isTraining, setIsTraining] = useState(false);
  const [epoch, setEpoch] = useState(0);
  const [totalLoss, setTotalLoss] = useState(0);
  const [showGradients, setShowGradients] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState(500);
  
  // Network architecture: 2 inputs -> 3 hidden -> 1 output
  const [network, setNetwork] = useState<{
    input: NetworkLayer;
    hidden: NetworkLayer;
    output: NetworkLayer;
  }>({
    input: {
      neurons: [0.5, 0.3],
      activations: [0.5, 0.3]
    },
    hidden: {
      neurons: [0, 0, 0],
      weights: [
        [0.15, 0.20, 0.25],
        [0.30, 0.35, 0.40]
      ],
      biases: [0.35, 0.35, 0.35],
      activations: [0, 0, 0],
      deltas: [0, 0, 0]
    },
    output: {
      neurons: [0],
      weights: [
        [0.45],
        [0.50],
        [0.55]
      ],
      biases: [0.60],
      activations: [0],
      deltas: [0]
    }
  });

  const sigmoid = (x: number): number => {
    return 1 / (1 + Math.exp(-x));
  };

  const sigmoidDerivative = (x: number): number => {
    return x * (1 - x);
  };

  // Forward pass
  const forwardPass = (net = network, inp1 = input1, inp2 = input2) => {
    const newNetwork = JSON.parse(JSON.stringify(net));
    
    // Set inputs
    newNetwork.input.activations = [inp1, inp2];
    
    // Calculate hidden layer
    for (let i = 0; i < newNetwork.hidden.neurons.length; i++) {
      let sum = newNetwork.hidden.biases[i];
      for (let j = 0; j < newNetwork.input.activations.length; j++) {
        sum += newNetwork.input.activations[j] * newNetwork.hidden.weights[j][i];
      }
      newNetwork.hidden.activations[i] = sigmoid(sum);
    }
    
    // Calculate output layer
    for (let i = 0; i < newNetwork.output.neurons.length; i++) {
      let sum = newNetwork.output.biases[i];
      for (let j = 0; j < newNetwork.hidden.activations.length; j++) {
        sum += newNetwork.hidden.activations[j] * newNetwork.output.weights[j][i];
      }
      newNetwork.output.activations[i] = sigmoid(sum);
    }
    
    return newNetwork;
  };

  // Backward pass
  const backwardPass = (net: typeof network, target: number) => {
    const newNetwork = JSON.parse(JSON.stringify(net));
    
    // Calculate output layer deltas (error * derivative)
    for (let i = 0; i < newNetwork.output.activations.length; i++) {
      const error = target - newNetwork.output.activations[i];
      newNetwork.output.deltas[i] = error * sigmoidDerivative(newNetwork.output.activations[i]);
    }
    
    // Calculate hidden layer deltas
    for (let i = 0; i < newNetwork.hidden.activations.length; i++) {
      let error = 0;
      for (let j = 0; j < newNetwork.output.deltas.length; j++) {
        error += newNetwork.output.deltas[j] * newNetwork.output.weights[i][j];
      }
      newNetwork.hidden.deltas[i] = error * sigmoidDerivative(newNetwork.hidden.activations[i]);
    }
    
    return newNetwork;
  };

  // Update weights
  const updateWeights = (net: typeof network, lr: number) => {
    const newNetwork = JSON.parse(JSON.stringify(net));
    
    // Update output layer weights and biases
    for (let i = 0; i < newNetwork.output.weights.length; i++) {
      for (let j = 0; j < newNetwork.output.weights[i].length; j++) {
        const gradient = newNetwork.output.deltas[j] * newNetwork.hidden.activations[i];
        newNetwork.output.weights[i][j] += lr * gradient;
      }
    }
    for (let i = 0; i < newNetwork.output.biases.length; i++) {
      newNetwork.output.biases[i] += lr * newNetwork.output.deltas[i];
    }
    
    // Update hidden layer weights and biases
    for (let i = 0; i < newNetwork.hidden.weights.length; i++) {
      for (let j = 0; j < newNetwork.hidden.weights[i].length; j++) {
        const gradient = newNetwork.hidden.deltas[j] * newNetwork.input.activations[i];
        newNetwork.hidden.weights[i][j] += lr * gradient;
      }
    }
    for (let i = 0; i < newNetwork.hidden.biases.length; i++) {
      newNetwork.hidden.biases[i] += lr * newNetwork.hidden.deltas[i];
    }
    
    return newNetwork;
  };

  const trainStep = () => {
    // Forward pass
    let updatedNetwork = forwardPass(network, input1, input2);
    
    // Backward pass
    updatedNetwork = backwardPass(updatedNetwork, targetOutput);
    
    // Update weights
    updatedNetwork = updateWeights(updatedNetwork, learningRate);
    
    // Calculate loss (MSE)
    const loss = Math.pow(targetOutput - updatedNetwork.output.activations[0], 2) / 2;
    setTotalLoss(loss);
    
    setNetwork(updatedNetwork);
    setEpoch(prev => prev + 1);
  };

  useEffect(() => {
    if (isTraining) {
      const interval = setInterval(() => {
        trainStep();
      }, animationSpeed);
      return () => clearInterval(interval);
    }
  }, [isTraining, network, animationSpeed]);

  const reset = () => {
    setIsTraining(false);
    setEpoch(0);
    setTotalLoss(0);
    setNetwork({
      input: {
        neurons: [0.5, 0.3],
        activations: [0.5, 0.3]
      },
      hidden: {
        neurons: [0, 0, 0],
        weights: [
          [0.15, 0.20, 0.25],
          [0.30, 0.35, 0.40]
        ],
        biases: [0.35, 0.35, 0.35],
        activations: [0, 0, 0],
        deltas: [0, 0, 0]
      },
      output: {
        neurons: [0],
        weights: [
          [0.45],
          [0.50],
          [0.55]
        ],
        biases: [0.60],
        activations: [0],
        deltas: [0]
      }
    });
  };

  const runOnce = () => {
    const updatedNetwork = forwardPass();
    setNetwork(updatedNetwork);
  };

  // Visualization helper functions
  const getNeuronColor = (activation: number, isActive: boolean = true) => {
    if (!isActive) return '#e5e7eb';
    const intensity = Math.floor(activation * 255);
    return `rgb(59, ${130 + intensity}, 246)`;
  };

  const getWeightColor = (weight: number) => {
    if (weight > 0) {
      const intensity = Math.min(Math.abs(weight) * 100, 255);
      return `rgba(34, 197, 94, ${intensity / 255})`;
    } else {
      const intensity = Math.min(Math.abs(weight) * 100, 255);
      return `rgba(239, 68, 68, ${intensity / 255})`;
    }
  };

  const getWeightWidth = (weight: number) => {
    return Math.max(1, Math.min(Math.abs(weight) * 3, 5));
  };

  return (
    <div className="space-y-8">
      {/* Network Visualization */}
      <div className="bg-white border-2 border-gray-300 rounded-lg p-8">
        <svg viewBox="0 0 800 500" className="w-full">
          {/* Input Layer */}
          <g id="input-layer">
            <text x="50" y="30" className="text-sm font-semibold" fill="#374151">Input Layer</text>
            {network.input.activations?.map((activation, i) => (
              <g key={`input-${i}`}>
                <circle
                  cx="100"
                  cy={150 + i * 120}
                  r="30"
                  fill={getNeuronColor(activation)}
                  stroke="#1f2937"
                  strokeWidth="2"
                />
                <text x="100" y={150 + i * 120 + 5} textAnchor="middle" fill="white" className="text-sm font-bold">
                  {activation.toFixed(2)}
                </text>
                <text x="50" y={150 + i * 120 + 5} textAnchor="middle" fill="#6b7280" className="text-xs">
                  x{i + 1}
                </text>
              </g>
            ))}
          </g>

          {/* Weights: Input to Hidden */}
          <g id="input-to-hidden-weights">
            {network.input.activations?.map((_, i) => (
              network.hidden.weights?.[i].map((weight, j) => (
                <g key={`weight-ih-${i}-${j}`}>
                  <line
                    x1="130"
                    y1={150 + i * 120}
                    x2="270"
                    y2={100 + j * 80}
                    stroke={getWeightColor(weight)}
                    strokeWidth={getWeightWidth(weight)}
                    opacity="0.6"
                  />
                  {showGradients && network.hidden.deltas?.[j] !== 0 && (
                    <text
                      x={(130 + 270) / 2}
                      y={(150 + i * 120 + 100 + j * 80) / 2}
                      fill="#6b7280"
                      className="text-xs"
                      textAnchor="middle"
                    >
                      {weight.toFixed(2)}
                    </text>
                  )}
                </g>
              ))
            ))}
          </g>

          {/* Hidden Layer */}
          <g id="hidden-layer">
            <text x="270" y="30" className="text-sm font-semibold" fill="#374151">Hidden Layer</text>
            {network.hidden.activations?.map((activation, i) => (
              <g key={`hidden-${i}`}>
                <circle
                  cx="300"
                  cy={100 + i * 80}
                  r="30"
                  fill={getNeuronColor(activation)}
                  stroke="#1f2937"
                  strokeWidth="2"
                />
                <text x="300" y={100 + i * 80 + 5} textAnchor="middle" fill="white" className="text-sm font-bold">
                  {activation.toFixed(2)}
                </text>
                {showGradients && network.hidden.deltas?.[i] !== 0 && (
                  <text x="350" y={100 + i * 80 + 5} fill="#ef4444" className="text-xs font-semibold">
                    δ:{network.hidden.deltas?.[i].toFixed(3)}
                  </text>
                )}
              </g>
            ))}
          </g>

          {/* Weights: Hidden to Output */}
          <g id="hidden-to-output-weights">
            {network.output.weights?.map((weights, i) => (
              weights.map((weight, j) => (
                <g key={`weight-ho-${i}-${j}`}>
                  <line
                    x1="330"
                    y1={100 + i * 80}
                    x2="470"
                    y2={200}
                    stroke={getWeightColor(weight)}
                    strokeWidth={getWeightWidth(weight)}
                    opacity="0.6"
                  />
                  {showGradients && network.output.deltas?.[j] !== 0 && (
                    <text
                      x={(330 + 470) / 2}
                      y={(100 + i * 80 + 200) / 2}
                      fill="#6b7280"
                      className="text-xs"
                      textAnchor="middle"
                    >
                      {weight.toFixed(2)}
                    </text>
                  )}
                </g>
              ))
            ))}
          </g>

          {/* Output Layer */}
          <g id="output-layer">
            <text x="470" y="30" className="text-sm font-semibold" fill="#374151">Output Layer</text>
            {network.output.activations?.map((activation, i) => (
              <g key={`output-${i}`}>
                <circle
                  cx="500"
                  cy={200}
                  r="30"
                  fill={getNeuronColor(activation)}
                  stroke="#1f2937"
                  strokeWidth="2"
                />
                <text x="500" y={205} textAnchor="middle" fill="white" className="text-sm font-bold">
                  {activation.toFixed(2)}
                </text>
                {showGradients && network.output.deltas?.[i] !== 0 && (
                  <text x="550" y={205} fill="#ef4444" className="text-xs font-semibold">
                    δ:{network.output.deltas?.[i].toFixed(3)}
                  </text>
                )}
                <text x="500" y={245} textAnchor="middle" fill="#6b7280" className="text-xs">
                  Target: {targetOutput.toFixed(2)}
                </text>
                <text x="500" y={260} textAnchor="middle" fill="#ef4444" className="text-xs font-semibold">
                  Error: {(targetOutput - activation).toFixed(3)}
                </text>
              </g>
            ))}
          </g>

          {/* Legend */}
          <g id="legend" transform="translate(600, 80)">
            <text x="0" y="0" className="text-xs font-semibold" fill="#374151">Weight Colors:</text>
            <line x1="0" y1="15" x2="40" y2="15" stroke="rgba(34, 197, 94, 0.8)" strokeWidth="3" />
            <text x="45" y="20" className="text-xs" fill="#6b7280">Positive</text>
            <line x1="0" y1="35" x2="40" y2="35" stroke="rgba(239, 68, 68, 0.8)" strokeWidth="3" />
            <text x="45" y="40" className="text-xs" fill="#6b7280">Negative</text>
          </g>
        </svg>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
          <div className="text-sm text-blue-700 font-medium">Epoch</div>
          <div className="text-2xl font-bold text-blue-900">{epoch}</div>
        </div>
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
          <div className="text-sm text-red-700 font-medium">Loss (MSE)</div>
          <div className="text-2xl font-bold text-red-900">{totalLoss.toFixed(4)}</div>
        </div>
        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
          <div className="text-sm text-green-700 font-medium">Output</div>
          <div className="text-2xl font-bold text-green-900">{network.output.activations?.[0].toFixed(4)}</div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white border-2 border-gray-300 rounded-lg p-6 space-y-6">
        <div className="flex gap-3">
          <button
            onClick={() => setIsTraining(!isTraining)}
            className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
          >
            {isTraining ? 'Stop Training' : 'Start Training'}
          </button>
          <button
            onClick={trainStep}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            disabled={isTraining}
          >
            Train 1 Step
          </button>
          <button
            onClick={runOnce}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            disabled={isTraining}
          >
            Forward Pass
          </button>
          <button
            onClick={reset}
            className="px-6 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Reset
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Input Controls */}
          <div className="space-y-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-900">Inputs</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Input 1 (x₁): {input1.toFixed(2)}
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={input1}
                onChange={(e) => {
                  setInput1(Number(e.target.value));
                  setNetwork(forwardPass(network, Number(e.target.value), input2));
                }}
                className="w-full"
                disabled={isTraining}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Input 2 (x₂): {input2.toFixed(2)}
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={input2}
                onChange={(e) => {
                  setInput2(Number(e.target.value));
                  setNetwork(forwardPass(network, input1, Number(e.target.value)));
                }}
                className="w-full"
                disabled={isTraining}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Output: {targetOutput.toFixed(2)}
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={targetOutput}
                onChange={(e) => setTargetOutput(Number(e.target.value))}
                className="w-full"
                disabled={isTraining}
              />
            </div>
          </div>

          {/* Training Controls */}
          <div className="space-y-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <h3 className="font-semibold text-purple-900">Training Parameters</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Learning Rate: {learningRate.toFixed(2)}
              </label>
              <input
                type="range"
                min="0.01"
                max="2"
                step="0.01"
                value={learningRate}
                onChange={(e) => setLearningRate(Number(e.target.value))}
                className="w-full"
                disabled={isTraining}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Animation Speed: {animationSpeed}ms
              </label>
              <input
                type="range"
                min="100"
                max="2000"
                step="100"
                value={animationSpeed}
                onChange={(e) => setAnimationSpeed(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showGradients}
                  onChange={(e) => setShowGradients(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700">Show Gradients & Deltas</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Theory */}
      <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-6 space-y-4">
        <h3 className="text-xl font-bold text-gray-900">Backpropagation Algorithm</h3>
        
        <div className="space-y-3 text-gray-700">
          <div>
            <h4 className="font-semibold text-gray-900 mb-1">1. Forward Pass</h4>
            <p className="text-sm">Calculate activations from input to output:</p>
            <p className="font-mono text-sm bg-white p-2 rounded border border-gray-300 mt-1">
              a = σ(Wx + b) where σ is sigmoid activation
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-1">2. Calculate Error</h4>
            <p className="text-sm">Compute the difference between prediction and target:</p>
            <p className="font-mono text-sm bg-white p-2 rounded border border-gray-300 mt-1">
              Error = Target - Output<br/>
              Loss = ½(Target - Output)²
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-1">3. Backward Pass</h4>
            <p className="text-sm">Calculate deltas (error signals) from output to input:</p>
            <p className="font-mono text-sm bg-white p-2 rounded border border-gray-300 mt-1">
              δ_output = Error × σ'(output)<br/>
              δ_hidden = (δ_next · W^T) × σ'(activation)
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-1">4. Update Weights</h4>
            <p className="text-sm">Adjust weights using gradient descent:</p>
            <p className="font-mono text-sm bg-white p-2 rounded border border-gray-300 mt-1">
              W_new = W_old + η × δ × a_prev<br/>
              b_new = b_old + η × δ
            </p>
            <p className="text-xs text-gray-600 mt-1">where η is the learning rate</p>
          </div>

          <div className="pt-2">
            <h4 className="font-semibold text-gray-900 mb-1">Key Concepts</h4>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li><strong>Sigmoid Function:</strong> σ(x) = 1/(1 + e^(-x)) - squashes values to (0,1)</li>
              <li><strong>Delta (δ):</strong> Measures how much a neuron contributes to the error</li>
              <li><strong>Gradient:</strong> Direction and magnitude of weight update</li>
              <li><strong>Learning Rate:</strong> Controls step size during weight updates</li>
              <li><strong>Weight Color:</strong> Green = positive connection, Red = negative (inhibitory)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
