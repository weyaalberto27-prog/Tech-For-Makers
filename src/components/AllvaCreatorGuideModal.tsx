import React, { useState } from "react";
import {
  X,
  BookOpen,
  Box,
  Compass,
  Sparkles,
  Layers,
  Sliders,
  DollarSign,
  Cloud,
  Keyboard,
  Check,
  Copy,
  Search,
  ExternalLink,
  ChevronRight,
  Maximize2,
  Wand2,
  Cpu,
  Shield,
  Lightbulb,
  FileText
} from "lucide-react";

interface AllvaCreatorGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AllvaCreatorGuideModal({ isOpen, onClose }: AllvaCreatorGuideModalProps) {
  const [activeSection, setActiveSection] = useState<string>("intro");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedPromptIndex, setCopiedPromptIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const copyPrompt = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedPromptIndex(index);
    setTimeout(() => setCopiedPromptIndex(null), 2500);
  };

  const sections = [
    { id: "intro", label: "Visão Geral", icon: BookOpen },
    { id: "navigation", label: "Câmera & Viewport", icon: Compass },
    { id: "gizmo", label: "Gizmo 3D & Transformações", icon: Sliders },
    { id: "catalog", label: "Catálogo de Geometrias", icon: Box },
    { id: "materials", label: "Materiais & Acabamentos", icon: Layers },
    { id: "ai_architect", label: "Allva AI (Arquiteto 3D)", icon: Wand2 },
    { id: "enclosure", label: "Modo Invólucro (Enclosure)", icon: Cpu },
    { id: "wiring", label: "Fiação 3D de Cobre", icon: Sparkles },
    { id: "bom", label: "BOM & Manufatura (CSV)", icon: DollarSign },
    { id: "cloud", label: "Nuvem & Projetos", icon: Cloud },
    { id: "shortcuts", label: "Atalhos & Dicas Pro", icon: Keyboard },
  ];

  const samplePrompts = [
    {
      title: "Drone Quadricóptero de Vigilância",
      desc: "Chassi aerodinâmico em fibra de carbono fosca com 4 rotores, suportes cilíndricos, trem de pouso curvo e câmera frontal motorizada.",
      prompt: "Crie um drone quadricóptero profissional completo com chassi central aerodinâmico em cinza escuro fosco (#222222), 4 braços simétricos, 4 motores com hélices pretas, trem de pouso em arco curvo, módulo de câmera frontal com lente espelhada e leds de navegação verdes e vermelhos nos braços."
    },
    {
      title: "Gabinete Industrial para IoT & Estação Meteorológica",
      desc: "Caixa estanque IP67 com aletas laterais de ventilação, display OLED frontal integrado, conectores de antena e parafusos metálicos.",
      prompt: "Desenhe um gabinete industrial robusto para sensor IoT com tampa frontal rebaixada, visor para tela oled, 4 parafusos cromados nas pontas (metalness 0.9), aletas de dissipação nas laterais, prensa-cabos inferior para passagem de cabos e acabamento em polímero industrial azul escuro (#1e293b)."
    },
    {
      title: "Óculos Inteligentes com Head-up Display (HUD)",
      desc: "Armação moderna de titânio leve com hastes articuladas, prismas óticos frontais, microcâmera discreta e conector magnético.",
      prompt: "Projete uma armação de óculos inteligentes em titânio fosco (#334155), com hastes ergonômicas, suporte nasal duplo, microcâmera embutida na ponta direita, prisma óptico translúcido na lente e acabamento metálico refinado."
    },
    {
      title: "Braço Robótico Articulado de 3 Eixos com Garra",
      desc: "Base cilíndrica giratória pesada, juntas mecânicas com rolamentos expostos, cilindros de pistão e atuador terminal tipo pinça.",
      prompt: "Construa um braço robótico industrial de 3 graus de liberdade com base redonda pesada em aço escovado, 2 segmentos de braço articulados por cilindros e rolamentos (#94a3b8 com metalness 0.8), servomotores nas juntas e uma garra mecânica com 2 dedos chanfrados na extremidade."
    },
    {
      title: "Console de Videogame Retrô Portátil",
      desc: "Corpo ergonômico estilo anos 90 com D-pad em cruz, 4 botões de ação coloridos, tela panorâmica e grelhas de alto-falante.",
      prompt: "Crie um console portátil ergonômico em plástico branco fosco (#f1f5f9), com ecrã LCD central preto brilhante, direcional cruzado D-Pad na esquerda, quatro botões esféricos coloridos (vermelho, azul, verde, amarelo) na direita, botões de ombro chanfrados e orifícios de saída de som cilíndricos."
    }
  ];

  const filteredSections = sections.filter(s => 
    searchQuery === "" || 
    s.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/85 backdrop-blur-md p-2 md:p-6 animate-fadeIn">
      <div className="bg-[#121215] border border-[#2d2d33] rounded-2xl w-full max-w-5xl h-[92vh] flex flex-col shadow-[0_20px_70px_rgba(0,0,0,0.8)] overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#16161a] border-b border-[#2d2d33] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500/20 to-blue-500/20 border border-teal-500/30 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">Manual Profissional do Allvacreator</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/30 uppercase tracking-wider">
                  Guia Oficial
                </span>
              </div>
              <p className="text-xs text-gray-400">
                Design estrutural 3D, engenharia de produto, modelagem geométrica e arquitetura tridimensional com IA.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-[#2d2d33] transition"
              title="Fechar Guia"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Sidebar Navigation */}
          <div className="w-full md:w-64 bg-[#16161a] border-r border-[#2d2d33] flex flex-col shrink-0">
            {/* Search Box */}
            <div className="p-3 border-b border-[#2d2d33]">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar no manual..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#0f0f13] border border-[#2d2d33] rounded-lg pl-8 pr-3 py-1.5 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-teal-500 transition-colors"
                />
              </div>
            </div>

            {/* Menu Items */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
              {filteredSections.map((sec) => {
                const IconComponent = sec.icon;
                const isSelected = activeSection === sec.id;
                return (
                  <button
                    key={sec.id}
                    onClick={() => setActiveSection(sec.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      isSelected
                        ? "bg-gradient-to-r from-teal-600/20 to-blue-600/20 text-teal-300 border border-teal-500/30 shadow-sm"
                        : "text-gray-400 hover:text-gray-200 hover:bg-[#1e1e24]"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <IconComponent className={`w-4 h-4 ${isSelected ? "text-teal-400" : "text-gray-500"}`} />
                      <span>{sec.label}</span>
                    </div>
                    {isSelected && <ChevronRight className="w-3.5 h-3.5 text-teal-400" />}
                  </button>
                );
              })}
            </div>

            {/* Quick Helper Badge */}
            <div className="p-3 border-t border-[#2d2d33] bg-[#0f0f13]/60">
              <div className="flex items-center gap-2 text-[11px] text-gray-400">
                <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Dica: Use <strong>Allva AI</strong> para gerar modelos 3D a partir de frases naturais.</span>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#121215] text-gray-300 custom-scrollbar">
            
            {/* 1. VISÃO GERAL */}
            {activeSection === "intro" && (
              <div className="space-y-6 max-w-3xl">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-teal-400" /> O que é o AllvaCreator?
                  </h3>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    O <strong>AllvaCreator</strong> é o estúdio de engenharia tridimensional do AllvaTronics.
                    Ele foi concebido para fechar a lacuna entre a eletrônica (esquemáticos e placas PCB) e a 
                    <strong> mecânica real de produtos acabados</strong>.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-[#16161a] border border-[#2d2d33] p-4 rounded-xl">
                    <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center font-bold mb-3 border border-teal-500/20">
                      1
                    </div>
                    <h4 className="text-sm font-semibold text-white mb-1">Design Físico Completo</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      Modele carcaças, caixas de sensores, drones, robôs, engrenagens e botões com precisão milimétrica.
                    </p>
                  </div>

                  <div className="bg-[#16161a] border border-[#2d2d33] p-4 rounded-xl">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold mb-3 border border-blue-500/20">
                      2
                    </div>
                    <h4 className="text-sm font-semibold text-white mb-1">Arquiteto Inteligente (IA)</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      Descreva seu produto e o motor inteligente cria dezenas de formas geométricas perfeitamente alinhadas com textura e acabamento metálico.
                    </p>
                  </div>

                  <div className="bg-[#16161a] border border-[#2d2d33] p-4 rounded-xl">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold mb-3 border border-purple-500/20">
                      3
                    </div>
                    <h4 className="text-sm font-semibold text-white mb-1">Pronto para Fabricação</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      Gere a Lista de Peças (BOM) com cálculo automático de custos, dimensões e exportação em CSV para impressão 3D ou usinagem.
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-teal-500/10 via-blue-500/10 to-transparent p-5 rounded-2xl border border-teal-500/30">
                  <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-teal-400" /> Fluxo de Trabalho Recomendado
                  </h4>
                  <ol className="text-xs text-gray-300 space-y-2 list-decimal list-inside">
                    <li><strong className="text-white">Escolha as Formas Básicas:</strong> Arraste cubos, cilindros, prismas ou rolamentos do catálogo lateral para o espaço 3D.</li>
                    <li><strong className="text-white">Ajuste no Espaço:</strong> Use o Gizmo tridimensional para transladar (mover), rotacionar e escalonar as peças.</li>
                    <li><strong className="text-white">Defina os Materiais:</strong> Regule o brilho metálico (metalness) e a aspereza da superfície (roughness).</li>
                    <li><strong className="text-white">Interligue com Fiação 3D:</strong> Conecte componentes com cabos de cobre para simular a passagem de cabos reais.</li>
                    <li><strong className="text-white">Salve na Nuvem:</strong> Guarde no Firebase Cloud para continuar editando de qualquer dispositivo.</li>
                  </ol>
                </div>
              </div>
            )}

            {/* 2. CÂMERA & VIEWPORT */}
            {activeSection === "navigation" && (
              <div className="space-y-6 max-w-3xl">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                    <Compass className="w-5 h-5 text-teal-400" /> Navegação de Câmera & Viewport Three.js
                  </h3>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    O viewport do AllvaCreator utiliza renderização WebGL acelerada por hardware via Three.js.
                    Dominar a navegação é fundamental para inspecionar peças de todos os ângulos.
                  </p>
                </div>

                <div className="bg-[#16161a] border border-[#2d2d33] rounded-xl overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-[#1e1e24] text-gray-300 font-semibold border-b border-[#2d2d33]">
                      <tr>
                        <th className="p-3">Ação</th>
                        <th className="p-3">Controle no Mouse</th>
                        <th className="p-3">Controle no Touch / Celular</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2d2d33]">
                      <tr>
                        <td className="p-3 font-semibold text-teal-400">Orbitar / Girar Cena</td>
                        <td className="p-3">Clique com o Botão Esquerdo e arraste</td>
                        <td className="p-3">Arrastar com 1 dedo</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-blue-400">Pan / Deslocar Posição</td>
                        <td className="p-3">Clique com o Botão Direito (ou Scroll) e arraste</td>
                        <td className="p-3">Arrastar com 2 dedos em simultâneo</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-purple-400">Zoom / Aproximar</td>
                        <td className="p-3">Girar a roda do mouse (Scroll)</td>
                        <td className="p-3">Gesto de pinça (Pinch-to-zoom)</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-amber-400">Rotação Automática</td>
                        <td className="p-3" colSpan={2}>Marque a caixa <strong>"Rotação Autom."</strong> na barra superior para rotação 360° em estúdio</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-emerald-400">Eixos de Coordenadas</td>
                        <td className="p-3" colSpan={2}>Marque <strong>"Exibir Eixos"</strong> para ver X (Vermelho), Y (Verde) e Z (Azul) no centro da cena</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="bg-[#16161a] border border-[#2d2d33] p-4 rounded-xl flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div className="text-xs text-gray-300 leading-relaxed">
                    <strong>Iluminação de Estúdio & Sombras:</strong> O ambiente do AllvaCreator conta com
                    iluminação direta pontual, luz ambiente difusa e sombras de contato suaves (Contact Shadows).
                    Ao posicionar objetos próximos à grade (Y = 0), eles projetarão sombras realistas no piso.
                  </div>
                </div>
              </div>
            )}

            {/* 3. GIZMO 3D & TRANSFORMAÇÕES */}
            {activeSection === "gizmo" && (
              <div className="space-y-6 max-w-3xl">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-teal-400" /> Gizmo de Transformação & Medidas
                  </h3>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    Ao selecionar qualquer peça na cena, um <strong>Gizmo de Manipulação 3D</strong> é ativado sobre ela.
                    O AllvaCreator disponibiliza 3 modos de manipulação:
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-[#16161a] border border-[#2d2d33] p-4 rounded-xl">
                    <div className="text-teal-400 font-bold text-sm mb-1 flex items-center gap-1.5">
                      <span>Mover (Translação)</span>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed mb-3">
                      Arraste as setas vermelha (X), verde (Y) e azul (Z) para mover a peça com precisão milimétrica no espaço.
                    </p>
                    <span className="text-[10px] bg-[#2d2d33] text-gray-300 px-2 py-0.5 rounded font-mono">Modo Translate</span>
                  </div>

                  <div className="bg-[#16161a] border border-[#2d2d33] p-4 rounded-xl">
                    <div className="text-blue-400 font-bold text-sm mb-1 flex items-center gap-1.5">
                      <span>Girar (Rotação)</span>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed mb-3">
                      Arraste os anéis circulares nos 3 eixos para rotacionar com precisão de graus e radianos.
                    </p>
                    <span className="text-[10px] bg-[#2d2d33] text-gray-300 px-2 py-0.5 rounded font-mono">Modo Rotate</span>
                  </div>

                  <div className="bg-[#16161a] border border-[#2d2d33] p-4 rounded-xl">
                    <div className="text-purple-400 font-bold text-sm mb-1 flex items-center gap-1.5">
                      <span>Escalar (Dimensões)</span>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed mb-3">
                      Altere largura, altura e profundidade puxando os cubinhos na extremidade do Gizmo.
                    </p>
                    <span className="text-[10px] bg-[#2d2d33] text-gray-300 px-2 py-0.5 rounded font-mono">Modo Scale</span>
                  </div>
                </div>

                <div className="bg-[#16161a] border border-[#2d2d33] p-4 rounded-xl space-y-3">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Painel Lateral de Inspeção</h4>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    Você também pode digitar os valores numéricos diretamente nos campos de texto no painel direito:
                  </p>
                  <ul className="text-xs text-gray-400 space-y-1.5 list-disc list-inside">
                    <li><strong className="text-gray-200">Posição [X, Y, Z]:</strong> Coordenadas absolutas no mundo 3D.</li>
                    <li><strong className="text-gray-200">Rotação [X, Y, Z]:</strong> Rotação expressa em graus ou radianos.</li>
                    <li><strong className="text-gray-200">Escala [L, A, P]:</strong> Dimensões físicas do objeto em milímetros/unidades.</li>
                    <li><strong className="text-gray-200">Mostrar Cotas / Medidas:</strong> Ative a opção para ver as cotas flutuantes exibindo o tamanho exato da peça em tempo real.</li>
                  </ul>
                </div>
              </div>
            )}

            {/* 4. CATÁLOGO DE GEOMETRIAS */}
            {activeSection === "catalog" && (
              <div className="space-y-6 max-w-3xl">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                    <Box className="w-5 h-5 text-teal-400" /> Catálogo de Formas & Peças Integradas
                  </h3>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    O AllvaCreator disponibiliza mais de 25 geometrias 3D fundamentais e peças eletromecânicas 
                    já calibradas para design de produtos.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { name: "Cubo / Paralelepípedo", type: "box", desc: "Chassis, placas, caixas e painéis planos." },
                    { name: "Cilindro", type: "cylinder", desc: "Pinos, eixos, colunas, parafusos e buchas." },
                    { name: "Esfera", type: "sphere", desc: "Lentes, pontas esféricas, botões e joysticks." },
                    { name: "Cone & Pirâmide", type: "cone", desc: "Bicos injetores, pontas de sensores e funis." },
                    { name: "Toroide / Anel", type: "torus", desc: "O-rings, juntas de vedação e tubulações circulares." },
                    { name: "Cápsula", type: "capsule", desc: "Pegas anatômicas, carcaças de pílula e acabamentos lisos." },
                    { name: "Prisma & Poliedros", type: "prism", desc: "Faceteamento de gabinetes e apoios angulares." },
                    { name: "Linha Curva (Tubo)", type: "curved_line", desc: "Tubos flexíveis, hastes de fones e cabos." },
                    { name: "Rolamento Mecânico", type: "bearing", desc: "Rolamentos de esferas com pista interna e externa." },
                    { name: "Microcontroladores", type: "mcu", desc: "Modelos 3D precisos de Arduino, ESP32, STM32 e Raspberry Pi." },
                    { name: "Displays & OLED", type: "display", desc: "Visores com telas ativas e buffer visual integrado." },
                    { name: "Motores & Servos", type: "actuator", desc: "Motores DC, Servomotores SG90 e Motores de Passo NEMA." },
                  ].map((item, idx) => (
                    <div key={idx} className="bg-[#16161a] border border-[#2d2d33] p-3 rounded-xl hover:border-teal-500/40 transition">
                      <div className="text-xs font-bold text-white mb-1">{item.name}</div>
                      <div className="text-[11px] text-gray-400 leading-snug">{item.desc}</div>
                    </div>
                  ))}
                </div>

                <div className="bg-[#16161a] border border-[#2d2d33] p-4 rounded-xl">
                  <h4 className="text-xs font-bold text-teal-400 mb-2 uppercase tracking-wider">SubShapes: Montagem de Peças Complexas</h4>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    Você pode criar componentes do tipo <strong>custom</strong> contendo um array de <code>subShapes</code>. 
                    Isso permite combinar dezenas de formas primitivas (cubos, cilindros, esferas) num único componente sólido, 
                    como carcaças de fones de ouvido, drones e ferramentas ergonômicas.
                  </p>
                </div>
              </div>
            )}

            {/* 5. MATERIAIS & ACABAMENTOS */}
            {activeSection === "materials" && (
              <div className="space-y-6 max-w-3xl">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-teal-400" /> Materiais Físicos (PBR), Cores & Acabamentos
                  </h3>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    O AllvaCreator implementa sombreamento baseado em física (Physically Based Rendering - PBR)
                    através de materiais padrão e físicos do Three.js. Isso garante que reflexos e iluminação 
                    se comportem exatamente como no mundo real.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[#16161a] border border-[#2d2d33] p-4 rounded-xl">
                    <h4 className="text-sm font-bold text-teal-400 mb-2">Metalness (Propriedade Metálica)</h4>
                    <p className="text-xs text-gray-400 mb-3 leading-relaxed">
                      Determina se a superfície é dielétrica (plástico, borracha, madeira) ou condutora (metal puro, cromo, ouro, aço).
                    </p>
                    <ul className="text-xs space-y-1 text-gray-300">
                      <li>• <strong>0.0:</strong> Plástico, Acrílico, Borracha, Silicone</li>
                      <li>• <strong>0.5:</strong> Metal pintado ou alumínio anodizado fosco</li>
                      <li>• <strong>0.8 - 1.0:</strong> Aço inoxidável, cromo, cobre, ouro ou prata polida</li>
                    </ul>
                  </div>

                  <div className="bg-[#16161a] border border-[#2d2d33] p-4 rounded-xl">
                    <h4 className="text-sm font-bold text-blue-400 mb-2">Roughness (Rugosidade da Superfície)</h4>
                    <p className="text-xs text-gray-400 mb-3 leading-relaxed">
                      Controla o quão fosca ou reflexiva é a superfície de um material.
                    </p>
                    <ul className="text-xs space-y-1 text-gray-300">
                      <li>• <strong>0.0 - 0.2:</strong> Superfície espelhada, vidro, laca automotiva de alto brilho</li>
                      <li>• <strong>0.4 - 0.6:</strong> Plástico injetado acetinado, alumínio escovado</li>
                      <li>• <strong>0.8 - 1.0:</strong> Borracha mate, cerâmica rústica, concreto, ferro fundido</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-[#16161a] border border-[#2d2d33] p-4 rounded-xl">
                  <h4 className="text-xs font-bold text-purple-400 mb-2 uppercase tracking-wider">Paleta de Cores Hexadecimal</h4>
                  <p className="text-xs text-gray-300 leading-relaxed mb-3">
                    Cada peça possui o atributo <code>hexColor</code>. Você pode escolher qualquer tonalidade da roda de cores
                    ou usar os valores industriais recomendados:
                  </p>
                  <div className="flex flex-wrap gap-2 text-[11px] font-mono">
                    <span className="px-2.5 py-1 rounded bg-[#222222] text-white border border-[#444]">#222222 Preto Fosco</span>
                    <span className="px-2.5 py-1 rounded bg-[#94a3b8] text-black">#94a3b8 Alumínio</span>
                    <span className="px-2.5 py-1 rounded bg-[#e2e8f0] text-black">#e2e8f0 Aço Inox</span>
                    <span className="px-2.5 py-1 rounded bg-[#0284c7] text-white">#0284c7 Azul Anodizado</span>
                    <span className="px-2.5 py-1 rounded bg-[#10b981] text-black">#10b981 Verde PCB</span>
                    <span className="px-2.5 py-1 rounded bg-[#b45309] text-white">#b45309 Cobre Puro</span>
                  </div>
                </div>
              </div>
            )}

            {/* 6. ALLVA AI (3D ARCHITECT) */}
            {activeSection === "ai_architect" && (
              <div className="space-y-6 max-w-3xl">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                    <Wand2 className="w-5 h-5 text-teal-400" /> Allva AI: O Arquiteto 3D com Inteligência Artificial
                  </h3>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    O <strong>Allva AI</strong> é um modelo de ponta treinado para converter linguagem natural 
                    em montagens tridimensionais complexas compostas por dezenas de formas geométricas coordenadas.
                  </p>
                </div>

                <div className="bg-gradient-to-r from-teal-500/15 to-blue-500/15 border border-teal-500/30 p-5 rounded-xl">
                  <h4 className="text-sm font-bold text-white mb-2">Como Pedir Modelos 3D Realistas</h4>
                  <p className="text-xs text-gray-300 leading-relaxed mb-3">
                    Ao pedir uma criação no chat do Allva AI ou no campo de criação rápida, especifique:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-300">
                    <div className="bg-[#121215] p-2.5 rounded-lg border border-[#2d2d33]">
                      <strong>1. O objeto e sua função:</strong> Ex: <em>"Gabinete portátil para console de jogos"</em>
                    </div>
                    <div className="bg-[#121215] p-2.5 rounded-lg border border-[#2d2d33]">
                      <strong>2. Os acabamentos:</strong> Ex: <em>"Corpo em plástico fosco preto e botões cromados"</em>
                    </div>
                    <div className="bg-[#121215] p-2.5 rounded-lg border border-[#2d2d33]">
                      <strong>3. Detalhes específicos:</strong> Ex: <em>"Visor frontal, 4 pés de borracha e botões"</em>
                    </div>
                    <div className="bg-[#121215] p-2.5 rounded-lg border border-[#2d2d33]">
                      <strong>4. Proporções:</strong> Ex: <em>"Formato compacto, cantos chanfrados e simetria"</em>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Exemplos Prontos de Prompts (Clique para Copiar)</h4>
                  <div className="space-y-3">
                    {samplePrompts.map((item, idx) => (
                      <div key={idx} className="bg-[#16161a] border border-[#2d2d33] p-4 rounded-xl flex flex-col justify-between gap-3 group hover:border-teal-500/40 transition">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <h5 className="text-sm font-bold text-white">{item.title}</h5>
                            <button
                              onClick={() => copyPrompt(item.prompt, idx)}
                              className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-bold transition ${
                                copiedPromptIndex === idx
                                  ? "bg-green-600 text-white"
                                  : "bg-[#2d2d33] text-gray-300 hover:bg-teal-600 hover:text-white"
                              }`}
                            >
                              {copiedPromptIndex === idx ? (
                                <>
                                  <Check className="w-3 h-3" /> Copiado!
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" /> Copiar Prompt
                                </>
                              )}
                            </button>
                          </div>
                          <p className="text-xs text-gray-400 mb-2">{item.desc}</p>
                          <div className="bg-[#0f0f13] p-2.5 rounded-lg border border-[#2d2d33] text-[11px] font-mono text-teal-300 select-all">
                            "{item.prompt}"
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 7. ENCLOSURE & RENDER */}
            {activeSection === "enclosure" && (
              <div className="space-y-6 max-w-3xl">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-teal-400" /> Modo Invólucro (Enclosure) & Render Fotorrealista
                  </h3>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    O <strong>Modo Invólucro</strong> gera automaticamente caixas de proteção sob medida 
                    que abrigam todas as placas de circuito e componentes presentes no seu projeto.
                  </p>
                </div>

                <div className="bg-[#16161a] border border-[#2d2d33] p-5 rounded-xl space-y-4">
                  <h4 className="text-sm font-bold text-white">Como Funciona o Gerador de Caixas:</h4>
                  <ol className="text-xs text-gray-300 space-y-3 list-decimal list-inside">
                    <li>
                      <strong className="text-white">Cálculo de Envoltória (Bounding Box):</strong> O sistema calcula 
                      as dimensões exatas ocupadas pelas peças para que a carcaça tenha folga de montagem e ventilação adequada.
                    </li>
                    <li>
                      <strong className="text-white">Design Paramétrico do Invólucro:</strong> A IA propõe cores, 
                      materiais industriais (como acrílico fumê, alumínio anodizado escuro ou ABS reforçado) e espessura de parede.
                    </li>
                    <li>
                      <strong className="text-white">Geração de Imagem Fotorrealista (Nano Banana 2 / Gemini Image):</strong> 
                      Além da caixa 3D translúcida no viewport, o AllvaCreator gera uma fotografia em alta definição do 
                      produto montado pronto para lançamento comercial.
                    </li>
                  </ol>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-xl">
                  <div className="flex items-center gap-2 text-blue-300 text-xs font-bold mb-1">
                    <Lightbulb className="w-4 h-4 text-blue-400" /> Dica de Exportação
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    Você pode alternar entre a visualização da peça 3D aberta (para montagem interna) e o modo invólucro 
                    clicando em <strong>"PRODUTO ACABADO"</strong> na barra superior.
                  </p>
                </div>
              </div>
            )}

            {/* 8. FIAÇÃO 3D */}
            {activeSection === "wiring" && (
              <div className="space-y-6 max-w-3xl">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-teal-400" /> Fiação 3D de Cobre & Ligações Físicas
                  </h3>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    No AllvaCreator, as ligações elétricas não são simples linhas abstratas: são tubos tridimensionais
                    com curvatura realista que simulam chicotes de cabos e fios de cobre flexíveis.
                  </p>
                </div>

                <div className="bg-[#16161a] border border-[#2d2d33] p-5 rounded-xl space-y-3">
                  <h4 className="text-sm font-bold text-white">Como Interligar Componentes em 3D:</h4>
                  <ul className="text-xs text-gray-300 space-y-2 list-disc list-inside">
                    <li>Selecione o primeiro componente e clique em <strong>"Adicionar Ligação de Fio"</strong>.</li>
                    <li>Selecione o segundo componente de destino para traçar o cabo entre os dois terminais.</li>
                    <li>O AllvaCreator calculará a curva Catmull-Rom para dar caimento e gravidade natural ao cabo.</li>
                    <li>As extremidades dos fios incluem conectores DuPont e espaguete termo-retrátil modelados em 3D.</li>
                  </ul>
                </div>
              </div>
            )}

            {/* 9. BOM & MANUFATURA */}
            {activeSection === "bom" && (
              <div className="space-y-6 max-w-3xl">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-teal-400" /> Lista de Peças (BOM) & Exportação para Manufatura
                  </h3>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    A Lista de Materiais (Bill of Materials - BOM) é indispensável para orçamento, compra de componentes 
                    e planejamento de produção.
                  </p>
                </div>

                <div className="bg-[#16161a] border border-[#2d2d33] p-5 rounded-xl space-y-3">
                  <h4 className="text-sm font-bold text-white">Recursos do Gerenciador de Materiais:</h4>
                  <ul className="text-xs text-gray-300 space-y-2 list-disc list-inside">
                    <li><strong className="text-white">Cálculo Automático de Custo:</strong> Cada peça inserida na cena computa seu valor unitário no custo total do projeto.</li>
                    <li><strong className="text-white">Separação por Categoria:</strong> Visualize rapidamente a contagem de peças Elétricas vs Mecânicas.</li>
                    <li><strong className="text-white">Exportação CSV:</strong> Clique no botão <strong>"Exportar BOM (CSV)"</strong> no painel de materiais para baixar uma planilha pronta para Excel ou Google Sheets contendo ID, Nome, Categoria e Custo.</li>
                  </ul>
                </div>
              </div>
            )}

            {/* 10. PROJETOS NA NUVEM */}
            {activeSection === "cloud" && (
              <div className="space-y-6 max-w-3xl">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                    <Cloud className="w-5 h-5 text-teal-400" /> Armazenamento na Nuvem (Firebase Cloud Firestore)
                  </h3>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    Todos os seus designs 3D do AllvaCreator podem ser salvos com segurança na nuvem, 
                    permitindo que você retome seu trabalho em qualquer computador ou tablet.
                  </p>
                </div>

                <div className="bg-[#16161a] border border-[#2d2d33] p-5 rounded-xl space-y-3">
                  <h4 className="text-sm font-bold text-white">Como Usar o Sistema de Nuvem:</h4>
                  <ul className="text-xs text-gray-300 space-y-2 list-disc list-inside">
                    <li><strong className="text-white">Salvar Projeto (Nuvem):</strong> Clique em <strong>"Salvar Projeto (Nuvem)"</strong> na barra superior. O projeto é sincronizado instantaneamente.</li>
                    <li><strong className="text-white">Abrir Projetos:</strong> Clique em <strong>"Abrir Projetos"</strong> para listar todas as suas criações salvas, inspecionar a quantidade de peças e carregá-las com 1 clique.</li>
                    <li><strong className="text-white">Excluir Projetos:</strong> Passe o mouse sobre um projeto na janela de projetos e clique no ícone de lixeira para removê-lo.</li>
                  </ul>
                </div>
              </div>
            )}

            {/* 11. ATALHOS & DICAS PRO */}
            {activeSection === "shortcuts" && (
              <div className="space-y-6 max-w-3xl">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                    <Keyboard className="w-5 h-5 text-teal-400" /> Atalhos de Teclado & Dicas de Ouro
                  </h3>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    Acelere sua produtividade utilizando os atalhos integrados do AllvaCreator.
                  </p>
                </div>

                <div className="bg-[#16161a] border border-[#2d2d33] rounded-xl overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-[#1e1e24] text-gray-300 font-semibold border-b border-[#2d2d33]">
                      <tr>
                        <th className="p-3">Tecla / Atalho</th>
                        <th className="p-3">Função</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2d2d33]">
                      <tr>
                        <td className="p-3 font-mono font-bold text-teal-400">R</td>
                        <td className="p-3">Rotacionar o componente selecionado em 90 graus</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-mono font-bold text-blue-400">Delete / Backspace</td>
                        <td className="p-3">Excluir a peça selecionada da cena</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-mono font-bold text-purple-400">Ctrl + Z</td>
                        <td className="p-3">Desfazer a última ação de movimentação ou alteração</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-mono font-bold text-amber-400">Esc</td>
                        <td className="p-3">Desmarcar a peça selecionada e fechar painéis modais</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-mono font-bold text-emerald-400">Clique Duplo</td>
                        <td className="p-3">Focar a câmera no objeto selecionado</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="bg-[#16161a] border border-[#2d2d33] p-4 rounded-xl">
                  <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">Dica de Engenheiro:</h4>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    Ao criar conjuntos mecânicos complexos, monte primeiro as peças maiores que servem de chassi estrutural
                    (como a base ou gabinete) e depois adicione e alinhe os botões, displays e conectores nas posições de interface.
                  </p>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-[#16161a] border-t border-[#2d2d33] flex items-center justify-between shrink-0">
          <div className="text-xs text-gray-400">
            Allvacreator Studio v2.4 • Guia Profissional de Engenharia 3D
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-500 hover:to-blue-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-teal-500/20"
          >
            Entendido, Começar a Criar
          </button>
        </div>

      </div>
    </div>
  );
}
