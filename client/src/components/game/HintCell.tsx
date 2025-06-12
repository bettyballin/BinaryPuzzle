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
      className={cn(
        "w-8 h-8 flex items-center justify-center text-lg font-bold rounded",
        {
          "text-green-600 bg-green-50": hint === 'same',
          "text-red-600 bg-red-50": hint === 'different',
        }
      )}
      title={`Hint: Adjacent cells should be ${hint}`}
    >
      {getSymbol()}
    </div>
  );
}
