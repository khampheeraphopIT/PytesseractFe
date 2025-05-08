export interface ISearchForm {
    id: string;
    title: string;
    score: number;
    matched_terms: string[];
    highlight: Record<string, string[]>;
}