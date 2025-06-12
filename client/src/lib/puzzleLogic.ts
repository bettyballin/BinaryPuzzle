import { CellValue } from "../components/game/GameCell";
import { HintValue } from "../components/game/HintCell";

export interface Violation {
  type: 'row_count' | 'col_count' | 'consecutive' | 'hint' | 'cell';
  row?: number;
  col?: number;
  message: string;
}

export interface ValidationResult {
  violations: Violation[];
  isComplete: boolean;
}

export function validatePuzzle(
  grid: CellValue[][],
  hints: { horizontal: (HintValue | null)[][]; vertical: (HintValue | null)[] }
): ValidationResult {
  const violations: Violation[] = [];
  
  // Check row constraints
  for (let row = 0; row < 6; row++) {
    const suns = grid[row].filter(cell => cell === 'sun').length;
    const moons = grid[row].filter(cell => cell === 'moon').length;
    const filled = grid[row].filter(cell => cell !== 'empty').length;
    
    if (filled === 6) {
      if (suns !== 3) {
        violations.push({
          type: 'row_count',
          row,
          message: `Row ${row + 1} has ${suns} suns (needs 3)`
        });
      }
      if (moons !== 3) {
        violations.push({
          type: 'row_count',
          row,
          message: `Row ${row + 1} has ${moons} moons (needs 3)`
        });
      }
    } else if (suns > 3 || moons > 3) {
      violations.push({
        type: 'row_count',
        row,
        message: `Row ${row + 1} has too many symbols`
      });
    }
    
    // Check consecutive symbols
    for (let col = 0; col < 4; col++) {
      if (grid[row][col] !== 'empty' && 
          grid[row][col] === grid[row][col + 1] && 
          grid[row][col] === grid[row][col + 2]) {
        violations.push({
          type: 'consecutive',
          row,
          col,
          message: `Row ${row + 1} has 3+ consecutive ${grid[row][col]}s`
        });
      }
    }
  }
  
  // Check column constraints
  for (let col = 0; col < 6; col++) {
    const columnCells = grid.map(row => row[col]);
    const suns = columnCells.filter(cell => cell === 'sun').length;
    const moons = columnCells.filter(cell => cell === 'moon').length;
    const filled = columnCells.filter(cell => cell !== 'empty').length;
    
    if (filled === 6) {
      if (suns !== 3) {
        violations.push({
          type: 'col_count',
          col,
          message: `Column ${col + 1} has ${suns} suns (needs 3)`
        });
      }
      if (moons !== 3) {
        violations.push({
          type: 'col_count',
          col,
          message: `Column ${col + 1} has ${moons} moons (needs 3)`
        });
      }
    } else if (suns > 3 || moons > 3) {
      violations.push({
        type: 'col_count',
        col,
        message: `Column ${col + 1} has too many symbols`
      });
    }
    
    // Check consecutive symbols
    for (let row = 0; row < 4; row++) {
      if (grid[row][col] !== 'empty' && 
          grid[row][col] === grid[row + 1][col] && 
          grid[row][col] === grid[row + 2][col]) {
        violations.push({
          type: 'consecutive',
          row,
          col,
          message: `Column ${col + 1} has 3+ consecutive ${grid[row][col]}s`
        });
      }
    }
  }
  
  // Check horizontal hints
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 5; col++) {
      const hint = hints.horizontal[row]?.[col];
      if (hint && grid[row][col] !== 'empty' && grid[row][col + 1] !== 'empty') {
        const leftCell = grid[row][col];
        const rightCell = grid[row][col + 1];
        
        if (hint === 'same' && leftCell !== rightCell) {
          violations.push({
            type: 'hint',
            row,
            col,
            message: `Hint violated: cells should be same`
          });
        }
        
        if (hint === 'different' && leftCell === rightCell) {
          violations.push({
            type: 'hint',
            row,
            col,
            message: `Hint violated: cells should be different`
          });
        }
      }
    }
  }
  
  // Check vertical hints
  for (let col = 0; col < 6; col++) {
    const hint = hints.vertical[col];
    if (hint && grid[5][col] !== 'empty' && col < 5 && grid[5][col + 1] !== 'empty') {
      const topCell = grid[5][col];
      const bottomCell = grid[5][col + 1];
      
      if (hint === 'same' && topCell !== bottomCell) {
        violations.push({
          type: 'hint',
          row: 5,
          col,
          message: `Vertical hint violated: cells should be same`
        });
      }
      
      if (hint === 'different' && topCell === bottomCell) {
        violations.push({
          type: 'hint',
          row: 5,
          col,
          message: `Vertical hint violated: cells should be different`
        });
      }
    }
  }
  
  // Mark cells with violations
  violations.forEach(violation => {
    if (violation.row !== undefined && violation.col !== undefined) {
      violations.push({
        type: 'cell',
        row: violation.row,
        col: violation.col,
        message: 'Cell has constraint violation'
      });
    }
  });
  
  // Check if puzzle is complete
  const allFilled = grid.every(row => row.every(cell => cell !== 'empty'));
  const isComplete = allFilled && violations.filter(v => v.type !== 'cell').length === 0;
  
  return { violations, isComplete };
}

export function generatePuzzle(): {
  grid: CellValue[][];
  hints: { horizontal: (HintValue | null)[][]; vertical: (HintValue | null)[] };
} {
  // Create a puzzle with strategic initial placements - like a real logic puzzle
  const grid: CellValue[][] = [
    ['empty', 'empty', 'empty', 'sun', 'empty', 'empty'],
    ['moon', 'empty', 'empty', 'empty', 'empty', 'empty'],
    ['empty', 'empty', 'empty', 'empty', 'moon', 'empty'],
    ['empty', 'sun', 'empty', 'empty', 'empty', 'empty'],
    ['empty', 'empty', 'empty', 'empty', 'empty', 'sun'],
    ['empty', 'empty', 'moon', 'empty', 'empty', 'empty']
  ];
  
  // Create strategic hints to guide the puzzle solving
  const horizontal: (HintValue | null)[][] = [
    [null, 'different', 'different', null, null],
    [null, null, 'same', null, 'different'],
    ['different', null, null, 'different', null],
    ['different', null, 'different', null, null],
    [null, 'different', null, null, 'different'],
    [null, 'different', null, 'same', null]
  ];
  
  const vertical: (HintValue | null)[] = [
    'different', null, 'different', null, 'same', null
  ];
  
  return { grid, hints: { horizontal, vertical } };
}

export function generateHints(): { 
  horizontal: (HintValue | null)[][]; 
  vertical: (HintValue | null)[] 
} {
  const puzzle = generatePuzzle();
  return puzzle.hints;
}
