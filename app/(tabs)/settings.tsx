import { ScrollView, StyleSheet, View } from "react-native";
import { useState } from "react";
import {
  Avatar,
  Button,
  Card,
  Chip,
  Switch,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";

import { ThemedView } from "@/components/themed-view";
import { useThemePreference } from "@/hooks/use-color-scheme";

export default function SettingsTab() {
  const theme = useTheme();
  const [name, setName] = useState("Shop owner");
  const [email, setEmail] = useState("owner@example.com");
  const [phone, setPhone] = useState("+8801XXXXXXXXX");
  const [language, setLanguage] = useState<"en" | "bn">("en");
  const { colorScheme, setColorScheme } = useThemePreference();
  const darkMode = colorScheme === "dark";

  return (
    <ThemedView style={styles.root}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text variant="headlineSmall" style={styles.title}>
          Settings
        </Text>

        <View style={styles.profileHeader}>
          <Avatar.Text
            size={80}
            label={name.trim().charAt(0).toUpperCase()}
            style={styles.avatar}
          />
          <Text variant="titleMedium" style={styles.profileName}>
            {name}
          </Text>
          <Text variant="bodySmall" style={styles.profileEmail}>
            {email}
          </Text>
        </View>

        <Card
          mode="elevated"
          style={[styles.card, { backgroundColor: theme.colors.primaryContainer }]}
        >
          <Card.Title title="Profile details" />
          <Card.Content>
            <TextInput
              label="Name"
              mode="outlined"
              value={name}
              onChangeText={setName}
              style={styles.field}
            />
            <TextInput
              label="Email"
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              style={styles.field}
            />
            <TextInput
              label="Phone"
              mode="outlined"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
              style={styles.field}
            />
            <Button mode="contained" style={styles.updateButton}>
              Update profile
            </Button>
          </Card.Content>
        </Card>

        <Card
          mode="elevated"
          style={[styles.card, { backgroundColor: theme.colors.errorContainer }]}
        >
          <Card.Title title="Password" />
          <Card.Content>
            <TextInput
              label="Current password"
              mode="outlined"
              secureTextEntry
              style={styles.field}
            />
            <TextInput
              label="New password"
              mode="outlined"
              secureTextEntry
              style={styles.field}
            />
            <TextInput
              label="Confirm new password"
              mode="outlined"
              secureTextEntry
            />
            <Button mode="contained" style={styles.updateButton}>
              Update password
            </Button>
          </Card.Content>
        </Card>

        <Card
          mode="elevated"
          style={[styles.card, { backgroundColor: theme.colors.secondaryContainer }]}
        >
          <Card.Title title="Preferences" />
          <Card.Content>
            <View style={styles.row}>
              <Text variant="bodyMedium">Dark mode</Text>
              <Switch
                value={darkMode}
                onValueChange={(value) => setColorScheme(value ? "dark" : "light")}
                color={theme.colors.primary}
              />
            </View>
            <View style={styles.row}>
              <Text variant="bodyMedium">Language</Text>
              <View style={styles.languageChips}>
                <Chip
                  selected={language === "en"}
                  onPress={() => setLanguage("en")}
                  style={styles.chip}
                >
                  English
                </Chip>
                <Chip
                  selected={language === "bn"}
                  onPress={() => setLanguage("bn")}
                  style={styles.chip}
                >
                  Bangla
                </Chip>
              </View>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 32,
    gap: 16,
  },
  title: {
    marginBottom: 4,
  },
  card: {
    borderRadius: 18,
  },
  field: {
    marginBottom: 12,
  },
  updateButton: {
    marginTop: 8,
    alignSelf: "flex-end",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  languageChips: {
    flexDirection: "row",
    gap: 8,
  },
  chip: {},
  avatar: {
    backgroundColor: "#2563EB",
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 8,
  },
  profileName: {
    marginTop: 8,
  },
  profileEmail: {
    opacity: 0.7,
  },
});

