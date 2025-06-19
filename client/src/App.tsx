import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import GameGrid from "./components/game/GameGrid";
import GameHeader from "./components/game/GameHeader";
import { usePuzzle } from "./lib/stores/usePuzzle";
import { Button } from "./components/ui/button";
import { Card, CardContent } from "./components/ui/card";
import { RotateCcw, Trophy, Lightbulb } from "lucide-react";
import "@fontsource/inter";

const queryClient = new QueryClient();

function GameApp() {
  const { isComplete, reset, violations, getNextHint, updateCell } = usePuzzle();
  const [showInstructions, setShowInstructions] = useState(true);

  const handleHint = () => {
    const hint = getNextHint();
    if (hint) {
      updateCell(hint.row, hint.col, hint.value);
    }
  };

  if (showInstructions) {
    return (
      <div className="min-h-screen bg-white p-4 flex items-center justify-center">
        <Card className="w-full max-w-md border-2 border-black">
          <CardContent className="p-6">
            <h1 className="text-2xl font-bold text-center mb-4 text-black">
              Sun & Moon Puzzle
            </h1>
            <div className="space-y-3 text-sm text-black">
              <p><strong>Rules:</strong></p>
              <ul className="space-y-2 pl-4">
                <li>• Each row and column must have exactly 3 suns ☀️ and 3 moons 🌙</li>
                <li>• No more than 2 identical symbols can appear consecutively</li>
                <li>• "=" hints mean adjacent cells should be the same</li>
                <li>• "×" hints mean adjacent cells should be different</li>
              </ul>
              <p className="text-xs text-gray-700 mt-4">
                Click cells to cycle: Empty → Sun → Moon → Empty
              </p>
            </div>
            <Button 
              onClick={() => setShowInstructions(false)}
              className="w-full mt-6 bg-black text-white hover:bg-gray-800"
            >
              Start Playing
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-4xl mx-auto">
        <GameHeader />
        
        <div className="flex flex-col items-center space-y-6">
          <GameGrid />
          
          <div className="flex gap-4 items-center flex-wrap justify-center">
            <Button 
              onClick={reset}
              variant="outline"
              className="flex items-center gap-2 border-2 border-black text-black hover:bg-gray-100 transform transition-all duration-200 hover:scale-105 hover:shadow-lg"
              style={{
                boxShadow: '0 4px 12px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.8)'
              }}
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </Button>
            
            <Button 
              onClick={handleHint}
              variant="outline"
              className="flex items-center gap-2 border-2 border-black text-black hover:bg-gray-100 transform transition-all duration-200 hover:scale-105 hover:shadow-lg"
              style={{
                boxShadow: '0 4px 12px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.8)'
              }}
            >
              <Lightbulb className="w-4 h-4" />
              Hint
            </Button>
            
            {violations.length > 0 && (
              <div 
                className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-200 transform transition-all duration-200"
                style={{
                  boxShadow: '0 2px 8px rgba(239, 68, 68, 0.2), inset 0 1px 0 rgba(255,255,255,0.8)'
                }}
              >
                {violations.length} constraint violation(s)
              </div>
            )}
          </div>
          
          {isComplete && (
            <div className="relative w-full max-w-sm">
              {/* 3D Base for completion card */}
              <div 
                className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl transform translate-y-1 translate-x-1"
                style={{ filter: 'blur(1px)' }}
              />
              
              <Card 
                className="relative border-2 border-black bg-gradient-to-br from-yellow-100 to-yellow-50 transform transition-all duration-500 animate-pulse"
                style={{
                  boxShadow: '0 8px 25px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.9)'
                }}
              >
                <CardContent className="p-6 text-center">
                  <div 
                    className="w-12 h-12 bg-yellow-500 rounded-full mx-auto mb-4 flex items-center justify-center transform transition-all duration-200 hover:scale-110"
                    style={{
                      boxShadow: '0 4px 12px rgba(0,0,0,0.2), inset 0 2px 0 rgba(255,255,255,0.4)'
                    }}
                  >
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-black mb-2">
                    Puzzle Complete!
                  </h3>
                  <p className="text-sm text-gray-700">
                    Great job solving the puzzle!
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GameApp />
    </QueryClientProvider>
  );
}

export default App;
