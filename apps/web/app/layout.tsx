import { Toaster } from '@rumsan/shadcn-ui/components/toaster';
import { Geist, Geist_Mono } from 'next/font/google';

import { Providers } from '@/providers';
import '@rumsan/shadcn-ui/styles/globals.css';
import { ReactNode } from 'react';
import '../misc/app.css';

const fontSans = Geist({
  subsets: ['latin'],
  variable: '--font-sans',
});

const fontMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

//TODO: Update app metadata
export const metadata = {
  title: 'Raman App (Rumsan)',
  description:
    'This is a Rumsan sample app. Update this description for SEO friendliness.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased `}
      >
        <Providers>
          {children}
            <Toaster />
        </Providers>
      </body>
    </html>
  );
}
