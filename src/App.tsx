import React, { useState, useMemo } from 'react';
import { Plus, Minus, RotateCcw, Package, Info, Scale } from 'lucide-react';

// Data
const HippoIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 512 512" 
    fill="currentColor" 
    className={className}
  >
    <path d="M424.6 200.5c-13.6-18.2-31.5-32.9-51.9-42.5-16.7-7.9-35.1-12.6-54.2-13.8-1.5-.1-3-.1-4.5-.1h-116c-1.5 0-3 0-4.5.1-19.1 1.2-37.5 5.9-54.2 13.8-20.4 9.6-38.3 24.3-51.9 42.5-15.6 20.8-25.7 45.4-29.3 71.5-1.1 8-1.7 16.2-1.7 24.5v35.5c0 30.9 25.1 56 56 56h16v16c0 22.1 17.9 40 40 40h32c22.1 0 40-17.9 40-40v-16h112v16c0 22.1 17.9 40 40 40h32c22.1 0 40-17.9 40-40v-16h16c30.9 0 56-25.1 56-56v-35.5c0-8.3-.6-16.5-1.7-24.5-3.6-26.1-13.7-50.7-29.3-71.5zM168 288c-13.3 0-24-10.7-24-24s10.7-24 24-24 24 10.7 24 24-10.7 24-24 24zm176 0c-13.3 0-24-10.7-24-24s10.7-24 24-24 24 10.7 24 24-10.7 24-24 24z"/>
  </svg>
);

const CATEGORIES = [
  {
    name: "Clothing & Accessories",
    items: [
      { id: 'shoes_no_box', name: 'Shoes (No Box)', weight: 1.2 },
      { id: 'shoes_with_box', name: 'Shoes (With Box)', weight: 1.5 },
      { id: 'tshirt', name: 'T-Shirt', weight: 0.3 },
      { id: 'hoodie', name: 'Hoodie', weight: 0.8 },
      { id: 'jacket', name: 'Jacket', weight: 1.2 },
      { id: 'down_jacket', name: 'Down Jacket', weight: 2.0 },
      { id: 'pants', name: 'Pants', weight: 0.7 },
      { id: 'jeans', name: 'Jeans', weight: 1.0 },
      { id: 'cap', name: 'Cap', weight: 0.2 },
      { id: 'belt', name: 'Belt', weight: 0.3 },
    ]
  },
  {
    name: "Bags & Others",
    items: [
      { id: 'backpack', name: 'Backpack', weight: 1.0 },
      { id: 'shoulder_bag', name: 'Shoulder Bag', weight: 0.6 },
      { id: 'socks', name: 'Socks (3–5 pairs)', weight: 0.3 },
      { id: 'underwear', name: 'Underwear', weight: 0.2 },
      { id: 'sunglasses', name: 'Sunglasses (with case)', weight: 0.3 },
      { id: 'watch', name: 'Watch', weight: 0.3 },
      { id: 'airpods', name: 'AirPods (with charging case)', weight: 0.2 },
    ]
  }
];

export default function App() {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [otherWeight, setOtherWeight] = useState<number>(0);

  const handleQuantityChange = (id: string, delta: number) => {
    setQuantities(prev => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const { [id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: next };
    });
  };

  const handleManualInput = (id: string, value: string) => {
    if (value === '') {
      setQuantities(prev => {
        const { [id]: _, ...rest } = prev;
        return rest;
      });
      return;
    }
    const num = parseInt(value, 10);
    if (isNaN(num) || num < 0) return;
    
    setQuantities(prev => {
      if (num === 0) {
        const { [id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: num };
    });
  };

  const handleAddOther = (weight: number) => {
    setOtherWeight(prev => prev + weight);
  };

  const handleReset = () => {
    setQuantities({});
    setOtherWeight(0);
  };

  const totalWeight = useMemo(() => {
    let total = otherWeight;
    CATEGORIES.forEach(category => {
      category.items.forEach(item => {
        if (quantities[item.id]) {
          total += quantities[item.id] * item.weight;
        }
      });
    });
    return total;
  }, [quantities, otherWeight]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-24 md:pb-0">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-slate-800">Hipobuy</h1>
              <HippoIcon className="w-8 h-8 text-blue-400" />
            </div>
            <div className="h-5 w-px bg-slate-200 mx-1 hidden sm:block"></div>
            <div className="hidden sm:flex items-center gap-1.5 text-slate-500">
              <Package className="w-5 h-5" />
              <span className="text-sm font-medium">Shipping Weight Estimator</span>
            </div>
          </div>
          <button 
            onClick={handleReset}
            className="text-sm font-medium text-slate-500 hover:text-slate-800 flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Clear All</span>
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
        {/* Left Column: Items */}
        <div className="flex-1 space-y-8">
          {CATEGORIES.map((category) => (
            <section key={category.name}>
              <h2 className="text-lg font-semibold text-slate-800 mb-4">{category.name}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {category.items.map((item) => (
                  <div 
                    key={item.id} 
                    className={`bg-white p-4 rounded-xl border transition-all ${quantities[item.id] ? 'border-blue-300 shadow-sm ring-1 ring-blue-100' : 'border-slate-200 shadow-sm hover:border-slate-300'}`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className="font-medium text-slate-700">{item.name}</span>
                      <span className="text-sm text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">{item.weight} kg</span>
                    </div>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Quantity</span>
                      <div className="flex items-center gap-1 bg-slate-50 rounded-lg p-1 border border-slate-200">
                        <button 
                          onClick={() => handleQuantityChange(item.id, -1)}
                          className="w-8 h-8 flex items-center justify-center rounded-md text-slate-500 hover:bg-white hover:text-slate-800 hover:shadow-sm transition-all disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:shadow-none"
                          disabled={!quantities[item.id]}
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <input 
                          type="number" 
                          min="0"
                          value={quantities[item.id] || ''}
                          onChange={(e) => handleManualInput(item.id, e.target.value)}
                          placeholder="0"
                          className="w-10 text-center bg-transparent text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-sm hide-arrows"
                        />
                        <button 
                          onClick={() => handleQuantityChange(item.id, 1)}
                          className="w-8 h-8 flex items-center justify-center rounded-md text-slate-500 hover:bg-white hover:text-slate-800 hover:shadow-sm transition-all"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Right Column: Sticky Summary */}
        <div className="w-full md:w-80 shrink-0">
          <div className="sticky top-24 space-y-4">
            {/* Other Items */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <Plus className="w-4 h-4 text-blue-500" />
                Other Items
              </h3>
              <p className="text-sm text-slate-500 mb-4">Add custom weight for items not listed above.</p>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => handleAddOther(0.05)}
                  className="py-2 px-3 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-sm font-medium transition-colors border border-blue-100"
                >
                  + 50g
                </button>
                <button 
                  onClick={() => handleAddOther(0.1)}
                  className="py-2 px-3 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-sm font-medium transition-colors border border-blue-100"
                >
                  + 100g
                </button>
              </div>
              {otherWeight > 0 && (
                <div className="mt-3 flex justify-between items-center text-sm">
                  <span className="text-slate-500">Added:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-700">{otherWeight.toFixed(2)} kg</span>
                    <button 
                      onClick={() => setOtherWeight(0)}
                      className="text-slate-400 hover:text-red-500 transition-colors"
                      title="Clear other weight"
                    >
                      <RotateCcw className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Total Result */}
            <div className="bg-blue-600 text-white p-6 rounded-2xl shadow-md">
              <div className="flex items-center gap-2 text-blue-100 mb-2">
                <Scale className="w-5 h-5" />
                <h3 className="font-medium">Total Estimated Weight</h3>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-bold tracking-tight">{totalWeight.toFixed(2)}</span>
                <span className="text-xl text-blue-200 font-medium">kg</span>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-amber-50 border border-amber-200/60 p-4 rounded-xl flex gap-3 text-amber-800">
              <Info className="w-5 h-5 shrink-0 text-amber-600 mt-0.5" />
              <p className="text-sm leading-relaxed">
                Weights are estimated. Final shipping cost is based on warehouse packaging (usually lower).
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Sticky Bottom Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-30 flex justify-between items-center">
        <div>
          <div className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-0.5">Total Weight</div>
          <div className="text-2xl font-bold text-blue-600">{totalWeight.toFixed(2)} <span className="text-sm text-slate-500 font-normal">kg</span></div>
        </div>
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium"
        >
          View Details
        </button>
      </div>
    </div>
  );
}
