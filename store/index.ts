import { Chain, Provider } from '@wagmi/core';
import { Signer } from 'ethers';
import { v4 as uuidv4 } from 'uuid';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

import { Token } from '@/config/tokens';

export interface Data {
  id: string;
  to_address: string;
  destination_token: string;
  destination_chain: number;
  amount_of_source_token: string;
}

interface GlobalState {
  provider: Provider | null;
  signer: Signer | null;
  setSigner: (provider: Signer | null) => void;
  setProvider: (provider: Provider | null) => void;
  sourceChain: Chain | null;
  sourceToken: Token | null;
  setSourceChain: (chain: Chain | null) => void;
  setSourceToken: (token: Token | null) => void;
  sourceType: string | null;
  setSourceType: (type: string | null) => void;
  sourceTypeMode: string | null;
  setSourceTypeMode: (mode: string | null) => void;
  paymentMethod: string | null;
  onetimeSubOption: string | null;
  recurringSubOption: string | null;
  setOneTimeSubOption: (mode: string | null) => void;
  setRecurringSubOption: (mode: string | null) => void;
  setPaymentMethod: (paymentMethod: string | null) => void;
  currency: string | null;
  setCurrency: (currency: string | null) => void;
}
export const generateId = () => {
  return uuidv4({
    random: {
      length: 4,
    },
  });
};
export const rows: Data[] = [
  {
    id: uuidv4(),
    to_address: '',
    destination_token: '',
    amount_of_source_token: '',
    destination_chain: 0,
  },
];

const useGlobalStore = create<GlobalState>()(
  devtools(
    (set) => ({
      provider: null,

      signer: null,
      sourceChain: null,
      sourceToken: null,
      sourceType: null,
      sourceTypeMode: null,
      paymentMethod: null,
      onetimeSubOption: null,
      recurringSubOption: null,
      currency: 'Ethereum',
      setCurrency: (_currency) => set(() => ({ currency: _currency })),
      setOneTimeSubOption: (_mode) => set(() => ({ onetimeSubOption: _mode })),
      setRecurringSubOption: (_mode) =>
        set(() => ({ recurringSubOption: _mode })),
      setPaymentMethod: (_paymentMethod) =>
        set(() => ({ paymentMethod: _paymentMethod })),
      setSourceTypeMode: (_mode) => set(() => ({ sourceTypeMode: _mode })),
      setSourceType: (_type) => set(() => ({ sourceType: _type })),
      setSourceChain: (_chain) => set(() => ({ sourceChain: _chain })),
      setSourceToken: (_token) => set(() => ({ sourceToken: _token })),
      setSigner: (_signer) => set(() => ({ signer: _signer })),
      setProvider: (_provider) => set(() => ({ provider: _provider })),
    }),
    {
      name: '',
    }
  )
);

export const useTableData = create<{
  enteredRows: Data[];
  setEnteredRows: (newrows: Data[]) => void;
}>()(
  persist(
    (set) => ({
      enteredRows: rows,
      setEnteredRows: (newrows) => set(() => ({ enteredRows: newrows })),
    }),
    {
      name: 'tabledata',
    }
  )
);
export default useGlobalStore;
