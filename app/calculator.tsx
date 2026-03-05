import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Card, Text, useTheme } from "react-native-paper";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { ThemedView } from "@/components/themed-view";
import { SalePaymentForm, type SalePaymentType } from "@/components/sale-payment-form";
import { addTransaction } from "@/lib/transactions-store";

type Operator = "+" | "-" | "×" | "÷";

const formatNumberForDisplay = (raw: string) => {
  const asNumber = Number(raw);
  if (!Number.isFinite(asNumber)) return raw;
  return asNumber.toLocaleString(undefined, {
    maximumFractionDigits: 6,
  });
};

const isOperatorChar = (value: string) =>
  value === "+" || value === "-" || value === "×" || value === "÷";

export default function CalculatorScreen() {
  const theme = useTheme();
  const router = useRouter();

  const [displayValue, setDisplayValue] = useState("0");
  const [pendingValue, setPendingValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<Operator | null>(null);
  const [overwrite, setOverwrite] = useState(true);
  const [expression, setExpression] = useState("");
  const [previousExpression, setPreviousExpression] = useState("");
  const [justEvaluated, setJustEvaluated] = useState(false);
  const [salePaymentVisible, setSalePaymentVisible] = useState(false);
  const [salePaymentType, setSalePaymentType] = useState<SalePaymentType>("sale");

  const handleAllClear = () => {
    setDisplayValue("0");
    setPendingValue(null);
    setOperator(null);
    setOverwrite(true);
    setExpression("");
    setPreviousExpression("");
    setJustEvaluated(false);
  };

  const handleDigit = (digit: string) => {
    setDisplayValue((current) => {
      if (justEvaluated) {
        setExpression("");
        setPendingValue(null);
        setOperator(null);
        setJustEvaluated(false);
      }

      if (overwrite || current === "0") {
        setOverwrite(false);
        return digit;
      }
      if (current.length >= 12) return current;
      return current + digit;
    });
  };

  const handleDecimal = () => {
    setDisplayValue((current) => {
      if (justEvaluated) {
        setExpression("");
        setPendingValue(null);
        setOperator(null);
        setJustEvaluated(false);
      }

      if (overwrite) {
        setOverwrite(false);
        return "0.";
      }
      if (current.includes(".")) return current;
      return current + ".";
    });
  };

  const handleDoubleZero = () => {
    setDisplayValue((current) => {
      if (justEvaluated) {
        setExpression("");
        setPendingValue(null);
        setOperator(null);
        setJustEvaluated(false);
      }

      if (overwrite || current === "0") {
        return "0";
      }
      if (current.length >= 11) return current;
      return current + "00";
    });
  };

  const applyOperator = (nextOperator: Operator | null) => {
    const current = parseFloat(displayValue);

    if (pendingValue === null || operator === null) {
      if (nextOperator === null) return;

      setPendingValue(current);
      setOperator(nextOperator);
      setOverwrite(true);
      setJustEvaluated(false);

      setExpression(`${displayValue}${nextOperator}`);

      return;
    }

    let result = pendingValue;
    switch (operator) {
      case "+":
        result = pendingValue + current;
        break;
      case "-":
        result = pendingValue - current;
        break;
      case "×":
        result = pendingValue * current;
        break;
      case "÷":
        result = current === 0 ? 0 : pendingValue / current;
        break;
    }

    const nextDisplay = Number.isFinite(result) ? result.toString() : "0";
    setOverwrite(true);

    const fullExpression = `${expression}${displayValue}`;

    if (nextOperator) {
      // Continue chaining: update running result internally, extend expression,
      // but keep the display showing only the current entered value.
      setPendingValue(result);
      setOperator(nextOperator);
      setExpression(`${fullExpression}${nextOperator}`);
      setJustEvaluated(false);
    } else {
      // "=" pressed: freeze full expression on top and show result in big display.
      setPreviousExpression(fullExpression);
      setDisplayValue(nextDisplay);
      setPendingValue(null);
      setOperator(null);
      setExpression("");
      setJustEvaluated(true);
    }
  };

  const handleOperatorPress = (op: Operator) => {
    // After "=", start a fresh expression from result
    if (justEvaluated) {
      setExpression(`${displayValue}${op}`);
      setPendingValue(parseFloat(displayValue));
      setOperator(op);
      setOverwrite(true);
      setJustEvaluated(false);
      return;
    }

    // If user is just changing the operator (e.g. pressed + then -), replace it
    if (overwrite && expression && isOperatorChar(expression.slice(-1)) && pendingValue !== null) {
      setExpression(expression.slice(0, -1) + op);
      setOperator(op);
      return;
    }

    applyOperator(op);
  };

  const handleEquals = () => {
    applyOperator(null);
  };

  const handlePercent = () => {
    const current = parseFloat(displayValue);
    if (!Number.isFinite(current)) return;
    const result = current / 100;
    setDisplayValue(result.toString());
    setOverwrite(true);
    setJustEvaluated(false);
  };

  const handleBackspace = () => {
    setDisplayValue((current) => {
      if (overwrite) return current;
      if (current.length <= 1) return "0";
      const next = current.slice(0, -1);
      return next === "-" || next === "" ? "0" : next;
    });
  };

  const handleDone = () => {
    router.back();
  };

  const makeButtonMode = (highlight?: boolean) =>
    highlight ? "contained" : "contained-tonal";

  const liveExpression =
    expression +
    (overwrite && (pendingValue !== null || justEvaluated) ? "" : displayValue);

  const topLine = justEvaluated ? previousExpression : "";
  const bottomLine = justEvaluated
    ? formatNumberForDisplay(displayValue)
    : liveExpression || displayValue;

  const getCurrentAmount = (): number | null => {
    const numericDisplay = Number(displayValue.replace(/,/g, ""));

    if (pendingValue !== null && operator !== null && !overwrite) {
      const current = Number.isFinite(numericDisplay) ? numericDisplay : 0;
      let result = pendingValue;

      switch (operator) {
        case "+":
          result = pendingValue + current;
          break;
        case "-":
          result = pendingValue - current;
          break;
        case "×":
          result = pendingValue * current;
          break;
        case "÷":
          result = current === 0 ? pendingValue : pendingValue / current;
          break;
      }

      return Number.isFinite(result) ? result : null;
    }

    return Number.isFinite(numericDisplay) && numericDisplay > 0
      ? numericDisplay
      : null;
  };

  const effectiveAmount = getCurrentAmount();

  return (
    <ThemedView style={styles.root}>
      <View style={styles.content}>
        <Card
          mode="elevated"
          style={[
            styles.displayCard,
            { backgroundColor: theme.colors.primaryContainer },
          ]}
        >
          <Card.Content>
            {topLine ? (
              <Text
                variant="bodySmall"
                style={styles.previousValue}
                numberOfLines={1}
              >
                {topLine}
              </Text>
            ) : null}
            <Text
              variant="headlineLarge"
              style={styles.displayValue}
              numberOfLines={1}
            >
              {bottomLine}
            </Text>
          </Card.Content>
        </Card>
        <Card
          mode="elevated"
          style={[
            styles.keypadCard,
            { backgroundColor: theme.colors.secondaryContainer },
          ]}
        >
          <Card.Content style={styles.keypad}>
            <View style={styles.row}>
              <CalcButton
                label="AC"
                mode="contained"
                onPress={handleAllClear}
                color={theme.colors.onErrorContainer}
                backgroundColor={theme.colors.errorContainer}
                flex={1.4}
              />
              <CalcButton
                label="%"
                onPress={handlePercent}
                backgroundColor={theme.colors.primaryContainer}
                color={theme.colors.primary}
              />
              <CalcButton
                label="÷"
                mode={makeButtonMode(operator === "÷")}
                onPress={() => handleOperatorPress("÷")}
                color={theme.colors.primary}
                backgroundColor={theme.colors.primaryContainer}
              />
              <CalcButton
                label="⌫"
                onPress={handleBackspace}
                backgroundColor={theme.colors.surface}
              />
            </View>

            <View style={styles.row}>
              <CalcButton
                label="7"
                onPress={() => handleDigit("7")}
                backgroundColor={theme.colors.secondaryContainer}
              />
              <CalcButton
                label="8"
                onPress={() => handleDigit("8")}
                backgroundColor={theme.colors.secondaryContainer}
              />
              <CalcButton
                label="9"
                onPress={() => handleDigit("9")}
                backgroundColor={theme.colors.secondaryContainer}
              />
              <CalcButton
                label="×"
                mode={makeButtonMode(operator === "×")}
                onPress={() => handleOperatorPress("×")}
                color={theme.colors.primary}
                backgroundColor={theme.colors.primaryContainer}
              />
            </View>

            <View style={styles.row}>
              <CalcButton
                label="4"
                onPress={() => handleDigit("4")}
                backgroundColor={theme.colors.secondaryContainer}
              />
              <CalcButton
                label="5"
                onPress={() => handleDigit("5")}
                backgroundColor={theme.colors.secondaryContainer}
              />
              <CalcButton
                label="6"
                onPress={() => handleDigit("6")}
                backgroundColor={theme.colors.secondaryContainer}
              />
              <CalcButton
                label="-"
                mode={makeButtonMode(operator === "-")}
                onPress={() => handleOperatorPress("-")}
                color={theme.colors.primary}
                backgroundColor={theme.colors.primaryContainer}
              />
            </View>

            <View style={styles.row}>
              <CalcButton
                label="1"
                onPress={() => handleDigit("1")}
                backgroundColor={theme.colors.secondaryContainer}
              />
              <CalcButton
                label="2"
                onPress={() => handleDigit("2")}
                backgroundColor={theme.colors.secondaryContainer}
              />
              <CalcButton
                label="3"
                onPress={() => handleDigit("3")}
                backgroundColor={theme.colors.secondaryContainer}
              />
              <CalcButton
                label="+"
                mode={makeButtonMode(operator === "+")}
                onPress={() => handleOperatorPress("+")}
                color={theme.colors.primary}
                backgroundColor={theme.colors.primaryContainer}
              />
            </View>

            <View style={styles.row}>
              <CalcButton
                label="00"
                onPress={handleDoubleZero}
                backgroundColor={theme.colors.secondaryContainer}
              />
              <CalcButton
                label="0"
                onPress={() => handleDigit("0")}
                backgroundColor={theme.colors.secondaryContainer}
              />
              <CalcButton
                label="."
                onPress={handleDecimal}
                backgroundColor={theme.colors.secondaryContainer}
              />
              <CalcButton
                label="="
                mode="contained"
                onPress={handleEquals}
                color={theme.colors.onSecondaryContainer}
                backgroundColor={theme.colors.secondaryContainer}
              />
            </View>

            <View style={styles.row}>
              <CalcButton
                label="DONE"
                mode="contained"
                flex={4}
                onPress={handleDone}
                color={theme.colors.onPrimaryContainer}
                backgroundColor={theme.colors.primaryContainer}
              />
            </View>

            <View style={styles.row}>
              <CalcButton
                label="New sale"
                mode="contained"
                flex={2}
                onPress={() => {
                  setSalePaymentType("sale");
                  setSalePaymentVisible(true);
                }}
                color={theme.colors.onPrimary}
                backgroundColor={theme.colors.primary}
                labelFontSize={14}
                icon="cash-plus"
              />
              <CalcButton
                label="Supplier pay"
                mode="outlined"
                flex={2}
                onPress={() => {
                  setSalePaymentType("payment");
                  setSalePaymentVisible(true);
                }}
                color={theme.colors.primary}
                labelFontSize={14}
                icon="truck-delivery"
              />
            </View>
          </Card.Content>
        </Card>
      </View>
      <SalePaymentForm
        visible={salePaymentVisible}
        defaultType={salePaymentType}
        onDismiss={() => setSalePaymentVisible(false)}
        initialAmount={effectiveAmount ?? undefined}
        onSave={(payload) => {
          addTransaction(payload);
        }}
      />
    </ThemedView>
  );
}

type CalcButtonProps = {
  label: string;
  onPress: () => void;
  mode?: "text" | "outlined" | "contained" | "contained-tonal" | undefined;
  flex?: number;
  color?: string;
  backgroundColor?: string;
  labelFontSize?: number;
  icon?: string;
};

function CalcButton({
  label,
  onPress,
  mode = "contained-tonal",
  flex = 1,
  color,
  backgroundColor,
  labelFontSize,
  icon,
}: CalcButtonProps) {
  const theme = useTheme();
  const fontSize = labelFontSize ?? 20;

  return (
    <View style={[styles.keyWrapper, { flex }]}>
      <Button
        mode={mode}
        onPress={onPress}
        icon={
          icon
            ? (props) => (
                <MaterialCommunityIcons
                  name={icon as any}
                  size={props.size * 1.4}
                  color={color ?? props.color ?? theme.colors.onSurface}
                  style={{ marginRight: 4 }}
                />
              )
            : undefined
        }
        textColor={color ?? theme.colors.onSurface}
        buttonColor={backgroundColor}
        style={styles.keyButton}
        contentStyle={styles.keyContent}
        labelStyle={[styles.keyLabel, { fontSize }]}
      >
        {label}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 32,
    gap: 16,
  },
  displayCard: {
    borderRadius: 24,
    paddingVertical: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  previousValue: {
    textAlign: "right",
    opacity: 0.6,
    marginBottom: 4,
  },
  displayValue: {
    textAlign: "right",
    fontSize: 44,
  },
  keypadCard: {
    borderRadius: 24,
  },
  keypad: {
    gap: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  keyWrapper: {
    flex: 1,
  },
  keyButton: {
    borderRadius: 999,
  },
  keyLabel: {
    fontSize: 20,
  },
  keyContent: {
    height: 56,
  },
});
