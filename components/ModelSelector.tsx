"use client";

import { cn } from '@/lib/utils';

type Props = {
  value: string;
  onChange: (v: string) => void;
};

const MODELS = [
  { id: 'gpt-4o-mini', label: 'GPT-4o mini' },
  { id: 'gpt-4o', label: 'GPT-4o' },
  { id: 'gpt-4.1-mini', label: 'GPT-4.1 mini' },
  { id: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' }
];

export function ModelSelector({ value, onChange }: Props) {
  return (
    <div className="flex items-center gap-1 rounded-full border border-zinc-200 bg-white p-1 text-xs shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      {MODELS.map(m => (
        <button
          key={m.id}
          className={cn(
            'rounded-full px-3 py-1 transition',
            value === m.id
              ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
              : 'text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800'
          )}
          onClick={() => onChange(m.id)}
          type="button"
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}
