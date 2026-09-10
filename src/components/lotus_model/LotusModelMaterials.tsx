import React, { useState } from 'react';
import { 
  Package, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Plus, 
  FileSpreadsheet,
  Download,
  Trash2,
  DollarSign
} from 'lucide-react';
import { LOTUS_MATERIALS } from '../../data/lotusModelData';
import { LotusMaterialItem } from '../../types/lotusModel';

export const LotusModelMaterials: React.FC = () => {
  const [materials, setMaterials] = useState<LotusMaterialItem[]>(LOTUS_MATERIALS);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // New item form state
  const [newItem, setNewItem] = useState<Partial<LotusMaterialItem>>({
    name: '',
    category: 'cong_tam_quan',
    specification: '',
    unit: 'Cái',
    quantity: 1,
    unitPrice: 50000,
    source: 'mua_moi',
    status: 'chua_co',
    assignee: '',
  });

  const categories = [
    { id: 'all', label: 'Tất cả danh mục' },
    { id: 'cong_tam_quan', label: 'Cổng Tam Quan & Khung Gỗ' },
    { id: 'hoa_sen_den_long', label: 'Hoa Sen LED & Lồng Đèn' },
    { id: 'leu_khung_bat', label: 'Lều Chữ A & Néo Cọc' },
    { id: 'noi_that_le_nghi', label: 'Nghi Lễ & Mâm Ngũ Quả' },
    { id: 'goc_hoc_tap', label: 'Góc Học Tập (Bên Phải)' },
    { id: 'nghi_thuc_doi', label: 'Nghi Thức Đội (Bên Trái)' },
    { id: 'dien_chieu_sang', label: 'Điện & Ánh Sáng An Toàn' },
    { id: 'san_vuon_hang_rao', label: 'Cảnh Quan & Hàng Rào' },
  ];

  const filteredMaterials = materials.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.specification.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.assignee.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalCost = materials.reduce((sum, item) => sum + item.totalCost, 0);
  const readyCount = materials.filter(m => m.status === 'da_san_sang').length;
  const inProgressCount = materials.filter(m => m.status === 'dang_chuan_bi').length;
  const missingCount = materials.filter(m => m.status === 'chua_co').length;

  const toggleStatus = (id: string) => {
    setMaterials(prev => prev.map(item => {
      if (item.id === id) {
        let nextStatus: LotusMaterialItem['status'] = 'chua_co';
        if (item.status === 'chua_co') nextStatus = 'dang_chuan_bi';
        else if (item.status === 'dang_chuan_bi') nextStatus = 'da_san_sang';
        else nextStatus = 'chua_co';
        return { ...item, status: nextStatus };
      }
      return item;
    }));
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name) return;
    const qty = Number(newItem.quantity) || 1;
    const price = Number(newItem.unitPrice) || 0;
    const created: LotusMaterialItem = {
      id: `custom-${Date.now()}`,
      name: newItem.name,
      category: (newItem.category as any) || 'cong_tam_quan',
      specification: newItem.specification || '',
      unit: newItem.unit || 'Cái',
      quantity: qty,
      unitPrice: price,
      totalCost: qty * price,
      source: (newItem.source as any) || 'mua_moi',
      status: (newItem.status as any) || 'chua_co',
      assignee: newItem.assignee || 'Chưa phân công',
    };
    setMaterials([created, ...materials]);
    setShowAddModal(false);
    setNewItem({
      name: '',
      category: 'cong_tam_quan',
      specification: '',
      unit: 'Cái',
      quantity: 1,
      unitPrice: 50000,
      source: 'mua_moi',
      status: 'chua_co',
      assignee: '',
    });
  };

  const removeItem = (id: string) => {
    setMaterials(prev => prev.filter(m => m.id !== id));
  };

  const formatVND = (num: number) => num.toLocaleString('vi-VN') + ' đ';

  return (
    <div className="space-y-6">
      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1 font-medium">
            <span>Tổng Hạng Mục</span>
            <Package className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{materials.length}</p>
          <p className="text-[11px] text-slate-500 mt-1 font-medium">Chi tiết theo ảnh mẫu</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-emerald-200 bg-emerald-50/20 shadow-xs">
          <div className="flex items-center justify-between text-emerald-700 text-xs mb-1 font-medium">
            <span>Đã Sẵn Sàng</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-emerald-700">{readyCount}</p>
          <p className="text-[11px] text-emerald-600 mt-1 font-medium">
            {Math.round((readyCount / materials.length) * 100)}% khối lượng đã chuẩn bị
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-amber-200 bg-amber-50/20 shadow-xs">
          <div className="flex items-center justify-between text-amber-700 text-xs mb-1 font-medium">
            <span>Đang Gia Công</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-bold text-amber-700">{inProgressCount}</p>
          <p className="text-[11px] text-amber-600 mt-1 font-medium">{missingCount} mục cần bổ sung</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-indigo-200 bg-indigo-50/20 shadow-xs">
          <div className="flex items-center justify-between text-indigo-700 text-xs mb-1 font-medium">
            <span>Tổng Dự Toán Mẫu</span>
            <DollarSign className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-xl font-bold text-indigo-700">{formatVND(totalCost)}</p>
          <p className="text-[11px] text-indigo-600 mt-1 font-medium">Bao gồm 8 nhóm vật tư</p>
        </div>
      </div>

      {/* Action and Filter Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm kiếm vật tư, kích thước, người phụ trách..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:border-emerald-500 transition-all"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-hidden"
            >
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-hidden"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="da_san_sang">Đã sẵn sàng</option>
              <option value="dang_chuan_bi">Đang chuẩn bị</option>
              <option value="chua_co">Chưa có</option>
            </select>

            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm Vật Tư</span>
            </button>
          </div>
        </div>
      </div>

      {/* Materials Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Tên Vật Tư & Quy Cách</th>
                <th className="py-3 px-4">Đơn Vị</th>
                <th className="py-3 px-4 text-center">Số Lượng</th>
                <th className="py-3 px-4 text-right">Đơn Giá</th>
                <th className="py-3 px-4 text-right">Thành Tiền</th>
                <th className="py-3 px-4">Nguồn Cung Cấp</th>
                <th className="py-3 px-4">Người Phụ Trách</th>
                <th className="py-3 px-4 text-center">Trạng Thái</th>
                <th className="py-3 px-3 text-center">Xóa</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMaterials.map((item) => {
                return (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-900">{item.name}</p>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{item.specification}</p>
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-medium">{item.unit}</td>
                    <td className="py-3 px-4 text-center font-bold text-slate-800">{item.quantity}</td>
                    <td className="py-3 px-4 text-right font-mono text-slate-600">{formatVND(item.unitPrice)}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">{formatVND(item.totalCost)}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        item.source === 'mua_moi' ? 'bg-amber-100 text-amber-800' :
                        item.source === 'thue_muon' ? 'bg-sky-100 text-sky-800' :
                        item.source === 'co_san' ? 'bg-emerald-100 text-emerald-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {item.source === 'mua_moi' ? 'Mua mới' :
                         item.source === 'thue_muon' ? 'Thuê mượn' :
                         item.source === 'co_san' ? 'Có sẵn' : 'Tự chế/Tài trợ'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-700 font-medium">{item.assignee}</td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => toggleStatus(item.id)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                          item.status === 'da_san_sang'
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : item.status === 'dang_chuan_bi'
                            ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                            : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                        }`}
                      >
                        {item.status === 'da_san_sang' && <CheckCircle2 className="w-3 h-3" />}
                        {item.status === 'dang_chuan_bi' && <Clock className="w-3 h-3" />}
                        {item.status === 'chua_co' && <AlertCircle className="w-3 h-3" />}
                        <span>
                          {item.status === 'da_san_sang' ? 'Sẵn sàng' :
                           item.status === 'dang_chuan_bi' ? 'Đang chuẩn bị' : 'Chưa có'}
                        </span>
                      </button>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Xóa vật tư"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">Thêm Vật Tư Cho Dự Án Cổng Hoa Sen</h3>
            <form onSubmit={handleAddItem} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tên vật tư</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Bóng đèn led tròn quả nhót"
                  value={newItem.name}
                  onChange={e => setNewItem({ ...newItem, name: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phân nhóm</label>
                  <select
                    value={newItem.category}
                    onChange={e => setNewItem({ ...newItem, category: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="cong_tam_quan">Cổng Tam Quan</option>
                    <option value="hoa_sen_den_long">Hoa Sen & Lồng Đèn</option>
                    <option value="leu_khung_bat">Lều & Néo Bạt</option>
                    <option value="noi_that_le_nghi">Nội Thất Nghi Lễ</option>
                    <option value="goc_hoc_tap">Góc Học Tập (Bên Phải)</option>
                    <option value="nghi_thuc_doi">Nghi Thức Đội (Bên Trái)</option>
                    <option value="dien_chieu_sang">Điện Chiếu Sáng</option>
                    <option value="san_vuon_hang_rao">Sân Vườn & Hàng Rào</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Đơn vị tính</label>
                  <input
                    type="text"
                    value={newItem.unit}
                    onChange={e => setNewItem({ ...newItem, unit: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Số lượng</label>
                  <input
                    type="number"
                    min="1"
                    value={newItem.quantity}
                    onChange={e => setNewItem({ ...newItem, quantity: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Đơn giá (VNĐ)</label>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={newItem.unitPrice}
                    onChange={e => setNewItem({ ...newItem, unitPrice: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Quy cách chi tiết</label>
                <input
                  type="text"
                  placeholder="Kích thước, chất liệu, màu sắc..."
                  value={newItem.specification}
                  onChange={e => setNewItem({ ...newItem, specification: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nguồn cung</label>
                  <select
                    value={newItem.source}
                    onChange={e => setNewItem({ ...newItem, source: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="mua_moi">Mua mới</option>
                    <option value="thue_muon">Thuê mượn</option>
                    <option value="co_san">Có sẵn</option>
                    <option value="tu_che_tai_tro">Tự chế / Tài trợ</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Người phụ trách</label>
                  <input
                    type="text"
                    placeholder="Họ tên người nhận trách nhiệm"
                    value={newItem.assignee}
                    onChange={e => setNewItem({ ...newItem, assignee: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold cursor-pointer"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-xs cursor-pointer"
                >
                  Lưu Vật Tư
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
