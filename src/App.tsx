/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent, ChangeEvent, useEffect } from "react";

// URL del Webhook (Configurar en Make.com u otro servicio)
const WEBHOOK_URL = "https://hook.us2.make.com/hyjwp5tzn3t8uuat3643q3yhgxrzlcx4";

interface MaterialItem {
  nombre: string;
  cantidad: number;
  costo: number;
  subtotal: number;
}

interface QuoteData {
  nombreCliente: string;
  whatsappCliente: string;
  tipoServicio: string;
  materiales: MaterialItem[];
  costoManoObra: number;
  totalGeneral: number;
  fecha: string;
}

const Snowfall = () => {
  const [snowflakes, setSnowflakes] = useState<{ id: number; left: string; delay: string; duration: string; size: string }[]>([]);

  useEffect(() => {
    const flakes = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 10}s`,
      duration: `${10 + Math.random() * 15}s`,
      size: `${2 + Math.random() * 4}px`
    }));
    setSnowflakes(flakes);
  }, []);

  return (
    <div className="snowfall">
      {snowflakes.map(flake => (
        <div
          key={flake.id}
          className="snowflake"
          style={{
            left: flake.left,
            animationDelay: flake.delay,
            animationDuration: flake.duration,
            width: flake.size,
            height: flake.size,
            background: "white",
            borderRadius: "50%",
            boxShadow: "0 0 10px 2px rgba(255, 255, 255, 0.4)"
          }}
        />
      ))}
    </div>
  );
};

export default function App() {
  const [clientData, setClientData] = useState({
    nombreCliente: "",
    whatsappCliente: "",
    tipoServicio: "Instalación",
    costoManoObra: 0,
  });

  const [currentMaterial, setCurrentMaterial] = useState({
    nombre: "Gas R22",
    cantidad: 1,
    costo: 0,
  });

  const [materialsList, setMaterialsList] = useState<MaterialItem[]>([]);
  const [loading, setLoading] = useState(false);

  const handleClientChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setClientData(prev => ({
      ...prev,
      [name]: name === "costoManoObra" ? Number(value) : value,
    }));
  };

  const handleMaterialChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentMaterial(prev => ({
      ...prev,
      [name]: name === "nombre" ? value : Number(value),
    }));
  };

  const addMaterial = (e: FormEvent) => {
    e.preventDefault();
    if (currentMaterial.costo <= 0) {
      alert("Por favor ingrese un costo válido");
      return;
    }
    const newItem: MaterialItem = {
      ...currentMaterial,
      subtotal: currentMaterial.cantidad * currentMaterial.costo,
    };
    setMaterialsList(prev => [...prev, newItem]);
    // Reset material fields
    setCurrentMaterial({
      nombre: "Gas R22",
      cantidad: 1,
      costo: 0,
    });
  };

  const removeMaterial = (index: number) => {
    setMaterialsList(prev => prev.filter((_, i) => i !== index));
  };

  const totalMaterials = materialsList.reduce((sum, item) => sum + item.subtotal, 0);
  const totalGeneral = totalMaterials + clientData.costoManoObra;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (materialsList.length === 0) {
      alert("Agregue al menos un material antes de realizar la cotización");
      return;
    }
    setLoading(true);

    const payload: QuoteData = {
      ...clientData,
      materiales: materialsList,
      totalGeneral: totalGeneral,
      fecha: new Date().toISOString(),
    };

    try {
      if (WEBHOOK_URL) {
        const response = await fetch(WEBHOOK_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          alert("Cotización enviada exitosamente");
          resetAll();
        } else {
          alert("Error al enviar la cotización");
        }
      } else {
        console.log("Payload que se enviaría:", payload);
        alert("Cotización generada (Webhook no configurado todavía)");
        resetAll();
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error de conexión al enviar la cotización");
    } finally {
      setLoading(false);
    }
  };

  const resetAll = () => {
    setClientData({
      nombreCliente: "",
      whatsappCliente: "",
      tipoServicio: "Instalación",
      costoManoObra: 0,
    });
    setMaterialsList([]);
    setCurrentMaterial({
      nombre: "Gas R22",
      cantidad: 1,
      costo: 0,
    });
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,#1e3a8a_0%,transparent_50%),radial-gradient(circle_at_80%_70%,#1e1b4b_0%,transparent_50%)]"></div>
      
      {/* Snowfall Effect */}
      <Snowfall />

      {/* CSS Mountains */}
      <div className="absolute bottom-0 left-0 w-full h-[30%] mountain-bg opacity-30 pointer-events-none"></div>

      <main className="relative w-full max-w-[420px] bg-[#0f172a]/60 backdrop-blur-3xl border border-blue-400/20 rounded-[2.5rem] p-8 md:p-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.8)] z-10 max-h-[95vh] overflow-y-auto custom-scrollbar">
        <header className="mb-8 space-y-1">
          <h1 className="text-3xl font-black tracking-tighter text-blue-100 uppercase italic">
            REFRIGERACIÓN <span className="text-blue-500 text-2xl">CRUZ</span>
          </h1>
          <p className="text-[10px] text-blue-400 uppercase tracking-[0.25em] font-bold">
            Sistema Profesional de Cotización
          </p>
        </header>

        <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-6">
          {/* Client Data Section */}
          <section className="space-y-4">
            <div className="group space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-blue-300 tracking-widest block">
                Nombre del Cliente
              </label>
              <input
                required
                type="text"
                name="nombreCliente"
                value={clientData.nombreCliente}
                onChange={handleClientChange}
                placeholder="Nombre Completo"
                className="w-full bg-blue-950/40 border border-blue-400/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-all placeholder:text-blue-700 text-blue-100 shadow-inner"
              />
            </div>

            <div className="group space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-blue-300 tracking-widest block">
                WhatsApp del Cliente
              </label>
              <input
                required
                type="tel"
                name="whatsappCliente"
                value={clientData.whatsappCliente}
                onChange={handleClientChange}
                placeholder="Ej: 8090000000"
                className="w-full bg-blue-950/40 border border-blue-400/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-all placeholder:text-blue-700 text-blue-100 shadow-inner"
              />
            </div>

            <div className="group space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-blue-300 tracking-widest block">
                Tipo de Servicio
              </label>
              <select
                name="tipoServicio"
                value={clientData.tipoServicio}
                onChange={handleClientChange}
                className="w-full bg-blue-950/40 border border-blue-400/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-all appearance-none cursor-pointer text-blue-100 shadow-inner"
              >
                <option className="bg-[#020617]" value="Instalación">Instalación</option>
                <option className="bg-[#020617]" value="Mantenimiento Preventivo">Mantenimiento</option>
                <option className="bg-[#020617]" value="Reparación">Reparación</option>
                <option className="bg-[#020617]" value="Evaluación">Evaluación</option>
              </select>
            </div>
          </section>

          {/* Materials Input Section */}
          <section className="space-y-4 p-4 bg-blue-500/5 rounded-2xl border border-blue-500/10">
            <h3 className="text-[10px] uppercase font-bold text-blue-400 tracking-widest">Añadir Materiales</h3>
            
            <div className="group space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-blue-300 tracking-widest block">
                Material
              </label>
              <select
                name="nombre"
                value={currentMaterial.nombre}
                onChange={handleMaterialChange}
                className="w-full bg-blue-950/40 border border-blue-400/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-all appearance-none cursor-pointer text-blue-100 shadow-inner"
              >
                <option className="bg-[#020617]" value="Gas R22">Gas R22</option>
                <option className="bg-[#020617]" value="Tubería de Cobre">Tubería de Cobre</option>
                <option className="bg-[#020617]" value="Soldadura">Soldadura</option>
                <option className="bg-[#020617]" value="Filtros">Filtros</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-blue-300 tracking-widest block">
                  Cantidad
                </label>
                <input
                  type="number"
                  name="cantidad"
                  value={currentMaterial.cantidad}
                  onChange={handleMaterialChange}
                  min="1"
                  className="w-full bg-blue-950/40 border border-blue-400/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 text-blue-100 shadow-inner"
                />
              </div>
              <div className="space-y-1.5 relative">
                <label className="text-[10px] uppercase font-bold text-blue-300 tracking-widest block">
                  Costo (Unit)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="costo"
                    value={currentMaterial.costo}
                    onChange={handleMaterialChange}
                    min="0"
                    className="w-full bg-blue-950/40 border border-blue-400/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 text-blue-100 pr-10 shadow-inner"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-blue-400 font-bold font-mono">DOP</span>
                </div>
              </div>
            </div>

            <button
              onClick={addMaterial}
              className="w-full bg-blue-900/40 border border-blue-500/30 text-blue-200 py-2.5 rounded-xl text-xs uppercase tracking-widest font-bold hover:bg-blue-800/40 transition-all active:scale-[0.98]"
            >
              + Agregar Material
            </button>
          </section>

          {/* Materials List Table */}
          {materialsList.length > 0 && (
            <section className="space-y-3">
              <h3 className="text-[10px] uppercase font-bold text-blue-400 tracking-widest">Lista de Materiales</h3>
              <div className="space-y-2 max-h-[150px] overflow-y-auto pr-2 custom-scrollbar">
                {materialsList.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-blue-950/30 p-3 rounded-lg border border-blue-500/10 group">
                    <div className="flex-1">
                      <p className="text-xs font-bold text-white">{item.nombre}</p>
                      <p className="text-[10px] text-blue-400">Qty: {item.cantidad} x ${item.costo.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-mono font-bold text-blue-200">${item.subtotal.toLocaleString()}</p>
                      <button 
                        onClick={() => removeMaterial(idx)}
                        className="text-[9px] text-red-400 opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-tighter"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Totals Section */}
          <section className="space-y-4 pt-4 border-t border-white/5">
            <div className="group space-y-1.5 relative">
              <label className="text-[10px] uppercase font-bold text-blue-300 tracking-widest block">
                Mano de Obra (DOP)
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="costoManoObra"
                  value={clientData.costoManoObra}
                  onChange={handleClientChange}
                  min="0"
                  className="w-full bg-blue-950/40 border border-blue-400/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 text-blue-100 pr-12 shadow-inner"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-blue-400 font-bold font-mono">DOP</span>
              </div>
            </div>

            <div className="bg-blue-500/10 p-5 rounded-2xl border border-blue-500/20 flex justify-between items-center">
              <p className="text-xs uppercase font-black text-blue-200 tracking-widest">Total General</p>
              <p className="text-2xl font-black text-white font-mono tracking-tighter">
                ${totalGeneral.toLocaleString()} <span className="text-xs text-blue-400 uppercase">DOP</span>
              </p>
            </div>
          </section>

          <button
            disabled={loading}
            onClick={handleSubmit}
            className="w-full bg-blue-500 text-white font-black py-5 rounded-2xl hover:bg-blue-400 transition-all text-sm tracking-widest uppercase disabled:opacity-50 active:scale-[0.98] shadow-[0_0_30px_rgba(59,130,246,0.4)] border border-blue-300/30"
          >
            {loading ? "Generando..." : "Realizar Cotización"}
          </button>
        </form>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(59, 130, 246, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.4);
        }
      `}</style>
    </div>
  );
}


