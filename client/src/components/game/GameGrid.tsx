import { usePuzzle } from "../../lib/stores/usePuzzle";
import GameCell from "./GameCell";
import HintCell from "./HintCell";
import { Card } from "../ui/card";

export default function GameGrid() {
  const { grid, hints, updateCell, violations } = usePuzzle();

  return (
    <div className="relative">
      {/* 3D Base Platform */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-gray-300 to-gray-500 rounded-xl transform translate-y-2 translate-x-2"
        style={{ filter: 'blur(2px)' }}
      />
      
      <Card 
        className="relative p-6 border-2 border-black bg-gradient-to-br from-white to-gray-100 rounded-xl"
        style={{
          boxShadow: '0 8px 25px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.8)'
        }}
      >
        <div className="w-fit mx-auto">
          {/* Grid with cells and hints interspersed */}
          <div 
            className="grid gap-1 p-4 rounded-lg bg-gradient-to-br from-gray-50 to-white border border-gray-200"
            style={{ 
              gridTemplateColumns: 'repeat(11, auto)',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
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
    </div>
  );
}
