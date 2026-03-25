import { motion } from 'framer-motion';

interface GlowButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  color?: 'cyan' | 'pink';
  variant?: 'filled' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
}

export function GlowButton({
  children,
  onClick,
  color = 'cyan',
  variant = 'outline',
  size = 'md',
  className = '',
  disabled = false,
}: GlowButtonProps) {
  const colors = {
    cyan: {
      filled: 'bg-cyan text-bg border-cyan glow-cyan hover:bg-cyan/90',
      outline: 'border-cyan bg-cyan/10 text-cyan glow-cyan hover:bg-cyan/20',
      ghost: 'border-transparent text-cyan/70 hover:text-cyan hover:bg-cyan/10',
    },
    pink: {
      filled: 'bg-pink text-white border-pink glow-pink hover:bg-pink/90',
      outline: 'border-pink bg-pink/10 text-pink glow-pink hover:bg-pink/20',
      ghost: 'border-transparent text-pink/70 hover:text-pink hover:bg-pink/10',
    },
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm rounded-lg',
    md: 'px-6 py-3 text-lg rounded-xl',
    lg: 'px-8 py-4 text-xl rounded-xl',
  };

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      disabled={disabled}
      className={`border font-semibold transition-colors active:transition-none
        ${colors[color][variant]} ${sizes[size]}
        ${disabled ? 'opacity-40 pointer-events-none' : ''} ${className}`}
    >
      {children}
    </motion.button>
  );
}
