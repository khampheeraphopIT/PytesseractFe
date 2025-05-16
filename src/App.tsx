import { useState } from "react";
import { Box, Container, Typography } from "@mui/material";
import SearchForm from "./components/SearchForm";
import UploadForm from "./components/UploadForm";
import type { ISearchForm } from "./type/SearchForm";
import Highlighter from "react-highlight-words";

const App: React.FC = () => {
  const [searchForms, setSearchForms] = useState<ISearchForm[]>([]);
  const [uploadMessage, setUploadMessage] = useState<string>("");

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
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
              <Typography variant="subtitle1">Name: {result.title}</Typography>
              <Typography variant="body2" color="text.secondary">
                Score: {result.score.toFixed(4)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Exact Matches: {(result.matched_terms.exact || []).join(", ") || "None"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Fuzzy Matches: {(result.matched_terms.fuzzy || []).join(", ") || "None"}
              </Typography>
              {/* แสดง page_keywords */}
              <Box sx={{ mt: 1 }}>
                <Typography variant="body2" fontWeight="medium">
                  Keywords by Page:
                </Typography>
                {result.page_keywords.length > 0 ? (
                  result.page_keywords.map((pk) => (
                    <Typography key={pk.page_number} variant="body2">
                      Page {pk.page_number}: {pk.keywords.join(", ")}
                    </Typography>
                  ))
                ) : (
                  <Typography variant="body2">No keywords found</Typography>
                )}
              </Box>
              {/* แสดง matched_pages */}
              <Box sx={{ mt: 1 }}>
                <Typography variant="body2" fontWeight="medium">
                  Matched Pages:
                </Typography>
                {result.matched_pages.length > 0 ? (
                  result.matched_pages.map((mp) => (
                    <Box key={mp.page_number} sx={{ ml: 2 }}>
                      <Typography variant="body2">
                        Page {mp.page_number}:
                      </Typography>
                      {Object.entries(mp.highlight).map(([field, highlights]) => (
                        <Box key={field}>
                          {highlights.map((hl, index) => (
                            <Highlighter
                              key={index}
                              searchWords={[...(result.matched_terms.exact || []), ...(result.matched_terms.fuzzy || [])]}
                              autoEscape={true}
                              textToHighlight={hl.replace(/<em>(.*?)<\/em>/g, "$1")}
                              highlightTag={({ children }) => {
                                const isExact = (result.matched_terms.exact || []).some(
                                  (term) => term.toLowerCase() === children.toLowerCase()
                                );
                                return (
                                  <span
                                    style={{
                                      backgroundColor: isExact ? "#ffeb3b" : "#ff9800",
                                    }}
                                  >
                                    {children}
                                  </span>
                                );
                              }}
                            />
                          ))}
                        </Box>
                      ))}
                    </Box>
                  ))
                ) : (
                  <Typography variant="body2">No matched pages found</Typography>
                )}
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Container>
  );
};

export default App;