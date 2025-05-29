import {
  List,
  ListItem,
  ListItemButton,
  Typography,
  Chip,
  Stack,
} from "@mui/material";
import type { IMatchedPage } from "../../type/SearchForm";

interface PageListProps {
  matchedPages: IMatchedPage[];
  selectedPage: number;
  selectedTerm: string | null;
  isExactSelected: boolean;
  onPageClick: (pageNumber: number) => void;
  onTermClick: (term: string, pageNumber: number, isExact: boolean) => void;
}

const PageList: React.FC<PageListProps> = ({
  matchedPages,
  selectedPage,
  selectedTerm,
  isExactSelected,
  onPageClick,
  onTermClick,
}) => {
  const sortedPages = [...matchedPages].sort(
    (a, b) => a.page_number - b.page_number
  );

  return (
    <List>
      {sortedPages.map((page) => {
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
              onClick={() => onPageClick(page.page_number)}
              sx={{ flexDirection: "column", alignItems: "flex-start", py: 1 }}
            >
              <Typography variant="subtitle1">
                หน้า {page.page_number}
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" mt={0.5}>
                {Object.entries(page.exact_match_counts).length > 0 ? (
                  Object.entries(page.exact_match_counts).map(
                    ([term, count], idx) => (
                      <Chip
                        key={`exact-${idx}`}
                        label={`${term}: ${count}`}
                        size="small"
                        sx={{ bgcolor: "#ffeb3b", cursor: "pointer" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onTermClick(term, page.page_number, true);
                        }}
                      />
                    )
                  )
                ) : (
                  <Typography variant="caption" color="text.secondary">
                    No exact
                  </Typography>
                )}
              </Stack>
              <Stack direction="row" spacing={1} mt={0.5}>
                {limitedKeywords.length > 0 ? (
                  <>
                    {limitedKeywords.map((keyword, idx) => (
                      <Typography
                        key={`keyword-${idx}`}
                        variant="caption"
                        sx={{
                          whiteSpace: "nowrap",
                          cursor: "pointer",
                          color:
                            selectedTerm === keyword &&
                            selectedPage === page.page_number &&
                            !isExactSelected
                              ? "#ff9800"
                              : "inherit",
                          "&:hover": { textDecoration: "underline" },
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onTermClick(keyword, page.page_number, false);
                        }}
                      >
                        {keyword}
                      </Typography>
                    ))}
                    {hasMoreKeywords && (
                      <Typography variant="caption">...</Typography>
                    )}
                  </>
                ) : (
                  <Typography variant="caption" color="text.secondary">
                    ไม่พบคำสำคัญ
                  </Typography>
                )}
              </Stack>
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
};

export default PageList;
