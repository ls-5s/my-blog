import { computed, ref, watch } from 'vue';
import type { Locale } from '../types';

const initialTheme = (): 'dark' | 'light' => {
  try { return localStorage.getItem('orbit-notes-theme') === 'light' ? 'light' : 'dark'; } catch { return 'dark'; }
};
const initialLocale = (): Locale => {
  try { return localStorage.getItem('orbit-notes-locale') === 'en' ? 'en' : 'zh'; } catch { return 'zh'; }
};

const theme = ref<'dark' | 'light'>(initialTheme());
const locale = ref<Locale>(initialLocale());

watch(theme, (value) => {
  document.documentElement.dataset.theme = value;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', value === 'dark' ? '#05070d' : '#edf4f7');
  try { localStorage.setItem('orbit-notes-theme', value); } catch { /* storage can be disabled */ }
}, { immediate: true });
watch(locale, (value) => {
  document.documentElement.lang = value === 'zh' ? 'zh-CN' : 'en';
  try { localStorage.setItem('orbit-notes-locale', value); } catch { /* storage can be disabled */ }
}, { immediate: true });

export const usePreferences = () => ({
  theme,
  locale,
  isDark: computed(() => theme.value === 'dark'),
  toggleTheme: () => { theme.value = theme.value === 'dark' ? 'light' : 'dark'; },
  toggleLocale: () => { locale.value = locale.value === 'zh' ? 'en' : 'zh'; },
  text: (value: { zh: string; en: string }) => locale.value === 'zh' ? value.zh : value.en,
});
