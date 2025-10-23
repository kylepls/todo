'use client';

import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';
import { shadcnTheme } from '@/theme/theme';
import { shadcnCssVariableResolver } from '@/theme/cssVariableResolver';
import { TodoProvider } from '@/contexts/TodoContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MantineProvider
      theme={shadcnTheme}
      cssVariablesResolver={shadcnCssVariableResolver}
      defaultColorScheme="dark">
      <Notifications />
      <ModalsProvider>
        <TodoProvider>
          {children}
        </TodoProvider>
      </ModalsProvider>
    </MantineProvider>
  );
}

