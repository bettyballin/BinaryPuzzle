import { Card, CardContent } from "../ui/card";

export default function GameHeader() {
  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Sun & Moon Logic Puzzle
        </h1>
        <p className="text-center text-gray-600 text-sm">
          Fill the grid so each row and column has 3 suns and 3 moons, with no more than 2 consecutive identical symbols
        </p>
      </CardContent>
    </Card>
  );
}
