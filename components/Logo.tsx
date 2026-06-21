import { cn } from '@/lib/utils';

export default function Logo({
  className,
  showWordmark = true,
}: {
  className?: string;
  showWordmark?: boolean;
}) {
  return (
    <span className={cn('inline-flex items-center gap-3', className)}>
      <svg
        viewBox="0 0 64 64"
        fill="none"
        className="h-7 w-7 sm:h-8 sm:w-8"
        aria-hidden="true"
      >
        <path
          d="M32 6 L60 58 L4 58 Z"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinejoin="miter"
        />
        <path
          d="M32 22 L48 50 L16 50 Z"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinejoin="miter"
        />
        <line
          x1="22"
          y1="42"
          x2="42"
          y2="42"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="square"
        />
      </svg>
      {showWordmark && (
        <span className="font-display text-2xl font-medium tracking-[0.18em] sm:text-[1.65rem]">
          WOODIST
        </span>
      )}
    </span>
  );
}
