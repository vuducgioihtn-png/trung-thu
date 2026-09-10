import React, { useState, useMemo } from 'react';
import { 
  DollarSign, 
  Plus, 
  Trash2, 
  Printer, 
  PieChart, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  Tent,
  Music,
  Flag,
  Sparkles,
  Layers,
  ChevronRight,
  Filter,
  Edit2,
  X,
  Save
} from 'lucide-react';
import { 
  BudgetItem, 
  MaterialCategory, 
  MajorGroup, 
  MAJOR_GROUPS, 
  getCategoryMajorGroup,
  FundingSource
} from '../types/camp';

interface BudgetEstimatorProps {
  items: BudgetItem[];
  onUpdateItems: (newItems: BudgetItem[]) => void;
  onOpenPrintModal: () => void;
  initialGroupFilter?: MajorGroup | 'all';
}

const CATEGORY_NAMES: Record<MaterialCategory, string> = {
  gate: '1. Cổng Trại & Chữ Nổi',
  tent_structure: '2. Khung Cọc Mái & Kỹ Thuật',
  interior_ceremony: '3. Ban Thờ Bác & Mâm Ngũ Quả',
  study_corner: '4. Góc Học Tập & Khẩu Hiệu',
  pioneer_gear: '5. Thiết Bị Nghi Thức Đội',
  performance: '6. Văn Nghệ & Trang Phục',
  logistics_feasting: '7. Ánh Sáng & Phá Cỗ Trung Thu',
};

export const FUNDING_NAMES: Record<string, string> = {
  chi_doan: 'Quỹ Chi đoàn thanh niên',
  xom: 'Hỗ trợ từ xóm',
  xa_doan: 'Hỗ trợ từ Đoàn xã',
  phu_huynh: 'Đóng góp Hội phụ huynh',
  tai_tro: 'Nhà hảo tâm tài trợ',
};

export const BudgetEstimator: React.FC<BudgetEstimatorProps> = ({
  items,
  onUpdateItems,
  onOpenPrintModal,
  initialGroupFilter = 'all'
}) => {
  // 3 Major Parts: 'all' | 'cam_trai' | 'van_nghe' | 'nghi_thuc_doi'
  const [selectedGroup, setSelectedGroup] = useState<MajorGroup | 'all'>(initialGroupFilter);

  // Sync with prop when parent changes pillar
  React.useEffect(() => {
    setSelectedGroup(initialGroupFilter);
  }, [initialGroupFilter]);

  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('all');
  const [isAddingItem, setIsAddingItem] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<BudgetItem | null>(null);

  // Form state for new item
  const [newName, setNewName] = useState('');
  const [newGroup, setNewGroup] = useState<MajorGroup>('cam_trai');
  const [newCategory, setNewCategory] = useState<MaterialCategory>('gate');
  const [newUnit, setNewUnit] = useState('Bộ');
  const [newUnitPrice, setNewUnitPrice] = useState<number>(50000);
  const [newQuantity, setNewQuantity] = useState<number>(1);
  const [newFunding, setNewFunding] = useState<FundingSource>('chi_doan');

  // Compute breakdown for the 3 major parts
  const groupStats = useMemo(() => {
    const stats: Record<MajorGroup, {
      items: BudgetItem[];
      total: number;
      paid: number;
      pending: number;
    }> = {
      cam_trai: { items: [], total: 0, paid: 0, pending: 0 },
      van_nghe: { items: [], total: 0, paid: 0, pending: 0 },
      nghi_thuc_doi: { items: [], total: 0, paid: 0, pending: 0 },
    };

    items.forEach((item) => {
      const g = item.group || getCategoryMajorGroup(item.category);
      if (stats[g]) {
        stats[g].items.push(item);
        stats[g].total += item.total;
        if (item.isPaid) {
          stats[g].paid += item.total;
        } else {
          stats[g].pending += item.total;
        }
      }
    });

    return stats;
  }, [items]);

  // Overall Totals
  const totalBudget = items.reduce((sum, item) => sum + item.total, 0);
  const totalPaid = items
    .filter((item) => item.isPaid)
    .reduce((sum, item) => sum + item.total, 0);
  const totalPending = totalBudget - totalPaid;

  // Breakdown by funding source
  const fundingTotals = items.reduce((acc, item) => {
    acc[item.fundingSource] = (acc[item.fundingSource] || 0) + item.total;
    return acc;
  }, {} as Record<string, number>);

  // Handle inline edits
  const handlePriceChange = (id: string, unitPrice: number) => {
    const updated = items.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          unitPrice,
          total: unitPrice * item.quantity,
        };
      }
      return item;
    });
    onUpdateItems(updated);
  };

  const handleQuantityChange = (id: string, quantity: number) => {
    const updated = items.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          quantity,
          total: item.unitPrice * quantity,
        };
      }
      return item;
    });
    onUpdateItems(updated);
  };

  const handleTogglePaid = (id: string) => {
    const updated = items.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          isPaid: !item.isPaid,
        };
      }
      return item;
    });
    onUpdateItems(updated);
  };

  const handleDeleteItem = (id: string) => {
    if (window.confirm('Xác nhận xóa hạng mục này khỏi dự toán?')) {
      onUpdateItems(items.filter((item) => item.id !== id));
      if (editingItem && editingItem.id === id) {
        setEditingItem(null);
      }
    }
  };

  const handleStartEdit = (item: BudgetItem) => {
    setEditingItem(item);
  };

  const handleSaveEditItem = (updatedItem: BudgetItem) => {
    onUpdateItems(items.map((item) => (item.id === updatedItem.id ? updatedItem : item)));
    setEditingItem(null);
  };

  // Sync category options when group changes in Add Form
  const handleGroupChangeInForm = (group: MajorGroup) => {
    setNewGroup(group);
    const defaultCat = MAJOR_GROUPS[group].categories[0];
    setNewCategory(defaultCat);
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newItem: BudgetItem = {
      id: `b_custom_${Date.now()}`,
      name: newName,
      category: newCategory,
      group: newGroup,
      unit: newUnit,
      unitPrice: Number(newUnitPrice),
      quantity: Number(newQuantity),
      total: Number(newUnitPrice) * Number(newQuantity),
      fundingSource: newFunding,
      isPaid: false,
    };

    onUpdateItems([...items, newItem]);
    setNewName('');
    setIsAddingItem(false);
  };

  // Filter items based on selected major group & subcategory
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const g = item.group || getCategoryMajorGroup(item.category);
      if (selectedGroup !== 'all' && g !== selectedGroup) return false;
      if (selectedSubCategory !== 'all' && item.category !== selectedSubCategory) return false;
      return true;
    });
  }, [items, selectedGroup, selectedSubCategory]);

  return (
    <div id="budget-estimator-root" className="space-y-6">
      {/* 3 MAJOR PILLARS HEADER TABS */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-600" />
              <span>Phân Hệ Kinh Phí (3 Phần):</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            <button
              id="btn-filter-group-all"
              onClick={() => {
                setSelectedGroup('all');
                setSelectedSubCategory('all');
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                selectedGroup === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Tất Cả ({items.length} mục)</span>
            </button>

            <button
              id="btn-filter-group-cam-trai"
              onClick={() => {
                setSelectedGroup('cam_trai');
                setSelectedSubCategory('all');
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                selectedGroup === 'cam_trai'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
              }`}
            >
              <Tent className="w-3.5 h-3.5" />
              <span>1. CẮM TRẠI ({groupStats.cam_trai.items.length})</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                selectedGroup === 'cam_trai' ? 'bg-emerald-700 text-white' : 'bg-emerald-200 text-emerald-900'
              }`}>
                {(groupStats.cam_trai.total / 1000000).toFixed(1)}Tr
              </span>
            </button>

            <button
              id="btn-filter-group-van-nghe"
              onClick={() => {
                setSelectedGroup('van_nghe');
                setSelectedSubCategory('all');
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                selectedGroup === 'van_nghe'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-indigo-50 text-indigo-800 hover:bg-indigo-100 border border-indigo-200'
              }`}
            >
              <Music className="w-3.5 h-3.5" />
              <span>2. VĂN NGHỆ ({groupStats.van_nghe.items.length})</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                selectedGroup === 'van_nghe' ? 'bg-indigo-700 text-white' : 'bg-indigo-200 text-indigo-900'
              }`}>
                {(groupStats.van_nghe.total / 1000000).toFixed(1)}Tr
              </span>
            </button>

            <button
              id="btn-filter-group-nghi-thuc"
              onClick={() => {
                setSelectedGroup('nghi_thuc_doi');
                setSelectedSubCategory('all');
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                selectedGroup === 'nghi_thuc_doi'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200'
              }`}
            >
              <Flag className="w-3.5 h-3.5" />
              <span>3. NGHI THỨC ĐỘI ({groupStats.nghi_thuc_doi.items.length})</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                selectedGroup === 'nghi_thuc_doi' ? 'bg-amber-700 text-white' : 'bg-amber-200 text-amber-950'
              }`}>
                {(groupStats.nghi_thuc_doi.total / 1000000).toFixed(1)}Tr
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* 3 MAJOR PILLARS SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Pillar 1: Cắm Trại */}
        <div 
          onClick={() => {
            setSelectedGroup('cam_trai');
            setSelectedSubCategory('all');
          }}
          className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-sm relative overflow-hidden ${
            selectedGroup === 'cam_trai'
              ? 'bg-emerald-50/70 border-emerald-500 ring-2 ring-emerald-500/20'
              : 'bg-white border-slate-200 hover:border-emerald-300'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <Tent className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">1. CẮM TRẠI</h4>
                <p className="text-[11px] text-slate-500">Cổng, khung lều, ban thờ & hậu cần</p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              {totalBudget > 0 ? Math.round((groupStats.cam_trai.total / totalBudget) * 100) : 0}% Tổng chi
            </span>
          </div>

          <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-baseline justify-between">
            <div>
              <span className="text-[11px] text-slate-500 block">Dự toán phần trại:</span>
              <span className="text-lg font-bold text-slate-900 font-mono">
                {groupStats.cam_trai.total.toLocaleString('vi-VN')} đ
              </span>
            </div>
            <div className="text-right text-[11px]">
              <span className="text-emerald-700 font-medium block">
                Đã chi: {groupStats.cam_trai.paid.toLocaleString('vi-VN')}đ
              </span>
              <span className="text-slate-400">
                {groupStats.cam_trai.items.length} hạng mục
              </span>
            </div>
          </div>
        </div>

        {/* Pillar 2: Văn Nghệ */}
        <div 
          onClick={() => {
            setSelectedGroup('van_nghe');
            setSelectedSubCategory('all');
          }}
          className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-sm relative overflow-hidden ${
            selectedGroup === 'van_nghe'
              ? 'bg-indigo-50/70 border-indigo-500 ring-2 ring-indigo-500/20'
              : 'bg-white border-slate-200 hover:border-indigo-300'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                <Music className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">2. VĂN NGHỆ</h4>
                <p className="text-[11px] text-slate-500">14 Em hát múa, đèn lồng, đạo cụ & beat</p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
              {totalBudget > 0 ? Math.round((groupStats.van_nghe.total / totalBudget) * 100) : 0}% Tổng chi
            </span>
          </div>

          <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-baseline justify-between">
            <div>
              <span className="text-[11px] text-slate-500 block">Dự toán văn nghệ:</span>
              <span className="text-lg font-bold text-slate-900 font-mono">
                {groupStats.van_nghe.total.toLocaleString('vi-VN')} đ
              </span>
            </div>
            <div className="text-right text-[11px]">
              <span className="text-indigo-700 font-medium block">
                Đã chi: {groupStats.van_nghe.paid.toLocaleString('vi-VN')}đ
              </span>
              <span className="text-slate-400">
                {groupStats.van_nghe.items.length} hạng mục
              </span>
            </div>
          </div>
        </div>

        {/* Pillar 3: Nghi Thức Đội */}
        <div 
          onClick={() => {
            setSelectedGroup('nghi_thuc_doi');
            setSelectedSubCategory('all');
          }}
          className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-sm relative overflow-hidden ${
            selectedGroup === 'nghi_thuc_doi'
              ? 'bg-amber-50/70 border-amber-500 ring-2 ring-amber-500/20'
              : 'bg-white border-slate-200 hover:border-amber-300'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                <Flag className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">3. NGHI THỨC ĐỘI</h4>
                <p className="text-[11px] text-slate-500">Trống Đội, cờ, khăn quàng, góc học tập</p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
              {totalBudget > 0 ? Math.round((groupStats.nghi_thuc_doi.total / totalBudget) * 100) : 0}% Tổng chi
            </span>
          </div>

          <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-baseline justify-between">
            <div>
              <span className="text-[11px] text-slate-500 block">Dự toán nghi thức:</span>
              <span className="text-lg font-bold text-slate-900 font-mono">
                {groupStats.nghi_thuc_doi.total.toLocaleString('vi-VN')} đ
              </span>
            </div>
            <div className="text-right text-[11px]">
              <span className="text-amber-800 font-medium block">
                Đã chi: {groupStats.nghi_thuc_doi.paid.toLocaleString('vi-VN')}đ
              </span>
              <span className="text-slate-400">
                {groupStats.nghi_thuc_doi.items.length} hạng mục
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Overview Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="h-11 w-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-500 font-medium">Tổng Dự Toán Cả 3 Phần</p>
            <p className="text-lg font-bold text-slate-900 font-mono mt-0.5">
              {totalBudget.toLocaleString('vi-VN')} <span className="text-xs text-slate-500 font-normal">đ</span>
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="h-11 w-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-500 font-medium">Đã Thanh Toán / Có Sẵn</p>
            <p className="text-lg font-bold text-emerald-600 font-mono mt-0.5">
              {totalPaid.toLocaleString('vi-VN')} <span className="text-xs text-slate-500 font-normal">đ</span>
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="h-11 w-11 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-500 font-medium">Cần Bổ Sung / Quyên Góp</p>
            <p className="text-lg font-bold text-rose-600 font-mono mt-0.5">
              {totalPending.toLocaleString('vi-VN')} <span className="text-xs text-slate-500 font-normal">đ</span>
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="h-11 w-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <PieChart className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-500 font-medium">Bình Quân / 1 Đội Viên</p>
            <p className="text-lg font-bold text-indigo-700 font-mono mt-0.5">
              {Math.round(totalBudget / 25).toLocaleString('vi-VN')} <span className="text-xs text-slate-500 font-normal">đ</span>
            </p>
          </div>
        </div>
      </div>

      {/* Budget Action Controls & Filter */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 sm:px-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              {selectedGroup === 'all' && <span>Danh Mục Kinh Phí Toàn Diện</span>}
              {selectedGroup === 'cam_trai' && (
                <span className="text-emerald-800 flex items-center gap-1.5">
                  <Tent className="w-4 h-4" />
                  <span>Phần 1: Dự Trù Cắm Trại</span>
                </span>
              )}
              {selectedGroup === 'van_nghe' && (
                <span className="text-indigo-800 flex items-center gap-1.5">
                  <Music className="w-4 h-4" />
                  <span>Phần 2: Dự Trù Văn Nghệ</span>
                </span>
              )}
              {selectedGroup === 'nghi_thuc_doi' && (
                <span className="text-amber-900 flex items-center gap-1.5">
                  <Flag className="w-4 h-4" />
                  <span>Phần 3: Dự Trù Nghi Thức Đội</span>
                </span>
              )}
            </h3>
            <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full font-semibold">
              {filteredItems.length} mục
            </span>
          </div>

          <div className="flex items-center flex-wrap gap-2">
            {/* Category Filter */}
            <select
              id="filter-budget-category"
              value={selectedSubCategory}
              onChange={(e) => setSelectedSubCategory(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 shadow-2xs"
            >
              <option value="all">
                {selectedGroup === 'all' ? 'Tất cả các nhóm chi (7 nhóm)' : 'Tất cả các nhóm trong phần này'}
              </option>
              {Object.entries(CATEGORY_NAMES)
                .filter(([cat]) => {
                  if (selectedGroup === 'all') return true;
                  return MAJOR_GROUPS[selectedGroup].categories.includes(cat as MaterialCategory);
                })
                .map(([cat, label]) => (
                  <option key={cat} value={cat}>{label}</option>
                ))}
            </select>

            {/* Add Item Button */}
            <button
              id="btn-add-budget-item"
              onClick={() => {
                if (selectedGroup !== 'all') {
                  setNewGroup(selectedGroup);
                  setNewCategory(MAJOR_GROUPS[selectedGroup].categories[0]);
                }
                setIsAddingItem(!isAddingItem);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors shadow-sm cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm mục chi</span>
            </button>

            {/* Print Button */}
            <button
              id="btn-print-budget"
              onClick={onOpenPrintModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors shadow-2xs cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>In Dự Trù 3 Phần</span>
            </button>
          </div>
        </div>

        {/* Add Item Form (Collapsible) */}
        {isAddingItem && (
          <form onSubmit={handleAddItem} className="p-4 bg-emerald-50/40 border-b border-emerald-100 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-emerald-900 uppercase">Thêm Hạng Mục Chi Mới Vào Dự Toán:</h4>
              <span className="text-[11px] text-slate-500">Phân định rõ vào 1 trong 3 phần chính</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 text-xs">
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-medium text-slate-700 mb-1">Tên hạng mục:</label>
                <input
                  id="new-budget-name"
                  type="text"
                  required
                  placeholder="VD: Dây cờ đuôi nheo, găng tay trắng..."
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-700 mb-1">Thuộc phần:</label>
                <select
                  value={newGroup}
                  onChange={(e) => handleGroupChangeInForm(e.target.value as MajorGroup)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1.5 focus:ring-1 focus:ring-emerald-500 focus:outline-none font-semibold text-slate-900"
                >
                  <option value="cam_trai">1. Cắm Trại</option>
                  <option value="van_nghe">2. Văn Nghệ</option>
                  <option value="nghi_thuc_doi">3. Nghi Thức Đội</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-700 mb-1">Nhóm chi:</label>
                <select
                  id="new-budget-category"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as MaterialCategory)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1.5 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                >
                  {MAJOR_GROUPS[newGroup].categories.map((cat) => (
                    <option key={cat} value={cat}>{CATEGORY_NAMES[cat]}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-700 mb-1">ĐVT:</label>
                <input
                  id="new-budget-unit"
                  type="text"
                  value={newUnit}
                  onChange={(e) => setNewUnit(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-700 mb-1">Đơn giá (VNĐ):</label>
                <input
                  id="new-budget-price"
                  type="number"
                  min="0"
                  step="1000"
                  value={newUnitPrice}
                  onChange={(e) => setNewUnitPrice(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 focus:ring-1 focus:ring-emerald-500 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-700 mb-1">Số lượng:</label>
                <input
                  id="new-budget-qty"
                  type="number"
                  min="1"
                  value={newQuantity}
                  onChange={(e) => setNewQuantity(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 focus:ring-1 focus:ring-emerald-500 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-700 mb-1">Nguồn kinh phí:</label>
                <select
                  value={newFunding}
                  onChange={(e) => setNewFunding(e.target.value as FundingSource)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1.5 focus:ring-1 focus:ring-emerald-500 focus:outline-none text-slate-900"
                >
                  <option value="chi_doan">Quỹ Chi đoàn</option>
                  <option value="xom">Hỗ trợ từ xóm</option>
                  <option value="xa_doan">Hỗ trợ Đoàn xã</option>
                  <option value="phu_huynh">Đóng góp Phụ huynh</option>
                  <option value="tai_tro">Nhà hảo tâm tài trợ</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddingItem(false)}
                className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-600 text-xs hover:bg-slate-100 cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm cursor-pointer"
              >
                Lưu Vào Dự Toán
              </button>
            </div>
          </form>
        )}

        {/* Interactive Items Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 sticky top-0 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 w-12 text-center">STT</th>
                <th className="py-3 px-4">Tên Hạng Mục / Vật Tư</th>
                <th className="py-3 px-4">Phân Thuộc (3 Phần)</th>
                <th className="py-3 px-3 text-center">ĐVT</th>
                <th className="py-3 px-3 text-right">Đơn Giá</th>
                <th className="py-3 px-3 text-center">SL</th>
                <th className="py-3 px-4 text-right">Thành Tiền</th>
                <th className="py-3 px-3 text-center">Nguồn Chi</th>
                <th className="py-3 px-3 text-center">Trạng Thái</th>
                <th className="py-3 px-3 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-100">
              {filteredItems.map((item, index) => {
                const grp = item.group || getCategoryMajorGroup(item.category);
                return (
                  <tr 
                    key={item.id} 
                    className={`hover:bg-slate-50/80 transition-colors ${
                      item.isPaid ? 'bg-emerald-50/20' : ''
                    }`}
                  >
                    <td className="py-3 px-4 text-center font-mono text-slate-400 text-xs">
                      {index + 1}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 group">
                        <p 
                          onClick={() => handleStartEdit(item)}
                          className="font-medium text-slate-900 group-hover:text-emerald-700 cursor-pointer transition-colors"
                          title="Bấm để sửa thông tin hạng mục"
                        >
                          {item.name}
                        </p>
                        <button
                          type="button"
                          onClick={() => handleStartEdit(item)}
                          className="opacity-0 group-hover:opacity-100 p-0.5 text-slate-400 hover:text-emerald-600 transition-opacity cursor-pointer"
                          title="Sửa thông tin"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                      </div>
                      {item.note && (
                        <p className="text-xs text-slate-500 mt-0.5">{item.note}</p>
                      )}
                    </td>
                    <td className="py-3 px-4 text-xs">
                      <div className="flex flex-col gap-1">
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] inline-flex items-center gap-1 w-fit ${
                          grp === 'cam_trai'
                            ? 'bg-emerald-100 text-emerald-800'
                            : grp === 'van_nghe'
                            ? 'bg-indigo-100 text-indigo-800'
                            : 'bg-amber-100 text-amber-900'
                        }`}>
                          {grp === 'cam_trai' && <Tent className="w-3 h-3" />}
                          {grp === 'van_nghe' && <Music className="w-3 h-3" />}
                          {grp === 'nghi_thuc_doi' && <Flag className="w-3 h-3" />}
                          <span>{MAJOR_GROUPS[grp].shortTitle}</span>
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {CATEGORY_NAMES[item.category]}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center text-slate-600 text-xs">
                      {item.unit}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-xs">
                      <input
                        type="number"
                        min="0"
                        step="1000"
                        value={item.unitPrice}
                        onChange={(e) => handlePriceChange(item.id, Number(e.target.value))}
                        className="w-24 text-right bg-transparent hover:bg-white focus:bg-white border border-transparent hover:border-slate-300 focus:border-emerald-500 rounded px-1.5 py-0.5 font-mono text-xs focus:outline-none"
                      />
                    </td>
                    <td className="py-3 px-3 text-center font-mono text-xs">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item.id, Number(e.target.value))}
                        className="w-14 text-center bg-transparent hover:bg-white focus:bg-white border border-transparent hover:border-slate-300 focus:border-emerald-500 rounded px-1 py-0.5 font-mono text-xs focus:outline-none"
                      />
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-emerald-600">
                      {item.total.toLocaleString('vi-VN')}đ
                    </td>
                    <td className="py-3 px-3 text-center text-[11px]">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium border border-slate-200">
                        {FUNDING_NAMES[item.fundingSource] || item.fundingSource}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => handleTogglePaid(item.id)}
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase transition-colors cursor-pointer ${
                          item.isPaid
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                        }`}
                      >
                        {item.isPaid ? 'ĐÃ CHI' : 'CHƯA CHI'}
                      </button>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleStartEdit(item)}
                          className="text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 p-1.5 rounded-lg transition-colors cursor-pointer"
                          title="Sửa thông tin hạng mục"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteItem(item.id)}
                          className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 p-1.5 rounded-lg transition-colors cursor-pointer"
                          title="Xóa mục này"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Total Summary Footer Bar */}
        <div className="h-14 bg-slate-900 text-white flex items-center justify-between px-6 sm:px-8 text-sm font-bold uppercase tracking-wider shrink-0">
          <div className="flex items-center gap-3">
            <span>
              {selectedGroup === 'all' ? 'Tổng Dự Toán Toàn Đội' : `Tổng ${MAJOR_GROUPS[selectedGroup].title}`}
            </span>
            <span className="text-xs font-normal text-slate-400 lowercase hidden md:inline">
              (Đã chi: {totalPaid.toLocaleString('vi-VN')} đ • Còn lại: {totalPending.toLocaleString('vi-VN')} đ)
            </span>
          </div>
          <span className="text-xl font-mono text-amber-400">
            {(selectedGroup === 'all' ? totalBudget : groupStats[selectedGroup].total).toLocaleString('vi-VN')} VNĐ
          </span>
        </div>
      </div>

      {/* Modal Chỉnh Sửa Thông Tin Hạng Mục Chi */}
      {editingItem && (
        <EditBudgetItemModal
          item={editingItem}
          onClose={() => setEditingItem(null)}
          onSave={handleSaveEditItem}
          onDelete={handleDeleteItem}
        />
      )}
    </div>
  );
};

// =========================================================================
// SUBCOMPONENT: EDIT BUDGET ITEM MODAL
// =========================================================================
interface EditBudgetItemModalProps {
  item: BudgetItem;
  onClose: () => void;
  onSave: (updatedItem: BudgetItem) => void;
  onDelete: (id: string) => void;
}

const EditBudgetItemModal: React.FC<EditBudgetItemModalProps> = ({
  item,
  onClose,
  onSave,
  onDelete,
}) => {
  const [name, setName] = useState(item.name);
  const [note, setNote] = useState(item.note || '');
  const [group, setGroup] = useState<MajorGroup>(item.group || getCategoryMajorGroup(item.category));
  const [category, setCategory] = useState<MaterialCategory>(item.category);
  const [unit, setUnit] = useState(item.unit);
  const [unitPrice, setUnitPrice] = useState<number>(item.unitPrice);
  const [quantity, setQuantity] = useState<number>(item.quantity);
  const [fundingSource, setFundingSource] = useState<FundingSource>((item.fundingSource as FundingSource) || 'chi_doan');
  const [isPaid, setIsPaid] = useState<boolean>(item.isPaid);

  const handleGroupChange = (newGroup: MajorGroup) => {
    setGroup(newGroup);
    const availableCategories = MAJOR_GROUPS[newGroup].categories;
    if (!availableCategories.includes(category)) {
      setCategory(availableCategories[0]);
    }
  };

  const calculatedTotal = (Number(unitPrice) || 0) * (Number(quantity) || 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      ...item,
      name: name.trim(),
      note: note.trim() || undefined,
      group,
      category,
      unit: unit.trim() || 'Cái',
      unitPrice: Number(unitPrice) || 0,
      quantity: Number(quantity) || 1,
      total: calculatedTotal,
      fundingSource,
      isPaid,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700">
              <Edit2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Sửa Thông Tin Hạng Mục Chi</h3>
              <p className="text-xs text-slate-500">Cập nhật đơn giá, số lượng, nguồn kinh phí hoặc phân bổ</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Tên hạng mục / vật tư <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VD: Tre, luồng dựng cổng, trang phục biểu diễn..."
              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none font-medium text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Ghi chú kỹ thuật / Chi tiết
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="VD: Quy cách kích thước, yêu cầu sơn bóng, xuất xứ..."
              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none text-slate-700"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Phân thuộc (3 phần chính):
              </label>
              <select
                value={group}
                onChange={(e) => handleGroupChange(e.target.value as MajorGroup)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none font-semibold text-slate-900 cursor-pointer"
              >
                <option value="cam_trai">1. Cắm Trại & Mặt Bằng</option>
                <option value="van_nghe">2. Văn Nghệ (Hát Múa 14 Em)</option>
                <option value="nghi_thuc_doi">3. Nghi Thức Đội (Trống Cờ)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nhóm chi tiết:
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as MaterialCategory)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none text-slate-900 cursor-pointer"
              >
                {MAJOR_GROUPS[group].categories.map((catKey) => (
                  <option key={catKey} value={catKey}>
                    {CATEGORY_NAMES[catKey]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Đơn vị tính (ĐVT):</label>
              <input
                type="text"
                required
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="Cây, Bộ, Cái..."
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none text-center"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Đơn giá (VNĐ):</label>
              <input
                type="number"
                min="0"
                step="1000"
                value={unitPrice}
                onChange={(e) => setUnitPrice(Number(e.target.value))}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none font-mono text-right"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Số lượng:</label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none font-mono text-center"
              />
            </div>
          </div>

          {/* Thành tiền preview banner */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600">Thành Tiền Dự Kiến:</span>
            <span className="text-base font-black font-mono text-emerald-600">
              {calculatedTotal.toLocaleString('vi-VN')} <span className="text-xs font-normal">đ</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nguồn kinh phí chi trả:</label>
              <select
                value={fundingSource}
                onChange={(e) => setFundingSource(e.target.value as FundingSource)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none cursor-pointer"
              >
                <option value="chi_doan">Quỹ Chi đoàn thanh niên</option>
                <option value="xom">Hỗ trợ từ xóm</option>
                <option value="xa_doan">Hỗ trợ từ Đoàn xã</option>
                <option value="phu_huynh">Đóng góp Hội phụ huynh</option>
                <option value="tai_tro">Nhà hảo tâm tài trợ</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Trạng thái chi trả:</label>
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsPaid(!isPaid)}
                  className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    isPaid
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-2xs'
                      : 'bg-amber-100 text-amber-800 border border-amber-300 shadow-2xs'
                  }`}
                >
                  <CheckCircle2 className={`w-4 h-4 ${isPaid ? 'text-emerald-600' : 'text-amber-600'}`} />
                  <span>{isPaid ? 'ĐÃ CHI (ĐÃ THANH TOÁN)' : 'CHƯA CHI (DỰ TOÁN)'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                onDelete(item.id);
                onClose();
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>Xóa Hạng Mục</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-xs cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Lưu Thay Đổi</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
