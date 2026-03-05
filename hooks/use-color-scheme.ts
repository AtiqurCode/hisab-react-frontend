import { ThemePreferenceProvider, useAppColorScheme, useThemePreference } from './theme-preference';

export { ThemePreferenceProvider, useThemePreference };

export const useColorScheme = () => {
  return useAppColorScheme();
};
