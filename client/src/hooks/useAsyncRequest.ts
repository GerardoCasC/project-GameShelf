import { useCallback, useRef, useState, useEffect } from "react";

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
  const controllerRef = useRef<AbortController | null>(null);

  const execute = useCallback(
    async (
      request: (signal: AbortSignal) => Promise<T>,
      errorMessage = "No se pudo completar la operación.",
    ): Promise<T | null> => {
      controllerRef.current?.abort();

      const controller = new AbortController();
      controllerRef.current = controller;

      const requestId = ++requestIdRef.current;

      setState({
        status: "loading",
        data: null,
        error: null,
      });

      try {
        const result = await request(controller.signal);

        if (requestId !== requestIdRef.current || controller.signal.aborted) {
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

        if (
          controller.signal.aborted ||
          (error instanceof Error && error.name === "AbortError")
        ) {
          setState({
            status: "idle",
            data: null,
            error: null,
          });

          return null;
        }

        console.error("Error en la petición:", error);

        setState({
          status: "error",
          data: null,
          error: errorMessage,
        });

        return null;
      } finally {
        if (controllerRef.current === controller) {
          controllerRef.current = null;
        }
      }
    },
    [],
  );

  const reset = useCallback(() => {
    controllerRef.current?.abort();
    controllerRef.current = null;
    requestIdRef.current += 1;

    setState({
      status: "idle",
      data: null,
      error: null,
    });
  }, []);

  useEffect(() => {
    return () => {
      controllerRef.current?.abort();
      requestIdRef.current += 1;
    };
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}
