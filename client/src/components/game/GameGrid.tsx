import { usePuzzle } from "../../lib/stores/usePuzzle";
import GameCell from "./GameCell";
import HintCell from "./HintCell";
import { Card } from "../ui/card";

export default function GameGrid() {
  const { grid, hints, updateCell, violations } = usePuzzle();

  return (
    <Card className="p-4 border-2 border-black">
      <div className="w-fit mx-auto">
        {/* Grid with cells and hints interspersed */}
        <div className="grid gap-0" style={{ gridTemplateColumns: 'repeat(11, auto)' }}>
          {Array.from({ length: 6 }, (_, row) => 
            Array.from({ length: 11 }, (_, col) => {
              const key = `${row}-${col}`;
              
              if (col % 2 === 0) {
                // Even columns: game cells
                const cellCol = col / 2;
                const cellValue = grid[row][cellCol];
                const hasViolation = violations.some(v => 
                  v.type === 'cell' && v.row === row && v.col === cellCol
                );
                
                return (
                  <GameCell
                    key={key}
                    value={cellValue}
                    onClick={() => updateCell(row, cellCol)}
                    hasViolation={hasViolation}
                  />
                );
              } else {
                // Odd columns: horizontal hints
                const hintCol = Math.floor(col / 2);
                if (hintCol < 5) {
                  const hint = hints.horizontal[row]?.[hintCol];
                  return (
                    <div key={key} className="w-2 h-12 flex items-center justify-center">
                      {hint && <HintCell hint={hint} direction="horizontal" />}
                    </div>
                  );
                }
                return <div key={key} />;
              }
            })
          )}
        </div>
      </div>
    </Card>
  );
}
