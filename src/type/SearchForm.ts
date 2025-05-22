export interface IMatchedPage {
  page_number: number;
  highlight: Record<string, string[]>;
  exact_match_counts: Record<string, number>;
}

export interface ISearchForm {
  id: string;
  title: string;
  score: number;
  query: string;
  matched_terms: {
    exact: string[];
    fuzzy: string[];
  };
  highlight: Record<string, string[]>;
  all_keywords: string[];
  matched_pages: IMatchedPage[];
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
