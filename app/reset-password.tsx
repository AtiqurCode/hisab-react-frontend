import { Link } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Text, TextInput, useTheme } from "react-native-paper";

import { ThemedView } from "@/components/themed-view";

export default function ResetPasswordScreen() {
  const theme = useTheme();

  return (
    <ThemedView style={styles.root}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text variant="headlineMedium" style={styles.title}>
            Reset password
          </Text>
          <Text
            variant="bodyMedium"
            style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}
          >
            Enter your email and we&apos;ll send you a reset link.
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

          <Button mode="contained" style={styles.primaryButton}>
            Send reset link
          </Button>
        </View>

        <View style={styles.footer}>
          <Link href="/login" asChild>
            <Button mode="text" compact>
              Back to login
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
  primaryButton: {
    marginTop: 8,
    borderRadius: 999,
  },
  footer: {
    alignItems: "center",
  },
});

