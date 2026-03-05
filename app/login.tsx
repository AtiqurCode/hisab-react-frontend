import { Link } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Text, TextInput, useTheme } from "react-native-paper";

import { ThemedView } from "@/components/themed-view";

export default function LoginScreen() {
  const theme = useTheme();

  return (
    <ThemedView style={styles.root}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text variant="headlineMedium" style={styles.title}>
            Welcome back
          </Text>
          <Text
            variant="bodyMedium"
            style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}
          >
            Sign in to continue managing your shop.
          </Text>
        </View>

        <View style={styles.card}>
          <TextInput
            label="Email"
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            style={styles.field}
          />
          <TextInput
            label="Password"
            mode="outlined"
            secureTextEntry
            autoComplete="password"
            style={styles.field}
          />

          <View style={styles.rowBetween}>
            <View />
            <Link href="/reset-password" asChild>
              <Button mode="text" compact>
                Forgot password?
              </Button>
            </Link>
          </View>

          <Button mode="contained" style={styles.primaryButton}>
            Login
          </Button>
        </View>

        <View style={styles.footer}>
          <Text variant="bodyMedium">New here?</Text>
          <Link href="/register" asChild>
            <Button mode="text" compact>
              Create an account
            </Button>
          </Link>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 32,
    justifyContent: "center",
    gap: 24,
  },
  header: {
    gap: 4,
  },
  title: {
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
  },
  card: {
    borderRadius: 18,
    padding: 16,
    gap: 8,
  },
  field: {
    marginBottom: 8,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  primaryButton: {
    marginTop: 8,
    borderRadius: 999,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
});

