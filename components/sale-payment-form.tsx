import { useEffect, useMemo, useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import {
  Button,
  Modal,
  Portal,
  RadioButton,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";

export type SalePaymentType = "sale" | "payment";
export type PaymentType = "cash" | "online" | "due";

export type SalePaymentPayload = {
  id: string;
  type: SalePaymentType;
  paymentType: PaymentType;
  userName: string;
  mobile?: string;
  description?: string;
  amount: number;
  createdAt: string;
};

type Props = {
  visible: boolean;
  defaultType: SalePaymentType;
  onDismiss: () => void;
  onSave: (payload: SalePaymentPayload) => void;
  initialAmount?: number | null;
};

const generateRandomUserName = () => {
  const n = Math.floor(100000 + Math.random() * 900000);
  return `User-${n}`;
};

export function SalePaymentForm({
  visible,
  defaultType,
  onDismiss,
  onSave,
  initialAmount,
}: Props) {
  const theme = useTheme();

  const [type, setType] = useState<SalePaymentType>(defaultType);
  const [userName, setUserName] = useState<string>(generateRandomUserName());
  const [mobile, setMobile] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [touched, setTouched] = useState(false);
  const [paymentType, setPaymentType] = useState<PaymentType>("cash");

  useEffect(() => {
    if (visible) {
      setType(defaultType);
      setUserName(generateRandomUserName());
      setMobile("");
      setDescription("");
      if (initialAmount && Number.isFinite(initialAmount)) {
        setAmount(String(initialAmount));
      } else {
        setAmount("");
      }
      setTouched(false);
      setPaymentType("cash");
    }
  }, [visible, defaultType, initialAmount]);

  const parsedAmount = useMemo(() => {
    const n = Number(amount.replace(/,/g, ""));
    return Number.isFinite(n) && n > 0 ? n : NaN;
  }, [amount]);

  const amountError = touched && !parsedAmount ? "Amount is required" : "";

  const handleSave = () => {
    setTouched(true);
    if (!parsedAmount) return;

    const payload: SalePaymentPayload = {
      id: String(Date.now()),
      type,
      paymentType,
      userName: userName.trim() || generateRandomUserName(),
      mobile: mobile.trim() || undefined,
      description: description.trim() || undefined,
      amount: parsedAmount,
      createdAt: new Date().toISOString(),
    };

    onSave(payload);
    onDismiss();
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        style={styles.modalWrapper}
        contentContainerStyle={[
          styles.container,
          { backgroundColor: theme.colors.surface },
        ]}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={styles.headerRow}>
            <Text variant="titleMedium">
              {type === "sale" ? "New sale" : "Supplier payment"}
            </Text>
            <RadioButton.Group
              onValueChange={(v) => setType(v as SalePaymentType)}
              value={type}
            >
              <View style={styles.typeSwitchRow}>
                <View style={styles.typeOption}>
                  <RadioButton value="sale" />
                  <Text variant="labelMedium">Sale</Text>
                </View>
                <View style={styles.typeOption}>
                  <RadioButton value="payment" />
                  <Text variant="labelMedium">Payment</Text>
                </View>
              </View>
            </RadioButton.Group>
          </View>

          <View style={styles.formBody}>
            <TextInput
              mode="outlined"
              label="User name"
              value={userName}
              onChangeText={setUserName}
              dense
            />
            <TextInput
              mode="outlined"
              label="Mobile number"
              keyboardType="phone-pad"
              value={mobile}
              onChangeText={setMobile}
              dense
            />
            <TextInput
              mode="outlined"
              label="Description"
              multiline
              numberOfLines={3}
              value={description}
              onChangeText={setDescription}
            />
            <TextInput
              mode="outlined"
              label="Amount *"
              keyboardType="numeric"
              value={amount}
              onChangeText={(text) => setAmount(text.replace(/[^\d.,]/g, ""))}
              dense
              error={!!amountError}
            />
            {amountError ? (
              <Text variant="bodySmall" style={styles.errorText}>
                {amountError}
              </Text>
            ) : null}
            <View style={styles.paymentTypeRow}>
              <Text variant="labelMedium">Payment type</Text>
              <RadioButton.Group
                onValueChange={(v) => setPaymentType(v as PaymentType)}
                value={paymentType}
              >
                <View style={styles.paymentTypeOptions}>
                  <View style={styles.typeOption}>
                    <RadioButton value="cash" />
                    <Text variant="bodySmall">Cash</Text>
                  </View>
                  <View style={styles.typeOption}>
                    <RadioButton value="due" />
                    <Text variant="bodySmall">Due</Text>
                  </View>
                  <View style={styles.typeOption}>
                    <RadioButton value="online" />
                    <Text variant="bodySmall">Online</Text>
                  </View>
                </View>
              </RadioButton.Group>
            </View>
          </View>

          <View style={styles.actionsRow}>
            <Button mode="text" onPress={onDismiss}>
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={handleSave}
              disabled={!parsedAmount}
            >
              Save
            </Button>
          </View>
        </KeyboardAvoidingView>
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
    alignSelf: "stretch",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  typeSwitchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  typeOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  formBody: {
    gap: 8,
    marginBottom: 12,
  },
  paymentTypeRow: {
    marginTop: 4,
    gap: 4,
  },
  paymentTypeOptions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },
  errorText: {
    color: "red",
  },
});

