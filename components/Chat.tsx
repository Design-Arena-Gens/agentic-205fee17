"use client";

import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowUp, Loader2, Sparkles } from 'lucide-react';
import { ModelSelector } from '@/components/ModelSelector';
import { MessageList } from '@/components/MessageList';

type Role = 'system' | 'user' | 'assistant';

export type ChatMessage = {
  id: string;
  role: Role;
  content: string;
};

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    { id: uid(), role: 'system', content: 'You are a helpful, concise AI assistant.' }
  ]);
  const [input, setInput] = useState('');
  const [model, setModel] = useState('gpt-4o-mini');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  const canSend = input.trim().length > 0 && !loading;

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const placeholder = useMemo(
    () => 'Ask anything? (Shift+Enter for newline)',
    []
  );

  async function onSend() {
    if (!canSend) return;
    const content = input.trim();
    setInput('');

    const nextMessages = [
      ...messages,
      { id: uid(), role: 'user' as const, content }
    ];
    setMessages(nextMessages);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages, model })
      });

      if (!res.ok) throw new Error('Request failed');
      const data = await res.json();

      setMessages(m => [...m, { id: uid(), role: 'assistant', content: data.reply as string }]);
    } catch (err) {
      setMessages(m => [
        ...m,
        {
          id: uid(),
          role: 'assistant',
          content: 'Sorry, something went wrong while generating a reply.'
        }
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  }

  return (
    <div className="flex h-full flex-1 flex-col">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
          <Sparkles className="h-4 w-4" />
          <span>Ultra Chatbot</span>
        </div>
        <ModelSelector value={model} onChange={setModel} />
      </div>

      <div className="relative flex-1 overflow-auto rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <MessageList messages={messages} />
        {loading && (
          <div className="mx-auto mt-4 w-fit rounded-full border border-zinc-200 px-3 py-1 text-xs text-zinc-600 shadow-sm dark:border-zinc-800 dark:text-zinc-300">
            <div className="flex items-center gap-2">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Thinking?
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="mt-4 flex items-end gap-2">
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          rows={1}
          placeholder={placeholder}
          className="min-h-[44px] w-full resize-y rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm leading-5 outline-none ring-0 placeholder:text-zinc-400 focus:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:placeholder:text-zinc-600 dark:focus:border-zinc-700"
        />
        <button
          type="button"
          disabled={!canSend}
          onClick={onSend}
          className="inline-flex h-11 items-center justify-center rounded-2xl bg-zinc-900 px-4 text-sm font-medium text-white shadow transition enabled:hover:bg-zinc-800 enabled:active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ArrowUp className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  );
}
