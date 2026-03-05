import { useMemo, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Card, Chip, Text, useTheme } from "react-native-paper";

import type { TransactionRecord } from "@/lib/transactions-store";

type Props = {
  title: string;
  records: TransactionRecord[];
  enableInlineFilters?: boolean;
};

const PAGE_SIZE = 15;

export function TransactionsList({ title, records, enableInlineFilters = true }: Props) {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [typeFilter, setTypeFilter] = useState<"all" | "sale" | "payment">("all");
  const [paymentFilter, setPaymentFilter] = useState<"all" | "cash" | "due" | "online">("all");

  const filtered = useMemo(() => {
    if (!enableInlineFilters) {
      return records;
    }
    return records.filter((r) => {
      if (typeFilter !== "all" && r.type !== typeFilter) return false;
      if (paymentFilter !== "all" && r.paymentType !== paymentFilter) return false;
      return true;
    });
  }, [records, typeFilter, paymentFilter, enableInlineFilters]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount - 1);
  const pageItems = filtered.slice(
    currentPage * PAGE_SIZE,
    currentPage * PAGE_SIZE + PAGE_SIZE,
  );

  return (
    <View style={styles.root}>
      <View style={styles.headerRow}>
        <Text variant="titleMedium">{title}</Text>
        <Text variant="bodySmall" style={styles.countText}>
          {filtered.length} records
        </Text>
      </View>

      {enableInlineFilters && (
        <View style={styles.filtersRow}>
          <Text variant="labelSmall" style={styles.filterLabel}>
            Filters
          </Text>
          <View style={styles.chipsRow}>
            <Chip
              selected={typeFilter === "all"}
              onPress={() => setTypeFilter("all")}
            >
              Type: All
            </Chip>
            <Chip
              selected={typeFilter === "sale"}
              onPress={() => setTypeFilter("sale")}
            >
              Type: Sale
            </Chip>
            <Chip
              selected={typeFilter === "payment"}
              onPress={() => setTypeFilter("payment")}
            >
              Type: Payment
            </Chip>
            <Chip
              selected={paymentFilter === "all"}
              onPress={() => setPaymentFilter("all")}
            >
              Pay: All
            </Chip>
            <Chip
              selected={paymentFilter === "cash"}
              onPress={() => setPaymentFilter("cash")}
            >
              Pay: Cash
            </Chip>
            <Chip
              selected={paymentFilter === "due"}
              onPress={() => setPaymentFilter("due")}
            >
              Pay: Due
            </Chip>
            <Chip
              selected={paymentFilter === "online"}
              onPress={() => setPaymentFilter("online")}
            >
              Pay: Online
            </Chip>
          </View>
        </View>
      )}

      <FlatList
        data={pageItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card mode="outlined" style={styles.card}>
            <Card.Content>
              <View style={styles.cardHeader}>
                <Text variant="labelLarge">{item.userName}</Text>
                <View style={styles.cardChips}>
                  <Chip compact>{item.type}</Chip>
                  <Chip compact>{item.paymentType}</Chip>
                </View>
              </View>
              {item.description ? (
                <Text variant="bodySmall" style={styles.description}>
                  {item.description}
                </Text>
              ) : null}
              <View style={styles.cardFooter}>
                <Text
                  variant="titleMedium"
                  style={{ color: theme.colors.primary }}
                >
                  ৳ {item.amount.toLocaleString()}
                </Text>
                <View style={styles.metaCol}>
                  {item.mobile ? (
                    <Text variant="bodySmall">📱 {item.mobile}</Text>
                  ) : null}
                  <Text variant="bodySmall">
                    {new Date(item.createdAt).toLocaleString()}
                  </Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        )}
        ListEmptyComponent={
          <Text variant="bodySmall" style={styles.emptyText}>
            No records yet.
          </Text>
        }
      />

      <View style={styles.paginationRow}>
        <Text variant="bodySmall">
          Page {currentPage + 1} / {pageCount}
        </Text>
        <View style={styles.paginationButtons}>
          <Chip
            disabled={currentPage === 0}
            onPress={() => currentPage > 0 && setPage(currentPage - 1)}
          >
            Prev
          </Chip>
          <Chip
            disabled={currentPage >= pageCount - 1}
            onPress={() =>
              currentPage < pageCount - 1 && setPage(currentPage + 1)
            }
          >
            Next
          </Chip>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    gap: 12,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  countText: {
    opacity: 0.7,
  },
  filtersRow: {
    gap: 4,
  },
  filterLabel: {
    opacity: 0.8,
  },
  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  card: {
    marginBottom: 8,
    borderRadius: 12,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  cardChips: {
    flexDirection: "row",
    gap: 4,
  },
  description: {
    marginBottom: 6,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  metaCol: {
    alignItems: "flex-end",
    gap: 2,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 16,
    opacity: 0.7,
  },
  paginationRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  paginationButtons: {
    flexDirection: "row",
    gap: 8,
  },
});

