import React, { useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';

// Keyframe animations
const pulse = keyframes`
  0% {
    transform: scale(1);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.2);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0.8;
  }
`;

const flowAnimation = keyframes`
  0% {
    offset-distance: 0%;
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    offset-distance: 100%;
    opacity: 0;
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -200% center;
  }
  100% {
    background-position: 200% center;
  }
`;

// Styled components
const NetworkContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '90%',
  position: 'relative',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const SvgContainer = styled('svg')({
  width: '100%',
  height: '100%',
  position: 'absolute',
});

const NeuralNetwork = () => {
  const svgRef = useRef(null);
  const animationFrameRef = useRef(null);
  const particlesRef = useRef([]);

  // Neural network structure - spread across full width (300 units)
  const layers = [
    { nodes: 3, x: 15 },    // Input layer (5% of 300)
    { nodes: 4, x: 82.5 },  // Hidden layer 1 (27.5% of 300)
    { nodes: 5, x: 150 },   // Hidden layer 2 (50% of 300)
    { nodes: 4, x: 217.5 }, // Hidden layer 3 (72.5% of 300)
    { nodes: 2, x: 285 },   // Output layer (95% of 300)
  ];

  // Calculate node positions
  const getNodePositions = () => {
    const positions = [];
    const containerHeight = 80; // Match viewBox height
    const containerWidth = 100; // viewBox width
    
    layers.forEach((layer, layerIndex) => {
      const layerPositions = [];
      const verticalSpacing = containerHeight / (layer.nodes + 1);
      
      for (let i = 0; i < layer.nodes; i++) {
        layerPositions.push({
          x: layer.x, // Use absolute x position directly (already in viewBox coordinates)
          y: verticalSpacing * (i + 1),
          id: `node-${layerIndex}-${i}`
        });
      }
      positions.push(layerPositions);
    });
    
    return positions;
  };

  // Generate connections between layers
  const getConnections = () => {
    const connections = [];
    const nodePositions = getNodePositions();
    
    for (let l = 0; l < nodePositions.length - 1; l++) {
      const currentLayer = nodePositions[l];
      const nextLayer = nodePositions[l + 1];
      
      currentLayer.forEach((node, i) => {
        nextLayer.forEach((nextNode, j) => {
          // Create connections with some probability for visual clarity
          if (Math.random() > 0.3) {
            connections.push({
              from: node,
              to: nextNode,
              id: `connection-${l}-${i}-${j}`,
              delay: Math.random() * 2
            });
          }
        });
      });
    }
    
    return connections;
  };

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    // Initialize particles for pulse animation
    const connections = svg.querySelectorAll('.neural-connection');
    const particles = [];

    connections.forEach((connection, index) => {
      const particle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      particle.setAttribute('r', '2');
      particle.setAttribute('fill', '#2DD4BF');
      particle.setAttribute('filter', 'url(#glow)');
      particle.style.opacity = '0';
      svg.appendChild(particle);
      
      particles.push({
        element: particle,
        path: connection,
        progress: 0,
        delay: index * 0.1,
        speed: 0.5 + Math.random() * 0.5
      });
    });

    particlesRef.current = particles;

    // Animation loop
    let lastTime = 0;
    const animate = (currentTime) => {
      const deltaTime = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      particles.forEach(particle => {
        particle.progress += deltaTime * particle.speed;
        
        if (particle.progress > particle.delay) {
          const adjustedProgress = (particle.progress - particle.delay) % 2;
          
          if (adjustedProgress < 1) {
            const pathLength = particle.path.getTotalLength();
            const point = particle.path.getPointAtLength(pathLength * adjustedProgress);
            
            particle.element.setAttribute('cx', point.x);
            particle.element.setAttribute('cy', point.y);
            particle.element.style.opacity = adjustedProgress < 0.1 ? adjustedProgress * 10 : 
                                            adjustedProgress > 0.9 ? (1 - adjustedProgress) * 10 : 1;
          } else {
            particle.element.style.opacity = '0';
          }
        }
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      particles.forEach(p => p.element.remove());
    };
  }, []);

  const nodePositions = getNodePositions();
  const connections = getConnections();

  return (
    <NetworkContainer>
      <SvgContainer ref={svgRef} viewBox="0 0 300 80" preserveAspectRatio="xMidYMid meet">
        <defs>
          {/* Gradient definitions */}
          <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2DD4BF" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#2DD4BF" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0.2" />
          </linearGradient>
          
          <linearGradient id="nodeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2DD4BF" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>

          {/* Glow filter */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          {/* Pulse filter */}
          <filter id="pulseGlow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          {/* Shimmer gradient */}
          <linearGradient id="shimmerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="50%" stopColor="#2DD4BF" stopOpacity="0.1" />
            <stop offset="100%" stopColor="transparent" />
            <animate
              attributeName="x1"
              from="-100%"
              to="100%"
              dur="4s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="x2"
              from="0%"
              to="200%"
              dur="4s"
              repeatCount="indefinite"
            />
          </linearGradient>
        </defs>

        {/* Draw connections */}
        {connections.map((connection, index) => (
          <g key={connection.id}>
            <path
              id={connection.id}
              className="neural-connection"
              d={`M ${connection.from.x} ${connection.from.y} L ${connection.to.x} ${connection.to.y}`}
              stroke="url(#connectionGradient)"
              strokeWidth="1"
              fill="none"
              opacity="0.6"
            />
            {/* Flowing particle using CSS animation */}
            <circle
              r="2"
              fill="#2DD4BF"
              filter="url(#glow)"
              style={{
                offsetPath: `path('M ${connection.from.x} ${connection.from.y} L ${connection.to.x} ${connection.to.y}')`,
                animation: `${flowAnimation} ${2 + (index % 3) * 0.5}s linear infinite`,
                animationDelay: `${connection.delay}s`
              }}
            />
          </g>
        ))}

        {/* Draw nodes */}
        {nodePositions.map((layer, layerIndex) => 
          layer.map((node) => (
            <g key={node.id}>
              {/* Outer pulsing ring */}
              <circle
                cx={node.x}
                cy={node.y}
                r="5"
                fill="none"
                stroke="url(#nodeGradient)"
                strokeWidth="0.8"
                opacity="0.3"
                style={{
                  animation: `${pulse} ${2 + layerIndex * 0.5}s ease-in-out infinite`,
                  animationDelay: `${layerIndex * 0.2}s`
                }}
              />
              
              {/* Inner node */}
              <circle
                cx={node.x}
                cy={node.y}
                r="3"
                fill="url(#nodeGradient)"
                filter="url(#glow)"
                style={{
                  animation: `${pulse} ${2 + layerIndex * 0.5}s ease-in-out infinite`,
                  animationDelay: `${layerIndex * 0.2}s`
                }}
              />
            </g>
          ))
        )}

        {/* Animated shimmer overlay */}
        <rect
          x="0"
          y="0"
          width="300"
          height="80"
          fill="url(#shimmerGradient)"
          opacity="0.5"
        />
      </SvgContainer>
    </NetworkContainer>
  );
};

export default NeuralNetwork;