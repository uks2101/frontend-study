import { createStore, persistStore, useStore } from '../createStore';

export const THEME_OPTIONS = [
  { value: 'system', label: '시스템 설정' },
  { value: 'light', label: '라이트' },
  { value: 'dark', label: '다크' }
];

const themeStore = createStore({ theme: 'system' });
persistStore(themeStore, 'theme', (saved) => THEME_OPTIONS.some((option) => option.value === saved?.theme));

const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');

function applyTheme() {
  const { theme } = themeStore.getState();
  const resolved = theme === 'system' ? (darkQuery.matches ? 'dark' : 'light') : theme;
  document.documentElement.dataset.theme = resolved;
}

applyTheme();
themeStore.subscribe(applyTheme);
darkQuery.addEventListener('change', applyTheme);

export function setTheme(theme) {
  themeStore.setState({ theme });
}

export function useTheme() {
  return useStore(themeStore, (state) => state.theme);
}