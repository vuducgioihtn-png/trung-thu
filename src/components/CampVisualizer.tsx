import React, { useState } from 'react';
import { 
  Sun, 
  Moon, 
  Ruler, 
  Eye, 
  Sparkles, 
  Info, 
  Layers, 
  CheckCircle2, 
  AlertTriangle,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Hammer,
  Wand2
} from 'lucide-react';
import { CampVisualConfig, ViewAngle, LightingMode } from '../types/camp';
import { GateExplodedSvg, SideElevationSvg, AltarDetailSvg } from './CampVisualizerViews';

interface CampVisualizerProps {
  config: CampVisualConfig;
  onChangeConfig: (newConfig: Partial<CampVisualConfig>) => void;
}

export const CampVisualizer: React.FC<CampVisualizerProps> = ({
  config,
  onChangeConfig,
}) => {
  const [viewAngle, setViewAngle] = useState<ViewAngle>('overview');
  const [lighting, setLighting] = useState<LightingMode>('day');
  const [showDimensions, setShowDimensions] = useState<boolean>(true);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [selectedHotspot, setSelectedHotspot] = useState<string | null>(null);
  const [showSpecTable, setShowSpecTable] = useState<boolean>(false);
  const [feedbackToast, setFeedbackToast] = useState<{ message: string; type: 'success' | 'warning' | 'info' } | null>(null);

  const notifyChange = (message: string, type: 'success' | 'warning' | 'info' = 'info') => {
    setFeedbackToast({ message, type });
    setTimeout(() => {
      setFeedbackToast(null);
    }, 4500);
  };

  const handleConfigUpdate = (partial: Partial<CampVisualConfig>, label: string, type: 'success' | 'warning' | 'info' = 'info') => {
    onChangeConfig(partial);
    notifyChange(label, type);
  };

  const isNight = lighting === 'night';

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.25, 1.75));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.25, 0.75));
  const handleZoomReset = () => setZoomLevel(1);

  return (
    <div id="camp-visualizer-container" className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
      {/* Top Toolbar */}
      <div className="bg-slate-900 text-white p-3 sm:px-5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center font-bold">
            <Eye className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold tracking-wide text-slate-100 flex items-center gap-2">
              Bản Vẽ Chi Tiết & Phối Cảnh Trại Thu Hải Anh 2026
              <span className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-normal bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/30">
                Chuẩn Kỹ Thuật 1:1
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Chủ đề: <span className="text-emerald-300 font-medium">"Lồng đèn thắp sáng ước mơ"</span>
            </p>
          </div>
        </div>

        {/* View Switches and Toggles */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Zoom controls */}
          <div className="bg-slate-800 px-1.5 py-1 rounded-lg flex items-center gap-1 text-slate-300 text-xs border border-slate-700">
            <button
              onClick={handleZoomOut}
              disabled={zoomLevel <= 0.75}
              title="Thu nhỏ bản vẽ"
              className="p-1 hover:text-white disabled:opacity-30 cursor-pointer"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-[11px] min-w-[34px] text-center font-bold text-slate-200">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              disabled={zoomLevel >= 1.75}
              title="Phóng to bản vẽ"
              className="p-1 hover:text-white disabled:opacity-30 cursor-pointer"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            {zoomLevel !== 1 && (
              <button
                onClick={handleZoomReset}
                title="Về tỉ lệ mặc định 100%"
                className="p-1 text-emerald-400 hover:text-emerald-300 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Day / Night toggle */}
          <button
            id="toggle-lighting-mode"
            onClick={() => setLighting(isNight ? 'day' : 'night')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
              isNight
                ? 'bg-slate-800 border-slate-700 text-amber-300 hover:bg-slate-750'
                : 'bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-750'
            }`}
            title="Chuyển đổi ánh sáng Ngày / Đêm Trung Thu"
          >
            {isNight ? (
              <>
                <Moon className="w-3.5 h-3.5 fill-amber-300" />
                <span className="hidden sm:inline">Đêm Hội</span>
              </>
            ) : (
              <>
                <Sun className="w-3.5 h-3.5 fill-amber-400" />
                <span className="hidden sm:inline">Ban Ngày</span>
              </>
            )}
          </button>

          {/* Toggle Dimensions */}
          <button
            id="toggle-dimensions"
            onClick={() => setShowDimensions(!showDimensions)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
              showDimensions
                ? 'bg-emerald-950/70 border-emerald-600 text-emerald-300'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
            title="Hiện/Ẩn thước đo kỹ thuật"
          >
            <Ruler className="w-3.5 h-3.5" />
            <span>Thước đo</span>
          </button>
        </div>
      </div>

      {/* Sub-navigation bar for 7 granular views */}
      <div className="bg-slate-850 px-3 sm:px-5 py-2 border-b border-slate-800 flex items-center gap-1.5 overflow-x-auto text-xs scrollbar-none">
        <span className="text-slate-400 text-[11px] font-medium mr-1 flex items-center gap-1 shrink-0">
          <Layers className="w-3 h-3 text-emerald-400" />
          <span>Góc nhìn:</span>
        </span>

        <button
          id="view-mode-overview"
          onClick={() => setViewAngle('overview')}
          className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition-all cursor-pointer ${
            viewAngle === 'overview'
              ? 'bg-emerald-600 text-white shadow-xs font-semibold'
              : 'bg-slate-800 text-slate-300 hover:text-white'
          }`}
        >
          1. Toàn Cảnh Phối Cảnh
        </button>

        <button
          id="view-mode-gate"
          onClick={() => setViewAngle('gate')}
          className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition-all cursor-pointer ${
            viewAngle === 'gate'
              ? 'bg-emerald-600 text-white shadow-xs font-semibold'
              : 'bg-slate-800 text-slate-300 hover:text-white'
          }`}
        >
          2. Cổng Hộp Kép (1.8×1.2m)
        </button>

        <button
          id="view-mode-gate-exploded"
          onClick={() => setViewAngle('gate_exploded')}
          className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition-all cursor-pointer ${
            viewAngle === 'gate_exploded'
              ? 'bg-emerald-600 text-white shadow-xs font-semibold'
              : 'bg-slate-800 text-slate-300 hover:text-white'
          }`}
        >
          3. Bóc Tách Khung Cốt Cổng
        </button>

        <button
          id="view-mode-side-elevation"
          onClick={() => setViewAngle('side_elevation')}
          className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition-all cursor-pointer ${
            viewAngle === 'side_elevation'
              ? 'bg-emerald-600 text-white shadow-xs font-semibold'
              : 'bg-slate-800 text-slate-300 hover:text-white'
          }`}
        >
          4. Mặt Cắt & Mái Lều 35°
        </button>

        <button
          id="view-mode-interior"
          onClick={() => setViewAngle('interior')}
          className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition-all cursor-pointer ${
            viewAngle === 'interior'
              ? 'bg-emerald-600 text-white shadow-xs font-semibold'
              : 'bg-slate-800 text-slate-300 hover:text-white'
          }`}
        >
          5. Nội Thất & Bố Trí Trái/Phải
        </button>

        <button
          id="view-mode-altar-detail"
          onClick={() => setViewAngle('altar_detail')}
          className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition-all cursor-pointer ${
            viewAngle === 'altar_detail'
              ? 'bg-emerald-600 text-white shadow-xs font-semibold'
              : 'bg-slate-800 text-slate-300 hover:text-white'
          }`}
        >
          6. Ban Thờ & Chó Bưởi (Zoom)
        </button>

        <button
          id="view-mode-technical"
          onClick={() => setViewAngle('technical')}
          className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition-all cursor-pointer ${
            viewAngle === 'technical'
              ? 'bg-emerald-600 text-white shadow-xs font-semibold'
              : 'bg-slate-800 text-slate-300 hover:text-white'
          }`}
        >
          7. Sơ Đồ Cọc & Nút 80cm
        </button>
      </div>

      {/* Main Canvas Area */}
      <div className="relative w-full aspect-[16/9] min-h-[420px] max-h-[600px] bg-gradient-to-b overflow-hidden select-none">
        {/* Real-time Config Feedback Toast */}
        {feedbackToast && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 pointer-events-auto max-w-[90%] sm:max-w-md">
            <div className={`px-4 py-2 rounded-xl text-xs font-semibold shadow-2xl border flex items-center gap-2 backdrop-blur-md transition-all ${
              feedbackToast.type === 'success' 
                ? 'bg-emerald-950/95 text-emerald-200 border-emerald-500/60' 
                : feedbackToast.type === 'warning'
                ? 'bg-amber-950/95 text-amber-200 border-amber-500/60'
                : 'bg-slate-900/95 text-slate-100 border-slate-700'
            }`}>
              {feedbackToast.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : feedbackToast.type === 'warning' ? (
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              ) : (
                <Info className="w-4 h-4 text-sky-400 shrink-0" />
              )}
              <span>{feedbackToast.message}</span>
            </div>
          </div>
        )}

        {/* Background Sky & Environment */}
        <div 
          className={`absolute inset-0 transition-colors duration-700 ${
            isNight 
              ? 'bg-gradient-to-b from-[#0b1021] via-[#121c38] to-[#1c2747]' 
              : 'bg-gradient-to-b from-sky-300 via-sky-100 to-amber-50/60'
          }`}
        >
          {/* Moon or Sun */}
          {isNight ? (
            <div className="absolute top-6 right-16 flex flex-col items-center">
              <div className="relative w-16 h-16 rounded-full bg-amber-100 shadow-[0_0_50px_15px_rgba(251,191,36,0.35)] flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-amber-50/90 border border-amber-200/50" />
              </div>
              <span className="text-[10px] text-amber-200/80 mt-1 font-medium tracking-wider">Trăng Rằm Thu 2026</span>
            </div>
          ) : (
            <div className="absolute top-6 right-20 w-16 h-16 rounded-full bg-gradient-to-tr from-amber-300 to-yellow-100 shadow-[0_0_60px_20px_rgba(252,211,77,0.4)]" />
          )}

          {/* Stars for night */}
          {isNight && (
            <div className="absolute inset-0 opacity-80 pointer-events-none">
              <div className="absolute top-10 left-16 w-1 h-1 bg-white rounded-full animate-ping" />
              <div className="absolute top-20 left-48 w-1.5 h-1.5 bg-amber-200 rounded-full" />
              <div className="absolute top-8 left-1/3 w-1 h-1 bg-white rounded-full" />
              <div className="absolute top-16 right-1/3 w-1.5 h-1.5 bg-yellow-100 rounded-full animate-pulse" />
              <div className="absolute top-32 right-12 w-1 h-1 bg-white rounded-full" />
            </div>
          )}

          {/* Ground / Festival Lawn */}
          <div 
            className={`absolute bottom-0 left-0 right-0 h-[28%] border-t transition-colors duration-700 ${
              isNight
                ? 'bg-gradient-to-t from-[#0e1f18] to-[#172d23] border-emerald-900/40'
                : 'bg-gradient-to-t from-emerald-700 to-emerald-500 border-emerald-400/30'
            }`}
          >
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]" />
            <div className="absolute bottom-3 left-6 text-xs text-white/60 font-mono">
              Sân vận động Xã Hải Anh • Ninh Bình (8m × 10m)
            </div>
          </div>
        </div>

        {/* Dynamic SVG Rendering based on viewAngle with Zoom Transform */}
        <div 
          className="absolute inset-0 flex items-center justify-center p-2 transition-transform duration-300"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          {viewAngle === 'overview' && (
            <OverviewCampSvg 
              config={config} 
              isNight={isNight} 
              showDimensions={showDimensions} 
              onSelectHotspot={setSelectedHotspot}
            />
          )}
          {viewAngle === 'gate' && (
            <GateDetailSvg 
              config={config} 
              isNight={isNight} 
              showDimensions={showDimensions} 
              onSelectHotspot={setSelectedHotspot}
            />
          )}
          {viewAngle === 'gate_exploded' && (
            <GateExplodedSvg 
              config={config} 
              isNight={isNight} 
              showDimensions={showDimensions} 
              onSelectHotspot={setSelectedHotspot}
            />
          )}
          {viewAngle === 'side_elevation' && (
            <SideElevationSvg 
              config={config} 
              isNight={isNight} 
              showDimensions={showDimensions} 
              onSelectHotspot={setSelectedHotspot}
            />
          )}
          {viewAngle === 'interior' && (
            <InteriorCampSvg 
              config={config} 
              isNight={isNight} 
              showDimensions={showDimensions} 
              onSelectHotspot={setSelectedHotspot}
            />
          )}
          {viewAngle === 'altar_detail' && (
            <AltarDetailSvg 
              config={config} 
              isNight={isNight} 
              showDimensions={showDimensions} 
              onSelectHotspot={setSelectedHotspot}
            />
          )}
          {viewAngle === 'technical' && (
            <TechnicalBlueprintSvg 
              config={config} 
              isNight={isNight} 
              showDimensions={showDimensions} 
              onSelectHotspot={setSelectedHotspot}
            />
          )}
        </div>

        {/* Hotspot Info Tooltip / Card */}
        {selectedHotspot && (
          <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-88 bg-slate-900/95 backdrop-blur-md text-white p-3.5 rounded-xl border border-slate-700 shadow-xl z-20 transition-all">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Tiêu chuẩn Hải Anh 2026</span>
              </div>
              <button 
                onClick={() => setSelectedHotspot(null)}
                className="text-slate-400 hover:text-white text-xs px-1 cursor-pointer"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-slate-200 mt-1.5 leading-relaxed">
              {selectedHotspot}
            </p>
          </div>
        )}
      </div>

      {/* Interactive Quick Config Toolbar underneath the canvas */}
      <div className="p-3 sm:px-5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center flex-wrap gap-2 text-slate-700 font-medium">
          <span className="text-slate-500 font-normal">Cấu hình nhanh:</span>
          
          {/* Gate type selector */}
          <select 
            id="select-gate-type"
            value={config.gateType}
            onChange={(e) => {
              const val = e.target.value as any;
              const names: Record<string, string> = {
                hop_kep: "Cổng Hộp Kép 4 trụ (7/7đ - Đạt chuẩn)",
                hop_don: "Cổng Hộp Đơn 2 trụ (5/7đ - Thiếu cửa lách)",
                cong_don: "Cổng Đơn Giản tre mộc (3/7đ - Trừ 4đ)"
              };
              handleConfigUpdate(
                { gateType: val },
                `Đã chuyển: ${names[val]} • Bản vẽ cập nhật tức thì!`,
                val === 'hop_kep' ? 'success' : 'warning'
              );
            }}
            className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:ring-1 focus:ring-emerald-500 focus:outline-none font-medium cursor-pointer"
          >
            <option value="hop_kep">Cổng Hộp Kép (4 trụ, 2 cửa lách) • 7.0đ</option>
            <option value="hop_don">Cổng Hộp Đơn (2 trụ, 1 cửa chính) • 5.0đ</option>
            <option value="cong_don">Cổng Đơn Giản (tre mộc) • 3.0đ</option>
          </select>

          {/* Decoration style selector */}
          <select 
            id="select-deco-type"
            value={config.decorationType}
            onChange={(e) => {
              const val = e.target.value as any;
              handleConfigUpdate(
                { decorationType: val },
                val === 'craft' 
                  ? "Đã chọn: Chữ nổi xốp 3D thủ công viền LED (5/5đ) • Đạt chuẩn quy chế!" 
                  : "Đã chọn: Bạt in phun phẳng (3/5đ) • Bị trừ 2 điểm do không đắp chữ!",
                val === 'craft' ? 'success' : 'warning'
              );
            }}
            className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:ring-1 focus:ring-emerald-500 focus:outline-none font-medium cursor-pointer"
          >
            <option value="craft">Trang trí thủ công chữ nổi xốp viền LED • 5.0đ</option>
            <option value="print">Trang trí bạt in phun Hiflex phẳng • 3.0đ</option>
          </select>

          {/* Knot Distance & Knot Type selector */}
          <select
            id="select-knot-config"
            value={`${config.knotDistanceCm}_${config.isCloveHitchKnot ? 'clove' : 'wrong'}`}
            onChange={(e) => {
              const val = e.target.value;
              if (val === '80_clove') {
                handleConfigUpdate(
                  { knotDistanceCm: 80, isCloveHitchKnot: true },
                  "Đã chọn: Cọc 80cm + Nút Thuyền Chài (4.0/4đ trọn vẹn)!",
                  'success'
                );
              } else if (val === '60_clove') {
                handleConfigUpdate(
                  { knotDistanceCm: 60, isCloveHitchKnot: true },
                  "Đã thử nghiệm: Cọc 60cm (quá gần) - Bị trừ 1.5đ khoảng cách!",
                  'warning'
                );
              } else if (val === '80_wrong') {
                handleConfigUpdate(
                  { knotDistanceCm: 80, isCloveHitchKnot: false },
                  "Đã thử nghiệm: Nút thắt chết - Bị trừ 2.0đ kỹ thuật thắt nút!",
                  'warning'
                );
              } else {
                handleConfigUpdate(
                  { knotDistanceCm: 60, isCloveHitchKnot: false },
                  "Đã thử nghiệm: Lỗi kép (Cọc 60cm + Sai nút thắt chết) - Bị trừ 3.5đ!",
                  'warning'
                );
              }
            }}
            className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:ring-1 focus:ring-emerald-500 focus:outline-none font-medium cursor-pointer"
          >
            <option value="80_clove">✓ Cọc 80cm + Nút Thuyền Chài (4.0đ)</option>
            <option value="60_clove">⚠ Cọc gần 60cm + Thuyền chài (2.5đ)</option>
            <option value="80_wrong">⚠ Cọc 80cm + Nút thắt chết (2.0đ)</option>
            <option value="60_wrong">❌ Cọc 60cm + Nút thắt chết (0.5đ)</option>
          </select>

          {/* Interactive 1-click Toggle Button */}
          <button
            id="btn-fix-knot"
            onClick={() => {
              const isStandard = config.knotDistanceCm === 80 && config.isCloveHitchKnot;
              if (isStandard) {
                handleConfigUpdate(
                  { knotDistanceCm: 60, isCloveHitchKnot: false },
                  "Mô phỏng lỗi: Cọc 60cm & Buộc nút thắt chết (Trừ 3.5đ)",
                  'warning'
                );
              } else {
                handleConfigUpdate(
                  { knotDistanceCm: 80, isCloveHitchKnot: true },
                  "Sửa chuẩn: Cọc 80cm & Nút thuyền chài (Đạt trọn 4.0/4đ)!",
                  'success'
                );
              }
            }}
            className={`px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 cursor-pointer font-semibold ${
              config.knotDistanceCm === 80 && config.isCloveHitchKnot
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100'
                : 'bg-rose-50 border-rose-300 text-rose-800 hover:bg-rose-100 animate-pulse'
            }`}
            title="Bấm để chuyển đổi giữa Tiêu chuẩn 80cm thuyền chài và Lỗi kỹ thuật"
          >
            {config.knotDistanceCm === 80 && config.isCloveHitchKnot ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Chuẩn 80cm (Bấm để thử lỗi)</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                <span>Bấm để sửa chuẩn 80cm thuyền chài</span>
              </>
            )}
          </button>
        </div>

        {/* Presets & Spec Table Toggle */}
        <div className="flex items-center flex-wrap gap-2">
          <button
            id="btn-preset-optimal"
            onClick={() => {
              handleConfigUpdate({
                gateType: 'hop_kep',
                decorationType: 'craft',
                knotDistanceCm: 80,
                isCloveHitchKnot: true,
                gateHeight: 1.8,
                gateWidth: 1.2
              }, "Đã nạp trọn bộ Cấu Hình Chuẩn Đạt 70/70đ Cắm Trại!", 'success');
            }}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-800 hover:bg-amber-500/20 font-semibold text-xs cursor-pointer"
            title="Áp dụng cấu hình đạt điểm tuyệt đối"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span className="hidden sm:inline">Chuẩn 70đ</span>
          </button>

          <button
            onClick={() => setShowSpecTable(!showSpecTable)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 font-medium text-xs cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-600" />
            <span>{showSpecTable ? 'Thu gọn bảng đo đạc' : 'Bảng đối chiếu kích thước & dung sai'}</span>
            {showSpecTable ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* Collapsible Engineering Specification & Tolerances Table */}
      {showSpecTable && (
        <div className="p-4 sm:p-5 bg-slate-900 text-white border-t border-slate-800 text-xs">
          <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
            <h4 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
              <Hammer className="w-4 h-4 text-emerald-400" />
              <span>BẢNG THÔNG SỐ ĐO ĐẠC & DUNG SAI THI CÔNG TRẠI THU XÃ HẢI ANH 2026</span>
            </h4>
            <span className="text-[11px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
              Cập nhật theo cấu hình thực tế
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-sans">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[11px] uppercase tracking-wider">
                  <th className="py-2 px-3 font-semibold">Hạng mục thi công</th>
                  <th className="py-2 px-3 font-semibold">Kích thước chuẩn</th>
                  <th className="py-2 px-3 font-semibold">Thực tế cấu hình</th>
                  <th className="py-2 px-3 font-semibold">Điểm quy định</th>
                  <th className="py-2 px-3 font-semibold">Lỗi kỹ thuật / Ghi chú</th>
                  <th className="py-2 px-3 font-semibold text-right">Đánh giá</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300 text-xs font-mono">
                {/* Gate type row */}
                <tr className="hover:bg-slate-800/40">
                  <td className="py-2.5 px-3 font-sans font-medium text-white">Kiểu dáng & kết cấu cổng</td>
                  <td className="py-2.5 px-3 text-amber-300 font-bold">Hộp kép (4 trụ, 2 cửa lách)</td>
                  <td className="py-2.5 px-3 text-white">
                    {config.gateType === 'hop_kep' ? 'Cổng hộp kép (4 trụ)' : config.gateType === 'hop_don' ? 'Cổng hộp đơn (2 trụ)' : 'Cổng tre đơn giản'}
                  </td>
                  <td className="py-2.5 px-3 text-emerald-400 font-bold">
                    {config.gateType === 'hop_kep' ? '7.0 / 7.0 đ' : config.gateType === 'hop_don' ? '5.0 / 7.0 đ' : '3.0 / 7.0 đ'}
                  </td>
                  <td className="py-2.5 px-3 font-sans text-slate-300">
                    {config.gateType === 'hop_kep' ? 'Đạt chuẩn cao nhất hội thi' : config.gateType === 'hop_don' ? 'Thiếu 2 cửa lách phụ hai bên (-2đ)' : 'Cổng đơn sơ, bị trừ 4 điểm'}
                  </td>
                  <td className={`py-2.5 px-3 text-right font-bold ${config.gateType === 'hop_kep' ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {config.gateType === 'hop_kep' ? 'ĐẠT CHUẨN' : 'CHƯA TỐI ĐA'}
                  </td>
                </tr>

                {/* Decoration row */}
                <tr className="hover:bg-slate-800/40">
                  <td className="py-2.5 px-3 font-sans font-medium text-white">Hình thức trang trí chữ</td>
                  <td className="py-2.5 px-3 text-amber-300 font-bold">Chữ nổi thủ công đắp nổi</td>
                  <td className="py-2.5 px-3 text-white">
                    {config.decorationType === 'craft' ? 'Chữ xốp 3D thủ công viền LED' : 'Bạt in phun Hiflex phẳng'}
                  </td>
                  <td className="py-2.5 px-3 text-emerald-400 font-bold">
                    {config.decorationType === 'craft' ? '5.0 / 5.0 đ' : '3.0 / 5.0 đ'}
                  </td>
                  <td className="py-2.5 px-3 font-sans text-slate-300">
                    {config.decorationType === 'craft' ? 'Khuyến khích thủ công truyền thống' : 'Bạt in vi tính bị trừ 2đ theo thang điểm'}
                  </td>
                  <td className={`py-2.5 px-3 text-right font-bold ${config.decorationType === 'craft' ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {config.decorationType === 'craft' ? 'ĐẠT CHUẨN' : 'BỊ TRỪ 2Đ'}
                  </td>
                </tr>

                <tr className="hover:bg-slate-800/40">
                  <td className="py-2.5 px-3 font-sans font-medium text-white">Chiều cao lọt lòng cổng chính</td>
                  <td className="py-2.5 px-3 text-amber-300 font-bold">1.80 m (180 cm)</td>
                  <td className="py-2.5 px-3 text-white">{config.gateHeight} m</td>
                  <td className="py-2.5 px-3 text-emerald-400 font-bold">2.0 đ</td>
                  <td className="py-2.5 px-3 font-sans text-slate-300">Làm cổng quá thấp dưới 1.70m hoặc vòm xệ</td>
                  <td className="py-2.5 px-3 text-right text-emerald-400 font-bold">ĐẠT CHUẨN</td>
                </tr>
                <tr className="hover:bg-slate-800/40">
                  <td className="py-2.5 px-3 font-sans font-medium text-white">Chiều rộng lọt lòng cổng chính</td>
                  <td className="py-2.5 px-3 text-amber-300 font-bold">1.20 m (120 cm)</td>
                  <td className="py-2.5 px-3 text-white">{config.gateWidth} m</td>
                  <td className="py-2.5 px-3 text-emerald-400 font-bold">2.0 đ</td>
                  <td className="py-2.5 px-3 font-sans text-slate-300">Cổng hẹp dưới 1.1m Ban giám khảo khó bước vào</td>
                  <td className="py-2.5 px-3 text-right text-emerald-400 font-bold">ĐẠT CHUẨN</td>
                </tr>
                <tr className="hover:bg-slate-800/40">
                  <td className="py-2.5 px-3 font-sans font-medium text-white">Cột chính giữa lều trại</td>
                  <td className="py-2.5 px-3 text-amber-300 font-bold">Cao 1.80m • Ø 3cm</td>
                  <td className="py-2.5 px-3 text-white">1.80m • Ø 3cm</td>
                  <td className="py-2.5 px-3 text-emerald-400 font-bold">10.0 đ</td>
                  <td className="py-2.5 px-3 font-sans text-slate-300">Dùng tre đực già, thẳng, không mắt sâu</td>
                  <td className="py-2.5 px-3 text-right text-emerald-400 font-bold">ĐẠT CHUẨN</td>
                </tr>
                <tr className="hover:bg-slate-800/40">
                  <td className="py-2.5 px-3 font-sans font-medium text-white">Khoảng cách mép lều tới cọc con</td>
                  <td className="py-2.5 px-3 text-amber-300 font-bold">80 cm (0.80 m)</td>
                  <td className="py-2.5 px-3 text-white">{config.knotDistanceCm} cm</td>
                  <td className="py-2.5 px-3 text-emerald-400 font-bold">
                    {config.knotDistanceCm === 80 ? '4.0 / 4.0 đ' : '2.5 / 4.0 đ'}
                  </td>
                  <td className="py-2.5 px-3 font-sans text-slate-300">
                    {config.knotDistanceCm === 80 ? 'Đúng chuẩn cự ly đo đạc' : `Lệch cự ly ${config.knotDistanceCm}cm (bị trừ 1.5đ)`}
                  </td>
                  <td className={`py-2.5 px-3 text-right font-bold ${config.knotDistanceCm === 80 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {config.knotDistanceCm === 80 ? 'ĐẠT CHUẨN' : 'SAI LỆCH'}
                  </td>
                </tr>
                <tr className="hover:bg-slate-800/40">
                  <td className="py-2.5 px-3 font-sans font-medium text-white">Kỹ thuật thắt nút dây cọc</td>
                  <td className="py-2.5 px-3 text-amber-300 font-bold">Nút Thuyền Chài</td>
                  <td className="py-2.5 px-3 text-white">
                    {config.isCloveHitchKnot ? 'Nút Thuyền Chài (Chuẩn)' : 'Nút thắt chết (Sai quy định)'}
                  </td>
                  <td className="py-2.5 px-3 text-emerald-400 font-bold">
                    {config.isCloveHitchKnot ? '5.0 / 5.0 đ' : '3.0 / 5.0 đ'}
                  </td>
                  <td className="py-2.5 px-3 font-sans text-slate-300">
                    {config.isCloveHitchKnot ? 'Thắt siết chắc, dễ tháo khi dỡ trại' : 'Buộc nút chết bị trừ 2.0đ'}
                  </td>
                  <td className={`py-2.5 px-3 text-right font-bold ${config.isCloveHitchKnot ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {config.isCloveHitchKnot ? 'ĐẠT CHUẨN' : 'BỊ TRỪ ĐIỂM'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 1. OVERVIEW SVG VIEW
// ==========================================
const OverviewCampSvg: React.FC<{
  config: CampVisualConfig;
  isNight: boolean;
  showDimensions: boolean;
  onSelectHotspot: (desc: string) => void;
}> = ({ config, isNight, showDimensions, onSelectHotspot }) => {
  return (
    <svg viewBox="0 0 1000 560" className="w-full h-full drop-shadow-md">
      <defs>
        {/* Gradients */}
        <linearGradient id="tentRoofGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1e3a8a" />
          <stop offset="100%" stopColor="#172554" />
        </linearGradient>
        <linearGradient id="gateWood" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#b45309" />
          <stop offset="50%" stopColor="#d97706" />
          <stop offset="100%" stopColor="#92400e" />
        </linearGradient>
        <filter id="lanternGlow">
          <feGaussianBlur stdDeviation="5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* ---------------- BACKGROUND TENT (Behind Gate) ---------------- */}
      <g id="camp-tent-overview" className="cursor-pointer" onClick={() => onSelectHotspot("Lều trại: Cột chính cao 1,8m, đường kính 3cm (10đ). Cọc con chắc chắn (5đ), mái phẳng đẹp (5đ).")}>
        {/* Tent Guy Lines */}
        <path d="M 500 210 L 260 440" stroke="#f8fafc" strokeWidth="2.5" strokeDasharray="none" opacity="0.9" />
        <path d="M 500 210 L 740 440" stroke="#f8fafc" strokeWidth="2.5" strokeDasharray="none" opacity="0.9" />
        <path d="M 440 250 L 320 440" stroke="#f8fafc" strokeWidth="2" opacity="0.8" />
        <path d="M 560 250 L 680 440" stroke="#f8fafc" strokeWidth="2" opacity="0.8" />

        {/* Tent Main Body Roof */}
        <polygon 
          points="500,200 350,340 500,320 650,340" 
          fill="url(#tentRoofGrad)" 
          stroke="#38bdf8" 
          strokeWidth="2"
        />
        {/* Tent Left Slope */}
        <polygon points="500,200 350,340 370,410 500,390" fill="#1d4ed8" opacity="0.9" />
        {/* Tent Right Slope */}
        <polygon points="500,200 650,340 630,410 500,390" fill="#2563eb" opacity="0.9" />

        {/* Center Pole 1.8m (seen through front) */}
        <line x1="500" y1="200" x2="500" y2="440" stroke="#d97706" strokeWidth="6" strokeLinecap="round" />

        {/* Top Flag Pole & Red Flag */}
        <line x1="500" y1="200" x2="500" y2="150" stroke="#e2e8f0" strokeWidth="3" />
        <polygon points="500,150 540,165 500,180" fill="#dc2626" />
        <polygon points="513,165 517,162 521,165 519,161 523,158 518,158 517,154 515,158 510,158 514,161" fill="#facc15" />

        {/* Bunting pennant flags along ropes */}
        <polygon points="460,225 470,240 455,235" fill="#ef4444" />
        <polygon points="430,245 440,260 425,255" fill="#f59e0b" />
        <polygon points="400,265 410,280 395,275" fill="#10b981" />
        <polygon points="370,285 380,300 365,295" fill="#3b82f6" />
        <polygon points="540,225 550,240 535,235" fill="#ef4444" />
        <polygon points="570,245 580,260 565,255" fill="#f59e0b" />
        <polygon points="600,265 610,280 595,275" fill="#10b981" />
        <polygon points="630,285 640,300 625,295" fill="#3b82f6" />

        {/* Ground Stakes (cọc con) */}
        <line x1="260" y1="435" x2="255" y2="465" stroke="#78350f" strokeWidth="6" strokeLinecap="round" />
        <line x1="740" y1="435" x2="745" y2="465" stroke="#78350f" strokeWidth="6" strokeLinecap="round" />
        <line x1="320" y1="435" x2="315" y2="460" stroke="#78350f" strokeWidth="5" strokeLinecap="round" />
        <line x1="680" y1="435" x2="685" y2="460" stroke="#78350f" strokeWidth="5" strokeLinecap="round" />
      </g>

      {/* ---------------- FOREGROUND GATE (CỔNG HỘP KÉP) ---------------- */}
      <g id="camp-gate-overview">
        {/* Gate Pillars Shadow */}
        <ellipse cx="500" cy="460" rx="280" ry="12" fill="#000000" opacity={isNight ? "0.6" : "0.25"} />

        {/* If Hộp Kép: 4 Pillars & 2 Side Doors */}
        {config.gateType === 'hop_kep' && (
          <g 
            className="cursor-pointer" 
            onClick={() => onSelectHotspot("Cổng hộp kép (hộp vuông, 4 trụ, có 2 cửa lách) đạt điểm tối đa 7/7đ loại cổng.")}
          >
            {/* Rear Pillars (perspective) */}
            <rect x="360" y="240" width="22" height="205" fill="#92400e" rx="3" />
            <rect x="618" y="240" width="22" height="205" fill="#92400e" rx="3" />

            {/* Connecting crossbars between front and back pillars (creating 3D square box) */}
            <line x1="365" y1="260" x2="385" y2="280" stroke="#78350f" strokeWidth="8" />
            <line x1="365" y1="360" x2="385" y2="380" stroke="#78350f" strokeWidth="8" />
            <line x1="635" y1="260" x2="615" y2="280" stroke="#78350f" strokeWidth="8" />
            <line x1="635" y1="360" x2="615" y2="380" stroke="#78350f" strokeWidth="8" />

            {/* Left Side Door (Cửa lách trái) */}
            <g onClick={() => onSelectHotspot("Cửa lách bên trái trang trí nan tre đan hoa văn kèm lồng đèn mini.")}>
              <rect x="290" y="310" width="75" height="140" fill="none" stroke="#d97706" strokeWidth="4" rx="4" />
              {/* Lattice pattern */}
              <line x1="290" y1="340" x2="365" y2="340" stroke="#b45309" strokeWidth="2" />
              <line x1="290" y1="380" x2="365" y2="380" stroke="#b45309" strokeWidth="2" />
              <line x1="290" y1="415" x2="365" y2="415" stroke="#b45309" strokeWidth="2" />
              <line x1="327" y1="310" x2="327" y2="450" stroke="#b45309" strokeWidth="2" />
              {/* Side Door Arch Top */}
              <path d="M 290 310 Q 327 285 365 310" fill="#dc2626" stroke="#b45309" strokeWidth="3" />
              <text x="327" y="303" fill="#fef08a" fontSize="10" fontWeight="bold" textAnchor="middle">CỬA LÁCH</text>
            </g>

            {/* Right Side Door (Cửa lách phải) */}
            <g onClick={() => onSelectHotspot("Cửa lách bên phải trang trí nan tre đối xứng tạo sự trang nhã.")}>
              <rect x="635" y="310" width="75" height="140" fill="none" stroke="#d97706" strokeWidth="4" rx="4" />
              <line x1="635" y1="340" x2="710" y2="340" stroke="#b45309" strokeWidth="2" />
              <line x1="635" y1="380" x2="710" y2="380" stroke="#b45309" strokeWidth="2" />
              <line x1="635" y1="415" x2="710" y2="415" stroke="#b45309" strokeWidth="2" />
              <line x1="672" y1="310" x2="672" y2="450" stroke="#b45309" strokeWidth="2" />
              <path d="M 635 310 Q 672 285 710 310" fill="#dc2626" stroke="#b45309" strokeWidth="3" />
              <text x="672" y="303" fill="#fef08a" fontSize="10" fontWeight="bold" textAnchor="middle">CỬA LÁCH</text>
            </g>
          </g>
        )}

        {/* Front Main Pillars (2 large pillars framing main entrance) */}
        <g 
          className="cursor-pointer" 
          onClick={() => onSelectHotspot(`Kích thước cửa chính: Cao ${config.gateHeight}m, Rộng ${config.gateWidth}m (Chuẩn 1,8m x 1,2m đạt trọn 2đ).`)}
        >
          {/* Left Pillar */}
          <rect x="375" y="240" width="28" height="215" fill="url(#gateWood)" stroke="#78350f" strokeWidth="2" rx="4" />
          {/* Couplet on Left Pillar */}
          <rect x="380" y="260" width="18" height="160" fill="#dc2626" rx="2" />
          <text x="389" y="280" fill="#fef08a" fontSize="9" fontWeight="bold" textAnchor="middle">TRUNG</text>
          <text x="389" y="305" fill="#fef08a" fontSize="9" fontWeight="bold" textAnchor="middle">THU</text>
          <text x="389" y="330" fill="#fef08a" fontSize="9" fontWeight="bold" textAnchor="middle">RỰC</text>
          <text x="389" y="355" fill="#fef08a" fontSize="9" fontWeight="bold" textAnchor="middle">RỠ</text>
          <text x="389" y="380" fill="#fef08a" fontSize="9" fontWeight="bold" textAnchor="middle">ÁNH</text>
          <text x="389" y="405" fill="#fef08a" fontSize="9" fontWeight="bold" textAnchor="middle">SAO</text>

          {/* Right Pillar */}
          <rect x="597" y="240" width="28" height="215" fill="url(#gateWood)" stroke="#78350f" strokeWidth="2" rx="4" />
          {/* Couplet on Right Pillar */}
          <rect x="602" y="260" width="18" height="160" fill="#dc2626" rx="2" />
          <text x="611" y="280" fill="#fef08a" fontSize="9" fontWeight="bold" textAnchor="middle">THIẾU</text>
          <text x="611" y="305" fill="#fef08a" fontSize="9" fontWeight="bold" textAnchor="middle">NHI</text>
          <text x="611" y="330" fill="#fef08a" fontSize="9" fontWeight="bold" textAnchor="middle">CHĂM</text>
          <text x="611" y="355" fill="#fef08a" fontSize="9" fontWeight="bold" textAnchor="middle">NGOAN</text>
          <text x="611" y="380" fill="#fef08a" fontSize="9" fontWeight="bold" textAnchor="middle">TIẾN</text>
          <text x="611" y="405" fill="#fef08a" fontSize="9" fontWeight="bold" textAnchor="middle">BƯỚC</text>
        </g>

        {/* Gate Arch / Roof Structure */}
        <g 
          className="cursor-pointer" 
          onClick={() => onSelectHotspot("Chủ đề hội trại: 'Lồng đèn thắp sáng ước mơ' (5đ chữ đẹp + 2đ màu sắc + 3đ biểu tượng lịch sử = 10đ).")}
        >
          {/* Main Top Crossbeam */}
          <rect x="350" y="225" width="300" height="26" fill="#b45309" stroke="#78350f" strokeWidth="2" rx="3" />

          {/* Curved Asian Pagoda Roof Eaves */}
          <path d="M 320 228 Q 500 210 680 228 L 665 210 Q 500 195 335 210 Z" fill="#b91c1c" stroke="#7f1d1d" strokeWidth="2" />
          <path d="M 310 230 C 330 228, 340 220, 345 208" stroke="#f59e0b" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M 690 230 C 670 228, 660 220, 655 208" stroke="#f59e0b" strokeWidth="4" fill="none" strokeLinecap="round" />

          {/* Main Slogan Banner "LỒNG ĐÈN THẮP SÁNG ƯỚC MƠ" */}
          <rect x="360" y="168" width="280" height="46" fill="#b91c1c" stroke="#facc15" strokeWidth="3" rx="6" />
          <rect x="364" y="172" width="272" height="38" fill="none" stroke="#fde047" strokeWidth="1" strokeDasharray="4 2" />
          <text 
            x="500" 
            y="196" 
            fill="#fef08a" 
            fontSize="13" 
            fontWeight="900" 
            textAnchor="middle" 
            letterSpacing="1"
            className="tracking-wider drop-shadow-sm"
          >
            {config.gateTitle}
          </text>
          <text x="500" y="206" fill="#fde68a" fontSize="7" fontWeight="600" textAnchor="middle">
            TRUNG THU NĂM 2026 • XÃ HẢI ANH
          </text>

          {/* Historical Emblem on Top: Khuê Văn Các / Lotus */}
          <g 
            transform="translate(475, 100)" 
            onClick={() => onSelectHotspot("Biểu tượng lịch sử Khuê Văn Các trên đỉnh cổng trại (đạt trọn 3/3 điểm biểu tượng lịch sử).")}
          >
            {/* Pedestal */}
            <rect x="0" y="45" width="50" height="15" fill="#dc2626" rx="2" stroke="#facc15" strokeWidth="1.5" />
            {/* Pillars of Khue Van Cac */}
            <line x1="8" y1="45" x2="8" y2="25" stroke="#facc15" strokeWidth="4" />
            <line x1="42" y1="45" x2="42" y2="25" stroke="#facc15" strokeWidth="4" />
            {/* Round Sun Window */}
            <circle cx="25" cy="30" r="12" fill="#b91c1c" stroke="#facc15" strokeWidth="2.5" />
            <circle cx="25" cy="30" r="4" fill="#facc15" />
            {/* Multi-tier Pagoda Roof */}
            <polygon points="25,5 2,24 48,24" fill="#991b1b" stroke="#facc15" strokeWidth="2" />
            <polygon points="25,12 8,22 42,22" fill="#f59e0b" />
          </g>
        </g>

        {/* Glowing Traditional Star Lanterns hanging from Gate */}
        <g id="star-lanterns">
          {/* Left Star Lantern */}
          <g 
            transform="translate(325, 245)" 
            filter={isNight ? "url(#lanternGlow)" : undefined}
            className="cursor-pointer"
            onClick={() => onSelectHotspot("Đèn lồng ông sao 5 cánh truyền thống thắp sáng ước mơ đêm rằm.")}
          >
            <line x1="25" y1="0" x2="25" y2="20" stroke="#f8fafc" strokeWidth="1.5" />
            <polygon 
              points="25,20 31,34 46,35 34,44 38,59 25,50 12,59 16,44 4,35 19,34" 
              fill={isNight ? "#fbbf24" : "#ef4444"} 
              stroke="#f59e0b" 
              strokeWidth="2" 
            />
            <circle cx="25" cy="42" r="7" fill={isNight ? "#ffffff" : "#fef08a"} />
          </g>

          {/* Right Star Lantern */}
          <g 
            transform="translate(625, 245)" 
            filter={isNight ? "url(#lanternGlow)" : undefined}
            className="cursor-pointer"
            onClick={() => onSelectHotspot("Đèn lồng ông sao 5 cánh truyền thống thắp sáng ước mơ đêm rằm.")}
          >
            <line x1="25" y1="0" x2="25" y2="20" stroke="#f8fafc" strokeWidth="1.5" />
            <polygon 
              points="25,20 31,34 46,35 34,44 38,59 25,50 12,59 16,44 4,35 19,34" 
              fill={isNight ? "#fbbf24" : "#ef4444"} 
              stroke="#f59e0b" 
              strokeWidth="2" 
            />
            <circle cx="25" cy="42" r="7" fill={isNight ? "#ffffff" : "#fef08a"} />
          </g>
        </g>
      </g>

      {/* ---------------- TECHNICAL MEASUREMENT OVERLAYS ---------------- */}
      {showDimensions && (
        <g id="dimension-lines" className="pointer-events-none text-xs font-mono">
          {/* Gate Width 1.2m dimension */}
          <g>
            <line x1="403" y1="475" x2="597" y2="475" stroke="#ef4444" strokeWidth="2" />
            <line x1="403" y1="468" x2="403" y2="482" stroke="#ef4444" strokeWidth="2" />
            <line x1="597" y1="468" x2="597" y2="482" stroke="#ef4444" strokeWidth="2" />
            <rect x="465" y="465" width="70" height="18" fill="#18181b" rx="4" />
            <text x="500" y="478" fill="#fef08a" fontSize="11" fontWeight="bold" textAnchor="middle">Rộng 1,2 m</text>
          </g>

          {/* Gate Height 1.8m dimension */}
          <g>
            <line x1="345" y1="240" x2="345" y2="455" stroke="#ef4444" strokeWidth="2" />
            <line x1="338" y1="240" x2="352" y2="240" stroke="#ef4444" strokeWidth="2" />
            <line x1="338" y1="455" x2="352" y2="455" stroke="#ef4444" strokeWidth="2" />
            <rect x="290" y="340" width="50" height="24" fill="#18181b" rx="4" />
            <text x="315" y="356" fill="#fef08a" fontSize="11" fontWeight="bold" textAnchor="middle">Cao 1,8m</text>
          </g>

          {/* 80cm knot distance badge */}
          <g>
            <line 
              x1="260" 
              y1="440" 
              x2="300" 
              y2="415" 
              stroke={config.knotDistanceCm === 80 && config.isCloveHitchKnot ? "#10b981" : "#f43f5e"} 
              strokeWidth="2" 
              strokeDasharray="3 2" 
            />
            <circle 
              cx="300" 
              cy="415" 
              r="4" 
              fill={config.knotDistanceCm === 80 && config.isCloveHitchKnot ? "#10b981" : "#f43f5e"} 
            />
            <rect 
              x="170" 
              y="395" 
              width="125" 
              height="20" 
              fill={config.knotDistanceCm === 80 && config.isCloveHitchKnot ? "#064e3b" : "#881337"} 
              rx="4" 
              stroke={config.knotDistanceCm === 80 && config.isCloveHitchKnot ? "#34d399" : "#fda4af"} 
              strokeWidth="1" 
            />
            <text 
              x="232" 
              y="409" 
              fill={config.knotDistanceCm === 80 && config.isCloveHitchKnot ? "#a7f3d0" : "#ffe4e6"} 
              fontSize="10" 
              fontWeight="bold" 
              textAnchor="middle"
            >
              {config.knotDistanceCm === 80 && config.isCloveHitchKnot 
                ? '✓ Nút cọc = 80cm (4đ)' 
                : `⚠ Cọc ${config.knotDistanceCm}cm (${config.isCloveHitchKnot ? 'Thuyền chài' : 'Sai nút'})`}
            </text>
          </g>
        </g>
      )}
    </svg>
  );
};

// ==========================================
// 2. GATE DETAIL SVG VIEW (KÍCH THƯỚC CỔNG 1.8 x 1.2M)
// ==========================================
const GateDetailSvg: React.FC<{
  config: CampVisualConfig;
  isNight: boolean;
  showDimensions: boolean;
  onSelectHotspot: (desc: string) => void;
}> = ({ config, isNight, showDimensions, onSelectHotspot }) => {
  const isHopKep = config.gateType === 'hop_kep';
  const isHopDon = config.gateType === 'hop_don';
  const isCongDon = config.gateType === 'cong_don';
  const isCraft = config.decorationType === 'craft';

  return (
    <svg viewBox="0 0 900 560" className="w-full h-full drop-shadow-lg">
      <defs>
        <linearGradient id="gateDetailWood" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#78350f" />
          <stop offset="35%" stopColor="#b45309" />
          <stop offset="70%" stopColor="#d97706" />
          <stop offset="100%" stopColor="#78350f" />
        </linearGradient>
        <linearGradient id="bambooPole" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#65a30d" />
          <stop offset="40%" stopColor="#a3e635" />
          <stop offset="70%" stopColor="#84cc16" />
          <stop offset="100%" stopColor="#4d7c0f" />
        </linearGradient>
      </defs>

      {/* Background soft glow */}
      <rect x="120" y="70" width="660" height="440" rx="16" fill={isNight ? "#0f172a" : "#ffffff"} opacity={isNight ? "0.85" : "0.5"} />

      {/* ---------------- 1. PILLARS & STRUCTURE RENDERING ACCORDING TO GATE TYPE ---------------- */}
      {isHopKep && (
        <>
          {/* Rear Left & Right Pillars (perspective box) */}
          <rect x="235" y="150" width="35" height="320" fill="#92400e" rx="4" />
          <rect x="630" y="150" width="35" height="320" fill="#92400e" rx="4" />

          {/* Diagonal brace beams showing 3D box square frame */}
          <line x1="250" y1="180" x2="295" y2="210" stroke="#78350f" strokeWidth="10" />
          <line x1="250" y1="380" x2="295" y2="410" stroke="#78350f" strokeWidth="10" />
          <line x1="650" y1="180" x2="605" y2="210" stroke="#78350f" strokeWidth="10" />
          <line x1="650" y1="380" x2="605" y2="410" stroke="#78350f" strokeWidth="10" />

          {/* Left Wing Door (Cửa lách 1) */}
          <g className="cursor-pointer" onClick={() => onSelectHotspot("Cửa lách bên trái theo quy định cổng hộp kép (đạt trọn 7/7đ loại cổng).")}>
            <rect x="170" y="240" width="80" height="230" fill="#fef2f2" opacity="0.15" rx="4" />
            <rect x="170" y="240" width="80" height="230" fill="none" stroke="#d97706" strokeWidth="4" rx="4" />
            {/* Diamond trellis pattern */}
            <path d="M 170 270 L 250 350 M 170 330 L 250 410 M 170 390 L 250 470" stroke="#b45309" strokeWidth="2" />
            <path d="M 250 270 L 170 350 M 250 330 L 170 410 M 250 390 L 170 470" stroke="#b45309" strokeWidth="2" />
            <rect x="180" y="250" width="60" height="25" fill="#dc2626" rx="3" />
            <text x="210" y="267" fill="#fef08a" fontSize="10" fontWeight="bold" textAnchor="middle">CỬA LÁCH</text>
          </g>

          {/* Right Wing Door (Cửa lách 2) */}
          <g className="cursor-pointer" onClick={() => onSelectHotspot("Cửa lách bên phải cân đối đối xứng đẹp mắt chuẩn mực hội thi.")}>
            <rect x="650" y="240" width="80" height="230" fill="#fef2f2" opacity="0.15" rx="4" />
            <rect x="650" y="240" width="80" height="230" fill="none" stroke="#d97706" strokeWidth="4" rx="4" />
            <path d="M 650 270 L 730 350 M 650 330 L 730 410 M 650 390 L 730 470" stroke="#b45309" strokeWidth="2" />
            <path d="M 730 270 L 650 350 M 730 330 L 650 410 M 730 390 L 650 470" stroke="#b45309" strokeWidth="2" />
            <rect x="660" y="250" width="60" height="25" fill="#dc2626" rx="3" />
            <text x="690" y="267" fill="#fef08a" fontSize="10" fontWeight="bold" textAnchor="middle">CỬA LÁCH</text>
          </g>
        </>
      )}

      {isHopDon && (
        <>
          {/* Missing Side Door Alerts instead of actual doors */}
          <g 
            className="cursor-pointer" 
            onClick={() => onSelectHotspot("Cổng hộp đơn (chỉ có 2 trụ chính, thiếu 2 cửa lách) chỉ đạt 5/7 điểm. Hãy chọn Cổng hộp kép để đạt điểm tối đa.")}
          >
            <rect x="170" y="260" width="80" height="190" fill="#fee2e2" opacity="0.2" rx="4" stroke="#f87171" strokeWidth="2" strokeDasharray="6 4" />
            <text x="210" y="340" fill="#ef4444" fontSize="11" fontWeight="bold" textAnchor="middle">THIẾU CỬA LÁCH</text>
            <text x="210" y="360" fill="#b91c1c" fontSize="9" textAnchor="middle">(Trừ 2.0 đ)</text>

            <rect x="650" y="260" width="80" height="190" fill="#fee2e2" opacity="0.2" rx="4" stroke="#f87171" strokeWidth="2" strokeDasharray="6 4" />
            <text x="690" y="340" fill="#ef4444" fontSize="11" fontWeight="bold" textAnchor="middle">THIẾU CỬA LÁCH</text>
            <text x="690" y="360" fill="#b91c1c" fontSize="9" textAnchor="middle">(Trừ 2.0 đ)</text>
          </g>
        </>
      )}

      {isCongDon && (
        <>
          {/* Rustic Bamboo Posts with Bamboo Nodes */}
          <g onClick={() => onSelectHotspot("Cổng đơn giản bằng tre mộc: Thiếu khung hộp và cửa lách, bị trừ 4 điểm so với quy chuẩn hội trại.")}>
            <rect x="285" y="170" width="30" height="300" fill="url(#bambooPole)" stroke="#3f6212" strokeWidth="2" rx="2" />
            <line x1="285" y1="230" x2="315" y2="230" stroke="#365314" strokeWidth="3" />
            <line x1="285" y1="290" x2="315" y2="290" stroke="#365314" strokeWidth="3" />
            <line x1="285" y1="350" x2="315" y2="350" stroke="#365314" strokeWidth="3" />
            <line x1="285" y1="410" x2="315" y2="410" stroke="#365314" strokeWidth="3" />

            <rect x="585" y="170" width="30" height="300" fill="url(#bambooPole)" stroke="#3f6212" strokeWidth="2" rx="2" />
            <line x1="585" y1="230" x2="615" y2="230" stroke="#365314" strokeWidth="3" />
            <line x1="585" y1="290" x2="615" y2="290" stroke="#365314" strokeWidth="3" />
            <line x1="585" y1="350" x2="615" y2="350" stroke="#365314" strokeWidth="3" />
            <line x1="585" y1="410" x2="615" y2="410" stroke="#365314" strokeWidth="3" />
          </g>
        </>
      )}

      {/* Front Main Pillars (for Hop Kep and Hop Don) */}
      {!isCongDon && (
        <>
          <rect x="280" y="170" width="40" height="300" fill="url(#gateDetailWood)" stroke="#78350f" strokeWidth="2" rx="4" />
          <rect x="580" y="170" width="40" height="300" fill="url(#gateDetailWood)" stroke="#78350f" strokeWidth="2" rx="4" />
        </>
      )}

      {/* Front Entrance Opening (Cửa chính 1.8 x 1.2m) */}
      <rect 
        x="320" 
        y="200" 
        width="260" 
        height="270" 
        fill={isNight ? "#1e1b4b" : "#f0f9ff"} 
        opacity="0.35" 
        stroke="#ef4444" 
        strokeWidth="2" 
        strokeDasharray="6 4" 
      />

      {/* Main Arch & Eaves */}
      <path d="M 230 170 Q 450 140 670 170 L 650 140 Q 450 115 250 140 Z" fill="#991b1b" stroke="#7f1d1d" strokeWidth="2" />
      <path d="M 220 172 C 240 168 255 155 260 135" stroke="#f59e0b" strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M 680 172 C 660 168 645 155 640 135" stroke="#f59e0b" strokeWidth="5" fill="none" strokeLinecap="round" />

      {/* ---------------- 2. TITLE BOARD & DECORATION (CRAFT 3D VS PRINT HIFLEX) ---------------- */}
      {isCraft ? (
        <g 
          className="cursor-pointer" 
          onClick={() => onSelectHotspot("Trang trí thủ công chữ nổi xốp 3D đắp nổi viền LED (đạt 5/5đ tối đa).")}
        >
          {/* 3D Beveled Title Board with LED strip */}
          <rect x="270" y="85" width="360" height="60" fill="#b91c1c" stroke="#facc15" strokeWidth="4" rx="8" />
          {/* LED light dots rim */}
          <line x1="280" y1="90" x2="620" y2="90" stroke="#fef08a" strokeWidth="2" strokeDasharray="8 6" />
          <line x1="280" y1="140" x2="620" y2="140" stroke="#fef08a" strokeWidth="2" strokeDasharray="8 6" />
          {/* 3D Embossed Gold Text with Drop Shadow */}
          <text x="452" y="124" fill="#78350f" fontSize="16" fontWeight="900" textAnchor="middle" letterSpacing="2">
            {config.gateTitle}
          </text>
          <text x="450" y="122" fill="#fef08a" fontSize="16" fontWeight="900" textAnchor="middle" letterSpacing="2">
            {config.gateTitle}
          </text>
          <text x="450" y="137" fill="#fde68a" fontSize="9" fontWeight="600" textAnchor="middle">
            BAN TỔ CHỨC TRUNG THU XÃ HẢI ANH • THI ĐUA NĂM 2026
          </text>
        </g>
      ) : (
        <g 
          className="cursor-pointer" 
          onClick={() => onSelectHotspot("Bạt in phun vi tính phẳng Hiflex: Tiện lợi nhưng bị trừ 2 điểm do không sử dụng chữ nổi thủ công theo tiêu chí ban giám khảo.")}
        >
          {/* Flat Printed Hiflex Vinyl Banner */}
          <rect x="270" y="85" width="360" height="60" fill="#ffffff" stroke="#94a3b8" strokeWidth="2" rx="2" />
          {/* Metal Grommets & Zip ties at 4 corners */}
          <circle cx="278" cy="93" r="5" fill="#e2e8f0" stroke="#64748b" strokeWidth="2" />
          <circle cx="622" cy="93" r="5" fill="#e2e8f0" stroke="#64748b" strokeWidth="2" />
          <circle cx="278" cy="137" r="5" fill="#e2e8f0" stroke="#64748b" strokeWidth="2" />
          <circle cx="622" cy="137" r="5" fill="#e2e8f0" stroke="#64748b" strokeWidth="2" />
          {/* Flat printed text */}
          <text x="450" y="120" fill="#1e293b" fontSize="15" fontWeight="bold" textAnchor="middle">
            {config.gateTitle}
          </text>
          <text x="450" y="135" fill="#64748b" fontSize="8" textAnchor="middle">
            [BẠT IN HIFLEX PHẲNG - BỊ TRỪ 2 ĐIỂM QUY CHUẨN]
          </text>
        </g>
      )}

      {/* Historical Emblem on Top: Khue Van Cac */}
      <g transform="translate(425, 20)" className="cursor-pointer" onClick={() => onSelectHotspot("Biểu tượng lịch sử Khuê Văn Các trên đỉnh cổng (đạt 3/3đ).")}>
        <circle cx="25" cy="32" r="28" fill="#dc2626" stroke="#facc15" strokeWidth="2" />
        <polygon points="25,12 8,24 42,24" fill="#fef08a" />
        <rect x="12" y="24" width="26" height="18" fill="#991b1b" stroke="#fef08a" strokeWidth="1.5" />
        <circle cx="25" cy="33" r="5" fill="#fef08a" />
        <line x1="8" y1="42" x2="42" y2="42" stroke="#fef08a" strokeWidth="3" />
      </g>

      {/* Vertical Couplets on Pillars */}
      <rect x="286" y="210" width="28" height="230" fill={isCraft ? "#dc2626" : "#cbd5e1"} rx="2" stroke={isCraft ? "#facc15" : "#64748b"} strokeWidth={isCraft ? 1.5 : 1} />
      <text x="300" y="235" fill={isCraft ? "#fef08a" : "#1e293b"} fontSize="11" fontWeight="bold" textAnchor="middle">HẢI</text>
      <text x="300" y="265" fill={isCraft ? "#fef08a" : "#1e293b"} fontSize="11" fontWeight="bold" textAnchor="middle">ANH</text>
      <text x="300" y="295" fill={isCraft ? "#fef08a" : "#1e293b"} fontSize="11" fontWeight="bold" textAnchor="middle">NÁO</text>
      <text x="300" y="325" fill={isCraft ? "#fef08a" : "#1e293b"} fontSize="11" fontWeight="bold" textAnchor="middle">NỨC</text>
      <text x="300" y="355" fill={isCraft ? "#fef08a" : "#1e293b"} fontSize="11" fontWeight="bold" textAnchor="middle">HỘI</text>
      <text x="300" y="385" fill={isCraft ? "#fef08a" : "#1e293b"} fontSize="11" fontWeight="bold" textAnchor="middle">TRĂNG</text>
      <text x="300" y="415" fill={isCraft ? "#fef08a" : "#1e293b"} fontSize="11" fontWeight="bold" textAnchor="middle">RẰM</text>

      <rect x="586" y="210" width="28" height="230" fill={isCraft ? "#dc2626" : "#cbd5e1"} rx="2" stroke={isCraft ? "#facc15" : "#64748b"} strokeWidth={isCraft ? 1.5 : 1} />
      <text x="600" y="235" fill={isCraft ? "#fef08a" : "#1e293b"} fontSize="11" fontWeight="bold" textAnchor="middle">THIẾU</text>
      <text x="600" y="265" fill={isCraft ? "#fef08a" : "#1e293b"} fontSize="11" fontWeight="bold" textAnchor="middle">NHI</text>
      <text x="600" y="295" fill={isCraft ? "#fef08a" : "#1e293b"} fontSize="11" fontWeight="bold" textAnchor="middle">VỮNG</text>
      <text x="600" y="325" fill={isCraft ? "#fef08a" : "#1e293b"} fontSize="11" fontWeight="bold" textAnchor="middle">BƯỚC</text>
      <text x="600" y="355" fill={isCraft ? "#fef08a" : "#1e293b"} fontSize="11" fontWeight="bold" textAnchor="middle">TIẾN</text>
      <text x="600" y="385" fill={isCraft ? "#fef08a" : "#1e293b"} fontSize="11" fontWeight="bold" textAnchor="middle">TƯƠNG</text>
      <text x="600" y="415" fill={isCraft ? "#fef08a" : "#1e293b"} fontSize="11" fontWeight="bold" textAnchor="middle">LAI</text>

      {/* ---------------- TECHNICAL MEASUREMENTS & STATUS BADGES ---------------- */}
      {showDimensions && (
        <g id="gate-dimension-annotations" className="text-xs font-mono">
          {/* Height Dimension (Cao 1.8m) */}
          <g>
            <line x1="330" y1="200" x2="330" y2="470" stroke="#ef4444" strokeWidth="2.5" />
            <polygon points="330,200 326,210 334,210" fill="#ef4444" />
            <polygon points="330,470 326,460 334,460" fill="#ef4444" />
            <rect x="338" y="320" width="95" height="26" fill="#7f1d1d" rx="4" stroke="#fca5a5" strokeWidth="1" />
            <text x="385" y="337" fill="#fef08a" fontSize="12" fontWeight="bold" textAnchor="middle">Cao = 1,8 m</text>
          </g>

          {/* Width Dimension (Rộng 1.2m) */}
          <g>
            <line x1="320" y1="485" x2="580" y2="485" stroke="#ef4444" strokeWidth="2.5" />
            <polygon points="320,485 330,481 330,489" fill="#ef4444" />
            <polygon points="580,485 570,481 570,489" fill="#ef4444" />
            <rect x="400" y="495" width="100" height="26" fill="#7f1d1d" rx="4" stroke="#fca5a5" strokeWidth="1" />
            <text x="450" y="512" fill="#fef08a" fontSize="12" fontWeight="bold" textAnchor="middle">Rộng = 1,2 m</text>
          </g>

          {/* Gate Type Badge */}
          <rect 
            x="740" 
            y="170" 
            width="145" 
            height="62" 
            fill="#18181b" 
            rx="6" 
            stroke={isHopKep ? "#fbbf24" : isHopDon ? "#f97316" : "#f43f5e"} 
            strokeWidth="1.5" 
          />
          <text x="812" y="188" fill={isHopKep ? "#fbbf24" : isHopDon ? "#f97316" : "#f43f5e"} fontSize="10" fontWeight="bold" textAnchor="middle">
            {isHopKep ? "HỘP KÉP 4 TRỤ" : isHopDon ? "HỘP ĐƠN 2 TRỤ" : "CỔNG ĐƠN GIẢN"}
          </text>
          <text x="812" y="204" fill="#e4e4e7" fontSize="9" textAnchor="middle">
            {isHopKep ? "2 Cửa lách 2 bên" : isHopDon ? "Thiếu cửa lách phụ" : "Tre mộc đơn sơ"}
          </text>
          <text x="812" y="220" fill={isHopKep ? "#4ade80" : isHopDon ? "#fbbf24" : "#f87171"} fontSize="10" fontWeight="bold" textAnchor="middle">
            {isHopKep ? "✓ 7.0 / 7.0 điểm" : isHopDon ? "⚠ 5.0 / 7.0 điểm" : "❌ 3.0 / 7.0 điểm"}
          </text>

          {/* Decoration Badge */}
          <rect 
            x="740" 
            y="245" 
            width="145" 
            height="48" 
            fill="#18181b" 
            rx="6" 
            stroke={isCraft ? "#34d399" : "#94a3b8"} 
            strokeWidth="1.5" 
          />
          <text x="812" y="263" fill={isCraft ? "#34d399" : "#cbd5e1"} fontSize="10" fontWeight="bold" textAnchor="middle">
            {isCraft ? "CHỮ NỔI 3D THỦ CÔNG" : "BẠT IN HIFLEX PHẲNG"}
          </text>
          <text x="812" y="280" fill={isCraft ? "#4ade80" : "#fb7185"} fontSize="9" fontWeight="bold" textAnchor="middle">
            {isCraft ? "✓ 5.0 / 5.0 điểm" : "⚠ 3.0 / 5.0 điểm (Trừ 2đ)"}
          </text>
        </g>
      )}
    </svg>
  );
};

// ==========================================
// 3. INTERIOR CAMP SVG (BỐ TRÍ CHUẨN NỘI THẤT TRẠI)
// ==========================================
const InteriorCampSvg: React.FC<{
  config: CampVisualConfig;
  isNight: boolean;
  showDimensions: boolean;
  onSelectHotspot: (desc: string) => void;
}> = ({ config, isNight, showDimensions, onSelectHotspot }) => {
  return (
    <svg viewBox="0 0 1000 580" className="w-full h-full drop-shadow-lg">
      <defs>
        <linearGradient id="backTentWall" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1e3a8a" />
          <stop offset="100%" stopColor="#172554" />
        </linearGradient>
      </defs>

      {/* Tent Interior Enclosure */}
      <polygon points="500,40 120,240 120,530 880,530 880,240" fill="url(#backTentWall)" stroke="#38bdf8" strokeWidth="3" />

      {/* Main Center Pole 1.8m */}
      <rect x="492" y="40" width="16" height="490" fill="#d97706" rx="2" stroke="#78350f" strokeWidth="2" />
      <circle cx="500" cy="50" r="14" fill="#fbbf24" />

      {/* ---------------- 1. TRÊN CÙNG: CỜ TỔ QUỐC, ẢNH BÁC, 5 ĐIỀU BÁC DẠY (4đ) ---------------- */}
      <g 
        className="cursor-pointer" 
        onClick={() => onSelectHotspot("Vị trí TRÊN CÙNG CHÍNH GIỮA: Cờ Tổ quốc, ảnh Bác Hồ, 5 điều Bác Hồ dạy (đạt trọn 4/4 điểm). Treo sai vị trí sẽ bị trừ 1 điểm.")}
      >
        {/* National Flag (Cờ Tổ quốc trên cùng) */}
        <g transform="translate(435, 75)">
          <rect x="0" y="0" width="130" height="75" fill="#dc2626" stroke="#facc15" strokeWidth="2" rx="3" />
          {/* Yellow Star */}
          <polygon 
            points="65,15 72,32 90,32 75,44 81,61 65,51 49,61 55,44 40,32 58,32" 
            fill="#facc15" 
          />
        </g>

        {/* Uncle Ho Portrait (Ảnh Bác Hồ ngay dưới cờ) */}
        <g transform="translate(450, 160)">
          {/* Golden Frame */}
          <rect x="0" y="0" width="100" height="120" fill="#fef08a" stroke="#d97706" strokeWidth="5" rx="4" />
          {/* Inner Photo Background */}
          <rect x="6" y="6" width="88" height="108" fill="#fef3c7" />
          {/* Stylized Uncle Ho Silhouette / Icon */}
          <circle cx="50" cy="45" r="24" fill="#d97706" opacity="0.3" />
          <path d="M 32 75 C 32 60 68 60 68 75 Z" fill="#b45309" opacity="0.4" />
          {/* White Beard */}
          <path d="M 44 55 Q 50 72 56 55 Z" fill="#ffffff" />
          <text x="50" y="105" fill="#78350f" fontSize="8" fontWeight="bold" textAnchor="middle">CHỦ TỊCH HỒ CHÍ MINH</text>
        </g>

        {/* 5 Teachings of Uncle Ho (5 Điều Bác Hồ Dạy) */}
        <g transform="translate(415, 290)">
          <rect x="0" y="0" width="170" height="70" fill="#dc2626" stroke="#facc15" strokeWidth="2" rx="4" />
          <text x="85" y="16" fill="#fef08a" fontSize="9" fontWeight="bold" textAnchor="middle">5 ĐIỀU BÁC HỒ DẠY</text>
          <line x1="20" y1="21" x2="150" y2="21" stroke="#facc15" strokeWidth="1" />
          <text x="10" y="32" fill="#ffffff" fontSize="7">1. Yêu Tổ quốc, yêu đồng bào</text>
          <text x="10" y="42" fill="#ffffff" fontSize="7">2. Học tập tốt, lao động tốt</text>
          <text x="10" y="52" fill="#ffffff" fontSize="7">3. Đoàn kết tốt, kỷ luật tốt</text>
          <text x="10" y="62" fill="#ffffff" fontSize="7">4. Giữ gìn vệ sinh thật tốt</text>
          <text x="95" y="62" fill="#ffffff" fontSize="7">5. Khiêm tốn, thật thà, dũng cảm</text>
        </g>
      </g>

      {/* ---------------- 2. BÀN THỜ BÁC: MÂM NGŨ QUẢ & LỌ HOA (4đ) ---------------- */}
      <g 
        className="cursor-pointer" 
        onClick={() => onSelectHotspot("Bàn trung tâm: Mâm ngũ quả Trung thu truyền thống có tỉa chó bưởi + Lọ hoa cúc/huệ tươi (đạt 4/4 điểm).")}
      >
        {/* Table Altar */}
        <rect x="380" y="375" width="240" height="90" fill="#991b1b" stroke="#f59e0b" strokeWidth="3" rx="4" />
        <rect x="385" y="380" width="230" height="15" fill="#b91c1c" />
        {/* Table Cover Front Tassel */}
        <path d="M 380 400 L 400 420 L 420 400 L 440 420 L 460 400 L 480 420 L 500 400 L 520 420 L 540 400 L 560 420 L 580 400 L 600 420 L 620 400" fill="none" stroke="#facc15" strokeWidth="3" />

        {/* Five-Fruit Tray (Mâm Ngũ Quả Trung Thu) */}
        <g transform="translate(440, 310)">
          {/* Golden Tray */}
          <ellipse cx="60" cy="70" rx="55" ry="12" fill="#fbbf24" stroke="#d97706" strokeWidth="2" />
          {/* Banana Bunch */}
          <path d="M 25 65 Q 60 75 95 65" stroke="#16a34a" strokeWidth="12" fill="none" strokeLinecap="round" />
          {/* Watermelon Carved */}
          <circle cx="60" cy="52" r="18" fill="#15803d" stroke="#166534" strokeWidth="2" />
          <circle cx="60" cy="52" r="13" fill="#dc2626" />
          <text x="60" y="55" fill="#fef08a" fontSize="7" fontWeight="bold" textAnchor="middle">THU 2026</text>
          {/* Pomelo Dog (Chó Bưởi truyền thống) */}
          <ellipse cx="35" cy="50" rx="14" ry="12" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.5" />
          <circle cx="30" cy="45" r="2" fill="#000" />
          <circle cx="40" cy="45" r="2" fill="#000" />
          <ellipse cx="35" cy="52" r="2" fill="#dc2626" />
          {/* Red Persimmons, Dragonfruit */}
          <circle cx="85" cy="54" r="10" fill="#ea580c" />
          <circle cx="75" cy="42" r="9" fill="#f43f5e" />
        </g>

        {/* Flower Vase (Lọ hoa tươi) */}
        <g transform="translate(560, 315)">
          <path d="M 20 65 L 15 35 L 25 35 L 20 65 Z" fill="#ffffff" stroke="#0284c7" strokeWidth="2" />
          {/* Yellow Chrysanthemum Flowers */}
          <circle cx="20" cy="22" r="8" fill="#facc15" stroke="#eab308" strokeWidth="1" />
          <circle cx="12" cy="28" r="6" fill="#facc15" />
          <circle cx="28" cy="28" r="6" fill="#facc15" />
        </g>
      </g>

      {/* ---------------- 3. BÊN PHẢI: GÓC HỌC TẬP (BÀN, ĐÈN, SÁCH VỞ, BÚT MỰC) (4đ) ---------------- */}
      <g 
        className="cursor-pointer" 
        onClick={() => onSelectHotspot("Góc học tập: BẮT BUỘC ở BÊN PHẢI trại (gồm sách vở, bút mực, bàn học, đèn học) đạt 4/4 điểm. Đặt sai bên trái bị trừ 1 điểm.")}
      >
        <g transform="translate(680, 220)">
          {/* Signboard for Study Corner */}
          <rect x="10" y="0" width="170" height="28" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" rx="4" />
          <text x="95" y="18" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">
            GÓC HỌC TẬP (BÊN PHẢI)
          </text>

          {/* Student Desk (Bàn học sinh) */}
          <rect x="10" y="170" width="170" height="70" fill="#d97706" stroke="#92400e" strokeWidth="3" rx="3" />
          <line x1="25" y1="240" x2="25" y2="300" stroke="#78350f" strokeWidth="6" />
          <line x1="165" y1="240" x2="165" y2="300" stroke="#78350f" strokeWidth="6" />

          {/* Desk Lamp (Đèn học) */}
          <path d="M 35 170 L 35 120 L 55 110" stroke="#ef4444" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M 50 105 L 68 115 L 55 125 Z" fill="#ef4444" />
          <polygon points="55,120 40,170 80,170" fill="#fef08a" opacity={isNight ? "0.6" : "0.3"} />

          {/* Stack of Clean Notebooks (Sách vở sạch chữ đẹp) */}
          <rect x="75" y="155" width="45" height="15" fill="#38bdf8" rx="2" stroke="#0284c7" strokeWidth="1" />
          <rect x="78" y="145" width="40" height="12" fill="#ec4899" rx="2" stroke="#be185d" strokeWidth="1" />
          <rect x="80" y="135" width="35" height="12" fill="#a855f7" rx="2" stroke="#7e22ce" strokeWidth="1" />
          <text x="97" y="143" fill="#ffffff" fontSize="7" fontWeight="bold" textAnchor="middle">ĐIỂM 10</text>

          {/* Ink Bottle & Fountain Pen (Bút mực, lọ mực) */}
          <rect x="135" y="152" width="16" height="18" fill="#1e1b4b" stroke="#6366f1" strokeWidth="1" rx="2" />
          <line x1="148" y1="140" x2="162" y2="165" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
        </g>
      </g>

      {/* ---------------- 4. BÊN TRÁI: KHẨU HIỆU NĂM HỌC 2026-2027 (4đ) & TRANH TRUYỆN (1đ) ---------------- */}
      <g 
        className="cursor-pointer" 
        onClick={() => onSelectHotspot("Khẩu hiệu năm học: BẮT BUỘC ở BÊN TRÁI trại: 'Thiếu nhi Ninh Bình vững bước tiến vào kỷ nguyên mới' (4đ) + Giá tranh truyện (1đ). Treo sai bên bị trừ 1 điểm.")}
      >
        <g transform="translate(140, 220)">
          {/* Main Slogan Banner on the LEFT */}
          <rect x="0" y="0" width="220" height="75" fill="#dc2626" stroke="#facc15" strokeWidth="3" rx="6" />
          <text x="110" y="22" fill="#fef08a" fontSize="10" fontWeight="bold" textAnchor="middle">
            CHỦ ĐỀ NĂM HỌC 2026 - 2027
          </text>
          <line x1="20" y1="28" x2="200" y2="28" stroke="#facc15" strokeWidth="1" />
          <text x="110" y="46" fill="#ffffff" fontSize="11" fontWeight="800" textAnchor="middle">
            "Thiếu nhi Ninh Bình
          </text>
          <text x="110" y="62" fill="#ffffff" fontSize="11" fontWeight="800" textAnchor="middle">
            vững bước tiến vào kỷ nguyên mới"
          </text>

          {/* Comic Books Rack (Tranh truyện kèm theo - 1đ) */}
          <g transform="translate(15, 95)">
            <rect x="0" y="0" width="190" height="120" fill="#065f46" stroke="#34d399" strokeWidth="2" rx="4" />
            <text x="95" y="20" fill="#a7f3d0" fontSize="10" fontWeight="bold" textAnchor="middle">
              GIÁ TRANH TRUYỆN THIẾU NHI
            </text>
            {/* Books display */}
            <rect x="15" y="32" width="45" height="60" fill="#f97316" rx="2" stroke="#ea580c" strokeWidth="1" />
            <text x="37" y="55" fill="#ffffff" fontSize="7" fontWeight="bold" textAnchor="middle">DORAEMON</text>

            <rect x="70" y="32" width="45" height="60" fill="#3b82f6" rx="2" stroke="#2563eb" strokeWidth="1" />
            <text x="92" y="55" fill="#ffffff" fontSize="7" fontWeight="bold" textAnchor="middle">THẦN ĐỒNG</text>
            <text x="92" y="65" fill="#ffffff" fontSize="6" textAnchor="middle">ĐẤT VIỆT</text>

            <rect x="125" y="32" width="45" height="60" fill="#ec4899" rx="2" stroke="#db2777" strokeWidth="1" />
            <text x="147" y="55" fill="#ffffff" fontSize="7" fontWeight="bold" textAnchor="middle">BÁO TNTP</text>
          </g>
        </g>
      </g>

      {/* ---------------- 5. TRANG THIẾT BỊ CỦA ĐỘI: TRỐNG ĐỘI, CỜ ĐỘI (1đ) ---------------- */}
      <g 
        transform="translate(180, 445)" 
        className="cursor-pointer"
        onClick={() => onSelectHotspot("Trang thiết bị của Đội: Bộ trống Đội (1 trống cái, 2 trống con) và cờ Đội TNTP Hồ Chí Minh (đạt 1/1 điểm).")}
      >
        {/* Pioneer Flag (Cờ Đội) */}
        <line x1="0" y1="0" x2="0" y2="75" stroke="#94a3b8" strokeWidth="4" />
        <polygon points="0,0 45,15 0,30" fill="#dc2626" stroke="#facc15" strokeWidth="1.5" />
        <circle cx="15" cy="15" r="6" fill="#facc15" />

        {/* Big Bass Drum (Trống cái) */}
        <ellipse cx="65" cy="45" rx="28" ry="14" fill="#e2e8f0" stroke="#dc2626" strokeWidth="4" />
        <rect x="37" y="45" width="56" height="28" fill="#dc2626" rx="2" />
        <ellipse cx="65" cy="73" rx="28" ry="12" fill="#cbd5e1" stroke="#dc2626" strokeWidth="3" />
        <text x="65" y="62" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle">ĐỘI TNTP</text>

        {/* Snare Drum (Trống con) */}
        <ellipse cx="115" cy="55" rx="18" ry="10" fill="#e2e8f0" stroke="#dc2626" strokeWidth="3" />
        <rect x="97" y="55" width="36" height="18" fill="#dc2626" />
        <ellipse cx="115" cy="73" rx="18" ry="8" fill="#cbd5e1" stroke="#dc2626" strokeWidth="2" />
      </g>

      {/* ---------------- 6. ÁNH SÁNG TỐT & ĐÈN LỒNG CHIẾU SÁNG (2đ) ---------------- */}
      <g id="lighting-system" onClick={() => onSelectHotspot("Ánh sáng tốt: Hệ thống bóng led an toàn, đèn lồng ông sao tỏa sáng ấm cúng (đạt 2/2 điểm).")}>
        {/* Main overhead LED bulb */}
        <circle cx="500" cy="120" r="10" fill="#ffffff" stroke="#facc15" strokeWidth="2" />
        {isNight && (
          <circle cx="500" cy="120" r="140" fill="#fef08a" opacity="0.15" pointerEvents="none" />
        )}
      </g>

      {/* POSITIONAL GUIDELINES BADGES */}
      {showDimensions && (
        <g id="interior-guide-lines" className="pointer-events-none text-xs font-mono">
          {/* Top Center Guide */}
          <rect x="375" y="10" width="250" height="24" fill="#18181b" rx="4" stroke="#fbbf24" strokeWidth="1" />
          <text x="500" y="26" fill="#fef08a" fontSize="11" fontWeight="bold" textAnchor="middle">
            VỊ TRÍ TRÊN CÙNG: CỜ - ẢNH BÁC - 5 ĐIỀU
          </text>

          {/* Left Guide Indicator */}
          <rect x="140" y="185" width="220" height="24" fill="#18181b" rx="4" stroke="#ef4444" strokeWidth="1" />
          <text x="250" y="201" fill="#fca5a5" fontSize="11" fontWeight="bold" textAnchor="middle">
            BÊN TRÁI: KHẨU HIỆU NĂM HỌC
          </text>

          {/* Right Guide Indicator */}
          <rect x="680" y="185" width="210" height="24" fill="#18181b" rx="4" stroke="#38bdf8" strokeWidth="1" />
          <text x="785" y="201" fill="#bae6fd" fontSize="11" fontWeight="bold" textAnchor="middle">
            BÊN PHẢI: GÓC HỌC TẬP
          </text>
        </g>
      )}
    </svg>
  );
};

// ==========================================
// 4. TECHNICAL BLUEPRINT SVG (SƠ ĐỒ KỸ THUẬT CỌC, NÚT BUỘC 80CM)
// ==========================================
const TechnicalBlueprintSvg: React.FC<{
  config: CampVisualConfig;
  isNight: boolean;
  showDimensions: boolean;
  onSelectHotspot: (desc: string) => void;
}> = ({ config, isNight, showDimensions, onSelectHotspot }) => {
  return (
    <svg viewBox="0 0 1000 560" className="w-full h-full drop-shadow-lg font-mono">
      <defs>
        {/* Blueprint Grid pattern */}
        <pattern id="blueprintGrid" width="30" height="30" patternUnits="userSpaceOnUse">
          <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#0284c7" strokeWidth="0.5" opacity="0.4" />
        </pattern>
      </defs>

      {/* Blueprint Canvas Background */}
      <rect x="0" y="0" width="1000" height="560" fill="#082f49" />
      <rect x="0" y="0" width="1000" height="560" fill="url(#blueprintGrid)" />

      {/* Blueprint Header */}
      <rect x="40" y="20" width="920" height="50" fill="#0c4a6e" stroke="#38bdf8" strokeWidth="2" rx="6" />
      <text x="70" y="48" fill="#f0f9ff" fontSize="16" fontWeight="bold">
        BẢN VẼ QUY CHUẨN KỸ THUẬT DỰNG TRẠI THU XÃ HẢI ANH 2026
      </text>
      <text x="930" y="48" fill="#38bdf8" fontSize="12" textAnchor="end">
        TỶ LỆ KỸ THUẬT: 1/20 • KHOẢNG CÁCH CHUẨN ĐO ĐẠC
      </text>

      {/* ---------------- LEFT PANEL: 80CM COIN KNOT TO STAKE DETAIL ---------------- */}
      <g 
        transform="translate(60, 90)" 
        className="cursor-pointer"
        onClick={() => onSelectHotspot("Khoảng cách từ nút đồng xu tới cọc con là 80 cm, buộc dây theo kiểu nút thuyền chài (đạt trọn 4/4 điểm kỹ thuật). Sai nút trừ 2đ, sai khoảng cách trừ 1.5đ.")}
      >
        <rect x="0" y="0" width="420" height="420" fill="#0f172a" stroke={config.knotDistanceCm === 80 && config.isCloveHitchKnot ? "#38bdf8" : "#f43f5e"} strokeWidth="1.5" rx="8" />
        <rect x="0" y="0" width="420" height="35" fill={config.knotDistanceCm === 80 && config.isCloveHitchKnot ? "#1e293b" : "#4c0519"} rx="8" />
        <text x="20" y="23" fill={config.knotDistanceCm === 80 && config.isCloveHitchKnot ? "#38bdf8" : "#fca5a5"} fontSize="13" fontWeight="bold">
          1. CHI TIẾT NÚT ĐỒNG XU & NÚT THUYỀN CHÀI (80 CM)
        </text>

        {/* Tent Canvas Edge & Coin Knot (Nút đồng xu trên mép bạt) */}
        <path d="M 40 80 L 140 160" stroke="#f8fafc" strokeWidth="8" strokeLinecap="round" />
        <circle cx="140" cy="160" r="14" fill="#fbbf24" stroke="#b45309" strokeWidth="3" />
        <circle cx="140" cy="160" r="4" fill="#000000" />
        <text x="140" y="195" fill="#fbbf24" fontSize="11" fontWeight="bold" textAnchor="middle">
          NÚT ĐỒNG XU (MÉP BẠT)
        </text>

        {/* Dynamic Stake Position and Rope based on knotDistanceCm */}
        {config.knotDistanceCm === 80 ? (
          <>
            {/* Standard 80cm Guy Rope Line */}
            <line x1="140" y1="160" x2="330" y2="310" stroke="#ffffff" strokeWidth="4" />

            {/* Ground Stake (Cọc con đóng nghiêng 45 độ) */}
            <line x1="290" y1="360" x2="370" y2="260" stroke="#d97706" strokeWidth="12" strokeLinecap="round" />
            <path d="M 270 340 L 390 340" stroke="#22c55e" strokeWidth="3" strokeDasharray="4 2" />
            <text x="375" y="355" fill="#4ade80" fontSize="10">MẶT ĐẤT</text>

            {/* Knot Illustration: Clove Hitch vs Wrong Overhand Knot */}
            {config.isCloveHitchKnot ? (
              <>
                <circle cx="330" cy="310" r="18" fill="none" stroke="#22c55e" strokeWidth="5" />
                <path d="M 318 300 Q 330 330 345 305" stroke="#22c55e" strokeWidth="4" fill="none" />
                <text x="330" y="245" fill="#4ade80" fontSize="12" fontWeight="bold" textAnchor="middle">
                  NÚT THUYỀN CHÀI (4đ)
                </text>
              </>
            ) : (
              <>
                <circle cx="330" cy="310" r="16" fill="#f43f5e" stroke="#fda4af" strokeWidth="3" />
                <path d="M 320 305 L 340 315 M 340 305 L 320 315" stroke="#ffffff" strokeWidth="3" />
                <text x="330" y="245" fill="#f43f5e" fontSize="11" fontWeight="bold" textAnchor="middle">
                  SAI: NÚT THẮT CHẾT (-2đ)
                </text>
              </>
            )}

            {/* 80 cm Dimension Line */}
            <line x1="155" y1="145" x2="345" y2="295" stroke="#facc15" strokeWidth="2.5" />
            <polygon points="155,145 168,148 162,156" fill="#facc15" />
            <polygon points="345,295 332,292 338,284" fill="#facc15" />
            <rect x="200" y="200" width="110" height="28" fill="#78350f" rx="4" stroke="#facc15" strokeWidth="1.5" />
            <text x="255" y="218" fill="#fef08a" fontSize="13" fontWeight="bold" textAnchor="middle">
              ĐÚNG = 80 CM
            </text>
          </>
        ) : (
          <>
            {/* Defect 60cm Guy Rope Line (Too short) */}
            <line x1="140" y1="160" x2="275" y2="265" stroke="#f87171" strokeWidth="4" strokeDasharray="6 3" />

            {/* Stake closer to tent */}
            <line x1="240" y1="315" x2="310" y2="225" stroke="#d97706" strokeWidth="12" strokeLinecap="round" />
            <path d="M 220 295 L 340 295" stroke="#22c55e" strokeWidth="3" strokeDasharray="4 2" />
            <text x="325" y="310" fill="#4ade80" fontSize="10">MẶT ĐẤT</text>

            {/* Knot representation */}
            {config.isCloveHitchKnot ? (
              <>
                <circle cx="275" cy="265" r="16" fill="none" stroke="#22c55e" strokeWidth="4" />
                <text x="275" y="215" fill="#4ade80" fontSize="11" fontWeight="bold" textAnchor="middle">
                  NÚT THUYỀN CHÀI
                </text>
              </>
            ) : (
              <>
                <circle cx="275" cy="265" r="16" fill="#f43f5e" stroke="#fda4af" strokeWidth="3" />
                <path d="M 267 260 L 283 270 M 283 260 L 267 270" stroke="#ffffff" strokeWidth="3" />
                <text x="275" y="215" fill="#f43f5e" fontSize="11" fontWeight="bold" textAnchor="middle">
                  SAI: NÚT THẮT CHẾT (-2đ)
                </text>
              </>
            )}

            {/* 60cm Dimension Line in Red */}
            <line x1="150" y1="145" x2="285" y2="250" stroke="#f43f5e" strokeWidth="2.5" strokeDasharray="4 2" />
            <polygon points="150,145 163,148 157,156" fill="#f43f5e" />
            <polygon points="285,250 272,247 278,239" fill="#f43f5e" />
            <rect x="160" y="180" width="130" height="28" fill="#881337" rx="4" stroke="#fda4af" strokeWidth="1.5" />
            <text x="225" y="198" fill="#fecdd3" fontSize="12" fontWeight="bold" textAnchor="middle">
              LỖI: 60 CM (-1.5đ)
            </text>
          </>
        )}

        {/* Dynamic Bottom Status Card */}
        <rect 
          x="20" 
          y="365" 
          width="380" 
          height="40" 
          fill={config.knotDistanceCm === 80 && config.isCloveHitchKnot ? "#1e293b" : "#4c0519"} 
          rx="4" 
          stroke={config.knotDistanceCm === 80 && config.isCloveHitchKnot ? "#334155" : "#f43f5e"}
          strokeWidth="1"
        />
        <text 
          x="30" 
          y="382" 
          fill={config.knotDistanceCm === 80 && config.isCloveHitchKnot ? "#e2e8f0" : "#fecdd3"} 
          fontSize="10"
        >
          {config.knotDistanceCm === 80 && config.isCloveHitchKnot 
            ? '• Dây kéo căng, nút thuyền chài xiết chặt không trượt'
            : `• Cảnh báo: ${config.knotDistanceCm !== 80 ? 'Cọc sai cự ly ' + config.knotDistanceCm + 'cm (Trừ 1.5đ) ' : ''}${!config.isCloveHitchKnot ? 'Sai nút thắt chết (Trừ 2đ)' : ''}`}
        </text>
        <text 
          x="30" 
          y="396" 
          fill={config.knotDistanceCm === 80 && config.isCloveHitchKnot ? "#4ade80" : "#fb7185"} 
          fontSize="10" 
          fontWeight="bold"
        >
          {config.knotDistanceCm === 80 && config.isCloveHitchKnot
            ? '• Đạt trọn vẹn 4/4 điểm: Nút đồng xu đến cọc con đúng 80cm'
            : '• Bị trừ điểm kỹ thuật thi công theo barem chấm'}
        </text>
      </g>

      {/* ---------------- RIGHT PANEL: TENT GROUND PLAN & 1.8M POLE DISTANCE ---------------- */}
      <g 
        transform="translate(520, 90)" 
        className="cursor-pointer"
        onClick={() => onSelectHotspot("Khoảng cách từ chân cột to tới chân cọc con buộc nóc trại = 1,8m (2 điểm). Cột chính cao 1,8m đường kính 3cm (10 điểm).")}
      >
        <rect x="0" y="0" width="420" height="420" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" rx="8" />
        <rect x="0" y="0" width="420" height="35" fill="#1e293b" rx="8" />
        <text x="20" y="23" fill="#38bdf8" fontSize="13" fontWeight="bold">
          2. MẶT BẰNG & CỰ LY CHÂN CỘT TO ĐẾN CỌC NÓC (1,8M)
        </text>

        {/* Tent Ground Outline */}
        <polygon points="210,90 80,180 80,310 210,360 340,310 340,180" fill="#0284c7" opacity="0.2" stroke="#38bdf8" strokeWidth="2" strokeDasharray="4 2" />

        {/* Center Main Pole (Chân cột to 1.8m - phi 3cm) */}
        <circle cx="210" cy="225" r="14" fill="#ea580c" stroke="#fed7aa" strokeWidth="3" />
        <circle cx="210" cy="225" r="3" fill="#ffffff" />
        <text x="210" y="200" fill="#ea580c" fontSize="11" fontWeight="bold" textAnchor="middle">
          CỘT CHÍNH (Ø 3cm)
        </text>

        {/* Ridge Stake (Chân cọc con buộc nóc trại) */}
        <circle cx="210" cy="70" r="9" fill="#22c55e" stroke="#bbf7d0" strokeWidth="2" />
        <text x="210" y="55" fill="#4ade80" fontSize="11" fontWeight="bold" textAnchor="middle">
          CỌC CON BUỘC NÓC
        </text>

        {/* 1.8m Distance Dimension Line */}
        <line x1="210" y1="79" x2="210" y2="211" stroke="#facc15" strokeWidth="3" />
        <polygon points="210,79 205,92 215,92" fill="#facc15" />
        <polygon points="210,211 205,198 215,198" fill="#facc15" />
        <rect x="225" y="130" width="130" height="28" fill="#78350f" rx="4" stroke="#facc15" strokeWidth="1.5" />
        <text x="290" y="148" fill="#fef08a" fontSize="12" fontWeight="bold" textAnchor="middle">
          K.CÁCH = 1,8 M
        </text>

        {/* Side Stakes Aligned (Cọc trước thẳng hàng cọc sau) */}
        <circle cx="60" cy="180" r="7" fill="#22c55e" />
        <circle cx="60" cy="245" r="7" fill="#22c55e" />
        <circle cx="60" cy="310" r="7" fill="#22c55e" />
        <line x1="60" y1="160" x2="60" y2="330" stroke="#4ade80" strokeWidth="1.5" strokeDasharray="4 2" />
        <text x="50" y="250" fill="#4ade80" fontSize="9" textAnchor="end">THẲNG HÀNG</text>

        <circle cx="360" cy="180" r="7" fill="#22c55e" />
        <circle cx="360" cy="245" r="7" fill="#22c55e" />
        <circle cx="360" cy="310" r="7" fill="#22c55e" />
        <line x1="360" y1="160" x2="360" y2="330" stroke="#4ade80" strokeWidth="1.5" strokeDasharray="4 2" />
        <text x="370" y="250" fill="#4ade80" fontSize="9" textAnchor="start">THẲNG HÀNG</text>

        {/* Parallel Edges Indicators */}
        <line x1="80" y1="310" x2="340" y2="310" stroke="#f59e0b" strokeWidth="2" strokeDasharray="6 3" />
        <line x1="80" y1="180" x2="340" y2="180" stroke="#f59e0b" strokeWidth="2" strokeDasharray="6 3" />
        <text x="210" y="335" fill="#fcd34d" fontSize="10" textAnchor="middle">
          CÁC CẠNH TRẠI SONG SONG (2đ)
        </text>

        <rect x="20" y="365" width="380" height="40" fill="#1e293b" rx="4" />
        <text x="30" y="382" fill="#e2e8f0" fontSize="10">
          • Cột to tới cọc nóc = 1,8m • Cột chính cao 1,8m; d = 3cm
        </text>
        <text x="30" y="396" fill="#38bdf8" fontSize="10" fontWeight="bold">
          • Cọc thẳng hàng trước sau (5đ) • Cạnh song song (2đ)
        </text>
      </g>
    </svg>
  );
};
