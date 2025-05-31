"use client"

import { useEffect, useState } from "react"
import { Plus, Search, Edit, X, Calendar, Clock, CheckCircle, AlertCircle, Trash2 } from "lucide-react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Client, Establishment, Reservation } from "@/interface/interface"
import Swal from "sweetalert2"
import { reservationSchema } from "@/schemas/validation-shema"



export default function ReservationsPage() {
    const [clients, setClients] = useState<Client[]>([])
    const [selectedClientId, setSelectedClientId] = useState<string>("")
    const [selectedClient, setSelectedClient] = useState<Client | null>(null)

    const [establishments, setEstablishments] = useState<Establishment[]>([])
    const [selectedEstablishmentId, setSelectedEstablishmentId] = useState<string>("")
    const [selectedEstablishment, setSelectedEstablishment] = useState<Establishment | null>(null)
    const [refreshReservation, setRefreshReservation] = useState(false);

    const [id, setId] = useState<number>(0);
    const [fecha, setFecha] = useState<string>("");
    const [descripcion, setDescripcion] = useState<any>("");
    const [valor, setValor] = useState<string>("");
    const [estado, setEstado] = useState<string>("");


    const [reservations, setReservations] = useState<Reservation[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const [typeFilter, setTypeFilter] = useState("all")
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [editingEstablishment, setEditingEstablishment] = useState<any>(false)

    const filteredReservations = reservations.filter((reservation) => {
        const search = searchTerm.toLowerCase();

        const matchesSearch =
            reservation.cliente.nombre.toLowerCase().includes(search) ||
            reservation.establecimiento.nombre.toLowerCase().includes(search) ||
            reservation.fecha.toLowerCase().includes(search) ||
            (reservation.descripcion?.toLowerCase().includes(search) ?? false) ||
            reservation.valor.toLowerCase().includes(search);

        return matchesSearch;
    });

    const resetReservationForm = () => {
        setDescripcion("");
        setValor("");
        setEstado("");
        setSelectedClient(null);
        setSelectedEstablishment(null);
    };


    const setCurrentData = async (reservation: Reservation) => {
        setId(reservation.id)
        setFecha(reservation.fecha)
        setDescripcion(reservation.descripcion)
        setValor(reservation.valor)
        setEstado(reservation.estado)
        setIsAddDialogOpen(true)
        setEditingEstablishment(true)
    }

    const handleClientSelect = (value: string) => {
        setSelectedClientId(value)
        const client = clients.find((c) => c.id.toString() === value)
        setSelectedClient(client || null)
    }

    const handleUpdateReservation = async () => {
        const result = reservationSchema.safeParse({
            fecha,
            descripcion,
            valor,
            estado,
            cliente_id: selectedClientId,
            establecimiento_id: selectedEstablishmentId,
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

        const data = {
            fecha,
            descripcion,
            valor,
            estado,
            cliente_id: selectedClientId,
            establecimiento_id: selectedEstablishmentId,
        };

        try {
            const response = await fetch(`${apiUrl}/reserva/api/v1/reserva/${id}/`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(data),
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
                console.error("Error al actualizar la reserva:", response.status);
                const errorData = await response.json();
                await Swal.fire("Error", errorData?.Response || "No se pudo actualizar la reserva.", "error");
                return;
            }

            setIsAddDialogOpen(false);
            await Swal.fire({
                title: "Reserva actualizada",
                text: "La reserva ha sido actualizada exitosamente.",
                icon: "success",
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
            });

            resetReservationForm();
        } catch (error) {
            console.error("Error de red al actualizar la reserva:", error);
            await Swal.fire("Error", "Hubo un problema de red al actualizar la reserva.", "error");
            resetReservationForm();
        }
        setRefreshReservation(prev => !prev);
    };

    const handleEstablishmentSelect = (value: string) => {
        setSelectedEstablishmentId(value)
        const establishment = establishments.find((e) => e.id.toString() === value)
        setSelectedEstablishment(establishment || null)
    }

    const handleCreateReservation = async () => {
        const result = reservationSchema.safeParse({
            fecha,
            descripcion,
            valor,
            estado,
            cliente_id: selectedClientId,
            establecimiento_id: selectedEstablishmentId,
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

        const data = {
            fecha,
            descripcion,
            valor,
            estado,
            cliente_id: selectedClient?.id,
            establecimiento_id: selectedEstablishment?.id,
        };

        try {
            const response = await fetch(`${apiUrl}/reserva/api/v1/reserva/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(data),
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

            setIsAddDialogOpen(false)
            await Swal.fire({
                title: "Reserva creada",
                text: "La reserva ha sido registrada exitosamente.",
                icon: "success",
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
            });

            resetReservationForm();

        } catch (error) {
            console.error("Error de red al crear la reserva:", error);
            setIsAddDialogOpen(false)
            resetReservationForm();
            await Swal.fire("Error", "Hubo un problema de red al crear la reserva.", "error");
        }
        setRefreshReservation(prev => !prev);
    };

    const handleDeleteReservation = async (id: number) => {
        const confirm = await Swal.fire({
            title: "¿Estás seguro que deseas eliminar la reserva?",
            text: "¡Esta acción eliminará la reserva permanentemente!",
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
                const response = await fetch(`${apiUrl}/reserva/api/v1/reserva/${id}/`, {
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
                    console.error(`Error al eliminar reserva con ID ${id}:`, response.status);
                    await Swal.fire("Error", "No se pudo eliminar la reserva.", "error");
                    return;
                }

                await Swal.fire("Eliminada", "La reserva fue eliminada exitosamente.", "success");
            } catch (error) {
                console.error("Error de red al eliminar la reserva:", error);
                await Swal.fire("Error", "Hubo un problema de red al eliminar la reserva.", "error");
            }

            setRefreshReservation(prev => !prev);
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

        const fetchEstablishments = async () => {
            const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL
            try {
                const response = await fetch(`${apiUrl}/establecimiento/api/v1/establecimiento/`, {
                    method: "GET",
                    credentials: "include",
                })

                if (!response.ok) {
                    console.error("Error al obtener establecimientos:", response.status)
                    return
                }

                const data = await response.json()
                setEstablishments(data)
            } catch (error) {
                console.error("Error de red:", error)
            }
        }

        const fetchReservations = async () => {
            const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL

            try {
                const response = await fetch(`${apiUrl}/reserva/api/v1/reserva/`, {
                    method: "GET",
                    credentials: "include",
                })

                if (!response.ok) {
                    console.error("Error al obtener reservas:", response.status)
                    return
                }

                const data = await response.json()
                setReservations(data)
            } catch (error) {
                console.error("Error de red al obtener reservas:", error)
            }
        }

        fetchClients()
        fetchEstablishments()
        fetchReservations()
    }, [refreshReservation])

    return (
        <DashboardLayout title="Reservation Management">
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <CardTitle>Reservation Overview</CardTitle>
                            <div className="flex flex-col sm:flex-row gap-6">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        placeholder="Search reservations..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 w-full sm:w-60"
                                    />
                                </div>

                                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button>
                                            <Plus className="h-4 w-4 mr-2" />
                                            New Reservation
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-md">
                                        <DialogHeader>
                                            <DialogTitle>Create New Reservation</DialogTitle>
                                            <DialogDescription>Enter the reservation details below.</DialogDescription>
                                        </DialogHeader>
                                        <div className="grid gap-4 py-4">
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="client" className="text-right">
                                                    Cliente
                                                </Label>
                                                <Select onValueChange={handleClientSelect}>
                                                    <SelectTrigger className="col-span-3">
                                                        <SelectValue placeholder="Selecciona cliente" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {clients.map((client) => (
                                                            <SelectItem key={client.id} value={client.id.toString()}>
                                                                {client.nombre} {client.apellido}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="establishment" className="text-right">
                                                    Establecimiento
                                                </Label>
                                                <Select onValueChange={handleEstablishmentSelect}>
                                                    <SelectTrigger className="col-span-3">
                                                        <SelectValue placeholder="Selecciona establecimiento" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {establishments.map((est) => (
                                                            <SelectItem key={est.id} value={est.id.toString()}>
                                                                {est.nombre}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>

                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="datetime" className="text-right">
                                                    Fecha
                                                </Label>
                                                <Input id="datetime" type="datetime-local" className="col-span-2" onChange={(e) => setFecha(e.target.value)} />
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="description" className="text-right">
                                                    Descripcion
                                                </Label>
                                                <Input id="description" type="text" className="col-span-3" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="value" className="text-right">
                                                    Valor
                                                </Label>
                                                <Input id="value" type="text" className="col-span-3" value={valor} onChange={(e) => setValor(e.target.value)} />
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="value" className="text-right">
                                                    Estado
                                                </Label>
                                                <Select onValueChange={setEstado}>
                                                    <SelectTrigger className="w-full sm:w-32">
                                                        <SelectValue placeholder="Status" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Confirmado">Confirmado</SelectItem>
                                                        <SelectItem value="Pendiente">Pendiente</SelectItem>
                                                        <SelectItem value="Cancelado">Cancelado</SelectItem>
                                                        <SelectItem value="Completado">Completado</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button onClick={() => {
                                                if (editingEstablishment) {
                                                    handleUpdateReservation();
                                                } else {
                                                    handleCreateReservation();
                                                }
                                            }}>
                                                {editingEstablishment ? "Update Reservation" : "Add Reservation"}
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
                                        <TableHead>Cliente</TableHead>
                                        <TableHead>Establecimiento</TableHead>
                                        <TableHead>Fecha</TableHead>
                                        <TableHead>Descripcion</TableHead>
                                        <TableHead>Valor</TableHead>
                                        <TableHead>Estado</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredReservations.map((reservation) => (
                                        <TableRow key={reservation.id}>
                                            <TableCell className="font-medium">{reservation.cliente.nombre}</TableCell>
                                            <TableCell>{reservation.establecimiento.nombre}</TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span>{reservation.fecha}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>{reservation.descripcion}</TableCell>
                                            <TableCell>$ {reservation.valor}</TableCell>
                                            <TableCell>{reservation.estado}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end space-x-2">
                                                    <Button variant="ghost" size="sm" onClick={() => { setCurrentData(reservation) }}>
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="sm" onClick={(e) => { handleDeleteReservation(reservation.id) }}>
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
