'use client';

import { useState, useEffect, useRef } from 'react';

interface Step {
  i: number;
  j: number;
  sum?: number;
  found?: boolean;
  message: string;
}

export default function TwoSumVisualizer() {
  const [nums, setNums] = useState<number[]>([2, 7, 11, 15]);
  const [target, setTarget] = useState<number>(9);
  const [customInput, setCustomInput] = useState<string>('2,7,11,15');
  const [customTarget, setCustomTarget] = useState<string>('9');
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [result, setResult] = useState<number[] | null>(null);
  const [error, setError] = useState<string>('');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Generate visualization steps
  const generateSteps = (array: number[], targetValue: number): Step[] => {
    const newSteps: Step[] = [];
    const map = new Map<number, number>();

    for (let i = 0; i < array.length; i++) {
      const complement = targetValue - array[i];
      
      if (map.has(complement)) {
        newSteps.push({
          i: map.get(complement)!,
          j: i,
          sum: array[i] + array[map.get(complement)!],
          found: true,
          message: `Found! nums[${map.get(complement)}] + nums[${i}] = ${array[map.get(complement)!]} + ${array[i]} = ${targetValue}`
        });
        return newSteps;
      }

      newSteps.push({
        i,
        j: -1,
        message: `Checking nums[${i}] = ${array[i]}, looking for ${complement}. Not found in map yet.`
      });

      map.set(array[i], i);
    }

    newSteps.push({
      i: -1,
      j: -1,
      message: 'No solution found'
    });

    return newSteps;
  };

  // Initialize steps
  useEffect(() => {
    const newSteps = generateSteps(nums, target);
    setSteps(newSteps);
    setCurrentStep(0);
    
    // Find result
    const foundStep = newSteps.find(step => step.found);
    if (foundStep) {
      setResult([foundStep.i, foundStep.j]);
    } else {
      setResult(null);
    }
  }, [nums, target]);

  // Auto-play functionality
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1500);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, steps.length]);

  // Handle custom input
  const handleApplyInput = () => {
    setError('');
    
    // Validate array input
    const arrayStr = customInput.trim();
    if (!arrayStr) {
      setError('Please enter an array of numbers');
      return;
    }

    const parsedNums = arrayStr.split(',').map(s => s.trim()).filter(s => s);
    const numbers = parsedNums.map(Number);

    if (numbers.some(isNaN)) {
      setError('Array must contain only valid numbers separated by commas');
      return;
    }

    if (numbers.length < 2) {
      setError('Array must contain at least 2 numbers');
      return;
    }

    if (numbers.length > 20) {
      setError('Array size should not exceed 20 for better visualization');
      return;
    }

    // Validate target
    const targetNum = Number(customTarget.trim());
    if (isNaN(targetNum)) {
      setError('Target must be a valid number');
      return;
    }

    setNums(numbers);
    setTarget(targetNum);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const handlePrevious = () => {
    setIsPlaying(false);
    setCurrentStep(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setIsPlaying(false);
    setCurrentStep(prev => Math.min(steps.length - 1, prev + 1));
  };

  const togglePlayPause = () => {
    if (currentStep >= steps.length - 1) {
      setCurrentStep(0);
    }
    setIsPlaying(!isPlaying);
  };

  const currentStepData = steps[currentStep] || { i: -1, j: -1, message: '' };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Interactive Visualizer</h3>

      {/* Custom Input Section */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-3">Custom Input</h4>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Array (comma-separated numbers)
            </label>
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="e.g., 2,7,11,15"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target
            </label>
            <input
              type="text"
              value={customTarget}
              onChange={(e) => setCustomTarget(e.target.value)}
              placeholder="e.g., 9"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>
        {error && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}
        <button
          onClick={handleApplyInput}
          className="mt-3 bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
        >
          Apply & Visualize
        </button>
      </div>

      {/* Current State Display */}
      <div className="mb-6 p-4 bg-indigo-50 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Array:</span>
          <span className="font-mono text-indigo-600">[{nums.join(', ')}]</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">Target:</span>
          <span className="font-mono text-indigo-600">{target}</span>
        </div>
      </div>

      {/* Array Visualization */}
      <div className="mb-6 overflow-x-auto">
        <div className="flex gap-2 min-w-max pb-4">
          {nums.map((num, index) => (
            <div key={index} className="flex flex-col items-center relative">
              {/* Pointer indicators */}
              {currentStepData.i === index && (
                <div className="absolute -top-8 flex flex-col items-center animate-bounce">
                  <div className="text-2xl">👆</div>
                  <div className="text-xs font-semibold text-indigo-600 whitespace-nowrap">
                    Current
                  </div>
                </div>
              )}
              {currentStepData.j === index && currentStepData.found && (
                <div className="absolute -top-8 flex flex-col items-center animate-bounce">
                  <div className="text-2xl">👆</div>
                  <div className="text-xs font-semibold text-green-600 whitespace-nowrap">
                    Match!
                  </div>
                </div>
              )}
              
              <div className="text-xs text-gray-500 mb-1">Index {index}</div>
              <div
                className={`w-16 h-16 flex items-center justify-center rounded-lg font-bold text-lg transition-all ${
                  currentStepData.i === index || currentStepData.j === index
                    ? currentStepData.found
                      ? 'bg-green-500 text-white scale-110 shadow-lg ring-4 ring-green-300'
                      : 'bg-yellow-400 text-gray-900 scale-110 shadow-lg ring-4 ring-yellow-300'
                    : result && (result[0] === index || result[1] === index)
                    ? 'bg-green-200 text-green-800'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {num}
              </div>
              
              {/* Value label below */}
              <div className="text-xs text-gray-600 mt-1 font-mono">
                nums[{index}]
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Step Message */}
      <div className="mb-6 p-4 bg-gray-100 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            Step {currentStep + 1} of {steps.length}
          </span>
          {currentStepData.found && (
            <span className="px-3 py-1 bg-green-500 text-white text-sm font-semibold rounded-full">
              Solution Found!
            </span>
          )}
        </div>
        <p className="text-gray-800">{currentStepData.message}</p>
      </div>

      {/* Control Buttons */}
      <div className="flex flex-wrap gap-2 justify-center mb-4">
        <button
          onClick={handleReset}
          disabled={currentStep === 0}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Reset
        </button>

        <button
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Previous
        </button>

        <button
          onClick={togglePlayPause}
          className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center gap-2"
        >
          {isPlaying ? (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Pause
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {currentStep >= steps.length - 1 ? 'Replay' : 'Play'}
            </>
          )}
        </button>

        <button
          onClick={handleNext}
          disabled={currentStep >= steps.length - 1}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          Next
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Result Display */}
      {result && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2 text-green-800">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <span className="font-semibold">Solution: </span>
              <span className="font-mono">[{result[0]}, {result[1]}]</span>
              <span className="ml-2 text-sm">
                (nums[{result[0]}] = {nums[result[0]]}, nums[{result[1]}] = {nums[result[1]]})
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Progress Bar */}
      <div className="mt-6">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
