import React, { useState, useEffect } from 'react';
import {
  Flag,
  Award,
  BookOpen,
  Volume2,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Sparkles,
  Users,
  Shield,
  Clock,
  Compass,
  ChevronRight,
  ArrowRight
} from 'lucide-react';

interface RitualExercise {
  id: string;
  name: string;
  category: 'ca_nhan' | 'doi_hinh' | 'trong_doi';
  description: string;
  requirements: string[];
  points: number;
  completed: boolean;
}

const INITIAL_EXERCISES: RitualExercise[] = [
  {
    id: 'khan_quang',
    name: '1. Động tác thắt, tháo khăn quàng đỏ',
    category: 'ca_nhan',
    description: '100% đội viên thực hiện chuẩn xác, nút khăn vuông vắn, hai dải bằng nhau, so le góc áo ngay ngắn.',
    requirements: [
      'Tay phải cầm đuôi khăn, tay trái cầm góc nhọn, bẻ cổ áo trước khi quàng',
      'Thắt nút vuông cân đối ở chính giữa ngực áo',
      'Độ dài hai đuôi khăn bằng nhau, không bị vặn xoắn'
    ],
    points: 3,
    completed: true
  },
  {
    id: 'chao_doi',
    name: '2. Động tác Chào kiểu đội viên',
    category: 'ca_nhan',
    description: 'Tay phải giơ lên chào, 5 ngón khép kín cách thùy trán phải 5cm, mắt nhìn thẳng tự tin.',
    requirements: [
      'Năm ngón tay khép thẳng biểu tượng cho tinh thần đoàn kết',
      'Cánh tay mở 45 độ, khuỷu tay không ép sát sườn',
      'Ánh mắt kiên định, nụ cười nhẹ trang nghiêm'
    ],
    points: 3,
    completed: true
  },
  {
    id: 'nghiem_nghi_quay',
    name: '3. Tư thế Nghiêm - Nghỉ & Quay các hướng',
    category: 'ca_nhan',
    description: 'Chân chữ V 60 độ, quay gót chân dứt khoát theo khẩu lệnh chỉ huy, không lắc lư thân mình.',
    requirements: [
      'Tư thế đứng nghiêm: hai gót sát, mũi chân mở 60 độ',
      'Quay phải dùng gót chân phải và mũi chân trái làm trụ',
      'Quay đằng sau xoay 180 độ bên phải chuẩn xác'
    ],
    points: 3,
    completed: true
  },
  {
    id: 'doi_hinh_chi_doi',
    name: '4. Đội hình hàng dọc & di chuyển duyệt đội ngũ',
    category: 'doi_hinh',
    description: 'Chi đội tập hợp 3 phân đội, cự ly rộng 1 cánh tay, bước đi đều tăm tắp theo nhịp trống.',
    requirements: [
      'Phân đội 1 làm chuẩn, cự ly cùi chỏ và cánh tay chuẩn mực',
      'Bước đi nhịp 1 chân trái, nhịp 2 chân phải chuẩn phách',
      'Đội ngũ thẳng hàng dọc, hàng ngang không xô lệch'
    ],
    points: 4,
    completed: true
  },
  {
    id: 'chi_huy_doi',
    name: '5. Tác phong & Khẩu lệnh của Chỉ huy Đội',
    category: 'doi_hinh',
    description: 'Chỉ huy hô to, rõ ràng, dứt khoát; vị trí đứng đối diện cách đội hình 3-5m uy nghiêm.',
    requirements: [
      'Khẩu lệnh có dự lệnh và động lệnh rõ ràng',
      'Tư thế chỉ huy đứng thẳng, tay phát lệnh chuẩn xác',
      'Tác phong nhanh nhẹn, gương mẫu, tự tin'
    ],
    points: 3,
    completed: true
  },
  {
    id: 'trong_doi_3_chiec',
    name: '6. Bộ trống Đội 3 chiếc & 3 bài trống quy định',
    category: 'trong_doi',
    description: 'Gồm 1 trống cái và 2 trống con; gõ đều nhịp các bài: Chào cờ, Hành tiến, Chào mừng.',
    requirements: [
      '1 Trống cái (bass) gõ TÙNG dứt khoát, giữ vững nhịp tim của chi đội',
      '2 Trống con đeo chéo vai trái, dùi trống đánh nhịp RINH - CẮC chuẩn xác',
      'Phối hợp ăn ý, không bị lỡ nhịp giữa trống cái và trống con'
    ],
    points: 4,
    completed: true
  }
];

export const PioneerRitualManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'drum_sim' | 'exercises' | 'camp_corner'>('overview');
  const [exercises, setExercises] = useState<RitualExercise[]>(INITIAL_EXERCISES);
  const [selectedDrumTrack, setSelectedDrumTrack] = useState<'chao_co' | 'hanh_tien' | 'chao_mung'>('chao_co');
  const [isPlayingRhythm, setIsPlayingRhythm] = useState<boolean>(false);
  const [currentBeat, setCurrentBeat] = useState<number>(0);
  const [feedbackSound, setFeedbackSound] = useState<string | null>(null);

  // Toggle Exercise Completion
  const toggleExercise = (id: string) => {
    setExercises(prev => prev.map(ex => ex.id === id ? { ...ex, completed: !ex.completed } : ex));
  };

  // Web Audio Synthesizer for Drums
  const triggerDrumSound = (soundType: 'cai' | 'con_rinh' | 'con_cac') => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      if (soundType === 'cai') {
        // Bass drum
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(130, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.35);
        gain.gain.setValueAtTime(1.0, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
        setFeedbackSound('🥁 TÙNG! (Trống Cái)');
      } else if (soundType === 'con_rinh') {
        // Snare drum body
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(330, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(170, ctx.currentTime + 0.18);
        gain.gain.setValueAtTime(0.75, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
        setFeedbackSound('🪘 RINH! (Trống Con)');
      } else {
        // Rim / stick click
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(920, ctx.currentTime);
        gain.gain.setValueAtTime(0.4, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.08);
        setFeedbackSound('⚡ CẮC! (Gõ dùi / vành)');
      }

      setTimeout(() => setFeedbackSound(null), 1500);
    } catch (e) {
      console.log('AudioContext play prevented', e);
    }
  };

  // Drum Patterns
  const DRUM_PATTERNS = {
    chao_co: [
      { beat: 1, type: 'cai', label: 'TÙNG' },
      { beat: 2, type: 'con_rinh', label: 'rinh' },
      { beat: 3, type: 'con_rinh', label: 'rinh' },
      { beat: 4, type: 'con_rinh', label: 'rinh' },
      { beat: 5, type: 'cai', label: 'TÙNG' },
      { beat: 6, type: 'con_cac', label: 'cắc' },
      { beat: 7, type: 'con_rinh', label: 'rinh' },
      { beat: 8, type: 'cai', label: 'TÙNG' },
    ],
    hanh_tien: [
      { beat: 1, type: 'cai', label: 'TÙNG' },
      { beat: 2, type: 'con_rinh', label: 'rinh' },
      { beat: 3, type: 'cai', label: 'TÙNG' },
      { beat: 4, type: 'con_rinh', label: 'rinh' },
      { beat: 5, type: 'con_rinh', label: 'rinh' },
      { beat: 6, type: 'cai', label: 'TÙNG' },
    ],
    chao_mung: [
      { beat: 1, type: 'cai', label: 'TÙNG' },
      { beat: 2, type: 'con_rinh', label: 'rinh' },
      { beat: 3, type: 'cai', label: 'TÙNG' },
      { beat: 4, type: 'con_cac', label: 'cắc' },
      { beat: 5, type: 'con_rinh', label: 'rinh' },
      { beat: 6, type: 'con_rinh', label: 'rinh' },
      { beat: 7, type: 'cai', label: 'TÙNG' },
    ]
  };

  // Rhythm auto-play loop
  useEffect(() => {
    let timer: any = null;
    if (isPlayingRhythm) {
      const pattern = DRUM_PATTERNS[selectedDrumTrack];
      timer = setInterval(() => {
        setCurrentBeat(prev => {
          const next = (prev + 1) % pattern.length;
          const step = pattern[next];
          triggerDrumSound(step.type as any);
          return next;
        });
      }, 500);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlayingRhythm, selectedDrumTrack]);

  const totalPoints = exercises.filter(e => e.completed).reduce((s, e) => s + e.points, 0);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-amber-100 text-xs font-bold mb-3">
              <Flag className="w-3.5 h-3.5 fill-amber-200" />
              <span>PHẦN 3: NGHI THỨC ĐỘI TNTP HỒ CHÍ MINH</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              TRỐNG CỜ, DUYỆT ĐỘI NGŨ & BÀI TRÍ GÓC HỌC TẬP
            </h2>
            <p className="text-amber-100 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              Thực hiện chuẩn điều lệ Đội TNTP Hồ Chí Minh. Bài trí chính xác vị trí Góc học tập bên phải, Khẩu hiệu bên trái, cùng dàn trống Đội 3 chiếc sẵn sàng cho lễ chào cờ và duyệt đội ngũ.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center">
              <span className="text-[10px] uppercase font-bold text-amber-200 block">Tiêu Chuẩn Đạt</span>
              <span className="text-2xl font-black font-mono">{totalPoints}/20 đ</span>
            </div>
            <div className="px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center">
              <span className="text-[10px] uppercase font-bold text-amber-200 block">Dàn Trống Đội</span>
              <span className="text-2xl font-black font-mono">3 Chiếc</span>
            </div>
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-amber-500/50 overflow-x-auto text-xs font-semibold scrollbar-none">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === 'overview'
                ? 'bg-white text-amber-900 shadow-md font-bold'
                : 'text-amber-100 hover:bg-white/10'
            }`}
          >
            <Flag className="w-4 h-4" />
            <span>1. Quy Định Bắt Buộc & Vị Trí</span>
          </button>

          <button
            onClick={() => setActiveTab('drum_sim')}
            className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === 'drum_sim'
                ? 'bg-white text-amber-900 shadow-md font-bold'
                : 'text-amber-100 hover:bg-white/10'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            <span>2. Mô Phỏng Dàn Trống Đội (3 Bài)</span>
          </button>

          <button
            onClick={() => setActiveTab('exercises')}
            className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === 'exercises'
                ? 'bg-white text-amber-900 shadow-md font-bold'
                : 'text-amber-100 hover:bg-white/10'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>3. Nghi Thức Cá Nhân & Đội Hình</span>
          </button>

          <button
            onClick={() => setActiveTab('camp_corner')}
            className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === 'camp_corner'
                ? 'bg-white text-amber-900 shadow-md font-bold'
                : 'text-amber-100 hover:bg-white/10'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>4. Bản Đồ Bố Trí Góc Bàn Học & Cờ</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Overview & Critical Rules */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Crucial Position Guidelines Alert */}
          <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-amber-950 uppercase tracking-wide">
                  ĐIỀU CẤM KỴ - ĐẶT SAI VỊ TRÍ SẼ BỊ BAN GIÁM KHẢO TRỪ ĐIỂM RẤT NẶNG!
                </h4>
                <p className="text-xs text-amber-900 leading-relaxed">
                  Căn cứ Hướng dẫn Hội trại thu Xã Hải Anh 2026: Khi đứng từ ngoài cổng nhìn vào lều trại chính:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  <div className="p-3 bg-white rounded-xl border border-amber-200">
                    <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>BẮT BUỘC BÊN PHẢI (Right Wing):</span>
                    </span>
                    <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                      <strong>Góc học tập:</strong> Bàn học chữ nhật phủ khăn đẹp, đèn bàn học có bóng cắm điện sáng, sách vở giáo khoa, hộp bút mực, hoa tươi trang trí và tranh truyện thiếu nhi.
                    </p>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-amber-200">
                    <span className="text-xs font-bold text-blue-800 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-blue-600" />
                      <span>BẮT BUỘC BÊN TRÁI (Left Wing):</span>
                    </span>
                    <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                      <strong>Khẩu hiệu Đội & Giá Trống:</strong> Khẩu hiệu chính thức năm học 2026-2027: <em>"Thiếu nhi Ninh Bình vững bước tiến vào kỷ nguyên mới"</em>, cùng giá đỡ cờ Đội và bộ trống Đội 3 chiếc.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3 Major Pillars of Ritual */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center">
                <Flag className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Bàn Thờ Bác Hồ & Tổ Quốc</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Đặt ở vị trí trang trọng nhất chính giữa hậu cung lều: Cờ Tổ quốc treo bên trái, Cờ Đội treo bên phải; Ảnh Bác Hồ đặt ở vị trí trung tâm, bên dưới có 5 điều Bác Hồ dạy, lọ hoa sen và mâm ngũ quả Tết Trung thu.
              </p>
              <div className="pt-2 text-[11px] text-emerald-700 font-bold flex items-center gap-1 border-t border-slate-100">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Trang nghiêm, đúng tỷ lệ lễ nghi</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <Volume2 className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Dàn Trống Đội 3 Chiếc</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Trang bị đầy đủ 1 trống cái (đường kính 48cm) và 2 trống con (đường kính 32cm), dây đeo chéo màu đỏ thắm. 3 đội viên đánh trống thuộc lòng 3 bài trống: Chào cờ, Hành tiến và Chào mừng.
              </p>
              <div className="pt-2 text-[11px] text-emerald-700 font-bold flex items-center gap-1 border-t border-slate-100">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Âm vang, chuẩn nhịp phách Đội</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Tác Phong Đội Viên & Kỷ Luật</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Đội viên đồng phục áo trắng sơ vin, quần/váy xanh sẫm, đi giày bata trắng, khăn quàng đỏ thắt nút vuông chuẩn. Tác phong nhanh nhẹn, lễ phép, tuyệt đối không phát ngôn thiếu văn minh.
              </p>
              <div className="pt-2 text-[11px] text-emerald-700 font-bold flex items-center gap-1 border-t border-slate-100">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Tránh trừ 10 điểm toàn đoàn</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Interactive Drum Simulator */}
      {activeTab === 'drum_sim' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Volume2 className="w-5 h-5 text-amber-600" />
                  <span>Trình Mô Phỏng Âm Thanh & Nhịp Phách Dàn Trống Đội</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Luyện tập 3 bài trống quy định Đội TNTP: Trống Chào Cờ, Trống Hành Tiến và Trống Chào Mừng
                </p>
              </div>

              {/* Sound Toast */}
              {feedbackSound && (
                <div className="px-3 py-1.5 rounded-xl bg-slate-900 text-amber-400 text-xs font-mono font-bold animate-bounce shadow-md">
                  {feedbackSound}
                </div>
              )}
            </div>

            {/* Track Selector & Auto Play Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setSelectedDrumTrack('chao_co'); setCurrentBeat(0); }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    selectedDrumTrack === 'chao_co'
                      ? 'bg-amber-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  1. Bài Trống Chào Cờ
                </button>
                <button
                  onClick={() => { setSelectedDrumTrack('hanh_tien'); setCurrentBeat(0); }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    selectedDrumTrack === 'hanh_tien'
                      ? 'bg-amber-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  2. Bài Trống Hành Tiến
                </button>
                <button
                  onClick={() => { setSelectedDrumTrack('chao_mung'); setCurrentBeat(0); }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    selectedDrumTrack === 'chao_mung'
                      ? 'bg-amber-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  3. Bài Trống Chào Mừng
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlayingRhythm(!isPlayingRhythm)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs ${
                    isPlayingRhythm
                      ? 'bg-rose-600 text-white hover:bg-rose-700'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700'
                  }`}
                >
                  {isPlayingRhythm ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                  <span>{isPlayingRhythm ? 'Tạm Dừng Chạy Nhịp' : 'Phát Tự Động Theo Nhịp'}</span>
                </button>

                <button
                  onClick={() => { setIsPlayingRhythm(false); setCurrentBeat(0); }}
                  className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                  title="Đặt lại từ đầu"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Visual Beat Ribbon */}
            <div className="p-4 bg-slate-900 rounded-2xl text-white space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Dải Nhịp Phách Bài: <strong className="text-amber-400 uppercase">{selectedDrumTrack.replace('_', ' ')}</strong></span>
                <span className="font-mono text-emerald-400 font-bold">Phách {currentBeat + 1} / {DRUM_PATTERNS[selectedDrumTrack].length}</span>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {DRUM_PATTERNS[selectedDrumTrack].map((beat, idx) => {
                  const isActive = isPlayingRhythm && currentBeat === idx;
                  return (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl text-center border transition-all ${
                        isActive
                          ? 'bg-amber-500 text-slate-950 border-amber-300 font-black scale-105 shadow-md'
                          : beat.type === 'cai'
                          ? 'bg-red-950/60 border-red-800/80 text-red-200'
                          : beat.type === 'con_rinh'
                          ? 'bg-blue-950/60 border-blue-800/80 text-blue-200'
                          : 'bg-slate-800 border-slate-700 text-slate-300'
                      }`}
                    >
                      <span className="block text-[10px] opacity-70">Phách {idx + 1}</span>
                      <span className="text-sm font-black uppercase font-mono mt-0.5 block">{beat.label}</span>
                      <span className="text-[9px] block opacity-80 mt-1">
                        {beat.type === 'cai' ? 'Trống Cái' : beat.type === 'con_rinh' ? 'Trống Con' : 'Vành Dùi'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Interactive Manual Drum Pad */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wide block">
                Bàn Gõ Thủ Công Thử Nghiệm Âm Thanh (Bấm Vào Mặt Trống)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Trống Cái */}
                <button
                  onClick={() => triggerDrumSound('cai')}
                  className="p-5 rounded-2xl bg-gradient-to-b from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 border-2 border-red-300 active:scale-95 transition-all text-center group cursor-pointer shadow-xs"
                >
                  <div className="w-16 h-16 mx-auto rounded-full bg-red-600 text-white flex items-center justify-center font-black text-lg shadow-sm group-hover:scale-105 transition-transform">
                    TÙNG!
                  </div>
                  <h4 className="text-xs font-bold text-red-950 mt-3">Trống Cái (Bass Drum)</h4>
                  <p className="text-[11px] text-red-800 mt-0.5">Âm trầm, giữ nhịp chính</p>
                </button>

                {/* Trống Con Rinh */}
                <button
                  onClick={() => triggerDrumSound('con_rinh')}
                  className="p-5 rounded-2xl bg-gradient-to-b from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 border-2 border-blue-300 active:scale-95 transition-all text-center group cursor-pointer shadow-xs"
                >
                  <div className="w-16 h-16 mx-auto rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-lg shadow-sm group-hover:scale-105 transition-transform">
                    RINH!
                  </div>
                  <h4 className="text-xs font-bold text-blue-950 mt-3">Trống Con (Snare Mặt Da)</h4>
                  <p className="text-[11px] text-blue-800 mt-0.5">Âm đanh, rải phách dặm</p>
                </button>

                {/* Trống Con Cắc */}
                <button
                  onClick={() => triggerDrumSound('con_cac')}
                  className="p-5 rounded-2xl bg-gradient-to-b from-amber-50 to-amber-100 hover:from-amber-100 hover:to-amber-200 border-2 border-amber-300 active:scale-95 transition-all text-center group cursor-pointer shadow-xs"
                >
                  <div className="w-16 h-16 mx-auto rounded-full bg-amber-600 text-white flex items-center justify-center font-black text-lg shadow-sm group-hover:scale-105 transition-transform">
                    CẮC!
                  </div>
                  <h4 className="text-xs font-bold text-amber-950 mt-3">Gõ Vành Dùi (Rim Click)</h4>
                  <p className="text-[11px] text-amber-800 mt-0.5">Âm thanh gỗ cao, báo nhịp</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Individual & Formation Exercises */}
      {activeTab === 'exercises' && (
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>6 Nội Dung Huấn Luyện Nghi Thức Đội Chấm Điểm (20 Điểm)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Bấm vào các ô để đánh dấu chi đội đã hoàn thành tập dượt đạt chuẩn
              </p>
            </div>
            <span className="text-xs px-3 py-1 rounded-full font-bold bg-emerald-100 text-emerald-800">
              Điểm đạt: {totalPoints} / 20 đ
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {exercises.map(ex => (
              <div
                key={ex.id}
                onClick={() => toggleExercise(ex.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  ex.completed
                    ? 'bg-emerald-50/50 border-emerald-300 shadow-2xs'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="font-bold text-xs text-slate-900 block">{ex.name}</span>
                    <p className="text-xs text-slate-600 leading-relaxed">{ex.description}</p>
                  </div>
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border ${
                    ex.completed ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white border-slate-300'
                  }`}>
                    {ex.completed && <CheckCircle2 className="w-4 h-4" />}
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-200/60 space-y-1.5 text-[11px] text-slate-700">
                  <span className="font-semibold text-slate-800 block">Yêu cầu then chốt:</span>
                  {ex.requirements.map((req, rIdx) => (
                    <div key={rIdx} className="flex items-start gap-1.5">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>{req}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-3 flex items-center justify-between text-[11px] font-bold">
                  <span className="text-slate-500">Thang điểm nội dung:</span>
                  <span className="font-mono text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    {ex.points} Điểm
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: 2D Blueprint of Camp Interior & Study Corner */}
      {activeTab === 'camp_corner' && (
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-600" />
              <span>Sơ Đồ Bố Trí Góc Bàn Học (Phải) & Khẩu Hiệu - Giá Cờ (Trái)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Trực quan hóa không gian nội thất lều trại 8m x 10m theo quy chuẩn Ban Giám Khảo Xã Hải Anh
            </p>
          </div>

          {/* Graphical Diagram */}
          <div className="bg-slate-900 rounded-2xl p-6 text-white border border-slate-800 relative">
            <div className="text-center pb-4 border-b border-slate-800">
              <span className="text-xs font-mono text-emerald-400 font-bold tracking-wider">
                ▲ HƯỚNG BƯỚC VÀO TỪ CỔNG CHÍNH (NHÌN VÀO HẬU CUNG) ▲
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
              {/* Left Wing: Khẩu hiệu & Cờ Đội */}
              <div className="p-4 rounded-xl bg-blue-950/70 border border-blue-700 text-center space-y-2">
                <div className="inline-block px-2.5 py-0.5 rounded-full bg-blue-800 text-blue-200 text-[10px] font-bold">
                  BÊN TRÁI (LEFT)
                </div>
                <h4 className="text-sm font-bold text-white">Khẩu Hiệu Đội & Bộ Trống</h4>
                <div className="p-2.5 bg-blue-900/50 rounded-lg text-xs text-blue-200 leading-relaxed font-mono">
                  "Thiếu nhi Ninh Bình vững bước tiến vào kỷ nguyên mới"
                </div>
                <p className="text-[11px] text-blue-300">
                  Giá cờ Đội, giá để 3 chiếc trống Đội và sổ nhật ký chi đội
                </p>
              </div>

              {/* Center: Bàn thờ Tổ quốc */}
              <div className="p-4 rounded-xl bg-red-950/70 border border-red-700 text-center space-y-2">
                <div className="inline-block px-2.5 py-0.5 rounded-full bg-red-800 text-red-200 text-[10px] font-bold">
                  CHÍNH GIỮA (CENTER)
                </div>
                <h4 className="text-sm font-bold text-white">Bàn Thờ Tổ Quốc & Bác Hồ</h4>
                <div className="p-2 bg-red-900/50 rounded-lg text-xs text-red-200 space-y-1">
                  <p className="font-bold">Ảnh Bác Hồ • Cờ Tổ Quốc • Cờ Đội</p>
                  <p className="text-[11px]">Bảng 5 Điều Bác Hồ Dạy • Mâm ngũ quả Trung thu</p>
                </div>
                <p className="text-[11px] text-red-300">
                  Lọ hoa sen tươi, đèn led vàng trang nghiêm
                </p>
              </div>

              {/* Right Wing: Góc học tập */}
              <div className="p-4 rounded-xl bg-emerald-950/70 border border-emerald-700 text-center space-y-2">
                <div className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-800 text-emerald-200 text-[10px] font-bold">
                  BÊN PHẢI (RIGHT - BẮT BUỘC)
                </div>
                <h4 className="text-sm font-bold text-white">Góc Học Tập & Đèn Bàn</h4>
                <div className="p-2 bg-emerald-900/50 rounded-lg text-xs text-emerald-200 space-y-1">
                  <p className="font-bold">Bàn học chữ nhật phủ khăn viền ren</p>
                  <p className="text-[11px]">Đèn bàn học sáng ấm • Sách giáo khoa mẫu mực</p>
                </div>
                <p className="text-[11px] text-emerald-300">
                  Hộp bút mực, thước kẻ, tập vở bài tập sạch sẽ ngăn nắp
                </p>
              </div>
            </div>

            <div className="text-center pt-3 border-t border-slate-800 text-xs text-slate-400">
              ▼ LỐI ĐI CHÍNH GIỮA TRẠI (RỘNG 1,5M TRẢI THẢM ĐỎ HOẶC CÁT SẠCH) ▼
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
