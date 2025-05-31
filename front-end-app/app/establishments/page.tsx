"use client"

import { useEffect, useState } from "react"
import { Plus, Search, Edit, Trash2, Building2, MapPin, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Establishment } from "@/interface/interface"
import Swal from "sweetalert2"
import { establishmentSchema } from "@/schemas/validation-shema"


export default function EstablishmentsPage() {
  const [establishments, setEstablishments] = useState<Establishment[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingEstablishment, setEditingEstablishment] = useState<Boolean>(false)
  const [refreshEstablishments, setRefreshEstablishments] = useState(false);

  const [id, setId] = useState(0);
  const [name, setName] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [capacity, setCapacity] = useState<string>("");
  const [status, setStatus] = useState<string>("Disponible");
  const [phone, setPhone] = useState<string>("");


  const filteredEstablishments = establishments.filter(
    (establishment) =>
      establishment.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      establishment.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      establishment.direccion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      establishment.ciudad.toLowerCase().includes(searchTerm.toLowerCase()) ||
      establishment.estado.toLowerCase().includes(searchTerm.toLowerCase()) ||
      establishment.telefono.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const clearEstablishmentForm = () => {
    setRefreshEstablishments(prev => !prev);
    setName("");
    setType("");
    setAddress("");
    setCity("");
    setCapacity("");
    setStatus("");
    setPhone("");
  };


  const setCurrentData = (establishment: Establishment) => {
    setId(establishment.id);
    setName(establishment.nombre)
    setType(establishment.tipo)
    setAddress(establishment.direccion)
    setCity(establishment.ciudad)
    setCapacity(establishment.capacidad)
    setStatus(establishment.estado)
    setPhone(establishment.telefono)
    setIsAddDialogOpen(true);
    setEditingEstablishment(true);
  }

  const handleAddEstablishment = async () => {

    const result = establishmentSchema.safeParse({
      nombre: name,
      tipo: type,
      direccion: address,
      ciudad: city,
      capacidad: capacity,
      estado: status,
      telefono: phone,
    });

    if (!result.success) {
      const errorMessages = result.error.flatten().fieldErrors;
      const allErrors = Object.values(errorMessages)
        .flat()
        .map((msg) => `- ${msg}`)
        .join("\n");

      await Swal.fire({
        title: "Error de validación",
        text: allErrors,
        icon: "error",
        showConfirmButton: false,
        timer: 4000,
        timerProgressBar: true,
      });

      return;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    try {
      const response = await fetch(`${apiUrl}/establecimiento/api/v1/establecimiento/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          nombre: name,
          tipo: type,
          direccion: address,
          ciudad: city,
          capacidad: capacity,
          estado: status,
          telefono: phone,
        }),
      });

      if (response.status === 403) {
        await Swal.fire({
          title: "Acceso denegado",
          text: "No tienes permisos para realizar esta acción.",
          icon: "warning",
          showConfirmButton: false,
          timer: 4000,
          timerProgressBar: true,
        });
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();

        const errorMessage =
          typeof errorData === "object"
            ? Object.values(errorData).flat().join("\n")
            : errorData?.detail || "Error desconocido.";

        await Swal.fire({
          title: "Error al crear establecimiento",
          text: errorMessage,
          icon: "error",
          showConfirmButton: false,
          timer: 4000,
          timerProgressBar: true,
        });
        return;
      }

      await Swal.fire({
        title: "Establecimiento creado",
        text: "El nuevo establecimiento se ha registrado correctamente.",
        icon: "success",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });

      setIsAddDialogOpen(false)
      setRefreshEstablishments(prev => !prev);
      clearEstablishmentForm()


    } catch (error) {
      setIsAddDialogOpen(false)
      clearEstablishmentForm()
      await Swal.fire({
        title: "Error al crear establecimiento",
        text: "Ocurrió un error inesperado. Contacta al administrador",
        icon: "error",
        confirmButtonText: "OK"
      });
    }
  };

  const handleDeleteEstablishment = async (id: number) => {
    const confirm = await Swal.fire({
      title: "¿Estás seguro que deseas eliminar el establecimiento?",
      text: "¡Esta acción eliminará el establecimiento permanentemente!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (confirm.isConfirmed) {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

      try {
        const response = await fetch(`${apiUrl}/establecimiento/api/v1/establecimiento/${id}/`, {
          method: "DELETE",
          credentials: "include",
        });

        if (response.status === 403) {
          await Swal.fire({
            title: "Acceso denegado",
            text: "No tienes permisos para realizar esta acción.",
            icon: "warning",
            showConfirmButton: false,
            timer: 4000,
            timerProgressBar: true,
          });
          return;
        }

        if (!response.ok) {
          console.error(`Error al eliminar establecimiento con ID ${id}:`, response.status);
          await Swal.fire("Error", "No se pudo eliminar el establecimiento.", "error");
          return;
        }

        await Swal.fire("Eliminado", "El establecimiento fue eliminado exitosamente.", "success");
      } catch (error) {
        console.error("Error de red al eliminar establecimiento:", error);
        await Swal.fire("Error", "Hubo un problema de red al eliminar el establecimiento.", "error");
      }

      setRefreshEstablishments(prev => !prev);
    }
  };

  const handleUpdateEstablishment = async () => {

    const result = establishmentSchema.safeParse({
      nombre: name,
      tipo: type,
      direccion: address,
      ciudad: city,
      capacidad: capacity,
      estado: status,
      telefono: phone,
    });

    if (!result.success) {
      const errorMessages = result.error.flatten().fieldErrors;
      const allErrors = Object.values(errorMessages)
        .flat()
        .map((msg) => `- ${msg}`)
        .join("\n");

      await Swal.fire({
        title: "Error de validación",
        text: allErrors,
        icon: "error",
        showConfirmButton: false,
        timer: 4000,
        timerProgressBar: true,
      });

      return;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    try {
      const response = await fetch(`${apiUrl}/establecimiento/api/v1/establecimiento/${id}/`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: name,
          tipo: type,
          direccion: address,
          ciudad: city,
          capacidad: capacity,
          estado: status,
          telefono: phone,
        }),
      });

      if (response.status === 403) {
        await Swal.fire({
          title: "Acceso denegado",
          text: "No tienes permisos para realizar esta acción.",
          icon: "warning",
          showConfirmButton: false,
          timer: 4000,
          timerProgressBar: true,
        });
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();

        const errorMessage =
          typeof errorData === "object"
            ? Object.values(errorData).flat().join("\n")
            : errorData?.detail || "Error desconocido.";

        await Swal.fire({
          title: "Error al actualizar establecimiento",
          text: errorMessage,
          icon: "error",
          showConfirmButton: false,
          timer: 4000,
          timerProgressBar: true,
        });
        return;
      }

      await Swal.fire({
        title: "Establecimiento actualizado",
        text: "El establecimiento se ha actualizado correctamente.",
        icon: "success",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });

      setEditingEstablishment(false);
      setRefreshEstablishments(prev => !prev);
      setIsAddDialogOpen(false);
      clearEstablishmentForm()

    } catch (error) {
      console.error("Error de red al actualizar el establecimiento:", error);
      await Swal.fire("Error", "Hubo un problema de red al actualizar el establecimiento.", "error");
    }
  };

  useEffect(() => {
    const fetchClients = async () => {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL

      try {
        const response = await fetch(`${apiUrl}/establecimiento/api/v1/establecimiento/`, {
          method: "GET",
          credentials: "include",
        })

        if (!response.ok) {
          console.error("Error al obtener establecimiento:", response.status)
          return
        }

        const data = await response.json()
        setEstablishments(data)
      } catch (error) {
        console.error("Error de red:", error)
      }
    }

    fetchClients()
  }, [refreshEstablishments])

  return (
    <DashboardLayout title="Establishment Management">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Establishments</p>
                  <p className="text-3xl font-bold text-gray-900">{establishments.length}</p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle>Establishment Directory</CardTitle>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search establishments..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full sm:w-64"
                  />
                </div>
                <Dialog open={isAddDialogOpen} onOpenChange={(isOpen) => {
                  setIsAddDialogOpen(isOpen);
                  if (!isOpen) {
                    setTimeout(() => {
                      setEditingEstablishment(false);
                      setName("");
                      setType("");
                      setAddress("");
                      setCity("");
                      setPhone("");
                      setCapacity("");
                      setStatus("");
                    }, 100)
                  }
                }}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Establishment
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Add New Establishment</DialogTitle>
                      <DialogDescription>Enter the establishment's information below.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                          Nombre
                        </Label>
                        <Input id="name" className="col-span-3" value={name} onChange={(e) => setName(e.target.value)} />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="type" className="text-right">
                          Tipo
                        </Label>
                        <Input id="type" className="col-span-3" value={type} onChange={(e) => setType(e.target.value)} />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="address" className="text-right">
                          Direccion
                        </Label>
                        <Input id="address" className="col-span-3" value={address} onChange={(e) => setAddress(e.target.value)} />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="city" className="text-right">
                          Ciudad
                        </Label>
                        <Input id="city" className="col-span-3" value={city} onChange={(e) => setCity(e.target.value)} />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="phone" className="text-right">
                          Telefono
                        </Label>
                        <Input id="phone" className="col-span-3" value={phone} onChange={(e) => setPhone(e.target.value)} />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="capacity" className="text-right">
                          Capacity
                        </Label>
                        <Input id="capacity" type="number" className="col-span-3" value={capacity} onChange={(e) => setCapacity(e.target.value)} />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="status" className="text-right">
                          Estado
                        </Label>
                        <select id="status" value={status} onChange={(e) => setStatus(e.target.value)} className="border p-2 rounded">
                          <option value="Disponible">Disponible</option>
                          <option value="No Disponible">No disponible</option>
                        </select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={() => {
                        if (editingEstablishment) {
                          handleUpdateEstablishment();
                        } else {
                          handleAddEstablishment();
                        }
                      }}>
                        {editingEstablishment ? "Update Establishment" : "Add Establishment"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Direccion</TableHead>
                    <TableHead>Ciudad</TableHead>
                    <TableHead>Telefono</TableHead>
                    <TableHead>Capacidad</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEstablishments.map((establishment) => (
                    <TableRow key={establishment.id}>
                      <TableCell className="font-medium">{establishment.nombre}</TableCell>
                      <TableCell>{establishment.tipo}</TableCell>
                      <TableCell className="max-w-xs truncate">{establishment.direccion}</TableCell>
                      <TableCell>{establishment.ciudad}</TableCell>
                      <TableCell>{establishment.telefono}</TableCell>
                      <TableCell>{establishment.capacidad}</TableCell>
                      <TableCell>
                        <Badge variant={establishment.estado === "Disponible" ? "default" : "secondary"}>
                          {establishment.estado}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => setCurrentData(establishment)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteEstablishment(establishment.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
