import { Paper, Typography, Box } from "@mui/material";
import Highlighter from "react-highlight-words";
import type { IMatchedPage } from "../../type/SearchForm";

interface PageContentListProps {
  matchedPages: IMatchedPage[];
  matchedTerms: { exact: string[]; fuzzy: string[] };
  selectedPage: number;
  selectedTerm: string | null;
  isExactSelected: boolean;
  pageRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
}

const PageContentList: React.FC<PageContentListProps> = ({
  matchedPages,
  matchedTerms,
  selectedPage,
  selectedTerm,
  isExactSelected,
  pageRefs,
}) => {
  const sortedPages = [...matchedPages].sort(
    (a, b) => a.page_number - b.page_number
  );

  return (
    <>
      {sortedPages.map((page, index) => (
        <Paper
          component="div"
          key={page.page_number}
          ref={(el: HTMLDivElement | null) => {
            pageRefs.current[index] = el;
          }}
          sx={{
            width: "794px",
            minHeight: "1123px",
            p: 3,
            mb: 2,
            boxShadow: 3,
          }}
        >
          <Typography variant="h6" mb={2}>
            หน้า {page.page_number}
          </Typography>
          {Object.entries(page.highlight).map(([field, highlights]) => (
            <Box key={field}>
              {highlights.map((hl, idx) => (
                <Highlighter
                  key={idx}
                  searchWords={
                    selectedTerm && selectedPage === page.page_number
                      ? [selectedTerm]
                      : [
                          ...(matchedTerms.exact || []),
                          ...(matchedTerms.fuzzy || []),
                        ]
                  }
                  autoEscape
                  textToHighlight={hl.replace(/<em>(.*?)<\/em>/g, "$1")}
                  highlightTag={({ children }) => {
                    const isExact = (matchedTerms.exact || []).some(
                      (term) => term.toLowerCase() === children.toLowerCase()
                    );
                    return (
                      <span
                        style={{
                          backgroundColor:
                            selectedTerm && selectedPage === page.page_number
                              ? isExactSelected && !isExact
                                ? "transparent"
                                : !isExactSelected && isExact
                                ? "transparent"
                                : isExact
                                ? "#ffeb3b"
                                : "#ff9800"
                              : isExact
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
        </Paper>
      ))}
    </>
  );
};

export default PageContentList;
