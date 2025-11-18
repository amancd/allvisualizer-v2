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
      {/* Visualization */}
      <div className="bg-white border-2 border-gray-300 rounded-lg p-6">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Stock Prices Visualization</h3>
          
          {/* Bar Chart */}
          <div className="flex items-end justify-between gap-2 h-80 mb-4 border-b-2 border-gray-400 pb-2">
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
                  {isBuyDay && <div className="text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded">BUY</div>}
                  {isSellDay && <div className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded">SELL</div>}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 justify-center text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-300 rounded"></div>
              <span className="text-gray-600">Not Visited</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-400 rounded"></div>
              <span className="text-gray-600">Current</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-400 rounded"></div>
              <span className="text-gray-600">Visited</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-gray-600">Best Buy</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span className="text-gray-600">Best Sell</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="text-sm text-green-700 font-medium">Min Price</div>
            <div className="text-2xl font-bold text-green-900">
              {minPrice === Infinity ? '-' : `$${minPrice}`}
            </div>
            {buyDay >= 0 && <div className="text-xs text-green-600 mt-1">Day {buyDay}</div>}
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="text-sm text-blue-700 font-medium">Max Profit</div>
            <div className="text-2xl font-bold text-blue-900">${maxProfit}</div>
            {sellDay >= 0 && buyDay >= 0 && (
              <div className="text-xs text-blue-600 mt-1">
                ${prices[sellDay]} - ${prices[buyDay]}
              </div>
            )}
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="text-sm text-purple-700 font-medium">Current Index</div>
            <div className="text-2xl font-bold text-purple-900">
              {currentIndex > 0 ? currentIndex - 1 : '-'}
            </div>
            {currentIndex > 0 && currentIndex <= prices.length && (
              <div className="text-xs text-purple-600 mt-1">
                Price: ${prices[currentIndex - 1]}
              </div>
            )}
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="text-sm text-orange-700 font-medium">Progress</div>
            <div className="text-2xl font-bold text-orange-900">
              {currentIndex}/{prices.length}
            </div>
            <div className="text-xs text-orange-600 mt-1">
              {Math.round((currentIndex / prices.length) * 100)}%
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white border-2 border-gray-300 rounded-lg p-6 space-y-4">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            disabled={currentIndex >= prices.length}
            className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isPlaying ? 'Pause' : currentIndex >= prices.length ? 'Completed' : 'Play'}
          </button>
          <button
            onClick={step}
            disabled={isPlaying || currentIndex >= prices.length}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Step
          </button>
          <button
            onClick={reset}
            className="px-6 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Reset
          </button>
        </div>

        {/* Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Stock Prices (comma-separated)
          </label>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black"
            placeholder="7, 1, 5, 3, 6, 4"
            disabled={isPlaying}
          />
          <p className="text-xs text-gray-500 mt-1">
            Enter stock prices for each day
          </p>
        </div>

        {/* Speed Control */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Animation Speed: {speed}ms
          </label>
          <input
            type="range"
            min="200"
            max="2000"
            step="100"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Fast (200ms)</span>
            <span>Slow (2000ms)</span>
          </div>
        </div>
      </div>

      {/* Algorithm Explanation */}
      <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">How It Works</h3>
        <div className="space-y-3 text-gray-700">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">1</div>
            <div>
              <p className="font-semibold text-gray-900">Track Minimum Price</p>
              <p className="text-sm">Keep track of the lowest price seen so far as we iterate through the array.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">2</div>
            <div>
              <p className="font-semibold text-gray-900">Calculate Potential Profit</p>
              <p className="text-sm">For each price, calculate the profit if we sell at this price (current price - minimum price).</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">3</div>
            <div>
              <p className="font-semibold text-gray-900">Update Maximum Profit</p>
              <p className="text-sm">If the potential profit is greater than our current maximum, update it.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">4</div>
            <div>
              <p className="font-semibold text-gray-900">Single Pass Solution</p>
              <p className="text-sm">We only need one pass through the array, making this an O(n) solution.</p>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-white rounded-lg border border-gray-300">
          <h4 className="font-semibold text-gray-900 mb-2">Key Insight</h4>
          <p className="text-sm text-gray-700">
            To maximize profit, we want to buy at the <span className="font-semibold text-green-600">lowest price</span> and 
            sell at the <span className="font-semibold text-blue-600">highest price after that</span>. By tracking the minimum 
            price as we go, we can calculate the maximum profit in a single pass.
          </p>
        </div>
      </div>
    </div>
  );
}
