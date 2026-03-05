import { useSyncExternalStore } from "react";
import type { SalePaymentPayload, PaymentType } from "@/components/sale-payment-form";

export type TransactionRecord = SalePaymentPayload & {
  paymentType: PaymentType;
};

let records: TransactionRecord[] = [];

const subscribers = new Set<() => void>();

const emit = () => {
  subscribers.forEach((fn) => fn());
};

export const addTransaction = (record: TransactionRecord) => {
  records = [record, ...records];
  emit();
};

export const getTransactionsSnapshot = () => records;

const subscribe = (fn: () => void) => {
  subscribers.add(fn);
  return () => subscribers.delete(fn);
};

export const useTransactions = () => {
  return useSyncExternalStore(subscribe, getTransactionsSnapshot, getTransactionsSnapshot);
};

