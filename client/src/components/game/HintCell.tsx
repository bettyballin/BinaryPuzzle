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
    return <div className="w-8 h-8" />;
  }

  return (
    <div
      className="w-8 h-8 flex items-center justify-center text-lg font-bold rounded text-black bg-gray-100"
      title={`Hint: Adjacent cells should be ${hint}`}
    >
      {getSymbol()}
    </div>
  );
}
