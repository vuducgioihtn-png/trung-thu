import React from 'react';
import { 
  DollarSign, 
  PieChart, 
  CheckCircle, 
  HelpCircle, 
  HeartHandshake, 
  Printer, 
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';
import { LOTUS_MATERIALS } from '../../data/lotusModelData';

export const LotusModelBudget: React.FC = () => {
  const totalCost = LOTUS_MATERIALS.reduce((acc, item) => acc + item.totalCost, 0);

  // Group by funding sources
  const bySource = {
    mua_moi: LOTUS_MATERIALS.filter(m => m.source === 'mua_moi').reduce((s, m) => s + m.totalCost, 0),
    thue_muon: LOTUS_MATERIALS.filter(m => m.source === 'thue_muon').reduce((s, m) => s + m.totalCost, 0),
    co_san: LOTUS_MATERIALS.filter(m => m.source === 'co_san').reduce((s, m) => s + m.totalCost, 0),
    tu_che_tai_tro: LOTUS_MATERIALS.filter(m => m.source === 'tu_che_tai_tro').reduce((s, m) => s + m.totalCost, 0),
  };

  // Group by category
  const categoriesList = [
    { key: 'cong_tam_quan', name: 'Cổng Tam Quan & Khung Gỗ' },
    { key: 'hoa_sen_den_long', name: 'Hoa Sen LED & Lồng Đèn Hội' },
    { key: 'leu_khung_bat', name: 'Lều Chữ A & Cọc Néo' },
    { key: 'noi_that_le_nghi', name: 'Bàn Thờ Bác & Mâm Ngũ Quả' },
    { key: 'goc_hoc_tap', name: 'Góc Học Tập (Bên Phải)' },
    { key: 'nghi_thuc_doi', name: 'Nghi Thức Đội (Bên Trái)' },
    { key: 'dien_chieu_sang', name: 'Điện Chiếu Sáng & An Toàn' },
    { key: 'san_vuon_hang_rao', name: 'Cảnh Quan & Hàng Rào Tre' },
  ];

  const byCategory = categoriesList.map(cat => {
    const cost = LOTUS_MATERIALS.filter(m => m.category === cat.key).reduce((s, m) => s + m.totalCost, 0);
    const count = LOTUS_MATERIALS.filter(m => m.category === cat.key).length;
    return {
      ...cat,
      cost,
      count,
      percent: Math.round((cost / totalCost) * 100) || 0,
    };
  });

  const formatVND = (num: number) => num.toLocaleString('vi-VN') + ' đ';

  return (
    <div className="space-y-6">
      {/* Top Banner Budget Overview */}
      <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-indigo-950 text-white p-6 rounded-3xl shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Dự Toán Mô Hình Cổng Hoa Sen 2026
            </span>
            <h2 className="text-2xl font-black mt-2 tracking-tight">
              Bảng Dự Trù Kinh Phí & Cân Đối Nguồn Vốn
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Dự toán chi tiết được bóc tách theo đúng từng cấu kiện thực tế trên phối cảnh ảnh mẫu. Tối ưu hóa bằng cách kết hợp mượn đồ sẵn có và tài trợ của phụ huynh để tiết kiệm tối đa.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/15 text-right">
            <span className="text-xs text-slate-300 block font-medium">Tổng Kinh Phí Dự Kiến:</span>
            <span className="text-3xl font-black text-amber-300">{formatVND(totalCost)}</span>
            <span className="text-[11px] text-emerald-300 block mt-1">Đã cân đối 100% nguồn thu</span>
          </div>
        </div>
      </div>

      {/* Funding Source Structure Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Doan xa cap */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Kinh Phí Đoàn Xã Cấp</span>
            <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-700 text-[10px] font-bold">Cố định</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">{formatVND(3000000)}</p>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-blue-600 h-full rounded-full" style={{ width: `${(3000000 / totalCost) * 100}%` }} />
          </div>
          <p className="text-[11px] text-slate-500 font-medium">
            Hỗ trợ chính thức {Math.round((3000000 / totalCost) * 100)}% tổng chi
          </p>
        </div>

        {/* Phu Huynh Dong Gop */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Phụ Huynh Đóng Góp</span>
            <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-700 text-[10px] font-bold">Xã hội hóa</span>
          </div>
          <p className="text-2xl font-bold text-amber-700">{formatVND(2800000)}</p>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-amber-500 h-full rounded-full" style={{ width: `${(2800000 / totalCost) * 100}%` }} />
          </div>
          <p className="text-[11px] text-slate-500 font-medium">
            Huy động {Math.round((2800000 / totalCost) * 100)}% từ các gia đình
          </p>
        </div>

        {/* Manh thuong quan tai tro */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Tài Trợ & Tự Chế</span>
            <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-700 text-[10px] font-bold">Ủng hộ</span>
          </div>
          <p className="text-2xl font-bold text-purple-700">{formatVND(1965000)}</p>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-purple-500 h-full rounded-full" style={{ width: `${(1965000 / totalCost) * 100}%` }} />
          </div>
          <p className="text-[11px] text-slate-500 font-medium">
            Đoàn viên thanh niên & các bác thợ mộc
          </p>
        </div>

        {/* Mượn & Tiết kiệm được */}
        <div className="bg-white p-5 rounded-2xl border border-emerald-200 bg-emerald-50/20 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-emerald-700 font-semibold">
            <span>Giá Trị Tiết Kiệm (Đồ Mượn)</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-emerald-700">~ 4.500.000 đ</p>
          <div className="w-full bg-emerald-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-emerald-600 h-full rounded-full w-full" />
          </div>
          <p className="text-[11px] text-emerald-600 font-medium">
            Nhờ mượn sập gỗ, trống Đội, bàn học, bạt
          </p>
        </div>
      </div>

      {/* Category Cost Breakdown */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <PieChart className="w-4 h-4 text-emerald-600" />
          Bóc Tách Chi Phí Theo 8 Nhóm Hạng Mục
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {byCategory.map((cat) => (
            <div key={cat.key} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="font-bold text-slate-900 text-xs">{cat.name}</p>
                <p className="text-[11px] text-slate-500">{cat.count} vật tư chi tiết</p>
              </div>
              <div className="text-right">
                <p className="font-mono font-bold text-slate-900 text-sm">{formatVND(cat.cost)}</p>
                <span className="inline-block px-2 py-0.5 rounded-md bg-slate-200 text-slate-700 text-[10px] font-bold">
                  {cat.percent}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Financial Guidelines & Notes */}
      <div className="bg-amber-50/70 p-5 rounded-2xl border border-amber-200 text-xs text-amber-900 space-y-2">
        <h4 className="font-bold flex items-center gap-1.5 text-amber-950">
          <ShieldCheck className="w-4 h-4 text-amber-700" />
          Quy Chế Quản Lý Tài Chính & Thanh Quyết Toán Mô Hình
        </h4>
        <ul className="list-disc pl-5 space-y-1 text-amber-800">
          <li>Mọi khoản chi mua mới (Hoa sen LED, đèn cá chép, dây điện, cọc sắt...) bắt buộc phải có hóa đơn bán lẻ hoặc chữ ký người bán để thanh toán với thủ quỹ.</li>
          <li>Đồ thuê mượn (Bàn học sinh, trống Đội, sập gỗ) phải có biên bản bàn giao hiện trạng khi nhận và khi hoàn trả sau hội trại.</li>
          <li>Quỹ dự phòng phát sinh 300.000 đ được giao cho Anh Nam (Đội trưởng) để xử lý đột xuất trong ngày dựng trại.</li>
        </ul>
      </div>
    </div>
  );
};
