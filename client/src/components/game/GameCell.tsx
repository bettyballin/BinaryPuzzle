import { cn } from "../../lib/utils";

export type CellValue = 'empty' | 'sun' | 'moon';

interface GameCellProps {
  value: CellValue;
  onClick: () => void;
  hasViolation?: boolean;
}

export default function GameCell({ value, onClick, hasViolation }: GameCellProps) {
  const getSymbol = () => {
    switch (value) {
      case 'sun':
        return '☀️';
      case 'moon':
        return <span className="text-blue-600">🌙</span>;
      default:
        return '';
    }
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-12 h-12 border-2 rounded-md flex items-center justify-center text-2xl transition-all duration-150 hover:scale-105 hover:shadow-md",
        {
          "border-gray-400 bg-white hover:border-gray-600": !hasViolation,
          "border-red-500 bg-red-100 animate-pulse": hasViolation,
        }
      )}
      title={`Click to cycle through sun/moon/empty. Current: ${value}`}
    >
      <span className="select-none">{getSymbol()}</span>
    </button>
  );
}
