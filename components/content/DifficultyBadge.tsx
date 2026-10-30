import type { Difficulty } from '@/config/content';

const tone: Record<Difficulty, string> = {
  Beginner: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  Easy: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  Intermediate: 'bg-amber-50 text-amber-700 ring-amber-200',
  Medium: 'bg-amber-50 text-amber-700 ring-amber-200',
  Advanced: 'bg-rose-50 text-rose-700 ring-rose-200',
  Hard: 'bg-rose-50 text-rose-700 ring-rose-200',
};

export default function DifficultyBadge({ level }: { level: Difficulty }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${tone[level]}`}>
      {level}
    </span>
  );
}
