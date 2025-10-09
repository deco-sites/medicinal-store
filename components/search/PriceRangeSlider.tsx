import { useEffect, useState } from "preact/hooks";
import { formatPrice } from "../../sdk/format.ts";

interface PriceRangeSliderProps {
  minPrice: number;
  maxPrice: number;
  currentMin?: number;
  currentMax?: number;
  onApply: (min: number, max: number) => void;
  onClear: () => void;
}

export default function PriceRangeSlider({
  minPrice,
  maxPrice,
  currentMin = minPrice,
  currentMax = maxPrice,
  onApply,
  onClear,
}: PriceRangeSliderProps) {
  const [minValue, setMinValue] = useState(currentMin);
  const [maxValue, setMaxValue] = useState(currentMax);

  useEffect(() => {
    setMinValue(currentMin);
    setMaxValue(currentMax);
  }, [currentMin, currentMax]);

  const handleMinChange = (value: number) => {
    const newMin = Math.min(value, maxValue - 1);
    setMinValue(newMin);
  };

  const handleMaxChange = (value: number) => {
    const newMax = Math.max(value, minValue + 1);
    setMaxValue(newMax);
  };

  const handleApply = () => {
    onApply(minValue, maxValue);
  };

  const handleClear = () => {
    setMinValue(minPrice);
    setMaxValue(maxPrice);
    onClear();
  };

  const minPercent = ((minValue - minPrice) / (maxPrice - minPrice)) * 100;
  const maxPercent = ((maxValue - minPrice) / (maxPrice - minPrice)) * 100;

  return (
    <div class="flex flex-col gap-4 p-4">
      {/* Display valores atuais */}
      <div class="flex justify-between text-sm font-medium">
        <span>{formatPrice(minValue)}</span>
        <span>{formatPrice(maxValue)}</span>
      </div>

      {/* Container do slider */}
      <div class="relative">
        {/* Track de fundo */}
        <div class="w-full h-2 bg-gray-200 rounded-lg relative">
          {/* Track ativo */}
          <div
            class="absolute h-2 bg-primary rounded-lg"
            style={{
              left: `${minPercent}%`,
              width: `${maxPercent - minPercent}%`,
            }}
          />
        </div>

        {/* Sliders */}
        <div class="relative">
          <input
            type="range"
            min={minPrice}
            max={maxPrice}
            value={minValue}
            onInput={(e) =>
              handleMinChange(Number((e.target as HTMLInputElement).value))}
            class="absolute w-full h-2 bg-transparent appearance-none cursor-pointer slider-thumb"
            style={{ zIndex: 1 }}
          />
          <input
            type="range"
            min={minPrice}
            max={maxPrice}
            value={maxValue}
            onInput={(e) =>
              handleMaxChange(Number((e.target as HTMLInputElement).value))}
            class="absolute w-full h-2 bg-transparent appearance-none cursor-pointer slider-thumb"
            style={{ zIndex: 2 }}
          />
        </div>
      </div>

      {/* Inputs manuais */}
      <div class="flex gap-2">
        <div class="flex-1">
          <label class="text-xs text-gray-600">Mín</label>
          <input
            type="number"
            value={minValue}
            min={minPrice}
            max={maxValue - 1}
            onInput={(e) =>
              handleMinChange(Number((e.target as HTMLInputElement).value))}
            class="input input-bordered input-sm w-full"
          />
        </div>
        <div class="flex-1">
          <label class="text-xs text-gray-600">Máx</label>
          <input
            type="number"
            value={maxValue}
            min={minValue + 1}
            max={maxPrice}
            onInput={(e) =>
              handleMaxChange(Number((e.target as HTMLInputElement).value))}
            class="input input-bordered input-sm w-full"
          />
        </div>
      </div>

      {/* Botões */}
      <div class="flex gap-2">
        <button
          onClick={handleClear}
          class="btn btn-outline btn-sm flex-1"
        >
          Limpar
        </button>
        <button
          onClick={handleApply}
          class="btn btn-primary btn-sm flex-1"
        >
          Aplicar
        </button>
      </div>

      <style jsx>
        {`
        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #1f2937;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .slider-thumb::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #1f2937;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
      `}
      </style>
    </div>
  );
}
