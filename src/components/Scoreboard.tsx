"use client";

import type React from "react";
import { useEffect, useState } from "react";
import type { Player } from "../types";
import { PlayerRankingSystem } from "../utils/quickselect";

interface ScoreboardProps {
  players: Player[];
  showRankingVisualization?: boolean;
}

interface RankedPlayer extends Player {
  rank: number;
}

//  Scoreboard component using QuickSelect for ranking

const Scoreboard: React.FC<ScoreboardProps> = ({
  players,
  showRankingVisualization = false,
}) => {
  const [rankedPlayers, setRankedPlayers] = useState<RankedPlayer[]>([]);

  useEffect(() => {
    const rankingSystem =new PlayerRankingSystem()
    const result = rankingSystem.rankPlayers(players);
    setRankedPlayers(result.rankedPlayers);
  }, [players]);

  // Sort by actual rank (1 = highest)
  const sortedByRank = [...rankedPlayers].sort((a, b) => a.rank - b.rank);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Scoreboard</h2>

      <div className="overflow-hidden mb-6">
        <table className="min-w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rank
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Player
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Score
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedByRank.map((player) => (
              <tr key={player.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {player.rank}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex items-center">
                    <div
                      className={`w-4 h-4 rounded-full mr-2 ${player.color}`}
                    ></div>
                    <span>{player.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">
                  {player.score}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✅ Optional ranking visualization */}
      {showRankingVisualization && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Ranking Visualization
          </h3>
          <div className="space-y-2">
            {sortedByRank.map((player) => (
              <div key={player.id} className="flex items-center">
                <span className="w-24 text-sm font-medium text-gray-600">
                  {player.name}
                </span>
                <div className="flex-1 bg-gray-200 rounded-full h-3 mx-2">
                  <div
                    className={`h-3 rounded-full ${player.color}`}
                    style={{
                      width: `${
                        (player.score /
                          Math.max(...players.map((p) => p.score || 1))) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
                <span className="text-sm text-gray-700">
                  {player.score} pts
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Scoreboard;
