import React, { useState, useEffect, useRef } from 'react';
import { 
  Music, 
  Users, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Play, 
  Pause, 
  RotateCcw,
  Shirt, 
  Layers, 
  Info,
  ChevronRight,
  Lightbulb,
  Radio,
  Volume2,
  VolumeX,
  Eye,
  Award,
  Calendar,
  Compass,
  ArrowRight,
  Zap,
  Flame,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { 
  PerformanceItem, 
  ChoreographyStep, 
  PerformerMember,
  StageCue,
  INITIAL_PERFORMANCE_ITEMS, 
  CHOREOGRAPHY_STEPS,
  PERFORMER_ROSTER,
  STAGE_CUES
} from '../data/performanceData';

interface PerformanceManagerProps {
  onUpdateScoreStatus?: () => void;
}

export const PerformanceManager: React.FC<PerformanceManagerProps> = () => {
  const [items, setItems] = useState<PerformanceItem[]>(INITIAL_PERFORMANCE_ITEMS);
  const [activeTab, setActiveTab] = useState<'stage' | 'roster' | 'cues' | 'scoring'>('stage');
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [selectedPerformerId, setSelectedPerformerId] = useState<number | null>(1);
  const [isPlayingDemo, setIsPlayingDemo] = useState<boolean>(false);
  const [filterGender, setFilterGender] = useState<'all' | 'nam' | 'nu'>('all');
  const [selectedActId, setSelectedActId] = useState<string>(INITIAL_PERFORMANCE_ITEMS[0].id);
  const [soundFeedback, setSoundFeedback] = useState<string | null>(null);

  // Auto-play timer for choreography simulation
  useEffect(() => {
    let interval: any = null;
    if (isPlayingDemo) {
      interval = setInterval(() => {
        setActiveStepIndex((prev) => (prev + 1) % CHOREOGRAPHY_STEPS.length);
      }, 3500);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlayingDemo]);

  // Web Audio Synth for Drum Rhythm rehearsal
  const playDrumSound = (type: 'tung' | 'rinh' | 'cac' | 'cheer') => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();

      if (type === 'tung') {
        // Deep bass drum
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(140, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(35, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(1.0, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
        setSoundFeedback('🥁 TÙNG! (Nhịp phách 1)');
      } else if (type === 'rinh') {
        // Snare / wood sound
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.7, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
        setSoundFeedback('🪘 RINH! (Phách dặm)');
      } else if (type === 'cac') {
        // High click / thanh la
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        gain.gain.setValueAtTime(0.4, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.08);
        setSoundFeedback('🔔 CẮC! (Thanh la)');
      } else {
        // Cheer chime chord
        const freqs = [523.25, 659.25, 783.99, 1046.5];
        freqs.forEach((f, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, ctx.currentTime + i * 0.05);
          gain.gain.setValueAtTime(0.3, ctx.currentTime + i * 0.05);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + i * 0.05);
          osc.stop(ctx.currentTime + 0.6);
        });
        setSoundFeedback('✨ "Thiếu nhi Hải Anh - Thắp sáng ước mơ!"');
      }

      setTimeout(() => setSoundFeedback(null), 2000);
    } catch (e) {
      console.log('AudioContext not allowed without gesture', e);
    }
  };

  // Metrics
  const totalDuration = items.reduce((sum, item) => sum + item.durationMinutes, 0);
  const maxCast = Math.max(...items.map(i => i.castCount), 0);
  const totalMale = 6;
  const totalFemale = 8;
  const isDurationCompliant = totalDuration >= 7 && totalDuration <= 10;
  const isCastCompliant = maxCast >= 12;

  const activeStep = CHOREOGRAPHY_STEPS[activeStepIndex];
  const selectedPerformer = PERFORMER_ROSTER.find(p => p.id === selectedPerformerId) || PERFORMER_ROSTER[0];
  const selectedAct = items.find(i => i.id === selectedActId) || items[0];

  const filteredRoster = PERFORMER_ROSTER.filter(p => {
    if (filterGender === 'all') return true;
    return p.gender === filterGender;
  });

  return (
    <div id="performance-manager-root" className="space-y-6">
      {/* Top Banner KPI Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 border border-slate-800 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-semibold mb-2 border border-emerald-500/25">
              <Music className="w-3.5 h-3.5" />
              <span>Kịch Bản & Sân Khấu Văn Nghệ 14 Diễn Viên 20 Điểm Tối Đa</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white">
              Vũ Đạo & Kịch Bản: "Lồng Đèn Thắp Sáng Ước Mơ"
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Chi tiết từng bước di chuyển của 14 diễn viên (6 nam, 8 nữ), hồ sơ phân vai, cue sheet âm thanh ánh sáng từng giây và bảng chấm điểm 20/20 chuẩn quy chế Xã Hải Anh 2026.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className={`p-3 rounded-xl border ${isDurationCompliant ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' : 'bg-rose-950/40 border-rose-500/40 text-rose-300'}`}>
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-slate-400">Thời lượng</span>
                <Clock className="w-3.5 h-3.5" />
              </div>
              <p className="text-lg font-bold font-mono mt-1 text-white">{totalDuration} <span className="text-xs font-normal">phút</span></p>
              <span className="text-[10px] block mt-0.5">
                {isDurationCompliant ? '✓ Chuẩn 7 - 10 phút' : '⚠ Bị trừ điểm thời lượng'}
              </span>
            </div>

            <div className={`p-3 rounded-xl border ${isCastCompliant ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' : 'bg-rose-950/40 border-rose-500/40 text-rose-300'}`}>
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-slate-400">Diễn viên</span>
                <Users className="w-3.5 h-3.5" />
              </div>
              <p className="text-lg font-bold font-mono mt-1 text-white">{maxCast} <span className="text-xs font-normal">em</span></p>
              <span className="text-[10px] block mt-0.5">
                {isCastCompliant ? `✓ 6 Nam + 8 Nữ (≥ 12 em)` : '⚠ Thiếu em (Trừ 0.5đ/em)'}
              </span>
            </div>

            <div className="col-span-2 sm:col-span-1 p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-amber-300">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-slate-400">Điểm tối đa</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <p className="text-lg font-bold font-mono mt-1 text-amber-400">20 / 20 <span className="text-xs font-normal">điểm</span></p>
              <span className="text-[10px] text-slate-300 block mt-0.5">
                5 Tiêu chí 4 điểm
              </span>
            </div>
          </div>
        </div>

        {/* 4 Performance Tabs Switcher */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex items-center gap-2 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('stage')}
            className={`px-3.5 py-2 rounded-xl font-medium whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'stage'
                ? 'bg-emerald-600 text-white font-bold shadow-xs'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <Radio className="w-4 h-4" />
            <span>1. Sơ Đồ Đội Hình Sân Khấu (5 Màn Trực Quan)</span>
          </button>

          <button
            onClick={() => setActiveTab('roster')}
            className={`px-3.5 py-2 rounded-xl font-medium whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'roster'
                ? 'bg-emerald-600 text-white font-bold shadow-xs'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>2. Danh Sách 14 Diễn Viên & Đạo Cụ Chi Tiết</span>
          </button>

          <button
            onClick={() => setActiveTab('cues')}
            className={`px-3.5 py-2 rounded-xl font-medium whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'cues'
                ? 'bg-emerald-600 text-white font-bold shadow-xs'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>3. Bảng Cues Âm Thanh, Ánh Sáng & Hiệu Ứng Sân Khấu</span>
          </button>

          <button
            onClick={() => setActiveTab('scoring')}
            className={`px-3.5 py-2 rounded-xl font-medium whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'scoring'
                ? 'bg-emerald-600 text-white font-bold shadow-xs'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>4. Thang Điểm 20/20 & Mẹo Chinh Phục Ban Giám Khảo</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: INTERACTIVE STAGE FORMATION CANVAS (5 TRANSITIONS)*/}
      {/* ======================================================== */}
      {activeTab === 'stage' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 7 Columns: Stage 2D Canvas & Controls */}
            <div className="lg:col-span-7 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Radio className="w-4 h-4 text-emerald-600 animate-pulse" />
                    <span>Mặt Bằng Sân Khấu 2D & Vị Trí 14 Diễn Viên</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Kích thước sàn sân khấu: 8m mặt tiền × 6m chiều sâu
                  </p>
                </div>

                {/* Auto Play / Pause Simulator Controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsPlayingDemo(!isPlayingDemo)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      isPlayingDemo 
                        ? 'bg-amber-500 text-slate-950 shadow-xs' 
                        : 'bg-emerald-600 text-white hover:bg-emerald-700'
                    }`}
                  >
                    {isPlayingDemo ? (
                      <>
                        <Pause className="w-3.5 h-3.5" />
                        <span>Tạm dừng</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5" />
                        <span>Chạy mô phỏng</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      setIsPlayingDemo(false);
                      setActiveStepIndex(0);
                    }}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 cursor-pointer"
                    title="Quay về Màn 1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* 5 Formation Steps Navigation Bar */}
              <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl overflow-x-auto">
                {CHOREOGRAPHY_STEPS.map((step, idx) => (
                  <button
                    key={step.stepNumber}
                    onClick={() => {
                      setIsPlayingDemo(false);
                      setActiveStepIndex(idx);
                    }}
                    className={`px-3 py-1.5 text-xs rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                      activeStepIndex === idx 
                        ? 'bg-white text-emerald-700 shadow-xs font-bold' 
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Màn {step.stepNumber}: {step.name.split(':')[1]?.trim() || step.name}
                  </button>
                ))}
              </div>

              {/* 2D Stage Graphics Canvas */}
              <div className="relative w-full aspect-[16/10] bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 rounded-xl overflow-hidden p-4 border border-slate-800 flex flex-col justify-between select-none">
                {/* Stage Backdrop Banner */}
                <div className="w-full bg-red-700/90 text-amber-200 text-center py-1.5 rounded px-2 shadow-sm border border-amber-400/40 relative z-10">
                  <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                    HỘI TRẠI THU XÃ HẢI ANH NĂM 2026 • LỒNG ĐÈN THẮP SÁNG ƯỚC MƠ
                  </p>
                </div>

                {/* Stage Lighting Spots Overlay */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-0 left-1/4 w-36 h-48 bg-amber-400/10 rounded-full blur-2xl" />
                  <div className="absolute top-0 right-1/4 w-36 h-48 bg-emerald-400/10 rounded-full blur-2xl" />
                  {activeStepIndex === 4 && (
                    <div className="absolute bottom-0 inset-x-0 h-24 bg-amber-500/20 blur-xl" />
                  )}
                </div>

                {/* Wing Labels (Cánh Gà Trái & Phải) */}
                <div className="absolute left-2 top-1/2 -translate-y-1/2 text-[9px] text-slate-400 font-mono rotate-180 writing-vertical-rl bg-slate-950/60 px-1 py-2 rounded border border-slate-800">
                  CÁNH GÀ TRÁI (LỐI VÀO)
                </div>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] text-slate-400 font-mono rotate-180 writing-vertical-rl bg-slate-950/60 px-1 py-2 rounded border border-slate-800">
                  CÁNH GÀ PHẢI (LỐI VÀO)
                </div>

                {/* Stage Performers Layout (14 kids) */}
                <div className="relative flex-1 flex items-center justify-center my-2">
                  <div className="relative w-full max-w-[440px] h-[180px]">
                    {/* Stage Grid Center Guideline */}
                    <div className="absolute top-0 bottom-0 left-1/2 w-px border-l border-dashed border-slate-700/60 pointer-events-none" />
                    <div className="absolute left-0 right-0 top-1/2 h-px border-t border-dashed border-slate-700/60 pointer-events-none" />

                    {/* 14 Performer Pins */}
                    {activeStep.positions.map((pos) => {
                      const isSelected = selectedPerformerId === pos.id;
                      const rosterInfo = PERFORMER_ROSTER.find(r => r.id === pos.id);
                      return (
                        <div
                          key={pos.id}
                          onClick={() => setSelectedPerformerId(pos.id)}
                          style={{ 
                            left: `${(pos.x / 440) * 100}%`, 
                            top: `${(pos.y / 180) * 100}%` 
                          }}
                          className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer transition-all duration-500 ease-out z-20"
                        >
                          {isSelected && (
                            <div className="absolute -inset-2 rounded-full border-2 border-amber-300 animate-ping opacity-75 pointer-events-none" />
                          )}
                          <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold border shadow-md transition-transform group-hover:scale-125 ${
                            pos.gender === 'female' 
                              ? 'bg-amber-400 text-slate-950 border-amber-200' 
                              : 'bg-emerald-500 text-white border-emerald-300'
                          } ${isSelected ? 'ring-2 ring-white scale-110' : ''}`}>
                            {pos.label}
                          </div>
                          <span className="text-[8px] text-amber-200 font-mono mt-0.5 whitespace-nowrap bg-slate-900/90 px-1 rounded opacity-90 group-hover:opacity-100 border border-slate-700">
                            {pos.prop.split(' ')[0]}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Stage Legend & Info Footer */}
                <div className="flex flex-wrap items-center justify-between text-[10px] text-slate-300 bg-slate-950/80 px-3 py-2 rounded-lg border border-slate-800 gap-2 relative z-10">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      <span>6 Nam (Áo bà ba/Sơ mi)</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                      <span>8 Nữ (Áo bà ba/Đầm sen)</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-amber-300 font-mono font-bold">
                      {activeStep.name}
                    </span>
                    <span className="bg-emerald-950 text-emerald-300 px-1.5 py-0.5 rounded font-mono text-[9px] border border-emerald-500/30">
                      {activeStep.timeRange}
                    </span>
                  </div>
                </div>
              </div>

              {/* Step Choreography Details Card */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-1">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                    <span>Đội hình: {activeStep.formation}</span>
                  </span>
                  <span className="text-[11px] font-mono text-emerald-700 font-semibold bg-emerald-100 px-2 py-0.5 rounded">
                    Nhịp phách: {activeStep.musicBeat}
                  </span>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  <strong>Động tác & Đạo cụ:</strong> {activeStep.propsAction}
                </p>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  <strong>Điểm nhấn sân khấu:</strong> {activeStep.visualNote}
                </p>
                <div className="p-2 bg-amber-50/80 rounded-lg border border-amber-200 text-[11px] text-amber-900 font-medium">
                  <strong>Lưu ý giám khảo chấm thi:</strong> {activeStep.keyHighlight}
                </div>
              </div>

              {/* Soundboard Rhythm Rehearsal Buttons (Web Audio Synth) */}
              <div className="p-3.5 bg-emerald-50/50 rounded-xl border border-emerald-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                    <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Bảng Gõ Nhịp Tập Luyện Thực Tế (Bộ Gõ Cổ Truyền)</span>
                  </span>
                  {soundFeedback && (
                    <span className="text-[11px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded animate-pulse">
                      {soundFeedback}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-600">
                  Bấm để nghe tiếng gõ nhịp giả lập giúp các em thiếu nhi khớp chuẩn phách 2/4 và tiếng hô kết màn:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <button
                    onClick={() => playDrumSound('tung')}
                    className="p-2 rounded-lg bg-white border border-slate-200 hover:border-emerald-400 font-medium text-slate-700 hover:text-emerald-700 text-center transition-colors cursor-pointer shadow-2xs"
                  >
                    🥁 Tiếng Trống (Tùng)
                  </button>
                  <button
                    onClick={() => playDrumSound('rinh')}
                    className="p-2 rounded-lg bg-white border border-slate-200 hover:border-emerald-400 font-medium text-slate-700 hover:text-emerald-700 text-center transition-colors cursor-pointer shadow-2xs"
                  >
                    🪘 Trống Ếch (Rinh)
                  </button>
                  <button
                    onClick={() => playDrumSound('cac')}
                    className="p-2 rounded-lg bg-white border border-slate-200 hover:border-emerald-400 font-medium text-slate-700 hover:text-emerald-700 text-center transition-colors cursor-pointer shadow-2xs"
                  >
                    🔔 Thanh La (Cắc)
                  </button>
                  <button
                    onClick={() => playDrumSound('cheer')}
                    className="p-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-center transition-colors cursor-pointer shadow-2xs"
                  >
                    ✨ Hô Kết Màn!
                  </button>
                </div>
              </div>
            </div>

            {/* Right 5 Columns: Selected Performer Profile & Act List */}
            <div className="lg:col-span-5 space-y-4">
              {/* Selected Performer Detailed Dossier */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3.5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Hồ Sơ Diễn Viên #{selectedPerformer.id}</span>
                  </span>
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                    selectedPerformer.gender === 'nu' 
                      ? 'bg-amber-100 text-amber-800' 
                      : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {selectedPerformer.gender === 'nu' ? 'Nữ' : 'Nam'} • {selectedPerformer.grade}
                  </span>
                </div>

                <div>
                  <h4 className="text-base font-bold text-slate-900">{selectedPerformer.name}</h4>
                  <p className="text-xs font-medium text-emerald-700 mt-0.5">{selectedPerformer.role}</p>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <span className="font-semibold text-slate-700 block text-[11px]">Đạo cụ chính:</span>
                    <p className="text-slate-800 font-medium">{selectedPerformer.primaryProp}</p>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <span className="font-semibold text-slate-700 block text-[11px]">Trang phục biểu diễn:</span>
                    <p className="text-slate-700">{selectedPerformer.costume}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="text-slate-500 block">Vị trí cánh gà:</span>
                      <span className="font-bold text-slate-800">{selectedPerformer.entrySide}</span>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="text-slate-500 block">Động tác màn này:</span>
                      <span className="font-bold text-emerald-700">
                        {activeStep.positions.find(p => p.id === selectedPerformer.id)?.action || 'Di chuyển'}
                      </span>
                    </div>
                  </div>

                  <div className="p-2.5 bg-rose-50/70 rounded-xl border border-rose-200 text-[11px] text-rose-900 space-y-0.5">
                    <span className="font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-rose-600" />
                      <span>Lưu ý an toàn sân khấu:</span>
                    </span>
                    <p>{selectedPerformer.safetyNote}</p>
                  </div>
                </div>

                {/* Quick 14 Performer Number Selector */}
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-[11px] text-slate-500 block mb-2 font-medium">Bấm chọn nhanh diễn viên:</span>
                  <div className="grid grid-cols-7 gap-1.5">
                    {PERFORMER_ROSTER.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => setSelectedPerformerId(p.id)}
                        className={`h-8 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
                          selectedPerformerId === p.id 
                            ? 'bg-slate-900 text-white shadow-xs ring-2 ring-emerald-500' 
                            : p.gender === 'nu' 
                              ? 'bg-amber-100 text-amber-900 hover:bg-amber-200' 
                              : 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200'
                        }`}
                        title={`${p.name} (${p.role})`}
                      >
                        {p.id}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 3 Performance Acts Quick Card */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Tổng 3 Tiết Mục Biểu Diễn (9.5 Phút)
                  </h4>
                  <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Chuẩn 7-10 phút
                  </span>
                </div>

                <div className="space-y-2">
                  {items.map((act) => (
                    <div
                      key={act.id}
                      onClick={() => setSelectedActId(act.id)}
                      className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                        selectedActId === act.id
                          ? 'bg-emerald-50/70 border-emerald-500 ring-2 ring-emerald-500/20'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">
                          {act.order}. {act.title}
                        </span>
                        <span className="font-mono font-bold text-emerald-700">
                          {act.durationMinutes}p
                        </span>
                      </div>
                      <p className="text-slate-500 text-[11px] mt-1 line-clamp-1">
                        {act.leadPerformers} • {act.genre}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: COMPLETE 14 PERFORMER ROSTER TABLE                */}
      {/* ======================================================== */}
      {activeTab === 'roster' && (
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-600" />
                <span>Danh Sách 14 Diễn Viên Nhí & Hồ Sơ Phân Vai Chi Tiết</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Cơ cấu: 6 Đội viên Nam + 8 Đội viên Nữ (Đáp ứng 100% tiêu chí có cả nam và nữ tham gia)
              </p>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs">
              <button
                onClick={() => setFilterGender('all')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                  filterGender === 'all' ? 'bg-white text-emerald-700 font-bold shadow-xs' : 'text-slate-600'
                }`}
              >
                Tất cả (14)
              </button>
              <button
                onClick={() => setFilterGender('nam')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                  filterGender === 'nam' ? 'bg-white text-emerald-700 font-bold shadow-xs' : 'text-slate-600'
                }`}
              >
                Nam (6)
              </button>
              <button
                onClick={() => setFilterGender('nu')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                  filterGender === 'nu' ? 'bg-white text-amber-700 font-bold shadow-xs' : 'text-slate-600'
                }`}
              >
                Nữ (8)
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold">
                  <th className="py-2.5 px-3 w-12 text-center">STT</th>
                  <th className="py-2.5 px-3">Họ và tên</th>
                  <th className="py-2.5 px-3">Chi đội / Lớp</th>
                  <th className="py-2.5 px-3">Vai trò trên sân khấu</th>
                  <th className="py-2.5 px-3">Đạo cụ chính</th>
                  <th className="py-2.5 px-3">Trang phục</th>
                  <th className="py-2.5 px-3">Lối ra vào</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredRoster.map((performer) => (
                  <tr key={performer.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-3 text-center font-bold font-mono text-slate-900">
                      #{performer.id}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${
                          performer.gender === 'nu' ? 'bg-amber-400' : 'bg-emerald-500'
                        }`} />
                        <span>{performer.name}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">
                      {performer.grade}
                    </td>
                    <td className="py-2.5 px-3 font-medium text-emerald-800">
                      {performer.role}
                    </td>
                    <td className="py-2.5 px-3 text-slate-700">
                      {performer.primaryProp}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 max-w-[220px]">
                      {performer.costume}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                        performer.entrySide === 'Cánh gà Trái' 
                          ? 'bg-blue-50 text-blue-700' 
                          : 'bg-purple-50 text-purple-700'
                      }`}>
                        {performer.entrySide}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: STAGE CUESHEET (AUDIO, LIGHTING, SFX)             */}
      {/* ======================================================== */}
      {activeTab === 'cues' && (
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Zap className="w-5 h-5 text-emerald-600" />
                <span>Kịch Bản Điều Khiển Âm Thanh, Ánh Sáng & Hiệu Ứng Sân Khấu (Cue Sheet)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Bản giao việc cho bộ phận kỹ thuật âm thanh, ánh sáng xã Hải Anh khớp lệnh từng phút
              </p>
            </div>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-lg">
              6 Mốc Kỹ Thuật
            </span>
          </div>

          <div className="space-y-3">
            {STAGE_CUES.map((cue) => (
              <div 
                key={cue.id}
                className={`p-4 rounded-xl border text-xs transition-all ${
                  cue.isHighlight 
                    ? 'bg-gradient-to-r from-amber-50/70 via-white to-amber-50/30 border-amber-300 shadow-2xs' 
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs bg-slate-900 text-white px-2.5 py-0.5 rounded">
                      {cue.timestamp}
                    </span>
                    <span className="font-bold text-sm text-slate-900">{cue.actName}</span>
                  </div>
                  {cue.isHighlight && (
                    <span className="text-[11px] font-bold text-amber-800 bg-amber-200/80 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-600" />
                      <span>Màn cao trào chấm điểm</span>
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
                  <div className="p-2.5 bg-white rounded-lg border border-slate-200 space-y-1">
                    <span className="font-bold text-blue-700 block text-[11px] flex items-center gap-1">
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Kỹ thuật Âm thanh:</span>
                    </span>
                    <p className="text-slate-700 leading-relaxed">{cue.audioCue}</p>
                  </div>

                  <div className="p-2.5 bg-white rounded-lg border border-slate-200 space-y-1">
                    <span className="font-bold text-amber-700 block text-[11px] flex items-center gap-1">
                      <Lightbulb className="w-3.5 h-3.5" />
                      <span>Kỹ thuật Ánh sáng & Hiệu ứng:</span>
                    </span>
                    <p className="text-slate-700 leading-relaxed">{cue.lightingCue}</p>
                  </div>

                  <div className="p-2.5 bg-white rounded-lg border border-slate-200 space-y-1">
                    <span className="font-bold text-emerald-700 block text-[11px] flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      <span>Hành động của Diễn viên:</span>
                    </span>
                    <p className="text-slate-700 leading-relaxed">{cue.performerCue}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: 20-POINT SCORING RUBRIC & JUDGE TIPS              */}
      {/* ======================================================== */}
      {activeTab === 'scoring' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Official Rubric from BTC Xã Hải Anh */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <div className="inline-block px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[11px] font-bold mb-1">
                  VĂN BẢN CHÍNH THỨC BAN TỔ CHỨC XÃ HẢI ANH
                </div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                  <span>Biểu Điểm Thi Văn Nghệ (Tổng 20 Điểm)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Quy định chấm điểm chi tiết chia làm 2 phần Hát (10đ) và Múa (10đ)
                </p>
              </div>

              <div className="space-y-3 text-xs">
                {/* 1. Hát (10 điểm) */}
                <div className="p-3.5 bg-indigo-50/70 rounded-xl border border-indigo-200 space-y-2">
                  <div className="flex items-center justify-between font-bold text-indigo-950">
                    <span className="text-sm">1. Số lượng, chủ đề bài hát</span>
                    <span className="font-mono text-sm bg-indigo-200/80 text-indigo-900 px-2 py-0.5 rounded">10.0 đ</span>
                  </div>
                  <ul className="space-y-1 text-slate-700 leading-relaxed text-[11px]">
                    <li className="flex items-start gap-1.5">
                      <span className="text-indigo-600 font-bold">•</span>
                      <span><strong>Chủ đề chuẩn:</strong> Hát đúng chủ đề (Trung thu, Bác Hồ, quê hương đất nước...).</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-indigo-600 font-bold">•</span>
                      <span><strong>Chất lượng nghệ thuật:</strong> Đảm bảo chất lượng bài hát, hát đúng nhạc, đúng giai điệu, truyền cảm.</span>
                    </li>
                  </ul>
                </div>

                {/* 2. Múa (10 điểm) */}
                <div className="p-3.5 bg-indigo-50/70 rounded-xl border border-indigo-200 space-y-2">
                  <div className="flex items-center justify-between font-bold text-indigo-950">
                    <span className="text-sm">2. Tiết mục Múa tập thể</span>
                    <span className="font-mono text-sm bg-indigo-200/80 text-indigo-900 px-2 py-0.5 rounded">10.0 đ</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-700">
                    <div className="p-2 bg-white rounded-lg border border-indigo-100">
                      <div className="flex justify-between font-bold text-slate-900">
                        <span>Đúng chủ đề:</span>
                        <span className="text-indigo-700 font-mono">2.0 đ</span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-0.5">Bám sát Trung thu & Lồng đèn</p>
                    </div>
                    <div className="p-2 bg-white rounded-lg border border-indigo-100">
                      <div className="flex justify-between font-bold text-slate-900">
                        <span>Quân số ≥ 12 (nam & nữ):</span>
                        <span className="text-indigo-700 font-mono">2.0 đ</span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-0.5">Chi đội đạt 14 em (6 nam, 8 nữ)</p>
                    </div>
                    <div className="p-2 bg-white rounded-lg border border-indigo-100">
                      <div className="flex justify-between font-bold text-slate-900">
                        <span>Đúng nhịp điệu:</span>
                        <span className="text-indigo-700 font-mono">3.0 đ</span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-0.5">Động tác khớp phách, nhịp nhàng</p>
                    </div>
                    <div className="p-2 bg-white rounded-lg border border-indigo-100">
                      <div className="flex justify-between font-bold text-slate-900">
                        <span>Múa dẻo, múa đẹp:</span>
                        <span className="text-indigo-700 font-mono">3.0 đ</span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-0.5">Tạo hình uyển chuyển, biểu cảm tươi</p>
                    </div>
                  </div>
                </div>

                {/* Điểm trừ văn nghệ */}
                <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 space-y-1 text-rose-950">
                  <div className="font-bold flex items-center justify-between text-xs text-rose-900">
                    <span>Điểm Trừ Văn Nghệ Theo Quy Định</span>
                    <span className="font-mono text-rose-700">Tối đa trừ 5.0 đ</span>
                  </div>
                  <ul className="text-[11px] space-y-1 text-rose-900 pt-1">
                    <li>• Trang phục không đạt yêu cầu: <strong>trừ 1 điểm</strong></li>
                    <li>• Không tôn trọng kết quả bốc thăm: <strong>trừ 1 điểm</strong></li>
                    <li>• Đưa bài hát không đúng chủ đề: <strong>trừ 1 điểm</strong></li>
                    <li>• Tuyên truyền sai lệch quan điểm, phát ngôn không đúng lúc, đúng chỗ: <strong>trừ 2 điểm</strong></li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Right: Golden Tips & Traps to Avoid */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <h4 className="text-sm font-bold text-slate-900">
                    Mẹo Vàng Chinh Phục Ban Giám Khảo Xã Hải Anh
                  </h4>
                </div>
                <ul className="space-y-2 text-xs text-slate-700 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-600 font-bold">1.</span>
                    <span><strong>Nụ cười rạng rỡ:</strong> Dặn 14 em luôn tươi cười tự tin, ánh mắt nhìn thẳng về phía hàng ghế Ban Giám Khảo, không được nhìn xuống mũi chân.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-600 font-bold">2.</span>
                    <span><strong>Đèn LED đồng bộ:</strong> Thay pin mới 100% cho 14 đèn ông sao và hoa sen trước giờ lên sân khấu 30 phút để đèn sáng rực rỡ nhất.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-600 font-bold">3.</span>
                    <span><strong>Chào nghi thức kết màn:</strong> Động tác chào Đội ở đỉnh kim tự tháp giữ vững đúng 10 giây cho đến khi ánh sáng mờ dần mới hạ tay xuống.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-600 font-bold">4.</span>
                    <span><strong>Giữ sân khấu sạch:</strong> Tuyệt đối không để rơi vãi cánh hoa sen giả hoặc rác trên sàn sân khấu sau khi diễn xong.</span>
                  </li>
                </ul>
              </div>

              <div className="bg-rose-50/70 rounded-2xl p-5 border border-rose-200 shadow-sm space-y-3">
                <div className="flex items-center gap-2 border-b border-rose-200 pb-2.5">
                  <AlertTriangle className="w-5 h-5 text-rose-600" />
                  <h4 className="text-sm font-bold text-rose-950">
                    Quy Định Kỷ Luật Nghiêm Ngặt (Trang 3 BTC)
                  </h4>
                </div>
                <div className="p-3 bg-red-900 text-white rounded-xl text-xs space-y-2">
                  <p className="font-bold text-amber-300 flex items-center gap-1.5">
                    <span>⚠️ Cảnh Báo Trừ 10 Điểm Toàn Đoàn:</span>
                  </p>
                  <p className="text-red-100 text-[11px] leading-relaxed">
                    • Ý kiến phát ngôn bừa bãi, thái độ mọi thành viên trong đơn vị không tôn trọng Ban tổ chức, Ban giám khảo.
                  </p>
                  <p className="text-red-100 text-[11px] leading-relaxed">
                    • Khiếu nại, đề xuất không phục tùng tổ chức.
                  </p>
                  <p className="text-amber-200 font-semibold text-[11px] pt-1 border-t border-red-800">
                    Dặn dò kỹ tất cả phụ huynh, phụ trách và đoàn viên giữ gìn tác phong văn minh, kỷ luật tại hội trại.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
