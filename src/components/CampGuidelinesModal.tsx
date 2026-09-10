import React from 'react';
import { BookOpen, X, CheckCircle, AlertTriangle, FileText, Printer, Award, ShieldAlert } from 'lucide-react';

interface CampGuidelinesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CampGuidelinesModal: React.FC<CampGuidelinesModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white text-slate-900 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl border border-slate-300 overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:px-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-red-100 text-red-700 flex items-center justify-center border border-red-200">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                <span>Văn Bản Gốc: Thang Điểm Thi Đua Văn Nghệ - Trại Thu Năm 2026</span>
                <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded font-bold uppercase">
                  Văn Bản Ban Tổ Chức
                </span>
              </h3>
              <p className="text-[11px] text-slate-500">Ban Tổ Chức Trung Thu Xã Hải Anh • Tổng điểm: 110 điểm (Văn nghệ 20đ, Trại 90đ)</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>In Văn Bản</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-200/50 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body - Official Document Layout */}
        <div className="p-4 sm:p-8 overflow-y-auto space-y-6 text-xs sm:text-sm text-slate-800 leading-relaxed font-sans bg-[#faf9f6]">
          {/* Document Heading */}
          <div className="border-b-2 border-slate-300 pb-5 text-center sm:text-left flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
              <p className="font-bold text-slate-900 uppercase tracking-wide text-xs">BAN TỔ CHỨC TRUNG THU</p>
              <p className="font-bold text-slate-900 uppercase tracking-wide text-xs underline underline-offset-4">XÃ HẢI ANH</p>
            </div>
            <div className="text-center sm:text-right w-full sm:w-auto">
              <p className="font-bold text-slate-900 uppercase text-xs">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
              <p className="font-bold text-slate-900 text-xs underline underline-offset-4">Độc lập - Tự do - Hạnh phúc</p>
            </div>
          </div>

          {/* Title */}
          <div className="text-center py-2 space-y-1">
            <h2 className="text-lg sm:text-xl font-black text-slate-900 uppercase tracking-tight">
              THANG ĐIỂM THI ĐUA VĂN NGHỆ - TRẠI THU NĂM 2026
            </h2>
            <p className="italic text-xs text-slate-600 max-w-2xl mx-auto">
              Ban tổ chức thông báo tới các đơn vị cơ sở trong toàn xã về thang điểm thi đua văn nghệ, trại thu năm 2026 với nội dung như sau:
            </p>
          </div>

          {/* ---------------- SECTION I: VĂN NGHỆ 20 ĐIỂM ---------------- */}
          <div className="bg-white p-5 rounded-xl border border-slate-300 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-indigo-200 pb-2">
              <h3 className="font-black text-indigo-950 uppercase text-sm sm:text-base flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-800 inline-flex items-center justify-center text-xs">I</span>
                <span>ĐIỂM VĂN NGHỆ: 20 ĐIỂM</span>
              </h3>
            </div>

            {/* 1. Hát */}
            <div className="space-y-1.5 pl-2 border-l-2 border-indigo-400">
              <div className="flex items-baseline justify-between font-bold text-slate-900">
                <span>1- Số lượng, chủ đề bài hát</span>
                <span className="font-mono text-indigo-700 font-bold">10 điểm</span>
              </div>
              <p className="text-slate-700">
                Tham gia đủ một tiết mục hát chất lượng tốt đúng chủ đề, đúng nhạc, giai điệu bài hát.
              </p>
              <p className="italic text-slate-600 text-xs bg-indigo-50/70 p-2 rounded border border-indigo-100">
                <strong>Lưu ý:</strong> Hát đúng chủ đề Trung thu, những bài hát của thiếu niên nhi đồng ca ngợi Đảng, Bác Hồ, quê hương đất nước.
              </p>
            </div>

            {/* 2. Múa */}
            <div className="space-y-2 pl-2 border-l-2 border-indigo-400">
              <div className="flex items-baseline justify-between font-bold text-slate-900">
                <span>2- Múa</span>
                <span className="font-mono text-indigo-700 font-bold">10 điểm</span>
              </div>
              <ul className="space-y-1 text-slate-700 pl-2">
                <li className="flex justify-between">
                  <span>- Múa đúng chủ đề</span>
                  <span className="font-mono font-semibold">2 điểm</span>
                </li>
                <li className="flex justify-between">
                  <span>- Số lượng từ 12 đội viên trở lên (có nam, nữ)</span>
                  <span className="font-mono font-semibold">2 điểm</span>
                </li>
                <li className="flex justify-between">
                  <span>- Múa hát đúng nhịp điệu</span>
                  <span className="font-mono font-semibold">3 điểm</span>
                </li>
                <li className="flex justify-between">
                  <span>- Múa dẻo, múa đẹp</span>
                  <span className="font-mono font-semibold">3 điểm</span>
                </li>
              </ul>
            </div>

            {/* Điểm trừ văn nghệ */}
            <div className="bg-rose-50/80 p-3.5 rounded-lg border border-rose-200 space-y-2">
              <div className="flex items-center justify-between font-bold text-rose-900">
                <span className="flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>* Điểm trừ văn nghệ (các lỗi trừ)</span>
                </span>
                <span className="font-mono text-rose-700">Tối đa trừ 5 điểm</span>
              </div>
              <ul className="space-y-1 text-xs text-rose-800 pl-2">
                <li className="flex justify-between">
                  <span>- Trang phục không đạt yêu cầu</span>
                  <span className="font-mono font-bold">-1 điểm</span>
                </li>
                <li className="flex justify-between">
                  <span>- Những đơn vị không tôn trọng bốc thăm</span>
                  <span className="font-mono font-bold">-1 điểm</span>
                </li>
                <li className="flex justify-between">
                  <span>- Những đơn vị tuyên truyền sai lệch quan điểm của tập thể, phát ngôn không đúng lúc, đúng chỗ</span>
                  <span className="font-mono font-bold">-2 điểm</span>
                </li>
                <li className="flex justify-between">
                  <span>- Những đơn vị đưa bài hát không đúng chủ đề</span>
                  <span className="font-mono font-bold">-1 điểm</span>
                </li>
              </ul>
            </div>

            {/* Lưu ý văn nghệ */}
            <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 text-xs text-amber-900 leading-relaxed">
              <strong>* Điểm lưu ý đối với các đơn vị:</strong> Chỉ được phép có ý kiến, kiến nghị, đề xuất, khiếu nại trong Hội nghị sau buổi biểu diễn Văn nghệ. Nếu đơn vị nào khiếu nại với Ban tổ chức làm việc sai với đơn vị mình thì phải có ý kiến Ban giám khảo chấm sai chỗ nào.
            </div>
          </div>

          {/* ---------------- SECTION II: TRẠI VÀ TRANG TRÍ TRẠI 90 ĐIỂM ---------------- */}
          <div className="bg-white p-5 rounded-xl border border-slate-300 shadow-2xs space-y-5">
            <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
              <h3 className="font-black text-emerald-950 uppercase text-sm sm:text-base flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 inline-flex items-center justify-center text-xs">II</span>
                <span>ĐIỂM TRẠI VÀ TRANG TRÍ TRẠI: 90 ĐIỂM</span>
              </h3>
            </div>

            {/* 1. Cổng */}
            <div className="space-y-2 pl-2 border-l-2 border-emerald-500">
              <div className="flex items-baseline justify-between font-bold text-slate-900">
                <span>1- Cổng</span>
                <span className="font-mono text-emerald-700 font-bold">15 điểm</span>
              </div>
              <ul className="space-y-1.5 text-slate-700 pl-2">
                <li className="flex justify-between">
                  <span>- Làm hộp kép (hộp vuông, 4 trụ, có 2 cửa lách)</span>
                  <span className="font-mono font-semibold text-emerald-700">7 điểm</span>
                </li>
                <li className="flex justify-between text-slate-600">
                  <span>- Làm hộp đơn (hộp vuông 2 trụ có 1 cửa chính)</span>
                  <span className="font-mono">5 điểm</span>
                </li>
                <li className="flex justify-between text-slate-500">
                  <span>- Làm cổng đơn (đơn giản 4 thanh tre, gỗ, hoặc vật liệu khác dựng lên)</span>
                  <span className="font-mono">3 điểm</span>
                </li>
                <li className="flex justify-between border-t border-slate-100 pt-1">
                  <span>- Đúng kích thước (cửa cao 1,8 m; rộng 1,2 m) <em className="text-xs text-slate-500">(Tuỳ theo mức độ trừ từ 0,5 - 1,5 điểm)</em></span>
                  <span className="font-mono font-semibold">2 điểm</span>
                </li>
                <li className="flex justify-between">
                  <span>- Trang trí đẹp, phù hợp = 5 điểm; in phun = 3 điểm <em className="text-xs text-slate-500">(Tuỳ theo mức độ trừ từ 1 - 3 điểm)</em></span>
                  <span className="font-mono font-semibold">3 - 5 điểm</span>
                </li>
              </ul>
            </div>

            {/* 2. Chủ đề */}
            <div className="space-y-2 pl-2 border-l-2 border-emerald-500">
              <div className="flex items-baseline justify-between font-bold text-slate-900">
                <span>2- Chủ đề: "Lồng đèn thắp sáng ước mơ"</span>
                <span className="font-mono text-emerald-700 font-bold">10 điểm</span>
              </div>
              <ul className="space-y-1 text-slate-700 pl-2">
                <li className="flex justify-between">
                  <span>- Chữ đẹp đúng nội dung</span>
                  <span className="font-mono font-semibold">5 điểm</span>
                </li>
                <li className="flex justify-between">
                  <span>- Màu sắc trang nhã</span>
                  <span className="font-mono font-semibold">2 điểm</span>
                </li>
                <li className="flex justify-between">
                  <span>- Có biểu tượng lịch sử kèm theo</span>
                  <span className="font-mono font-semibold">3 điểm</span>
                </li>
              </ul>
            </div>

            {/* 3. Trại: 65 điểm */}
            <div className="space-y-4 pl-2 border-l-2 border-emerald-500">
              <div className="flex items-baseline justify-between font-bold text-slate-900">
                <span className="text-base">3- Trại</span>
                <span className="font-mono text-emerald-700 font-bold text-base">65 điểm</span>
              </div>

              {/* a. Cột, cọc, mái */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1.5">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>a. Cột, cọc, mái</span>
                  <span className="font-mono text-emerald-700">20 điểm</span>
                </div>
                <ul className="space-y-1 text-slate-700 pl-2">
                  <li className="flex justify-between">
                    <span>- Cột chính cao 1,8m đường kính 3cm</span>
                    <span className="font-mono font-semibold">10 điểm</span>
                  </li>
                  <li className="flex justify-between">
                    <span>- Cọc con chắc chắn, đảm bảo</span>
                    <span className="font-mono font-semibold">5 điểm</span>
                  </li>
                  <li className="flex justify-between">
                    <span>- Mái trại, mái phẳng đẹp</span>
                    <span className="font-mono font-semibold">5 điểm</span>
                  </li>
                </ul>
              </div>

              {/* b. Vệ sinh */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex justify-between font-bold text-slate-900">
                <span>b. Vệ sinh (sạch sẽ)</span>
                <span className="font-mono text-emerald-700">10 điểm</span>
              </div>

              {/* c. Trang trí */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1.5">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>c. Trang trí nội thất</span>
                  <span className="font-mono text-emerald-700">20 điểm</span>
                </div>
                <ul className="space-y-1 text-slate-700 pl-2">
                  <li className="flex justify-between">
                    <span>- Trên cùng là cờ Tổ quốc, ảnh Bác Hồ, 5 điều Bác Hồ dạy</span>
                    <span className="font-mono font-semibold">4 điểm</span>
                  </li>
                  <li className="flex justify-between">
                    <span>- Có mâm ngũ quả, lọ hoa</span>
                    <span className="font-mono font-semibold">4 điểm</span>
                  </li>
                  <li className="flex justify-between">
                    <span>- Góc học tập (bên phải) gồm có: Sách vở, bút mực, bàn học, đèn học</span>
                    <span className="font-mono font-semibold">4 điểm</span>
                  </li>
                  <li className="flex justify-between font-medium text-emerald-900 bg-emerald-50/60 p-1.5 rounded">
                    <span>- Chủ đề năm học 2026 - 2027: <strong>"Thiếu nhi Ninh Bình vững bước tiến vào kỷ nguyên mới"</strong> (Bên trái)</span>
                    <span className="font-mono font-bold">4 điểm</span>
                  </li>
                  <li className="flex justify-between">
                    <span>- Có tranh chuyện kèm theo</span>
                    <span className="font-mono font-semibold">1 điểm</span>
                  </li>
                  <li className="flex justify-between">
                    <span>- Trang thiết bị của Đội: trống, cờ</span>
                    <span className="font-mono font-semibold">1 điểm</span>
                  </li>
                  <li className="flex justify-between">
                    <span>- Ánh sáng tốt</span>
                    <span className="font-mono font-semibold">2 điểm</span>
                  </li>
                </ul>
              </div>

              {/* d. Kỹ thuật */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1.5">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>d. Kỹ thuật</span>
                  <span className="font-mono text-emerald-700">15 điểm</span>
                </div>
                <ul className="space-y-1 text-slate-700 pl-2">
                  <li className="flex justify-between">
                    <span>- Khoảng cách từ nút đồng xu tới cọc con là 80 cm, buộc dây theo kiểu nút thuyền chài</span>
                    <span className="font-mono font-semibold">4 điểm</span>
                  </li>
                  <li className="flex justify-between">
                    <span>- Khoảng cách từ chân cột to tới chân cọc con buộc nóc trại = 1,8m</span>
                    <span className="font-mono font-semibold">2 điểm</span>
                  </li>
                  <li className="flex justify-between">
                    <span>- Nút buộc đúng</span>
                    <span className="font-mono font-semibold">2 điểm</span>
                  </li>
                  <li className="flex justify-between">
                    <span>- Các cạnh của trại song song nhau</span>
                    <span className="font-mono font-semibold">2 điểm</span>
                  </li>
                  <li className="flex justify-between">
                    <span>- Cọc trước thẳng hàng cọc sau / kỹ thuật căng néo chắc chắn</span>
                    <span className="font-mono font-semibold">5 điểm</span>
                  </li>
                </ul>
              </div>

              {/* e. Trang trí tổng thể */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex justify-between font-bold text-slate-900">
                <span>e. Trang trí tổng thể trại đẹp, thẩm mỹ, sáng tạo</span>
                <span className="font-mono text-emerald-700">10 điểm</span>
              </div>
            </div>

            {/* Điểm trừ đối với trại */}
            <div className="bg-rose-50/80 p-3.5 rounded-lg border border-rose-200 space-y-2">
              <div className="flex items-center justify-between font-bold text-rose-900">
                <span className="flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>* Điểm trừ đối với trại (các lỗi trừ)</span>
                </span>
                <span className="font-mono text-rose-700">10 điểm</span>
              </div>
              <ul className="space-y-1 text-xs text-rose-800 pl-2">
                <li>• <strong>Thiếu 1 mục:</strong> trừ 0,5 điểm; <strong>Treo sai vị trí:</strong> trừ 1 điểm</li>
                <li>• <strong>Các nút buộc không đúng:</strong> trừ 0,5 điểm</li>
                <li>• <strong>Khoảng cách các cọc và các cọc trước không thẳng hàng các cọc sau:</strong> trừ 0,5 điểm</li>
              </ul>
            </div>

            {/* Quy định kỷ luật & phát ngôn (Trang 3) */}
            <div className="bg-red-900 text-white p-4 rounded-xl border border-red-700 space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-300 text-xs sm:text-sm uppercase">
                <ShieldAlert className="w-5 h-5 text-amber-400" />
                <span>* Quy Định Kỷ Luật & Thái Độ Ứng Xử (Trừ 10 Điểm Nặng)</span>
              </div>
              <ul className="space-y-1 text-xs text-red-100 pl-4 list-disc">
                <li>Ý kiến phát ngôn bừa bãi, thái độ mọi thành viên trong đơn vị không tôn trọng Ban tổ chức, Ban giám khảo.</li>
                <li>Khiếu nại, đề xuất không phục tùng tổ chức.</li>
                <li className="font-bold text-amber-200">Các lỗi trên đều bị trừ 10 điểm.</li>
              </ul>
              <p className="text-[11px] italic text-red-200 border-t border-red-800/80 pt-2 mt-2">
                * Nếu có đề xuất kiến nghị cử đại diện BCH Chi Đoàn, Chi đội gặp Ban tổ chức, Ban giám khảo./.
              </p>
            </div>
          </div>

          {/* Footer of Official Document */}
          <div className="pt-4 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-right border-t border-slate-300">
            <div className="text-xs text-slate-500 italic text-left">
              Hội trại thu truyền thống xã Hải Anh • Căn cứ văn bản chính thức của Ban tổ chức
            </div>
            <div>
              <p className="font-bold text-slate-900 uppercase text-xs">TM. BAN TỔ CHỨC TRUNG THU XÃ HẢI ANH</p>
              <div className="my-2 h-10 flex items-center justify-center sm:justify-end">
                <span className="px-3 py-1 rounded bg-red-50 text-red-600 border border-red-200 font-serif font-bold text-xs">
                  [ĐÃ KÝ & ĐÓNG DẤU]
                </span>
              </div>
              <p className="text-xs text-slate-600 font-semibold">TRƯỞNG BAN TỔ CHỨC</p>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Tổng điểm thi đua toàn đoàn: <strong>110 điểm</strong> (Văn nghệ 20đ + Trại 90đ)
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors cursor-pointer shadow-xs"
          >
            Đã Nắm Rõ Văn Bản Chuẩn
          </button>
        </div>
      </div>
    </div>
  );
};

