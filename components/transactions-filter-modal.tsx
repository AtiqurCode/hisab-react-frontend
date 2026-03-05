import { useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  Button,
  Modal,
  Portal,
  Text,
  useTheme,
  Menu,
  IconButton,
} from "react-native-paper";

export type DateRangeFilter = "all" | "7d" | "30d";
export type TypeFilter = "all" | "sale" | "payment";
export type PaymentTypeFilter = "all" | "cash" | "due" | "online";

export type TransactionFilters = {
  dateRange: DateRangeFilter;
  type: TypeFilter;
  paymentType: PaymentTypeFilter;
};

type Props = {
  visible: boolean;
  value: TransactionFilters;
  onClose: () => void;
  onApply: (next: TransactionFilters) => void;
};

export function TransactionsFilterModal({ visible, value, onClose, onApply }: Props) {
  const theme = useTheme();

  const [draft, setDraft] = useState<TransactionFilters>(value);
  const [dateMenuVisible, setDateMenuVisible] = useState(false);
  const [typeMenuVisible, setTypeMenuVisible] = useState(false);
  const [paymentMenuVisible, setPaymentMenuVisible] = useState(false);

  const applyAndClose = () => {
    onApply(draft);
    onClose();
  };

  const resetFilters = () => {
    const reset: TransactionFilters = {
      dateRange: "all",
      type: "all",
      paymentType: "all",
    };
    setDraft(reset);
  };

  const dateLabel =
    draft.dateRange === "7d" ? "Last 7 days" : draft.dateRange === "30d" ? "Last 30 days" : "All time";

  const typeLabel =
    draft.type === "sale" ? "Sale" : draft.type === "payment" ? "Payment" : "All types";

  const paymentLabel =
    draft.paymentType === "cash"
      ? "Cash"
      : draft.paymentType === "due"
      ? "Due"
      : draft.paymentType === "online"
      ? "Online"
      : "All payments";

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onClose}
        style={styles.modalWrapper}
        contentContainerStyle={[
          styles.container,
          { backgroundColor: theme.colors.surface },
        ]}
      >
        <View style={styles.headerRow}>
          <Text variant="titleMedium" style={styles.title}>
            Filters
          </Text>
          <IconButton
            icon="close"
            size={20}
            onPress={onClose}
          />
        </View>

        <View style={styles.row}>
          <Text variant="labelSmall" style={styles.label}>
            Date range
          </Text>
          <Menu
            visible={dateMenuVisible}
            onDismiss={() => setDateMenuVisible(false)}
            anchor={
              <Button
                mode="outlined"
                compact
                onPress={() => setDateMenuVisible(true)}
              >
                {dateLabel}
              </Button>
            }
          >
            <Menu.Item
              title="All time"
              onPress={() => {
                setDraft({ ...draft, dateRange: "all" });
                setDateMenuVisible(false);
              }}
            />
            <Menu.Item
              title="Last 7 days"
              onPress={() => {
                setDraft({ ...draft, dateRange: "7d" });
                setDateMenuVisible(false);
              }}
            />
            <Menu.Item
              title="Last 30 days"
              onPress={() => {
                setDraft({ ...draft, dateRange: "30d" });
                setDateMenuVisible(false);
              }}
            />
          </Menu>
        </View>

        <View style={styles.row}>
          <Text variant="labelSmall" style={styles.label}>
            Type
          </Text>
          <Menu
            visible={typeMenuVisible}
            onDismiss={() => setTypeMenuVisible(false)}
            anchor={
              <Button
                mode="outlined"
                compact
                onPress={() => setTypeMenuVisible(true)}
              >
                {typeLabel}
              </Button>
            }
          >
            <Menu.Item
              title="All"
              onPress={() => {
                setDraft({ ...draft, type: "all" });
                setTypeMenuVisible(false);
              }}
            />
            <Menu.Item
              title="Sale"
              onPress={() => {
                setDraft({ ...draft, type: "sale" });
                setTypeMenuVisible(false);
              }}
            />
            <Menu.Item
              title="Payment"
              onPress={() => {
                setDraft({ ...draft, type: "payment" });
                setTypeMenuVisible(false);
              }}
            />
          </Menu>
        </View>

        <View style={styles.row}>
          <Text variant="labelSmall" style={styles.label}>
            Payment type
          </Text>
          <Menu
            visible={paymentMenuVisible}
            onDismiss={() => setPaymentMenuVisible(false)}
            anchor={
              <Button
                mode="outlined"
                compact
                onPress={() => setPaymentMenuVisible(true)}
              >
                {paymentLabel}
              </Button>
            }
          >
            <Menu.Item
              title="All"
              onPress={() => {
                setDraft({ ...draft, paymentType: "all" });
                setPaymentMenuVisible(false);
              }}
            />
            <Menu.Item
              title="Cash"
              onPress={() => {
                setDraft({ ...draft, paymentType: "cash" });
                setPaymentMenuVisible(false);
              }}
            />
            <Menu.Item
              title="Due"
              onPress={() => {
                setDraft({ ...draft, paymentType: "due" });
                setPaymentMenuVisible(false);
              }}
            />
            <Menu.Item
              title="Online"
              onPress={() => {
                setDraft({ ...draft, paymentType: "online" });
                setPaymentMenuVisible(false);
              }}
            />
          </Menu>
        </View>

        <View style={styles.actionsRow}>
          <Button mode="text" onPress={resetFilters}>
            Reset
          </Button>
          <Button mode="contained" onPress={applyAndClose}>
            Apply
          </Button>
        </View>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modalWrapper: {
    justifyContent: "flex-start",
    marginTop: 40,
  },
  container: {
    marginHorizontal: 16,
    marginTop: 24,
    borderRadius: 20,
    padding: 16,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {},
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    flex: 1,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
    marginTop: 8,
  },
});

