import { useState } from "react";
import { Box, Container, Typography } from "@mui/material";
import SearchForm from "./components/SearchForm";
import UploadForm from "./components/UploadForm";
import type { ISearchForm } from "./type/SearchForm";
import Highlighter from "react-highlight-words";

const App: React.FC = () => {
  const [SearchForms, setSearchForms] = useState<ISearchForm[]>([]);
  const [uploadMessage, setUploadMessage] = useState<string>("");
 
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        ScanImage PDF Search
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

      {SearchForms.length > 0 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Search Results
          </Typography>
          {SearchForms.map((result) => (
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
                Matched Terms: {result.matched_terms.join(",") || "None"}
              </Typography>
              {Object.entries(result.highlight).map(([field, highlights]) => (
                <Box key={field} sx={{ mt: 1 }}>
                  <Typography variant="body2" fontWeight="medium">
                    {field}:
                  </Typography>
                  {highlights.map((hl, index) => (
                    <Highlighter
                      key={index}
                      searchWords={result.matched_terms}
                      autoEscape={true}
                      textToHighlight={(hl.replace(/<em>(.*?)<\/em>/g, "$1"))}
                      highlightStyle={{
                        backgroundColor: "#ffeb3b",
                      }}
                    />
                  ))}
                </Box>
              ))}
            </Box>
          ))}
        </Box>
      )}
    </Container>
  );
};

export default App;
