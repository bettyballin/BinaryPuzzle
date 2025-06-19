import { cn } from "../../lib/utils";

export type CellValue = 'empty' | 'sun' | 'moon';

interface GameCellProps {
  value: CellValue;
  onClick: () => void;
  hasViolation?: boolean;
}

export default function GameCell({ value, onClick, hasViolation }: GameCellProps) {
  const getCellContent = () => {
    switch (value) {
      case 'sun':
        return (
          <div className="w-8 h-8 bg-yellow-500 rounded-full shadow-lg transform transition-all duration-200 hover:scale-110" 
               style={{ 
                 boxShadow: '0 4px 8px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.3)' 
               }} />
        );
      case 'moon':
        return (
          <div className="w-8 h-8 bg-blue-600 rounded-full shadow-lg transform transition-all duration-200 hover:scale-110"
               style={{ 
                 boxShadow: '0 4px 8px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.2)' 
               }} />
        );
      default:
        return null;
    }
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-12 h-12 border-2 rounded-lg flex items-center justify-center transition-all duration-200 transform hover:scale-105",
        {
          "border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100 shadow-md": !hasViolation,
          "border-red-500 bg-red-100 animate-pulse shadow-lg": hasViolation,
        }
      )}
      style={{
        boxShadow: hasViolation 
          ? '0 0 20px rgba(239, 68, 68, 0.4)' 
          : '0 2px 8px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.8)'
      }}
      title={`Click to cycle through sun/moon/empty. Current: ${value}`}
    >
      {getCellContent()}
    </button>
  );
}
