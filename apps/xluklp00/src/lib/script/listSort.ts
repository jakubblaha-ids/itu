export const listSortOptions = {
    "alpha": "Alphabetical",
    "category": "Category"
}

export type ListSortType = keyof typeof listSortOptions;
export type ListSortDir = 'asc' | 'desc';

export const defaultListSortType: ListSortType = "alpha";
export const defaultListSortDir: ListSortDir = "asc";