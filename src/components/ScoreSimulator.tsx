import React, { useState } from 'react';
import { 
  Trophy, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw, 
  HelpCircle, 
  BookOpen, 
  Music, 
  Home, 
  Bookmark, 
  FileText,
  ShieldAlert,
  Sliders,
  Check,
  Award
} from 'lucide-react';
import { CampVisualConfig, PerformanceConfig } from '../types/camp';
import { calculateTotalScore } from '../utils/scoreCalculator';

interface ScoreSimulatorProps {
  campConfig: CampVisualConfig;
  performanceConfig: PerformanceConfig;
  onUpdateCampConfig: (cfg: CampVisualConfig) => void;
  onUpdatePerfConfig: (cfg: PerformanceConfig) => void;
  initialTab?: 'gate' | 'tent_structure' | 'interior' | 'technical' | 'performance' | 'penalties';
}

export const ScoreSimulator: React.FC<ScoreSimulatorProps> = ({
  campConfig,
  performanceConfig,
  onUpdateCampConfig,
  onUpdatePerfConfig,
  initialTab = 'gate'
}) => {
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'gate' | 'tent_structure' | 'interior' | 'technical' | 'performance' | 'penalties'>(initialTab);

  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const scoreResult = calculateTotalScore(campConfig, performanceConfig);
  const { totalScore, maxScore, percentage, deductions, recommendations, breakdown, detailedReport } = scoreResult;

  const handleRunAiAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/ai/analyze-compliance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campConfig,
          performanceConfig,
          scoreResult,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Lỗi phân tích AI');
      }

      setAiAnalysis(data.analysis);
    } catch (err: any) {
      console.error(err);
      setAiAnalysis(`Nhận xét Ban Giám Khảo Xã Hải Anh: Chi đội đạt ${totalScore}/${maxScore} điểm (${percentage}%). ${recommendations.join('. ')}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div id="score-simulator-root" className="space-y-6">
      {/* Top Banner: Total Score & Medal */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 border border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-left">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 shadow-inner">
            <Trophy className="w-9 h-9 text-emerald-400" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold mb-1">
              <span>Thang Điểm Thi Đua Hải Anh 2026</span>
              <span className="text-emerald-400 font-normal">• Chuẩn Văn Bản BTC</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              {totalScore} <span className="text-lg font-normal text-slate-400">/ {maxScore} điểm</span>
            </h2>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Đạt tỷ lệ hoàn thành: <strong className="font-bold text-emerald-400">{percentage}%</strong> • Xếp loại thi đua: {' '}
              <span className="font-bold text-white">
                {totalScore >= 100 ? 'GIẢI NHẤT TOÀN ĐOÀN' : totalScore >= 90 ? 'GIẢI NHÌ' : totalScore >= 80 ? 'GIẢI BA' : 'GIẢI KHUYẾN KHÍCH'}
              </span>
            </p>
          </div>
        </div>

        {/* Action button */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <button
            id="btn-ai-analyze-score"
            onClick={handleRunAiAnalysis}
            disabled={isAnalyzing}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors shadow-sm cursor-pointer disabled:opacity-50"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                <span>AI đang thẩm định 110 điểm...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-white fill-white" />
                <span>Thẩm Định Tiêu Chí Bằng AI</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* AI Advice Box */}
      {aiAnalysis && (
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Đánh Giá Chi Tiết Từ AI Cố Vấn Ban Giám Khảo:</span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line bg-emerald-50/50 p-3.5 rounded-xl border border-emerald-100">
            {aiAnalysis}
          </p>
        </div>
      )}

      {/* Deductions and Alerts */}
      {deductions.length > 0 && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 sm:p-5 space-y-2">
          <div className="flex items-center gap-2 text-rose-800 font-bold text-xs uppercase">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>Các Tiêu Chí Đang Bị Trừ Điểm Kỹ Thuật ({deductions.length} lỗi):</span>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-rose-900 font-medium">
            {deductions.map((d, i) => (
              <li key={i} className="flex items-start gap-2 bg-white/80 p-2.5 rounded-lg border border-rose-100">
                <span className="text-rose-600 font-bold">•</span>
                <span>{d}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 4 Official Score Pillar Cards (20đ Văn nghệ + 15đ Cổng + 10đ Chủ đề + 65đ Trại) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* I. Văn nghệ */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-700 uppercase">I. Điểm Văn Nghệ</span>
            <Music className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2 font-mono">
            {breakdown.performance.total} <span className="text-xs font-semibold text-slate-500">/ 20 đ</span>
          </p>
          <div className="mt-2 space-y-1 text-[11px] text-slate-600 border-t border-slate-100 pt-2">
            <div className="flex justify-between">
              <span>1. Tiết mục hát (chủ đề, giai điệu):</span>
              <span className="font-semibold">{breakdown.performance.singingScore} / 10đ</span>
            </div>
            <div className="flex justify-between">
              <span>2. Tiết mục múa (nhịp, dẻo, ≥12 em):</span>
              <span className="font-semibold">{breakdown.performance.danceScore} / 10đ</span>
            </div>
          </div>
        </div>

        {/* II.1 Cổng trại */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-700 uppercase">II.1 Cổng Trại</span>
            <Home className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2 font-mono">
            {breakdown.gate.total} <span className="text-xs font-semibold text-slate-500">/ 15 đ</span>
          </p>
          <div className="mt-2 space-y-1 text-[11px] text-slate-600 border-t border-slate-100 pt-2">
            <div className="flex justify-between">
              <span>Loại cổng (Hộp kép / Đơn):</span>
              <span className="font-semibold">{breakdown.gate.typeScore} / 7đ</span>
            </div>
            <div className="flex justify-between">
              <span>Kích thước chuẩn (1.8m × 1.2m):</span>
              <span className="font-semibold">{breakdown.gate.dimensionScore} / 2đ</span>
            </div>
            <div className="flex justify-between">
              <span>Trang trí (Thủ công / In phun):</span>
              <span className="font-semibold">{breakdown.gate.decoScore} / 5đ</span>
            </div>
          </div>
        </div>

        {/* II.2 Chủ đề */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-700 uppercase">II.2 Chủ Đề Cổng</span>
            <Bookmark className="w-4 h-4 text-rose-600" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2 font-mono">
            {breakdown.theme.total} <span className="text-xs font-semibold text-slate-500">/ 10 đ</span>
          </p>
          <div className="mt-2 space-y-1 text-[11px] text-slate-600 border-t border-slate-100 pt-2">
            <div className="flex justify-between">
              <span>Chữ đúng: "Lồng đèn thắp sáng...":</span>
              <span className="font-semibold">{breakdown.theme.titleScore} / 5đ</span>
            </div>
            <div className="flex justify-between">
              <span>Màu sắc trang nhã:</span>
              <span className="font-semibold">2 / 2đ</span>
            </div>
            <div className="flex justify-between">
              <span>Biểu tượng lịch sử kèm theo:</span>
              <span className="font-semibold">{campConfig.historicalEmblem ? 3 : 0} / 3đ</span>
            </div>
          </div>
        </div>

        {/* II.3 Trại */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-700 uppercase">II.3 Thân Trại & Nội Thất</span>
            <FileText className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2 font-mono">
            {breakdown.interiorAndTent.total} <span className="text-xs font-semibold text-slate-500">/ 65 đ</span>
          </p>
          <div className="mt-2 space-y-1 text-[11px] text-slate-600 border-t border-slate-100 pt-2">
            <div className="flex justify-between">
              <span>a. Cột, cọc, mái:</span>
              <span className="font-semibold">{breakdown.interiorAndTent.structureScore} / 20đ</span>
            </div>
            <div className="flex justify-between">
              <span>b. Vệ sinh sạch sẽ:</span>
              <span className="font-semibold">{breakdown.interiorAndTent.hygieneScore} / 10đ</span>
            </div>
            <div className="flex justify-between">
              <span>c. Trang trí nội thất:</span>
              <span className="font-semibold">{breakdown.interiorAndTent.interiorDecoScore} / 20đ</span>
            </div>
            <div className="flex justify-between">
              <span>d. Kỹ thuật cọc néo 80cm:</span>
              <span className="font-semibold">{breakdown.interiorAndTent.techScore} / 15đ</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Criteria Tweaker */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-600" />
              <span>Bảng Điều Chỉnh Thông Số Thi Đua Thực Tế (Phản Hồi Trực Tiếp)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Thay đổi thông số để kiểm tra điểm thi đua theo đúng văn bản Ban Tổ Chức Xã Hải Anh
            </p>
          </div>
        </div>

        {/* Tabs for tweaking */}
        <div className="flex border-b border-slate-200 gap-2 sm:gap-4 text-xs font-semibold overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('gate')}
            className={`pb-2 px-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'gate'
                ? 'border-b-2 border-emerald-600 text-emerald-700 font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            1. Cổng & Chủ Đề (25đ)
          </button>
          <button
            onClick={() => setActiveTab('tent_structure')}
            className={`pb-2 px-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'tent_structure'
                ? 'border-b-2 border-emerald-600 text-emerald-700 font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            2. Cột, Cọc & Mái (20đ)
          </button>
          <button
            onClick={() => setActiveTab('interior')}
            className={`pb-2 px-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'interior'
                ? 'border-b-2 border-emerald-600 text-emerald-700 font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            3. Trang Trí & Vị Trí (20đ)
          </button>
          <button
            onClick={() => setActiveTab('technical')}
            className={`pb-2 px-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'technical'
                ? 'border-b-2 border-emerald-600 text-emerald-700 font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            4. Kỹ Thuật 80cm & Vệ Sinh (25đ)
          </button>
          <button
            onClick={() => setActiveTab('performance')}
            className={`pb-2 px-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'performance'
                ? 'border-b-2 border-emerald-600 text-emerald-700 font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            5. Tiết Mục Văn Nghệ (20đ)
          </button>
          <button
            onClick={() => setActiveTab('penalties')}
            className={`pb-2 px-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'penalties'
                ? 'border-b-2 border-rose-600 text-rose-700 font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            6. Điểm Trừ & Kỷ Luật
          </button>
        </div>

        {/* Tab 1: Gate & Theme */}
        {activeTab === 'gate' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div className="space-y-3">
              <label className="block font-semibold text-slate-700">
                Loại cổng trại:
              </label>
              <select
                value={campConfig.gateType}
                onChange={(e) => onUpdateCampConfig({ ...campConfig, gateType: e.target.value as any })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="hop_kep">Cổng hộp kép (4 trụ vuông, 2 cửa lách) - 7 điểm</option>
                <option value="hop_don">Cổng hộp đơn (2 trụ vuông, 1 cửa chính) - 5 điểm</option>
                <option value="cong_don">Cổng đơn (4 thanh tre/gỗ dựng lên) - 3 điểm</option>
              </select>
              <p className="text-[11px] text-slate-500">
                Chuẩn BTC: Làm hộp kép 4 trụ có 2 cửa lách đạt điểm tối đa 7 điểm.
              </p>

              <label className="block font-semibold text-slate-700 pt-2">
                Phương thức trang trí cổng:
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => onUpdateCampConfig({ ...campConfig, decorationType: 'craft' })}
                  className={`flex-1 py-2 px-3 rounded-lg border text-xs font-medium cursor-pointer ${
                    campConfig.decorationType === 'craft'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-bold'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  Thủ công (5 điểm)
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateCampConfig({ ...campConfig, decorationType: 'print' })}
                  className={`flex-1 py-2 px-3 rounded-lg border text-xs font-medium cursor-pointer ${
                    campConfig.decorationType === 'print'
                      ? 'bg-amber-50 border-amber-500 text-amber-800 font-bold'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  In phun (3 điểm)
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <label className="block font-semibold text-slate-700">
                Chiều cao cửa chính: <span className="font-bold text-emerald-700">{campConfig.gateHeight}m</span>
              </label>
              <input
                type="range"
                min="1.4"
                max="2.2"
                step="0.05"
                value={campConfig.gateHeight}
                onChange={(e) => onUpdateCampConfig({ ...campConfig, gateHeight: parseFloat(e.target.value) })}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>1.4m</span>
                <span className="font-bold text-emerald-700">Chuẩn BTC: 1,8m</span>
                <span>2.2m</span>
              </div>

              <label className="block font-semibold text-slate-700 pt-2">
                Chiều rộng cửa chính: <span className="font-bold text-emerald-700">{campConfig.gateWidth}m</span>
              </label>
              <input
                type="range"
                min="0.8"
                max="1.6"
                step="0.05"
                value={campConfig.gateWidth}
                onChange={(e) => onUpdateCampConfig({ ...campConfig, gateWidth: parseFloat(e.target.value) })}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>0.8m</span>
                <span className="font-bold text-emerald-700">Chuẩn BTC: 1,2m</span>
                <span>1.6m</span>
              </div>
            </div>

            <div className="space-y-3">
              <label className="block font-semibold text-slate-700">
                Chủ đề tiêu đề cổng (5 điểm):
              </label>
              <input
                type="text"
                value={campConfig.gateTitle}
                onChange={(e) => onUpdateCampConfig({ ...campConfig, gateTitle: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800"
              />
              <p className="text-[10px] text-slate-500">
                Bắt buộc: <strong>"Lồng đèn thắp sáng ước mơ"</strong>
              </p>

              <label className="block font-semibold text-slate-700 pt-1">
                Biểu tượng lịch sử (3 điểm):
              </label>
              <select
                value={campConfig.historicalEmblem}
                onChange={(e) => onUpdateCampConfig({ ...campConfig, historicalEmblem: e.target.value as any })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
              >
                <option value="khue_van_cac">Khuê Văn Các (Biểu tượng truyền thống hiếu học)</option>
                <option value="chua_mot_cot">Chùa Một Cột (Thăng Long ngàn năm)</option>
                <option value="hoa_sen">Hoa Sen Dâng Bác (Thanh cao thuần khiết)</option>
                <option value="thap_rua">Tháp Rùa Hồ Gươm (Lịch sử ngàn năm)</option>
              </select>
            </div>
          </div>
        )}

        {/* Tab 2: Tent Structure */}
        {activeTab === 'tent_structure' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div className="space-y-3">
              <label className="block font-semibold text-slate-700">
                Chiều cao cột chính lều (10 điểm): <span className="font-bold text-emerald-700">{campConfig.poleHeight}m</span>
              </label>
              <input
                type="range"
                min="1.4"
                max="2.2"
                step="0.05"
                value={campConfig.poleHeight}
                onChange={(e) => onUpdateCampConfig({ ...campConfig, poleHeight: parseFloat(e.target.value) })}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>1.4m</span>
                <span className="font-bold text-emerald-700">Chuẩn BTC: Đúng 1,8m</span>
                <span>2.2m</span>
              </div>
            </div>

            <div className="space-y-3">
              <label className="block font-semibold text-slate-700">
                Đường kính cột chính: <span className="font-bold text-emerald-700">{campConfig.poleDiameter}cm</span>
              </label>
              <input
                type="range"
                min="2.0"
                max="5.0"
                step="0.2"
                value={campConfig.poleDiameter}
                onChange={(e) => onUpdateCampConfig({ ...campConfig, poleDiameter: parseFloat(e.target.value) })}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>2.0cm</span>
                <span className="font-bold text-emerald-700">Chuẩn BTC: Đúng 3cm (Phi 30)</span>
                <span>5.0cm</span>
              </div>
            </div>

            <div className="space-y-3">
              <span className="block font-semibold text-slate-700">Cọc con & Mái lều:</span>
              <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg bg-slate-50 border border-slate-200">
                <input
                  type="checkbox"
                  checked={campConfig.hasSturdyStakes}
                  onChange={(e) => onUpdateCampConfig({ ...campConfig, hasSturdyStakes: e.target.checked })}
                  className="rounded accent-emerald-600"
                />
                <span>Cọc con chắc chắn, đảm bảo (5 điểm)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg bg-slate-50 border border-slate-200">
                <input
                  type="checkbox"
                  checked={campConfig.flatRoof}
                  onChange={(e) => onUpdateCampConfig({ ...campConfig, flatRoof: e.target.checked })}
                  className="rounded accent-emerald-600"
                />
                <span>Mái trại, mái phẳng đẹp, không võng (5 điểm)</span>
              </label>
            </div>
          </div>
        )}

        {/* Tab 3: Interior & Placement */}
        {activeTab === 'interior' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div className="space-y-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-900 block border-b border-slate-200 pb-1">
                Ban Thờ Bác Hồ (Trên cùng) - 4 điểm
              </span>
              <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                <input
                  type="checkbox"
                  checked={campConfig.hasTopNationalFlag}
                  onChange={(e) => onUpdateCampConfig({ ...campConfig, hasTopNationalFlag: e.target.checked })}
                  className="rounded accent-emerald-600"
                />
                <span>Cờ Tổ quốc treo cao nhất</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                <input
                  type="checkbox"
                  checked={campConfig.hasUncleHoPortrait}
                  onChange={(e) => onUpdateCampConfig({ ...campConfig, hasUncleHoPortrait: e.target.checked })}
                  className="rounded accent-emerald-600"
                />
                <span>Ảnh Bác Hồ trang nghiêm</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                <input
                  type="checkbox"
                  checked={campConfig.hasFiveTeachings}
                  onChange={(e) => onUpdateCampConfig({ ...campConfig, hasFiveTeachings: e.target.checked })}
                  className="rounded accent-emerald-600"
                />
                <span>Bảng 5 điều Bác Hồ dạy</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-slate-700 pt-1 border-t border-slate-200">
                <input
                  type="checkbox"
                  checked={campConfig.hasFruitTray && campConfig.hasFlowerVase}
                  onChange={(e) => onUpdateCampConfig({ 
                    ...campConfig, 
                    hasFruitTray: e.target.checked,
                    hasFlowerVase: e.target.checked
                  })}
                  className="rounded accent-emerald-600"
                />
                <span>Có mâm ngũ quả & lọ hoa tươi (4 điểm)</span>
              </label>
            </div>

            <div className="space-y-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-900 block border-b border-slate-200 pb-1">
                Góc Học Tập (BÊN PHẢI) - 4 điểm
              </span>
              <label className="flex items-center gap-2 cursor-pointer text-slate-700 font-medium">
                <input
                  type="checkbox"
                  checked={campConfig.studyCornerRight}
                  onChange={(e) => onUpdateCampConfig({ ...campConfig, studyCornerRight: e.target.checked })}
                  className="rounded accent-emerald-600"
                />
                <span>Đặt đúng BÊN TAY PHẢI nhìn vào (Sai trừ 1đ)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                <input
                  type="checkbox"
                  checked={campConfig.hasStudyDesk}
                  onChange={(e) => onUpdateCampConfig({ ...campConfig, hasStudyDesk: e.target.checked })}
                  className="rounded accent-emerald-600"
                />
                <span>Bàn học ngay ngắn</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                <input
                  type="checkbox"
                  checked={campConfig.hasStudyLamp}
                  onChange={(e) => onUpdateCampConfig({ ...campConfig, hasStudyLamp: e.target.checked })}
                  className="rounded accent-emerald-600"
                />
                <span>Đèn học chống cận</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                <input
                  type="checkbox"
                  checked={campConfig.hasBooksAndPens}
                  onChange={(e) => onUpdateCampConfig({ ...campConfig, hasBooksAndPens: e.target.checked })}
                  className="rounded accent-emerald-600"
                />
                <span>Sách vở & bút mực đầy đủ</span>
              </label>
            </div>

            <div className="space-y-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-900 block border-b border-slate-200 pb-1">
                Khẩu Hiệu & Thiết Bị Đội (BÊN TRÁI)
              </span>
              <label className="flex items-center gap-2 cursor-pointer text-slate-700 font-medium">
                <input
                  type="checkbox"
                  checked={campConfig.sloganLeft}
                  onChange={(e) => onUpdateCampConfig({ ...campConfig, sloganLeft: e.target.checked })}
                  className="rounded accent-emerald-600"
                />
                <span>Treo đúng BÊN TAY TRÁI (4 điểm)</span>
              </label>
              <p className="text-[10px] text-slate-500 italic">
                Nội dung: "Thiếu nhi Ninh Bình vững bước tiến vào kỷ nguyên mới"
              </p>
              <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                <input
                  type="checkbox"
                  checked={campConfig.hasStoryBooks}
                  onChange={(e) => onUpdateCampConfig({ ...campConfig, hasStoryBooks: e.target.checked })}
                  className="rounded accent-emerald-600"
                />
                <span>Có tranh truyện thiếu nhi kèm theo (1 điểm)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                <input
                  type="checkbox"
                  checked={campConfig.hasPioneerEquip}
                  onChange={(e) => onUpdateCampConfig({ ...campConfig, hasPioneerEquip: e.target.checked })}
                  className="rounded accent-emerald-600"
                />
                <span>Trang thiết bị của Đội: trống, cờ Đội (1 điểm)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                <input
                  type="checkbox"
                  checked={campConfig.hasGoodLighting}
                  onChange={(e) => onUpdateCampConfig({ ...campConfig, hasGoodLighting: e.target.checked })}
                  className="rounded accent-emerald-600"
                />
                <span>Ánh sáng tốt, rực rỡ, an toàn (2 điểm)</span>
              </label>
            </div>
          </div>
        )}

        {/* Tab 4: Technical & Hygiene */}
        {activeTab === 'technical' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div className="space-y-3">
              <label className="block font-semibold text-slate-700">
                Khoảng cách nút đồng xu tới cọc con: <span className="font-bold text-emerald-700">{campConfig.knotDistanceCm}cm</span>
              </label>
              <input
                type="range"
                min="50"
                max="120"
                step="5"
                value={campConfig.knotDistanceCm}
                onChange={(e) => onUpdateCampConfig({ ...campConfig, knotDistanceCm: parseInt(e.target.value) })}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>50cm</span>
                <span className="font-bold text-emerald-700">Chuẩn BTC: Đúng 80cm (4 điểm)</span>
                <span>120cm</span>
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-2">
                <input
                  type="checkbox"
                  checked={campConfig.isCloveHitchKnot}
                  onChange={(e) => onUpdateCampConfig({ ...campConfig, isCloveHitchKnot: e.target.checked })}
                  className="rounded accent-emerald-600"
                />
                <span>Buộc đúng nút thuyền chài</span>
              </label>
            </div>

            <div className="space-y-3">
              <label className="block font-semibold text-slate-700">
                Khoảng cách chân cột to tới cọc buộc nóc: <span className="font-bold text-emerald-700">{campConfig.poleToStakeDistanceM}m</span>
              </label>
              <input
                type="range"
                min="1.2"
                max="2.4"
                step="0.05"
                value={campConfig.poleToStakeDistanceM}
                onChange={(e) => onUpdateCampConfig({ ...campConfig, poleToStakeDistanceM: parseFloat(e.target.value) })}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>1.2m</span>
                <span className="font-bold text-emerald-700">Chuẩn BTC: Đúng 1,8m (2 điểm)</span>
                <span>2.4m</span>
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-2">
                <input
                  type="checkbox"
                  checked={campConfig.correctKnots}
                  onChange={(e) => onUpdateCampConfig({ ...campConfig, correctKnots: e.target.checked })}
                  className="rounded accent-emerald-600"
                />
                <span>Nút buộc đúng kỹ thuật (2 điểm)</span>
              </label>
            </div>

            <div className="space-y-3">
              <span className="block font-semibold text-slate-700">Độ song song & Vệ sinh:</span>
              <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg bg-slate-50 border border-slate-200">
                <input
                  type="checkbox"
                  checked={campConfig.parallelEdges}
                  onChange={(e) => onUpdateCampConfig({ ...campConfig, parallelEdges: e.target.checked })}
                  className="rounded accent-emerald-600"
                />
                <span>Các cạnh của trại song song nhau (2 điểm)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg bg-slate-50 border border-slate-200">
                <input
                  type="checkbox"
                  checked={campConfig.alignedStakes}
                  onChange={(e) => onUpdateCampConfig({ ...campConfig, alignedStakes: e.target.checked })}
                  className="rounded accent-emerald-600"
                />
                <span>Cọc trước thẳng hàng cọc sau (5 điểm)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg bg-emerald-50/70 border border-emerald-200 font-bold text-emerald-900">
                <input
                  type="checkbox"
                  checked={campConfig.isClean}
                  onChange={(e) => onUpdateCampConfig({ ...campConfig, isClean: e.target.checked })}
                  className="rounded accent-emerald-600"
                />
                <span>Vệ sinh sạch sẽ toàn khuôn viên (10 điểm)</span>
              </label>
            </div>
          </div>
        )}

        {/* Tab 5: Performance */}
        {activeTab === 'performance' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div className="space-y-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-900 block border-b border-slate-200 pb-1">
                1. Tiết mục Hát (10 điểm)
              </span>
              <label className="flex items-center gap-2 cursor-pointer text-slate-700 font-medium">
                <input
                  type="checkbox"
                  checked={performanceConfig.singingCorrectTopic}
                  onChange={(e) => onUpdatePerfConfig({ ...performanceConfig, singingCorrectTopic: e.target.checked })}
                  className="rounded accent-emerald-600"
                />
                <span>Đúng chủ đề (Trung thu/Bác Hồ/quê hương)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-slate-700 font-medium">
                <input
                  type="checkbox"
                  checked={performanceConfig.singingGoodMelody}
                  onChange={(e) => onUpdatePerfConfig({ ...performanceConfig, singingGoodMelody: e.target.checked })}
                  className="rounded accent-emerald-600"
                />
                <span>Chất lượng tốt, đúng nhạc, giai điệu</span>
              </label>
              <p className="text-[10px] text-slate-500 italic pt-1">
                Đạt cả 2 tiêu chí trên nhận trọn vẹn 10 điểm tiết mục hát.
              </p>
            </div>

            <div className="space-y-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-900 block border-b border-slate-200 pb-1">
                2. Tiết mục Múa (10 điểm)
              </span>
              <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                <input
                  type="checkbox"
                  checked={performanceConfig.dancingCorrectTopic}
                  onChange={(e) => onUpdatePerfConfig({ ...performanceConfig, dancingCorrectTopic: e.target.checked })}
                  className="rounded accent-emerald-600"
                />
                <span>Múa đúng chủ đề (2 điểm)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                <input
                  type="checkbox"
                  checked={performanceConfig.dancingCorrectRhythm}
                  onChange={(e) => onUpdatePerfConfig({ ...performanceConfig, dancingCorrectRhythm: e.target.checked })}
                  className="rounded accent-emerald-600"
                />
                <span>Múa hát đúng nhịp điệu (3 điểm)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                <input
                  type="checkbox"
                  checked={performanceConfig.dancingGraceful}
                  onChange={(e) => onUpdatePerfConfig({ ...performanceConfig, dancingGraceful: e.target.checked })}
                  className="rounded accent-emerald-600"
                />
                <span>Múa dẻo, múa đẹp (3 điểm)</span>
              </label>
            </div>

            <div className="space-y-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-900 block border-b border-slate-200 pb-1">
                Quân Số Đội Hình (2 điểm)
              </span>
              <label className="block font-semibold text-slate-700">
                Số lượng đội viên: <span className="font-bold text-emerald-700">{performanceConfig.dancingTeamSize} bạn</span>
              </label>
              <input
                type="range"
                min="8"
                max="24"
                step="1"
                value={performanceConfig.dancingTeamSize}
                onChange={(e) => onUpdatePerfConfig({ ...performanceConfig, dancingTeamSize: parseInt(e.target.value) })}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>8 bạn</span>
                <span className="font-bold text-emerald-700">Chuẩn BTC: Từ 12 em trở lên</span>
                <span>24 bạn</span>
              </div>
              <label className="flex items-center gap-2 cursor-pointer text-slate-700 pt-2">
                <input
                  type="checkbox"
                  checked={performanceConfig.hasBothGenders}
                  onChange={(e) => onUpdatePerfConfig({ ...performanceConfig, hasBothGenders: e.target.checked })}
                  className="rounded accent-emerald-600"
                />
                <span>Có cả nam và nữ cùng tham gia</span>
              </label>
            </div>
          </div>
        )}

        {/* Tab 6: Penalties */}
        {activeTab === 'penalties' && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-rose-50/80 rounded-xl border border-rose-200 space-y-2">
                <span className="font-bold text-rose-900 block flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>Điểm Trừ Văn Nghệ (Tối đa 5 điểm):</span>
                </span>
                <label className="flex items-center gap-2 cursor-pointer text-rose-900">
                  <input
                    type="checkbox"
                    checked={performanceConfig.inappropriateCostume}
                    onChange={(e) => onUpdatePerfConfig({ ...performanceConfig, inappropriateCostume: e.target.checked })}
                    className="rounded accent-rose-600"
                  />
                  <span>Trang phục không đạt yêu cầu (-1 điểm)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-rose-900">
                  <input
                    type="checkbox"
                    checked={performanceConfig.disrespectedLottery}
                    onChange={(e) => onUpdatePerfConfig({ ...performanceConfig, disrespectedLottery: e.target.checked })}
                    className="rounded accent-rose-600"
                  />
                  <span>Không tôn trọng kết quả bốc thăm (-1 điểm)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-rose-900">
                  <input
                    type="checkbox"
                    checked={performanceConfig.wrongSongTopic}
                    onChange={(e) => onUpdatePerfConfig({ ...performanceConfig, wrongSongTopic: e.target.checked })}
                    className="rounded accent-rose-600"
                  />
                  <span>Đưa bài hát không đúng chủ đề (-1 điểm)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-rose-900">
                  <input
                    type="checkbox"
                    checked={performanceConfig.misleadingPropaganda}
                    onChange={(e) => onUpdatePerfConfig({ ...performanceConfig, misleadingPropaganda: e.target.checked })}
                    className="rounded accent-rose-600"
                  />
                  <span>Tuyên truyền sai lệch quan điểm / phát ngôn sai chỗ (-2 điểm)</span>
                </label>
              </div>

              <div className="p-4 bg-red-950 text-white rounded-xl border border-red-800 space-y-2">
                <span className="font-bold text-amber-300 block flex items-center gap-1.5 uppercase">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  <span>Quy Định Kỷ Luật & Thái Độ (Trang 3 - Trừ 10đ):</span>
                </span>
                <p className="text-red-200 text-[11px] leading-relaxed">
                  • Ý kiến phát ngôn bừa bãi, thái độ mọi thành viên trong đơn vị không tôn trọng Ban tổ chức, Ban giám khảo.
                </p>
                <p className="text-red-200 text-[11px] leading-relaxed">
                  • Khiếu nại, đề xuất không phục tùng tổ chức.
                </p>
                <div className="pt-2 border-t border-red-800 text-amber-200 font-semibold text-[11px]">
                  * Ban Tổ Chức sẽ trừ thẳng 10 điểm toàn đoàn đối với bất kỳ đơn vị nào vi phạm.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

