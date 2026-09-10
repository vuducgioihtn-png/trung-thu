import React from 'react';
import { CampVisualConfig } from '../types/camp';

// =========================================================================
// 1. GATE EXPLODED BLUEPRINT SVG (BÓC TÁCH CẤU TẠO KHUNG CỔNG HỘP KÉP)
// =========================================================================
export const GateExplodedSvg: React.FC<{
  config: CampVisualConfig;
  isNight: boolean;
  showDimensions: boolean;
  onSelectHotspot: (desc: string) => void;
}> = ({ config, isNight, showDimensions, onSelectHotspot }) => {
  const isHopKep = config.gateType === 'hop_kep';
  const isHopDon = config.gateType === 'hop_don';
  const isCongDon = config.gateType === 'cong_don';
  const isPrint = config.decorationType === 'print';

  return (
    <svg viewBox="0 0 1000 580" className="w-full h-full drop-shadow-lg font-mono select-none">
      <defs>
        <pattern id="explodedGrid" width="25" height="25" patternUnits="userSpaceOnUse">
          <path d="M 25 0 L 0 0 0 25" fill="none" stroke="#0369a1" strokeWidth="0.5" opacity="0.35" />
        </pattern>
        <linearGradient id="bambooGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#78350f" />
          <stop offset="40%" stopColor="#b45309" />
          <stop offset="70%" stopColor="#d97706" />
          <stop offset="100%" stopColor="#78350f" />
        </linearGradient>
      </defs>

      {/* Blueprint Canvas */}
      <rect x="0" y="0" width="1000" height="580" fill={isNight ? "#091b2c" : "#0c2d48"} />
      <rect x="0" y="0" width="1000" height="580" fill="url(#explodedGrid)" />

      {/* Title Tag */}
      <rect x="30" y="18" width="940" height="42" fill="#075985" rx="6" stroke="#38bdf8" strokeWidth="1.5" />
      <text x="50" y="44" fill="#f0f9ff" fontSize="14" fontWeight="bold">
        {isHopKep && "BẢN VẼ BÓC TÁCH: CỔNG HỘP KÉP 4 TRỤ TRE & 2 CỬA LÁCH (7/7đ)"}
        {isHopDon && "BẢN VẼ BÓC TÁCH: CỔNG HỘP ĐƠN 2 TRỤ CHÍNH - 1 CỬA (5/7đ)"}
        {isCongDon && "BẢN VẼ BÓC TÁCH: CỔNG ĐƠN GIẢN TRE MỘC (3/7đ)"}
      </text>
      <text x="950" y="44" fill="#7dd3fc" fontSize="11" textAnchor="end">
        {isPrint ? "TRANG TRÍ: BẠT IN PHUN HIFLEX (3đ)" : "TRANG TRÍ: THỦ CÔNG CHỮ NỔI 3D (5đ)"}
      </text>

      {/* ---------------- COMPONENT 1: MAIN BAMBOO PILLARS ---------------- */}
      <g 
        className="cursor-pointer"
        onClick={() => onSelectHotspot(
          isHopKep 
            ? "4 Trụ tre già đực: Chiều dài 2.4m (chôn sâu 0.6m, nổi 1.8m), đường kính phi 8-10cm thẳng tắp." 
            : isHopDon 
            ? "2 Trụ chính cổng hộp đơn: Chiều cao 1.8m, đường kính phi 8-10cm, không có 2 trụ phụ sau." 
            : "Cổng đơn giản: 2 cọc tre đơn mộc, liên kết đơn sơ."
        )}
      >
        {/* Rear Left Pillar (Only in hop_kep) */}
        {isHopKep && (
          <>
            <rect x="230" y="150" width="32" height="340" fill="url(#bambooGrad)" stroke="#451a03" strokeWidth="1.5" rx="3" opacity="0.75" />
            <line x1="230" y1="210" x2="262" y2="210" stroke="#451a03" strokeWidth="2" />
            <line x1="230" y1="280" x2="262" y2="280" stroke="#451a03" strokeWidth="2" />
            <line x1="230" y1="360" x2="262" y2="360" stroke="#451a03" strokeWidth="2" />
            <line x1="230" y1="440" x2="262" y2="440" stroke="#451a03" strokeWidth="2" />
            <text x="246" y="142" fill="#93c5fd" fontSize="10" textAnchor="middle">Trụ sau T1</text>

            {/* Rear Right Pillar */}
            <rect x="650" y="150" width="32" height="340" fill="url(#bambooGrad)" stroke="#451a03" strokeWidth="1.5" rx="3" opacity="0.75" />
            <line x1="650" y1="210" x2="682" y2="210" stroke="#451a03" strokeWidth="2" />
            <line x1="650" y1="280" x2="682" y2="280" stroke="#451a03" strokeWidth="2" />
            <line x1="650" y1="360" x2="682" y2="360" stroke="#451a03" strokeWidth="2" />
            <line x1="650" y1="440" x2="682" y2="440" stroke="#451a03" strokeWidth="2" />
            <text x="666" y="142" fill="#93c5fd" fontSize="10" textAnchor="middle">Trụ sau T2</text>
          </>
        )}

        {/* Front Left Pillar */}
        <rect x="290" y="170" width="38" height="340" fill="url(#bambooGrad)" stroke="#451a03" strokeWidth="2" rx="4" />
        <line x1="290" y1="230" x2="328" y2="230" stroke="#451a03" strokeWidth="2.5" />
        <line x1="290" y1="300" x2="328" y2="300" stroke="#451a03" strokeWidth="2.5" />
        <line x1="290" y1="380" x2="328" y2="380" stroke="#451a03" strokeWidth="2.5" />
        <line x1="290" y1="450" x2="328" y2="450" stroke="#451a03" strokeWidth="2.5" />
        <text x="309" y="162" fill="#facc15" fontSize="10" fontWeight="bold" textAnchor="middle">
          {isHopKep ? "Trụ chính T3" : "Trụ chính T1"}
        </text>

        {/* Front Right Pillar */}
        <rect x="590" y="170" width="38" height="340" fill="url(#bambooGrad)" stroke="#451a03" strokeWidth="2" rx="4" />
        <line x1="590" y1="230" x2="628" y2="230" stroke="#451a03" strokeWidth="2.5" />
        <line x1="590" y1="300" x2="628" y2="300" stroke="#451a03" strokeWidth="2.5" />
        <line x1="590" y1="380" x2="628" y2="380" stroke="#451a03" strokeWidth="2.5" />
        <line x1="590" y1="450" x2="628" y2="450" stroke="#451a03" strokeWidth="2.5" />
        <text x="609" y="162" fill="#facc15" fontSize="10" fontWeight="bold" textAnchor="middle">
          {isHopKep ? "Trụ chính T4" : "Trụ chính T2"}
        </text>
      </g>

      {/* ---------------- COMPONENT 2: BOX CONNECTING TIES (GIẰNG TẠO HỘP VUÔNG) (Only in hop_kep) ---------------- */}
      {isHopKep ? (
        <g 
          className="cursor-pointer"
          onClick={() => onSelectHotspot("Giằng liên kết tạo hộp 3D: Cự ly giữa trụ trước và sau là 0.5m. Giằng ngang và chốt chữ X giữ cổng đứng vững trong gió bão.")}
        >
          {/* Left Depth Ties */}
          <line x1="246" y1="190" x2="309" y2="210" stroke="#f59e0b" strokeWidth="8" strokeLinecap="round" />
          <line x1="246" y1="320" x2="309" y2="340" stroke="#f59e0b" strokeWidth="8" strokeLinecap="round" />
          <line x1="246" y1="460" x2="309" y2="480" stroke="#f59e0b" strokeWidth="8" strokeLinecap="round" />
          {/* Cross X-bracing */}
          <line x1="246" y1="210" x2="309" y2="320" stroke="#f43f5e" strokeWidth="3" strokeDasharray="4 2" />
          <line x1="246" y1="320" x2="309" y2="210" stroke="#f43f5e" strokeWidth="3" strokeDasharray="4 2" />

          {/* Right Depth Ties */}
          <line x1="666" y1="190" x2="609" y2="210" stroke="#f59e0b" strokeWidth="8" strokeLinecap="round" />
          <line x1="666" y1="320" x2="609" y2="340" stroke="#f59e0b" strokeWidth="8" strokeLinecap="round" />
          <line x1="666" y1="460" x2="609" y2="480" stroke="#f59e0b" strokeWidth="8" strokeLinecap="round" />
          {/* Cross X-bracing */}
          <line x1="666" y1="210" x2="609" y2="320" stroke="#f43f5e" strokeWidth="3" strokeDasharray="4 2" />
          <line x1="666" y1="320" x2="609" y2="210" stroke="#f43f5e" strokeWidth="3" strokeDasharray="4 2" />
        </g>
      ) : (
        <g transform="translate(40, 200)">
          <rect x="0" y="0" width="180" height="50" fill="#18181b" rx="6" stroke="#f59e0b" strokeWidth="1" />
          <text x="90" y="22" fill="#fbbf24" fontSize="10" fontWeight="bold" textAnchor="middle">
            {isHopDon ? "CỔNG HỘP ĐƠN" : "CỔNG ĐƠN GIẢN"}
          </text>
          <text x="90" y="38" fill="#e2e8f0" fontSize="9" textAnchor="middle">
            Không có giằng hộp 4 trụ
          </text>
        </g>
      )}

      {/* ---------------- COMPONENT 3: 2 SIDE DOORS (Only in hop_kep) ---------------- */}
      {isHopKep ? (
        <g 
          className="cursor-pointer"
          onClick={() => onSelectHotspot("2 Cửa lách 2 bên: Rộng 0.8m, cao 1.6m, đan nan mắt cáo quả trám, tăng tính đối xứng và trang nhã theo Thể lệ Hải Anh.")}
        >
          {/* Left Side Door */}
          <rect x="140" y="240" width="90" height="250" fill="#0369a1" fillOpacity="0.2" stroke="#38bdf8" strokeWidth="2.5" rx="4" />
          <line x1="140" y1="280" x2="230" y2="280" stroke="#38bdf8" strokeWidth="1.5" />
          <line x1="140" y1="350" x2="230" y2="350" stroke="#38bdf8" strokeWidth="1.5" />
          <line x1="140" y1="420" x2="230" y2="420" stroke="#38bdf8" strokeWidth="1.5" />
          {/* Trellis diagonals */}
          <path d="M 140,300 L 230,390 M 140,350 L 230,440 M 140,400 L 230,490" stroke="#0ea5e9" strokeWidth="1.5" />
          <path d="M 230,300 L 140,390 M 230,350 L 140,440 M 230,400 L 140,490" stroke="#0ea5e9" strokeWidth="1.5" />
          <rect x="150" y="250" width="70" height="22" fill="#dc2626" rx="3" />
          <text x="185" y="265" fill="#fef08a" fontSize="9" fontWeight="bold" textAnchor="middle">CỬA LÁCH (0.8m)</text>

          {/* Right Side Door */}
          <rect x="682" y="240" width="90" height="250" fill="#0369a1" fillOpacity="0.2" stroke="#38bdf8" strokeWidth="2.5" rx="4" />
          <line x1="682" y1="280" x2="772" y2="280" stroke="#38bdf8" strokeWidth="1.5" />
          <line x1="682" y1="350" x2="772" y2="350" stroke="#38bdf8" strokeWidth="1.5" />
          <line x1="682" y1="420" x2="772" y2="420" stroke="#38bdf8" strokeWidth="1.5" />
          {/* Trellis diagonals */}
          <path d="M 682,300 L 772,390 M 682,350 L 772,440 M 682,400 L 772,490" stroke="#0ea5e9" strokeWidth="1.5" />
          <path d="M 772,300 L 682,390 M 772,350 L 682,440 M 772,400 L 682,490" stroke="#0ea5e9" strokeWidth="1.5" />
          <rect x="692" y="250" width="70" height="22" fill="#dc2626" rx="3" />
          <text x="727" y="265" fill="#fef08a" fontSize="9" fontWeight="bold" textAnchor="middle">CỬA LÁCH (0.8m)</text>
        </g>
      ) : (
        /* Dashed indicator showing missing side doors */
        <g>
          <rect x="140" y="260" width="90" height="220" fill="none" stroke="#f43f5e" strokeWidth="2" strokeDasharray="6 3" rx="4" opacity="0.4" />
          <text x="185" y="380" fill="#f87171" fontSize="10" textAnchor="middle">Không có cửa lách</text>
          <rect x="682" y="260" width="90" height="220" fill="none" stroke="#f43f5e" strokeWidth="2" strokeDasharray="6 3" rx="4" opacity="0.4" />
          <text x="727" y="380" fill="#f87171" fontSize="10" textAnchor="middle">Không có cửa lách</text>
        </g>
      )}

      {/* ---------------- COMPONENT 4: MAIN ENTRANCE (CỬA CHÍNH 1.8M X 1.2M) ---------------- */}
      <g 
        className="cursor-pointer"
        onClick={() => onSelectHotspot("Lọt lòng cửa chính: Cao đúng 1.8m, rộng đúng 1.2m theo thước Lỗ Ban và quy chuẩn Điều lệ Xã Hải Anh (đạt tối đa điểm).")}
      >
        {/* Main Header Crossbeam */}
        <rect x="270" y="160" width="370" height="28" fill="#b45309" stroke="#78350f" strokeWidth="2" rx="4" />
        <circle cx="309" cy="174" r="6" fill="#facc15" />
        <circle cx="609" cy="174" r="6" fill="#facc15" />

        {/* Clear Entrance Zone */}
        <rect x="328" y="188" width="262" height="310" fill="#38bdf8" fillOpacity="0.08" stroke="#ef4444" strokeWidth="2" strokeDasharray="6 4" />
        <text x="459" y="340" fill="#fca5a5" fontSize="13" fontWeight="bold" textAnchor="middle">
          LỌT LÒNG CỬA CHÍNH
        </text>
        <text x="459" y="360" fill="#fecaca" fontSize="11" textAnchor="middle">
          1.80m × 1.20m
        </text>
      </g>

      {/* ---------------- COMPONENT 5: SIGNBOARD & DECORATION ---------------- */}
      <g 
        className="cursor-pointer"
        onClick={() => onSelectHotspot(
          isPrint 
            ? "Bạt in phun Hiflex kỹ thuật số: Đạt 3/5 điểm (bị trừ 2 điểm do không đắp chữ thủ công)." 
            : "Biển hiệu chữ nổi thủ công xốp 3D đắp hạt kim tuyến viền đèn LED đạt 5/5 điểm tối đa."
        )}
      >
        {!isCongDon && (
          <>
            {/* Pagoda Eaves (Only for craft or pagoda style) */}
            <path d="M 230 155 Q 459 120 688 155 L 670 125 Q 459 100 248 125 Z" fill="#991b1b" stroke="#facc15" strokeWidth="2" />
            <path d="M 220 158 C 240 155 255 140 260 115" stroke="#f59e0b" strokeWidth="4" fill="none" />
            <path d="M 698 158 C 678 155 663 140 658 115" stroke="#f59e0b" strokeWidth="4" fill="none" />
          </>
        )}

        {/* Main Slogan Board */}
        {isPrint ? (
          /* Vinyl Hiflex Banner style: flat with grommet rings */
          <g>
            <rect x="280" y="80" width="358" height="50" fill="#b91c1c" stroke="#94a3b8" strokeWidth="2" rx="2" />
            {/* Grommet eyelets at corners */}
            <circle cx="288" cy="88" r="4" fill="#cbd5e1" stroke="#475569" strokeWidth="1.5" />
            <circle cx="630" cy="88" r="4" fill="#cbd5e1" stroke="#475569" strokeWidth="1.5" />
            <circle cx="288" cy="122" r="4" fill="#cbd5e1" stroke="#475569" strokeWidth="1.5" />
            <circle cx="630" cy="122" r="4" fill="#cbd5e1" stroke="#475569" strokeWidth="1.5" />
            {/* Plastic cable ties */}
            <line x1="288" y1="88" x2="278" y2="78" stroke="#f8fafc" strokeWidth="2" />
            <line x1="630" y1="88" x2="640" y2="78" stroke="#f8fafc" strokeWidth="2" />
            <text x="459" y="112" fill="#fef08a" fontSize="13" fontWeight="bold" textAnchor="middle">
              LỒNG ĐÈN THẮP SÁNG ƯỚC MƠ
            </text>
            <text x="459" y="124" fill="#cbd5e1" fontSize="8" textAnchor="middle">
              [BẠT IN PHUN HIFLEX - 3/5Đ]
            </text>
          </g>
        ) : (
          /* Handcrafted 3D Embossed board */
          <g>
            <rect x="280" y="80" width="358" height="50" fill="#b91c1c" stroke="#facc15" strokeWidth="3" rx="6" />
            {/* Glowing LED dots around border */}
            <circle cx="290" cy="88" r="2.5" fill="#fde047" />
            <circle cx="340" cy="88" r="2.5" fill="#fde047" />
            <circle cx="400" cy="88" r="2.5" fill="#fde047" />
            <circle cx="459" cy="88" r="2.5" fill="#fde047" />
            <circle cx="520" cy="88" r="2.5" fill="#fde047" />
            <circle cx="580" cy="88" r="2.5" fill="#fde047" />
            <circle cx="628" cy="88" r="2.5" fill="#fde047" />
            <text x="459" y="112" fill="#fef08a" fontSize="14" fontWeight="900" textAnchor="middle" letterSpacing="1">
              LỒNG ĐÈN THẮP SÁNG ƯỚC MƠ
            </text>
            <text x="459" y="125" fill="#fde68a" fontSize="8" fontWeight="bold" textAnchor="middle">
              [CHỮ NỔI THỦ CÔNG 3D VIỀN LED - 5/5Đ]
            </text>
          </g>
        )}

        {/* Historical Emblem: Khue Van Cac */}
        {!isCongDon && (
          <g transform="translate(435, 18)">
            <rect x="0" y="38" width="48" height="14" fill="#dc2626" rx="2" stroke="#facc15" strokeWidth="1.5" />
            <line x1="8" y1="38" x2="8" y2="20" stroke="#facc15" strokeWidth="3" />
            <line x1="40" y1="38" x2="40" y2="20" stroke="#facc15" strokeWidth="3" />
            <circle cx="24" cy="24" r="10" fill="#b91c1c" stroke="#facc15" strokeWidth="2" />
            <polygon points="24,2 4,18 44,18" fill="#991b1b" stroke="#facc15" strokeWidth="1.5" />
          </g>
        )}
      </g>

      {/* ---------------- GROUND LEVEL & ANCHOR PEGS ---------------- */}
      <line x1="100" y1="500" x2="900" y2="500" stroke="#22c55e" strokeWidth="3" strokeDasharray="6 3" />
      <text x="890" y="492" fill="#4ade80" fontSize="11" textAnchor="end">MẶT ĐẤT TỰ NHIÊN</text>

      {/* Foundation Depth Section */}
      <rect x="290" y="500" width="38" height="55" fill="#451a03" stroke="#78350f" strokeWidth="1.5" strokeDasharray="3 2" />
      <rect x="590" y="500" width="38" height="55" fill="#451a03" stroke="#78350f" strokeWidth="1.5" strokeDasharray="3 2" />
      <text x="459" y="535" fill="#fed7aa" fontSize="10" textAnchor="middle">
        Chôn chân cột sâu 50 - 60cm + Chèn gạch đá chống lún
      </text>

      {/* ---------------- DIMENSION ANNOTATIONS ---------------- */}
      {showDimensions && (
        <g className="pointer-events-none text-xs font-mono">
          {/* Main Height: 1.8m */}
          <line x1="340" y1="188" x2="340" y2="498" stroke="#ef4444" strokeWidth="2" />
          <polygon points="340,188 336,200 344,200" fill="#ef4444" />
          <polygon points="340,498 336,486 344,486" fill="#ef4444" />
          <rect x="348" y="325" width="82" height="24" fill="#7f1d1d" rx="4" stroke="#fca5a5" strokeWidth="1" />
          <text x="389" y="341" fill="#fef08a" fontSize="11" fontWeight="bold" textAnchor="middle">Cao = 1.8m</text>

          {/* Main Width: 1.2m */}
          <line x1="328" y1="480" x2="590" y2="480" stroke="#ef4444" strokeWidth="2" />
          <polygon points="328,480 340,476 340,484" fill="#ef4444" />
          <polygon points="590,480 578,476 578,484" fill="#ef4444" />
          <rect x="419" y="468" width="80" height="24" fill="#7f1d1d" rx="4" stroke="#fca5a5" strokeWidth="1" />
          <text x="459" y="484" fill="#fef08a" fontSize="11" fontWeight="bold" textAnchor="middle">Rộng = 1.2m</text>

          {/* Side Door Width: 0.8m (Only if hop_kep) */}
          {isHopKep && (
            <>
              <line x1="140" y1="510" x2="230" y2="510" stroke="#38bdf8" strokeWidth="1.5" />
              <polygon points="140,510 148,507 148,513" fill="#38bdf8" />
              <polygon points="230,510 222,507 222,513" fill="#38bdf8" />
              <rect x="155" y="515" width="60" height="20" fill="#0c4a6e" rx="3" />
              <text x="185" y="529" fill="#7dd3fc" fontSize="10" fontWeight="bold" textAnchor="middle">0.8 m</text>

              {/* Box Depth: 0.5m */}
              <line x1="246" y1="175" x2="309" y2="175" stroke="#f59e0b" strokeWidth="1.5" />
              <rect x="250" y="155" width="55" height="18" fill="#78350f" rx="3" />
              <text x="277" y="168" fill="#fef08a" fontSize="9" fontWeight="bold" textAnchor="middle">Sâu 0.5m</text>
            </>
          )}
        </g>
      )}
    </svg>
  );
};

// =========================================================================
// 2. SIDE ELEVATION & CROSS-SECTION SVG (MẶT CẮT ĐỨNG & MẶT BÊN LỀU CHỮ A)
// =========================================================================
export const SideElevationSvg: React.FC<{
  config: CampVisualConfig;
  isNight: boolean;
  showDimensions: boolean;
  onSelectHotspot: (desc: string) => void;
}> = ({ config, isNight, showDimensions, onSelectHotspot }) => {
  const isKnotOk = config.knotDistanceCm === 80 && config.isCloveHitchKnot;

  return (
    <svg viewBox="0 0 1000 580" className="w-full h-full drop-shadow-lg font-mono select-none">
      <defs>
        <pattern id="sideGrid" width="25" height="25" patternUnits="userSpaceOnUse">
          <path d="M 25 0 L 0 0 0 25" fill="none" stroke="#047857" strokeWidth="0.5" opacity="0.3" />
        </pattern>
        <linearGradient id="tentSlopeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1e3a8a" />
          <stop offset="100%" stopColor="#1e40af" />
        </linearGradient>
      </defs>

      {/* Blueprint Canvas */}
      <rect x="0" y="0" width="1000" height="580" fill={isNight ? "#062118" : "#063327"} />
      <rect x="0" y="0" width="1000" height="580" fill="url(#sideGrid)" />

      {/* Header */}
      <rect x="30" y="18" width="940" height="42" fill="#065f46" rx="6" stroke="#34d399" strokeWidth="1.5" />
      <text x="50" y="44" fill="#ecfdf5" fontSize="14" fontWeight="bold">
        MẶT CẮT ĐỨNG & HÌNH CHIẾU BÊN LỀU TRẠI CHỮ A (3.6m × 3.6m)
      </text>
      <text x="950" y="44" fill="#6ee7b7" fontSize="11" textAnchor="end">
        CỘT CHÍNH 1.8M • GÓC MÁI 35° • CỌC NÉO ĐẤT NGHIÊNG 45° SÂU 40CM
      </text>

      {/* Ground Line */}
      <line x1="50" y1="460" x2="950" y2="460" stroke="#4ade80" strokeWidth="3" />
      <text x="940" y="450" fill="#86efac" fontSize="11" textAnchor="end">MẶT ĐẤT SÂN TRẠI</text>

      {/* ---------------- 1. MAIN CENTER POLE (CỘT CHÍNH CAO 1.8M) ---------------- */}
      <g 
        className="cursor-pointer"
        onClick={() => onSelectHotspot("Cột chính giữa lều: Cao đúng 1.8m, đường kính 3cm theo Điều lệ Hải Anh (đạt 10/10 điểm cột chính).")}
      >
        <rect x="492" y="160" width="16" height="300" fill="#d97706" stroke="#78350f" strokeWidth="2" rx="2" />
        <circle cx="500" cy="160" r="10" fill="#fbbf24" stroke="#d97706" strokeWidth="2" />
        {/* Flag on top */}
        <line x1="500" y1="160" x2="500" y2="105" stroke="#ffffff" strokeWidth="2.5" />
        <polygon points="500,105 540,120 500,135" fill="#dc2626" />
        <polygon points="513,120 517,117 521,120 519,116 523,113 518,113 517,109 515,113 510,113 514,116" fill="#facc15" />
        <text x="500" y="90" fill="#fef08a" fontSize="10" fontWeight="bold" textAnchor="middle">CỜ TỔ QUỐC ĐỈNH LỀU</text>
      </g>

      {/* ---------------- 2. A-FRAME TENT ROOF CANOPY (MÁI BẠT CHỮ A) ---------------- */}
      <g 
        className="cursor-pointer"
        onClick={() => onSelectHotspot("Mái bạt kéo phẳng phiu, căng đều không võng, góc dốc 35 độ đảm bảo thoát nước mưa tuyệt đối (đạt 5đ phẳng bạt + 5đ kết cấu).")}
      >
        {/* Left Roof Slope */}
        <polygon points="500,160 260,340 270,360 500,180" fill="url(#tentSlopeGrad)" stroke="#38bdf8" strokeWidth="2" />
        {/* Right Roof Slope */}
        <polygon points="500,160 740,340 730,360 500,180" fill="url(#tentSlopeGrad)" stroke="#38bdf8" strokeWidth="2" />

        {/* Tent Eaves Hem (Mép bạt lều) */}
        <circle cx="260" cy="340" r="8" fill="#f59e0b" stroke="#b45309" strokeWidth="2" />
        <circle cx="740" cy="340" r="8" fill="#f59e0b" stroke="#b45309" strokeWidth="2" />

        {/* Corner Upright Poles (Cột con góc lều cao 1.0m) */}
        <line x1="260" y1="340" x2="260" y2="460" stroke="#d97706" strokeWidth="6" strokeLinecap="round" />
        <line x1="740" y1="340" x2="740" y2="460" stroke="#d97706" strokeWidth="6" strokeLinecap="round" />
        <text x="240" y="410" fill="#fcd34d" fontSize="10" textAnchor="end">Cột con 1.0m</text>
        <text x="760" y="410" fill="#fcd34d" fontSize="10" textAnchor="start">Cột con 1.0m</text>
      </g>

      {/* ---------------- 3. GUY ROPES & 45° GROUND STAKES ---------------- */}
      <g 
        className="cursor-pointer"
        onClick={() => onSelectHotspot(
          isKnotOk 
            ? "Dây néo kéo căng từ mép bạt xuống cọc đất cách đúng 80cm. Nút buộc thuyền chài khóa chắc chắn (đạt 4/4 điểm cọc néo)." 
            : `Cảnh báo: Cọc néo hiện tại ${config.knotDistanceCm}cm, ${config.isCloveHitchKnot ? 'nút thuyền chài' : 'sai nút chết'} - Bị trừ điểm kỹ thuật!`
        )}
      >
        {/* Left Guy Rope Line */}
        <line x1="260" y1="340" x2="140" y2="455" stroke="#ffffff" strokeWidth="3" />
        {/* Left Stake */}
        <line x1="120" y1="485" x2="160" y2="425" stroke="#d97706" strokeWidth="10" strokeLinecap="round" />
        <circle cx="140" cy="455" r="7" fill={isKnotOk ? "#22c55e" : "#ef4444"} stroke="#ffffff" strokeWidth="2" />
        <text x="140" y="415" fill={isKnotOk ? "#4ade80" : "#f87171"} fontSize="10" fontWeight="bold" textAnchor="middle">
          {config.isCloveHitchKnot ? "NÚT THUYỀN CHÀI" : "SAI: NÚT THẮT CHẾT"}
        </text>

        {/* Right Guy Rope Line */}
        <line x1="740" y1="340" x2="860" y2="455" stroke="#ffffff" strokeWidth="3" />
        {/* Right Stake */}
        <line x1="880" y1="485" x2="840" y2="425" stroke="#d97706" strokeWidth="10" strokeLinecap="round" />
        <circle cx="860" cy="455" r="7" fill={isKnotOk ? "#22c55e" : "#ef4444"} stroke="#ffffff" strokeWidth="2" />
        <text x="860" y="415" fill={isKnotOk ? "#4ade80" : "#f87171"} fontSize="10" fontWeight="bold" textAnchor="middle">
          {config.isCloveHitchKnot ? "NÚT THUYỀN CHÀI" : "SAI: NÚT THẮT CHẾT"}
        </text>
      </g>

      {/* ---------------- 4. INTERIOR FURNITURE PROFILE ---------------- */}
      <g 
        className="cursor-pointer"
        onClick={() => onSelectHotspot("Bên trong lều: Bàn thờ Bác kê chính giữa vách hậu, sàn trải chiếu hoa cách ẩm sạch sẽ.")}
      >
        {/* Table Profile */}
        <rect x="440" y="380" width="120" height="80" fill="#991b1b" stroke="#f59e0b" strokeWidth="2" rx="3" />
        <text x="500" y="425" fill="#fef08a" fontSize="10" fontWeight="bold" textAnchor="middle">
          BÀN THỜ BÁC
        </text>
        {/* Clean Mat Floor */}
        <line x1="260" y1="458" x2="740" y2="458" stroke="#f59e0b" strokeWidth="4" />
        <text x="500" y="450" fill="#fef08a" fontSize="9" textAnchor="middle">
          CHIẾU HOA TRẢI SÀN CÁCH ĐẤT
        </text>
      </g>

      {/* ---------------- DIMENSIONS OVERLAY ---------------- */}
      {showDimensions && (
        <g className="pointer-events-none text-xs font-mono">
          {/* Main Pole Height: 1.8m */}
          <line x1="525" y1="160" x2="525" y2="460" stroke="#f59e0b" strokeWidth="2" />
          <polygon points="525,160 521,172 529,172" fill="#f59e0b" />
          <polygon points="525,460 521,448 529,448" fill="#f59e0b" />
          <rect x="535" y="295" width="105" height="24" fill="#78350f" rx="4" stroke="#fef08a" strokeWidth="1" />
          <text x="587" y="311" fill="#fef08a" fontSize="11" fontWeight="bold" textAnchor="middle">Cao = 1.80m</text>

          {/* Corner Pole Height: 1.0m */}
          <line x1="720" y1="340" x2="720" y2="460" stroke="#34d399" strokeWidth="2" />
          <polygon points="720,340 716,350 724,350" fill="#34d399" />
          <polygon points="720,460 716,450 724,450" fill="#34d399" />
          <rect x="655" y="385" width="60" height="20" fill="#064e3b" rx="3" stroke="#34d399" strokeWidth="1" />
          <text x="685" y="399" fill="#a7f3d0" fontSize="10" fontWeight="bold" textAnchor="middle">1.00m</text>

          {/* Distance Stake to Canvas Edge */}
          <line x1="260" y1="480" x2="140" y2="480" stroke={isKnotOk ? "#22c55e" : "#ef4444"} strokeWidth="2" />
          <polygon points="260,480 250,476 250,484" fill={isKnotOk ? "#22c55e" : "#ef4444"} />
          <polygon points="140,480 150,476 150,484" fill={isKnotOk ? "#22c55e" : "#ef4444"} />
          <rect x="150" y="490" width="105" height="24" fill={isKnotOk ? "#064e3b" : "#7f1d1d"} rx="4" stroke={isKnotOk ? "#4ade80" : "#fca5a5"} strokeWidth="1" />
          <text x="202" y="506" fill="#fef08a" fontSize="11" fontWeight="bold" textAnchor="middle">
            {config.knotDistanceCm === 80 ? "Đúng = 80 cm" : `Lệch = ${config.knotDistanceCm} cm`}
          </text>

          <line x1="740" y1="480" x2="860" y2="480" stroke={isKnotOk ? "#22c55e" : "#ef4444"} strokeWidth="2" />
          <polygon points="740,480 750,476 750,484" fill={isKnotOk ? "#22c55e" : "#ef4444"} />
          <polygon points="860,480 850,476 850,484" fill={isKnotOk ? "#22c55e" : "#ef4444"} />
          <rect x="750" y="490" width="105" height="24" fill={isKnotOk ? "#064e3b" : "#7f1d1d"} rx="4" stroke={isKnotOk ? "#4ade80" : "#fca5a5"} strokeWidth="1" />
          <text x="802" y="506" fill="#fef08a" fontSize="11" fontWeight="bold" textAnchor="middle">
            {config.knotDistanceCm === 80 ? "Đúng = 80 cm" : `Lệch = ${config.knotDistanceCm} cm`}
          </text>

          {/* Roof Width: 3.6m */}
          <line x1="260" y1="535" x2="740" y2="535" stroke="#38bdf8" strokeWidth="2" />
          <polygon points="260,535 272,531 272,539" fill="#38bdf8" />
          <polygon points="740,535 728,531 728,539" fill="#38bdf8" />
          <rect x="430" y="522" width="140" height="26" fill="#0c4a6e" rx="4" stroke="#38bdf8" strokeWidth="1" />
          <text x="500" y="539" fill="#f0f9ff" fontSize="12" fontWeight="bold" textAnchor="middle">Chiều rộng lều: 3.60 m</text>
        </g>
      )}
    </svg>
  );
};

// =========================================================================
// 3. ALTAR DETAIL ZOOM SVG (CẬN CẢNH BAN THỜ & MÂM NGŨ QUẢ CHÓ BƯỞI)
// =========================================================================
export const AltarDetailSvg: React.FC<{
  config: CampVisualConfig;
  isNight: boolean;
  showDimensions: boolean;
  onSelectHotspot: (desc: string) => void;
}> = ({ isNight, onSelectHotspot }) => {
  return (
    <svg viewBox="0 0 1000 580" className="w-full h-full drop-shadow-lg font-mono select-none">
      <defs>
        <radialGradient id="altarGlow" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#fef08a" stopOpacity={isNight ? 0.35 : 0.15} />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Altar Room Wall */}
      <rect x="0" y="0" width="1000" height="580" fill={isNight ? "#170c0c" : "#2d0f0f"} />
      <rect x="0" y="0" width="1000" height="580" fill="url(#altarGlow)" />

      {/* Altar Header */}
      <rect x="40" y="16" width="920" height="38" fill="#7f1d1d" rx="6" stroke="#facc15" strokeWidth="1.5" />
      <text x="60" y="40" fill="#fef08a" fontSize="13" fontWeight="bold">
        CHI TIẾT NGHỈ LỄ: BAN THỜ BÁC HỒ & MÂM NGŨ QUẢ TRUNG THU TRUYỀN THỐNG
      </text>
      <text x="940" y="40" fill="#fde68a" fontSize="11" textAnchor="end">
        CHUẨN VỊ TRÍ CHÍNH GIỮA TRÊN CÙNG • ĐẠT TRỌN 10 ĐIỂM
      </text>

      {/* ---------------- 1. NATIONAL FLAG (CỜ TỔ QUỐC TRÊN CÙNG) ---------------- */}
      <g 
        className="cursor-pointer"
        onClick={() => onSelectHotspot("Cờ Tổ quốc treo cao nhất chính giữa (trên ảnh Bác), cờ phẳng phiu, ngôi sao vàng 5 cánh ngay ngắn.")}
        transform="translate(420, 65)"
      >
        <rect x="0" y="0" width="160" height="95" fill="#dc2626" stroke="#facc15" strokeWidth="2.5" rx="3" />
        <polygon 
          points="80,18 88,40 110,40 92,54 99,76 80,63 61,76 68,54 50,40 72,40" 
          fill="#facc15" 
        />
      </g>

      {/* ---------------- 2. UNCLE HO PORTRAIT (ẢNH BÁC HỒ) ---------------- */}
      <g 
        className="cursor-pointer"
        onClick={() => onSelectHotspot("Ảnh Bác Hồ kích thước lớn 30x40cm, lồng khung nhũ vàng trang trọng, lau chùi sạch sẽ không tì vết.")}
        transform="translate(435, 175)"
      >
        <rect x="0" y="0" width="130" height="150" fill="#fef08a" stroke="#ca8a04" strokeWidth="6" rx="4" />
        <rect x="8" y="8" width="114" height="134" fill="#fef3c7" />
        {/* Silhouette Uncle Ho */}
        <circle cx="65" cy="55" r="32" fill="#d97706" fillOpacity="0.3" />
        <path d="M 40 95 C 40 75 90 75 90 95 Z" fill="#b45309" fillOpacity="0.4" />
        <path d="M 58 70 Q 65 92 72 70 Z" fill="#ffffff" />
        <text x="65" y="130" fill="#78350f" fontSize="9" fontWeight="bold" textAnchor="middle">
          CHỦ TỊCH HỒ CHÍ MINH
        </text>
      </g>

      {/* ---------------- 3. FIVE TEACHINGS OF UNCLE HO ---------------- */}
      <g 
        className="cursor-pointer"
        onClick={() => onSelectHotspot("5 Điều Bác Hồ dạy thiếu niên nhi đồng: Treo ngay dưới ảnh Bác, chữ viết mẫu mực rõ ràng từng câu.")}
        transform="translate(390, 335)"
      >
        <rect x="0" y="0" width="220" height="85" fill="#b91c1c" stroke="#facc15" strokeWidth="2" rx="4" />
        <text x="110" y="18" fill="#fef08a" fontSize="10" fontWeight="bold" textAnchor="middle">5 ĐIỀU BÁC HỒ DẠY</text>
        <line x1="20" y1="24" x2="200" y2="24" stroke="#facc15" strokeWidth="1" />
        <text x="14" y="36" fill="#ffffff" fontSize="8">1. Yêu Tổ quốc, yêu đồng bào</text>
        <text x="14" y="48" fill="#ffffff" fontSize="8">2. Học tập tốt, lao động tốt</text>
        <text x="14" y="60" fill="#ffffff" fontSize="8">3. Đoàn kết tốt, kỷ luật tốt</text>
        <text x="14" y="72" fill="#ffffff" fontSize="8">4. Giữ gìn vệ sinh thật tốt</text>
        <text x="115" y="72" fill="#ffffff" fontSize="8">5. Khiêm tốn, thật thà, dũng cảm</text>
      </g>

      {/* ---------------- 4. ALTAR TABLE & RED VELVET CLOTH ---------------- */}
      <g transform="translate(240, 430)">
        {/* Table Frame */}
        <rect x="0" y="0" width="520" height="135" fill="#7f1d1d" stroke="#f59e0b" strokeWidth="3" rx="4" />
        {/* Red Velvet Tablecloth Tassels */}
        <rect x="5" y="5" width="510" height="35" fill="#991b1b" />
        <path d="M 0 40 Q 20 60 40 40 Q 60 60 80 40 Q 100 60 120 40 Q 140 60 160 40 Q 180 60 200 40 Q 220 60 240 40 Q 260 60 280 40 Q 300 60 320 40 Q 340 60 360 40 Q 380 60 400 40 Q 420 60 440 40 Q 460 60 480 40 Q 500 60 520 40" fill="none" stroke="#facc15" strokeWidth="3" />
      </g>

      {/* ---------------- 5. FIVE-FRUIT TRAY & POMELO DOG ZOOM ---------------- */}
      <g 
        className="cursor-pointer"
        onClick={() => onSelectHotspot("Mâm ngũ quả truyền thống: Có chú chó bưởi lông xù mắt đỗ đen cài nơ đỏ, dưa hấu tỉa chữ Hải Anh 2026, nải chuối xanh đỡ chân, hồng ngâm, thanh long.")}
        transform="translate(360, 360)"
      >
        {/* Bronze Tray */}
        <ellipse cx="140" cy="115" rx="130" ry="24" fill="#fbbf24" stroke="#d97706" strokeWidth="3" />
        
        {/* Green Banana Bunch Base */}
        <path d="M 50 110 Q 140 135 230 110" stroke="#15803d" strokeWidth="22" fill="none" strokeLinecap="round" />

        {/* Big Yellow Pomelo */}
        <circle cx="140" cy="85" r="30" fill="#eab308" stroke="#ca8a04" strokeWidth="2" />

        {/* Carved Watermelon (Dưa hấu tỉa hoa) */}
        <g transform="translate(190, 60)">
          <circle cx="25" cy="25" r="24" fill="#15803d" stroke="#166534" strokeWidth="2" />
          <circle cx="25" cy="25" r="18" fill="#dc2626" />
          <text x="25" y="29" fill="#fef08a" fontSize="7" fontWeight="bold" textAnchor="middle">HẢI ANH</text>
        </g>

        {/* Pomelo Dog (Chú chó bưởi lông xù) */}
        <g transform="translate(60, 45)">
          {/* Body fluff */}
          <ellipse cx="28" cy="38" rx="26" ry="22" fill="#fef08a" stroke="#eab308" strokeWidth="2" />
          {/* Head */}
          <circle cx="28" cy="18" r="16" fill="#fef08a" stroke="#eab308" strokeWidth="2" />
          {/* Ears */}
          <ellipse cx="14" cy="12" rx="5" ry="10" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.5" />
          <ellipse cx="42" cy="12" rx="5" ry="10" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.5" />
          {/* Black Beans Eyes and Nose */}
          <circle cx="22" cy="16" r="3" fill="#000000" />
          <circle cx="34" cy="16" r="3" fill="#000000" />
          <ellipse cx="28" cy="23" rx="3" ry="2" fill="#dc2626" />
          {/* Red Ribbon Bow */}
          <polygon points="28,28 20,34 22,26" fill="#dc2626" />
          <polygon points="28,28 36,34 34,26" fill="#dc2626" />
          <circle cx="28" cy="28" r="3" fill="#facc15" />
          <text x="28" y="56" fill="#713f12" fontSize="7" fontWeight="bold" textAnchor="middle">CHÓ BƯỞI</text>
        </g>

        {/* Dragonfruit, Persimmons */}
        <circle cx="165" cy="98" r="14" fill="#f43f5e" />
        <circle cx="115" cy="98" r="13" fill="#ea580c" />
      </g>

      {/* ---------------- 6. FLOWER VASE & INCENSE ---------------- */}
      <g 
        className="cursor-pointer"
        onClick={() => onSelectHotspot("Lọ hoa cúc vàng tươi, đĩa trầu cau truyền thống, bánh nướng bánh dẻo Trung thu thơm ngát.")}
      >
        {/* Left Chrysanthemum Flower Vase */}
        <g transform="translate(265, 380)">
          <path d="M 25 90 L 15 45 L 35 45 L 25 90 Z" fill="#f8fafc" stroke="#0284c7" strokeWidth="2.5" />
          {/* Yellow Flowers */}
          <circle cx="25" cy="25" r="14" fill="#facc15" stroke="#eab308" strokeWidth="2" />
          <circle cx="12" cy="38" r="10" fill="#facc15" stroke="#eab308" strokeWidth="1.5" />
          <circle cx="38" cy="38" r="10" fill="#facc15" stroke="#eab308" strokeWidth="1.5" />
          <circle cx="25" cy="48" r="9" fill="#fde047" />
        </g>

        {/* Right Mooncakes & Betel Tray */}
        <g transform="translate(645, 430)">
          <ellipse cx="40" cy="50" rx="35" ry="10" fill="#ca8a04" stroke="#854d0e" strokeWidth="2" />
          {/* Mooncake */}
          <rect x="20" y="32" width="22" height="15" fill="#b45309" rx="2" stroke="#78350f" strokeWidth="1" />
          <rect x="44" y="32" width="22" height="15" fill="#fef3c7" rx="2" stroke="#d97706" strokeWidth="1" />
          <text x="40" y="70" fill="#fef08a" fontSize="8" fontWeight="bold" textAnchor="middle">BÁNH NƯỚNG / DẺO</text>
        </g>
      </g>
    </svg>
  );
};
