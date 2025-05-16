export interface ISearchForm {
  id: string;
  title: string;
  score: number;
  matched_terms: {
    exact: string[];
    fuzzy: string[];
  };
  highlight: Record<string, string[]>;
  page_keywords: { page_number: number; keywords: string[] }[];
  all_keywords: string[];
  matched_pages: { page_number: number; highlight: Record<string, string[]> }[];
}

export interface SearchRequest {
  query: string;
  min_score?: number;
}

export interface IUploadForm {
  id: string;
  title: string;
  message: string;
  extracted_text?: string;
}