// Pillars.jsx
import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Card, 
  CardContent, 
  useMediaQuery, 
  useTheme as useMUITheme, 
  alpha,
  Chip,
  Collapse,
  IconButton,
  Stack,
  Grid,
  Divider
} from '@mui/material';

import { 
  Assessment, 
  VerifiedUser, 
  Shield, 
  Business, 
  Language,
  ExpandMore,
  CheckCircle,
  Schedule,
} from '@mui/icons-material';
import { serviceItems } from '../../../public/ServicePillars/servicePillars.js';
import { useTheme } from '../../Context/ThemeContext';

const Pillars = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [expandedModule, setExpandedModule] = useState(null);
  const sectionRef = useRef(null);
  const muiTheme = useMUITheme();
  const { colors, gradients, fonts } = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const getIcon = (iconName, size = 28) => {
    const iconProps = { sx: { fontSize: size, color: '#ffffff' } };
    switch (iconName) {
      case 'assessment':
        return <Assessment {...iconProps} />;
      case 'verified':
        return <VerifiedUser {...iconProps} />;
      case 'shield':
        return <Shield {...iconProps} />;
      case 'business':
        return <Business {...iconProps} />;
      case 'language':
        return <Language {...iconProps} />;
      default:
        return null;
    }
  };

  const handleModuleClick = (moduleId) => {
    setExpandedModule(expandedModule === moduleId ? null : moduleId);
  };

  return (
    <Box 
      component="section" 
      ref={sectionRef}
      sx={{ 
        minHeight: { xs: 'auto', md: '100vh' },
        height: 'auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #0f0f1e 100%)',
        color: '#ffffff',
        py: { xs: 6, md: 8 },
        position: 'relative',
        overflow: 'hidden',
      }}
      aria-labelledby="services-heading"
    >
      {/* Simple Background Effect */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0,
          overflow: 'hidden',
          pointerEvents: 'none',
          opacity: 0.05,
          background: 'radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(139, 92, 246, 0.3) 0%, transparent 50%)',
        }}
      />

      <Container 
        maxWidth="lg"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Typography 
          id="services-heading"
          variant="h2" 
          component="h2" 
          align="center" 
          sx={{ 
            fontWeight: 'bold',
            fontSize: { xs: '2rem', md: '3rem' },
            fontFamily: fonts.heading,
            color: '#ffffff',
            mb: { xs: 4, md: 6 },
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 0.8s ease, transform 0.8s ease',
          }}
        >
          Modules
        </Typography>
        
        <Grid 
          container 
          spacing={{ xs: 3, md: 4 }}
          sx={{ 
            alignItems: 'flex-start',
            justifyContent: 'center',
          }}
        >
          {serviceItems.map((item, index) => (
            <Grid size={{ xs: 12, md: 6 }} key={index}>
              <Card 
                sx={{ 
                  display: 'flex',
                  flexDirection: 'column',
                  minHeight: { xs: '400px', md: '450px' },
                  background: 'rgba(30, 30, 40, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 2,
                  overflow: 'hidden',
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(50px)',
                  transition: `opacity 0.8s ease, transform 0.8s ease`,
                  transitionDelay: `${index * 0.2}s`,
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: `0 12px 40px ${alpha(item.color, 0.3)}`,
                    transition: 'all 0.3s ease',
                  },
                }}
              >
                {/* Colored Header Section */}
                <Box
                  sx={{
                    background: item.color,
                    p: 3,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                  }}
                >
                  <Box
                    sx={{
                      background: 'rgba(255, 255, 255, 0.2)',
                      borderRadius: '12px',
                      width: 48,
                      height: 48,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {getIcon(item.icon)}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="h5"
                      component="h3"
                      sx={{
                        color: '#ffffff',
                        fontWeight: 'bold',
                        fontSize: { xs: '1.25rem', md: '1.5rem' },
                        fontFamily: fonts.heading,
                        mb: 0.5,
                      }}
                    >
                      {item.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontSize: { xs: '0.875rem', md: '0.95rem' },
                        fontFamily: fonts.body,
                      }}
                    >
                      {item.subtitle}
                    </Typography>
                  </Box>
                </Box>

                {/* Content Section */}
                <CardContent 
                  sx={{ 
                    p: { xs: 3, md: 4 },
                    flexGrow: 1,
                    background: 'rgba(20, 20, 30, 0.5)',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <Typography 
                    variant="body1"
                    sx={{
                      color: 'rgba(255,255,255,0.8)',
                      fontSize: { xs: '0.95rem', md: '1.05rem' },
                      lineHeight: 1.7,
                      fontFamily: fonts.body,
                      mb: item.modules ? 3 : 0,
                    }}
                  >
                    {item.description}
                  </Typography>

                  {/* Modules List - For External Audit Domain */}
                  {item.modules && (
                    <Box sx={{ mt: 'auto' }}>
                      <Divider sx={{ mb: 3, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'rgba(255,255,255,0.6)',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: 0.5,
                          mb: 2,
                          fontSize: '0.75rem',
                        }}
                      >
                        Available Modules
                      </Typography>
                      
                      <Stack spacing={2}>
                        {item.modules.map((module) => (
                          <Box key={module.id}>
                            <Box
                              onClick={() => handleModuleClick(module.id)}
                              sx={{
                                cursor: 'pointer',
                                p: 2,
                                borderRadius: 1,
                                background: module.comingSoon 
                                  ? 'rgba(100, 116, 139, 0.1)' 
                                  : 'rgba(139, 92, 246, 0.1)',
                                border: '1px solid',
                                borderColor: module.comingSoon 
                                  ? 'rgba(100, 116, 139, 0.3)' 
                                  : 'rgba(139, 92, 246, 0.3)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  background: module.comingSoon 
                                    ? 'rgba(100, 116, 139, 0.15)' 
                                    : 'rgba(139, 92, 246, 0.15)',
                                  borderColor: module.comingSoon 
                                    ? 'rgba(100, 116, 139, 0.5)' 
                                    : 'rgba(139, 92, 246, 0.5)',
                                },
                              }}
                            >
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Box
                                  sx={{
                                    background: module.color,
                                    borderRadius: '8px',
                                    width: 36,
                                    height: 36,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    opacity: module.comingSoon ? 0.5 : 1,
                                  }}
                                >
                                  {getIcon(module.icon, 20)}
                                </Box>
                                <Box sx={{ flex: 1 }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Typography
                                      variant="subtitle2"
                                      sx={{
                                        color: module.comingSoon ? 'rgba(255,255,255,0.5)' : '#ffffff',
                                        fontWeight: 'bold',
                                        fontSize: '1rem',
                                      }}
                                    >
                                      {module.title}
                                    </Typography>
                                    {module.comingSoon && (
                                      <Chip
                                        icon={<Schedule sx={{ fontSize: 14 }} />}
                                        label="Coming Soon"
                                        size="small"
                                        sx={{
                                          height: 20,
                                          backgroundColor: 'rgba(100, 116, 139, 0.2)',
                                          color: 'rgba(255,255,255,0.6)',
                                          border: '1px solid rgba(100, 116, 139, 0.3)',
                                          '& .MuiChip-label': { px: 1, fontSize: '0.7rem' },
                                        }}
                                      />
                                    )}
                                  </Box>
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      color: module.comingSoon ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.6)',
                                      fontSize: '0.8rem',
                                    }}
                                  >
                                    {module.description}
                                  </Typography>
                                </Box>
                                <IconButton
                                  size="small"
                                  sx={{
                                    color: 'rgba(255, 255, 255, 0.5)',
                                    transform: expandedModule === module.id ? 'rotate(180deg)' : 'rotate(0deg)',
                                    transition: 'transform 0.3s ease',
                                  }}
                                >
                                  <ExpandMore />
                                </IconButton>
                              </Box>

                              {/* Expanded Module Details */}
                              <Collapse in={expandedModule === module.id} timeout="auto" unmountOnExit>
                                <Box sx={{ mt: 2, pl: 6.5 }}>
                                  {/* Frameworks */}
                                  <Box sx={{ mb: 2 }}>
                                    <Typography
                                      variant="caption"
                                      sx={{
                                        color: module.comingSoon ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.6)',
                                        fontWeight: 600,
                                        textTransform: 'uppercase',
                                        letterSpacing: 0.5,
                                        fontSize: '0.7rem',
                                      }}
                                    >
                                      Supported Frameworks
                                    </Typography>
                                    <Stack direction="row" flexWrap="wrap" gap={0.5} sx={{ mt: 0.5 }}>
                                      {module.frameworks.map((framework) => (
                                        <Chip
                                          key={framework}
                                          label={framework}
                                          size="small"
                                          sx={{
                                            height: 20,
                                            backgroundColor: module.comingSoon 
                                              ? 'rgba(100, 116, 139, 0.1)' 
                                              : alpha(module.color, 0.1),
                                            color: module.comingSoon 
                                              ? 'rgba(255,255,255,0.5)' 
                                              : '#ffffff',
                                            border: '1px solid',
                                            borderColor: module.comingSoon 
                                              ? 'rgba(100, 116, 139, 0.3)' 
                                              : alpha(module.color, 0.3),
                                            fontSize: '0.65rem',
                                            '& .MuiChip-label': { px: 0.5 },
                                          }}
                                        />
                                      ))}
                                    </Stack>
                                  </Box>

                                  {/* Features */}
                                  <Box>
                                    <Typography
                                      variant="caption"
                                      sx={{
                                        color: module.comingSoon ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.6)',
                                        fontWeight: 600,
                                        textTransform: 'uppercase',
                                        letterSpacing: 0.5,
                                        fontSize: '0.7rem',
                                      }}
                                    >
                                      {(() => {
                                        if (!module.addOnFeatures) return 'Key Features';
                                        
                                        // Internal Audit Domain
                                        if (module.id === 'federal-internal') return 'Automation Features';
                                        if (module.id === 'commercial-internal') return 'Internal Audit Features';
                                        
                                        // External Audit Domain
                                        if (module.id === 'federal-external') return 'Automated Federal Features';
                                        if (module.id === 'commercial-external') return 'Fully Automated, Auditor-Passive Features';
                                        
                                        return 'Key Features';
                                      })()}
                                    </Typography>
                                    <Stack spacing={0.75} sx={{ mt: 0.5 }}>
                                      {module.features.map((feature, featureIndex) => (
                                        <Box key={featureIndex} sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.75 }}>
                                          <CheckCircle 
                                            sx={{ 
                                              fontSize: 14, 
                                              color: module.comingSoon ? 'rgba(255,255,255,0.3)' : '#4ade80',
                                              mt: 0.25,
                                            }} 
                                          />
                                          <Typography
                                            variant="caption"
                                            sx={{
                                              color: module.comingSoon ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.7)',
                                              fontSize: '0.8rem',
                                              lineHeight: 1.4,
                                            }}
                                          >
                                            {feature}
                                          </Typography>
                                        </Box>
                                      ))}
                                    </Stack>

                                    {/* Add-on Features */}
                                    {module.addOnFeatures && (
                                      <Box sx={{ mt: 2 }}>
                                        <Typography
                                          variant="caption"
                                          sx={{
                                            color: 'rgba(255,255,255,0.6)',
                                            fontWeight: 600,
                                            textTransform: 'uppercase',
                                            letterSpacing: 0.5,
                                            fontSize: '0.7rem',
                                          }}
                                        >
                                          {(() => {
                                            // Internal Audit Domain
                                            if (module.id.includes('-internal')) return 'Audit Readiness Add-On Bundle';
                                            
                                            // External Audit Domain
                                            if (module.id === 'federal-external') return 'Minimal Reviewer Workflow';
                                            if (module.id === 'commercial-external') return 'Passive Reviewer Mode';
                                            
                                            return 'Additional Features';
                                          })()}
                                        </Typography>
                                        <Stack spacing={0.75} sx={{ mt: 0.5 }}>
                                          {module.addOnFeatures.map((feature, featureIndex) => (
                                            <Box key={featureIndex} sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.75 }}>
                                              <CheckCircle 
                                                sx={{ 
                                                  fontSize: 14, 
                                                  color: '#3B82F6',
                                                  mt: 0.25,
                                                }} 
                                              />
                                              <Typography
                                                variant="caption"
                                                sx={{
                                                  color: 'rgba(255,255,255,0.7)',
                                                  fontSize: '0.8rem',
                                                  lineHeight: 1.4,
                                                }}
                                              >
                                                {feature}
                                              </Typography>
                                            </Box>
                                          ))}
                                        </Stack>
                                      </Box>
                                    )}
                                  </Box>
                                </Box>
                              </Collapse>
                            </Box>
                          </Box>
                        ))}
                      </Stack>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Pillars;