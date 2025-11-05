import type { ChatMessage } from '@/components/Chat';
import { cn } from '@/lib/utils';

export function MessageList({ messages }: { messages: ChatMessage[] }) {
  return (
    <div className="prose prose-zinc max-w-none dark:prose-invert">
      {messages
        .filter(m => m.role !== 'system')
        .map(m => (
          <div key={m.id} className={cn('mb-4 rounded-2xl p-3 text-sm', m.role === 'user' ? 'bg-zinc-100 dark:bg-zinc-800' : 'bg-zinc-50 dark:bg-zinc-900/60')}> 
            <div className="mb-1 text-[11px] uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              {m.role === 'user' ? 'You' : 'Assistant'}
            </div>
            <div className="whitespace-pre-wrap leading-6">{m.content}</div>
          </div>
        ))}
    </div>
  );
}
