import { CloudUploadOutlined } from "@mui/icons-material";
import { Box, Button, CircularProgress } from "@mui/material";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";

interface UploadFormProps {
  setUploadMessage: React.Dispatch<React.SetStateAction<string>>;
}

interface UploadFormData {
  file: File;
}

const UploadForm: React.FC<UploadFormProps> = ({ setUploadMessage }) => {
  const { control, handleSubmit, reset } = useForm<UploadFormData>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onSubmit = async (data: UploadFormData) => {
    const file = data?.file;
    if (!file) {
      setUploadMessage("Please select a PDF file");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://localhost:8000/api/v1/upload", formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      const result = response.data;
      const message = `File uploaded successfully: ${result.title}`;
      setUploadMessage(message);
      reset();
    } catch (error) {
      setUploadMessage("Error uploading file");
      console.error("Fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box display="flex" flexDirection="column" gap={2}>
        <Controller
          name="file"
          control={control}
          defaultValue={undefined}
          rules={{ required: "Please select a PDF file" }}
          render={({ field }) => (
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  field.onChange(file);
                }
              }}
            />
          )}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          startIcon={<CloudUploadOutlined />}
          disabled={isLoading}
        >
          {isLoading ? <CircularProgress size={24} /> : "Upload PDF"}
        </Button>
      </Box>
    </form>
  );
};

export default UploadForm;
