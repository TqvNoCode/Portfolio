import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from 'react';
import { motion, type HTMLMotionProps } from 'motion/react';

const styles: Record<'wrapper' | 'srOnly' | 'word' | 'cell' | 'ghost' | 'glyph', CSSProperties> = {
  wrapper: {
    display: 'inline-block',
    whiteSpace: 'pre-wrap',
  },
  srOnly: {
    position: 'absolute',
    width: '1px',
    height: '1px',
    padding: 0,
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0,0,0,0)',
    whiteSpace: 'nowrap',
    border: 0,
  },
  word: {
    whiteSpace: 'nowrap',
  },
  cell: {
    position: 'relative',
    display: 'inline-block',
  },
  ghost: {
    visibility: 'hidden',
  },
  glyph: {
    position: 'absolute',
    top: 0,
    left: '50%',
    transform: 'translateX(-50%)',
  },
};

interface DecryptedTextProps extends HTMLMotionProps<'span'> {
  text: string;
  speed?: number;
  maxIterations?: number;
  sequential?: boolean;
  characters?: string;
  className?: string;
  parentClassName?: string;
  encryptedClassName?: string;
  animateOn?: 'view' | 'hover';
}

const isSpace = (char: string) => /\s/.test(char);

export default function DecryptedText({
  text,
  speed = 40,
  maxIterations = 8,
  sequential = true,
  characters = '01#$_[]<>/\\!*',
  className = '',
  parentClassName = '',
  encryptedClassName = '',
  animateOn = 'hover',
  ...props
}: DecryptedTextProps) {
  const chars = useMemo(() => Array.from(String(text ?? '')), [text]);
  const [displayText, setDisplayText] = useState<string[]>(chars);
  const [isRevealed, setIsRevealed] = useState<boolean[]>(chars.map(() => true));
  const intervalRef = useRef<number | null>(null);

  const startAnimation = () => {
    // Check reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplayText(chars);
      setIsRevealed(chars.map(() => true));
      return;
    }

    if (intervalRef.current) clearInterval(intervalRef.current);

    let iteration = 0;
    const totalChars = chars.length;
    const currentRevealed = chars.map((c) => isSpace(c));
    setIsRevealed(currentRevealed);

    intervalRef.current = window.setInterval(() => {
      iteration++;

      setDisplayText(
        chars.map((char, index) => {
          if (isSpace(char)) return char;

          if (sequential) {
            const revealThreshold = Math.floor((iteration / (maxIterations * 2)) * totalChars);
            if (index <= revealThreshold) {
              currentRevealed[index] = true;
              return char;
            }
          } else if (iteration >= maxIterations) {
            currentRevealed[index] = true;
            return char;
          }

          const randomChar = characters[Math.floor(Math.random() * characters.length)];
          return randomChar;
        })
      );

      setIsRevealed([...currentRevealed]);

      if (iteration >= maxIterations * 2.5) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setDisplayText(chars);
        setIsRevealed(chars.map(() => true));
      }
    }, speed);
  };

  useEffect(() => {
    if (animateOn === 'view') {
      startAnimation();
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [text]);

  return (
    <motion.span
      className={parentClassName}
      style={styles.wrapper}
      onMouseEnter={animateOn === 'hover' ? startAnimation : undefined}
      {...props}
    >
      <span style={styles.srOnly}>{text}</span>

      <span aria-hidden="true">
        {displayText.map((char, index) => {
          const revealed = isRevealed[index];
          return (
            <span
              key={index}
              className={revealed ? className : encryptedClassName}
              style={{
                ...styles.cell,
                color: revealed ? undefined : 'var(--color-accent-mint)',
                opacity: revealed ? 1 : 0.85,
              }}
            >
              {char}
            </span>
          );
        })}
      </span>
    </motion.span>
  );
}
