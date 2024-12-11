// author: Pavel Lukl, xluklp00
// defines types and constants for list sorting

export const listSortOptions = {
    "alpha": "Alphabetical",
    "category": "Category"
}

export type ListSortType = keyof typeof listSortOptions;
export type ListSortDir = 'asc' | 'desc';

export const defaultListSortType: ListSortType = "alpha";
export const defaultListSortDir: ListSortDir = "asc";