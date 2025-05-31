import { z } from "zod";

export const clientSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, { message: "El nombre es obligatorio" }),
  lastName: z.string().min(1, { message: "El apellido es obligatorio" }),
  document: z.string().min(1, { message: "El documento es obligatorio" }),
  phone: z.string().min(1, { message: "El teléfono es obligatorio" }),
  email: z.string().email({ message: "Correo electrónico inválido" }),
  age: z.number().min(0, { message: "La edad debe ser mayor o igual a 0" }),
});

export const establishmentSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  tipo: z.string().min(1, "El tipo es obligatorio"),
  direccion: z.string().min(1, "La dirección es obligatoria"),
  ciudad: z.string().min(1, "La ciudad es obligatoria"),
  capacidad: z.string().min(1, "La capacidad es obligatoria"),
  estado: z.enum(["Disponible", "No Disponible"], {
    errorMap: () => ({ message: "El estado debe ser Disponible o No Disponible" }),
  }),
  telefono: z.string().min(1, "El teléfono es obligatorio"),
});

export const reservationSchema = z.object({
  fecha: z.string().min(1, "La fecha es obligatoria"),
  descripcion: z.string().optional(),
  valor: z
    .string()
    .min(1, "El valor es obligatorio")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "El valor debe ser un número mayor a 0",
    }),
  estado: z.string().min(1, "El estado es obligatorio"),
  cliente_id: z.string().min(1, "Debe seleccionar un cliente"),
  establecimiento_id: z.string().min(1, "Debe seleccionar un establecimiento"),
});
