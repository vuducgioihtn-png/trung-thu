import React, { useState } from 'react';
import { 
  Sun, 
  Moon, 
  Info, 
  Ruler, 
  Sparkles, 
  Layers, 
  Maximize2, 
  CheckCircle2, 
  Compass, 
  Lightbulb,
  Tag,
  AlertTriangle
} from 'lucide-react';
import { LOTUS_HOTSPOTS } from '../../data/lotusModelData';
import { LotusHotspot } from '../../types/lotusModel';

export const LotusModelVisualizer: React.FC = () => {
  const [isNight, setIsNight] = useState<boolean>(true);
  const [selectedHotspot, setSelectedHotspot] = useState<LotusHotspot | null>(LOTUS_HOTSPOTS[0]);
  const [showHotspots, setShowHotspots] = useState<boolean>(true);
  const [showDimensions, setShowDimensions] = useState<boolean>(false);
  const [activeLayer, setActiveLayer] = useState<'all' | 'gate' | 'tent' | 'interior'>('all');

  return (
    <div className="space-y-6">
      {/* Control Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-slate-700 mr-1 flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-emerald-600" />
            Chế độ quan sát:
          </span>

          {/* Day / Night Toggle */}
          <button
            onClick={() => setIsNight(!isNight)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              isNight
                ? 'bg-indigo-900 text-amber-300 shadow-xs border border-indigo-700'
                : 'bg-amber-100 text-amber-800 border border-amber-300'
            }`}
          >
            {isNight ? (
              <>
                <Moon className="w-3.5 h-3.5 fill-amber-300" />
                <span>Ban Đêm (Bật Đèn LED & Sen Hồng)</span>
              </>
            ) : (
              <>
                <Sun className="w-3.5 h-3.5 fill-amber-500" />
                <span>Ban Ngày (Mặt Trời Chiếu Sáng)</span>
              </>
            )}
          </button>

          {/* Toggle Hotspots */}
          <button
            onClick={() => setShowHotspots(!showHotspots)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              showHotspots
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Điểm Chú Thích ({LOTUS_HOTSPOTS.length})</span>
          </button>

          {/* Toggle Dimensions */}
          <button
            onClick={() => setShowDimensions(!showDimensions)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              showDimensions
                ? 'bg-sky-50 text-sky-700 border border-sky-300'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Ruler className="w-3.5 h-3.5" />
            <span>Thước Đo Kích Thước</span>
          </button>
        </div>

        {/* Layer Filter */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-medium">
          <span className="text-[10px] text-slate-500 px-2 font-bold uppercase">Lớp hiển thị:</span>
          <button
            onClick={() => setActiveLayer('all')}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
              activeLayer === 'all' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Toàn Cảnh
          </button>
          <button
            onClick={() => setActiveLayer('gate')}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
              activeLayer === 'gate' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Cổng Tam Quan
          </button>
          <button
            onClick={() => setActiveLayer('tent')}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
              activeLayer === 'tent' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Lều Chữ A
          </button>
          <button
            onClick={() => setActiveLayer('interior')}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
              activeLayer === 'interior' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Nội Thất & Nghi Lễ
          </button>
        </div>
      </div>

      {/* Main Visualizer Stage + Detail Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Interactive Graphic Canvas */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col">
          {/* Canvas Viewport */}
          <div 
            className={`relative w-full aspect-[4/3] sm:aspect-[1/1] max-h-[640px] transition-colors duration-700 select-none overflow-hidden ${
              isNight ? 'bg-slate-950' : 'bg-gradient-to-b from-sky-200 via-sky-100 to-emerald-100'
            }`}
          >
            {/* Background Atmosphere */}
            {isNight ? (
              <>
                {/* Night Sky & Stars */}
                <div className="absolute inset-0 opacity-60 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />
                <div className="absolute top-8 right-12 w-16 h-16 rounded-full bg-amber-100/90 shadow-[0_0_50px_rgba(251,191,36,0.5)] flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-amber-200/80 blur-xs" />
                </div>
              </>
            ) : (
              <>
                {/* Sun & Clouds */}
                <div className="absolute top-8 right-12 w-20 h-20 rounded-full bg-amber-400/90 shadow-[0_0_60px_rgba(251,191,36,0.6)]" />
                <div className="absolute top-16 left-12 w-32 h-10 bg-white/70 rounded-full blur-xs" />
              </>
            )}

            {/* Ground / Grass Field */}
            <div 
              className={`absolute bottom-0 inset-x-0 h-[28%] transition-colors duration-500 ${
                isNight ? 'bg-[#122416]' : 'bg-[#406830]'
              }`}
            >
              {/* Ground texture lines */}
              <div className="w-full h-full opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
            </div>

            {/* Central Walkway */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[28%] h-[26%] bg-gradient-to-t from-stone-400 via-stone-300 to-stone-200 border-x-2 border-stone-500/40 shadow-inner flex flex-col justify-between overflow-hidden">
              <div className="w-full h-full opacity-35 bg-[repeating-linear-gradient(45deg,#000_0,#000_2px,transparent_0,transparent_16px)]" />
            </div>

            {/* ================================================================= */}
            {/* SVG RENDERING OF THE ENTIRE LOTUS GATE & TENT STRUCTURE */}
            {/* ================================================================= */}
            <svg 
              viewBox="0 0 800 800" 
              className="absolute inset-0 w-full h-full"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                {/* Gradients */}
                <linearGradient id="woodPillar" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#5c2612" />
                  <stop offset="50%" stopColor="#873e23" />
                  <stop offset="100%" stopColor="#4a1e0d" />
                </linearGradient>

                <linearGradient id="goldCarve" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ffd700" />
                  <stop offset="100%" stopColor="#b8860b" />
                </linearGradient>

                <linearGradient id="lotusGlow" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ff99bb" />
                  <stop offset="70%" stopColor="#ff3366" />
                  <stop offset="100%" stopColor="#cc0044" />
                </linearGradient>

                <linearGradient id="tentCanvas" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={isNight ? "#172b1c" : "#2f4d36"} />
                  <stop offset="100%" stopColor={isNight ? "#0f1c13" : "#223827"} />
                </linearGradient>

                {/* Filter Glows */}
                <filter id="nightGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur in="SourceGraphic" stdDeviation={isNight ? "4" : "1"} />
                  <feMerge>
                    <feMergeNode />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="superGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation={isNight ? "8" : "2"} result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* ------------------------------------------------------------- */}
              {/* 1. TENT STRUCTURE (BEHIND THE GATE)                           */}
              {/* ------------------------------------------------------------- */}
              {(activeLayer === 'all' || activeLayer === 'tent' || activeLayer === 'interior') && (
                <g id="tent-group">
                  {/* Guy Ropes Left & Right */}
                  <line x1="280" y1="360" x2="60" y2="580" stroke="#f8fafc" strokeWidth="2.5" strokeDasharray="6,2" />
                  <line x1="280" y1="410" x2="110" y2="580" stroke="#f8fafc" strokeWidth="2" />
                  <line x1="520" y1="360" x2="740" y2="580" stroke="#f8fafc" strokeWidth="2.5" strokeDasharray="6,2" />
                  <line x1="520" y1="410" x2="690" y2="580" stroke="#f8fafc" strokeWidth="2" />

                  {/* Ground Stakes */}
                  <rect x="50" y="575" width="16" height="25" fill="#475569" rx="2" transform="rotate(25 50 575)" />
                  <rect x="100" y="575" width="16" height="25" fill="#475569" rx="2" transform="rotate(25 100 575)" />
                  <rect x="740" y="575" width="16" height="25" fill="#475569" rx="2" transform="rotate(-25 740 575)" />
                  <rect x="690" y="575" width="16" height="25" fill="#475569" rx="2" transform="rotate(-25 690 575)" />

                  {/* Main A-frame Tent Canvas */}
                  <polygon points="400,280 270,580 530,580" fill="url(#tentCanvas)" stroke="#1a2e1d" strokeWidth="3" />
                  {/* Tent Peak Ridge Line */}
                  <line x1="400" y1="280" x2="400" y2="580" stroke="#162719" strokeWidth="2" strokeDasharray="4,2" />

                  {/* Tent Interior (Illuminated Chamber) */}
                  <polygon points="400,320 300,580 500,580" fill={isNight ? "#241d0e" : "#e2d9c0"} opacity={isNight ? 0.95 : 0.85} />

                  {/* Festoon Light Strings From Tent Peak */}
                  {isNight && (
                    <g id="festoon-lights" filter="url(#nightGlow)">
                      <path d="M 400,280 Q 280,330 180,380" fill="none" stroke="#fef08a" strokeWidth="1" strokeDasharray="2,14" />
                      <path d="M 400,280 Q 520,330 620,380" fill="none" stroke="#fef08a" strokeWidth="1" strokeDasharray="2,14" />
                      {/* Little bulbs along string */}
                      {[
                        [350, 305, '#fde047'], [300, 335, '#f43f5e'], [240, 360, '#38bdf8'],
                        [450, 305, '#34d399'], [500, 335, '#fde047'], [560, 360, '#fb923c']
                      ].map(([bx, by, col], bi) => (
                        <circle key={bi} cx={bx} cy={by} r="4" fill={col as string} />
                      ))}
                    </g>
                  )}

                  {/* Bamboo Elevated Floor */}
                  <rect x="290" y="575" width="220" height="15" fill="#d97706" stroke="#92400e" strokeWidth="1.5" rx="2" />
                  <line x1="290" y1="582" x2="510" y2="582" stroke="#78350f" strokeWidth="1" strokeDasharray="8,4" />

                  {/* ----------------------------------------------------------- */}
                  {/* TENT INTERIOR: ALTAR, HO CHI MINH, FRUIT TRAY, RIGHT DESK   */}
                  {/* ----------------------------------------------------------- */}
                  {(activeLayer === 'all' || activeLayer === 'interior') && (
                    <g id="tent-interior">
                      {/* 1. National Flag at Top Center */}
                      <rect x="355" y="325" width="90" height="60" fill="#dc2626" rx="2" stroke="#991b1b" strokeWidth="1.5" />
                      {/* Yellow Star */}
                      <polygon points="400,340 405,355 420,355 408,364 412,378 400,369 388,378 392,364 380,355 395,355" fill="#facc15" />

                      {/* 2. Portrait of Uncle Ho */}
                      <rect x="375" y="390" width="50" height="65" fill="#fef3c7" stroke="#78350f" strokeWidth="2" rx="2" />
                      <circle cx="400" cy="415" r="14" fill="#d97706" opacity="0.3" />
                      {/* Abstract Bust of Uncle Ho */}
                      <circle cx="400" cy="412" r="10" fill="#fed7aa" />
                      <path d="M 390,432 Q 400,422 410,432" fill="#fff" />
                      <text x="400" y="450" textAnchor="middle" fontSize="6" fontWeight="bold" fill="#78350f">CHỦ TỊCH HỒ CHÍ MINH</text>

                      {/* 3. Five Teachings Plaque (5 Điều Bác Hồ Dạy) */}
                      <rect x="350" y="460" width="100" height="62" fill="#fef08a" stroke="#b45309" strokeWidth="1.5" rx="2" />
                      <rect x="353" y="463" width="94" height="15" fill="#b91c1c" rx="1" />
                      <text x="400" y="474" textAnchor="middle" fontSize="7" fontWeight="bold" fill="#fff">5 ĐIỀU BÁC HỒ DẠY</text>
                      {[
                        "1. Yêu Tổ quốc, yêu đồng bào",
                        "2. Học tập tốt, lao động tốt",
                        "3. Đoàn kết tốt, kỷ luật tốt",
                        "4. Giữ gìn vệ sinh thật tốt",
                        "5. Khiêm tốn, thật thà, dũng cảm"
                      ].map((txt, ti) => (
                        <text key={ti} x="355" y={488 + ti * 7} fontSize="4.5" fill="#78350f" fontWeight="500">{txt}</text>
                      ))}

                      {/* 4. Carved Wooden Altar Table (Sập gỗ chân quỳ) */}
                      <rect x="330" y="550" width="140" height="28" fill="#5c2612" stroke="#3b1708" strokeWidth="2" rx="3" />
                      <rect x="335" y="554" width="130" height="6" fill="#873e23" />

                      {/* 5. Mid-Autumn Fruit Tray (Mâm Ngũ Quả Khổng Lồ) */}
                      {/* Green Banana Base */}
                      <ellipse cx="400" cy="542" rx="38" ry="10" fill="#4d7c0f" stroke="#365314" strokeWidth="1" />
                      {/* Golden Pomelo with Red Ribbon */}
                      <circle cx="400" cy="528" r="14" fill="#eab308" stroke="#ca8a04" strokeWidth="1" />
                      {/* Red Dragonfruit & Oranges around */}
                      <circle cx="382" cy="535" r="8" fill="#e11d48" />
                      <circle cx="418" cy="535" r="8" fill="#f97316" />
                      <circle cx="392" cy="544" r="6" fill="#f43f5e" />
                      <circle cx="408" cy="544" r="6" fill="#84cc16" />

                      {/* 6. Flower Vases on Left & Right of Altar */}
                      <rect x="322" y="525" width="16" height="26" fill="#e0e7ff" stroke="#4f46e5" strokeWidth="1" rx="3" />
                      <circle cx="330" cy="515" r="12" fill="#ec4899" opacity="0.85" />
                      <circle cx="330" cy="510" r="8" fill="#f472b6" />

                      <rect x="462" y="525" width="16" height="26" fill="#e0e7ff" stroke="#4f46e5" strokeWidth="1" rx="3" />
                      <circle cx="470" cy="515" r="12" fill="#f59e0b" opacity="0.85" />
                      <circle cx="470" cy="510" r="8" fill="#fbbf24" />

                      {/* --------------------------------------------------------- */}
                      {/* RIGHT SIDE: STUDY CORNER (BẮT BUỘC BÊN PHẢI)              */}
                      {/* --------------------------------------------------------- */}
                      <g id="study-corner-right">
                        {/* Student Desk */}
                        <rect x="480" y="560" width="75" height="22" fill="#854d0e" stroke="#583107" strokeWidth="1.5" rx="1" />
                        <line x1="485" y1="582" x2="485" y2="600" stroke="#583107" strokeWidth="3" />
                        <line x1="550" y1="582" x2="550" y2="600" stroke="#583107" strokeWidth="3" />

                        {/* Stack of Books */}
                        <rect x="488" y="546" width="22" height="6" fill="#0284c7" rx="1" />
                        <rect x="489" y="540" width="20" height="6" fill="#ea580c" rx="1" />
                        <rect x="490" y="534" width="18" height="6" fill="#16a34a" rx="1" />

                        {/* Pen Cup with Rulers & Pens */}
                        <rect x="515" y="546" width="8" height="14" fill="#e2e8f0" stroke="#64748b" strokeWidth="1" rx="1" />
                        <line x1="517" y1="540" x2="519" y2="546" stroke="#ef4444" strokeWidth="1.5" />
                        <line x1="520" y1="538" x2="520" y2="546" stroke="#3b82f6" strokeWidth="1.5" />
                        <line x1="522" y1="537" x2="521" y2="546" stroke="#eab308" strokeWidth="2" />

                        {/* Black Study Desk Lamp with Spotlight Glow */}
                        <circle cx="538" cy="560" r="4" fill="#0f172a" />
                        <path d="M 538,560 Q 546,545 536,535" fill="none" stroke="#0f172a" strokeWidth="2.5" />
                        <path d="M 536,535 L 526,542" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" />
                        {/* Light Cone Glow on Desk */}
                        {isNight && (
                          <polygon points="526,542 490,562 555,562" fill="#fef08a" opacity="0.45" filter="url(#nightGlow)" />
                        )}

                        {/* School Year Banner Panel (Nền trắng viền đỏ) */}
                        <rect x="480" y="475" width="75" height="50" fill="#ffffff" stroke="#dc2626" strokeWidth="2" rx="2" />
                        <text x="517" y="488" textAnchor="middle" fontSize="4.2" fontWeight="bold" fill="#dc2626">CHỦ ĐỀ NĂM HỌC 2026-2027</text>
                        <text x="517" y="498" textAnchor="middle" fontSize="4.8" fontWeight="bold" fill="#0f172a">THIẾU NHI NINH BÌNH</text>
                        <text x="517" y="508" textAnchor="middle" fontSize="4.5" fontWeight="bold" fill="#0f172a">VỮNG BƯỚC TIẾN VÀO</text>
                        <text x="517" y="518" textAnchor="middle" fontSize="5" fontWeight="bold" fill="#b91c1c">KỶ NGUYÊN MỚI</text>
                      </g>

                      {/* --------------------------------------------------------- */}
                      {/* LEFT SIDE: PIONEER CORNER (BẮT BUỘC BÊN TRÁI)             */}
                      {/* --------------------------------------------------------- */}
                      <g id="pioneer-corner-left">
                        {/* Red Pioneer Flag */}
                        <rect x="175" y="470" width="55" height="38" fill="#dc2626" stroke="#991b1b" strokeWidth="1.5" rx="1" />
                        {/* Búp măng non / Young Sprout emblem */}
                        <circle cx="202" cy="489" r="10" fill="#facc15" />
                        <path d="M 202,482 Q 198,489 202,496 Q 206,489 202,482" fill="#15803d" />

                        {/* Multi-colored Triangle Flags Stand */}
                        <line x1="165" y1="580" x2="165" y2="520" stroke="#94a3b8" strokeWidth="2" />
                        <polygon points="165,520 178,527 165,534" fill="#eab308" />
                        <polygon points="165,536 178,543 165,550" fill="#3b82f6" />
                        <polygon points="165,552 178,559 165,566" fill="#ef4444" />

                        {/* Pioneer Drum (Trống Đội) on Stand */}
                        <ellipse cx="205" cy="565" rx="18" ry="7" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1.5" />
                        <rect x="187" y="565" width="36" height="20" fill="#e2e8f0" stroke="#64748b" strokeWidth="1.5" />
                        <ellipse cx="205" cy="585" rx="18" ry="7" fill="#cbd5e1" stroke="#64748b" strokeWidth="1.5" />
                        {/* Drum Stand Tripod */}
                        <line x1="205" y1="585" x2="192" y2="610" stroke="#334155" strokeWidth="2" />
                        <line x1="205" y1="585" x2="205" y2="612" stroke="#334155" strokeWidth="2" />
                        <line x1="205" y1="585" x2="218" y2="610" stroke="#334155" strokeWidth="2" />

                        {/* Wall Newspaper Board (Báo Thiếu Nhi) */}
                        <rect x="185" y="525" width="45" height="28" fill="#fef08a" stroke="#ca8a04" strokeWidth="1" rx="1" />
                        <text x="207" y="535" textAnchor="middle" fontSize="4.5" fontWeight="bold" fill="#b91c1c">KHĂN QUÀNG ĐỎ</text>
                        <rect x="190" y="538" width="16" height="12" fill="#bae6fd" />
                        <rect x="210" y="538" width="16" height="12" fill="#fbcfe8" />
                      </g>
                    </g>
                  )}
                </g>
              )}

              {/* ------------------------------------------------------------- */}
              {/* 2. GRAND LOTUS ENTRANCE GATE (CỔNG TAM QUAN HOA SEN)         */}
              {/* ------------------------------------------------------------- */}
              {(activeLayer === 'all' || activeLayer === 'gate') && (
                <g id="gate-structure">
                  {/* Gate Warm LED Outline Glow when Night */}
                  {isNight && (
                    <g filter="url(#superGlow)" opacity="0.8">
                      {/* Main Arch Glow */}
                      <path d="M 230,220 L 570,220 L 570,260 L 230,260 Z" fill="none" stroke="#fbbf24" strokeWidth="5" />
                      <path d="M 230,300 L 570,300" stroke="#fbbf24" strokeWidth="3" />
                      {/* Left and Right Arches */}
                      <path d="M 120,380 Q 230,340 230,420" fill="none" stroke="#fbbf24" strokeWidth="3" />
                      <path d="M 680,380 Q 570,340 570,420" fill="none" stroke="#fbbf24" strokeWidth="3" />
                    </g>
                  )}

                  {/* 4 MAIN WOODEN SQUARE PILLARS (4 TRỤ HỘP KÉP) */}
                  {/* Outer Left Pillar (Trụ 1) */}
                  <rect x="95" y="320" width="36" height="390" fill="url(#woodPillar)" stroke="#3b1708" strokeWidth="2" rx="2" />
                  <rect x="87" y="685" width="52" height="30" fill="#4a1e0d" stroke="#2c0e05" strokeWidth="2" rx="3" />
                  {/* Inner Left Pillar (Trụ 2) */}
                  <rect x="235" y="170" width="46" height="540" fill="url(#woodPillar)" stroke="#3b1708" strokeWidth="2" rx="2" />
                  <rect x="225" y="685" width="66" height="30" fill="#4a1e0d" stroke="#2c0e05" strokeWidth="2" rx="3" />
                  {/* Inner Right Pillar (Trụ 3) */}
                  <rect x="519" y="170" width="46" height="540" fill="url(#woodPillar)" stroke="#3b1708" strokeWidth="2" rx="2" />
                  <rect x="509" y="685" width="66" height="30" fill="#4a1e0d" stroke="#2c0e05" strokeWidth="2" rx="3" />
                  {/* Outer Right Pillar (Trụ 4) */}
                  <rect x="669" y="320" width="36" height="390" fill="url(#woodPillar)" stroke="#3b1708" strokeWidth="2" rx="2" />
                  <rect x="661" y="685" width="52" height="30" fill="#4a1e0d" stroke="#2c0e05" strokeWidth="2" rx="3" />

                  {/* Golden Filigree Engravings on Pillars */}
                  <rect x="103" y="350" width="20" height="280" fill="none" stroke="#ca8a04" strokeWidth="1.5" strokeDasharray="16,8" />
                  <rect x="247" y="270" width="22" height="380" fill="none" stroke="#ca8a04" strokeWidth="1.5" strokeDasharray="20,10" />
                  <rect x="531" y="270" width="22" height="380" fill="none" stroke="#ca8a04" strokeWidth="1.5" strokeDasharray="20,10" />
                  <rect x="677" y="350" width="20" height="280" fill="none" stroke="#ca8a04" strokeWidth="1.5" strokeDasharray="16,8" />

                  {/* MAIN BEAMS (XÀ NGANG ĐÔI TRUNG TÂM) */}
                  <rect x="220" y="225" width="360" height="22" fill="url(#woodPillar)" stroke="#2c0e05" strokeWidth="2" rx="2" />
                  <rect x="200" y="295" width="400" height="24" fill="url(#woodPillar)" stroke="#2c0e05" strokeWidth="2" rx="2" />

                  {/* Traditional Curved Roof Eaves (Mái Cong Đầu Đao Đình Chùa) */}
                  <path 
                    d="M 170,225 Q 400,210 630,225 L 610,210 Q 400,195 190,210 Z" 
                    fill="#78350f" 
                    stroke="#451a03" 
                    strokeWidth="2" 
                  />
                  {/* Eave Finials Upcurled (Đầu đao cong vút) */}
                  <path d="M 170,225 Q 160,200 185,185" fill="none" stroke="#ca8a04" strokeWidth="4" strokeLinecap="round" />
                  <path d="M 630,225 Q 640,200 615,185" fill="none" stroke="#ca8a04" strokeWidth="4" strokeLinecap="round" />

                  {/* Left Side Curved Roof Eave */}
                  <path d="M 50,345 Q 165,330 250,345 L 240,335 Q 165,320 65,335 Z" fill="#78350f" stroke="#451a03" strokeWidth="2" />
                  <path d="M 50,345 Q 40,320 65,310" fill="none" stroke="#ca8a04" strokeWidth="3.5" strokeLinecap="round" />

                  {/* Right Side Curved Roof Eave */}
                  <path d="M 550,345 Q 635,330 750,345 L 735,335 Q 635,320 560,335 Z" fill="#78350f" stroke="#451a03" strokeWidth="2" />
                  <path d="M 750,345 Q 760,320 735,310" fill="none" stroke="#ca8a04" strokeWidth="3.5" strokeLinecap="round" />

                  {/* Side Arched Doors (Vòm Cửa Lách Hai Bên) */}
                  <path 
                    d="M 131,685 L 131,450 Q 185,380 235,450 L 235,685" 
                    fill="none" 
                    stroke="#78350f" 
                    strokeWidth="8" 
                  />
                  <path 
                    d="M 565,685 L 565,450 Q 615,380 669,450 L 669,685" 
                    fill="none" 
                    stroke="#78350f" 
                    strokeWidth="8" 
                  />
                  {/* Decorative Spandrels on Arches */}
                  <path d="M 131,430 L 155,430 L 131,454 Z" fill="#ca8a04" />
                  <path d="M 235,430 L 211,430 L 235,454 Z" fill="#ca8a04" />
                  <path d="M 565,430 L 589,430 L 565,454 Z" fill="#ca8a04" />
                  <path d="M 669,430 L 645,430 L 669,454 Z" fill="#ca8a04" />

                  {/* ----------------------------------------------------------- */}
                  {/* MAIN CAMP TITLE SIGN (BIỂN TRẠI GỖ GỤ VIỀN CHỈ VÀNG)       */}
                  {/* ----------------------------------------------------------- */}
                  <g id="main-gate-sign">
                    <rect x="280" y="240" width="240" height="62" fill="#3b1708" stroke="#ca8a04" strokeWidth="3" rx="12" />
                    <rect x="286" y="245" width="228" height="52" fill="#582410" stroke="#facc15" strokeWidth="1" rx="8" />
                    {/* Golden Corners */}
                    <circle cx="292" cy="251" r="3" fill="#facc15" />
                    <circle cx="508" cy="251" r="3" fill="#facc15" />
                    <circle cx="292" cy="291" r="3" fill="#facc15" />
                    <circle cx="508" cy="291" r="3" fill="#facc15" />
                    {/* Text on Sign */}
                    <text x="400" y="265" textAnchor="middle" fontSize="11" fontWeight="800" fill="#fef08a" letterSpacing="0.5">
                      TRẠI THU NĂM 2026 - XÃ HẢI ANH
                    </text>
                    <text x="400" y="284" textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#ffffff" letterSpacing="0.5">
                      CHỦ ĐỀ: LỒNG ĐÈN THẮP SÁNG ƯỚC MƠ
                    </text>
                  </g>

                  {/* ----------------------------------------------------------- */}
                  {/* 6 GLOWING PINK LOTUS FLOWER LANTERNS                        */}
                  {/* ----------------------------------------------------------- */}
                  {/* 1. Lotus on Pillar 2 (Center Left) */}
                  <g transform="translate(258, 140)" filter="url(#superGlow)">
                    {/* Petals */}
                    <path d="M 0,0 C -25,-15 -25,-45 0,-40 C 25,-45 25,-15 0,0" fill="url(#lotusGlow)" stroke="#ffe4e6" strokeWidth="1.5" />
                    <path d="M 0,0 C -15,-10 -15,-35 0,-30 C 15,-35 15,-10 0,0" fill="#fda4af" />
                    <circle cx="0" cy="-18" r="6" fill="#fef08a" />
                  </g>
                  {/* 2. Lotus on Pillar 3 (Center Right) */}
                  <g transform="translate(542, 140)" filter="url(#superGlow)">
                    <path d="M 0,0 C -25,-15 -25,-45 0,-40 C 25,-45 25,-15 0,0" fill="url(#lotusGlow)" stroke="#ffe4e6" strokeWidth="1.5" />
                    <path d="M 0,0 C -15,-10 -15,-35 0,-30 C 15,-35 15,-10 0,0" fill="#fda4af" />
                    <circle cx="0" cy="-18" r="6" fill="#fef08a" />
                  </g>
                  {/* 3. Lotus on Pillar 1 (Outer Left) */}
                  <g transform="translate(113, 295)" filter="url(#superGlow)">
                    <path d="M 0,0 C -20,-10 -20,-38 0,-32 C 20,-38 20,-10 0,0" fill="url(#lotusGlow)" stroke="#ffe4e6" strokeWidth="1.5" />
                    <circle cx="0" cy="-14" r="5" fill="#fef08a" />
                  </g>
                  {/* 4. Lotus on Pillar 4 (Outer Right) */}
                  <g transform="translate(687, 295)" filter="url(#superGlow)">
                    <path d="M 0,0 C -20,-10 -20,-38 0,-32 C 20,-38 20,-10 0,0" fill="url(#lotusGlow)" stroke="#ffe4e6" strokeWidth="1.5" />
                    <circle cx="0" cy="-14" r="5" fill="#fef08a" />
                  </g>
                  {/* 5. Lotus on Left Arch Roof */}
                  <g transform="translate(175, 325)" filter="url(#nightGlow)">
                    <path d="M 0,0 C -16,-8 -16,-28 0,-24 C 16,-28 16,-8 0,0" fill="url(#lotusGlow)" stroke="#ffe4e6" strokeWidth="1" />
                    <circle cx="0" cy="-10" r="4" fill="#fef08a" />
                  </g>
                  {/* 6. Lotus on Right Arch Roof */}
                  <g transform="translate(625, 325)" filter="url(#nightGlow)">
                    <path d="M 0,0 C -16,-8 -16,-28 0,-24 C 16,-28 16,-8 0,0" fill="url(#lotusGlow)" stroke="#ffe4e6" strokeWidth="1" />
                    <circle cx="0" cy="-10" r="4" fill="#fef08a" />
                  </g>

                  {/* ----------------------------------------------------------- */}
                  {/* 2 RED CARP FISH LANTERNS (CÁ CHÉP ĐỎ HAI BÊN VÁCH MÁI)      */}
                  {/* ----------------------------------------------------------- */}
                  {/* Left Carp Fish */}
                  <g transform="translate(165, 235)" filter="url(#nightGlow)">
                    {/* Fish Body */}
                    <path d="M 0,0 Q -25,-12 -45,0 Q -30,22 0,0" fill="#dc2626" stroke="#fef08a" strokeWidth="1.5" />
                    {/* Tail */}
                    <path d="M -45,0 L -60,-15 L -52,0 L -62,14 Z" fill="#ef4444" stroke="#fef08a" strokeWidth="1" />
                    {/* Fins */}
                    <path d="M -15,-6 Q -20,-20 -28,-8 Z" fill="#f97316" />
                    <path d="M -20,8 Q -24,20 -32,10 Z" fill="#f97316" />
                    {/* Fish Eye */}
                    <circle cx="-6" cy="-2" r="3" fill="#ffffff" />
                    <circle cx="-5" cy="-2" r="1.5" fill="#000000" />
                    {/* Golden Scales */}
                    <path d="M -18,-2 Q -12,2 -18,6" fill="none" stroke="#fef08a" strokeWidth="1" />
                    <path d="M -28,-3 Q -22,2 -28,7" fill="none" stroke="#fef08a" strokeWidth="1" />
                  </g>

                  {/* Right Carp Fish */}
                  <g transform="translate(635, 235) scale(-1, 1)" filter="url(#nightGlow)">
                    <path d="M 0,0 Q -25,-12 -45,0 Q -30,22 0,0" fill="#dc2626" stroke="#fef08a" strokeWidth="1.5" />
                    <path d="M -45,0 L -60,-15 L -52,0 L -62,14 Z" fill="#ef4444" stroke="#fef08a" strokeWidth="1" />
                    <path d="M -15,-6 Q -20,-20 -28,-8 Z" fill="#f97316" />
                    <path d="M -20,8 Q -24,20 -32,10 Z" fill="#f97316" />
                    <circle cx="-6" cy="-2" r="3" fill="#ffffff" />
                    <circle cx="-5" cy="-2" r="1.5" fill="#000000" />
                    <path d="M -18,-2 Q -12,2 -18,6" fill="none" stroke="#fef08a" strokeWidth="1" />
                    <path d="M -28,-3 Q -22,2 -28,7" fill="none" stroke="#fef08a" strokeWidth="1" />
                  </g>

                  {/* ----------------------------------------------------------- */}
                  {/* CENTRAL STAR LANTERN & ROW OF FESTIVE LANTERNS              */}
                  {/* ----------------------------------------------------------- */}
                  {/* Central 5-Pointed Star Lantern */}
                  <g transform="translate(400, 195)" filter="url(#superGlow)">
                    <circle cx="0" cy="0" r="22" fill="#ef4444" opacity="0.4" />
                    <polygon points="0,-22 6,-6 22,-6 9,4 14,20 0,9 -14,20 -9,4 -22,-6 -6,-6" fill="#facc15" stroke="#dc2626" strokeWidth="1.5" />
                    <circle cx="0" cy="0" r="7" fill="#b91c1c" />
                    <circle cx="0" cy="0" r="4" fill="#fef08a" />
                  </g>

                  {/* Colorful Round Lanterns hanging on Upper Beam */}
                  {[
                    [275, 195, '#ef4444'], // Red
                    [315, 195, '#fbbf24'], // Yellow
                    [355, 195, '#ec4899'], // Pink
                    [445, 195, '#f43f5e'], // Coral
                    [485, 195, '#2dd4bf'], // Turquoise
                    [525, 195, '#fb923c'], // Orange
                  ].map(([lx, ly, col], lidx) => (
                    <g key={lidx} transform={`translate(${lx}, ${ly})`} filter={isNight ? "url(#nightGlow)" : undefined}>
                      <line x1="0" y1="-10" x2="0" y2="0" stroke="#ca8a04" strokeWidth="1" />
                      <ellipse cx="0" cy="8" rx="10" ry="12" fill={col as string} stroke="#fef08a" strokeWidth="1" />
                      {/* Ribs */}
                      <ellipse cx="0" cy="8" rx="5" ry="12" fill="none" stroke="#fef08a" strokeWidth="0.8" opacity="0.7" />
                      {/* Tassel */}
                      <line x1="0" y1="20" x2="0" y2="30" stroke="#facc15" strokeWidth="1.5" />
                    </g>
                  ))}

                  {/* Large Red Lanterns in Left & Right Arches */}
                  <g transform="translate(183, 440)" filter={isNight ? "url(#nightGlow)" : undefined}>
                    <line x1="0" y1="-45" x2="0" y2="0" stroke="#ca8a04" strokeWidth="1.5" />
                    <circle cx="0" cy="0" r="16" fill="#dc2626" stroke="#fef08a" strokeWidth="1.5" />
                    <ellipse cx="0" cy="0" rx="8" ry="16" fill="none" stroke="#fef08a" strokeWidth="1" />
                    <line x1="0" y1="16" x2="0" y2="32" stroke="#facc15" strokeWidth="2" />
                  </g>
                  <g transform="translate(617, 440)" filter={isNight ? "url(#nightGlow)" : undefined}>
                    <line x1="0" y1="-45" x2="0" y2="0" stroke="#ca8a04" strokeWidth="1.5" />
                    <circle cx="0" cy="0" r="16" fill="#dc2626" stroke="#fef08a" strokeWidth="1.5" />
                    <ellipse cx="0" cy="0" rx="8" ry="16" fill="none" stroke="#fef08a" strokeWidth="1" />
                    <line x1="0" y1="16" x2="0" y2="32" stroke="#facc15" strokeWidth="2" />
                  </g>

                  {/* Yellow Lanterns on Outer Pillars */}
                  <g transform="translate(735, 430)" filter={isNight ? "url(#nightGlow)" : undefined}>
                    <line x1="0" y1="-50" x2="0" y2="0" stroke="#ca8a04" strokeWidth="1.5" />
                    <circle cx="0" cy="0" r="14" fill="#eab308" stroke="#fef08a" strokeWidth="1.5" />
                    <ellipse cx="0" cy="0" rx="7" ry="14" fill="none" stroke="#fef08a" strokeWidth="1" />
                    <line x1="0" y1="14" x2="0" y2="28" stroke="#facc15" strokeWidth="2" />
                  </g>
                  <g transform="translate(65, 430)" filter={isNight ? "url(#nightGlow)" : undefined}>
                    <line x1="0" y1="-50" x2="0" y2="0" stroke="#ca8a04" strokeWidth="1.5" />
                    <circle cx="0" cy="0" r="14" fill="#eab308" stroke="#fef08a" strokeWidth="1.5" />
                    <ellipse cx="0" cy="0" rx="7" ry="14" fill="none" stroke="#fef08a" strokeWidth="1" />
                    <line x1="0" y1="14" x2="0" y2="28" stroke="#facc15" strokeWidth="2" />
                  </g>

                  {/* 2 Star Lanterns hanging in side doorways */}
                  <g transform="translate(30, 480)" filter={isNight ? "url(#nightGlow)" : undefined}>
                    <polygon points="0,-16 4,-5 16,-5 7,3 10,15 0,7 -10,15 -7,3 -16,-5 -4,-5" fill="#ef4444" stroke="#facc15" strokeWidth="1.5" />
                  </g>
                  <g transform="translate(770, 480)" filter={isNight ? "url(#nightGlow)" : undefined}>
                    <polygon points="0,-16 4,-5 16,-5 7,3 10,15 0,7 -10,15 -7,3 -16,-5 -4,-5" fill="#ef4444" stroke="#facc15" strokeWidth="1.5" />
                  </g>
                </g>
              )}

              {/* ------------------------------------------------------------- */}
              {/* 3. FOREGROUND: CHRYSANTHEMUM POTS, WALKWAY, MINI STARS, FENCE */}
              {/* ------------------------------------------------------------- */}
              <g id="foreground-elements">
                {/* Bamboo Fences on Outer Wings */}
                {/* Left Fence */}
                <g id="left-fence">
                  {[0, 20, 40, 60, 80].map((fx, fi) => (
                    <line key={`lf-${fi}`} x1={fx} y1="620" x2={fx} y2="700" stroke="#a16207" strokeWidth="4" />
                  ))}
                  <line x1="0" y1="640" x2="90" y2="640" stroke="#a16207" strokeWidth="3" />
                  <line x1="0" y1="680" x2="90" y2="680" stroke="#a16207" strokeWidth="3" />
                  {/* Cross braces */}
                  <line x1="0" y1="640" x2="90" y2="680" stroke="#ca8a04" strokeWidth="2" />
                  <line x1="0" y1="680" x2="90" y2="640" stroke="#ca8a04" strokeWidth="2" />
                </g>
                {/* Right Fence */}
                <g id="right-fence">
                  {[710, 730, 750, 770, 790, 800].map((fx, fi) => (
                    <line key={`rf-${fi}`} x1={fx} y1="620" x2={fx} y2="700" stroke="#a16207" strokeWidth="4" />
                  ))}
                  <line x1="710" y1="640" x2="800" y2="640" stroke="#a16207" strokeWidth="3" />
                  <line x1="710" y1="680" x2="800" y2="680" stroke="#a16207" strokeWidth="3" />
                  <line x1="710" y1="640" x2="800" y2="680" stroke="#ca8a04" strokeWidth="2" />
                  <line x1="710" y1="680" x2="800" y2="640" stroke="#ca8a04" strokeWidth="2" />
                </g>

                {/* 4 Potted Yellow Chrysanthemums at Feet of 4 Pillars */}
                {[
                  [113, 715], // Foot 1
                  [258, 715], // Foot 2
                  [542, 715], // Foot 3
                  [687, 715], // Foot 4
                ].map(([px, py], pidx) => (
                  <g key={pidx} transform={`translate(${px}, ${py})`}>
                    {/* Flower Pot */}
                    <polygon points="-16,0 16,0 12,20 -12,20" fill="#78350f" stroke="#451a03" strokeWidth="1.5" />
                    {/* Bush of Chrysanthemums */}
                    <circle cx="0" cy="-6" r="18" fill="#ca8a04" />
                    <circle cx="-8" cy="-8" r="8" fill="#facc15" />
                    <circle cx="8" cy="-8" r="8" fill="#fde047" />
                    <circle cx="0" cy="-14" r="9" fill="#facc15" />
                    <circle cx="-10" cy="-2" r="7" fill="#eab308" />
                    <circle cx="10" cy="-2" r="7" fill="#eab308" />
                  </g>
                ))}

                {/* Mini Star Lanterns Planted Along Walkway Edges */}
                {[
                  // Left edge of walkway
                  [265, 755, '#ef4444'],
                  [245, 775, '#3b82f6'],
                  // Right edge of walkway
                  [535, 755, '#f59e0b'],
                  [555, 775, '#10b981'],
                ].map(([sx, sy, col], sidx) => (
                  <g key={`ms-${sidx}`} transform={`translate(${sx}, ${sy})`} filter={isNight ? "url(#nightGlow)" : undefined}>
                    {/* Bamboo Stake */}
                    <line x1="0" y1="0" x2="0" y2="35" stroke="#ca8a04" strokeWidth="2" />
                    {/* Star */}
                    <polygon points="0,-16 4,-5 16,-5 7,3 10,15 0,7 -10,15 -7,3 -16,-5 -4,-5" fill={col as string} stroke="#fef08a" strokeWidth="1" />
                    <circle cx="0" cy="0" r="4" fill="#fef08a" />
                  </g>
                ))}
              </g>

              {/* ------------------------------------------------------------- */}
              {/* 4. BLUEPRINT DIMENSION LINES (WHEN TOGGLED)                  */}
              {/* ------------------------------------------------------------- */}
              {showDimensions && (
                <g id="dimension-lines" stroke="#0284c7" strokeWidth="1.5">
                  {/* Gate Width 4.2m */}
                  <line x1="95" y1="100" x2="705" y2="100" />
                  <line x1="95" y1="90" x2="95" y2="110" />
                  <line x1="705" y1="90" x2="705" y2="110" />
                  <rect x="360" y="88" width="80" height="22" fill="#ffffff" stroke="#0284c7" rx="3" />
                  <text x="400" y="103" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#0284c7">Rộng 4,20 m</text>

                  {/* Main Gate Height 3.2m */}
                  <line x1="740" y1="140" x2="740" y2="685" />
                  <line x1="730" y1="140" x2="750" y2="140" />
                  <line x1="730" y1="685" x2="750" y2="685" />
                  <rect x="710" y="400" width="60" height="22" fill="#ffffff" stroke="#0284c7" rx="3" />
                  <text x="740" y="415" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#0284c7">Cao 3,20 m</text>

                  {/* Main Opening Width 1.8m */}
                  <line x1="281" y1="730" x2="519" y2="730" />
                  <line x1="281" y1="720" x2="281" y2="740" />
                  <line x1="519" y1="720" x2="519" y2="740" />
                  <rect x="360" y="718" width="80" height="22" fill="#ffffff" stroke="#0284c7" rx="3" />
                  <text x="400" y="733" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#0284c7">Cửa 1,80 m</text>
                </g>
              )}

              {/* ------------------------------------------------------------- */}
              {/* 5. INTERACTIVE HOTSPOT MARKERS                                */}
              {/* ------------------------------------------------------------- */}
              {showHotspots && LOTUS_HOTSPOTS.map((spot, sidx) => {
                const isSelected = selectedHotspot?.id === spot.id;
                // Convert percentage to 800x800 coordinate
                const cx = (spot.x / 100) * 800;
                const cy = (spot.y / 100) * 800;

                return (
                  <g 
                    key={spot.id} 
                    transform={`translate(${cx}, ${cy})`}
                    className="cursor-pointer transition-transform hover:scale-125"
                    onClick={() => setSelectedHotspot(spot)}
                  >
                    {/* Pulsing ring */}
                    <circle 
                      cx="0" 
                      cy="0" 
                      r={isSelected ? "18" : "14"} 
                      fill={isSelected ? "#10b981" : "#f59e0b"} 
                      opacity="0.3"
                      className="animate-ping" 
                    />
                    {/* Hotspot core button */}
                    <circle 
                      cx="0" 
                      cy="0" 
                      r={isSelected ? "14" : "11"} 
                      fill={isSelected ? "#059669" : "#d97706"} 
                      stroke="#ffffff" 
                      strokeWidth="2.5" 
                      filter="drop-shadow(0 2px 4px rgba(0,0,0,0.5))"
                    />
                    <text 
                      x="0" 
                      y="4" 
                      textAnchor="middle" 
                      fontSize="9" 
                      fontWeight="bold" 
                      fill="#ffffff"
                    >
                      {sidx + 1}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Quick Bar below canvas */}
          <div className="bg-slate-50 border-t border-slate-200 p-3 flex items-center justify-between text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold text-slate-800">
                {selectedHotspot ? selectedHotspot.name : 'Click vào các chấm tròn để xem chi tiết kỹ thuật'}
              </span>
            </div>
            <div className="text-[11px] text-slate-500 font-mono">
              Phối cảnh 1:1 theo ảnh mẫu • Tỷ lệ chuẩn Hải Anh 2026
            </div>
          </div>
        </div>

        {/* Right Col: Selected Hotspot Details Card */}
        <div className="space-y-4">
          {selectedHotspot ? (
            <div className="bg-white p-5 rounded-2xl border-2 border-emerald-500 shadow-sm space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase">
                    Chi tiết kỹ thuật #{LOTUS_HOTSPOTS.findIndex(h => h.id === selectedHotspot.id) + 1}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-2">
                    {selectedHotspot.title}
                  </h3>
                </div>
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Lightbulb className="w-5 h-5" />
                </div>
              </div>

              {/* Specs */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1">
                <p className="font-bold text-slate-700 flex items-center gap-1.5">
                  <Ruler className="w-3.5 h-3.5 text-indigo-600" />
                  Quy cách & Kích thước:
                </p>
                <p className="text-slate-600 leading-relaxed pl-5">
                  {selectedHotspot.specs}
                </p>
              </div>

              {/* Materials */}
              <div className="text-xs space-y-2">
                <p className="font-bold text-slate-700 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-amber-600" />
                  Vật liệu & Linh kiện cần chuẩn bị:
                </p>
                <ul className="space-y-1 pl-5">
                  {selectedHotspot.materials.map((mat, mi) => (
                    <li key={mi} className="list-disc text-slate-600">
                      {mat}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Scoring impact */}
              <div className="bg-amber-50/80 p-3 rounded-xl border border-amber-200 text-xs space-y-1">
                <p className="font-bold text-amber-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-700" />
                  Ý nghĩa chấm điểm thi đua:
                </p>
                <p className="text-amber-800 leading-relaxed">
                  {selectedHotspot.scoringRule}
                </p>
              </div>

              {/* Note */}
              <p className="text-[11px] text-slate-500 italic bg-slate-100 p-2.5 rounded-lg border border-slate-200">
                Lưu ý: {selectedHotspot.notes}
              </p>
            </div>
          ) : (
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
              Chọn một điểm chú thích trên mô hình để xem bản vẽ chi tiết.
            </div>
          )}

          {/* Quick Specs Overview Card */}
          <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 shadow-sm text-xs space-y-3">
            <h4 className="font-bold text-slate-200 flex items-center gap-2">
              <Tag className="w-4 h-4 text-emerald-400" />
              Thông Số Chính Theo Ảnh Mẫu:
            </h4>
            <div className="space-y-2 text-slate-300">
              <div className="flex justify-between border-b border-slate-800 pb-1.5">
                <span className="text-slate-400">Kiểu dáng cổng:</span>
                <span className="font-bold text-white">Tam quan mái cong 4 trụ</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-1.5">
                <span className="text-slate-400">Số lượng hoa sen LED:</span>
                <span className="font-bold text-pink-400">6 bông (4 đỉnh + 2 mái)</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-1.5">
                <span className="text-slate-400">Lồng đèn cá chép:</span>
                <span className="font-bold text-red-400">2 chiếc vách mái</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-1.5">
                <span className="text-slate-400">Đèn ông sao trung tâm:</span>
                <span className="font-bold text-amber-400">1 chiếc D40cm</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-1.5">
                <span className="text-slate-400">Đèn sao mini cắm lối đi:</span>
                <span className="font-bold text-white">14 chiếc</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-1.5">
                <span className="text-slate-400">Bàn học & đèn học:</span>
                <span className="font-bold text-emerald-400">BẮT BUỘC BÊN PHẢI</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Trống & cờ Đội:</span>
                <span className="font-bold text-emerald-400">BẮT BUỘC BÊN TRÁI</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
