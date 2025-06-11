import { useEffect, useRef, useState } from "react";
import { Box, Typography, Button, Alert, Container } from "@mui/material";
import { saveAs } from "file-saver";
import axios from "axios";
import PageList from "./pdfDetail/PageList";
import PageContentList from "./pdfDetail/PageContentList";
import type { ISearchForm } from "../type/SearchForm";

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

  const downloadPDF = async (docId: string, fileName: string) => {
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
      setError("ไม่สามารถดาวน์โหลดไฟล์ได้");
    }
  };

  const handlePageClick = (pageNumber: number) => {
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
    setSelectedPage(initialPage);
    setSelectedTerm(null);
    setIsExactSelected(false);
  }, [initialPage]);

  useEffect(() => {
    const pageIndex = document.matched_pages.findIndex(
      (page) => page.page_number === selectedPage
    );
    if (pageIndex !== -1) {
      pageRefs.current[pageIndex]?.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedPage, document.matched_pages]);

  return (
    <Container  maxWidth="lg" >
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h6">ค้นหาคำว่า: {document.query}</Typography>
        <Button
          variant="contained"
          onClick={() =>
            downloadPDF(document.id, document.title)
          }
        >
          ดาวน์โหลด PDF
        </Button>
      </Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Box sx={{ display: "flex", gap: 2 }}>
        <Box sx={{ width: 200 }}>
          <PageList
            matchedPages={document.matched_pages}
            selectedPage={selectedPage}
            selectedTerm={selectedTerm}
            isExactSelected={isExactSelected}
            onPageClick={handlePageClick}
            onTermClick={handleTermClick}
          />
        </Box>
        <Box
          sx={{ flex: 1, overflowY: "auto", maxHeight: "100vh" }}
        >
          <PageContentList
            matchedPages={document.matched_pages}
            matchedTerms={document.matched_terms}
            selectedPage={selectedPage}
            selectedTerm={selectedTerm}
            isExactSelected={isExactSelected}
            pageRefs={pageRefs}
          />
        </Box>
      </Box>
    </Container>
  );
};

export default PDFDetail;
