import React, { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import jsPDF from "jspdf";

export default function Checkout() {
    const location = useLocation();
    const savedData = sessionStorage.getItem("checkoutData");
    const state = savedData ? JSON.parse(savedData) : null;
    const token = localStorage.getItem("token");

    const navigate = useNavigate();
    const API = import.meta.env.VITE_API_URL;
    const paypalRef = useRef();

    useEffect(() => {
        const url = new URL(window.location.href);
        const hasReloaded = url.searchParams.get("reloaded");

        if (!hasReloaded) {
            url.searchParams.set("reloaded", "1");
            window.location.replace(url.toString());
        }
    }, []);


    if (!state || !state.cuarto || !state.fechaInicio || !state.fechaFin) {
        return (
            <div className="mt-32 text-white text-center">
                <p>Error: Información incompleta para el checkout.</p>
                <button
                    onClick={() => navigate("/")}
                    className="mt-4 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded text-white"
                >
                    Volver al inicio
                </button>
            </div>
        );
    }

    const { cuarto, fechaInicio, fechaFin } = state;
    const dias = Math.ceil(
        (new Date(fechaFin) - new Date(fechaInicio)) / (1000 * 60 * 60 * 24)
    );
    const total = cuarto.precio * dias;

    const handlePagar = async () => {
        if (dias <= 0) {
            Swal.fire("Error", "La fecha de fin debe ser posterior a la de inicio.", "error");
            return;
        }

        try {
            const res = await axios.post(`${API}/pagos/crear-preferencia`, {
                titulo: `Cuarto ${cuarto.tipo} con ${dias} días de estancia`,
                cantidad: dias,
                precio: cuarto.precio,
            });

            window.location.href = res.data;
        } catch (error) {
            console.error("Error al redirigir a Mercado Pago:", error);
            Swal.fire("Error", "No se pudo redirigir al pago.", "error");
        }
    };


    const generarComprobante = () => {
        const doc = new jsPDF();

        // Opcional: logotipo en base64 (puedes poner el tuyo aquí)
        const logoBase64 = ''; // ← Agrega aquí tu imagen como base64 si quieres

        if (logoBase64) {
            doc.addImage(logoBase64, "PNG", 150, 10, 40, 20);
        }

        doc.setFontSize(18);
        doc.setTextColor(40, 40, 40);
        doc.text("Comprobante de Reservación", 20, 30);

        // Línea divisoria
        doc.setLineWidth(0.5);
        doc.line(20, 35, 190, 35);

        doc.setFontSize(12);
        doc.setTextColor(60, 60, 60);

        // Información de la reservación
        const data = [
            { label: "ID del cuarto", value: cuarto.id },
            { label: "Número de cuarto", value: cuarto.numero },
            { label: "Tipo", value: cuarto.tipo },
            { label: "Capacidad", value: `${cuarto.capacidad} persona${cuarto.capacidad > 1 ? "s" : ""}` },
            { label: "Precio por noche", value: `$${cuarto.precio}` },
            { label: "Fecha de inicio", value: fechaInicio },
            { label: "Fecha de fin", value: fechaFin },
            { label: "Días reservados", value: dias },
            { label: "Total pagado", value: `$${total}`, bold: true },
            { label: "Método de pago", value: "PayPal" },
            { label: "Fecha de emisión", value: new Date().toLocaleString() },
        ];

        let y = 45;

        data.forEach(({ label, value, bold }) => {
            doc.setFont(undefined, bold ? "bold" : "normal");
            doc.text(`${label}:`, 20, y);
            doc.setFont(undefined, "normal");
            doc.text(String(value), 80, y);
            y += 10;
        });

        // Footer
        doc.setDrawColor(200, 200, 200);
        doc.line(20, y + 10, 190, y + 10);
        doc.setFontSize(10);
        doc.setTextColor(150, 150, 150);
        doc.text("Gracias por reservar con nosotros", 20, y + 20);

        doc.save("comprobante_reservacion.pdf");
    };


    const handleReservar = async (cuartoId) => {
        try {
            const res = await axios.post(
                `${API}/reservaciones`,
                {
                    cuartoId,
                    fechaInicio,
                    fechaFin,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            Swal.fire({
                icon: "success",
                title: "Reservación completada",
                text: "✅ Tu reservación se realizó con éxito.",
                timer: 3000,
                showConfirmButton: false,
            }).then(() => {
                navigate("/reservaciones");
            });

        } catch (error) {
            console.error("Error al reservar:", error);
            Swal.fire({
                icon: "error",
                title: "Error al reservar",
                text: "❌ No se pudo completar la reservación.",
            });
        }
    };


    useEffect(() => {
        if (!window.paypal || !paypalRef.current) return;

        window.paypal.Buttons({
            style: {
                color: "blue",
                shape: "pill",
                label: "pay",
            },
            createOrder: (data, actions) => {
                return actions.order.create({
                    purchase_units: [
                        {
                            description: `Cuarto ${cuarto.tipo} - ${dias} noche${dias > 1 ? "s" : ""}`,
                            amount: {
                                currency_code: "MXN",
                                value: total.toFixed(2),
                            },
                        },
                    ],
                });
            },
            onApprove: async (data, actions) => {
                try {
                    const order = await actions.order.capture();
                    console.log("✅ Pago aprobado:", order);

                    await handleReservar(cuarto.id);

                    generarComprobante();

                    setTimeout(() => {
                        navigate("/reservaciones"); // 👉 Redirige después de 2 segundos
                    }, 2000);

                } catch (error) {
                    console.error("❌ Error al confirmar reservación:", error);
                    Swal.fire("Error", "El pago fue exitoso, pero falló la reservación.", "error");
                }
            },
            onError: (err) => {
                console.error("❌ Error en PayPal:", err);
                Swal.fire("Error", "Hubo un problema al procesar el pago con PayPal.", "error");
            },
        }).render(paypalRef.current);
    }, [cuarto.tipo, dias, total, navigate]);

    return (
        <div className="mt-24 px-6 max-w-6xl mx-auto text-white">
            <div className="bg-[#1f1f1f] p-8 rounded-2xl shadow-lg border border-[#3a3d45] grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Columna izquierda */}
                <div>
                    <img
                        src={cuarto.imagenUrl || "/img/default-room.jpg"}
                        alt={`Cuarto ${cuarto.tipo}`}
                        className="rounded-xl mb-5 w-full h-60 object-cover"
                    />

                    <h3 className="text-2xl font-bold capitalize mb-3">Cuarto {cuarto.tipo}</h3>
                    <p className="text-sm mb-1">
                        <span className="font-semibold">Número:</span> {cuarto.numero}
                    </p>
                    <p className="text-sm mb-1">
                        <span className="font-semibold">Capacidad:</span> {cuarto.capacidad} persona{cuarto.capacidad > 1 && "s"}
                    </p>
                    <p className="text-sm mb-1">
                        <span className="font-semibold">Precio por noche:</span> ${cuarto.precio}
                    </p>
                    <p className="text-sm mt-4 italic text-gray-400">
                        * Todos nuestros cuartos incluyen Wi-Fi, limpieza diaria y acceso a instalaciones.
                    </p>
                </div>

                {/* Columna derecha */}
                <div className="flex flex-col justify-between">
                    <div>
                        <h4 className="text-xl font-semibold mb-4">Detalles de la Reservación</h4>
                        <p className="mb-2">
                            <span className="font-medium">Desde:</span> {fechaInicio}
                        </p>
                        <p className="mb-2">
                            <span className="font-medium">Hasta:</span> {fechaFin}
                        </p>
                        <p className="mb-2">
                            <span className="font-medium">Días:</span> {dias}
                        </p>
                        <p className="text-lg font-bold mt-4">
                            Total a pagar: <span className="text-green-400">${total}</span>
                        </p>
                    </div>

                    <div className="mt-8 flex flex-col gap-4">
                        <button
                            onClick={handlePagar}
                            className="bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold"
                        >
                            Pagar con Mercado Pago
                        </button>

                        <div ref={paypalRef}></div>

                        <button
                            onClick={() => navigate(-1)}
                            className="bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
