import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
import React, { useState } from 'react';

import { SalePaymentForm, type SalePaymentType } from '@/components/sale-payment-form';
import { addTransaction } from '@/lib/transactions-store';

export function QuickAddTabButton(props: BottomTabBarButtonProps) {
  const [visible, setVisible] = useState(false);
  const [type, setType] = useState<SalePaymentType>('sale');

  return (
    <>
      <PlatformPressable
        {...props}
        onPress={(ev) => {
          // prevent navigating to /quick-add, just open the popup
          ev.preventDefault?.();
          setType('sale');
          setVisible(true);
        }}
        style={[props.style, { justifyContent: 'center', alignItems: 'center' }]}
      >
        {props.children}
      </PlatformPressable>
      <SalePaymentForm
        visible={visible}
        defaultType={type}
        onDismiss={() => setVisible(false)}
        onSave={(payload) => {
          addTransaction(payload);
          setVisible(false);
        }}
      />
    </>
  );
}

