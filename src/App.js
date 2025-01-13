import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card'

const RiemannSumVisualization = () => {
  const [n, setN] = useState(4)
  const [width, setWidth] = useState(3)
  const [selectedRectIndex, setSelectedRectIndex] = useState(null)

  // Colors for width and height
  const widthColor = "#523A28"  // dark brown
  const heightColor = "#166534"  // dark green
  
  // SVG dimensions and scaling
  const svgWidth = 600
  const svgHeight = 400
  const padding = 60
  const graphWidth = svgWidth - 2 * padding
  const graphHeight = svgHeight - 2 * padding
  
  // Scale factors
  const xScale = graphWidth / width
  const yScale = graphHeight / (width * width)

  // Generate axis ticks
  const xTicks = useMemo(() => {
    const ticks = []
    const numTicks = Math.min(width * 2, 10)
    const tickInterval = width / numTicks
    
    for (let i = 0; i <= numTicks; i++) {
      const value = i * tickInterval
      ticks.push({
        value,
        x: value * xScale + padding,
        y: svgHeight - padding
      })
    }
    return ticks
  }, [width, xScale])

  const yTicks = useMemo(() => {
    const ticks = []
    const maxY = width * width
    const numTicks = 10
    const tickInterval = maxY / numTicks
    
    for (let i = 0; i <= numTicks; i++) {
      const value = i * tickInterval
      ticks.push({
        value,
        x: padding,
        y: svgHeight - (value * yScale) - padding
      })
    }
    return ticks
  }, [width, yScale])
  
  // Memoize rectangle calculations
  const { rectangles, totalArea } = useMemo(() => {
    const rects = []
    const dx = width / n
    let area = 0
    
    for (let i = 0; i < n; i++) {
      const x = i * dx
      const height = x * x
      rects.push({
        x: x * xScale + padding,
        y: svgHeight - (height * yScale) - padding,
        width: dx * xScale,
        height: height * yScale,
        realX: x,
        realHeight: height,
        realWidth: dx,
        area: height * dx
      })
      area += height * dx
    }
    
    return { rectangles: rects, totalArea: area }
  }, [n, width, xScale, yScale])
  
  // Memoize curve points
  const pathD = useMemo(() => {
    const steps = 200
    const stepSize = width / steps
    const points = []
    
    for (let i = 0; i <= steps; i++) {
      const x = i * stepSize
      const y = x * x
      points.push({
        x: x * xScale + padding,
        y: svgHeight - (y * yScale) - padding
      })
    }
    
    return points.reduce((acc, point, i) => 
      acc + (i === 0 ? `M ${point.x},${point.y}` : ` L ${point.x},${point.y}`), '')
  }, [width, xScale, yScale])

  const selectedRect = selectedRectIndex !== null ? rectangles[selectedRectIndex] : null

  // Position dimension info box based on rectangle position
  const getDimensionInfoPosition = (rect) => {
    if (!rect) return { x: 0, y: 0 }
    
    const centerX = rect.x + rect.width / 2
    const centerY = rect.y + rect.height / 2
    
    // Place info box above the curve if rectangle is in the lower half
    const isLowerHalf = centerY > svgHeight / 2
    
    return {
      x: Math.min(Math.max(centerX, padding + 100), svgWidth - padding - 100),
      y: isLowerHalf ? Math.max(padding + 50, rect.y - 60) : Math.min(svgHeight - padding - 50, rect.y + rect.height + 60)
    }
  }

  const DimensionLines = () => {
    if (!selectedRect) return null

    return (
      <>
        {/* Width measurement line */}
        <line
          x1={selectedRect.x}
          y1={selectedRect.y + selectedRect.height}
          x2={selectedRect.x + selectedRect.width}
          y2={selectedRect.y + selectedRect.height}
          stroke={widthColor}
          strokeWidth="2"
        />

        {/* Height measurement line */}
        <line
          x1={selectedRect.x}
          y1={selectedRect.y}
          x2={selectedRect.x}
          y2={selectedRect.y + selectedRect.height}
          stroke={heightColor}
          strokeWidth="2"
        />
      </>
    )
  }

  const DimensionInfo = () => {
    if (!selectedRect) return null
    
    const position = getDimensionInfoPosition(selectedRect)
    
    return (
      <g>
        {/* Info box */}
        <rect
          x={position.x - 80}
          y={position.y - 30}
          width="160"
          height="60"
          fill="white"
          stroke="black"
          strokeWidth="1"
          opacity="0.95"
        />
        <text
          x={position.x}
          y={position.y - 15}
          textAnchor="middle"
          fontSize="12"
          fill={widthColor}
          fontWeight="bold"
        >
          Width: {selectedRect.realWidth.toFixed(3)}
        </text>
        <text
          x={position.x}
          y={position.y + 5}
          textAnchor="middle"
          fontSize="12"
          fill={heightColor}
          fontWeight="bold"
        >
          Height: {selectedRect.realHeight.toFixed(3)}
        </text>
        <text
          x={position.x}
          y={position.y + 25}
          textAnchor="middle"
          fontSize="12"
        >
          Area: {selectedRect.area.toFixed(3)}
        </text>
      </g>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Riemann Sum Visualization: y = x²</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium">
              Number of rectangles (n): {n}
            </label>
            <input
              type="range"
              min="1"
              max="200"
              value={n}
              onChange={(e) => setN(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
          
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium">
              Width (x-axis range): {width}
            </label>
            <input
              type="range"
              min="1"
              max="20"
              step="1"
              value={width}
              onChange={(e) => setWidth(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
          
          <svg width={svgWidth} height={svgHeight} className="border border-gray-200 rounded">
            {/* Rectangles */}
            {rectangles.map((rect, i) => (
              <rect
                key={i}
                x={rect.x}
                y={rect.y}
                width={rect.width}
                height={rect.height}
                fill={selectedRectIndex === i ? "rgba(59, 130, 246, 0.5)" : "rgba(59, 130, 246, 0.3)"}
                stroke="rgb(59, 130, 246)"
                strokeWidth="1"
                onClick={() => setSelectedRectIndex(selectedRectIndex === i ? null : i)}
                style={{ cursor: 'pointer' }}
              />
            ))}
            
            {/* Curve */}
            <path
              d={pathD}
              fill="none"
              stroke="rgb(239, 68, 68)"
              strokeWidth="2"
            />
            
            {/* Axes */}
            <line
              x1={padding}
              y1={svgHeight - padding}
              x2={svgWidth - padding}
              y2={svgHeight - padding}
              stroke="black"
              strokeWidth="1"
            />
            <line
              x1={padding}
              y1={svgHeight - padding}
              x2={padding}
              y2={padding}
              stroke="black"
              strokeWidth="1"
            />

            {/* X-axis ticks and labels */}
            {xTicks.map((tick, i) => (
              <g key={`x-tick-${i}`}>
                <line
                  x1={tick.x}
                  y1={tick.y}
                  x2={tick.x}
                  y2={tick.y + 5}
                  stroke="black"
                  strokeWidth="1"
                />
                <text
                  x={tick.x}
                  y={tick.y + 20}
                  textAnchor="middle"
                  fontSize="12"
                >
                  {tick.value.toFixed(1)}
                </text>
              </g>
            ))}

            {/* Y-axis ticks and labels */}
            {yTicks.map((tick, i) => (
              <g key={`y-tick-${i}`}>
                <line
                  x1={tick.x - 5}
                  y1={tick.y}
                  x2={tick.x}
                  y2={tick.y}
                  stroke="black"
                  strokeWidth="1"
                />
                <text
                  x={tick.x - 10}
                  y={tick.y + 4}
                  textAnchor="end"
                  fontSize="12"
                >
                  {tick.value.toFixed(1)}
                </text>
              </g>
            ))}

            {/* Axis labels */}
            <text
              x={svgWidth / 2}
              y={svgHeight - 10}
              textAnchor="middle"
              fontSize="14"
            >
              x
            </text>
            <text
              x={20}
              y={svgHeight / 2}
              textAnchor="middle"
              fontSize="14"
              transform={`rotate(-90, 20, ${svgHeight / 2})`}
            >
              y = x²
            </text>

            {/* Dimension lines and info */}
            <DimensionLines />
            <DimensionInfo />
          </svg>
          
          <div className="text-sm space-y-1">
            <div className="h-6">
              {selectedRect && (
                <p>
                  Rectangle {selectedRectIndex + 1}: 
                  Area = width × height = {selectedRect.realWidth.toFixed(3)} × {selectedRect.realHeight.toFixed(3)} = {selectedRect.area.toFixed(3)}
                </p>
              )}
            </div>
            <p>Approximate area under curve: {totalArea.toFixed(3)}</p>
            <p>Actual area (∫₀ˣ t² dt = x³/3): {(Math.pow(width, 3) / 3).toFixed(3)}</p>
            <p>Error: {Math.abs(totalArea - Math.pow(width, 3) / 3).toFixed(3)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default RiemannSumVisualization