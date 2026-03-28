import { useRef, useState, useEffect} from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// ── Google Fonts injection ──────────────────────────────────────────────────
const FontLoader = () => {
  useEffect(() => {
    const link = document.createElement('link');
    link.href =
      'https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);
  return null;
};

// ── CSS-in-JS styles ────────────────────────────────────────────────────────
const makeStyles = (theme: string) => {
  const isColor = theme === 'color';
  return {
    '--bg': isColor ? '#0d0d0d' : '#ffffff',
    '--bg2': isColor ? '#141414' : '#f5f5f5',
    '--bg3': isColor ? '#1c1c1c' : '#ebebeb',
    '--border': isColor ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.10)',
    '--text': isColor ? '#f0ede8' : '#111111',
    '--muted': isColor ? '#6b6763' : '#888888',
    '--accent': isColor ? '#FF6B35' : '#111111',
    '--accent2': isColor ? '#8B5CF6' : '#555555',
    '--pill-bg': isColor ? 'rgba(255,107,53,0.12)' : 'rgba(0,0,0,0.07)',
    '--pill-text': isColor ? '#FF6B35' : '#111111',
    '--nav-active': isColor ? 'rgba(255,107,53,0.13)' : 'rgba(0,0,0,0.07)',
    '--card-bg': isColor ? '#1a1a1a' : '#ffffff',
    '--card-border': isColor ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.12)',
  };
};

// ── 3D Cube ─────────────────────────────────────────────────────────────────
function SpinCube({ theme }: { theme: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.35;
      groupRef.current.rotation.x = Math.sin(t * 0.2) * 0.25;
      groupRef.current.position.y = Math.sin(t * 0.6) * 0.12;
    }
  });

  const isColor = theme === 'color';
  const cubeColor = isColor ? '#FF6B35' : '#222222';
  const emissive = isColor ? '#c43a08' : '#000000';
  const wireColor = isColor ? '#8B5CF6' : '#aaaaaa';

  return (
    <group ref={groupRef}>
      <mesh ref={meshRef}>
        <boxGeometry args={[2.2, 2.2, 2.2]} />
        <meshStandardMaterial
          color={cubeColor}
          emissive={emissive}
          emissiveIntensity={isColor ? 0.25 : 0.05}
          roughness={0.25}
          metalness={0.55}
        />
      </mesh>
      <mesh ref={wireRef}>
        <boxGeometry args={[2.2, 2.2, 2.2]} />
        <meshBasicMaterial
          color={wireColor}
          wireframe
          transparent
          opacity={isColor ? 0.18 : 0.12}
        />
      </mesh>
    </group>
  );
}

function ThreeScene({ theme }: { theme: string }) {
  const isColor = theme === 'color';
  return (
    <Canvas camera={{ position: [4, 2.5, 5.5], fov: 40 }}>
      <ambientLight intensity={isColor ? 0.3 : 0.6} />
      <directionalLight position={[6, 8, 4]} intensity={1.4} />
      {isColor && (
        <>
          <pointLight position={[-4, 3, 3]} color="#FF6B35" intensity={3} distance={12} />
          <pointLight position={[4, -2, -3]} color="#8B5CF6" intensity={2} distance={10} />
        </>
      )}
      <SpinCube theme={theme} />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate={false} />
    </Canvas>
  );
}

// ── Minimalist Project Carousel ────────────────────────────────────────────
const PROJECTS = [
  {
    id: 1,
    title: '3D Portfolio',
    tech: 'React · Three.js',
    tag: 'Live',
    desc: 'Immersive 3D personal portfolio with interactive WebGL scenes.',
  },
  {
    id: 2,
    title: 'AI Image Gen',
    tech: 'Python · FastAPI',
    tag: 'Live',
    desc: 'Text-to-image pipeline powered by diffusion models and REST API.',
  },
  {
    id: 3,
    title: 'E-Commerce App',
    tech: 'Next.js · Stripe',
    tag: 'Live',
    desc: 'Full-stack store with real-time inventory and payments.',
  },
  {
    id: 4,
    title: 'Design System',
    tech: 'Storybook · Figma',
    tag: 'WIP',
    desc: 'Component library with accessibility-first primitives.',
  },
  {
    id: 5,
    title: 'Real-time Chat',
    tech: 'Socket.io · Redis',
    tag: 'Live',
    desc: 'Scalable chat with presence indicators and message threading.',
  },
  {
    id: 6,
    title: 'Data Dashboard',
    tech: 'D3 · Recharts',
    tag: 'Live',
    desc: 'Analytics dashboard with animated charts and CSV export.',
  },
];

function ProjectCarousel({ theme }: { theme: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1024);
  const isColor = theme === 'color';
  const vars = makeStyles(theme);
  const totalProjects = PROJECTS.length;
  const projectsToShow = isLargeScreen ? 2 : 1;

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const nextProject = () => {
    setCurrentIndex((prev) => (prev + 1) % (totalProjects - projectsToShow + 1));
  };

  const prevProject = () => {
    setCurrentIndex((prev) => (prev - 1 + (totalProjects - projectsToShow + 1)) % (totalProjects - projectsToShow + 1));
  };

  useEffect(() => {
    const interval = setInterval(nextProject, 5000);
    return () => clearInterval(interval);
  }, [projectsToShow]);

  const getVisibleProjects = () => {
    const start = currentIndex;
    const end = start + projectsToShow;
    return PROJECTS.slice(start, end);
  };

  const visibleProjects = getVisibleProjects();

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      width: '100%',
      padding: '0 20px',
    }}>
      {/* Projects Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isLargeScreen ? 'repeat(2, 1fr)' : '1fr',
        gap: '32px',
        alignItems: 'stretch',
      }}>
        {visibleProjects.map((project) => (
          <div
            key={`${project.id}-${currentIndex}`}
            style={{
              textAlign: 'center',
              padding: 'clamp(24px, 4vw, 32px)',
              background: isColor ? 'rgba(255,107,53,0.03)' : 'rgba(0,0,0,0.02)',
              border: `1px solid ${isColor ? 'rgba(255,107,53,0.15)' : 'rgba(0,0,0,0.08)'}`,
              borderRadius: '16px',
              transition: 'all 0.3s ease',
              animation: 'fadeIn 0.5s ease-out',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = isColor ? '#FF6B35' : '#111';
              e.currentTarget.style.background = isColor ? 'rgba(255,107,53,0.06)' : 'rgba(0,0,0,0.04)';
              e.currentTarget.style.transform = 'translateY(-4px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = isColor ? 'rgba(255,107,53,0.15)' : 'rgba(0,0,0,0.08)';
              e.currentTarget.style.background = isColor ? 'rgba(255,107,53,0.03)' : 'rgba(0,0,0,0.02)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {/* Tag */}
            <span style={{
              fontSize: '11px',
              fontWeight: 500,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              padding: '4px 12px',
              borderRadius: '20px',
              background: project.tag === 'Live'
                ? (isColor ? 'rgba(52,211,153,0.12)' : 'rgba(0,0,0,0.05)')
                : (isColor ? 'rgba(251,191,36,0.12)' : 'rgba(0,0,0,0.05)'),
              color: project.tag === 'Live'
                ? (isColor ? '#34d399' : '#444')
                : (isColor ? '#fbbf24' : '#666'),
              display: 'inline-block',
              marginBottom: '20px',
              alignSelf: 'center',
            }}>
              {project.tag}
            </span>

            {/* Title */}
            <h3 style={{
              fontFamily: 'Syne,sans-serif',
              fontSize: 'clamp(20px, 4vw, 28px)',
              fontWeight: 700,
              marginBottom: '12px',
              color: vars['--text'],
              letterSpacing: '-0.02em',
            }}>
              {project.title}
            </h3>

            {/* Tech Stack */}
            <div style={{
              fontSize: '13px',
              color: isColor ? '#8B5CF6' : '#777',
              fontWeight: 500,
              marginBottom: '16px',
              letterSpacing: '0.03em',
            }}>
              {project.tech}
            </div>

            {/* Description */}
            <p style={{
              fontFamily: 'DM Sans,sans-serif',
              fontSize: '14px',
              lineHeight: 1.6,
              color: vars['--muted'],
              marginBottom: '24px',
              flex: 1,
            }}>
              {project.desc}
            </p>

            {/* Buttons */}
            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'center',
              marginTop: 'auto',
            }}>
              <button style={{
                padding: '8px 20px',
                background: 'transparent',
                color: vars['--text'],
                border: `1px solid ${isColor ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)'}`,
                borderRadius: '30px',
                fontSize: '12px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontFamily: 'DM Sans,sans-serif',
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = isColor ? '#FF6B35' : '#111';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = isColor ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                GitHub
              </button>
              <button style={{
                padding: '8px 20px',
                background: isColor ? '#FF6B35' : '#111',
                color: '#fff',
                border: 'none',
                borderRadius: '30px',
                fontSize: '12px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontFamily: 'DM Sans,sans-serif',
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.opacity = '0.9';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.opacity = '1';
                }}
              >
                View Projects →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation - Only show if more projects than visible */}
      {totalProjects > projectsToShow && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '24px',
          marginTop: '40px',
          paddingTop: '44px',
        //  borderTop: `1px solid ${isColor ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
        }}>
          <button
            onClick={prevProject}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'transparent',
              border: `1px solid ${isColor ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)'}`,
              color: vars['--text'],
              fontSize: '18px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = isColor ? '#FF6B35' : '#111';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = isColor ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            ←
          </button>

          {/* Dots */}
          <div style={{
            display: 'flex',
            gap: '10px',
          }}>
            {Array.from({ length: totalProjects - projectsToShow + 1 }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                style={{
                  width: idx === currentIndex ? '24px' : '6px',
                  height: '6px',
                  borderRadius: '3px',
                  border: 'none',
                  background: idx === currentIndex
                    ? (isColor ? '#FF6B35' : '#111')
                    : (isColor ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)'),
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
              />
            ))}
          </div>

          <button
            onClick={nextProject}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'transparent',
              border: `1px solid ${isColor ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)'}`,
              color: vars['--text'],
              fontSize: '18px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = isColor ? '#FF6B35' : '#111';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = isColor ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            →
          </button>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

// ── Contact ──────────────────────────────────────────────────────────────────
const CONTACTS = [
  { label: 'LinkedIn', icon: '💼', href: 'https://linkedin.com/in/navinda', value: 'linkedin.com/in/navinda' },
  { label: 'GitHub', icon: '🐙', href: 'https://github.com/navinda', value: 'github.com/navinda' },
  { label: 'Email', icon: '✉️', href: 'mailto:navinda@email.com', value: 'navinda@email.com' },
  { label: 'Twitter/X', icon: '🐦', href: 'https://x.com/navinda', value: 'x.com/navinda' },
];

function ContactSection({ theme }: { theme: string }) {
  const isColor = theme === 'color';
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16, width: '100%', maxWidth: 600 }}>
      {CONTACTS.map(c => (
        <a key={c.label} href={c.href} target="_blank" rel="noopener noreferrer" style={{
          display: 'flex', flexDirection: 'column', gap: 8,
          padding: '20px 22px',
          background: isColor ? '#1a1a1a' : '#fff',
          border: `1px solid ${isColor ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.10)'}`,
          borderRadius: 12, textDecoration: 'none',
          transition: 'transform 0.2s, box-shadow 0.2s',
          boxShadow: isColor ? 'none' : '0 2px 10px rgba(0,0,0,0.06)',
        }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = isColor
              ? '0 8px 32px rgba(255,107,53,0.18)'
              : '0 8px 24px rgba(0,0,0,0.12)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = isColor ? 'none' : '0 2px 10px rgba(0,0,0,0.06)';
          }}
        >
          <span style={{ fontSize: 24 }}>{c.icon}</span>
          <div>
            <div style={{
              fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 13,
              color: isColor ? '#FF6B35' : '#111', marginBottom: 2,
            }}>{c.label}</div>
            <div style={{ fontSize: 11, color: isColor ? '#6b6763' : '#888', fontWeight: 300 }}>{c.value}</div>
          </div>
        </a>
      ))}
    </div>
  );
}



// ── Side Nav ─────────────────────────────────────────────────────────────────
const SECTIONS = ['hero', 'about', 'projects', 'contact'];

function SideNav({ active, onNav, theme }: { active: string; onNav: (id: string) => void; theme: string }) {
  const isColor = theme === 'color';
  return (
    <nav style={{
      position: 'fixed', right: 20, top: '50%',
      transform: 'translateY(-50%)',
      display: 'flex', flexDirection: 'column', gap: 14,
      zIndex: 100,
    }}>
      {SECTIONS.map(s => {
        const isActive = active === s;
        return (
          <button key={s}
            onClick={() => onNav(s)}
            title={s.charAt(0).toUpperCase() + s.slice(1)}
            style={{
              width: isActive ? 28 : 8, height: 8,
              borderRadius: 4,
              border: 'none',
              background: isActive
                ? (isColor ? '#FF6B35' : '#111')
                : (isColor ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)'),
              cursor: 'pointer', padding: 0,
              transition: 'all 0.3s ease',
            }}
          />
        );
      })}
    </nav>
  );
}

// ── Theme Toggle ──────────────────────────────────────────────────────────────
function ThemeToggle({ theme, onToggle }: { theme: string; onToggle: () => void }) {
  const isColor = theme === 'color';
  return (
    <button onClick={onToggle} style={{
      position: 'fixed', top: 20, right: 60, zIndex: 200,
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '8px 16px',
      background: isColor ? '#1a1a1a' : '#fff',
      border: `1px solid ${isColor ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'}`,
      borderRadius: 30, cursor: 'pointer',
      fontFamily: 'DM Sans,sans-serif', fontWeight: 500, fontSize: 12,
      color: isColor ? '#f0ede8' : '#111',
      boxShadow: isColor ? '0 4px 20px rgba(0,0,0,0.4)' : '0 4px 16px rgba(0,0,0,0.1)',
      transition: 'all 0.2s',
      letterSpacing: '0.04em',
    }}>
      <span style={{
        width: 10, height: 10, borderRadius: '50%',
        background: isColor
          ? 'linear-gradient(135deg,#FF6B35,#8B5CF6)'
          : '#111',
        flexShrink: 0, display: 'inline-block',
      }} />
      {isColor ? 'Color' : 'Mono'}
    </button>
  );
}

// ── Section wrapper ───────────────────────────────────────────────────────────
function Section({ id, children, theme, minH = true, style }: { id: any, children: React.ReactNode; theme: string, minH: boolean, style?: React.CSSProperties }) {
  const isColor = theme === 'color';
  return (
    <section id={id} style={{
      minHeight: minH ? '100svh' : 'auto',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '80px 24px',
      borderBottom: `1px solid ${isColor ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)'}`,
      ...style,
    }}>
      {children}
    </section>
  );
}

function SectionTitle({ children, theme }: { children: React.ReactNode; theme: string }) {
  const isColor = theme === 'color';
  return (
    <div style={{ textAlign: 'center', marginBottom: 48 }}>
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 10,
        padding: '5px 10px',
        background: isColor ? 'rgba(255,107,53,0.10)' : 'rgba(0,0,0,0.06)',
        borderRadius: 10, marginBottom: 14,
      }}>
        <span style={{
          fontFamily: 'DM Sans,sans-serif',
          fontSize: 18, fontWeight: 600, letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: isColor ? '#FF6B35' : '#111',
        }}>{children}</span>
      </div>
    </div>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [theme, setTheme] = useState('color');
  const [activeSection, setActive] = useState('hero');

  const isColor = theme === 'color';
  const vars = makeStyles(theme);

  // Apply CSS vars + bg/text to body
  useEffect(() => {
    const root = document.documentElement;
    Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v));
    document.body.style.background = vars['--bg'];
    document.body.style.color = vars['--text'];
    document.body.style.fontFamily = 'DM Sans,sans-serif';
    document.body.style.margin = '0';
    document.body.style.transition = 'background 0.4s,color 0.4s';
  }, [theme]);

  // Scroll spy
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); });
    }, { threshold: 0.4 });
    SECTIONS.forEach(id => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  const navTo = (id: any) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div style={{ background: vars['--bg'], color: vars['--text'], transition: 'background 0.4s,color 0.4s', minHeight: '100svh' }}>
      <FontLoader />
      <ThemeToggle theme={theme} onToggle={() => setTheme(t => t === 'color' ? 'mono' : 'color')} />
      <SideNav active={activeSection} onNav={navTo} theme={theme} />

      {/* ── HERO ── */}
      <section id="hero" style={{
        minHeight: '50svh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: 'clamp(80px, 10vh, 120px) clamp(24px, 5vw, 80px)',
        //  borderBottom: `1px solid ${isColor ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)'}`,
      }}>
        <div style={{
          width: '100%',
          maxWidth: '1200px',
          margin: '0 auto',
        }}>
          {/* Desktop: Side by side layout */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 48,
          }}>
            {/* This wrapper handles the side-by-side on desktop */}
            <div className="hero-content-wrapper" style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 48,
            }}>
              {/* Cube - Will be at top on mobile, side by side on desktop */}
              <div className="cube-container" style={{
                width: '100%',
                height: 'clamp(300px, 50vh, 500px)',
                position: 'relative',
              }}>
                {isColor && (
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'radial-gradient(ellipse at 55% 45%, rgba(255,107,53,0.18) 0%, rgba(139,92,246,0.12) 45%, transparent 70%)',
                    pointerEvents: 'none', zIndex: 0,
                  }} />
                )}
                <ThreeScene theme={theme} />
              </div>

              {/* Text Content */}
              <div className="text-container" style={{
                width: '100%',
              }}>
                <div className="status-badge" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  marginBottom: 28,
                  padding: '5px 16px',
                  border: `1px solid ${isColor ? 'rgba(255,107,53,0.3)' : 'rgba(0,0,0,0.12)'}`,
                  borderRadius: 30,
                }}>
                  <span style={{
                    width: 7, height: 7, borderRadius: '50%',
                    background: isColor ? '#34d399' : '#111',
                    // animation: 'pulse 2s ease-in-out infinite',
                  }} />
                  <span style={{
                    fontFamily: 'DM Sans,sans-serif', fontSize: 11, fontWeight: 500,
                    color: isColor ? '#34d399' : '#111', letterSpacing: '0.1em',
                  }}>Available for work</span>
                </div>

                <h1 style={{
                  fontFamily: 'Syne,sans-serif',
                  fontSize: 'clamp(38px, 5vw, 78px)',
                  fontWeight: 800,
                  lineHeight: 1.0,
                  margin: '0 0 16px',
                  color: vars['--text'],
                  letterSpacing: '-0.02em',
                }}>
                  Navinda

                </h1>
                <h3 style={{
                  fontFamily: 'Syne,sans-serif',
                  fontSize: 'clamp(28px, 3vw, 68px)',
                  fontWeight: 600,
                  lineHeight: 1.0,
                  margin: '0 0 16px',
                  color: vars['--text'],
                  letterSpacing: '-0.01em',
                }}>
                  <span style={{
                    background: isColor
                      ? 'linear-gradient(135deg,#FF6B35 0%,#8B5CF6 100%)'
                      : 'none',
                    WebkitBackgroundClip: isColor ? 'text' : undefined,
                    WebkitTextFillColor: isColor ? 'transparent' : vars['--text'],
                    backgroundClip: isColor ? 'text' : undefined,
                  }}>Hewawickrama</span>
                </h3>

                <p style={{
                  fontFamily: 'DM Sans,sans-serif',
                  fontSize: 'clamp(16px, 2vw, 18px)',
                  fontWeight: 300,
                  lineHeight: 1.7,
                  color: vars['--muted'],
                  margin: '0 0 36px',
                  maxWidth: '100%',
                }}>
                  Full-stack developer crafting immersive 3D web experiences.<br />
                  React · Three.js · Node.js · UI/UX
                </p>

                <div className="buttons-wrapper" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'sm:center lg:left' }}>
                  <button onClick={() => navTo('projects')} style={{
                    padding: '13px 28px',
                    background: isColor ? '#FF6B35' : '#111',
                    color: '#fff',
                    fontFamily: 'Syne,sans-serif', fontWeight: 700,
                    fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase',
                    border: 'none', borderRadius: 8, cursor: 'pointer',
                    transition: 'transform 0.15s, opacity 0.15s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                  >View Work</button>
                  <button onClick={() => navTo('contact')} style={{
                    padding: '13px 28px',
                    background: 'transparent',
                    color: vars['--text'],
                    fontFamily: 'Syne,sans-serif', fontWeight: 700,
                    fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase',
                    border: `1px solid ${isColor ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)'}`,
                    borderRadius: 8, cursor: 'pointer',
                    transition: 'border-color 0.15s',
                  }}>Contact</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes pulse { 
            0%,100%{opacity:1} 
            50%{opacity:0.3} 
          }
          
          /* Desktop styles (1024px and above) - side by side */
          @media (min-width: 1024px) {
            .hero-content-wrapper {
              display: grid !important;
              grid-template-columns: 1fr 1fr !important;
              align-items: center !important;
              gap: 60px !important;
            }
            .cube-container {
              order: 2 !important;
              height: clamp(450px, 60vh, 600px) !important;
            }
            .text-container {
              order: 1 !important;
            }
            .text-container h1,
            .text-container p,
            .text-container .buttons-wrapper {
              text-align: left !important;
            }
          }
          
          /* Tablet styles (768px to 1023px) - cube on top, text centered */
          @media (min-width: 768px) and (max-width: 1023px) {
            .hero-content-wrapper {
              display: flex !important;
              flex-direction: column !important;
              gap: 48px !important;
            }
            .cube-container {
              order: -1 !important;
              height: 400px !important;
            }
            .text-container {
              order: 0 !important;
              text-align: center !important;
            }
            .text-container h1,
            .text-container p {
              text-align: center !important;
            }
            .text-container .status-badge,
            .text-container .buttons-wrapper {
              justify-content: center !important;
              display: flex !important;
            }
          }
          
          /* Mobile styles (below 768px) - cube on top, text centered and justified */
          @media (max-width: 767px) {
            #hero {
              padding-top: 100px !important;
              justify-content: flex-start !important;
            }
            .hero-content-wrapper {
              display: flex !important;
              flex-direction: column !important;
              gap: 32px !important;
            }
            .cube-container {
              order: -1 !important;
              height: 280px !important;
            }
            .text-container {
              order: 0 !important;
              text-align: center !important;
            }
            .text-container h1,
            .text-container p {
              text-align: center !important;
            }
            .text-container p {
              text-align: justify !important;
              text-justify: inter-word !important;
              padding: 0 8px !important;
            }
            .text-container .status-badge,
            .text-container .buttons-wrapper {
              justify-content: center !important;
              display: flex !important;
            }
          }
        `}</style>
      </section>

      {/* ── ABOUT ── */}
      <Section id="about" theme={theme} minH={false} style={{ paddingTop: '40px', paddingBottom: '60px' }}>
        <SectionTitle theme={theme}>About</SectionTitle>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))',
          gap: '20px',
          maxWidth: '90vw',
          width: '100%',
          margin: '0 auto',
        }}>
          {/* Bio */}
          <div style={{
            padding: 'clamp(20px, 4vw, 32px) clamp(20px, 4vw, 28px)',
            background: isColor ? '#1a1a1a' : '#fff',
            border: `1px solid ${isColor ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.10)'}`,
            borderRadius: 14,
            gridColumn: '1 / -1',
          }}>
            <p style={{
              fontFamily: 'DM Sans,sans-serif',
              fontSize: 'clamp(14px, 1.6vw, 16px)',
              fontWeight: 300,
              lineHeight: 1.6,
              color: isColor ? '#c0bdb9' : '#444',
              textAlign: 'center',
              margin: 0,
            }}>
              Hey, I'm <strong style={{ fontWeight: 600, color: isColor ? '#FF6B35' : '#111' }}>Navinda</strong> — a passionate full-stack developer based in Sri Lanka.
              I specialise in building interactive 3D web experiences, sleek UIs, and scalable backends.
              When I'm not pushing pixels, I'm exploring new tech, contributing to open source, or hiking somewhere off the beaten track.
            </p>
          </div>

          {/* Stat cards - Updated with your stats */}
          {[
            { n: '2+', l: 'Years Coding', icon: '💻' },
            // { n: '4', l: 'BSc at Ruhuna', icon: '🎓' },
            { n: '2', l: 'Happy Clients', icon: '😊' },
            { n: '2', l: 'Projects Shipped', icon: '🚀' },
            { n: '10+', l: 'Open Source Contributions', icon: '�' },
            { n: '20+', l: 'Technologies & Languages', icon: '🚀' },
          ].map(({ n, l, icon }) => (
            <div key={l} style={{
              padding: 'clamp(16px, 3vw, 20px)',
              background: isColor ? '#141414' : '#f5f5f5',
              border: `1px solid ${isColor ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'}`,
              borderRadius: 12,
              textAlign: 'center',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              cursor: 'pointer',
            }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = isColor
                  ? '0 8px 20px rgba(255,107,53,0.2)'
                  : '0 8px 20px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{
                fontSize: 'clamp(28px, 5vw, 32px)',
                marginBottom: 8,
              }}>{icon}</div>
              <div style={{
                fontFamily: 'Syne,sans-serif',
                fontWeight: 800,
                fontSize: 'clamp(28px, 4vw, 32px)',
                color: isColor ? '#FF6B35' : '#111',
                lineHeight: 1,
                marginBottom: 6,
              }}>{n}</div>
              <div style={{
                fontSize: 'clamp(11px, 2vw, 12px)',
                color: vars['--muted'],
                fontWeight: 400
              }}>{l}</div>
            </div>
          ))}

          {/* Skills - Enhanced with icons and hover effects */}
          <div style={{
            padding: 'clamp(20px, 4vw, 28px)',
            gridColumn: '1 / -1',
            background: isColor ? '#1a1a1a' : '#fff',
            border: `1px solid ${isColor ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.10)'}`,
            borderRadius: 14,
          }}>
            <div style={{
              fontFamily: 'Syne,sans-serif',
              fontSize: 'clamp(12px, 2vw, 13px)',
              fontWeight: 700,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: isColor ? '#8B5CF6' : '#888',
              marginBottom: 20,
              textAlign: 'center',
            }}>
              Tech Stack & Tools
            </div>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px',
              justifyContent: 'center',
            }}>
              {[
                { name: 'React', icon: '⚛️', color: '#61DAFB' },
                { name: 'Next.js', icon: '▲', color: '#000000' },
                { name: 'Three.js', icon: '🎨', color: '#FF6B35' },
                { name: 'TypeScript', icon: '📘', color: '#3178C6' },
                { name: 'Node.js', icon: '🟢', color: '#339933' },
                { name: 'Python', icon: '🐍', color: '#3776AB' },
                { name: 'PostgreSQL', icon: '🐘', color: '#336791' },
                { name: 'MongoDB', icon: '🍃', color: '#47A248' },
                { name: 'Docker', icon: '🐳', color: '#2496ED' },
                { name: 'Figma', icon: '🎨', color: '#F24E1E' },
                { name: 'AWS', icon: '☁️', color: '#FF9900' },
                { name: 'Tailwind', icon: '🎨', color: '#06B6D4' },
                { name: 'GraphQL', icon: '📊', color: '#E10098' },
                { name: 'Redis', icon: '🔴', color: '#DC382D' },
                { name: 'Git', icon: '📝', color: '#F05032' },
                { name: 'Jest', icon: '✅', color: '#C21325' },
              ].map(skill => (
                <span
                  key={skill.name}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    borderRadius: 40,
                    background: isColor ? 'rgba(255,107,53,0.10)' : 'rgba(0,0,0,0.06)',
                    color: isColor ? '#FF6B35' : '#111',
                    fontSize: 'clamp(12px, 1.8vw, 13px)',
                    fontWeight: 500,
                    letterSpacing: '0.02em',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    border: `1px solid ${isColor ? 'rgba(255,107,53,0.2)' : 'rgba(0,0,0,0.08)'}`,
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.background = isColor
                      ? 'rgba(255,107,53,0.2)'
                      : 'rgba(0,0,0,0.1)';
                    e.currentTarget.style.boxShadow = isColor
                      ? '0 4px 12px rgba(255,107,53,0.3)'
                      : '0 4px 12px rgba(0,0,0,0.1)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.background = isColor
                      ? 'rgba(255,107,53,0.10)'
                      : 'rgba(0,0,0,0.06)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <span style={{ fontSize: '16px' }}>{skill.icon}</span>
                  <span>{skill.name}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ── PROJECTS ── */}
      <Section id="projects" theme={theme} minH={true}>
        <SectionTitle theme={theme}>Projects</SectionTitle>
        <ProjectCarousel theme={theme} />
      </Section>

      {/* ── CONTACT ── */}
      <Section id="contact" theme={theme} minH={true}>
        <SectionTitle theme={theme}>Contact</SectionTitle>
        <div style={{
          fontFamily: 'Syne,sans-serif', fontWeight: 800,
          fontSize: 'clamp(28px,4vw,48px)', lineHeight: 1.1,
          textAlign: 'center', marginBottom: 12, color: vars['--text'],
        }}>
          Let's build something<br />
          <span style={{
            background: isColor ? 'linear-gradient(90deg,#FF6B35,#8B5CF6)' : 'none',
            WebkitBackgroundClip: isColor ? 'text' : undefined,
            WebkitTextFillColor: isColor ? 'transparent' : vars['--text'],
          }}>together.</span>
        </div>
        <p style={{
          fontFamily: 'DM Sans,sans-serif', fontWeight: 300,
          fontSize: 14, color: vars['--muted'],
          textAlign: 'center', marginBottom: 40, lineHeight: 1.7,
        }}>
          Open to freelance projects, full-time roles &amp; collaborations.
        </p>
        <ContactSection theme={theme} />

        <a href="mailto:navinda@email.com" style={{
          marginTop: 36,
          display: 'inline-flex', alignItems: 'center', gap: 10,
          padding: '15px 36px',
          background: isColor ? '#FF6B35' : '#111',
          color: '#fff',
          fontFamily: 'Syne,sans-serif', fontWeight: 700,
          fontSize: 13, letterSpacing: '0.12em', textTransform: 'uppercase',
          borderRadius: 10, textDecoration: 'none',
          transition: 'opacity 0.15s',
        }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >Send a message →</a>

        <div style={{
          marginTop: 60, paddingTop: 24,
          borderTop: `1px solid ${isColor ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'}`,
          textAlign: 'center', fontSize: 11, color: vars['--muted'],
          fontWeight: 300, letterSpacing: '0.06em',
        }}>
          © 2026 Navinda · Built with React &amp; Three.js
        </div>
      </Section>
    </div>
  );
}