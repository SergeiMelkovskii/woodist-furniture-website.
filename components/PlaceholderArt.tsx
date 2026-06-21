import { cn } from '@/lib/utils';

type Variant = 'piece' | 'interior';

const themes = {
  piece: {
    base: 'placeholder-piece text-taupe-800',
    accent: 'text-taupe-700',
  },
  interior: {
    base: 'placeholder-interior text-bone',
    accent: 'text-taupe-300',
  },
};

export default function PlaceholderArt({
  label,
  category,
  variant = 'piece',
  className,
}: {
  label: string;
  category?: string;
  variant?: Variant;
  className?: string;
}) {
  const theme = themes[variant];
  return (
    <div
      className={cn(
        'relative isolate flex h-full w-full flex-col justify-between overflow-hidden p-8',
        theme.base,
        className,
      )}
      aria-hidden="true"
    >
      <div className="grain absolute inset-0 -z-10" />
      <div className="flex items-start justify-between">
        {category && (
          <span
            className={cn(
              'text-[10px] font-medium uppercase tracking-[0.3em]',
              theme.accent,
            )}
          >
            {category}
          </span>
        )}
        <svg
          viewBox="0 0 32 32"
          className={cn('h-5 w-5', theme.accent)}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M16 3 L29 28 L3 28 Z" />
          <line x1="10" y1="22" x2="22" y2="22" />
        </svg>
      </div>
      <div className="font-display text-2xl leading-tight tracking-tight sm:text-3xl">
        {label}
      </div>
    </div>
  );
}
