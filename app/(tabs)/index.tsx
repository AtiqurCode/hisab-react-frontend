import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { Avatar, Card, Text, useTheme } from "react-native-paper";

import {
  SalePaymentForm,
  type SalePaymentType,
} from "@/components/sale-payment-form";
import { ThemedView } from "@/components/themed-view";
import { addTransaction } from "@/lib/transactions-store";

export default function HomeScreen() {
  const theme = useTheme();
  const router = useRouter();
  const now = new Date();

  const formattedDate = now.toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  const hours = now.getHours();
  const greeting =
    hours < 12
      ? "Good morning"
      : hours < 17
        ? "Good afternoon"
        : "Good evening";

  const quickActions = [
    {
      key: "sale",
      label: "New sale",
      icon: "cash-plus",
    },
    {
      key: "vendor",
      label: "Supplier payment",
      icon: "truck-delivery",
    },
    {
      key: "calculator",
      label: "Calculator",
      icon: "calculator",
    },
    {
      key: "purchase",
      label: "Suplier Due",
      icon: "cart-arrow-down",
    },
    {
      key: "due",
      label: "Customer due",
      icon: "account-cash",
    },
    {
      key: "report",
      label: "Reports",
      icon: "chart-line",
    },
  ];

  const reportCards = [
    {
      key: "cashflow",
      label: "Net cashflow",
      value: "৳ 0",
      icon: "cash-multiple",
      tone: "primary",
    },
    {
      key: "dues",
      label: "Open dues",
      value: "৳ 0",
      icon: "alert-circle-outline",
      tone: "error",
    },
  ];

  const [salePaymentVisible, setSalePaymentVisible] = useState(false);
  const [salePaymentType, setSalePaymentType] =
    useState<SalePaymentType>("sale");

  const handleActionPress = (key: string) => {
    if (key === "calculator") {
      router.push("/calculator");
      return;
    }

    if (key === "sale") {
      setSalePaymentType("sale");
      setSalePaymentVisible(true);
      return;
    }

    if (key === "vendor") {
      setSalePaymentType("payment");
      setSalePaymentVisible(true);
      return;
    }

    if (key === "purchase") {
      router.push("/supplier-due");
      return;
    }

    if (key === "due") {
      router.push("/customer-due");
      return;
    }

    if (key === "report") {
      router.push("/reports");
      return;
    }
  };

  return (
    <ThemedView style={styles.root}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[styles.header, { backgroundColor: theme.colors.primary }]}
        >
          <Text variant="labelSmall" style={styles.headerHello}>
            Hello there,
          </Text>
          <Text variant="headlineSmall" style={styles.headerTitle}>
            {greeting}
          </Text>
          <Text variant="bodySmall" style={styles.headerSubtitle}>
            {formattedDate}
          </Text>
        </View>

        <View style={styles.section}>
          <Text variant="titleMedium">Hisab actions</Text>
          <Text variant="bodySmall" style={styles.muted}>
            Choose what you want to do. Each option opens a different hisab
            flow.
          </Text>
          <View style={styles.tileGrid}>
            {quickActions.map((action) => (
              <Pressable
                key={action.key}
                onPress={() => handleActionPress(action.key)}
                style={({ hovered, pressed }) => [
                  styles.tilePressable,
                  hovered && styles.tilePressableHovered,
                  pressed && styles.tilePressablePressed,
                ]}
              >
                <Card
                  mode="contained"
                  style={[
                    styles.tileCard,
                    { backgroundColor: theme.colors.secondaryContainer },
                  ]}
                >
                  <Card.Content style={styles.actionTileContent}>
                    <Avatar.Icon
                      size={32}
                      icon={action.icon}
                      style={styles.actionIcon}
                      color={theme.colors.primary}
                    />
                    <Text variant="labelLarge" style={styles.actionLabel}>
                      {action.label}
                    </Text>
                  </Card.Content>
                </Card>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text variant="titleMedium">Reports & activity</Text>
          <Text variant="bodySmall" style={styles.muted}>
            Simple snapshot of how the shop is doing today.
          </Text>
          <View style={styles.tileGrid}>
            {reportCards.map((report) => (
              <Pressable
                key={report.key}
                style={({ hovered, pressed }) => [
                  styles.tilePressable,
                  hovered && styles.tilePressableHovered,
                  pressed && styles.tilePressablePressed,
                ]}
              >
                <Card
                  mode="contained"
                  style={[
                    styles.tileCard,
                    {
                      backgroundColor:
                        report.tone === "primary"
                          ? theme.colors.primaryContainer
                          : theme.colors.errorContainer,
                    },
                  ]}
                >
                  <Card.Content style={styles.reportTileContent}>
                    <Avatar.Icon
                      size={32}
                      icon={report.icon}
                      style={styles.reportIcon}
                      color={
                        report.tone === "primary"
                          ? theme.colors.primary
                          : theme.colors.error
                      }
                    />
                    <View>
                      <Text variant="labelLarge" style={styles.tileTitle}>
                        {report.label}
                      </Text>
                      <Text
                        variant="headlineSmall"
                        style={[
                          styles.tileValue,
                          {
                            color:
                              report.tone === "primary"
                                ? theme.colors.primary
                                : theme.colors.error,
                          },
                        ]}
                      >
                        {report.value}
                      </Text>
                    </View>
                  </Card.Content>
                </Card>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
      <SalePaymentForm
        visible={salePaymentVisible}
        defaultType={salePaymentType}
        onDismiss={() => setSalePaymentVisible(false)}
        onSave={(payload) => {
          addTransaction(payload);
        }}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
    width: "100%",
    maxWidth: 480,
    alignSelf: "center",
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 28,
    paddingBottom: 20,
    borderRadius: 24,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  headerHello: {
    color: "#EFF6FF",
    marginBottom: 4,
  },
  headerTitle: {
    color: "#ffffff",
    marginBottom: 2,
  },
  headerSubtitle: {
    color: "#DBEAFE",
  },
  searchCard: {
    marginTop: 16,
    borderRadius: 999,
  },
  searchContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
  },
  searchIcon: {
    backgroundColor: "transparent",
    marginRight: 8,
  },
  searchPlaceholder: {
    opacity: 0.8,
  },
  heroCard: {
    // use Paper defaults, keep it simple
  },
  section: {
    marginTop: 8,
  },
  muted: {
    opacity: 0.7,
  },
  statRow: {
    flexDirection: "row",
    marginTop: 12,
  },
  statItem: {
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
  statValue: {
    marginTop: 4,
    fontWeight: "600",
  },
  tileGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 16,
    marginHorizontal: -6,
  },
  tilePressable: {
    width: "50%",
    paddingHorizontal: 6,
    marginBottom: 12,
  },
  tilePressableHovered: {
    transform: [{ translateY: -1 }],
  },
  tilePressablePressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.9,
  },
  tileCard: {
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "transparent",
  },
  actionTileContent: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    rowGap: 6,
  },
  actionIcon: {
    backgroundColor: "rgba(255,255,255,0.95)",
  },
  actionLabel: {
    textAlign: "center",
    fontSize: 14,
  },
  tileTitle: {
    marginBottom: 4,
  },
  tileDescription: {
    opacity: 0.8,
    fontSize: 13,
  },
  tileValue: {
    marginTop: 4,
    fontWeight: "700",
  },
  reportTileContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    columnGap: 12,
    paddingVertical: 14,
  },
  reportIcon: {
    backgroundColor: "rgba(255,255,255,0.95)",
  },
});
