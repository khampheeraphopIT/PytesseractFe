interface HighlightTextProps {
  text: string;
  exactWords: string[];
  fuzzyWords: string[];
  isExactSelected?: boolean;
  selectedTerm?: string | null;
  selectedPage?: number | null;
  currentPage?: number | null;
}

export const highlightText = ({
  text,
  exactWords,
  fuzzyWords,
  isExactSelected = false,
  selectedTerm = null,
  selectedPage = null,
  currentPage = null,
}: HighlightTextProps) => {
  const wordsToHighlight =
    selectedTerm && selectedPage === currentPage
      ? [selectedTerm]
      : [...exactWords, ...fuzzyWords];

  const getHighlightStyle = (children: string) => {
    // ตรวจสอบว่าเป็น selected keyword
    const isSelectedKeyword =
      selectedTerm &&
      selectedPage === currentPage &&
      !isExactSelected &&
      selectedTerm.toLowerCase() === children.toLowerCase();

    // ตรวจสอบว่าเป็น exact match
    const isExact =
      !isSelectedKeyword &&
      exactWords.some((term) => term.toLowerCase() === children.toLowerCase());

    // ตรวจสอบว่าเป็น fuzzy match
    const isFuzzy =
      !isSelectedKeyword &&
      !isExact &&
      fuzzyWords.some(
        (term) =>
          term.toLowerCase().includes(children.toLowerCase()) ||
          children.toLowerCase().includes(term.toLowerCase())
      );

    return {
      backgroundColor: isSelectedKeyword
        ? "#ff9800" // สีสำหรับ selected keyword
        : isExact
        ? "#ffeb3b" // สีสำหรับ exact match
        : isFuzzy
        ? "#ffe0b2" // สีสำหรับ fuzzy match
        : "transparent",
    };
  };

  const highlightTag = ({ children }: { children: string }) => ({
    children,
    style: getHighlightStyle(children),
  });

  return {
    searchWords: wordsToHighlight,
    autoEscape: true,
    textToHighlight: text.replace(/<em>(.*?)<\/em>/g, "$1"),
    highlightTag,
  };
};
