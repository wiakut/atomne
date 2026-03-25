import { motion } from 'framer-motion';

interface ScreenWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export function ScreenWrapper({ children, className = '' }: ScreenWrapperProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.25 }}
      className={`relative min-h-dvh flex flex-col px-4 py-6 ${className}`}
    >
      {children}
    </motion.div>
  );
}
