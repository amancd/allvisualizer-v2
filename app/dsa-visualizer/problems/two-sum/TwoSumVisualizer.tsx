'use client';

import { useState, useEffect, useRef } from 'react';

interface Step {
  i: number;
  complement: number;
  found?: boolean;
  foundAt?: number;
}

export default function TwoSumVisualizer() {
  const [nums, setNums] = useState<number[]>([2, 7, 11, 15]);
  const [target, setTarget] = useState<number>(9);
  const [input, setInput] = useState<string>('2,7,11,15');
  const [targetInput, setTargetInput] = useState<string>('9');
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [hashMap, setHashMap] = useState<Map<number, number>>(new Map());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const generateSteps = (array: number[], targetValue: number): Step[] => {
    const newSteps: Step[] = [];
    const map = new Map<number, number>();

    for (let i = 0; i < array.length; i++) {
      const complement = targetValue - array[i];
      
      if (map.has(complement)) {
        newSteps.push({
          i,
          complement,
          found: true,
          foundAt: map.get(complement)!
        });
        return newSteps;
      }

      newSteps.push({ i, complement });
      map.set(array[i], i);
    }

    return newSteps;
  };

  useEffect(() => {
    const newSteps = generateSteps(nums, target);
    setSteps(newSteps);
    setCurrentStep(0);
    setHashMap(new Map());
  }, [nums, target]);

  useEffect(() => {
    if (isPlaying && currentStep < steps.length - 1) {
      intervalRef.current = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 1000);
    } else if (currentStep >= steps.length - 1) {
      setIsPlaying(false);
    }
    return () => { if (intervalRef.current) clearTimeout(intervalRef.current); };
  }, [isPlaying, currentStep, steps.length]);

  useEffect(() => {
    if (steps[currentStep]) {
      const newMap = new Map<number, number>();
      for (let i = 0; i < currentStep; i++) {
        newMap.set(nums[steps[i].i], steps[i].i);
      }
      setHashMap(newMap);
    }
  }, [currentStep, steps, nums]);

  const handleApply = () => {
    const parsed = input.split(',').map(s => Number(s.trim())).filter(n => !isNaN(n));
    const t = Number(targetInput.trim());
    if (parsed.length >= 2 && !isNaN(t)) {
      setNums(parsed);
      setTarget(t);
      setIsPlaying(false);
    }
  };

  const step = steps[currentStep];
  const result = step?.found ? [step.foundAt!, step.i] : null;

  return (
    <div className="space-y-6">
      {/* Input Controls */}
      <div className="flex gap-3 items-end">
        <div className="flex-1">
          <label className="text-xs font-medium text-gray-700 mb-1 block">Array</label>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="2,7,11,15"
          />
        </div>
        <div className="w-24">
          <label className="text-xs font-medium text-gray-700 mb-1 block">Target</label>
          <input
            type="text"
            value={targetInput}
            onChange={(e) => setTargetInput(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="9"
          />
        </div>
        <button
          onClick={handleApply}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
        >
          Apply
        </button>
      </div>

      {/* Array Visualization */}
      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {nums.map((num, idx) => (
            <div key={idx} className="flex flex-col items-center min-w-[60px]">
              <div className="text-[10px] text-gray-500 mb-1">i={idx}</div>
              <div
                className={`w-14 h-14 flex items-center justify-center rounded-lg font-semibold text-lg transition-all ${
                  step?.i === idx
                    ? step.found
                      ? 'bg-green-500 text-white ring-2 ring-green-300'
                      : 'bg-indigo-500 text-white ring-2 ring-indigo-300'
                    : result && result.includes(idx)
                    ? 'bg-green-100 text-green-700 border-2 border-green-400'
                    : 'bg-white border-2 border-gray-300 text-gray-700'
                }`}
              >
                {num}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hash Map Visualization */}
      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
        <div className="text-xs font-semibold text-gray-700 mb-2">Hash Map</div>
        <div className="flex flex-wrap gap-2">
          {hashMap.size === 0 ? (
            <div className="text-xs text-gray-400">Empty</div>
          ) : (
            Array.from(hashMap.entries()).map(([val, idx]) => (
              <div key={val} className="px-3 py-1 bg-white border border-gray-300 rounded text-xs font-mono">
                {val} → {idx}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Current Step Info */}
      {step && (
        <div className="border border-gray-200 rounded-lg p-4 bg-white">
          <div className="text-sm text-gray-700">
            {step.found ? (
              <div className="text-green-700 font-medium">
                ✓ Found: nums[{step.foundAt}] + nums[{step.i}] = {nums[step.foundAt!]} + {nums[step.i]} = {target}
              </div>
            ) : (
              <>
                <div>Looking for complement: {step.complement}</div>
                <div className="text-xs text-gray-500 mt-1">
                  Current: nums[{step.i}] = {nums[step.i]} | Need: {step.complement}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex gap-2 justify-center">
        <button
          onClick={() => setCurrentStep(0)}
          disabled={currentStep === 0}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
        >
          Reset
        </button>
        <button
          onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
          disabled={currentStep === 0}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
        >
          ← Prev
        </button>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
        >
          {isPlaying ? 'Pause' : currentStep >= steps.length - 1 ? 'Replay' : 'Play'}
        </button>
        <button
          onClick={() => setCurrentStep(prev => Math.min(steps.length - 1, prev + 1))}
          disabled={currentStep >= steps.length - 1}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
        >
          Next →
        </button>
      </div>

      {/* Progress */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-gray-600">
          <span>Step {currentStep + 1} / {steps.length}</span>
          <span>{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div
            className="bg-indigo-600 h-1.5 rounded-full transition-all"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
