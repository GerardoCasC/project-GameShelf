export const ERROR_MESSAGES = {
  400: "Solicitud inválida",
  401: "Autenticación requerida",
  403: "Acceso denegado",
  404: "Recurso no encontrado",
  409: "Conflicto con un recurso existente",
  429: "Demasiadas solicitudes, inténtalo más tarde",
  500: "Error interno del servidor",
  502: "Error al consultar el proveedor de videojuegos",
} as const;

export type HttpStatus = keyof typeof ERROR_MESSAGES;

export class AppError extends Error {
  constructor(
    public readonly statusCode: HttpStatus,
    message: string = ERROR_MESSAGES[statusCode],
  ) {
    super(message);
    this.name = "AppError";
  }
}
