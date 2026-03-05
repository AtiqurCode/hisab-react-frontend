import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { MD3DarkTheme, MD3LightTheme, Provider as PaperProvider } from 'react-native-paper';
import 'react-native-reanimated';

import { ThemePreferenceProvider, useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

function RootLayoutInner() {
  const colorScheme = useColorScheme();

  const basePaperTheme = colorScheme === 'dark' ? MD3DarkTheme : MD3LightTheme;
  const paperTheme = {
    ...basePaperTheme,
    colors: {
      ...basePaperTheme.colors,
      // tuned palette for light and dark
      primary: '#2563EB', // blue-600
      secondary: '#22C55E', // green-500
      tertiary: '#F97316', // orange-500
      primaryContainer: colorScheme === 'dark' ? '#1D2741' : '#DBEAFE',
      secondaryContainer: colorScheme === 'dark' ? '#11271C' : '#DCFCE7',
      errorContainer: colorScheme === 'dark' ? '#3F1D1D' : '#FEE2E2',
      background: colorScheme === 'dark' ? '#020617' : '#F9FAFB',
      surface: colorScheme === 'dark' ? '#020617' : '#FFFFFF',
    },
    roundness: 18,
  };

  return (
    <PaperProvider theme={paperTheme}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <View style={styles.root}>
          <View style={styles.appShell}>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="calculator" options={{ title: 'Calculator' }} />
              <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
            </Stack>
          </View>
        </View>
        <StatusBar style="auto" />
      </ThemeProvider>
    </PaperProvider>
  );
}

export default function RootLayout() {
  return (
    <ThemePreferenceProvider>
      <RootLayoutInner />
    </ThemePreferenceProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
  },
  appShell: {
    flex: 1,
    width: '100%',
    maxWidth: 480,
  },
});
