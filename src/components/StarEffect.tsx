'use client'

import { useEffect, useRef } from 'react'

interface StarEffectProps {
  count?: number
  twinkle?: boolean
  shooting?: boolean
  color?: 'white' | 'gold' | 'multi'
  density?: 'low' | 'medium' | 'high'
  animated?: boolean
  speed?: 'slow' | 'normal' | 'fast'
}

export default function StarEffect({ 
  count = 100,
  twinkle = true,
  shooting = true,
  color = 'white',
  density = 'medium',
  animated = true,
  speed = 'normal'
}: StarEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Density multiplier
  const densityMultiplier = {
    low: 0.5,
    medium: 1,
    high: 2
  }

  // Speed multiplier
  const speedMultiplier = {
    slow: 0.5,
    normal: 1,
    fast: 2
  }

  // Color schemes
  const getStarColor = () => {
    switch(color) {
      case 'gold':
        return ['#FFD700', '#FFA500', '#FF8C00']
      case 'multi':
        return ['#FFFFFF', '#FFD700', '#87CEEB', '#FFB6C1', '#98FB98']
      default:
        return ['#FFFFFF', '#F0F0F0', '#E0E0E0']
    }
  }

  // Canvas animation for shooting stars
  useEffect(() => {
    if (!shooting || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let shootingStars: any[] = []

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const createShootingStar = () => {
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height * 0.3,
        length: 80 + Math.random() * 120,
        speed: (2 + Math.random() * 3) * speedMultiplier[speed],
        angle: (Math.random() * 30 - 15) * (Math.PI / 180),
        opacity: 0.5 + Math.random() * 0.5,
        life: 1
      }
    }

    const drawShootingStar = (star: any) => {
      if (!ctx) return

      const colors = getStarColor()
      const colorIndex = Math.floor(Math.random() * colors.length)
      
      ctx.beginPath()
      ctx.moveTo(star.x, star.y)
      
      const endX = star.x - star.length * Math.cos(star.angle)
      const endY = star.y + star.length * Math.sin(star.angle)
      
      const gradient = ctx.createLinearGradient(star.x, star.y, endX, endY)
      gradient.addColorStop(0, `rgba(255, 255, 255, ${star.opacity})`)
      gradient.addColorStop(0.5, `rgba(255, 200, 100, ${star.opacity * 0.8})`)
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
      
      ctx.strokeStyle = gradient
      ctx.lineWidth = 2
      ctx.lineCap = 'round'
      ctx.stroke()

      // Draw star head
      ctx.beginPath()
      ctx.arc(star.x, star.y, 3, 0, Math.PI * 2)
      ctx.fillStyle = colors[colorIndex]
      ctx.shadowColor = colors[colorIndex]
      ctx.shadowBlur = 10
      ctx.fill()
      ctx.shadowBlur = 0
    }

    const animate = () => {
      if (!ctx) return
      
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Create new shooting stars randomly
      if (Math.random() < 0.02 * densityMultiplier[density]) {
        shootingStars.push(createShootingStar())
      }
      
      // Update and draw shooting stars
      shootingStars = shootingStars.filter(star => {
        star.x += star.speed * Math.cos(star.angle)
        star.y -= star.speed * Math.sin(star.angle)
        star.life -= 0.005
        star.opacity *= 0.99
        
        drawShootingStar(star)
        
        return star.life > 0 && star.x < canvas.width + 100 && star.y > -100
      })
      
      animationFrameId = requestAnimationFrame(animate)
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [shooting, density, speed])

  // Get star size based on twinkling
  const getStarSize = (baseSize: number, shouldTwinkle: boolean) => {
    if (!shouldTwinkle) return baseSize
    return `calc(${baseSize}px + (${baseSize}px * var(--twinkle)))`
  }

  // Generate stars CSS
  const generateStarsCSS = () => {
    const stars = []
    const starCount = count * densityMultiplier[density]
    const colors = getStarColor()
    
    for (let i = 0; i < starCount; i++) {
      const x = Math.random() * 100
      const y = Math.random() * 100
      const size = 1 + Math.random() * 3
      const colorIndex = Math.floor(Math.random() * colors.length)
      const duration = 2 + Math.random() * 3
      const delay = Math.random() * 5
      
      stars.push({
        x,
        y,
        size,
        color: colors[colorIndex],
        duration,
        delay
      })
    }
    
    return stars
  }

  const stars = generateStarsCSS()

  return (
    <>
      {/* Static Stars */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {stars.map((star, index) => (
          <div
            key={`star-${index}`}
            className="absolute rounded-full"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              backgroundColor: star.color,
              boxShadow: twinkle ? `0 0 ${star.size * 2}px ${star.color}` : 'none',
              opacity: twinkle ? 0.6 : 1,
              animation: twinkle && animated 
                ? `twinkle ${star.duration}s ease-in-out infinite` 
                : 'none',
              animationDelay: `${star.delay}s`,
              '--twinkle': Math.random() * 0.5 + 0.5
            } as React.CSSProperties}
          />
        ))}

        {/* Large Stars */}
        {[...Array(10)].map((_, i) => (
          <div
            key={`large-star-${i}`}
            className="absolute rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: '4px',
              height: '4px',
              backgroundColor: color === 'gold' ? '#FFD700' : '#FFFFFF',
              boxShadow: `0 0 10px ${color === 'gold' ? '#FFD700' : '#FFFFFF'}`,
              opacity: 0.8,
              animation: twinkle ? 'pulse 2s ease-in-out infinite' : 'none',
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}

        {/* Star Clusters */}
        {[...Array(5)].map((_, clusterIndex) => {
          const clusterX = Math.random() * 100
          const clusterY = Math.random() * 100
          return (
            <div
              key={`cluster-${clusterIndex}`}
              className="absolute"
              style={{
                left: `${clusterX}%`,
                top: `${clusterY}%`,
              }}
            >
              {[...Array(8)].map((_, starIndex) => (
                <div
                  key={`cluster-star-${clusterIndex}-${starIndex}`}
                  className="absolute rounded-full"
                  style={{
                    left: `${(Math.random() - 0.5) * 50}px`,
                    top: `${(Math.random() - 0.5) * 50}px`,
                    width: `${1 + Math.random() * 2}px`,
                    height: `${1 + Math.random() * 2}px`,
                    backgroundColor: color === 'multi' 
                      ? ['#FFD700', '#87CEEB', '#FFB6C1'][Math.floor(Math.random() * 3)]
                      : '#FFFFFF',
                    opacity: 0.4 + Math.random() * 0.4,
                    animation: twinkle ? 'twinkle 2s ease-in-out infinite' : 'none',
                    animationDelay: `${Math.random() * 2}s`
                  }}
                />
              ))}
            </div>
          )
        })}

        {/* Milky Way Effect */}
        <div 
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at 30% 40%, rgba(255,255,255,0.1) 0%, transparent 30%),
                        radial-gradient(circle at 70% 60%, rgba(255,255,255,0.1) 0%, transparent 30%),
                        radial-gradient(circle at 50% 50%, rgba(255,215,0,0.05) 0%, transparent 50%)`,
            pointerEvents: 'none'
          }}
        />
      </div>

      {/* Shooting Stars Canvas */}
      {shooting && (
        <canvas
          ref={canvasRef}
          className="fixed inset-0 pointer-events-none z-0"
          style={{ opacity: 0.8 }}
        />
      )}

      {/* Falling Stars Effect */}
      {shooting && (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          {[...Array(3)].map((_, i) => (
            <div
              key={`falling-${i}`}
              className="absolute w-0.5 h-12 bg-gradient-to-b from-transparent via-white to-transparent animate-falling-star"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-10%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
                opacity: 0.3 + Math.random() * 0.3
              }}
            />
          ))}
        </div>
      )}

      {/* Twinkling Animation Keyframes */}
      <style jsx>{`
        @keyframes twinkle {
          0%, 100% {
            opacity: 0.2;
            transform: scale(0.8);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 0.4;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.3);
          }
        }

        @keyframes falling-star {
          0% {
            transform: translateY(0) rotate(45deg);
            opacity: 0;
          }
          10% {
            opacity: 0.8;
          }
          90% {
            opacity: 0.8;
          }
          100% {
            transform: translateY(100vh) rotate(45deg);
            opacity: 0;
          }
        }

        .animate-falling-star {
          animation: falling-star linear infinite;
        }

        /* Shooting star effect */
        @keyframes shoot {
          0% {
            transform: translateX(0) translateY(0) rotate(45deg);
            opacity: 1;
          }
          100% {
            transform: translateX(500px) translateY(500px) rotate(45deg);
            opacity: 0;
          }
        }
      `}</style>
    </>
  )
}

// Constellation Effect Component
export function ConstellationEffect() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <svg className="w-full h-full">
        {[...Array(5)].map((_, constellationIndex) => {
          const points = [...Array(6)].map(() => ({
            x: Math.random() * 100,
            y: Math.random() * 100
          }))
          
          return (
            <g key={`constellation-${constellationIndex}`}>
              {/* Stars */}
              {points.map((point, i) => (
                <circle
                  key={`star-${constellationIndex}-${i}`}
                  cx={`${point.x}%`}
                  cy={`${point.y}%`}
                  r="2"
                  fill="white"
                  opacity="0.6"
                >
                  <animate
                    attributeName="opacity"
                    values="0.3;1;0.3"
                    dur={`${3 + Math.random() * 2}s`}
                    repeatCount="indefinite"
                  />
                </circle>
              ))}
              
              {/* Lines */}
              {points.map((point, i) => {
                if (i === points.length - 1) return null
                return (
                  <line
                    key={`line-${constellationIndex}-${i}`}
                    x1={`${point.x}%`}
                    y1={`${point.y}%`}
                    x2={`${points[i + 1].x}%`}
                    y2={`${points[i + 1].y}%`}
                    stroke="white"
                    strokeWidth="0.5"
                    opacity="0.2"
                    strokeDasharray="5,5"
                  >
                    <animate
                      attributeName="opacity"
                      values="0.1;0.3;0.1"
                      dur="4s"
                      repeatCount="indefinite"
                    />
                  </line>
                )
              })}
            </g>
          )
        })}
      </svg>
    </div>
  )
}

// Gradient Star Effect
export function GradientStarEffect() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-purple-500/5 to-transparent animate-pulse"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-pink-500/5 to-transparent animate-pulse animation-delay-1000"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent animate-pulse animation-delay-2000"></div>
      
      {/* Colorful Stars */}
      {[...Array(30)].map((_, i) => (
        <div
          key={`gradient-star-${i}`}
          className="absolute rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${2 + Math.random() * 4}px`,
            height: `${2 + Math.random() * 4}px`,
            background: `linear-gradient(135deg, 
              hsl(${Math.random() * 360}, 100%, 70%), 
              hsl(${Math.random() * 360}, 100%, 50%))`,
            boxShadow: `0 0 ${10 + Math.random() * 20}px currentColor`,
            opacity: 0.6,
            animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 2}s`
          }}
        />
      ))}

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          25% {
            transform: translateY(-10px) translateX(5px);
          }
          50% {
            transform: translateY(5px) translateX(-5px);
          }
          75% {
            transform: translateY(-5px) translateX(10px);
          }
        }
        
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  )
}