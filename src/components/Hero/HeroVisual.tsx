import React from 'react';
import styles from './HeroVisual.module.css';

export const HeroVisual: React.FC = () => {
  return (
    <div className={styles.visualWrapper} aria-label="Interactive Systems and Neural Architecture Matrix">
      <div className={styles.gridCanvas}>
        <svg
          viewBox="0 0 520 460"
          className={styles.svgMatrix}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Gradients */}
            <linearGradient id="mintTrace" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#86D5CE" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#86D5CE" stopOpacity="0.1" />
            </linearGradient>

            <linearGradient id="warmTrace" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#E8B987" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#E8B987" stopOpacity="0.2" />
            </linearGradient>

            <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#86D5CE" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#15232C" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#0B1217" stopOpacity="0" />
            </radialGradient>

            <filter id="subtleGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Coordinate system backdrop */}
          <rect x="20" y="20" width="480" height="420" rx="8" fill="#0E171E" stroke="#314550" strokeWidth="1" />
          
          {/* Subtle grid ticks */}
          <g stroke="#314550" strokeWidth="0.75" strokeDasharray="3 5" opacity="0.6">
            <line x1="60" y1="20" x2="60" y2="440" />
            <line x1="160" y1="20" x2="160" y2="440" />
            <line x1="260" y1="20" x2="260" y2="440" />
            <line x1="360" y1="20" x2="360" y2="440" />
            <line x1="460" y1="20" x2="460" y2="440" />

            <line x1="20" y1="80" x2="500" y2="80" />
            <line x1="20" y1="160" x2="500" y2="160" />
            <line x1="20" y1="240" x2="500" y2="240" />
            <line x1="20" y1="320" x2="500" y2="320" />
            <line x1="20" y1="400" x2="500" y2="400" />
          </g>

          {/* Core Central Processor / Neural Kernel */}
          <circle cx="260" cy="220" r="85" fill="url(#coreGlow)" />
          
          <rect
            x="205"
            y="165"
            width="110"
            height="110"
            rx="8"
            fill="#15232C"
            stroke="#86D5CE"
            strokeWidth="1.5"
            filter="url(#subtleGlow)"
          />

          {/* Internal Tensor Grid */}
          <rect x="220" y="180" width="22" height="22" rx="3" fill="rgba(134, 213, 206, 0.2)" stroke="#86D5CE" strokeWidth="1" />
          <rect x="249" y="180" width="22" height="22" rx="3" fill="rgba(232, 185, 135, 0.2)" stroke="#E8B987" strokeWidth="1" />
          <rect x="278" y="180" width="22" height="22" rx="3" fill="rgba(49, 69, 80, 0.5)" stroke="#314550" strokeWidth="1" />

          <rect x="220" y="209" width="22" height="22" rx="3" fill="rgba(49, 69, 80, 0.5)" stroke="#314550" strokeWidth="1" />
          <rect x="249" y="209" width="22" height="22" rx="3" fill="#86D5CE" />
          <rect x="278" y="209" width="22" height="22" rx="3" fill="rgba(134, 213, 206, 0.3)" stroke="#86D5CE" strokeWidth="1" />

          <rect x="220" y="238" width="22" height="22" rx="3" fill="rgba(232, 185, 135, 0.2)" stroke="#E8B987" strokeWidth="1" />
          <rect x="249" y="238" width="22" height="22" rx="3" fill="rgba(49, 69, 80, 0.5)" stroke="#314550" strokeWidth="1" />
          <rect x="278" y="238" width="22" height="22" rx="3" fill="rgba(134, 213, 206, 0.2)" stroke="#86D5CE" strokeWidth="1" />

          {/* Left Traces: Systems & Architecture Bus */}
          <path
            d="M 60 100 L 140 100 L 175 185 L 205 185"
            stroke="#86D5CE"
            strokeWidth="1.75"
            strokeDasharray="6 3"
            className={styles.pulseTrace}
          />
          <circle cx="60" cy="100" r="4" fill="#86D5CE" />
          <text x="65" y="92" fill="#8EACB9" fontFamily="var(--font-mono)" fontSize="10">SYS_BUS // 0x01</text>

          <path
            d="M 60 220 L 145 220 L 205 220"
            stroke="#314550"
            strokeWidth="1.5"
          />
          <circle cx="60" cy="220" r="4" fill="#314550" />
          <text x="65" y="212" fill="#8EACB9" fontFamily="var(--font-mono)" fontSize="10">EXEC_CORE // RUNTIME</text>

          <path
            d="M 60 340 L 135 340 L 175 255 L 205 255"
            stroke="#86D5CE"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            className={styles.pulseTraceReverse}
          />
          <circle cx="60" cy="340" r="4" fill="#86D5CE" />
          <text x="65" y="355" fill="#8EACB9" fontFamily="var(--font-mono)" fontSize="10">LINUX_POSIX // STOW</text>

          {/* Right Traces: Applied AI & Numerical Tensors */}
          <path
            d="M 460 100 L 380 100 L 345 185 L 315 185"
            stroke="#E8B987"
            strokeWidth="1.75"
            strokeDasharray="6 3"
            className={styles.pulseTrace}
          />
          <circle cx="460" cy="100" r="4" fill="#E8B987" />
          <text x="365" y="92" fill="#E8B987" fontFamily="var(--font-mono)" fontSize="10">TENSOR_OP // MATH</text>

          <path
            d="M 460 220 L 375 220 L 315 220"
            stroke="#314550"
            strokeWidth="1.5"
          />
          <circle cx="460" cy="220" r="4" fill="#314550" />
          <text x="360" y="212" fill="#8EACB9" fontFamily="var(--font-mono)" fontSize="10">ODE_SOLVER // VERIFIED</text>

          <path
            d="M 460 340 L 385 340 L 345 255 L 315 255"
            stroke="#E8B987"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            className={styles.pulseTraceReverse}
          />
          <circle cx="460" cy="340" r="4" fill="#E8B987" />
          <text x="375" y="355" fill="#E8B987" fontFamily="var(--font-mono)" fontSize="10">INFERENCE // EVAL</text>

          {/* Status Bar at base */}
          <rect x="40" y="390" width="440" height="28" rx="4" fill="#15232C" stroke="#314550" strokeWidth="1" />
          <circle cx="56" cy="404" r="3.5" fill="#86D5CE" />
          <text x="68" y="408" fill="#E5EEF2" fontFamily="var(--font-mono)" fontSize="11" fontWeight="500">
            SYSTEM_STATUS: COMPILED &amp; VERIFIED // TQV ARCH LAB
          </text>
          <text x="410" y="408" fill="#86D5CE" fontFamily="var(--font-mono)" fontSize="10">
            [ READY ]
          </text>
        </svg>
      </div>
    </div>
  );
};
