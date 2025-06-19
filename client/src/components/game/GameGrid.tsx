import { usePuzzle } from "../../lib/stores/usePuzzle";
import GameCell from "./GameCell";
import HintCell from "./HintCell";
import { Card } from "../ui/card";

export default function GameGrid() {
  const { grid, hints, updateCell, violations } = usePuzzle();

  return (
    <Card className="p-4 border-2 border-black">
      <div className="relative w-fit mx-auto">
        {/* Main 6x6 grid of cells */}
        <div className="grid grid-cols-6 gap-2">
          {Array.from({ length: 6 }, (_, row) => 
            Array.from({ length: 6 }, (_, col) => {
              const cellValue = grid[row][col];
              const hasViolation = violations.some(v => 
                v.type === 'cell' && v.row === row && v.col === col
              );
              
              return (
                <GameCell
                  key={`${row}-${col}`}
                  value={cellValue}
                  onClick={() => updateCell(row, col)}
                  hasViolation={hasViolation}
                />
              );
            })
          )}
        </div>
        
        {/* Horizontal hints positioned between cells */}
        {Array.from({ length: 6 }, (_, row) => 
          Array.from({ length: 5 }, (_, hintCol) => {
            const hint = hints.horizontal[row]?.[hintCol];
            if (!hint) return null;
            
            // Calculate position: after the left cell + center in the 8px gap
            const leftPosition = 48 + hintCol * 56 + 2; // 48px cell + gap center (4px) - hint center (2px)
            const topPosition = row * 56 + 22; // Center in cell height
            
            return (
              <div
                key={`h-${row}-${hintCol}`}
                className="absolute z-10"
                style={{
                  left: `${leftPosition}px`,
                  top: `${topPosition}px`,
                }}
              >
                <HintCell hint={hint} direction="horizontal" />
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
}
