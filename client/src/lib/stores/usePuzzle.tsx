import { create } from "zustand";
import { CellValue } from "../../components/game/GameCell";
import { HintValue } from "../../components/game/HintCell";
import { validatePuzzle, generatePuzzle, Violation } from "../puzzleLogic";

interface PuzzleState {
  grid: CellValue[][];
  hints: {
    horizontal: (HintValue | null)[][];
    vertical: (HintValue | null)[];
  };
  solution: CellValue[][];
  violations: Violation[];
  isComplete: boolean;
  
  updateCell: (row: number, col: number) => void;
  reset: () => void;
  getNextHint: () => { row: number; col: number; value: CellValue } | null;
}

const createEmptyGrid = (): CellValue[][] => 
  Array(6).fill(null).map(() => Array(6).fill('empty'));

const initialPuzzle = generatePuzzle();

export const usePuzzle = create<PuzzleState>((set, get) => ({
  grid: initialPuzzle.grid,
  hints: initialPuzzle.hints,
  solution: initialPuzzle.solution,
  violations: [],
  isComplete: false,
  
  getNextHint: () => {
    const { grid, solution } = get();
    
    // Find the first empty cell that has a known solution
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 6; col++) {
        if (grid[row][col] === 'empty') {
          return {
            row,
            col,
            value: solution[row][col]
          };
        }
      }
    }
    return null;
  },
  
  updateCell: (row: number, col: number, forcedValue?: CellValue) => {
    const { grid } = get();
    const newGrid = grid.map(r => [...r]);
    
    if (forcedValue) {
      // Used by hint system to set specific value
      newGrid[row][col] = forcedValue;
    } else {
      // Normal cycling behavior
      const currentValue = newGrid[row][col];
      switch (currentValue) {
        case 'empty':
          newGrid[row][col] = 'sun';
          break;
        case 'sun':
          newGrid[row][col] = 'moon';
          break;
        case 'moon':
          newGrid[row][col] = 'empty';
          break;
      }
    }
    
    const validation = validatePuzzle(newGrid, get().hints);
    
    set({
      grid: newGrid,
      violations: validation.violations,
      isComplete: validation.isComplete,
    });
  },
  
  reset: () => {
    const newPuzzle = generatePuzzle();
    set({
      grid: newPuzzle.grid,
      hints: newPuzzle.hints,
      solution: newPuzzle.solution,
      violations: [],
      isComplete: false,
    });
  },
}));
