import { useCallback, useState } from "react";
import Axios from "../utils/Axios";
import { getUrlAPI } from "../utils/Path";

export default function useApiCreate<T, D = unknown>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCreate = useCallback(
    async (data: D) => {
      try {
        setLoading(true);
        const res = await Axios.post(getUrlAPI(url), data);
        setData(res.data);
        return res.data;
      } catch (error: unknown) {
        const err =
          error instanceof Error
            ? error
            : new Error("An unknown error occurred");
        setError(err);
      }
    },
    [url]
  );

  return { data, error, loading, handleCreate };
}

// create demo
// const { data, error, loading, handleCreate } = useApiCreate('https://NRCT/seed/create');
// const body = {};
// handleCreate(body);
