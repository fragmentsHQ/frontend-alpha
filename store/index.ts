import { Chain, Provider } from '@wagmi/core';
import { Signer } from 'ethers';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { Token } from '@/config/tokens';

interface Data {
  id: string;
  to_address: string;
  destination_token: string;
  destination_chain: number;
  amount_of_source_token: string;
}

interface GlobalState {
  provider: Provider | null;
  signer: Signer | null;
  enteredRows: Data[];
  setSigner: (provider: Signer | null) => void;
  setProvider: (provider: Provider | null) => void;
  sourceChain: Chain | null;
  sourceToken: Token | null;
  setSourceChain: (chain: Chain | null) => void;
  setSourceToken: (token: Token | null) => void;
  sourceType: string | null;
  setSourceType: (type: string | null) => void;
  setEnteredRows: (newrows: Data[]) => void;
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

const rows: Data[] = [
  {
    id: '1',
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
      enteredRows: rows,
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
      setEnteredRows: (newrows) => set(() => ({ enteredRows: newrows })),
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

export default useGlobalStore;
