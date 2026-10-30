'use client';

import { useState, useEffect, useRef } from 'react';

interface Step {
  left: number;
  right: number;
  leftChar: string;
  rightChar: string;
  isMatch?: boolean;
  skippedLeft?: boolean;
  skippedRight?: boolean;
  message: string;
}

export default function ValidPalindromeVisualizer() {
  const [input, setInput] = useState<string>('A man, a plan, a canal: Panama');
  const [inputField, setInputField] = useState<string>('A man, a plan, a canal: Panama');
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [result, setResult] = useState<boolean | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const isAlphanumeric = (char: string): boolean => {
    return /[a-zA-Z0-9]/.test(char);
  };

  const generateSteps = (str: string): Step[] => {
    const newSteps: Step[] = [];
    let left = 0;
    let right = str.length - 1;

    while (left < right) {
      // Skip non-alphanumeric from left
      while (left < right && !isAlphanumeric(str[left])) {
        newSteps.push({
          left,
          right,
          leftChar: str[left],
          rightChar: str[right],
          skippedLeft: true,
          message: `Skip non-alphanumeric '${str[left]}' at position ${left}`
        });
        left++;
      }

      // Skip non-alphanumeric from right
      while (left < right && !isAlphanumeric(str[right])) {
        newSteps.push({
          left,
          right,
          leftChar: str[left],
          rightChar: str[right],
          skippedRight: true,
          message: `Skip non-alphanumeric '${str[right]}' at position ${right}`
        });
        right--;
      }

      if (left >= right) break;

      // Compare characters
      const leftChar = str[left].toLowerCase();
      const rightChar = str[right].toLowerCase();
      const isMatch = leftChar === rightChar;

      newSteps.push({
        left,
        right,
        leftChar: str[left],
        rightChar: str[right],
        isMatch,
        message: isMatch
          ? `'${str[left]}' === '${str[right]}' ✓ Continue`
          : `'${str[left]}' !== '${str[right]}' ✗ Not a palindrome`
      });

      if (!isMatch) {
        return newSteps;
      }

      left++;
      right--;
    }

    return newSteps;
  };

  useEffect(() => {
    const newSteps = generateSteps(input);
    setSteps(newSteps);
    setCurrentStep(0);
    
    // Determine result
    const lastStep = newSteps[newSteps.length - 1];
    const isPalindrome = !lastStep || lastStep.isMatch !== false;
    setResult(isPalindrome);
  }, [input]);

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

  const handleApply = () => {
    if (inputField.trim()) {
      setInput(inputField);
      setIsPlaying(false);
    }
  };

  const step = steps[currentStep];

  return (
    <div className="space-y-6">
      {/* Input Controls */}
      <div className="flex gap-3 items-end">
        <div className="flex-1">
          <label className="text-xs font-medium text-gray-700 mb-1 block">Input String</label>
          <input
            type="text"
            value={inputField}
            onChange={(e) => setInputField(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            placeholder="A man, a plan, a canal: Panama"
          />
        </div>
        <button
          onClick={handleApply}
          className="px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800"
        >
          Apply
        </button>
      </div>

      {/* String Visualization */}
      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
        <div className="text-xs font-semibold text-gray-700 mb-3">String Characters</div>
        <div className="flex flex-wrap gap-1 justify-center">
          {input.split('').map((char, idx) => {
            const isLeft = step?.left === idx;
            const isRight = step?.right === idx;
            const isAlnum = isAlphanumeric(char);
            
            let bgColor = 'bg-white border-gray-300';
            if (isLeft && isRight) {
              bgColor = 'bg-purple-500 border-purple-600 text-white';
            } else if (isLeft) {
              bgColor = step?.isMatch === false 
                ? 'bg-red-500 border-red-600 text-white'
                : 'bg-blue-500 border-blue-600 text-white';
            } else if (isRight) {
              bgColor = step?.isMatch === false
                ? 'bg-red-500 border-red-600 text-white'
                : 'bg-green-500 border-green-600 text-white';
            } else if (!isAlnum) {
              bgColor = 'bg-gray-100 border-gray-200 text-gray-400';
            }

            return (
              <div key={idx} className="flex flex-col items-center">
                <div className="text-[10px] text-gray-500 mb-1">{idx}</div>
                <div
                  className={`w-10 h-10 flex items-center justify-center rounded border-2 font-mono text-sm transition-all ${bgColor}`}
                >
                  {char === ' ' ? '␣' : char}
                </div>
                {isLeft && (
                  <div className="text-xs text-blue-600 mt-1 font-medium">L</div>
                )}
                {isRight && (
                  <div className="text-xs text-green-600 mt-1 font-medium">R</div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Pointers Info */}
      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
        <div className="text-xs font-semibold text-gray-700 mb-2">Pointers</div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <div className="text-xs text-gray-600 font-medium mb-1">Left Pointer</div>
            <div className="text-lg font-bold text-blue-600">
              {step ? step.left : 0}
            </div>
            {step && (
              <div className="text-xs text-gray-500 mt-1">
                Char: '{step.leftChar}'
              </div>
            )}
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <div className="text-xs text-gray-600 font-medium mb-1">Right Pointer</div>
            <div className="text-lg font-bold text-green-600">
              {step ? step.right : input.length - 1}
            </div>
            {step && (
              <div className="text-xs text-gray-500 mt-1">
                Char: '{step.rightChar}'
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Current Step Info */}
      {step && (
        <div className={`border rounded-lg p-4 ${
          step.isMatch === false 
            ? 'border-red-200 bg-red-50'
            : step.isMatch 
            ? 'border-green-200 bg-green-50'
            : 'border-gray-200 bg-white'
        }`}>
          <div className={`text-sm font-medium ${
            step.isMatch === false 
              ? 'text-red-700'
              : step.isMatch 
              ? 'text-green-700'
              : 'text-gray-700'
          }`}>
            {step.message}
          </div>
        </div>
      )}

      {/* Result */}
      {currentStep >= steps.length - 1 && result !== null && (
        <div className={`border-2 rounded-lg p-4 ${
          result 
            ? 'border-green-500 bg-green-50'
            : 'border-red-500 bg-red-50'
        }`}>
          <div className={`text-lg font-bold ${
            result ? 'text-green-700' : 'text-red-700'
          }`}>
            {result ? '✓ Valid Palindrome' : '✗ Not a Palindrome'}
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
          className="px-6 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800"
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
            className="bg-black h-1.5 rounded-full transition-all"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
