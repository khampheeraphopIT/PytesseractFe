export interface ISearchForm {
  id: string;
  title: string;
  score: number;
  matched_terms: string[];
  highlight: Record<string, string[]>;
}

export interface SearchRequest {
  query: string;
  min_score: number;
}

export interface IUploadForm {
  id: string;
  title: string;
  message: string;
  extracted_text?: string;
}
