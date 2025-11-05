import './globals.css';
import type { Metadata } from 'next';
import { ReactNode } from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';

export const metadata: Metadata = {
  metadataBase: new URL('https://agentic-205fee17.vercel.app'),
  title: {
    default: 'Agentic Chat ? Ultra Chatbot',
    template: '%s ? Agentic Chat'
  },
  description: 'A fast, modern, model-agnostic chatbot experience.',
  openGraph: {
    title: 'Agentic Chat ? Ultra Chatbot',
    description: 'A fast, modern, model-agnostic chatbot experience.',
    url: 'https://agentic-205fee17.vercel.app',
    siteName: 'Agentic Chat',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Agentic Chat ? Ultra Chatbot',
    description: 'A fast, modern, model-agnostic chatbot experience.'
  },
  icons: [{ rel: 'icon', url: '/favicon.ico' }]
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
            (function(){
              try {
                const s = localStorage.getItem('theme');
                if (s === 'dark' || (!s && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {}
            })();
          `
          }}
        />
      </head>
      <body className="min-h-screen bg-white text-zinc-900 antialiased dark:bg-zinc-950 dark:text-zinc-100">
        <div className="mx-auto flex min-h-screen max-w-4xl flex-col px-4">
          <header className="sticky top-0 z-10 -mx-4 border-b border-zinc-200/60 bg-white/80 px-4 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
            <div className="flex h-14 items-center justify-between">
              <h1 className="text-lg font-semibold tracking-tight">Agentic Chat</h1>
              <ThemeToggle />
            </div>
          </header>
          <main className="flex flex-1 flex-col py-4">{children}</main>
          <footer className="-mx-4 border-t border-zinc-200/60 px-4 py-3 text-xs text-zinc-500 dark:border-zinc-800">
            <p>? {new Date().getFullYear()} Agentic Chat</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
