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
    <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200 p-6 md:p-8">
      {/* Custom Input Section */}
      <div className="mb-8 p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          </div>
          <h4 className="text-lg font-bold text-gray-900">Custom Input</h4>
        </div>
        
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Array (comma-separated)
            </label>
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="e.g., 2,7,11,15"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Target
            </label>
            <input
              type="text"
              value={customTarget}
              onChange={(e) => setCustomTarget(e.target.value)}
              placeholder="e.g., 9"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm"
            />
          </div>
        </div>
        
        {error && (
          <div className="mt-4 p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-700 text-sm flex items-start gap-3">
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        )}
        
        <button
          onClick={handleApplyInput}
          className="mt-4 w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Apply & Visualize
        </button>
      </div>

      {/* Current State Display */}
      <div className="mb-8 grid sm:grid-cols-2 gap-4">
        <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-200">
          <div className="text-xs font-semibold text-indigo-600 mb-1 uppercase tracking-wide">Array</div>
          <div className="font-mono text-lg font-bold text-gray-900">[{nums.join(', ')}]</div>
        </div>
        <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
          <div className="text-xs font-semibold text-purple-600 mb-1 uppercase tracking-wide">Target</div>
          <div className="font-mono text-lg font-bold text-gray-900">{target}</div>
        </div>
      </div>

      {/* Array Visualization */}
      <div className="mb-8 py-4">
        <div className="overflow-x-auto">
          <div className="flex gap-4 justify-center items-end min-w-max px-4 pb-4 pt-16">
            {nums.map((num, index) => (
            <div key={index} className="flex flex-col items-center relative">
                {/* Pointer indicators - positioned absolutely above */}
                {currentStepData.i === index && (
                  <div className="absolute -top-16 left-1/2 -translate-x-1/2 flex flex-col items-center z-10">
                    <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center mb-1 animate-bounce">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    </div>
                    <div className="text-xs font-bold text-indigo-600 whitespace-nowrap bg-indigo-100 px-3 py-1 rounded-full shadow-md">
                      Checking
                    </div>
                  </div>
                )}
                {currentStepData.j === index && currentStepData.found && (
                  <div className="absolute -top-16 left-1/2 -translate-x-1/2 flex flex-col items-center z-10">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mb-1 animate-bounce">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="text-xs font-bold text-green-600 whitespace-nowrap bg-green-100 px-3 py-1 rounded-full shadow-md animate-pulse">
                      Found!
                    </div>
                  </div>
                )}
              
                <div className="text-xs font-medium text-gray-500 mb-2 px-2 py-1 bg-gray-100 rounded-md">
                  Index {index}
                </div>
              
                <div
                  className={`w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center rounded-2xl font-bold text-xl sm:text-2xl transition-all duration-500 transform ${
                    currentStepData.i === index || currentStepData.j === index
                      ? currentStepData.found
                        ? 'bg-gradient-to-br from-green-400 to-emerald-500 text-white scale-110 shadow-2xl ring-4 ring-green-200 animate-pulse'
                        : 'bg-gradient-to-br from-amber-400 to-orange-500 text-white scale-105 shadow-xl ring-4 ring-amber-200'
                      : result && (result[0] === index || result[1] === index)
                      ? 'bg-gradient-to-br from-green-50 to-emerald-50 text-green-700 border-2 border-green-400 shadow-lg'
                      : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-indigo-300 hover:shadow-lg hover:scale-105'
                  }`}
                >
                  {num}
                </div>
              
                <div className="text-xs text-gray-500 mt-2 font-mono font-medium px-2 py-1 bg-gray-50 rounded">
                  nums[{index}]
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Step Message */}
      <div className="mb-6 p-6 bg-white rounded-xl border-2 border-gray-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-bold text-gray-700 uppercase tracking-wide">
              Step {currentStep + 1} of {steps.length}
            </span>
          </div>
          {currentStepData.found && (
            <span className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-bold rounded-full shadow-lg flex items-center gap-2 w-fit">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Solution Found!
            </span>
          )}
        </div>
        <p className="text-gray-800 text-sm sm:text-base leading-relaxed">{currentStepData.message}</p>
      </div>

      {/* Control Buttons */}
      <div className="flex flex-wrap gap-3 justify-center mb-6">
        <button
          onClick={handleReset}
          disabled={currentStep === 0}
          className="px-4 sm:px-5 py-2.5 bg-gray-600 text-white rounded-xl font-semibold hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:hover:translate-y-0 disabled:hover:shadow-none flex items-center gap-2 text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Reset
        </button>

        <button
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className="px-4 sm:px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:hover:translate-y-0 disabled:hover:shadow-none flex items-center gap-2 text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Previous
        </button>

        <button
          onClick={togglePlayPause}
          className="px-5 sm:px-6 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all hover:-translate-y-0.5 flex items-center gap-2 text-sm"
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
          className="px-4 sm:px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:hover:translate-y-0 disabled:hover:shadow-none flex items-center gap-2 text-sm"
        >
          Next
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Result Display */}
      {result && (
        <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl shadow-sm">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="font-bold text-green-800 mb-1 text-lg">Solution Found!</div>
              <div className="text-green-700">
                <span className="font-semibold">Indices: </span>
                <span className="font-mono bg-white px-3 py-1 rounded-lg border border-green-200 inline-block">[{result[0]}, {result[1]}]</span>
              </div>
              <div className="text-green-700 mt-2 text-sm">
                <span className="font-semibold">Values: </span>
                <span className="font-mono">
                  nums[{result[0]}] = {nums[result[0]]}, nums[{result[1]}] = {nums[result[1]]}
                </span>
                <span className="ml-2">→ Sum = {nums[result[0]] + nums[result[1]]}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Progress Bar */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-gray-600">Progress</span>
          <span className="text-xs font-semibold text-indigo-600">
            {Math.round(((currentStep + 1) / steps.length) * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-indigo-600 to-purple-600 h-3 rounded-full transition-all duration-300 shadow-inner"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
