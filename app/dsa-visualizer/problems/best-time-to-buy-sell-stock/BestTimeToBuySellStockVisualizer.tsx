'use client';

import { useState, useEffect } from 'react';

export default function BestTimeToBuySellStockVisualizer() {
  const [prices, setPrices] = useState<number[]>([7, 1, 5, 3, 6, 4]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [minPrice, setMinPrice] = useState(Infinity);
  const [maxProfit, setMaxProfit] = useState(0);
  const [buyDay, setBuyDay] = useState(-1);
  const [sellDay, setSellDay] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [inputValue, setInputValue] = useState('7, 1, 5, 3, 6, 4');

  const reset = () => {
    setCurrentIndex(0);
    setMinPrice(Infinity);
    setMaxProfit(0);
    setBuyDay(-1);
    setSellDay(-1);
    setIsPlaying(false);
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);
    const newPrices = value.split(',').map(v => parseInt(v.trim())).filter(v => !isNaN(v));
    if (newPrices.length > 0) {
      setPrices(newPrices);
      reset();
    }
  };

  const step = () => {
    if (currentIndex >= prices.length) {
      setIsPlaying(false);
      return;
    }

    const currentPrice = prices[currentIndex];
    
    if (currentPrice < minPrice) {
      setMinPrice(currentPrice);
      setBuyDay(currentIndex);
    } else if (currentPrice - minPrice > maxProfit) {
      setMaxProfit(currentPrice - minPrice);
      setSellDay(currentIndex);
    }
    
    setCurrentIndex(prev => prev + 1);
  };

  useEffect(() => {
    if (isPlaying && currentIndex < prices.length) {
      const timer = setTimeout(step, speed);
      return () => clearTimeout(timer);
    } else if (currentIndex >= prices.length) {
      setIsPlaying(false);
    }
  }, [isPlaying, currentIndex, speed]);

  const maxPrice = Math.max(...prices);
  const minPriceValue = Math.min(...prices);
  const getBarHeight = (price: number) => {
    // Ensure bars are always visible with minimum height
    const normalized = ((price - minPriceValue) / (maxPrice - minPriceValue)) * 80 + 20;
    return normalized;
  };

  return (
    <div className="space-y-6">
      {/* Input Controls */}
      <div className="flex gap-3 items-end">
        <div className="flex-1">
          <label className="text-xs font-medium text-gray-700 mb-1 block">Stock Prices (comma-separated)</label>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            placeholder="7, 1, 5, 3, 6, 4"
            disabled={isPlaying}
          />
        </div>
        <button
          onClick={reset}
          className="px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800"
        >
          Reset
        </button>
      </div>

      {/* Bar Chart Visualization */}
      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
        <div className="text-xs font-semibold text-gray-700 mb-3">Stock Prices</div>
          {/* Bar Chart */}
          <div className="flex items-end justify-between gap-2 h-80 mb-4">
            {prices.map((price, index) => {
              const isCurrent = index === currentIndex - 1;
              const isBuyDay = index === buyDay && sellDay >= 0;
              const isSellDay = index === sellDay;
              const isProcessed = index < currentIndex;
              
              let barColor = 'bg-gray-300';
              if (isBuyDay) barColor = 'bg-green-500';
              else if (isSellDay) barColor = 'bg-blue-500';
              else if (isCurrent) barColor = 'bg-yellow-400';
              else if (isProcessed) barColor = 'bg-gray-400';

              return (
                <div key={index} className="flex-1 flex flex-col items-center justify-end gap-2">
                  <div className="text-xs font-semibold text-gray-700 mb-1">${price}</div>
                  <div 
                    className={`w-full ${barColor} rounded-t transition-all duration-300 relative min-h-[20px]`}
                    style={{ height: `${getBarHeight(price)}%` }}
                  >
                    {isCurrent && (
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-yellow-600 animate-bounce text-xl">
                        ↓
                      </div>
                    )}
                  </div>
                  <div className={`text-xs font-medium mt-1 ${
                    isBuyDay ? 'text-green-600' : 
                    isSellDay ? 'text-blue-600' : 
                    isCurrent ? 'text-yellow-600' : 
                    'text-gray-500'
                  }`}>
                    Day {index}
                  </div>
                </div>
              );
            })}
          </div>
      </div>

      {/* Stats */}
      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
        <div className="text-xs font-semibold text-gray-700 mb-3">Statistics</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <div className="text-xs text-gray-600 font-medium">Min Price</div>
            <div className="text-xl font-bold text-green-600">
              {minPrice === Infinity ? '-' : `$${minPrice}`}
            </div>
            {buyDay >= 0 && <div className="text-xs text-gray-500 mt-1">Day {buyDay}</div>}
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <div className="text-xs text-gray-600 font-medium">Max Profit</div>
            <div className="text-xl font-bold text-blue-600">${maxProfit}</div>
            {sellDay >= 0 && buyDay >= 0 && (
              <div className="text-xs text-gray-500 mt-1">
                ${prices[sellDay]} - ${prices[buyDay]}
              </div>
            )}
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <div className="text-xs text-gray-600 font-medium">Current Index</div>
            <div className="text-xl font-bold text-purple-600">
              {currentIndex > 0 ? currentIndex - 1 : '-'}
            </div>
            {currentIndex > 0 && currentIndex <= prices.length && (
              <div className="text-xs text-gray-500 mt-1">
                Price: ${prices[currentIndex - 1]}
              </div>
            )}
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <div className="text-xs text-gray-600 font-medium">Progress</div>
            <div className="text-xl font-bold text-orange-600">
              {currentIndex}/{prices.length}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {Math.round((currentIndex / prices.length) * 100)}%
            </div>
          </div>
        </div>
      </div>

      {/* Current Step Info */}
      {currentIndex > 0 && currentIndex <= prices.length && (
        <div className="border border-gray-200 rounded-lg p-4 bg-white">
          <div className="text-sm text-gray-700">
            <div>Current Price: ${prices[currentIndex - 1]} (Day {currentIndex - 1})</div>
            <div className="text-xs text-gray-500 mt-1">
              Min Price: {minPrice === Infinity ? 'Not set' : `$${minPrice}`} | 
              Potential Profit: {minPrice === Infinity ? '-' : `$${prices[currentIndex - 1] - minPrice}`}
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex gap-2 justify-center">
        <button
          onClick={reset}
          disabled={currentIndex === 0}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
        >
          Reset
        </button>
        <button
          onClick={step}
          disabled={isPlaying || currentIndex >= prices.length}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
        >
          Step →
        </button>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          disabled={currentIndex >= prices.length}
          className="px-6 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
        >
          {isPlaying ? 'Pause' : currentIndex >= prices.length ? 'Completed' : 'Play'}
        </button>
      </div>

      {/* Progress */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-gray-600">
          <span>Day {currentIndex} / {prices.length}</span>
          <span>{Math.round((currentIndex / prices.length) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div
            className="bg-black h-1.5 rounded-full transition-all"
            style={{ width: `${(currentIndex / prices.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
