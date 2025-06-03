import type { QuizWord, QuizQuestion } from "../types"


export class QuizGenerator {

  public static parseWordFile(fileContent: string): QuizWord[] {
    const lines = fileContent.split("\n").filter((line) => line.trim() !== "")

    return lines.map((line) => {
      // "word: definition"
      const colonSplit = line.split(":")

      if (colonSplit.length >= 2) {
        return {
          word: colonSplit[0].trim(),
          definition: colonSplit.slice(1).join(":").trim(),
        }
      }

      // Fallback: try to split by tab
      const tabSplit = line.split("\t")
      if (tabSplit.length >= 2) {
        return {
          word: tabSplit[0].trim(),
          definition: tabSplit.slice(1).join("\t").trim(),
        }
      }

      // Fallback: try to split by multiple spaces
      const spaceSplit = line.split(/\s{2,}/)
      if (spaceSplit.length >= 2) {
        return {
          word: spaceSplit[0].trim(),
          definition: spaceSplit.slice(1).join(" ").trim(),
        }
      }

      // If all else fails, just use the whole line as the word
      return {
        word: line.trim(),
        definition: "No definition provided",
      }
    })
  }

  /**
   * Generate quiz questions from parsed words
   * Each question will have the correct definition and 3 incorrect ones
   */
  public static generateQuestions(words: QuizWord[]): QuizQuestion[] {
    if (words.length < 4) {
      throw new Error("Need at least 4 words to generate quiz questions")
    }

    // Shuffle the words to randomize questions
    const shuffledWords = this.shuffleArray([...words])

    return shuffledWords.map((currentWord) => {
      // Get 3 random definitions that are not the current word's definition
      const incorrectDefinitions = this.getRandomIncorrectDefinitions(words, currentWord, 3)

      // Combine correct and incorrect definitions
      const allOptions = [currentWord.definition, ...incorrectDefinitions]

      // Shuffle options so correct answer isn't always first
      const shuffledOptions = this.shuffleArray(allOptions)

      return {
        word: currentWord.word,
        correctDefinition: currentWord.definition,
        options: shuffledOptions,
      }
    })
  }

  /**
   * Get random incorrect definitions for a quiz question
   */
  private static getRandomIncorrectDefinitions(allWords: QuizWord[], currentWord: QuizWord, count: number): string[] {
    // Filter out the current word
    const otherWords = allWords.filter((word) => word.word !== currentWord.word)

    // Shuffle and take the first 'count' definitions
    return this.shuffleArray(otherWords)
      .slice(0, count)
      .map((word) => word.definition)
  }

  /**
   * Shuffle an array using Fisher-Yates algorithm
   */
  private static shuffleArray<T>(array: T[]): T[] {
    const result = [...array]

    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[result[i], result[j]] = [result[j], result[i]]
    }

    return result
  }
}
