import React from 'react';
import { X, Printer, Download, CheckCircle2 } from 'lucide-react';
import { LOTUS_MATERIALS, LOTUS_CONSTRUCTION_STEPS, LOTUS_SCORE_AUDIT } from '../../data/lotusModelData';

interface LotusModelPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LotusModelPrintModal: React.FC<LotusModelPrintModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const totalCost = LOTUS_MATERIALS.reduce((s, i) => s + i.totalCost, 0);
  const formatVND = (num: number) => num.toLocaleString('vi-VN') + ' đ';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Hồ Sơ Kỹ Thuật & Dự Toán Mẫu Cổng Hoa Sen 2026 (Khổ In A4)
            </h3>
            <p className="text-xs text-slate-500">
              Đơn vị: Chi đoàn thanh niên & Đội TNTP Hồ Chí Minh xã Hải Anh
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>In Hồ Sơ (A4)</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Content Area */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-8 text-slate-800 text-xs leading-relaxed" id="printable-lotus-document">
          {/* Header Banner */}
          <div className="text-center border-b-2 border-slate-900 pb-4 space-y-1">
            <p className="font-bold uppercase tracking-wider text-slate-600 text-[10px]">ĐOÀN TNCS HỒ CHÍ MINH XÃ HẢI ANH - LIÊN ĐỘI THIẾU NHI</p>
            <h1 className="text-xl font-black text-slate-900 uppercase">
              BẢN THUYẾT MINH THIẾT KẾ & DỰ TOÁN CÔNG TRÌNH CỔNG TRẠI HOA SEN 2026
            </h1>
            <p className="font-semibold text-emerald-800">
              CHỦ ĐỀ HỘI THI: "LỒNG ĐÈN THẮP SÁNG ƯỚC MƠ" - TẾT TRUNG THU NĂM 2026
            </p>
          </div>

          {/* Section 1: Specifications */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-slate-900 uppercase border-b border-slate-300 pb-1">
              I. QUY CÁCH KỸ THUẬT & Ý TƯỞNG KIẾN TRÚC
            </h2>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <p><strong>1. Hình thức cổng:</strong> Cổng tam quan 4 trụ gỗ hộp kép vuông 15cm, mái uốn cong đầu đao truyền thống.</p>
                <p><strong>2. Kích thước bao:</strong> Rộng 4.2m × Cao 3.2m; Lối vào chính rộng 1.8m, 2 cửa lách phụ vòm cong R45cm.</p>
                <p><strong>3. Hệ thống ánh sáng:</strong> 6 bông sen LED hồng (4 đỉnh cột + 2 mái lách), 2 đèn lồng cá chép đỏ vượt vũ môn, đèn ông sao D40cm và 10 lồng đèn quả nhót đa sắc.</p>
              </div>
              <div className="space-y-1.5">
                <p><strong>4. Quy cách lều:</strong> Lều chữ A bạt rêu quân đội 3.5m × 4.5m × cao 2.2m, sàn giát tre cách đất 15cm, 8 cọc néo 80cm tăng đơ dù trắng.</p>
                <p><strong>5. Bố trí lễ nghi bắt buộc:</strong></p>
                <ul className="list-disc pl-5 text-[11px] space-y-0.5 text-slate-700">
                  <li><strong>Chính giữa:</strong> Cờ Tổ quốc, ảnh Bác Hồ, 5 Điều Bác dạy, mâm ngũ quả đại truyền thống, 2 lọ hoa tươi.</li>
                  <li><strong>BÊN PHẢI (Bắt buộc):</strong> Bàn học sinh gỗ mộc + Đèn bàn học rọi sáng + Sách vở + Pano chủ đề Ninh Bình.</li>
                  <li><strong>BÊN TRÁI (Bắt buộc):</strong> Cờ Đội thêu + Dàn trống Đội 3 chiếc + Cờ tam giác ngũ sắc.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 2: Bill of Materials & Budget */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-slate-900 uppercase border-b border-slate-300 pb-1 flex justify-between">
              <span>II. DỰ TOÁN KINH PHÍ & KHỐI LƯỢNG VẬT TƯ (TỔNG: {formatVND(totalCost)})</span>
              <span className="text-[11px] font-normal text-slate-500">Đơn vị tính: VNĐ</span>
            </h2>
            <table className="w-full text-left border border-slate-300 text-[11px]">
              <thead className="bg-slate-100 text-slate-700 font-bold">
                <tr>
                  <th className="p-2 border border-slate-300">STT</th>
                  <th className="p-2 border border-slate-300">Tên vật tư / Quy cách</th>
                  <th className="p-2 border border-slate-300 text-center">ĐVT</th>
                  <th className="p-2 border border-slate-300 text-center">Số lượng</th>
                  <th className="p-2 border border-slate-300 text-right">Đơn giá</th>
                  <th className="p-2 border border-slate-300 text-right">Thành tiền</th>
                  <th className="p-2 border border-slate-300">Nguồn cung</th>
                </tr>
              </thead>
              <tbody>
                {LOTUS_MATERIALS.slice(0, 15).map((item, idx) => (
                  <tr key={item.id} className="border-b border-slate-200">
                    <td className="p-1.5 border border-slate-200 text-center">{idx + 1}</td>
                    <td className="p-1.5 border border-slate-200 font-semibold">{item.name}</td>
                    <td className="p-1.5 border border-slate-200 text-center">{item.unit}</td>
                    <td className="p-1.5 border border-slate-200 text-center">{item.quantity}</td>
                    <td className="p-1.5 border border-slate-200 text-right font-mono">{formatVND(item.unitPrice)}</td>
                    <td className="p-1.5 border border-slate-200 text-right font-mono font-bold">{formatVND(item.totalCost)}</td>
                    <td className="p-1.5 border border-slate-200 text-[10px]">
                      {item.source === 'mua_moi' ? 'Mua mới' : item.source === 'thue_muon' ? 'Thuê mượn' : 'Có sẵn / Tự chế'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-[10px] text-slate-500 italic">* Và 20 hạng mục chi tiết khác đã được bóc tách trong bảng kê đầy đủ.</p>
          </div>

          {/* Section 3: Signatures */}
          <div className="pt-8 grid grid-cols-3 text-center text-xs">
            <div className="space-y-12">
              <p className="font-bold">ĐẠI DIỆN PHỤ HUYNH</p>
              <p className="font-semibold text-slate-500">(Ký và ghi rõ họ tên)</p>
            </div>
            <div className="space-y-12">
              <p className="font-bold">BÍ THƯ CHI ĐOÀN XÓM</p>
              <p className="font-semibold text-slate-500">(Ký và ghi rõ họ tên)</p>
            </div>
            <div className="space-y-12">
              <p className="font-bold">BCH ĐOÀN XÃ HẢI ANH</p>
              <p className="font-semibold text-slate-500">(Phê duyệt & Đóng dấu)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
