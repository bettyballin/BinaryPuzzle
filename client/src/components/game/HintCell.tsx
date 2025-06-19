import { cn } from "../../lib/utils";

export type HintValue = 'same' | 'different' | null;

interface HintCellProps {
  hint: HintValue;
  direction: 'horizontal' | 'vertical';
}

export default function HintCell({ hint, direction }: HintCellProps) {
  const getSymbol = () => {
    switch (hint) {
      case 'same':
        return '=';
      case 'different':
        return '×';
      default:
        return '';
    }
  };

  if (!hint) {
    return null;
  }

  return (
    <div
      className="w-4 h-4 flex items-center justify-center text-xs font-bold text-black bg-gray-300 rounded-full border border-gray-400 transform transition-all duration-200 hover:scale-110"
      style={{
        boxShadow: '0 2px 4px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.6)'
      }}
      title={`Hint: Adjacent cells should be ${hint}`}
    >
      {getSymbol()}
    </div>
  );
}
