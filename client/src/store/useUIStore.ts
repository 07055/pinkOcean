import { create } from 'zustand';

interface UIState {
  isGemmiOpen: boolean;
  activeDesignId: string | null;
  toggleGemmi: () => void;
  openGemmiWithDesign: (id: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isGemmiOpen: false,
  activeDesignId: null,
  toggleGemmi: () => set((state) => ({ isGemmiOpen: !state.isGemmiOpen })),
  openGemmiWithDesign: (id) => set({ isGemmiOpen: true, activeDesignId: id }),
}));