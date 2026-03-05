import { Link } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Text, TextInput, useTheme } from "react-native-paper";

import { ThemedView } from "@/components/themed-view";

export default function RegisterScreen() {
  const theme = useTheme();

  return (
    <ThemedView style={styles.root}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text variant="headlineMedium" style={styles.title}>
            Create account
          </Text>
          <Text
            variant="bodyMedium"
            style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}
          >
            Set up your shop owner account in a few steps.
          </Text>
        </View>

        <View style={styles.card}>
          <TextInput
            label="Full name"
            mode="outlined"
            autoCapitalize="words"
            style={styles.field}
          />
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
            autoComplete="password-new"
            style={styles.field}
          />
          <TextInput
            label="Confirm password"
            mode="outlined"
            secureTextEntry
            autoComplete="password-new"
          />

          <Button mode="contained" style={styles.primaryButton}>
            Create account
          </Button>
        </View>

        <View style={styles.footer}>
          <Text variant="bodyMedium">Already have an account?</Text>
          <Link href="/login" asChild>
            <Button mode="text" compact>
              Login
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
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
});

