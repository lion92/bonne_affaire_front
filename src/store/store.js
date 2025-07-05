import { create } from "zustand";

export const useDealStore = create((set) => ({
    deals: [
        {
            id: "1",
            title: "Chaise design à -50%",
            description: "Magnifique chaise design en promotion.",
            link: "https://exemple.com/chaise",
            image: "https://via.placeholder.com/300",
        },
    ],
    addDeal: (deal) =>
        set((state) => ({
            deals: [...state.deals, { ...deal, id: Date.now().toString() }],
        })),
}));
