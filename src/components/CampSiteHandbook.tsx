import React, { useState } from 'react';
import { 
  Map, 
  CheckCircle2, 
  Compass, 
  Maximize2, 
  Info, 
  ArrowRight, 
  Layers, 
  Calendar, 
  Ruler, 
  Sparkles, 
  AlertCircle,
  HelpCircle,
  Scissors,
  Wrench,
  ChevronDown,
  ChevronUp,
  Clock,
  Award,
  BookOpen,
  Pin
} from 'lucide-react';
import { CampKnotMasterclass } from './CampKnotMasterclass';
import { CampSpecsDeepDive } from './CampSpecsDeepDive';

interface HotspotZone {
  id: string;
  name: string;
  area: string;
  coordX: number; // meters
  coordY: number; // meters
  specs: string;
  scoreImpact: string;
  practicalTips: string;
  surveyGuide: string;
}

interface CoordinatePoint {
  id: string;
  name: string;
  code: string;
  xM: number;
  yM: number;
  description: string;
  elevation: string;
  tool: string;
}

const SURVEY_POINTS: CoordinatePoint[] = [
  { id: 'p_a', code: 'A', name: 'Mốc góc Tây-Bắc', xM: 0.0, yM: 0.0, description: 'Góc ranh giới chuẩn lấy vuông 90° bằng dây 3-4-5', elevation: 'Cọc gỗ 50cm', tool: 'Thước dây 20m + Êke' },
  { id: 'p_b', code: 'B', name: 'Mốc góc Đông-Bắc', xM: 8.0, yM: 0.0, description: 'Cọc ranh giới mặt tiền bên phải (đo 8.0m từ mốc A)', elevation: 'Cọc gỗ 50cm', tool: 'Thước dây 20m' },
  { id: 'p_c', code: 'C', name: 'Mốc góc Đông-Nam', xM: 8.0, yM: 10.0, description: 'Cọc góc hậu bên phải (đo 10.0m từ mốc B vuông góc)', elevation: 'Cọc gỗ 50cm', tool: 'Thước dây 20m' },
  { id: 'p_d', code: 'D', name: 'Mốc góc Tây-Nam', xM: 0.0, yM: 10.0, description: 'Cọc góc hậu bên trái (đo 10.0m từ mốc A vuông góc)', elevation: 'Cọc gỗ 50cm', tool: 'Thước dây 20m' },
  { id: 'p_t1', code: 'T1', name: 'Trụ cổng trước Trái', xM: 3.4, yM: 1.2, description: 'Trụ tre đực già phi 8-10cm, chôn sâu 50cm', elevation: '+1.80m', tool: 'Xẻng đào hố + Búa' },
  { id: 'p_t2', code: 'T2', name: 'Trụ cổng trước Phải', xM: 4.6, yM: 1.2, description: 'Cách trụ T1 đúng 1.2m lọt lòng cửa chính', elevation: '+1.80m', tool: 'Thước dây' },
  { id: 'p_t3', code: 'T3', name: 'Trụ hộp kép sau Trái', xM: 2.8, yM: 1.7, description: 'Cách T1 50cm về phía sau tạo hộp 3D', elevation: '+1.80m', tool: 'Thước dây + Giằng xà' },
  { id: 'p_t4', code: 'T4', name: 'Trụ hộp kép sau Phải', xM: 5.2, yM: 1.7, description: 'Cách T2 50cm về phía sau tạo hộp 3D', elevation: '+1.80m', tool: 'Thước dây + Giằng xà' },
  { id: 'p_m', code: 'M', name: 'Chân cột chính lều', xM: 4.0, yM: 5.6, description: 'Tâm đối xứng toàn bộ lều trại, cao 1.8m chuẩn', elevation: '+1.80m', tool: 'Thước dây định tâm' },
  { id: 'p_c1', code: 'C1', name: 'Cột con trước Trái', xM: 2.2, yM: 4.0, description: 'Cột tre cao 1.0m, đỡ góc bạt trước trái', elevation: '+1.00m', tool: 'Thước dây 5m' },
  { id: 'p_c2', code: 'C2', name: 'Cột con trước Phải', xM: 5.8, yM: 4.0, description: 'Cột tre cao 1.0m, đỡ góc bạt trước phải', elevation: '+1.00m', tool: 'Thước dây 5m' },
  { id: 'p_c3', code: 'C3', name: 'Cột con sau Trái', xM: 2.2, yM: 7.2, description: 'Cột tre cao 1.0m, đỡ góc bạt sau trái', elevation: '+1.00m', tool: 'Thước dây 5m' },
  { id: 'p_c4', code: 'C4', name: 'Cột con sau Phải', xM: 5.8, yM: 7.2, description: 'Cột tre cao 1.0m, đỡ góc bạt sau phải', elevation: '+1.00m', tool: 'Thước dây 5m' },
  { id: 'p_k1', code: 'K1', name: 'Cọc néo góc trước T', xM: 1.4, yM: 3.2, description: 'Đo đúng 80cm từ C1 chéo 45°, nút thuyền chài', elevation: 'Âm 35cm', tool: 'Thước đo 80cm + Búa' },
  { id: 'p_k2', code: 'K2', name: 'Cọc néo góc trước P', xM: 6.6, yM: 3.2, description: 'Đo đúng 80cm từ C2 chéo 45°, nút thuyền chài', elevation: 'Âm 35cm', tool: 'Thước đo 80cm + Búa' },
  { id: 'p_k3', code: 'K3', name: 'Cọc néo nóc trước', xM: 4.0, yM: 3.8, description: 'Cách chân cột to M đúng 1.80m vuông góc', elevation: 'Âm 40cm', tool: 'Thước đo 1.8m + Búa' },
  { id: 'p_k4', code: 'K4', name: 'Cọc néo nóc sau', xM: 4.0, yM: 7.4, description: 'Cách chân cột to M đúng 1.80m phía sau', elevation: 'Âm 40cm', tool: 'Thước đo 1.8m + Búa' },
  { id: 'p_altar', code: 'BAN', name: 'Ban thờ Bác Hồ', xM: 4.0, yM: 6.8, description: 'Chính giữa vách hậu, cờ Tổ quốc treo cao nhất', elevation: '+0.80m', tool: 'Bàn gỗ + Khăn nhung' },
  { id: 'p_study', code: 'PHẢI', name: 'Góc học tập (Bên Phải)', xM: 6.5, yM: 5.6, description: 'Bắt buộc nằm BÊN TAY PHẢI nhìn từ cổng vào', elevation: '+0.75m', tool: 'Bàn học + Đèn Rạng Đông' },
  { id: 'p_slogan', code: 'TRÁI', name: 'Khẩu hiệu (Bên Trái)', xM: 1.5, yM: 5.6, description: 'Bắt buộc nằm BÊN TAY TRÁI: Trống Đội + Khẩu hiệu', elevation: '+1.20m', tool: 'Giá đỡ + Trống Đội' }
];

const SITE_ZONES: HotspotZone[] = [
  {
    id: 'gate',
    name: '1. Cổng Trại Hộp Kép & Cửa Lách',
    area: 'Mặt tiền sân trại (Rộng 4m × Sâu 1.5m)',
    coordX: 4.0,
    coordY: 1.3,
    specs: 'Cổng chính: Cao 1.8m, rộng 1.2m. Hai cửa lách phụ: rộng 0.8m mỗi bên. 4 trụ tre phi 8-10cm tạo hộp 3D sâu 50cm.',
    scoreImpact: '15/15 điểm (Hộp kép 7đ + Trang trí thủ công 5đ + 2 cửa lách 3đ)',
    practicalTips: 'Dùng dây kẽm buộc chặt cốt tre bên trong, bên ngoài quấn cót ép giả cổ. Bảng tên chữ nổi mút xốp phủ kim tuyến vàng óng.',
    surveyGuide: 'Đặt mốc tim cổng tại X=4.0m, đo sang 2 bên mỗi bên 0.6m để xác định 2 trụ chính T1, T2.'
  },
  {
    id: 'tent_canopy',
    name: '2. Thân Lều & Mái Bạt Chữ A',
    area: 'Trung tâm khu đất (Rộng 3.6m × Sâu 3.6m)',
    coordX: 4.0,
    coordY: 5.6,
    specs: 'Cột chính giữa cao 1.8m, cột con 4 góc cao 1.0m. Mái bạt kéo phẳng phiu dốc 35°, mép lều song song.',
    scoreImpact: '15/15 điểm (Khung cọc vững chắc 5đ + Kỹ thuật căng bạt phẳng 5đ + Mỹ quan 5đ)',
    practicalTips: 'Căng dây chéo góc trước để định tâm lều, sau đó kéo căng 4 góc lều để bạt phẳng phiu không bị gợn sóng.',
    surveyGuide: 'Tâm lều M đặt tại (4.0m, 5.6m). Bốn cột con đặt tại các khoảng cách 1.8m tính từ tâm lều theo 4 góc.'
  },
  {
    id: 'stakes_ropes',
    name: '3. Hệ Thống 8 Cọc Néo & Dây Giằng 80cm',
    area: 'Hành lang néo đất (Cách mép lều đúng 80cm)',
    coordX: 4.0,
    coordY: 5.6,
    specs: '8 cọc cắm đất sâu 35-40cm, nghiêng 45 độ ngược hướng kéo. Khoảng cách mép lều tới cọc chuẩn 80cm. 100% nút thuyền chài.',
    scoreImpact: '15/15 điểm (Đúng cự ly 80cm 5đ + Nút thuyền chài 5đ + Cọc thẳng hàng 5đ)',
    practicalTips: 'Cắt sẵn thanh tre chuẩn dài đúng 80cm làm dưỡng đo vị trí cắm cọc, đảm bảo sai số dưới 1cm khi chấm thi.',
    surveyGuide: 'Dùng dây mốc căng thẳng 2 đường biên ngoài trước khi đóng cọc để 4 cọc hàng trước và 4 cọc hàng sau thẳng hàng song song.'
  },
  {
    id: 'altar_fruits',
    name: '4. Ban Thờ Bác Hồ & Mâm Ngũ Quả',
    area: 'Vách hậu chính giữa lều (Rộng 1.4m × Sâu 0.8m)',
    coordX: 4.0,
    coordY: 6.8,
    specs: 'Cờ Tổ quốc treo cao nhất, ảnh Bác Hồ ở giữa, 5 điều Bác dạy bên dưới. Mâm ngũ quả có chú chó bưởi lông xù mắt đỗ đen.',
    scoreImpact: '10/10 điểm (Nghi lễ trang trọng 5đ + Mâm ngũ quả truyền thống 5đ)',
    practicalTips: 'Khăn trải bàn nhung đỏ viền ren vàng tua rua. Bưởi chọn quả múi đều làm lông xù chú chó, cài nơ lụa đỏ.',
    surveyGuide: 'Kê bàn áp sát vách hậu lều tại trục tim X=4.0m, cách tâm cột chính M 1.2m về phía sau.'
  },
  {
    id: 'study_corner',
    name: '5. Góc Học Tập Thiếu Nhi (Bên Phải)',
    area: 'Góc trong bên phải lều (Rộng 1.5m × Sâu 1.2m)',
    coordX: 6.5,
    coordY: 5.6,
    specs: 'Bàn học ngay ngắn, giá sách vở học sinh giỏi, đèn bàn học sinh Rạng Đông, hộp bút, compa, mô hình STEM.',
    scoreImpact: '5/5 điểm (Bắt buộc BÊN PHẢI + Đầy đủ đồ dùng)',
    practicalTips: 'Quy chế Hải Anh bắt buộc góc học tập nằm BÊN PHẢI (nhìn từ cổng vào), nếu đặt nhầm bên trái sẽ bị trừ 2.5đ.',
    surveyGuide: 'Đặt bàn học dọc theo vách phải của lều từ Y=4.5m đến Y=6.5m.'
  },
  {
    id: 'slogan_gear',
    name: '6. Khẩu Hiệu & Thiết Bị Đội (Bên Trái)',
    area: 'Góc trong bên trái lều (Rộng 1.5m × Sâu 1.2m)',
    coordX: 1.5,
    coordY: 5.6,
    specs: 'Bảng khẩu hiệu: "Thiếu nhi Ninh Bình vững bước tiến vào kỷ nguyên mới". Bộ trống Đội, cờ Đội trang nghiêm.',
    scoreImpact: '5/5 điểm (Bắt buộc BÊN TRÁI + Đúng nguyên văn khẩu hiệu)',
    practicalTips: 'Chữ khẩu hiệu cắt dán ngay ngắn nền đỏ chữ vàng. Bộ 3 trống Đội lau bóng đặt trên giá gỗ mộc.',
    surveyGuide: 'Bố trí đối xứng với góc học tập bên phải, nằm dọc theo vách trái lều từ Y=4.5m đến Y=6.5m.'
  },
  {
    id: 'waste_sanitation',
    name: '7. Khu Vệ Sinh & Thùng Rác Tự Quản',
    area: 'Góc sau bên phải khu đất (Cách lều 2.5m)',
    coordX: 7.0,
    coordY: 8.8,
    specs: 'Thùng rác có nắp đậy, túi nilon phân loại rác hữu cơ/vô cơ. Quét sạch cỏ rác toàn bộ khuôn viên 80m².',
    scoreImpact: '5/5 điểm Vệ sinh môi trường sạch sẽ tuyệt đối',
    practicalTips: 'Chuẩn bị sẵn sọt rác nan tre đan tay có gắn biển "Giữ gìn vệ sinh chung" để tạo thiện cảm tốt với Ban Giám Khảo.',
    surveyGuide: 'Bố trí tại góc khuất phía sau trại tại tọa độ (7.0m, 8.8m), cách xa lối đi của đoàn chấm.'
  }
];

export const CampSiteHandbook: React.FC = () => {
  const [activeMainTab, setActiveMainTab] = useState<'layout' | 'knots' | 'specs' | 'timeline'>('layout');
  const [selectedZoneId, setSelectedZoneId] = useState<string>('gate');
  const [selectedSurveyPointId, setSelectedSurveyPointId] = useState<string | null>(null);
  const [activeStepTab, setActiveStepTab] = useState<number>(1);
  
  // Layer visibility toggles
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [showRopes, setShowRopes] = useState<boolean>(true);
  const [showPins, setShowPins] = useState<boolean>(true);
  const [showFlow, setShowFlow] = useState<boolean>(true);

  const selectedZone = SITE_ZONES.find(z => z.id === selectedZoneId) || SITE_ZONES[0];
  const selectedPoint = SURVEY_POINTS.find(p => p.id === selectedSurveyPointId);

  return (
    <div id="camp-site-handbook-root" className="space-y-6">
      {/* Visual Header Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 border border-slate-800 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-semibold mb-2 border border-emerald-500/25">
              <Map className="w-3.5 h-3.5" />
              <span>Sơ Đồ Mặt Bằng & Cẩm Nang Kỹ Thuật Chi Tiết 1:1</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white">
              Cẩm Nang Thực Địa & Định Vị Tọa Độ Trại 8m × 10m (80m²)
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Bản vẽ kỹ thuật chi tiết từng mét vuông, tọa độ cắm mốc thực địa, cẩm nang 4 nút dây trại sinh và lộ trình thi công giật trọn 110 điểm tối đa.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-800 px-4 py-2.5 rounded-xl border border-slate-700 text-xs">
              <p className="text-slate-400 font-medium">Lô đất tiêu chuẩn:</p>
              <p className="text-sm font-bold text-white font-mono">8m × 10m = 80 m²</p>
            </div>
            <div className="bg-emerald-950/40 border border-emerald-500/40 px-4 py-2.5 rounded-xl text-xs">
              <p className="text-emerald-400 font-medium">Tiêu chuẩn néo đất:</p>
              <p className="text-sm font-bold text-emerald-300 font-mono">Nút chài 80cm</p>
            </div>
          </div>
        </div>

        {/* 4 Main Tabs Switcher */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex items-center gap-2 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveMainTab('layout')}
            className={`px-3.5 py-2 rounded-xl font-medium whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
              activeMainTab === 'layout'
                ? 'bg-emerald-600 text-white font-bold shadow-xs'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>1. Sơ Đồ Mặt Bằng & Tọa Độ (8m×10m)</span>
          </button>

          <button
            onClick={() => setActiveMainTab('knots')}
            className={`px-3.5 py-2 rounded-xl font-medium whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
              activeMainTab === 'knots'
                ? 'bg-emerald-600 text-white font-bold shadow-xs'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>2. Cẩm Nang 4 Nút Dây Trại Sinh</span>
          </button>

          <button
            onClick={() => setActiveMainTab('specs')}
            className={`px-3.5 py-2 rounded-xl font-medium whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
              activeMainTab === 'specs'
                ? 'bg-emerald-600 text-white font-bold shadow-xs'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>3. Bóc Tách Kỹ Thuật 4 Hạng Mục</span>
          </button>

          <button
            onClick={() => setActiveMainTab('timeline')}
            className={`px-3.5 py-2 rounded-xl font-medium whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
              activeMainTab === 'timeline'
                ? 'bg-emerald-600 text-white font-bold shadow-xs'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>4. Lộ Trình Thi Công & Lịch 24h</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: 2D FLOOR PLAN & COORDINATES SURVEY MAP            */}
      {/* ======================================================== */}
      {activeMainTab === 'layout' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 7 Columns: Interactive 2D Floor Plan Canvas */}
            <div className="lg:col-span-7 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-sm font-bold text-slate-900">
                    Sơ Đồ Mặt Bằng CAD Nhìn Từ Trên Xuống (Top-Down 8m × 10m)
                  </h3>
                </div>

                {/* Layer Toggles */}
                <div className="flex items-center gap-1 text-[11px]">
                  <button
                    onClick={() => setShowGrid(!showGrid)}
                    className={`px-2 py-1 rounded-md border transition-colors cursor-pointer ${
                      showGrid ? 'bg-emerald-50 border-emerald-300 text-emerald-700 font-semibold' : 'bg-slate-50 border-slate-200 text-slate-500'
                    }`}
                  >
                    Lưới 1m
                  </button>
                  <button
                    onClick={() => setShowRopes(!showRopes)}
                    className={`px-2 py-1 rounded-md border transition-colors cursor-pointer ${
                      showRopes ? 'bg-blue-50 border-blue-300 text-blue-700 font-semibold' : 'bg-slate-50 border-slate-200 text-slate-500'
                    }`}
                  >
                    Cọc 80cm
                  </button>
                  <button
                    onClick={() => setShowPins(!showPins)}
                    className={`px-2 py-1 rounded-md border transition-colors cursor-pointer ${
                      showPins ? 'bg-amber-50 border-amber-300 text-amber-700 font-semibold' : 'bg-slate-50 border-slate-200 text-slate-500'
                    }`}
                  >
                    Mốc Tọa Độ
                  </button>
                  <button
                    onClick={() => setShowFlow(!showFlow)}
                    className={`px-2 py-1 rounded-md border transition-colors cursor-pointer ${
                      showFlow ? 'bg-purple-50 border-purple-300 text-purple-700 font-semibold' : 'bg-slate-50 border-slate-200 text-slate-500'
                    }`}
                  >
                    Luồng Chấm
                  </button>
                </div>
              </div>

              {/* Sân Trại 2D SVG Canvas Container */}
              <div className="relative w-full aspect-[4/5] max-h-[560px] bg-slate-950 rounded-xl overflow-hidden border border-slate-800 p-3 select-none flex flex-col justify-between">
                {/* Compass / Orientation indicator */}
                <div className="absolute top-4 right-4 z-10 bg-slate-900/90 backdrop-blur border border-slate-700 text-slate-200 px-2.5 py-1 rounded-lg text-[10px] flex items-center gap-1.5 shadow-md">
                  <Compass className="w-3.5 h-3.5 text-emerald-400" />
                  <span>BẮC • Hướng cổng chính</span>
                </div>

                {/* Scale measurement line */}
                <div className="absolute bottom-4 left-4 z-10 bg-slate-900/90 backdrop-blur border border-slate-700 text-slate-300 px-2.5 py-1 rounded-lg text-[10px] flex items-center gap-2 shadow-md">
                  <div className="w-16 h-1 bg-emerald-400 rounded-full" />
                  <span className="font-mono">Tỉ lệ: 2 mét</span>
                </div>

                {/* SVG Interactive Ground Layout */}
                <svg 
                  viewBox="0 0 800 1000" 
                  className="w-full h-full"
                  style={{ filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.5))' }}
                >
                  <defs>
                    {/* 1m Grid Pattern */}
                    <pattern id="grid-1m" width="100" height="100" patternUnits="userSpaceOnUse">
                      <path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                    </pattern>
                    <pattern id="grid-05m" width="50" height="50" patternUnits="userSpaceOnUse">
                      <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
                    </pattern>
                    <linearGradient id="ground-gradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0f172a" />
                      <stop offset="100%" stopColor="#022c22" />
                    </linearGradient>
                    <marker id="flowArrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                      <path d="M0,0 L0,6 L8,3 z" fill="#f59e0b" />
                    </marker>
                  </defs>

                  {/* Base Ground 8m x 10m */}
                  <rect x="0" y="0" width="800" height="1000" fill="url(#ground-gradient)" />
                  {showGrid && (
                    <>
                      <rect x="0" y="0" width="800" height="1000" fill="url(#grid-05m)" />
                      <rect x="0" y="0" width="800" height="1000" fill="url(#grid-1m)" />
                    </>
                  )}

                  {/* Boundary Perimeter with coordinate ticks */}
                  <rect x="15" y="15" width="770" height="970" fill="none" stroke="#10b981" strokeWidth="3" strokeDasharray="8 6" opacity="0.6" />
                  <text x="400" y="45" textAnchor="middle" fill="#10b981" fontSize="15" fontWeight="bold" letterSpacing="1">
                    RANH GIỚI KHU ĐẤT: 8m MẶT TIỀN × 10m CHIỀU SÂU (80m²)
                  </text>

                  {/* Axis Meter Numbers (0m to 8m along top, 0m to 10m along left) */}
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((m) => (
                    <text key={`x-${m}`} x={m * 100} y="28" textAnchor="middle" fill="#64748b" fontSize="10" fontFamily="monospace">
                      {m}m
                    </text>
                  ))}
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((m) => (
                    <text key={`y-${m}`} x="10" y={m * 100} textAnchor="start" fill="#64748b" fontSize="10" fontFamily="monospace">
                      {m}m
                    </text>
                  ))}

                  {/* 1. FRONT GATE ZONE (Y: 60 - 180) */}
                  <g 
                    onClick={() => setSelectedZoneId('gate')}
                    className="cursor-pointer transition-all hover:opacity-90"
                  >
                    <rect x="220" y="60" width="360" height="140" fill="#f59e0b" fillOpacity={selectedZoneId === 'gate' ? 0.35 : 0.15} rx="8" stroke="#f59e0b" strokeWidth={selectedZoneId === 'gate' ? 3 : 1.5} />
                    
                    {/* Gate Pillars (4 Pillars for double box) */}
                    <circle cx="280" cy="130" r="14" fill="#fbbf24" stroke="#78350f" strokeWidth="3" />
                    <circle cx="340" cy="130" r="12" fill="#fbbf24" stroke="#78350f" strokeWidth="3" />
                    <circle cx="460" cy="130" r="12" fill="#fbbf24" stroke="#78350f" strokeWidth="3" />
                    <circle cx="520" cy="130" r="14" fill="#fbbf24" stroke="#78350f" strokeWidth="3" />

                    {/* Gate Beam */}
                    <rect x="260" y="115" width="280" height="30" fill="#b45309" rx="4" stroke="#fef3c7" strokeWidth="1" />
                    <text x="400" y="136" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="bold">
                      CỔNG HỘP KÉP (1.8m × 1.2m)
                    </text>

                    {/* Side doors annotations */}
                    <text x="250" y="175" textAnchor="middle" fill="#fbbf24" fontSize="10">Cửa lách (0.8m)</text>
                    <text x="550" y="175" textAnchor="middle" fill="#fbbf24" fontSize="10">Cửa lách (0.8m)</text>
                  </g>

                  {/* 2. TENT GUY ROPES & 8 STAKES (80cm distance) */}
                  {showRopes && (
                    <g 
                      onClick={() => setSelectedZoneId('stakes_ropes')}
                      className="cursor-pointer transition-all hover:opacity-90"
                    >
                      <rect x="140" y="320" width="520" height="480" fill="none" stroke="#38bdf8" strokeWidth={selectedZoneId === 'stakes_ropes' ? 2.5 : 1} strokeDasharray="5 3" opacity="0.7" />
                      
                      {/* 8 Stakes circles */}
                      {[
                        { x: 140, y: 320, label: 'K1 (Góc trước T)' },
                        { x: 400, y: 380, label: 'K3 (Nóc trước)' },
                        { x: 660, y: 320, label: 'K2 (Góc trước P)' },
                        { x: 140, y: 800, label: 'K5 (Góc sau T)' },
                        { x: 400, y: 740, label: 'K4 (Nóc sau)' },
                        { x: 660, y: 800, label: 'K6 (Góc sau P)' },
                        { x: 140, y: 560, label: 'K7 (Sườn Trái)' },
                        { x: 660, y: 560, label: 'K8 (Sườn Phải)' },
                      ].map((stake, idx) => (
                        <g key={idx}>
                          {/* Guy rope line to tent edge */}
                          <line 
                            x1={stake.x} 
                            y1={stake.y} 
                            x2={stake.x < 400 ? 220 : (stake.x === 400 ? 400 : 580)} 
                            y2={stake.y < 500 ? 400 : (stake.y === 560 ? 560 : 720)} 
                            stroke="#38bdf8" 
                            strokeWidth="1.5" 
                            strokeDasharray="4 2" 
                          />
                          <circle cx={stake.x} cy={stake.y} r="8" fill="#ef4444" stroke="#ffffff" strokeWidth="2" />
                          <circle cx={stake.x} cy={stake.y} r="16" fill="#ef4444" fillOpacity="0.2" />
                          <text x={stake.x} y={stake.y + 18} textAnchor="middle" fill="#fca5a5" fontSize="8" fontWeight="bold">
                            {stake.label.split(' ')[0]}
                          </text>
                        </g>
                      ))}

                      {/* 80cm Distance annotation */}
                      <rect x="70" y="470" width="140" height="24" fill="#0f172a" rx="4" stroke="#38bdf8" strokeWidth="1" />
                      <text x="140" y="486" textAnchor="middle" fill="#38bdf8" fontSize="10" fontWeight="bold">
                        Đúng 80cm mép lều
                      </text>
                    </g>
                  )}

                  {/* 3. TENT BODY & CANOPY (3.6m x 3.6m) */}
                  <g 
                    onClick={() => setSelectedZoneId('tent_canopy')}
                    className="cursor-pointer transition-all hover:opacity-90"
                  >
                    <rect x="220" y="400" width="360" height="320" fill="#059669" fillOpacity={selectedZoneId === 'tent_canopy' ? 0.35 : 0.18} rx="6" stroke="#10b981" strokeWidth={selectedZoneId === 'tent_canopy' ? 3 : 2} />
                    
                    {/* Roof ridge line */}
                    <line x1="400" y1="400" x2="400" y2="720" stroke="#34d399" strokeWidth="3" />

                    {/* Main Center Pole M */}
                    <circle cx="400" cy="560" r="10" fill="#f59e0b" stroke="#78350f" strokeWidth="2.5" />
                    <text x="400" y="550" textAnchor="middle" fill="#fef08a" fontSize="10" fontWeight="bold">
                      Cột chính M (1.8m)
                    </text>

                    {/* 4 Corner Upright Poles */}
                    <circle cx="220" cy="400" r="7" fill="#d97706" stroke="#ffffff" strokeWidth="1.5" />
                    <circle cx="580" cy="400" r="7" fill="#d97706" stroke="#ffffff" strokeWidth="1.5" />
                    <circle cx="220" cy="720" r="7" fill="#d97706" stroke="#ffffff" strokeWidth="1.5" />
                    <circle cx="580" cy="720" r="7" fill="#d97706" stroke="#ffffff" strokeWidth="1.5" />
                  </g>

                  {/* 4. ALTAR ZONE (Chính giữa vách hậu) */}
                  <g 
                    onClick={() => setSelectedZoneId('altar_fruits')}
                    className="cursor-pointer transition-all hover:opacity-90"
                  >
                    <rect x="330" y="630" width="140" height="85" fill="#dc2626" fillOpacity={selectedZoneId === 'altar_fruits' ? 0.8 : 0.6} rx="4" stroke="#facc15" strokeWidth="2" />
                    <text x="400" y="655" textAnchor="middle" fill="#fef08a" fontSize="10" fontWeight="bold">
                      BAN THỜ BÁC
                    </text>
                    <text x="400" y="675" textAnchor="middle" fill="#ffffff" fontSize="9">
                      Cờ Tổ quốc & Chó bưởi
                    </text>
                  </g>

                  {/* 5. STUDY CORNER (RIGHT SIDE - MANDATORY) */}
                  <g 
                    onClick={() => setSelectedZoneId('study_corner')}
                    className="cursor-pointer transition-all hover:opacity-90"
                  >
                    <rect x="440" y="430" width="130" height="120" fill="#4338ca" fillOpacity={selectedZoneId === 'study_corner' ? 0.8 : 0.55} rx="6" stroke="#818cf8" strokeWidth={selectedZoneId === 'study_corner' ? 3 : 1.5} />
                    <text x="505" y="470" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">
                      GÓC HỌC TẬP
                    </text>
                    <text x="505" y="490" textAnchor="middle" fill="#c7d2fe" fontSize="9">
                      (BÊN TAY PHẢI)
                    </text>
                    <text x="505" y="515" textAnchor="middle" fill="#fbbf24" fontSize="8">
                      Vở sạch chữ đẹp • Đèn học
                    </text>
                  </g>

                  {/* 6. SLOGAN & PIONEER GEAR (LEFT SIDE - MANDATORY) */}
                  <g 
                    onClick={() => setSelectedZoneId('slogan_gear')}
                    className="cursor-pointer transition-all hover:opacity-90"
                  >
                    <rect x="230" y="430" width="130" height="120" fill="#7c3aed" fillOpacity={selectedZoneId === 'slogan_gear' ? 0.8 : 0.55} rx="6" stroke="#c084fc" strokeWidth={selectedZoneId === 'slogan_gear' ? 3 : 1.5} />
                    <text x="295" y="470" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">
                      KHẨU HIỆU & ĐỘI
                    </text>
                    <text x="295" y="490" textAnchor="middle" fill="#e9d5ff" fontSize="9">
                      (BÊN TAY TRÁI)
                    </text>
                    <text x="295" y="515" textAnchor="middle" fill="#fbbf24" fontSize="8">
                      Trống Đội • Báo tường
                    </text>
                  </g>

                  {/* 7. WASTE & SANITATION (REAR CORNER) */}
                  <g 
                    onClick={() => setSelectedZoneId('waste_sanitation')}
                    className="cursor-pointer transition-all hover:opacity-90"
                  >
                    <circle cx="700" cy="880" r="24" fill="#0d9488" fillOpacity={selectedZoneId === 'waste_sanitation' ? 0.9 : 0.6} stroke="#5eead4" strokeWidth="2" />
                    <text x="700" y="885" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">
                      Thùng rác
                    </text>
                  </g>

                  {/* Flow Arrow from Gate into Tent */}
                  {showFlow && (
                    <path d="M 400 170 L 400 410" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="6 4" markerEnd="url(#flowArrow)" />
                  )}

                  {/* Dynamic Staking Coordinate Pins */}
                  {showPins && SURVEY_POINTS.map((pt) => {
                    const cx = pt.xM * 100;
                    const cy = pt.yM * 100;
                    const isSelected = selectedSurveyPointId === pt.id;
                    return (
                      <g 
                        key={pt.id} 
                        className="cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedSurveyPointId(pt.id);
                        }}
                      >
                        {isSelected && (
                          <circle cx={cx} cy={cy} r="18" fill="none" stroke="#facc15" strokeWidth="2" className="animate-ping" />
                        )}
                        <circle cx={cx} cy={cy} r={isSelected ? 9 : 6} fill={isSelected ? "#facc15" : "#38bdf8"} stroke="#ffffff" strokeWidth="1.5" />
                        <rect x={cx - 14} y={cy - 20} width="28" height="14" rx="2" fill="#0f172a" fillOpacity="0.8" stroke="#38bdf8" strokeWidth="0.5" />
                        <text x={cx} y={cy - 10} textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold">
                          {pt.code}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span className="flex items-center gap-1.5 font-medium text-slate-700">
                  <Info className="w-4 h-4 text-emerald-600" />
                  <span>Bấm vào từng khu vực hoặc mốc tọa độ trên bản vẽ để tra cứu kỹ thuật</span>
                </span>
                <span className="text-[11px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded">
                  Chuẩn Thể Lệ Hải Anh
                </span>
              </div>
            </div>

            {/* Right 5 Columns: Zone Technical Specs Card & Surveyor Inspector */}
            <div className="lg:col-span-5 space-y-4">
              {/* Selected Point or Zone Inspector */}
              {selectedPoint ? (
                <div className="bg-white rounded-2xl p-5 border border-amber-300 shadow-sm space-y-3 bg-gradient-to-b from-amber-50/40 to-white">
                  <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                      <Pin className="w-3.5 h-3.5 text-amber-600" />
                      <span>Mốc Tọa Độ Thực Địa #{selectedPoint.code}</span>
                    </span>
                    <button 
                      onClick={() => setSelectedSurveyPointId(null)}
                      className="text-slate-400 hover:text-slate-600 text-xs px-1 cursor-pointer"
                    >
                      ✕ Đóng
                    </button>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{selectedPoint.name}</h4>
                    <p className="text-xs font-mono font-bold text-emerald-700 mt-0.5">
                      Tọa độ: X = {selectedPoint.xM.toFixed(1)}m • Y = {selectedPoint.yM.toFixed(1)}m
                    </p>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 bg-white rounded-lg border border-slate-200 space-y-1">
                      <span className="font-semibold text-slate-700 block text-[11px]">Mô tả cắm mốc:</span>
                      <p className="text-slate-600">{selectedPoint.description}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                        <span className="text-slate-500 block">Cao độ / Loại cọc:</span>
                        <span className="font-bold text-slate-800">{selectedPoint.elevation}</span>
                      </div>
                      <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                        <span className="text-slate-500 block">Dụng cụ đo:</span>
                        <span className="font-bold text-slate-800">{selectedPoint.tool}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Thông Số Kỹ Thuật Phân Khu
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      {selectedZone.scoreImpact}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      {selectedZone.name}
                    </h3>
                    <p className="text-xs font-medium text-slate-500 mt-0.5">
                      Vị trí: {selectedZone.area}
                    </p>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                      <span className="font-bold text-slate-900 block text-xs">Quy cách & Kích thước:</span>
                      <p className="text-slate-700 leading-relaxed">{selectedZone.specs}</p>
                    </div>

                    <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200 space-y-1">
                      <span className="font-bold text-amber-900 block text-xs flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                        <span>Bí quyết thi công ăn trọn điểm:</span>
                      </span>
                      <p className="text-amber-800 leading-relaxed">{selectedZone.practicalTips}</p>
                    </div>

                    <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200 space-y-1">
                      <span className="font-bold text-emerald-900 block text-xs flex items-center gap-1.5">
                        <Ruler className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Chỉ dẫn đo đạc thước dây trên sân:</span>
                      </span>
                      <p className="text-emerald-800 leading-relaxed">{selectedZone.surveyGuide}</p>
                    </div>
                  </div>

                  {/* Quick switcher buttons for zones */}
                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-[11px] text-slate-500 block mb-2 font-medium">Chọn nhanh hạng mục:</span>
                    <div className="grid grid-cols-2 gap-1.5 text-xs">
                      {SITE_ZONES.map((zone) => (
                        <button
                          key={zone.id}
                          onClick={() => {
                            setSelectedZoneId(zone.id);
                            setSelectedSurveyPointId(null);
                          }}
                          className={`px-2.5 py-1.5 text-left rounded-lg transition-colors truncate cursor-pointer ${
                            selectedZoneId === zone.id 
                              ? 'bg-emerald-600 text-white font-semibold shadow-xs' 
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          {zone.name.split('.')[1] || zone.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Staking Coordinates Table */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Ruler className="w-4 h-4 text-emerald-600" />
                    <span>Bảng Tọa Độ Cắm Mốc Thực Địa (X, Y)</span>
                  </h4>
                  <span className="text-[10px] text-slate-500 font-mono">16 Mốc chính</span>
                </div>

                <div className="max-h-48 overflow-y-auto divide-y divide-slate-100 text-xs">
                  {SURVEY_POINTS.map((pt) => (
                    <div 
                      key={pt.id} 
                      onClick={() => setSelectedSurveyPointId(pt.id)}
                      className={`py-1.5 px-2 flex items-center justify-between rounded cursor-pointer transition-colors ${
                        selectedSurveyPointId === pt.id ? 'bg-amber-100 text-amber-900 font-bold' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="w-6 text-center font-mono font-bold text-emerald-700">{pt.code}</span>
                        <span className="truncate max-w-[130px]">{pt.name}</span>
                      </div>
                      <span className="font-mono text-[11px] text-slate-500">
                        ({pt.xM}m, {pt.yM}m)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: KNOT MASTERCLASS                                 */}
      {/* ======================================================== */}
      {activeMainTab === 'knots' && (
        <CampKnotMasterclass />
      )}

      {/* ======================================================== */}
      {/* TAB 3: 4 DEEP DIVE SECTIONS                              */}
      {/* ======================================================== */}
      {activeMainTab === 'specs' && (
        <CampSpecsDeepDive />
      )}

      {/* ======================================================== */}
      {/* TAB 4: 5-STEP TIMELINE & 24H EXECUTION SCHEDULE         */}
      {/* ======================================================== */}
      {activeMainTab === 'timeline' && (
        <div className="space-y-6">
          {/* 5-Step Practical Execution Timeline (Lộ Trình 5 Bước Thi Công Thực Tế) */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-emerald-600" />
                  <span>Lộ Trình 5 Bước Chuẩn Bị & Thi Công Hội Trại Thu 2026</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Quy trình từng ngày từ khâu chuẩn bị vật tư, dựng cổng, tập văn nghệ đến giờ chấm điểm của Ban Giám Khảo
                </p>
              </div>

              {/* Steps Navigation Tabs */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl overflow-x-auto">
                {[
                  { step: 1, label: 'D-7: Vật tư' },
                  { step: 2, label: 'D-3: Cổng trại' },
                  { step: 3, label: 'D-2: Văn nghệ' },
                  { step: 4, label: 'Sáng D-Day: Dựng lều' },
                  { step: 5, label: 'Chiều D-Day: Chấm thi' },
                ].map((s) => (
                  <button
                    key={s.step}
                    onClick={() => setActiveStepTab(s.step)}
                    className={`px-3 py-1.5 text-xs rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                      activeStepTab === s.step
                        ? 'bg-white text-emerald-700 shadow-xs font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Step Content Display */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              {activeStepTab === 1 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-900">
                      Bước 1 (Trước 7 ngày): Chuẩn Bị Tre Nứa, Cọc Lều & Mua Sắm Vật Tư
                    </h4>
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                      7 nhóm vật tư
                    </span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">
                    • <strong>Chọn tre:</strong> Chọn 4 cây tre đực già, thẳng, không bị cụt ngọn, đường kính phi 8-10cm để làm 4 trụ hộp kép. Chặt thêm 12 thanh tre nhỏ phi 3-4cm làm xà ngang và giàn mắt cáo.<br />
                    • <strong>Gọt cọc néo đất:</strong> Chuẩn bị 8 cọc tre già hoặc cọc sắt phi 14 dài 50cm, một đầu vạt nhọn, một đầu có khía rãnh để chống tuột dây.<br />
                    • <strong>Dây thừng:</strong> Mua 30m dây dù phi 4mm chịu lực, 5 cuộn dây thép ly mềm để buộc khung tre.<br />
                    • <strong>Phân công:</strong> Ban chấp hành Chi đoàn kiểm tra danh mục vật tư trong tab "Kho Vật Tư" để đánh dấu người phụ trách.
                  </p>
                </div>
              )}

              {activeStepTab === 2 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-900">
                      Bước 2 (Trước 3 ngày): Gia Công Cổng Hộp Kép & Cắt Chữ Nổi Bọt Biển
                    </h4>
                    <span className="text-[11px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                      Cổng hộp kép 7 điểm
                    </span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">
                    • <strong>Đóng khung cổng:</strong> Gia công sẵn khung cổng hộp kép kích thước chuẩn: Cao 1.8m, rộng 1.2m. Hai cửa lách rộng 0.8m mỗi bên.<br />
                    • <strong>Chữ nổi thủ công:</strong> Cắt chữ mút xốp hoặc bọt biển dòng chữ <strong>"LỒNG ĐÈN THẮP SÁNG ƯỚC MƠ"</strong>, quét keo phủ bột kim tuyến vàng lấp lánh (trang trí thủ công được cộng tối đa 5đ so với in bạt).<br />
                    • <strong>Biểu trưng:</strong> Vẽ đắp nổi mô hình Khuê Văn Các hoặc Đóa Hoa Sen gắn ở đỉnh cổng trại.<br />
                    • <strong>Lồng đèn:</strong> Làm 10-15 lồng đèn ông sao mini dán giấy bóng kính ngũ sắc treo dọc 2 bên trụ cổng.
                  </p>
                </div>
              )}

              {activeStepTab === 3 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-900">
                      Bước 3 (Trước 2 ngày): Tổng Duyệt Văn Nghệ & Khớp Nhạc Sân Khấu
                    </h4>
                    <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded">
                      Văn nghệ 20 điểm
                    </span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">
                    • <strong>Khớp đội hình:</strong> 14 em diễn viên (6 nam, 8 nữ) tập luyện 3 đội hình: Vòng cung trăng rằm, Chữ V chiến thắng, Kim tự tháp kết màn tại sân nhà văn hóa thôn.<br />
                    • <strong>Bấm giờ chuẩn:</strong> Khống chế thời lượng từ <strong>7 đến 10 phút</strong> (hiện kịch bản đạt 9.5 phút rất chuẩn, không bị trừ điểm vi phạm thời gian).<br />
                    • <strong>Kiểm tra đạo cụ:</strong> Đảm bảo 14 đèn ông sao có pin sáng led tốt, 8 hoa sen lụa không bị gãy cánh, trang phục áo bà ba và khăn quàng đỏ phẳng phiu, sạch đẹp.<br />
                    • <strong>USB nhạc beat:</strong> Chuẩn bị 2 bản USB chứa file nhạc 320kbps nộp cho Ban tổ chức âm thanh xã Hải Anh.
                  </p>
                </div>
              )}

              {activeStepTab === 4 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-900">
                      Bước 4 (Sáng ngày Hội): Xuất Quân Dựng Khung, Cắm Cọc Néo Dây 80cm
                    </h4>
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                      Khung trại 65 điểm
                    </span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">
                    • <strong>Nhận vị trí lô đất:</strong> Xác định ranh giới 8m x 10m trên sân vận động Hải Anh, căng dây lấy vuông góc 90°.<br />
                    • <strong>Dựng cổng:</strong> Đào hố chôn 4 chân trụ cổng sâu 40-50cm, chèn gạch đá chắc chắn, néo dây giữ thăng bằng.<br />
                    • <strong>Dựng thân lều:</strong> Dựng cột chính giữa cao 1.8m, cột con 4 góc 1.0m. Dùng thước dây đo đúng <strong>80cm</strong> từ mép lều ra vị trí đóng cọc đất.<br />
                    • <strong>Đóng cọc néo:</strong> Cắm 8 cọc xiên 45° ngược chiều kéo dây, dùng <strong>nút thuyền chài</strong> siết chặt, căn chỉnh các đường biên bạt song song không bị nhăn võng.
                  </p>
                </div>
              )}

              {activeStepTab === 5 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-900">
                      Bước 5 (Chiều ngày Hội): Bày Ban Thờ, Tỉa Chó Bưởi & Đón Ban Giám Khảo
                    </h4>
                    <span className="text-[11px] font-semibold text-rose-700 bg-rose-100 px-2 py-0.5 rounded">
                      Chấm thi 110 điểm
                    </span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">
                    • <strong>Ban thờ Bác:</strong> Trải khăn nhung đỏ, treo ảnh Bác Hồ chính giữa, cắm lọ hoa tươi và dâng mâm ngũ quả truyền thống có <strong>chú chó bưởi lông xù</strong> hạt đỗ đen.<br />
                    • <strong>Bố trí 2 bên:</strong> Đặt <strong>Góc học tập bên tay phải</strong> (đèn bàn, sách vở học sinh giỏi); Đặt <strong>Khẩu hiệu bên tay trái</strong> đúng chữ: <em>"Thiếu nhi Ninh Bình vững bước tiến vào kỷ nguyên mới"</em>.<br />
                    • <strong>Vệ sinh môi trường:</strong> Đặt thùng rác có nắp góc sau trại, quét sạch dăm tre nứa trên sân, tưới nhẹ nước chống bụi.<br />
                    • <strong>Đón giám khảo:</strong> Cử đội trưởng và 2 đội viên chào nghi thức Đội trang nghiêm khi Ban Giám Khảo Xã Hải Anh bước vào thẩm định.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Hour-by-Hour 24h Execution Schedule Table */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-emerald-600" />
                  <span>Kế Hoạch Tác Chiến Chi Tiết Từng Giờ (D-Day Ngày Hội)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Phân bổ nhân lực và các mốc thời gian then chốt từ 05:30 sáng đến 22:00 đêm
                </p>
              </div>
              <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-lg">
                100% Đúng Tiến Độ
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse font-sans">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold">
                    <th className="py-2.5 px-3">Thời gian</th>
                    <th className="py-2.5 px-3">Nội dung công việc</th>
                    <th className="py-2.5 px-3">Người phụ trách</th>
                    <th className="py-2.5 px-3">Tiêu chuẩn nghiệm thu</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr>
                    <td className="py-2.5 px-3 font-mono font-bold text-emerald-700">05:30 - 06:30</td>
                    <td className="py-2.5 px-3">Tập kết vật liệu tre nứa, bạt dù, cọc néo ra sân vận động Xã Hải Anh</td>
                    <td className="py-2.5 px-3">Tổ hậu cần (4 ĐVTN nam)</td>
                    <td className="py-2.5 px-3 text-slate-600">Đủ 4 trụ tre 8-10cm, 8 cọc đất, bạt 4x6m không rách</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-mono font-bold text-emerald-700">06:30 - 08:00</td>
                    <td className="py-2.5 px-3">Cắm mốc 8m x 10m, đào hố 50cm dựng cổng hộp kép và 2 cửa lách</td>
                    <td className="py-2.5 px-3">Tổ kỹ thuật cổng (6 ĐVTN)</td>
                    <td className="py-2.5 px-3 text-slate-600">Lọt lòng cổng 1.8m x 1.2m, cửa lách 0.8m, đứng vững chắc</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-mono font-bold text-emerald-700">08:00 - 09:30</td>
                    <td className="py-2.5 px-3">Dựng cột chính lều 1.8m, cột con 1.0m, đóng 8 cọc đất đo chuẩn 80cm</td>
                    <td className="py-2.5 px-3">Tổ dựng lều (5 ĐVTN)</td>
                    <td className="py-2.5 px-3 text-slate-600">100% nút thuyền chài, cọc nghiêng 45°, bạt căng phẳng lì</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-mono font-bold text-emerald-700">09:30 - 11:30</td>
                    <td className="py-2.5 px-3">Tỉa chú chó bưởi lông xù, khắc dưa hấu, bày ban thờ Bác & bố trí 2 góc lều</td>
                    <td className="py-2.5 px-3">Tổ khéo tay (4 nữ đoàn viên)</td>
                    <td className="py-2.5 px-3 text-slate-600">Góc học tập BÊN PHẢI, Khẩu hiệu BÊN TRÁI, chó bưởi mắt đỗ đen</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-mono font-bold text-emerald-700">11:30 - 13:30</td>
                    <td className="py-2.5 px-3">Nghỉ trưa, phân công trực trại, kiểm tra dây néo chống nắng giằng gió</td>
                    <td className="py-2.5 px-3">Tổ trực ban (2 ĐVTN)</td>
                    <td className="py-2.5 px-3 text-slate-600">Lều trại an toàn, vệ sinh sạch sẽ, tưới nước chống bụi</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-mono font-bold text-emerald-700">13:30 - 15:30</td>
                    <td className="py-2.5 px-3">Đón Ban Giám Khảo Xã Hải Anh chấm thi chấm điểm trại chính thức</td>
                    <td className="py-2.5 px-3">Bí thư Chi đoàn + Đội viên</td>
                    <td className="py-2.5 px-3 text-slate-600">Nghi thức chào Đội chuẩn, thuyết trình lưu loát 5 phút</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-mono font-bold text-emerald-700">19:00 - 21:30</td>
                    <td className="py-2.5 px-3">Đêm hội diễn văn nghệ 14 em (Lồng đèn thắp sáng ước mơ) & Đốt lửa trại</td>
                    <td className="py-2.5 px-3">Đội múa 14 em + Phụ trách</td>
                    <td className="py-2.5 px-3 text-slate-600">Thời lượng 9.5 phút, đèn lồng sáng rực, đạt 20/20 điểm</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-mono font-bold text-emerald-700">21:30 - 22:30</td>
                    <td className="py-2.5 px-3">Công bố kết quả trao giải Nhất toàn đoàn, vệ sinh sạch bãi cỏ hoàn trả sân</td>
                    <td className="py-2.5 px-3">Toàn thể chi đoàn</td>
                    <td className="py-2.5 px-3 text-slate-600">Thu gom toàn bộ rác, nhổ cọc an toàn, nhận cờ giải thưởng</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
