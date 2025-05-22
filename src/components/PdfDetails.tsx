import { useEffect, useRef, useState } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  Typography,
  Paper,
  Button,
  Alert,
  Container,
  Chip,
  Stack,
} from "@mui/material";
import Highlighter from "react-highlight-words";
import { saveAs } from "file-saver";
import type { ISearchForm } from "../type/SearchForm";
import axios from "axios";

interface PDFDetailProps {
  document: ISearchForm;
  initialPage: number;
}

const PDFDetail: React.FC<PDFDetailProps> = ({ document, initialPage }) => {
  const [error, setError] = useState<string | null>(null);
  const [selectedPage, setSelectedPage] = useState<number>(initialPage);
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);
  const [isExactSelected, setIsExactSelected] = useState<boolean>(false);
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);

  const exportPDF = async (docId: string, fileName: string) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/v1/download/${docId}`,
        {
          responseType: "blob",
          headers: { Accept: "application/pdf" },
        }
      );
      const pdfBlob = new Blob([response.data], { type: "application/pdf" });
      saveAs(pdfBlob, fileName);
    } catch (err) {
      console.error("Error downloading PDF:", err);
      throw err;
    }
  };

  const handleDownload = async () => {
    setError(null);
    try {
      await exportPDF(document.id, document.title || "document.pdf");
    } catch (err) {
      console.error("Error downloading PDF:", err);
      setError("ไม่สามารถดาวน์โหลดไฟล์ได้");
    }
  };

  const scrollToPage = (pageNumber: number) => {
    if (pageNumber !== selectedPage) {
      setSelectedTerm(null);
      setIsExactSelected(false);
    }
    setSelectedPage(pageNumber);
  };

  const handleTermClick = (
    term: string,
    pageNumber: number,
    isExact: boolean
  ) => {
    setSelectedTerm(term);
    setIsExactSelected(isExact);
    setSelectedPage(pageNumber);
  };

  useEffect(() => {
    const pageRef = document.matched_pages
      .map((page, idx) => ({ page, idx }))
      .find(({ page }) => page.page_number === selectedPage);

    if (pageRef) {
      const ref = pageRefs.current[pageRef.idx];
      ref?.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedPage, document.matched_pages]);

  useEffect(() => {
    setSelectedPage(initialPage);
    setSelectedTerm(null);
    setIsExactSelected(false);
  }, [initialPage]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h6">ค้นหาคำว่า: {document.query}</Typography>
        <Button variant="contained" color="primary" onClick={handleDownload}>
          ดาวน์โหลด PDF
        </Button>
      </Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box display="flex" justifyContent="space-between">
        <Box
          sx={{
            width: "200px",
            flexShrink: 0,
          }}
        >
          <List>
            {document.matched_pages
              .sort((a, b) => a.page_number - b.page_number)
              .map((page) => {
                const pageKeywords = (page.keywords || []).filter(
                  (keyword) =>
                    page.highlight["pages.normalized_text"]?.some((hl) =>
                      hl.toLowerCase().includes(keyword.toLowerCase())
                    ) ||
                    page.highlight["pages.keywords"]?.some((hl) =>
                      hl.toLowerCase().includes(keyword.toLowerCase())
                    )
                );
                const limitedKeywords = pageKeywords.slice(0, 3);
                const hasMoreKeywords = pageKeywords.length > 3;

                return (
                  <ListItem key={page.page_number} disablePadding>
                    <ListItemButton
                      onClick={() => scrollToPage(page.page_number)}
                      sx={{
                        flexDirection: "column",
                        alignItems: "flex-start",
                      }}
                    >
                      <Stack direction="column" spacing={0.5}>
                        <Typography variant="subtitle1">
                          Page {page.page_number}
                        </Typography>
                        <Stack direction="row" spacing={0.5} flexWrap="wrap">
                          {Object.entries(page.exact_match_counts).length >
                          0 ? (
                            Object.entries(page.exact_match_counts).map(
                              ([term, count], index) => (
                                <Chip
                                  key={`exact-${index}`}
                                  label={`${term}: ${count}`}
                                  size="small"
                                  sx={{
                                    backgroundColor: "#ffeb3b", // สีเหลืองสำหรับ exact
                                    cursor: "pointer",
                                  }}
                                  onClick={() =>
                                    handleTermClick(
                                      term,
                                      page.page_number,
                                      true
                                    )
                                  }
                                />
                              )
                            )
                          ) : (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              No exact matches
                            </Typography>
                          )}
                        </Stack>
                        {/* Page Keywords */}
                        <Stack
                          direction="row"
                          spacing={0.5}
                          alignItems="center"
                        >
                          {limitedKeywords.length > 0 ? (
                            <>
                              {limitedKeywords.map((keyword, index) => (
                                <Typography
                                  key={`keyword-${index}`}
                                  variant="caption"
                                  sx={{
                                    color:
                                      selectedTerm === keyword &&
                                      selectedPage === page.page_number &&
                                      !isExactSelected
                                        ? "#ff9800" // สีส้มเมื่อเลือก
                                        : "#000",
                                    cursor: "pointer",
                                    "&:hover": {
                                      textDecoration: "underline",
                                    },
                                  }}
                                  onClick={() =>
                                    handleTermClick(
                                      keyword,
                                      page.page_number,
                                      false
                                    )
                                  }
                                >
                                  {keyword}
                                </Typography>
                              ))}
                              {hasMoreKeywords && (
                                <Typography variant="caption">...</Typography>
                              )}
                            </>
                          ) : (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              No keywords
                            </Typography>
                          )}
                        </Stack>
                      </Stack>
                    </ListItemButton>
                  </ListItem>
                );
              })}
          </List>
        </Box>

        <Box
          sx={{
            flex: 1,
            p: 2,
            overflowY: "auto",
            maxHeight: "80vh",
            overflowX: "hidden",
            minWidth: "800px",
          }}
        >
          {document.matched_pages
            .sort((a, b) => a.page_number - b.page_number)
            .map((page, index) => (
              <Paper
                component="div"
                key={page.page_number}
                ref={(el: HTMLDivElement | null) => {
                  pageRefs.current[index] = el;
                }}
                sx={{
                  width: "794px",
                  minHeight: "1123px",
                  p: 4,
                  mb: 2,
                  boxShadow: 3,
                  backgroundColor: "#fff",
                }}
              >
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Page {page.page_number}
                </Typography>
                {Object.entries(page.highlight).map(([field, highlights]) => (
                  <Box key={field}>
                    {highlights.map((hl, index) => (
                      <Highlighter
                        key={index}
                        searchWords={
                          selectedTerm && selectedPage === page.page_number
                            ? [selectedTerm] // ไฮไลต์เฉพาะคำที่เลือก
                            : [
                                ...(document.matched_terms.exact || []),
                                ...(document.matched_terms.fuzzy || []),
                              ] // ไฮไลต์ทั้ง exact และ fuzzy
                        }
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
                                backgroundColor:
                                  selectedTerm &&
                                  selectedPage === page.page_number &&
                                  isExactSelected &&
                                  !isExact
                                    ? "transparent" // ซ่อน keywords เมื่อเลือก exact
                                    : selectedTerm &&
                                      selectedPage === page.page_number &&
                                      !isExactSelected &&
                                      isExact
                                    ? "transparent" // ซ่อน exact เมื่อเลือก keyword
                                    : isExact
                                    ? "#ffeb3b" // สีเหลืองสำหรับ exact
                                    : "#ff9800", // สีส้มสำหรับ keywords
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
              </Paper>
            ))}
        </Box>
      </Box>
    </Container>
  );
};

export default PDFDetail;
