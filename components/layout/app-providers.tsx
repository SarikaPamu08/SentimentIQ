'use client';

import * as React from 'react';
import { ProjectProvider } from './project-context';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return <ProjectProvider>{children}</ProjectProvider>;
}
