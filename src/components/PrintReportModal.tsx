import React from 'react';
import { Printer, X, Download, Tent, Music, Flag } from 'lucide-react';
import { BudgetItem, CampVisualConfig, PerformanceConfig, MajorGroup, getCategoryMajorGroup, MAJOR_GROUPS } from '../types/camp';
import { calculateTotalScore } from '../utils/scoreCalculator';
import { FUNDING_NAMES } from './BudgetEstimator';

interface PrintReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  budgetItems: BudgetItem[];
  campConfig: CampVisualConfig;
  perfConfig: PerformanceConfig;
}

export const PrintReportModal: React.FC<PrintReportModalProps> = ({
  isOpen,
  onClose,
  budgetItems,
  campConfig,
  perfConfig,
}) => {
  if (!isOpen) return null;

  const totalBudget = budgetItems.reduce((sum, item) => sum + item.total, 0);
  const scoreResult = calculateTotalScore(campConfig, perfConfig);

  const handlePrint = () => {
    window.print();
  };

  // Group items by 3 Major Parts
  const campItems = budgetItems.filter((b) => (b.group || getCategoryMajorGroup(b.category)) === 'cam_trai');
  const perfItems = budgetItems.filter((b) => (b.group || getCategoryMajorGroup(b.category)) === 'van_nghe');
  const ritualItems = budgetItems.filter((b) => (b.group || getCategoryMajorGroup(b.category)) === 'nghi_thuc_doi');

  const campTotal = campItems.reduce((sum, i) => sum + i.total, 0);
  const perfTotal = perfItems.reduce((sum, i) => sum + i.total, 0);
  const ritualTotal = ritualItems.reduce((sum, i) => sum + i.total, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white text-slate-900 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl border border-slate-200">
        {/* Modal Toolbar (hidden on print) */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between print:hidden bg-slate-50 rounded-t-2xl">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Printer className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">
              Xem Trước Văn Bản Báo Cáo Dự Trù Kinh Phí (Phân Chia 3 Phần)
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors shadow-sm cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>In Ngay (Print)</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-xl cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Content */}
        <div className="p-8 sm:p-12 overflow-y-auto font-serif text-sm leading-relaxed print:p-0 print:m-0">
          {/* Header of official document */}
          <div className="flex justify-between items-start text-center mb-8">
            <div className="w-5/12 text-xs font-sans">
              <p className="font-bold uppercase">ĐOÀN TNCS HỒ CHÍ MINH XÃ HẢI ANH</p>
              <p className="font-bold uppercase underline">CHI ĐOÀN THANH NIÊN CƠ SỞ</p>
              <p className="italic text-[11px] text-stone-500 mt-1">Số: 01-BC/KPH-2026</p>
            </div>
            <div className="w-6/12 text-xs font-sans">
              <p className="font-bold uppercase">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
              <p className="font-bold underline">Độc lập - Tự do - Hạnh phúc</p>
              <p className="italic text-[11px] mt-1">Hải Anh, ngày 04 tháng 09 năm 2026</p>
            </div>
          </div>

          <div className="text-center my-6">
            <h1 className="text-lg font-bold uppercase tracking-wide">
              BẢN DỰ TRÙ KINH PHÍ & KẾ HOẠCH HỘI TRẠI THU NĂM 2026
            </h1>
            <p className="text-xs font-sans font-semibold text-stone-600 mt-1">
              Chủ đề: "LỒNG ĐÈN THẮP SÁNG ƯỚC MƠ" • PHÂN ĐỊNH RÕ RÀNG 3 PHẦN: CẮM TRẠI - VĂN NGHỆ - NGHI THỨC ĐỘI
            </p>
            <p className="text-xs font-sans font-bold text-emerald-700 mt-0.5">
              DỰ KIẾN THẨM ĐỊNH THI ĐUA: {scoreResult.totalScore}/110 ĐIỂM
            </p>
          </div>

          <div className="space-y-4 text-xs font-sans">
            <div>
              <h4 className="font-bold uppercase text-stone-800">I. THÔNG SỐ TIÊU CHUẨN THỰC ĐỊA:</h4>
              <ul className="list-disc pl-5 space-y-1 text-stone-700 mt-1">
                <li><strong>1. Cắm Trại:</strong> Cổng hộp kép kích thước lọt lòng {campConfig.gateHeight}m × {campConfig.gateWidth}m, mái bạt căng phẳng góc dốc 35°, 8 cọc néo đất nút thuyền chài cự ly chuẩn {campConfig.knotDistanceCm}cm.</li>
                <li><strong>2. Văn Nghệ:</strong> Tiết mục hát múa 14 em ({perfConfig.dancingTeamSize} đội viên nam nữ), 5 màn biến đổi đội hình, 14 đèn ông sao led, đạo cụ hoa sen lụa.</li>
                <li><strong>3. Nghi Thức Đội:</strong> Bộ trống Đội 3 chiếc + dùi, cờ Đội, cờ Tổ quốc, góc học tập đèn bàn đặt BÊN PHẢI, khẩu hiệu 'Thiếu nhi Ninh Bình...' đặt BÊN TRÁI.</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold uppercase text-stone-800 mt-4">II. BẢNG DỰ TOÁN KINH PHÍ CHI TIẾT (3 PHẦN):</h4>
              <table className="w-full border-collapse border border-stone-400 mt-2 text-[11px]">
                <thead>
                  <tr className="bg-stone-100 text-stone-800 font-bold">
                    <th className="border border-stone-300 p-2 text-center w-8">STT</th>
                    <th className="border border-stone-300 p-2 text-left">Nội dung / Hạng mục vật tư</th>
                    <th className="border border-stone-300 p-2 text-center w-14">ĐVT</th>
                    <th className="border border-stone-300 p-2 text-center w-12">SL</th>
                    <th className="border border-stone-300 p-2 text-right w-24">Đơn giá (đ)</th>
                    <th className="border border-stone-300 p-2 text-right w-28">Thành tiền (đ)</th>
                    <th className="border border-stone-300 p-2 text-center w-24">Nguồn chi</th>
                  </tr>
                </thead>
                <tbody>
                  {/* PHẦN I: CẮM TRẠI */}
                  <tr className="bg-emerald-50 text-emerald-950 font-bold">
                    <td colSpan={7} className="border border-stone-300 p-2 text-left uppercase">
                      PHẦN I: HẠNG MỤC CẮM TRẠI (CỔNG, KHUNG LỀU, BAN THỜ & HẬU CẦN) - {campItems.length} mục
                    </td>
                  </tr>
                  {campItems.map((item, idx) => (
                    <tr key={item.id}>
                      <td className="border border-stone-300 p-1.5 text-center font-mono">1.{idx + 1}</td>
                      <td className="border border-stone-300 p-1.5 font-medium">{item.name}</td>
                      <td className="border border-stone-300 p-1.5 text-center">{item.unit}</td>
                      <td className="border border-stone-300 p-1.5 text-center">{item.quantity}</td>
                      <td className="border border-stone-300 p-1.5 text-right font-mono">{item.unitPrice.toLocaleString('vi-VN')}</td>
                      <td className="border border-stone-300 p-1.5 text-right font-mono font-bold text-emerald-800">{item.total.toLocaleString('vi-VN')}</td>
                      <td className="border border-stone-300 p-1.5 text-center text-[10px]">{FUNDING_NAMES[item.fundingSource] || item.fundingSource}</td>
                    </tr>
                  ))}
                  <tr className="bg-emerald-100/50 font-semibold text-emerald-900">
                    <td colSpan={5} className="border border-stone-300 p-1.5 text-right">Cộng Phần I (Cắm Trại):</td>
                    <td className="border border-stone-300 p-1.5 text-right font-mono font-bold">{campTotal.toLocaleString('vi-VN')} đ</td>
                    <td className="border border-stone-300 p-1.5"></td>
                  </tr>

                  {/* PHẦN II: VĂN NGHỆ */}
                  <tr className="bg-indigo-50 text-indigo-950 font-bold">
                    <td colSpan={7} className="border border-stone-300 p-2 text-left uppercase">
                      PHẦN II: HẠNG MỤC VĂN NGHỆ (HÁT MÚA 14 EM, TRANG PHỤC & ĐẠO CỤ) - {perfItems.length} mục
                    </td>
                  </tr>
                  {perfItems.map((item, idx) => (
                    <tr key={item.id}>
                      <td className="border border-stone-300 p-1.5 text-center font-mono">2.{idx + 1}</td>
                      <td className="border border-stone-300 p-1.5 font-medium">{item.name}</td>
                      <td className="border border-stone-300 p-1.5 text-center">{item.unit}</td>
                      <td className="border border-stone-300 p-1.5 text-center">{item.quantity}</td>
                      <td className="border border-stone-300 p-1.5 text-right font-mono">{item.unitPrice.toLocaleString('vi-VN')}</td>
                      <td className="border border-stone-300 p-1.5 text-right font-mono font-bold text-indigo-800">{item.total.toLocaleString('vi-VN')}</td>
                      <td className="border border-stone-300 p-1.5 text-center text-[10px]">{FUNDING_NAMES[item.fundingSource] || item.fundingSource}</td>
                    </tr>
                  ))}
                  <tr className="bg-indigo-100/50 font-semibold text-indigo-900">
                    <td colSpan={5} className="border border-stone-300 p-1.5 text-right">Cộng Phần II (Văn Nghệ):</td>
                    <td className="border border-stone-300 p-1.5 text-right font-mono font-bold">{perfTotal.toLocaleString('vi-VN')} đ</td>
                    <td className="border border-stone-300 p-1.5"></td>
                  </tr>

                  {/* PHẦN III: NGHI THỨC ĐỘI */}
                  <tr className="bg-amber-50 text-amber-950 font-bold">
                    <td colSpan={7} className="border border-stone-300 p-2 text-left uppercase">
                      PHẦN III: HẠNG MỤC NGHI THỨC ĐỘI (TRỐNG CỜ, GÓC HỌC TẬP & KHẨU HIỆU) - {ritualItems.length} mục
                    </td>
                  </tr>
                  {ritualItems.map((item, idx) => (
                    <tr key={item.id}>
                      <td className="border border-stone-300 p-1.5 text-center font-mono">3.{idx + 1}</td>
                      <td className="border border-stone-300 p-1.5 font-medium">{item.name}</td>
                      <td className="border border-stone-300 p-1.5 text-center">{item.unit}</td>
                      <td className="border border-stone-300 p-1.5 text-center">{item.quantity}</td>
                      <td className="border border-stone-300 p-1.5 text-right font-mono">{item.unitPrice.toLocaleString('vi-VN')}</td>
                      <td className="border border-stone-300 p-1.5 text-right font-mono font-bold text-amber-900">{item.total.toLocaleString('vi-VN')}</td>
                      <td className="border border-stone-300 p-1.5 text-center text-[10px]">{FUNDING_NAMES[item.fundingSource] || item.fundingSource}</td>
                    </tr>
                  ))}
                  <tr className="bg-amber-100/50 font-semibold text-amber-950">
                    <td colSpan={5} className="border border-stone-300 p-1.5 text-right">Cộng Phần III (Nghi Thức Đội):</td>
                    <td className="border border-stone-300 p-1.5 text-right font-mono font-bold">{ritualTotal.toLocaleString('vi-VN')} đ</td>
                    <td className="border border-stone-300 p-1.5"></td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr className="font-bold bg-slate-900 text-white">
                    <td colSpan={5} className="border border-stone-300 p-2 text-right uppercase">
                      TỔNG CỘNG TOÀN BỘ KINH PHÍ DỰ TRÙ (3 PHẦN):
                    </td>
                    <td className="border border-stone-300 p-2 text-right font-mono text-sm text-amber-400">
                      {totalBudget.toLocaleString('vi-VN')} đ
                    </td>
                    <td className="border border-stone-300 p-2"></td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Signatures */}
            <div className="grid grid-cols-3 text-center pt-8 text-xs font-sans">
              <div>
                <p className="font-bold uppercase">NGƯỜI LẬP DỰ TRÙ</p>
                <p className="italic text-[10px] text-stone-500 mt-0.5">(Ký và ghi rõ họ tên)</p>
                <div className="h-16"></div>
                <p className="font-semibold">Bí thư Chi đoàn</p>
              </div>
              <div>
                <p className="font-bold uppercase">ĐẠI DIỆN PHỤ HUYNH</p>
                <p className="italic text-[10px] text-stone-500 mt-0.5">(Ký và ghi rõ họ tên)</p>
                <div className="h-16"></div>
                <p className="font-semibold">Hội trưởng</p>
              </div>
              <div>
                <p className="font-bold uppercase">BAN CHẤP HÀNH ĐOÀN XÃ</p>
                <p className="italic text-[10px] text-stone-500 mt-0.5">(Phê duyệt chấp thuận)</p>
                <div className="h-16"></div>
                <p className="font-semibold">Bí thư Đoàn xã Hải Anh</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
