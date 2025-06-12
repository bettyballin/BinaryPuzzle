import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import GameGrid from "./components/game/GameGrid";
import GameHeader from "./components/game/GameHeader";
import { usePuzzle } from "./lib/stores/usePuzzle";
import { Button } from "./components/ui/button";
import { Card, CardContent } from "./components/ui/card";
import { RotateCcw, Trophy } from "lucide-react";
import "@fontsource/inter";

const queryClient = new QueryClient();

function GameApp() {
  const { isComplete, reset, violations } = usePuzzle();
  const [showInstructions, setShowInstructions] = useState(true);

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        <GameHeader />
        
        <div className="flex flex-col items-center space-y-6">
          <GameGrid />
          
          <div className="flex gap-4 items-center">
            <Button 
              onClick={reset}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </Button>
            
            {violations.length > 0 && (
              <div className="text-sm text-red-600 bg-red-50 px-3 py-1 rounded">
                {violations.length} constraint violation(s)
              </div>
            )}
          </div>
          
          {isComplete && (
            <Card className="w-full max-w-sm">
              <CardContent className="p-4 text-center">
                <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                <h3 className="text-lg font-semibold text-green-700">
                  Puzzle Complete!
                </h3>
                <p className="text-sm text-gray-600">
                  Great job solving the puzzle!
                </p>
              </CardContent>
            </Card>
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
