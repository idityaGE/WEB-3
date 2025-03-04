import { create } from 'zustand'

type SolKeypair = {
  publicKey: string;
  secretKey: string;
}

type EthKeypair = {
  publicKey: string;
  secretKey: string;
}

type WalletState = {
  mnemonic: string;
  seed: string;
  solKeypairs: SolKeypair[];
  ethKeypairs: EthKeypair[];

  // Actions
  setMnemonic: (mnemonic: string) => void;
  setSeed: (seed: string) => void;
  addSolKeypair: (keypair: SolKeypair) => void;
  addEthKeypair: (keypair: EthKeypair) => void;
  removeSolKeypair: (publicKey: string) => void;
  removeEthKeypair: (publicKey: string) => void;
  reset: () => void;
}

const useWallet = create<WalletState>((set) => ({
  // Initial state
  mnemonic: "",
  seed: "",
  solKeypairs: [],
  ethKeypairs: [],

  // Actions
  setMnemonic: (mnemonic) => set({ mnemonic }),
  setSeed: (seed) => set({ seed }),

  addSolKeypair: (keypair) => set((state) => ({
    solKeypairs: [...state.solKeypairs, keypair]
  })),

  addEthKeypair: (keypair) => set((state) => ({
    ethKeypairs: [...state.ethKeypairs, keypair]
  })),

  removeSolKeypair: (publicKey) => set((state) => ({
    solKeypairs: state.solKeypairs.filter(keypair => keypair.publicKey !== publicKey)
  })),

  removeEthKeypair: (publicKey) => set((state) => ({
    ethKeypairs: state.ethKeypairs.filter(keypair => keypair.publicKey !== publicKey)
  })),

  reset: () => set({
    mnemonic: "",
    solKeypairs: [],
    ethKeypairs: []
  })
}));

export default useWallet;