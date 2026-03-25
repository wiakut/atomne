interface ProgressBarProps {
  value: number;
  max: number;
  color?: 'cyan' | 'pink';
}

export function ProgressBar({ value, max, color = 'cyan' }: ProgressBarProps) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  const barColor = color === 'cyan' ? 'bg-cyan glow-cyan' : 'bg-pink glow-pink';

  return (
    <div className="h-3 bg-white/5 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-500 ${barColor}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
