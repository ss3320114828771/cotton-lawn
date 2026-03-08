import React from 'react'

interface GradientBackgroundProps {
  children: React.ReactNode
  className?: string
  colors?: {
    from?: string
    via?: string
    to?: string
  }
  animated?: boolean
  stars?: boolean
}

export default function GradientBackground({ 
  children, 
  className = '',
  colors = {
    from: 'from-purple-900',
    via: 'via-pink-900',
    to: 'to-red-900'
  },
  animated = true,
  stars = true
}: GradientBackgroundProps) {
  
  const gradientClass = `bg-gradient-to-br ${colors.from} ${colors.via} ${colors.to} ${animated ? 'animate-gradient' : ''}`
  
  return (
    <div className={`relative min-h-screen overflow-hidden ${gradientClass} ${className}`}>
      {/* Animated Gradient Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-purple-500/20 via-transparent to-transparent animate-pulse"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-pink-500/20 via-transparent to-transparent animate-pulse animation-delay-2000"></div>
      
      {/* Floating Orbs */}
      <div className="absolute top-20 left-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-float animation-delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-float animation-delay-2000"></div>
      
      {/* Twinkling Stars Effect */}
      {stars && (
        <>
          <div className="absolute inset-0 pointer-events-none" style={{
            backgroundImage: `radial-gradient(2px 2px at 10px 10px, white, rgba(0,0,0,0)),
                              radial-gradient(2px 2px at 20px 30px, white, rgba(0,0,0,0)),
                              radial-gradient(2px 2px at 40px 70px, white, rgba(0,0,0,0)),
                              radial-gradient(2px 2px at 60px 90px, white, rgba(0,0,0,0)),
                              radial-gradient(2px 2px at 80px 110px, white, rgba(0,0,0,0)),
                              radial-gradient(2px 2px at 100px 150px, white, rgba(0,0,0,0)),
                              radial-gradient(2px 2px at 120px 180px, white, rgba(0,0,0,0)),
                              radial-gradient(2px 2px at 140px 210px, white, rgba(0,0,0,0)),
                              radial-gradient(2px 2px at 160px 240px, white, rgba(0,0,0,0)),
                              radial-gradient(2px 2px at 180px 270px, white, rgba(0,0,0,0))`,
            backgroundRepeat: 'repeat',
            backgroundSize: '200px 200px',
            animation: 'twinkle 4s ease-in-out infinite'
          }}></div>
          
          <div className="absolute inset-0 pointer-events-none" style={{
            backgroundImage: `radial-gradient(3px 3px at 210px 40px, white, rgba(0,0,0,0)),
                              radial-gradient(3px 3px at 230px 160px, white, rgba(0,0,0,0)),
                              radial-gradient(3px 3px at 250px 70px, white, rgba(0,0,0,0)),
                              radial-gradient(3px 3px at 270px 130px, white, rgba(0,0,0,0)),
                              radial-gradient(3px 3px at 290px 190px, white, rgba(0,0,0,0)),
                              radial-gradient(3px 3px at 310px 250px, white, rgba(0,0,0,0)),
                              radial-gradient(3px 3px at 330px 310px, white, rgba(0,0,0,0)),
                              radial-gradient(3px 3px at 350px 370px, white, rgba(0,0,0,0)),
                              radial-gradient(3px 3px at 370px 430px, white, rgba(0,0,0,0)),
                              radial-gradient(3px 3px at 390px 490px, white, rgba(0,0,0,0))`,
            backgroundRepeat: 'repeat',
            backgroundSize: '300px 300px',
            animation: 'twinkle 5s ease-in-out infinite reverse'
          }}></div>

          {/* Shooting Stars */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-10 left-10 w-1 h-1 bg-white rounded-full animate-shoot"></div>
            <div className="absolute top-20 right-20 w-1 h-1 bg-white rounded-full animate-shoot animation-delay-2000"></div>
            <div className="absolute bottom-10 left-1/2 w-1 h-1 bg-white rounded-full animate-shoot animation-delay-4000"></div>
          </div>
        </>
      )}

      {/* Light Leaks */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_20%,_white_0%,_transparent_50%)] opacity-10"></div>
      <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_80%,_white_0%,_transparent_50%)] opacity-10"></div>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0; }
          50% { opacity: 0.8; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-20px) scale(1.05); }
        }
        
        @keyframes shoot {
          0% {
            transform: translateX(0) translateY(0) rotate(45deg);
            opacity: 1;
            width: 1px;
          }
          100% {
            transform: translateX(500px) translateY(500px) rotate(45deg);
            opacity: 0;
            width: 100px;
          }
        }
        
        .animate-gradient {
          background-size: 400% 400%;
          animation: gradient 15s ease infinite;
        }
        
        @keyframes gradient {
          0% { background-position: 0% 0%; }
          25% { background-position: 100% 0%; }
          50% { background-position: 100% 100%; }
          75% { background-position: 0% 100%; }
          100% { background-position: 0% 0%; }
        }
        
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        
        .animate-shoot {
          animation: shoot 3s linear infinite;
        }
        
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}