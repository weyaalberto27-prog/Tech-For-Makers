import React, { useState, useRef } from "react";
import {
  X,
  Upload,
  Camera,
  Sparkles,
  Cpu,
  Layers,
  Box,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Eye,
  RefreshCw,
  Image as ImageIcon,
  Zap,
  Info
} from "lucide-react";
import { useEditor } from "../store";
import { v4 as uuidv4 } from "uuid";
import { ComponentEntity, PcbBoardEntity, PcbComponentEntity, TraceEntity, WireEntity, ComponentType, PcbComponentType } from "../types";
import { pinMap, getPcbComponentPins } from "../lib/pinmap";

interface CircuitPhotoToCADModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CircuitPhotoToCADModal({ isOpen, onClose }: CircuitPhotoToCADModalProps) {
  const { setElements, setPcbElements, setMode, setIs3DView, takeSnapshot } = useEditor();

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [userNotes, setUserNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [resultData, setResultData] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<"upload" | "preview">("upload");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sample circuits for quick testing
  const samplePresets = [
    {
      title: "Circuito LED com Resistor e Botão (9V)",
      desc: "Circuito básico de chaveamento com bateria 9V, resistor limitador e LED indicador.",
      image: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><rect width='400' height='300' fill='%231e293b'/><circle cx='80' cy='150' r='30' fill='%233b82f6'/><text x='65' y='155' fill='white' font-family='sans-serif' font-weight='bold' font-size='12'>9V</text><rect x='160' y='140' width='60' height='20' rx='4' fill='%23f59e0b'/><text x='170' y='155' fill='black' font-family='sans-serif' font-weight='bold' font-size='11'>220Ω</text><circle cx='280' cy='150' r='18' fill='%23ef4444'/><text x='270' y='155' fill='white' font-family='sans-serif' font-weight='bold' font-size='10'>LED</text><rect x='330' y='135' width='30' height='30' rx='6' fill='%2310b981'/><text x='335' y='154' fill='white' font-family='sans-serif' font-weight='bold' font-size='9'>SW1</text><path d='M110 150 L160 150 M220 150 L262 150 M298 150 L330 150 M360 150 L380 150 L380 230 L80 230 L80 180' stroke='%2394a3b8' stroke-width='4' fill='none'/><text x='20' y='40' fill='%2338bdf8' font-family='sans-serif' font-weight='bold' font-size='16'>Circuito Físico de Teste</text></svg>",
      hint: "Foto de protoboard com bateria 9V conectada a um botão de pressão, resistor de 220 ohms e LED vermelho."
    },
    {
      title: "Oscilador Timer 555 (Pisca-Pisca)",
      desc: "Circuito astável clássico com CI 555, resistores de temporização e capacitor de desacoplamento.",
      image: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><rect width='400' height='300' fill='%230f172a'/><rect x='150' y='100' width='100' height='100' rx='6' fill='%231e293b' stroke='%23475569' stroke-width='3'/><text x='170' y='155' fill='%2338bdf8' font-family='sans-serif' font-weight='bold' font-size='16'>NE555</text><circle cx='80' cy='80' r='20' fill='%233b82f6'/><text x='70' y='85' fill='white' font-size='10'>5V</text><rect x='60' y='170' width='40' height='15' fill='%23f59e0b'/><text x='68' y='182' fill='black' font-size='9'>10kΩ</text><circle cx='320' cy='150' r='14' fill='%2310b981'/><text x='312' y='154' fill='white' font-size='9'>LED</text><text x='20' y='40' fill='%2334d399' font-family='sans-serif' font-weight='bold' font-size='16'>Timer 555 em Protoboard</text></svg>",
      hint: "Circuito em CI DIP-8 NE555 oscilador astável com capacitor eletrolítico de 10uF, resistores e LED."
    },
    {
      title: "Arduino com Display OLED & Sensor",
      desc: "Módulo microcontrolador conectado a display I2C e sensor analógico de temperatura/luz.",
      image: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><rect width='400' height='300' fill='%23111827'/><rect x='60' y='80' width='120' height='140' rx='6' fill='%230284c7'/><text x='85' y='155' fill='white' font-family='sans-serif' font-weight='bold' font-size='13'>ARDUINO</text><rect x='240' y='70' width='100' height='70' rx='4' fill='%2318181b' stroke='%2338bdf8' stroke-width='2'/><text x='265' y='110' fill='%2338bdf8' font-family='sans-serif' font-size='11'>OLED 128x64</text><circle cx='290' cy='200' r='16' fill='%23eab308'/><text x='280' y='204' fill='black' font-size='8'>LDR</text><text x='20' y='40' fill='%2360a5fa' font-family='sans-serif' font-weight='bold' font-size='16'>Sistema Microcontrolado</text></svg>",
      hint: "Placa microcontroladora com linhas I2C (SDA/SCL) ligadas a visor OLED e entrada analógica com LDR."
    }
  ];

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectPreset = (preset: typeof samplePresets[0]) => {
    setImagePreview(preset.image);
    setUserNotes(preset.hint);
    setError(null);
  };

  const handleAnalyzeCircuit = async () => {
    if (!imagePreview) {
      setError("Por favor, anexe ou selecione uma imagem de circuito antes de continuar.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setLoadingStep(1);

    const stepInterval = setInterval(() => {
      setLoadingStep((prev) => (prev < 4 ? prev + 1 : prev));
    }, 1800);

    try {
      const response = await fetch("/api/circuit-from-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: imagePreview,
          userNotes: userNotes.trim() || undefined
        }),
      });

      clearInterval(stepInterval);

      if (!response.ok) {
        const errText = await response.text();
        let errMsg = "Erro ao processar imagem do circuito.";
        try {
          const parsed = JSON.parse(errText);
          errMsg = parsed.error || errMsg;
        } catch (e) {}
        throw new Error(errMsg);
      }

      const data = await response.json();
      setResultData(data);
      setActiveTab("preview");
    } catch (err: any) {
      clearInterval(stepInterval);
      console.error("Erro na análise do circuito:", err);
      setError(err.message || "Não foi possível analisar a imagem. Tente novamente.");
    } finally {
      setIsLoading(false);
      setLoadingStep(0);
    }
  };

  const handleApplyToCAD = (destination: "schematic" | "pcb" | "3d") => {
    if (!resultData) return;

    takeSnapshot();

    // 1. Build Schematic Elements
    const schComponents: ComponentEntity[] = (resultData.schematic?.components || []).map((c: any) => ({
      id: c.id || uuidv4(),
      type: "component",
      componentType: c.componentType as ComponentType,
      name: c.name || "Comp",
      value: c.value || "",
      x: Number(c.x) || 200,
      y: Number(c.y) || 200,
      rotation: Number(c.rotation) || 0,
      selected: false
    }));

    const schWires: WireEntity[] = (resultData.schematic?.wires || []).map((w: any) => ({
      id: w.id || uuidv4(),
      type: "wire",
      points: w.points || [],
      color: w.color || "#bcc2c2",
      selected: false
    }));

    // 2. Build PCB Elements
    const pcbBoard: PcbBoardEntity = {
      id: uuidv4(),
      type: "board",
      x: 120,
      y: 120,
      width: Number(resultData.pcb?.board?.width) || 450,
      height: Number(resultData.pcb?.board?.height) || 320,
      boardColor: resultData.pcb?.board?.boardColor || "green",
      selected: false
    };

    const pcbComponents: PcbComponentEntity[] = (resultData.pcb?.components || []).map((pc: any) => ({
      id: pc.id || uuidv4(),
      type: "pcb_component",
      componentType: (pc.componentType || "pad") as PcbComponentType,
      name: pc.name || "Comp",
      value: pc.value || "",
      x: Number(pc.x) || 200,
      y: Number(pc.y) || 200,
      rotation: Number(pc.rotation) || 0,
      layer: (pc.layer as any) || "top",
      selected: false
    }));

    const pcbTraces: TraceEntity[] = (resultData.pcb?.traces || []).map((t: any) => ({
      id: t.id || uuidv4(),
      type: "trace",
      points: t.points || [],
      layer: (t.layer as any) || "top",
      width: Number(t.width) || 4,
      selected: false
    }));

    // Populate both environments so user can view in 2D and 3D seamlessly!
    setElements([...schComponents, ...schWires]);
    setPcbElements([pcbBoard, ...pcbComponents, ...pcbTraces]);

    if (destination === "schematic") {
      setMode("schematic");
      setIs3DView(false);
    } else if (destination === "pcb") {
      setMode("pcb");
      setIs3DView(false);
    } else if (destination === "3d") {
      setMode("pcb");
      setIs3DView(true);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/85 backdrop-blur-md p-3 md:p-6 animate-fadeIn">
      <div className="bg-[#16161a] border border-[#2d2d33] rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 bg-[#1a1a20] border-b border-[#2d2d33] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center">
              <Camera className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">Foto para Circuito CAD (IA Vision)</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 uppercase tracking-wider">
                  2D & 3D
                </span>
              </div>
              <p className="text-xs text-gray-400">
                Anexe uma foto de protoboard, diagrama no papel ou placa real e transforme em Esquemático e PCB (2D & 3D).
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-[#2d2d33] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div className="text-xs text-red-300 leading-relaxed">
                <strong>Atenção:</strong> {error}
              </div>
            </div>
          )}

          {activeTab === "upload" && (
            <div className="space-y-6">
              
              {/* Dropzone & Preview Area */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Upload Zone */}
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  className="border-2 border-dashed border-[#2d2d33] hover:border-cyan-500/50 rounded-2xl p-6 flex flex-col items-center justify-center text-center bg-[#121215] transition cursor-pointer min-h-[220px]"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <div className="w-12 h-12 rounded-full bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-3 border border-cyan-500/20">
                    <Upload className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1">Clique ou Arraste uma Foto</h4>
                  <p className="text-xs text-gray-400 max-w-xs mb-3">
                    Fotografe uma montagem em protoboard, esquema desenhado no papel ou diagrama eletrônico.
                  </p>
                  <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/40 px-3 py-1 rounded-full border border-cyan-800/40">
                    Suporta JPG, PNG, WEBP
                  </span>
                </div>

                {/* Preview Box */}
                <div className="border border-[#2d2d33] rounded-2xl p-4 bg-[#121215] flex flex-col items-center justify-center min-h-[220px] relative overflow-hidden">
                  {imagePreview ? (
                    <div className="w-full h-full flex flex-col items-center justify-center relative group">
                      <img
                        src={imagePreview}
                        alt="Circuito selecionado"
                        className="max-h-[200px] w-auto object-contain rounded-lg shadow-md border border-[#2d2d33]"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setImagePreview(null);
                        }}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 hover:bg-red-600 text-white transition"
                        title="Remover Imagem"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="text-center text-gray-500">
                      <ImageIcon className="w-10 h-10 mx-auto mb-2 opacity-30" />
                      <p className="text-xs">Nenhuma foto selecionada ainda</p>
                    </div>
                  )}
                </div>

              </div>

              {/* Sample Presets Gallery */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-400" /> Ou Escolha um Circuito de Teste Rápido
                  </h4>
                  <span className="text-[11px] text-gray-500">Clique para carregar</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {samplePresets.map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectPreset(preset)}
                      className="bg-[#121215] hover:bg-[#1a1a22] border border-[#2d2d33] hover:border-cyan-500/40 rounded-xl p-3 text-left transition group flex flex-col justify-between"
                    >
                      <div>
                        <div className="text-xs font-bold text-white group-hover:text-cyan-400 transition mb-1">
                          {preset.title}
                        </div>
                        <p className="text-[11px] text-gray-400 leading-snug line-clamp-2">
                          {preset.desc}
                        </p>
                      </div>
                      <span className="text-[10px] text-cyan-400 font-semibold mt-3 flex items-center gap-1">
                        Usar este exemplo <ArrowRight className="w-3 h-3" />
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Extra instructions / notes */}
              <div className="bg-[#121215] border border-[#2d2d33] rounded-xl p-4">
                <label className="block text-xs font-bold text-gray-300 mb-2 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-cyan-400" /> Observações Opcionais / Detalhes do Circuito
                </label>
                <input
                  type="text"
                  placeholder="Ex: 'O circuito usa bateria 9V', 'O CI é um regulador 7805', 'Resistor de 1k'..."
                  value={userNotes}
                  onChange={(e) => setUserNotes(e.target.value)}
                  className="w-full bg-[#16161a] border border-[#2d2d33] rounded-lg px-3 py-2 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

            </div>
          )}

          {/* Result Inspection Tab */}
          {activeTab === "preview" && resultData && (
            <div className="space-y-6">
              
              {/* Project Summary Banner */}
              <div className="bg-gradient-to-r from-cyan-500/15 via-blue-500/15 to-transparent border border-cyan-500/30 p-5 rounded-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-base font-bold text-white">{resultData.projectName || "Circuito Identificado com Sucesso"}</h3>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed mb-4">
                  {resultData.description}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="bg-[#121215]/80 p-2.5 rounded-xl border border-[#2d2d33]">
                    <span className="text-[10px] text-gray-400 uppercase font-semibold block">Componentes</span>
                    <strong className="text-sm text-cyan-400 font-mono">
                      {resultData.schematic?.components?.length || 0}
                    </strong>
                  </div>
                  <div className="bg-[#121215]/80 p-2.5 rounded-xl border border-[#2d2d33]">
                    <span className="text-[10px] text-gray-400 uppercase font-semibold block">Ligações / Fios</span>
                    <strong className="text-sm text-blue-400 font-mono">
                      {resultData.schematic?.wires?.length || 0}
                    </strong>
                  </div>
                  <div className="bg-[#121215]/80 p-2.5 rounded-xl border border-[#2d2d33]">
                    <span className="text-[10px] text-gray-400 uppercase font-semibold block">Trilhas de PCB</span>
                    <strong className="text-sm text-purple-400 font-mono">
                      {resultData.pcb?.traces?.length || 0}
                    </strong>
                  </div>
                  <div className="bg-[#121215]/80 p-2.5 rounded-xl border border-[#2d2d33]">
                    <span className="text-[10px] text-gray-400 uppercase font-semibold block">Tamanho da Placa</span>
                    <strong className="text-sm text-emerald-400 font-mono">
                      {resultData.pcb?.board?.width}x{resultData.pcb?.board?.height}mm
                    </strong>
                  </div>
                </div>
              </div>

              {/* Detected Components List */}
              <div>
                <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-cyan-400" /> Componentes Mapeados pela Visão IA
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-48 overflow-y-auto custom-scrollbar p-1">
                  {(resultData.detectedPartsSummary || []).map((part: any, i: number) => (
                    <div key={i} className="bg-[#121215] border border-[#2d2d33] p-3 rounded-xl flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-white">{part.name} ({part.value || "Padrão"})</div>
                        <div className="text-[10px] text-gray-400">{part.type}</div>
                      </div>
                      <span className="text-[10px] text-cyan-400 font-mono bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/30">
                        {part.function || "Conectado"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* Loading Animation Overlay */}
          {isLoading && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-cyan-500/20 border-t-cyan-500 animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-cyan-400 animate-pulse" />
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-bold text-white mb-1">Analisando Imagem com Gemini 3.8 Flash Vision</h4>
                <p className="text-xs text-cyan-400 font-medium">
                  {loadingStep === 1 && "1. Detectando componentes eletrônicos e semicondutores..."}
                  {loadingStep === 2 && "2. Identificando valores nominais, polaridades e pinos..."}
                  {loadingStep === 3 && "3. Traçando malha elétrica e nós de interconexão..."}
                  {loadingStep >= 4 && "4. Sintetizando esquemático 2D, layout PCB e modelos 3D..."}
                </p>
              </div>

              <div className="w-64 bg-[#2d2d33] h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full transition-all duration-700"
                  style={{ width: `${Math.min(loadingStep * 25, 95)}%` }}
                ></div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer / Actions */}
        <div className="px-6 py-4 bg-[#1a1a20] border-t border-[#2d2d33] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          {activeTab === "upload" ? (
            <>
              <div className="text-xs text-gray-400">
                Gera instantaneamente o circuito no <strong>Esquemático</strong>, <strong>PCB 2D</strong> e <strong>3D</strong>.
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={onClose}
                  className="flex-1 sm:flex-none px-4 py-2 bg-[#2d2d33] hover:bg-[#3d3d45] text-gray-300 rounded-xl text-xs font-bold transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAnalyzeCircuit}
                  disabled={!imagePreview || isLoading}
                  className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition shadow-lg ${
                    imagePreview && !isLoading
                      ? "bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-cyan-500/20"
                      : "bg-[#2d2d33] text-gray-500 cursor-not-allowed"
                  }`}
                >
                  <Sparkles className="w-4 h-4" /> Analisar e Converter com IA
                </button>
              </div>
            </>
          ) : (
            <>
              <button
                onClick={() => setActiveTab("upload")}
                className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Escolher Outra Foto
              </button>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => handleApplyToCAD("schematic")}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-[#2d2d33] hover:bg-[#3d3d45] text-cyan-300 rounded-xl text-xs font-bold transition border border-cyan-500/30"
                >
                  <Layers className="w-3.5 h-3.5" /> Ver no Esquemático
                </button>
                <button
                  onClick={() => handleApplyToCAD("pcb")}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-[#2d2d33] hover:bg-[#3d3d45] text-emerald-300 rounded-xl text-xs font-bold transition border border-emerald-500/30"
                >
                  <Cpu className="w-3.5 h-3.5" /> Ver no PCB
                </button>
                <button
                  onClick={() => handleApplyToCAD("3d")}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-cyan-500/20"
                >
                  <Box className="w-4 h-4" /> Abrir na Vista 3D
                </button>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
