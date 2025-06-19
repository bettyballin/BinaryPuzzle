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
      className="w-4 h-4 flex items-center justify-center text-xs font-bold text-black bg-gray-200 rounded-sm"
      title={`Hint: Adjacent cells should be ${hint}`}
    >
      {getSymbol()}
    </div>
  );
}
