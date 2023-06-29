import { Provider } from '@wagmi/core';
import { Signer } from 'ethers';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface GlobalState {
  provider: Provider | null;
  signer: Signer | null;
  setSigner: (provider: Signer | null) => void;
  setProvider: (provider: Provider | null) => void;
  sourceChain: string | null;
  sourceToken: string | null;
  setSourceChain: (chain: string | null) => void;
  setSourceToken: (token: string | null) => void;
  sourceType: string | null;
  setSourceType: (type: string | null) => void;
  sourceTypeMode: string | null;
  setSourceTypeMode: (mode: string | null) => void;
}

const useGlobalStore = create<GlobalState>()(
  devtools(
    (set) => ({
      provider: null,
      signer: null,
      sourceChain: null,
      sourceToken: null,
      sourceType: 'Autopay',
      sourceTypeMode: 'Onetime',
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
