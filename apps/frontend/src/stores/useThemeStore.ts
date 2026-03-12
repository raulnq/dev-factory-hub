import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark' | 'system';

interface ThemeStore {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const APP_NAME = import.meta.env.VITE_APP_NAME || 'app';

export const useThemeStore = create<ThemeStore>()(
  persist(
    set => ({
      theme: 'system',

      setTheme: (theme: Theme) => {
        set({ theme });
      },
    }),
    {
      name: APP_NAME,
    }
  )
);
