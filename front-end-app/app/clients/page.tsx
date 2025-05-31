"use client"

import { useEffect, useState } from "react"
import { Plus, Search, Edit, Trash2, Mail, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Client } from "@/interface/interface"
import Swal from "sweetalert2"
import { clientSchema } from "@/schemas/validation-shema"

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingClient, setEditingClient] = useState<any>(false)
  const [refreshClients, setRefreshClients] = useState(false);

  const [id, setId] = useState<number>(0);
  const [name, setName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [document, setDocument] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [age, setAge] = useState<number>(0);

  const filteredClients = clients.filter(
    (client) =>
      client.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.documento.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.telefono.includes(searchTerm),
  );

  const resetClientForm = () => {
    setRefreshClients(prev => !prev);
    setName("");
    setLastName("");
    setDocument("");
    setPhone("");
    setEmail("");
    setAge(0);
  };


  const setCurrentData = (client: Client) => {
    setId(client.id)
    setName(client.nombre);
    setLastName(client.apellido);
    setDocument(client.documento);
    setPhone(client.telefono);
    setEmail(client.email);
    setAge(client.edad);
    setIsAddDialogOpen(true);
    setEditingClient(true);
  }

  const handleAddClient = async () => {

    const result = clientSchema.safeParse({
      id,
      name,
      lastName,
      document,
      phone,
      email,
      age,
    });

    if (!result.success) {
      const errorMessages = result.error.flatten().fieldErrors;
      const allErrors = Object.values(errorMessages).flat().join("\n");
      await Swal.fire({
        title: "Error de validación",
        text: allErrors,
        icon: "error",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });

      return;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    try {
      const response = await fetch(`${apiUrl}/cliente/api/v1/cliente/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          nombre: name,
          apellido: lastName,
          documento: document,
          telefono: phone,
          email: email,
          edad: age,
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
          title: "Error al crear cliente",
          text: errorMessage,
          icon: "error",
          showConfirmButton: false,
          timer: 4000,
          timerProgressBar: true,
        });
        return;
      }

      setIsAddDialogOpen(false);
      setRefreshClients(prev => !prev);
      resetClientForm()

      await Swal.fire({
        title: "Cliente creado",
        text: "El nuevo cliente se ha registrado correctamente.",
        icon: "success",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    } catch (error) {
      setIsAddDialogOpen(false);
      resetClientForm();
      await Swal.fire({
        title: "Error al crear establecimiento",
        text: "Ocurrió un error inesperado. Contacta al administrador",
        icon: "error",
        confirmButtonText: "OK"
      });
    }
  };

  const handleUpdateClient = async () => {

    const result = clientSchema.safeParse({
      id,
      name,
      lastName,
      document,
      phone,
      email,
      age,
    });

    if (!result.success) {
      const errorMessages = result.error.flatten().fieldErrors;
      const allErrors = Object.values(errorMessages).flat().join("\n");
      await Swal.fire({
        title: "Error de validación",
        text: allErrors,
        icon: "error",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });

      return;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    try {
      const response = await fetch(`${apiUrl}/cliente/api/v1/cliente/${id}/`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: name,
          apellido: lastName,
          documento: document,
          telefono: phone,
          email: email,
          edad: age,
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
          title: "Error al actualizar cliente",
          text: errorMessage,
          icon: "error",
          showConfirmButton: false,
          timer: 4000,
          timerProgressBar: true,
        });
        return;
      }


      await Swal.fire({
        title: "Cliente Actualizado",
        text: "El cliente se ha actualizado correctamente.",
        icon: "success",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });

      setIsAddDialogOpen(false)
      resetClientForm();

    } catch (error) {
      console.error("Error de red al actualizar el cliente:", error);
    }

    setRefreshClients(prev => !prev);
  };

  const handleDeleteClient = async (id: number) => {
    const confirm = await Swal.fire({
      title: "¿Estás seguro que deseas eliminar el cliente?",
      text: "¡Esta acción eliminará el cliente permanentemente!",
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
        const response = await fetch(`${apiUrl}/cliente/api/v1/cliente/${id}/`, {
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
          console.error(`Error al eliminar cliente con ID ${id}:`, response.status);
          await Swal.fire("Error", "No se pudo eliminar el cliente.", "error");
          return;
        }

        await Swal.fire("Eliminado", "El cliente fue eliminado exitosamente.", "success");

      } catch (error) {
        console.error("Error de red al eliminar cliente:", error);
        await Swal.fire("Error", "Hubo un problema de red al eliminar el cliente.", "error");
      }

      setRefreshClients(prev => !prev);
    }
  };


  useEffect(() => {
    const fetchClients = async () => {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL

      try {
        const response = await fetch(`${apiUrl}/cliente/api/v1/cliente/`, {
          method: "GET",
          credentials: "include",
        })

        if (!response.ok) {
          console.error("Error al obtener clientes:", response.status)
          return
        }

        const data = await response.json()
        setClients(data)
      } catch (error) {
        console.error("Error de red:", error)
      }
    }

    fetchClients()
  }, [refreshClients])

  return (
    <DashboardLayout title="Client Management">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Clients</p>
                  <p className="text-3xl font-bold text-gray-900">{clients.length}</p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Mail className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle>Client Directory</CardTitle>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search clients..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full sm:w-64"
                  />
                </div>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Client
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Client</DialogTitle>
                      <DialogDescription>Enter the client's information below.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                          Nombre
                        </Label>
                        <Input id="name" className="col-span-3" value={name} onChange={(e) => setName(e.target.value)} />
                      </div>

                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="lastName" className="text-right">
                          Apellido
                        </Label>
                        <Input id="lastName" className="col-span-3" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                      </div>

                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="document" className="text-right">
                          Documento
                        </Label>
                        <Input id="document" className="col-span-3" value={document} onChange={(e) => setDocument(e.target.value)} />
                      </div>

                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="phone" className="text-right">
                          Telefono
                        </Label>
                        <Input id="phone" className="col-span-3" value={phone} onChange={(e) => setPhone(e.target.value)} />
                      </div>

                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">
                          Email
                        </Label>
                        <Input id="email" type="email" className="col-span-3" value={email} onChange={(e) => setEmail(e.target.value)} />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="age" className="text-right">
                          Edad
                        </Label>
                        <Input id="age" type="number" className="col-span-3" value={age} onChange={(e) => setAge(Number(e.target.value))} />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={() => {
                        if (editingClient) {
                          handleUpdateClient();
                        } else {
                          handleAddClient();
                        }
                      }}>
                        {editingClient ? "Update Client" : "Add Client"}
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
                    <TableHead>Apellido</TableHead>
                    <TableHead>Documento</TableHead>
                    <TableHead>Telefono</TableHead>
                    <TableHead>Correo</TableHead>
                    <TableHead>Edad</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell className="font-medium">{client.nombre}</TableCell>
                      <TableCell>{client.apellido}</TableCell>
                      <TableCell>{client.documento}</TableCell>
                      <TableCell>{client.telefono}</TableCell>
                      <TableCell>{client.email}</TableCell>
                      <TableCell>{client.edad}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button variant="ghost" size="sm" onClick={(e) => setCurrentData(client)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={(e) => handleDeleteClient(client.id)}>
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
