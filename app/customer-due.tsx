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

export default function CustomerDueScreen() {
  const live = useTransactions();
  const all = [...SAMPLE_TRANSACTIONS, ...live];
  const [filters, setFilters] = useState<TransactionFilters>({
    dateRange: "all",
    type: "all",
    paymentType: "all",
  });
  const [filtersVisible, setFiltersVisible] = useState(false);

  const filtered = all.filter((r) => {
    if (!(r.type === "sale" && r.paymentType === "due")) return false;
    if (filters.type !== "all" && r.type !== filters.type) return false;
    if (filters.paymentType !== "all" && r.paymentType !== filters.paymentType)
      return false;
    if (filters.dateRange === "all") return true;
    const created = new Date(r.createdAt).getTime();
    const now = Date.now();
    const days = filters.dateRange === "7d" ? 7 : 30;
    return created >= now - days * 24 * 60 * 60 * 1000;
  });

  const totalDue = filtered.reduce((sum, r) => sum + r.amount, 0);
  const customerCount = filtered.length;

  return (
    <ThemedView style={styles.root}>
      <View style={styles.content}>
        <Text variant="headlineSmall" style={styles.title}>
          Customer dues
        </Text>
        <View style={styles.toolbarRow}>
          <Text variant="labelSmall">Summary</Text>
          <IconButton
            icon="filter-variant"
            size={20}
            onPress={() => setFiltersVisible(true)}
          />
        </View>
        <Card mode="elevated" style={styles.summaryCard}>
          <Card.Content style={styles.summaryRow}>
            <View>
              <Text variant="labelMedium">Open customer dues</Text>
              <Text variant="headlineSmall" style={styles.summaryAmount}>
                ৳ {totalDue.toLocaleString()}
              </Text>
            </View>
            <View style={styles.summaryMeta}>
              <Text variant="labelMedium">{customerCount}</Text>
              <Text variant="bodySmall">customers</Text>
            </View>
          </Card.Content>
        </Card>
        <TransactionsList
          title="Customer due records"
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
  summaryCard: {
    marginBottom: 8,
    borderRadius: 16,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryAmount: {
    marginTop: 2,
  },
  summaryMeta: {
    alignItems: "flex-end",
  },
});

