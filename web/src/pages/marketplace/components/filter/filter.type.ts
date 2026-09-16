export const EFilterState = {
    NEWEST: "NEWEST",
    PRICE_LOW_TO_HIGH: "PRICE_LOW_TO_HIGH",
    PRICE_HIGH_TO_LOW: "PRICE_HIGH_TO_LOW",
    POPULARITY: "POPULARITY",
} as const;
export type EFilterState = (typeof EFilterState)[keyof typeof EFilterState];

export interface FilterState {
    sortBy: EFilterState;
    categories: string[];
    minPrice: string;
    maxPrice: string;
}