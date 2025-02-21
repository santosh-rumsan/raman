'use client';

import { TitleProvider } from '@/contexts/title.context';
import { CONFIG } from '@/misc/config';
import { ApiClient } from '@rumsan/raman/clients/index';
import { RumsanProvider, useRumsanAppStore } from '@rumsan/react-query';
import { TooltipProvider } from '@rumsan/shadcn-ui/components/tooltip';
import { QueryClient } from '@tanstack/react-query';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import * as React from 'react';
import { WebSocketProvider } from './websocket.provider';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});

export const apiClient = new ApiClient({
  baseURL: CONFIG.API_URL,
  headers: {
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDksImN1aWQiOiJ6azR6dHJzZTAxajdwaWVzenZvODRpZTIiLCJlbWFpbCI6InNhbnRvc2hAbWFpbGUudWsiLCJwaG9uZSI6Ijk4MDExMDk2NzAiLCJ3YWxsZXQiOm51bGwsInJvbGVzIjpbIkFkbWluIl0sInBlcm1pc3Npb25zIjpbeyJhY3Rpb24iOiJtYW5hZ2UiLCJzdWJqZWN0IjoiYWxsIiwiaW52ZXJ0ZWQiOmZhbHNlLCJjb25kaXRpb25zIjpudWxsfV0sInNlc3Npb25JZCI6ImUzZDYzNDY0LWM5ZTgtNGUyMC1iZWNiLWJlMmUyZDQzZDk0NCIsImlhdCI6MTc0MDExNTc1MSwiZXhwIjoxNzQwMjAyMTUxfQ.8_RXg9ushrda6cqsqs1n8CyJ_qfV1VIdEibGIego1Tg',
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  const { isInitialized, initialize } = useRumsanAppStore();

  React.useEffect(() => {
    if (!isInitialized) {
      initialize({
        log: 'App initialized',
      });
    }
  }, [isInitialized, initialize]);

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      enableColorScheme
    >
      <WebSocketProvider url={CONFIG.WS.URL}>
        <RumsanProvider rumsanClient={apiClient} queryClient={queryClient}>
          <TooltipProvider>
            <TitleProvider>{children}</TitleProvider>
          </TooltipProvider>
        </RumsanProvider>
      </WebSocketProvider>
    </NextThemesProvider>
  );
}
