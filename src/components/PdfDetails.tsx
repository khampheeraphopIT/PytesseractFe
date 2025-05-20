import { useState } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  Typography,
  Paper,
} from "@mui/material";
import Highlighter from "react-highlight-words";
import type { ISearchForm } from "../type/SearchForm";

interface PDFDetailProps {
  document: ISearchForm;
  initialPage: number;
}

const PDFDetail: React.FC<PDFDetailProps> = ({ document, initialPage }) => {
  const [selectedPage, setSelectedPage] = useState<number>(initialPage);

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        ค้นหาคำว่า: {document.query}
      </Typography>

      <Box display="flex" justifyContent="space-between">
        <Box
          sx={{
            width: "200px",
            borderRight: "1px solid #ccc",
            overflowY: "auto",
          }}
        >
          <List>
            {document.matched_pages.map((page) => (
              <ListItem key={page.page_number} disablePadding>
                <ListItemButton
                  selected={selectedPage === page.page_number}
                  onClick={() => setSelectedPage(page.page_number)}
                >
                  <Typography>Page {page.page_number}</Typography>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>

        <Box sx={{ flex: 1, p: 2, overflowY: "auto" }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Page {selectedPage}</Typography>
            {document.matched_pages
              .sort((a, b) => a.page_number - b.page_number)
              .filter((page) => page.page_number === selectedPage)
              .map((page) => (
                <Box key={page.page_number}>
                  {Object.entries(page.highlight).map(([field, highlights]) => (
                    <Box key={field}>
                      {highlights.map((hl, index) => (
                        <Highlighter
                          key={index}
                          searchWords={[
                            ...(document.matched_terms.exact || []),
                            ...(document.matched_terms.fuzzy || []),
                          ]}
                          autoEscape={true}
                          textToHighlight={hl.replace(/<em>(.*?)<\/em>/g, "$1")}
                          highlightTag={({ children }) => {
                            const isExact = (
                              document.matched_terms.exact || []
                            ).some(
                              (term) =>
                                term.toLowerCase() === children.toLowerCase()
                            );
                            return (
                              <span
                                style={{
                                  backgroundColor: isExact
                                    ? "#ffeb3b"
                                    : "#ff9800",
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
                  <Typography
                    variant="body2"
                    sx={{ mt: 2, whiteSpace: "pre-wrap" }}
                  >
                    {page.original_text}
                  </Typography>
                </Box>
              ))}
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default PDFDetail;
