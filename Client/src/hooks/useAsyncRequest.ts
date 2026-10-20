import { useCallback, useRef, useState } from "react";

export type RequestStatus = "idle" | "loading" | "success" | "error";

interface RequestState<T> {
  status: RequestStatus;
  data: T | null;
  error: string | null;
}

export function useAsyncRequest<T>() {
  const [state, setState] = useState<RequestState<T>>({
    status: "idle",
    data: null,
    error: null,
  });

  const requestIdRef = useRef(0);

  const execute = useCallback(
    async (
      request: () => Promise<T>,
      errorMessage = "No se pudo completar la operación.",
    ): Promise<T | null> => {
      const requestId = ++requestIdRef.current;

      setState({
        status: "loading",
        data: null,
        error: null,
      });

      try {
        const result = await request();

        if (requestId !== requestIdRef.current) {
          return null;
        }

        setState({
          status: "success",
          data: result,
          error: null,
        });

        return result;
      } catch (error) {
        if (requestId !== requestIdRef.current) {
          return null;
        }

        console.error("Error en la petición:", error);

        setState({
          status: "error",
          data: null,
          error: errorMessage,
        });

        return null;
      }
    },
    [],
  );

  const reset = useCallback(() => {
    requestIdRef.current += 1;

    setState({
      status: "idle",
      data: null,
      error: null,
    });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}
