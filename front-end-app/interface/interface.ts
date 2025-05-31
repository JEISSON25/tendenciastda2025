export interface AppUser {
  id?: number;
  username: string;
  password: string;
  email: string;
  role: string;
}


export interface Client {
  id: number;
  nombre: string;
  apellido: string;
  documento: string;
  telefono: string;
  email: string;
  edad: number;
}

export interface Establishment {
  id: number;
  nombre: string;
  tipo: string;
  direccion: string;
  ciudad: string;
  capacidad: string;
  estado: string;
  telefono: string;
}

export interface Reservation {
  id: number;
  fecha: string;
  descripcion?: string;
  valor: string;
  estado: string;
  cliente: Client;
  establecimiento: Establishment;
}

