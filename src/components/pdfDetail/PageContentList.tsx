import { Paper, Typography, Box } from "@mui/material";
import Highlighter from "react-highlight-words";
import { highlightText } from "../../utils/highlightText";
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
            maxWidth: "100%",
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
              {highlights.map((hl, idx) => {
                const highlightProps = highlightText({
                  text: hl,
                  exactWords: matchedTerms.exact || [],
                  fuzzyWords: matchedTerms.fuzzy || [],
                  isExactSelected,
                  selectedTerm,
                  selectedPage,
                  currentPage: page.page_number,
                });
                return (
                  <Highlighter
                    key={idx}
                    searchWords={highlightProps.searchWords}
                    autoEscape={highlightProps.autoEscape}
                    textToHighlight={highlightProps.textToHighlight}
                    highlightTag={({ children }) => {
                      const { style } = highlightProps.highlightTag({
                        children,
                      });
                      return <span style={style}>{children}</span>;
                    }}
                  />
                );
              })}
            </Box>
          ))}
        </Paper>
      ))}
    </>
  );
};

export default PageContentList;
