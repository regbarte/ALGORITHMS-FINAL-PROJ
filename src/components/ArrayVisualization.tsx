import type React from "react"
import type { ArrayElement } from "@/types"

interface ArrayVisualizationProps {
  elements: ArrayElement[]
  pivotIndex: number
  left: number
  right: number
  k: number
}

/**
 * Component to visualize the array during QuickSelect algorithm
 * Shows elements with different colors based on their status
 */
const ArrayVisualization: React.FC<ArrayVisualizationProps> = (props: ArrayVisualizationProps) => {
  const { elements, left, right, k } = props;
  const getElementColor = (element: ArrayElement, index: number): string => {
    // Color coding for different element states
    switch (element.status) {
      case "pivot":
        return "bg-red-500 text-white" // Red for pivot
      case "comparing":
        return "bg-yellow-400 text-black" // Yellow for currently comparing
      case "smaller":
        return "bg-green-400 text-black" // Green for smaller than pivot
      case "larger":
        return "bg-blue-400 text-white" // Blue for larger than pivot
      case "target":
        return "bg-purple-600 text-white" // Purple for target element
      default:
        // Gray out elements outside current search range
        if (index < left || index > right) {
          return "bg-gray-300 text-gray-500"
        }
        return "bg-gray-100 text-black" // Default color
    }
  }

  const getBorderStyle = (index: number): string => {
    // Highlight the k-th position we're looking for
    if (index === k - 1) {
      return "border-4 border-purple-600"
    }
    return "border-2 border-gray-300"
  }

  return (
    <div className="flex flex-wrap gap-2 justify-center mb-6">
      {elements.map((element, index) => (
        <div
          key={`${element.value}-${index}`}
          className={`
            w-16 h-16 flex items-center justify-center rounded-lg font-bold text-lg
            transition-all duration-300 ease-in-out
            ${getElementColor(element, index)}
            ${getBorderStyle(index)}
          `}
        >
          <div className="text-center">
            <div>{element.value}</div>
            <div className="text-xs opacity-75">{index}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ArrayVisualization
