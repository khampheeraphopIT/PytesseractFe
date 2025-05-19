import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button, CircularProgress, TextField, Typography } from "@mui/material";
import { SearchOutlined } from "@mui/icons-material";
import type { ISearchForm, SearchRequest } from "../type/SearchForm";
import axios from "axios";

interface SearchFormProps {
  setSearchForms: React.Dispatch<React.SetStateAction<ISearchForm[]>>;
}

const SearchForm: React.FC<SearchFormProps> = ({ setSearchForms }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SearchRequest>({
    defaultValues: {
      query: "",
      min_score: 0.1,
    },
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const onSubmit = async (data: SearchRequest) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/search",
        data,
      );
      const results = response.data.map((result: ISearchForm) => ({
        ...result,
        query: data.query,
      }));

      setSearchForms(results);
      setMessage(results.length === 0 ? "No results found" : "");
    } catch (error) {
      setMessage("Error searching documents");
      setSearchForms([]);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="query"
        control={control}
        rules={{ required: "Search query is required" }}
        render={({ field }) => (
          <TextField
            {...field}
            label="Search Query"
            placeholder="Enter multiple terms (e.g., เทคนิค การใช้งาน การทำงาน)"
            fullWidth
            error={!!errors.query}
            helperText={errors.query?.message}
            margin="normal"
          />
        )}
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        startIcon={<SearchOutlined />}
        disabled={isLoading}
        sx={{ mt: 2 }}
      >
        {isLoading ? <CircularProgress size={24} /> : "Search"}
      </Button>
      {message && (
        <Typography
          variant="body2"
          color={message.includes("Error") ? "error" : "text.secondary"}
          sx={{ mt: 1 }}
        >
          {message}
        </Typography>
      )}
    </form>
  );
};

export default SearchForm;
