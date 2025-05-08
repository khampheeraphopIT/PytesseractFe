import { useState } from "react";
import { Box, Container, Typography } from "@mui/material";
import SearchForm from "./components/SearchForm";
import UploadForm from "./components/UploadForm";
import type { ISearchForm } from "./type/SearchForm";

const App: React.FC = () => {
  const [searchResults, setSearchResults] = useState<ISearchForm[]>([]);
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
        <SearchForm setSearchResults={setSearchResults} />
      </Box>

      {searchResults.length > 0 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Search Results
          </Typography>
          {searchResults.map((result) => (
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
                    <Typography
                      key={index}
                      variant="body2"
                      dangerouslySetInnerHTML={{ __html: hl }}
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
