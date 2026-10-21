import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { syncTabs } from '../syncTabs';

export const THEME_OPTIONS = [
  { value: 'system', label: '시스템 설정' },
  { value: 'light', label: '라이트' },
  { value: 'dark', label: '다크' },
];

const useThemeStore = create(persist(() => ({ theme: 'system' }), { name: 'theme-storage' }));

syncTabs(useThemeStore);

const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');

function applyTheme() {
  const { theme } = useThemeStore.getState();
  const resolved = theme === 'system' ? (darkQuery.matches ? 'dark' : 'light') : theme;
  document.documentElement.dataset.theme = resolved;
}

applyTheme();
useThemeStore.subscribe(applyTheme);
darkQuery.addEventListener('change', applyTheme);

export function setTheme(theme) {
  useThemeStore.setState({ theme });
}

export function useTheme() {
  return useThemeStore((state) => state.theme);
}
