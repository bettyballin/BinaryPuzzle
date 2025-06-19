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
  
  // Check vertical hints (these don't exist in this puzzle type, removing faulty logic)
  
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

function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function generateValidRow(): CellValue[] {
  // Generate a valid row with exactly 3 suns and 3 moons, no 3+ consecutive
  const attempts = 1000;
  
  for (let attempt = 0; attempt < attempts; attempt++) {
    const row = shuffle(['sun', 'sun', 'sun', 'moon', 'moon', 'moon'] as CellValue[]);
    
    // Check for no more than 2 consecutive
    let hasThreeConsecutive = false;
    for (let i = 0; i < 4; i++) {
      if (row[i] === row[i + 1] && row[i] === row[i + 2]) {
        hasThreeConsecutive = true;
        break;
      }
    }
    
    if (!hasThreeConsecutive) {
      return row;
    }
  }
  
  // Fallback pattern if random generation fails
  return ['sun', 'moon', 'sun', 'moon', 'sun', 'moon'];
}

function isValidGrid(grid: CellValue[][]): boolean {
  // Check each row has exactly 3 suns and 3 moons
  for (let row = 0; row < 6; row++) {
    const sunCount = grid[row].filter(cell => cell === 'sun').length;
    const moonCount = grid[row].filter(cell => cell === 'moon').length;
    if (sunCount !== 3 || moonCount !== 3) return false;
    
    // Check no 3+ consecutive in row
    for (let col = 0; col < 4; col++) {
      if (grid[row][col] === grid[row][col + 1] && 
          grid[row][col] === grid[row][col + 2]) {
        return false;
      }
    }
  }
  
  // Check each column has exactly 3 suns and 3 moons
  for (let col = 0; col < 6; col++) {
    const sunCount = grid.map(row => row[col]).filter(cell => cell === 'sun').length;
    const moonCount = grid.map(row => row[col]).filter(cell => cell === 'moon').length;
    if (sunCount !== 3 || moonCount !== 3) return false;
    
    // Check no 3+ consecutive in column
    for (let row = 0; row < 4; row++) {
      if (grid[row][col] === grid[row + 1][col] && 
          grid[row][col] === grid[row + 2][col]) {
        return false;
      }
    }
  }
  
  return true;
}

function generateRandomSolution(): CellValue[][] {
  const maxAttempts = 1000;
  
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const grid: CellValue[][] = [];
    
    // Generate rows one by one
    for (let row = 0; row < 6; row++) {
      grid[row] = generateValidRow();
    }
    
    if (isValidGrid(grid)) {
      return grid;
    }
  }
  
  // Fallback to alternating pattern if random generation fails
  return [
    ['moon', 'sun', 'moon', 'sun', 'moon', 'sun'],
    ['sun', 'moon', 'sun', 'moon', 'sun', 'moon'],
    ['moon', 'sun', 'moon', 'sun', 'moon', 'sun'],
    ['sun', 'moon', 'sun', 'moon', 'sun', 'moon'],
    ['moon', 'sun', 'moon', 'sun', 'moon', 'sun'],
    ['sun', 'moon', 'sun', 'moon', 'sun', 'moon']
  ];
}

export function generatePuzzle(): {
  grid: CellValue[][];
  hints: { horizontal: (HintValue | null)[][]; vertical: (HintValue | null)[] };
  solution: CellValue[][];
} {
  // Generate a random valid solution
  const solution = generateRandomSolution();
  
  // Create starting grid with some cells filled strategically
  const grid: CellValue[][] = Array(6).fill(null).map(() => Array(6).fill('empty'));
  
  // Place some strategic starting cells (about 15-20% filled)
  const cellsToFill = Math.floor(Math.random() * 8) + 6; // 6-13 cells
  const positions = [];
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 6; col++) {
      positions.push([row, col]);
    }
  }
  
  const selectedPositions = shuffle(positions).slice(0, cellsToFill);
  selectedPositions.forEach(([row, col]) => {
    grid[row][col] = solution[row][col];
  });
  
  // Generate hints based on solution
  const horizontal: (HintValue | null)[][] = [];
  for (let row = 0; row < 6; row++) {
    horizontal[row] = [];
    for (let col = 0; col < 5; col++) {
      // Randomly decide whether to show a hint (about 60% chance)
      if (Math.random() < 0.6) {
        const leftCell = solution[row][col];
        const rightCell = solution[row][col + 1];
        horizontal[row][col] = leftCell === rightCell ? 'same' : 'different';
      } else {
        horizontal[row][col] = null;
      }
    }
  }
  
  const vertical: (HintValue | null)[] = [null, null, null, null, null, null];
  
  return { grid, hints: { horizontal, vertical }, solution };
}

export function generateHints(): { 
  horizontal: (HintValue | null)[][]; 
  vertical: (HintValue | null)[] 
} {
  const puzzle = generatePuzzle();
  return puzzle.hints;
}
