import type { Player, RankedPlayer, AlgorithmStep } from "../types"

//defining a class  starting with an empty array.
export class PlayerRankingSystem {
  private steps: AlgorithmStep[] = []

  //call to rank  a list of players. 
  public rankPlayers(players: Player[]): { rankedPlayers: RankedPlayer[]; steps: AlgorithmStep[] } {
    this.steps = []

    // make a copy of the players and map it. all players start at rank 0 
    const playersCopy = players.map((player) => ({
      ...player,
      rank: 0,
    }))

    // Quick select algorithm to find player who should be at that rank.
    for (let targetRank = 1; targetRank <= playersCopy.length; targetRank++) {

      // Find the player with the targetRank-th highest score[1st, 2nd, 3rd, 4th]
      const result = this.quickSelectRank(playersCopy, targetRank) //player quick select to player's rank. 

      // Update rank after finding player rank
      const playerIndex = playersCopy.findIndex((p) => p.id === result.id)
      if (playerIndex !== -1) {
        playersCopy[playerIndex].rank = targetRank // inserts to the index of respective rank before sort 
      }
    }

    // Sort by rank
    const rankedPlayers = [...playersCopy].sort((a, b) => a.rank - b.rank)

    return { rankedPlayers, steps: this.steps }
    //returns both ranked and steps taken to get to that rank
  }

  //Quick select finding "Kth" element (highest score) 
  private quickSelectRank(players: RankedPlayer[], k: number): RankedPlayer {
    const playersCopy = [...players]

    // We're looking for the k-th highest score (descending order)
    return this.quickSelectRecursive(playersCopy, 0, playersCopy.length - 1, k - 1) //k-1 means starting array at 0 index.
  }

  // Main quickselect application
  private quickSelectRecursive(players: RankedPlayer[], left: number, right: number, k: number): RankedPlayer {
    if (left === right) {
      // Base case: only one player
      this.addStep(
        [...players],
        left,
        left,
        right,
        `Found player at rank ${k + 1}: ${players[left].name} with score ${players[left].score}`,
        k + 1,
      )
      return players[left]
    }

    // Choose pivot (using median-of-three for better performance)
    const pivotIndex = this.choosePivot(players, left, right)
    this.addStep(
      [...players],
      pivotIndex,
      left,
      right,
      `Chosen pivot: ${players[pivotIndex].name} with score ${players[pivotIndex].score}`,
      k + 1, //k+1 is the next element
    )

    // Partition the array around the pivot and sorting in decending order
    const partitionIndex = this.partition(players, left, right, pivotIndex, k + 1)

    // Recursively search in the appropriate partition
    if (k === partitionIndex) {
      // Found the target player
      this.addStep(
        [...players],
        partitionIndex,
        left,
        right,
        `Target found! ${players[partitionIndex].name} is at rank ${k + 1} with score ${players[partitionIndex].score}`,
        k + 1,
      )
      return players[partitionIndex]
    } else if (k < partitionIndex) {
      // if player score is higher, it is on the left of the partition.
      this.addStep(
        [...players],
        partitionIndex,
        left,
        right,
        `Target rank ${k + 1} is in higher scores. Searching left partition [${left}, ${partitionIndex - 1}]`,
        k + 1,
      )
      return this.quickSelectRecursive(players, left, partitionIndex - 1, k)
    } else {
      // if player score is lower than partition, it is placed on the right of the partition. 
      this.addStep(
        [...players],
        partitionIndex,
        left,
        right,
        `Target rank ${k + 1} is in lower scores. Searching right partition [${partitionIndex + 1}, ${right}]`,
        k + 1,
      )
      return this.quickSelectRecursive(players, partitionIndex + 1, right, k)
    }
  }
  // partition players rearranging around the pivot. 
  private partition(
    players: RankedPlayer[],
    left: number,
    right: number,
    pivotIndex: number,
    targetRank: number,
  ): number {
    const pivotScore = players[pivotIndex].score

    // Move pivot to the end to temporarily make space
    this.swap(players, pivotIndex, right)
    this.addStep(
      [...players],
      right,
      left,
      right,
      `Moved pivot ${players[right].name} (score: ${pivotScore}) to end for partitioning`,
      targetRank,
    )

    let storeIndex = left //keeps track of where players shouls be placed. 

    // loop moves higher if player on left if higher and moves player on right if lower
    for (let i = left; i < right; i++) {
      this.addStep(
        [...players],
        right,
        left,
        right,
        `Comparing ${players[i].name}'s score (${players[i].score}) with pivot score (${pivotScore})`,
        targetRank,
      )

      if (players[i].score > pivotScore) {
        // Higher score goes to the left partition
        if (i !== storeIndex) {
          this.swap(players, i, storeIndex)
          this.addStep(
            [...players],
            right,
            left,
            right,
            `${players[storeIndex].name}'s score (${players[storeIndex].score}) > ${pivotScore}, moved to left partition`,
            targetRank,
          )
        }
        storeIndex++
      } else {
        this.addStep(
          [...players],
          right,
          left,
          right,
          `${players[i].name}'s score (${players[i].score}) <= ${pivotScore}, stays in right partition`,
          targetRank,
        )
      }
    }

    // Move pivot to its final position
    this.swap(players, storeIndex, right)
    this.addStep(
      [...players],
      storeIndex,
      left,
      right,
      `Pivot ${players[storeIndex].name} (score: ${pivotScore}) placed at final position ${storeIndex}`,
      targetRank,
    )

    return storeIndex
  }

  /**
   * Choose pivot using median-of-three method for better performance
   */
  private choosePivot(players: RankedPlayer[], left: number, right: number): number {
    if (right - left < 2) return left

    const mid = Math.floor((left + right) / 2)

    // Sort left, mid, right by score (descending) to find median
    if (players[left].score < players[mid].score) {
      this.swap(players, left, mid)
    }
    if (players[left].score < players[right].score) {
      this.swap(players, left, right)
    }
    if (players[mid].score < players[right].score) {
      this.swap(players, mid, right)
    }

    return mid // Median is now at mid position
  }

  /**
   * Swap two players in the array
   */
  private swap(players: RankedPlayer[], i: number, j: number): void {
    const temp = players[i]
    players[i] = players[j]
    players[j] = temp
  }

  /**
   * Add a step to the visualization
   */
  private addStep(
    players: RankedPlayer[],
    pivotIndex: number,
    left: number,
    right: number,
    description: string,
    targetRank: number,
  ): void {
    this.steps.push({
      players: players.map((player) => ({ ...player })), // Deep copy
      pivotIndex,
      left,
      right,
      description,
      targetRank,
    })
  }
}
