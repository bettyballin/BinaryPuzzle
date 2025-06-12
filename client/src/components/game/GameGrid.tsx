import { usePuzzle } from "../../lib/stores/usePuzzle";
import GameCell from "./GameCell";
import HintCell from "./HintCell";
import { Card } from "../ui/card";

export default function GameGrid() {
  const { grid, hints, updateCell, violations } = usePuzzle();

  return (
    <Card className="p-4">
      <div className="grid grid-cols-11 gap-1 w-fit mx-auto">
        {/* Grid rendering with hints interspersed */}
        {Array.from({ length: 6 }, (_, row) => (
          Array.from({ length: 11 }, (_, col) => {
            const key = `${row}-${col}`;
            
            // Even columns are game cells, odd columns are hints
            if (col % 2 === 0) {
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
              const hintCol = Math.floor(col / 2);
              if (hintCol < 5) {
                const hint = hints.horizontal[row]?.[hintCol];
                return (
                  <HintCell
                    key={key}
                    hint={hint}
                    direction="horizontal"
                  />
                );
              }
              return <div key={key} className="w-8 h-8" />;
            }
          })
        )).flat()}
        

      </div>
    </Card>
  );
}
