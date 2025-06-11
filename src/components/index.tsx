import { useState } from "react";
import { Box, Container, Typography, Button, Divider } from "@mui/material";
import SearchForm from "./SearchForm";
import UploadForm from "./UploadForm";
import PDFDetail from "../components/PdfDetails";
import type { ISearchForm } from "../type/SearchForm";
import Highlighter from "react-highlight-words";
import { highlightText } from "../utils/highlightText";
import truncateText from "../utils/truncate";

const Index: React.FC = () => {
  const [searchForms, setSearchForms] = useState<ISearchForm[]>([]);
  const [uploadMessage, setUploadMessage] = useState<string>("");
  const [selectedDocument, setSelectedDocument] = useState<{
    document: ISearchForm;
    initialPage: number;
  } | null>(null);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {!selectedDocument ? (
        <>
          <Typography variant="h4" gutterBottom align="center">
            ScanImage PDF
          </Typography>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Upload PDF
            </Typography>
            <UploadForm setUploadMessage={setUploadMessage} />
            {uploadMessage && (
              <Typography
                variant="body2"
                color={uploadMessage.includes("Error") ? "error" : "success"}
                sx={{ mt: 1 }}
              >
                {uploadMessage}
              </Typography>
            )}
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Search Documents
            </Typography>
            <SearchForm setSearchForms={setSearchForms} />
          </Box>

          {searchForms.length > 0 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Search Results
              </Typography>
              {searchForms.map((result) => (
                <Box
                  key={result.id}
                  sx={{
                    p: 2,
                    mb: 2,
                    backgroundColor: "background.paper",
                    borderRadius: 1,
                    boxShadow: 1,
                  }}
                >
                  <Typography variant="subtitle1">
                    Name: {result.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Score: {result.score.toFixed(4)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Exact Matches:{" "}
                    {(result.matched_terms.exact || []).join(", ") || "None"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Fuzzy Matches:{" "}
                    {(result.matched_terms.fuzzy || []).join(", ") || "None"}
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="body2" fontWeight="medium">
                      Keywords:
                    </Typography>
                    <Typography variant="body2">
                      {(result.all_keywords || []).slice(0, 50).join(", ") ||
                        "No keywords found"}
                    </Typography>
                  </Box>
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="body2" fontWeight="medium">
                      Matched Pages:
                    </Typography>
                    {result.matched_pages.length > 0 ? (
                      result.matched_pages
                        .sort((a, b) => a.page_number - b.page_number)
                        .map((mp) => (
                          <Box key={mp.page_number} sx={{ ml: 2, mb: 1 }}>
                            <Typography variant="body2">
                              Page {mp.page_number}:
                            </Typography>
                            {Object.entries(mp.highlight).map(
                              ([field, highlights]) => (
                                <Box key={field}>
                                  {highlights.map((hl, index) => {
                                    const highlightProps = highlightText({
                                      text: truncateText(hl, 5, 100),
                                      exactWords:
                                        result.matched_terms.exact || [],
                                      fuzzyWords:
                                        result.matched_terms.fuzzy || [],
                                    });
                                    return (
                                      <Highlighter
                                        key={index}
                                        searchWords={highlightProps.searchWords}
                                        autoEscape={highlightProps.autoEscape}
                                        textToHighlight={
                                          highlightProps.textToHighlight
                                        }
                                        highlightTag={({ children }) => {
                                          const { style } =
                                            highlightProps.highlightTag({
                                              children,
                                            });
                                          return (
                                            <span style={style}>
                                              {children}
                                            </span>
                                          );
                                        }}
                                      />
                                    );
                                  })}
                                </Box>
                              )
                            )}
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "flex-end",
                                mt: 1,
                              }}
                            >
                              <Button
                                variant="outlined"
                                size="small"
                                onClick={() =>
                                  setSelectedDocument({
                                    document: result,
                                    initialPage: mp.page_number,
                                  })
                                }
                              >
                                ดูเพิ่มเติม
                              </Button>
                            </Box>
                            <Divider sx={{ mt: 2 }} />
                          </Box>
                        ))
                    ) : (
                      <Typography variant="body2">
                        No matched pages found
                      </Typography>
                    )}
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </>
      ) : (
        <Box>
          <Button
            variant="text"
            onClick={() => setSelectedDocument(null)}
            sx={{ mb: 2 }}
          >
            Back to Search
          </Button>
          <PDFDetail
            document={selectedDocument.document}
            initialPage={selectedDocument.initialPage}
          />
        </Box>
      )}
    </Container>
  );
};

export default Index;
