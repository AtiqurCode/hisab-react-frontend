import { StyleSheet, View } from "react-native";
import { useState } from "react";
import { Card, IconButton, Text } from "react-native-paper";

import { ThemedView } from "@/components/themed-view";
import { TransactionsList } from "@/components/transactions-list";
import { useTransactions } from "@/lib/transactions-store";
import { SAMPLE_TRANSACTIONS } from "@/lib/sample-transactions";
import {
  TransactionsFilterModal,
  type TransactionFilters,
} from "@/components/transactions-filter-modal";

export default function ReportsScreen() {
  const live = useTransactions();
  const records = [...SAMPLE_TRANSACTIONS, ...live];
  const [filters, setFilters] = useState<TransactionFilters>({
    dateRange: "all",
    type: "all",
    paymentType: "all",
  });
  const [filtersVisible, setFiltersVisible] = useState(false);

  const filtered = records.filter((r) => {
    if (filters.type !== "all" && r.type !== filters.type) return false;
    if (filters.paymentType !== "all" && r.paymentType !== filters.paymentType)
      return false;
    if (filters.dateRange === "all") return true;
    const created = new Date(r.createdAt).getTime();
    const now = Date.now();
    const days = filters.dateRange === "7d" ? 7 : 30;
    return created >= now - days * 24 * 60 * 60 * 1000;
  });
  const totalSales = filtered
    .filter((r) => r.type === "sale")
    .reduce((sum, r) => sum + r.amount, 0);
  const totalPayments = filtered
    .filter((r) => r.type === "payment")
    .reduce((sum, r) => sum + r.amount, 0);
  const totalDue = filtered
    .filter((r) => r.paymentType === "due")
    .reduce((sum, r) => sum + r.amount, 0);
  const net = totalSales - totalPayments;

  return (
    <ThemedView style={styles.root}>
      <View style={styles.content}>
        <Text variant="headlineSmall" style={styles.title}>
          All transactions
        </Text>
        <View style={styles.toolbarRow}>
          <Text variant="labelSmall">Summary</Text>
          <IconButton
            icon="filter-variant"
            size={20}
            onPress={() => setFiltersVisible(true)}
          />
        </View>
        <View style={styles.summaryRow}>
          <Card mode="elevated" style={styles.summaryCard}>
            <Card.Content>
              <Text variant="labelMedium">Total sales</Text>
              <Text variant="titleMedium">৳ {totalSales.toLocaleString()}</Text>
            </Card.Content>
          </Card>
          <Card mode="elevated" style={styles.summaryCard}>
            <Card.Content>
              <Text variant="labelMedium">Total payments</Text>
              <Text variant="titleMedium">৳ {totalPayments.toLocaleString()}</Text>
            </Card.Content>
          </Card>
        </View>
        <View style={styles.summaryRow}>
          <Card mode="elevated" style={styles.summaryCard}>
            <Card.Content>
              <Text variant="labelMedium">Net balance</Text>
              <Text variant="titleMedium">৳ {net.toLocaleString()}</Text>
            </Card.Content>
          </Card>
          <Card mode="elevated" style={styles.summaryCard}>
            <Card.Content>
              <Text variant="labelMedium">Total dues</Text>
              <Text variant="titleMedium">৳ {totalDue.toLocaleString()}</Text>
            </Card.Content>
          </Card>
        </View>
        <TransactionsList
          title="Reports"
          records={filtered}
          enableInlineFilters={false}
        />
        <TransactionsFilterModal
          visible={filtersVisible}
          value={filters}
          onClose={() => setFiltersVisible(false)}
          onApply={(next) => setFilters(next)}
        />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
    gap: 12,
  },
  title: {
    marginBottom: 4,
  },
  toolbarRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  summaryRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 4,
  },
  summaryCard: {
    flex: 1,
    borderRadius: 16,
  },
});

