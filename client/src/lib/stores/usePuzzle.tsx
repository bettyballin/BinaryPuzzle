import { create } from "zustand";
import { CellValue } from "../../components/game/GameCell";
import { HintValue } from "../../components/game/HintCell";
import { validatePuzzle, generateHints, Violation } from "../puzzleLogic";

interface PuzzleState {
  grid: CellValue[][];
  hints: {
    horizontal: (HintValue | null)[][];
    vertical: (HintValue | null)[];
  };
  violations: Violation[];
  isComplete: boolean;
  
  updateCell: (row: number, col: number) => void;
  reset: () => void;
}

const createEmptyGrid = (): CellValue[][] => 
  Array(6).fill(null).map(() => Array(6).fill('empty'));

export const usePuzzle = create<PuzzleState>((set, get) => ({
  grid: createEmptyGrid(),
  hints: generateHints(),
  violations: [],
  isComplete: false,
  
  updateCell: (row: number, col: number) => {
    const { grid } = get();
    const newGrid = grid.map(r => [...r]);
    
    // Cycle through: empty -> sun -> moon -> empty
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
    
    const validation = validatePuzzle(newGrid, get().hints);
    
    set({
      grid: newGrid,
      violations: validation.violations,
      isComplete: validation.isComplete,
    });
  },
  
  reset: () => {
    set({
      grid: createEmptyGrid(),
      hints: generateHints(),
      violations: [],
      isComplete: false,
    });
  },
}));
