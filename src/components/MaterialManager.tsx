import React, { useState, useMemo } from 'react';
import { 
  PackageCheck, 
  Plus, 
  Search, 
  Filter, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  UserCheck, 
  Trash2, 
  Edit, 
  Download, 
  Check, 
  X,
  FileCheck2,
  Tent,
  Music,
  Flag,
  Sparkles,
  Layers
} from 'lucide-react';
import { 
  MaterialItem, 
  MaterialCategory, 
  MaterialStatus, 
  MaterialSource,
  MajorGroup,
  MAJOR_GROUPS,
  getCategoryMajorGroup
} from '../types/camp';

interface MaterialManagerProps {
  materials: MaterialItem[];
  onUpdateMaterials: (newMaterials: MaterialItem[]) => void;
  initialGroupFilter?: MajorGroup | 'all';
}

const CATEGORY_LABELS: Record<MaterialCategory, string> = {
  gate: 'Cổng trại & Hoành phi',
  tent_structure: 'Khung cọc mái lều',
  interior_ceremony: 'Ban thờ Bác & Nghi lễ',
  study_corner: 'Góc học tập & Khẩu hiệu',
  pioneer_gear: 'Thiết bị nghi thức Đội',
  performance: 'Đạo cụ & Trang phục văn nghệ',
  logistics_feasting: 'Ánh sáng, Hậu cần & Phá cỗ',
};

const SOURCE_LABELS: Record<MaterialSource, { text: string; bg: string }> = {
  buy: { text: 'MUA MỚI', bg: 'bg-amber-100 text-amber-700' },
  borrow: { text: 'ĐI MƯỢN', bg: 'bg-blue-100 text-blue-700' },
  available: { text: 'SẴN CÓ', bg: 'bg-emerald-100 text-emerald-700' },
  craft: { text: 'THỦ CÔNG', bg: 'bg-purple-100 text-purple-700' },
};

const STATUS_LABELS: Record<MaterialStatus, { text: string; color: string; bg: string }> = {
  pending: { text: 'CHƯA CÓ', color: 'text-rose-700', bg: 'bg-rose-50 border-rose-200' },
  in_progress: { text: 'ĐANG LÀM', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' },
  completed: { text: 'SẴN SÀNG', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
};

export const MaterialManager: React.FC<MaterialManagerProps> = ({
  materials,
  onUpdateMaterials,
  initialGroupFilter = 'all'
}) => {
  const [selectedGroup, setSelectedGroup] = useState<MajorGroup | 'all'>(initialGroupFilter);

  // Sync with prop when parent changes pillar
  React.useEffect(() => {
    setSelectedGroup(initialGroupFilter);
  }, [initialGroupFilter]);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [formName, setFormName] = useState('');
  const [formGroup, setFormGroup] = useState<MajorGroup>('cam_trai');
  const [formCategory, setFormCategory] = useState<MaterialCategory>('gate');
  const [formSpec, setFormSpec] = useState('');
  const [formUnit, setFormUnit] = useState('Cái');
  const [formQtyNeeded, setFormQtyNeeded] = useState<number>(1);
  const [formQtyReady, setFormQtyReady] = useState<number>(0);
  const [formSource, setFormSource] = useState<MaterialSource>('craft');
  const [formAssignee, setFormAssignee] = useState('Chi đoàn thanh niên');
  const [formNotes, setFormNotes] = useState('');

  // 3 Major Parts Statistics
  const groupStats = useMemo(() => {
    const stats: Record<MajorGroup, {
      items: MaterialItem[];
      ready: number;
      total: number;
      verified: number;
    }> = {
      cam_trai: { items: [], ready: 0, total: 0, verified: 0 },
      van_nghe: { items: [], ready: 0, total: 0, verified: 0 },
      nghi_thuc_doi: { items: [], ready: 0, total: 0, verified: 0 },
    };

    materials.forEach((item) => {
      const g = item.group || getCategoryMajorGroup(item.category);
      if (stats[g]) {
        stats[g].items.push(item);
        stats[g].total += 1;
        if (item.status === 'completed') stats[g].ready += 1;
        if (item.verified) stats[g].verified += 1;
      }
    });

    return stats;
  }, [materials]);

  // Overall Calculations
  const totalItems = materials.length;
  const completedItems = materials.filter((m) => m.status === 'completed').length;
  const progressPercent = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
  const verifiedCount = materials.filter((m) => m.verified).length;

  // Filtered List
  const filteredMaterials = useMemo(() => {
    return materials.filter((item) => {
      const g = item.group || getCategoryMajorGroup(item.category);
      if (selectedGroup !== 'all' && g !== selectedGroup) return false;

      const matchesQuery = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.specification.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.assignee.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;
      return matchesQuery && matchesCategory && matchesStatus;
    });
  }, [materials, selectedGroup, searchQuery, selectedCategory, selectedStatus]);

  const handleToggleVerified = (id: string) => {
    const updated = materials.map((m) => {
      if (m.id === id) {
        return { ...m, verified: !m.verified };
      }
      return m;
    });
    onUpdateMaterials(updated);
  };

  const handleStatusChange = (id: string, status: MaterialStatus) => {
    const updated = materials.map((m) => {
      if (m.id === id) {
        const quantityReady = status === 'completed' ? m.quantityNeeded : (status === 'pending' ? 0 : m.quantityReady);
        return { ...m, status, quantityReady };
      }
      return m;
    });
    onUpdateMaterials(updated);
  };

  const handleDelete = (id: string) => {
    onUpdateMaterials(materials.filter((m) => m.id !== id));
  };

  const handleGroupChangeInForm = (g: MajorGroup) => {
    setFormGroup(g);
    setFormCategory(MAJOR_GROUPS[g].categories[0]);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (editingId) {
      // update existing
      const updated = materials.map((m) => {
        if (m.id === editingId) {
          const status: MaterialStatus = formQtyReady >= formQtyNeeded ? 'completed' : (formQtyReady > 0 ? 'in_progress' : 'pending');
          return {
            ...m,
            name: formName,
            group: formGroup,
            category: formCategory,
            specification: formSpec,
            unit: formUnit,
            quantityNeeded: Number(formQtyNeeded),
            quantityReady: Number(formQtyReady),
            source: formSource,
            assignee: formAssignee,
            status,
            notes: formNotes,
          };
        }
        return m;
      });
      onUpdateMaterials(updated);
      setEditingId(null);
    } else {
      // create new
      const status: MaterialStatus = formQtyReady >= formQtyNeeded ? 'completed' : (formQtyReady > 0 ? 'in_progress' : 'pending');
      const newItem: MaterialItem = {
        id: `mat_${Date.now()}`,
        name: formName,
        group: formGroup,
        category: formCategory,
        specification: formSpec,
        unit: formUnit,
        quantityNeeded: Number(formQtyNeeded),
        quantityReady: Number(formQtyReady),
        estimatedCost: 50000,
        source: formSource,
        status,
        assignee: formAssignee,
        verified: false,
        notes: formNotes,
      };
      onUpdateMaterials([...materials, newItem]);
    }

    // Reset form
    setFormName('');
    setFormSpec('');
    setFormNotes('');
    setIsAdding(false);
  };

  const handleStartEdit = (item: MaterialItem) => {
    setEditingId(item.id);
    setFormName(item.name);
    const grp = item.group || getCategoryMajorGroup(item.category);
    setFormGroup(grp);
    setFormCategory(item.category);
    setFormSpec(item.specification);
    setFormUnit(item.unit);
    setFormQtyNeeded(item.quantityNeeded);
    setFormQtyReady(item.quantityReady);
    setFormSource(item.source);
    setFormAssignee(item.assignee);
    setFormNotes(item.notes || '');
    setIsAdding(true);
  };

  const handleExportCsv = () => {
    const headers = ['STT', 'Tên vật tư', 'Phân hệ (3 Phần)', 'Nhóm', 'Quy cách kỹ thuật', 'ĐVT', 'SL Cần', 'SL Đã có', 'Nguồn', 'Người phụ trách', 'Trạng thái', 'Nghiệm thu'];
    const rows = materials.map((m, i) => {
      const grp = m.group || getCategoryMajorGroup(m.category);
      return [
        i + 1,
        `"${m.name.replace(/"/g, '""')}"`,
        `"${MAJOR_GROUPS[grp].shortTitle}"`,
        `"${CATEGORY_LABELS[m.category]}"`,
        `"${m.specification.replace(/"/g, '""')}"`,
        m.unit,
        m.quantityNeeded,
        m.quantityReady,
        SOURCE_LABELS[m.source].text,
        `"${m.assignee}"`,
        STATUS_LABELS[m.status].text,
        m.verified ? 'Đạt chuẩn' : 'Chưa duyệt',
      ];
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `kho_vat_tu_3_phan_hoi_trai_hai_anh_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="material-manager-root" className="space-y-6">
      {/* 3 MAJOR PILLARS HEADER TABS */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-600" />
              <span>Phân Hệ Vật Tư (3 Phần):</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            <button
              id="btn-material-group-all"
              onClick={() => {
                setSelectedGroup('all');
                setSelectedCategory('all');
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                selectedGroup === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Tất Cả ({materials.length})</span>
            </button>

            <button
              id="btn-material-group-cam-trai"
              onClick={() => {
                setSelectedGroup('cam_trai');
                setSelectedCategory('all');
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                selectedGroup === 'cam_trai'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
              }`}
            >
              <Tent className="w-3.5 h-3.5" />
              <span>1. CẮM TRẠI ({groupStats.cam_trai.total})</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                selectedGroup === 'cam_trai' ? 'bg-emerald-700 text-white' : 'bg-emerald-200 text-emerald-900'
              }`}>
                {groupStats.cam_trai.ready}/{groupStats.cam_trai.total}
              </span>
            </button>

            <button
              id="btn-material-group-van-nghe"
              onClick={() => {
                setSelectedGroup('van_nghe');
                setSelectedCategory('all');
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                selectedGroup === 'van_nghe'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-indigo-50 text-indigo-800 hover:bg-indigo-100 border border-indigo-200'
              }`}
            >
              <Music className="w-3.5 h-3.5" />
              <span>2. VĂN NGHỆ ({groupStats.van_nghe.total})</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                selectedGroup === 'van_nghe' ? 'bg-indigo-700 text-white' : 'bg-indigo-200 text-indigo-900'
              }`}>
                {groupStats.van_nghe.ready}/{groupStats.van_nghe.total}
              </span>
            </button>

            <button
              id="btn-material-group-nghi-thuc"
              onClick={() => {
                setSelectedGroup('nghi_thuc_doi');
                setSelectedCategory('all');
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                selectedGroup === 'nghi_thuc_doi'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200'
              }`}
            >
              <Flag className="w-3.5 h-3.5" />
              <span>3. NGHI THỨC ĐỘI ({groupStats.nghi_thuc_doi.total})</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                selectedGroup === 'nghi_thuc_doi' ? 'bg-amber-700 text-white' : 'bg-amber-200 text-amber-950'
              }`}>
                {groupStats.nghi_thuc_doi.ready}/{groupStats.nghi_thuc_doi.total}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* 3 MAJOR PILLARS PROGRESS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Pillar 1 */}
        <div 
          onClick={() => {
            setSelectedGroup('cam_trai');
            setSelectedCategory('all');
          }}
          className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-sm ${
            selectedGroup === 'cam_trai'
              ? 'bg-emerald-50/70 border-emerald-500 ring-2 ring-emerald-500/20'
              : 'bg-white border-slate-200 hover:border-emerald-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <Tent className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase">1. Vật Tư Cắm Trại</h4>
                <p className="text-[11px] text-slate-500">Cổng, khung bạt, ban thờ & đèn rọi</p>
              </div>
            </div>
            <span className="text-xs font-bold font-mono text-emerald-700">
              {groupStats.cam_trai.ready}/{groupStats.cam_trai.total}
            </span>
          </div>

          <div className="mt-3">
            <div className="flex items-center justify-between text-[11px] text-slate-600 mb-1">
              <span>Sẵn sàng thực địa</span>
              <span className="font-bold text-emerald-700">
                {groupStats.cam_trai.total > 0 ? Math.round((groupStats.cam_trai.ready / groupStats.cam_trai.total) * 100) : 0}%
              </span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-emerald-600 h-full rounded-full transition-all"
                style={{ width: `${groupStats.cam_trai.total > 0 ? (groupStats.cam_trai.ready / groupStats.cam_trai.total) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>

        {/* Pillar 2 */}
        <div 
          onClick={() => {
            setSelectedGroup('van_nghe');
            setSelectedCategory('all');
          }}
          className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-sm ${
            selectedGroup === 'van_nghe'
              ? 'bg-indigo-50/70 border-indigo-500 ring-2 ring-indigo-500/20'
              : 'bg-white border-slate-200 hover:border-indigo-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                <Music className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase">2. Đạo Cụ Văn Nghệ</h4>
                <p className="text-[11px] text-slate-500">14 Em, đèn hoa sen, lụa, phục trang</p>
              </div>
            </div>
            <span className="text-xs font-bold font-mono text-indigo-700">
              {groupStats.van_nghe.ready}/{groupStats.van_nghe.total}
            </span>
          </div>

          <div className="mt-3">
            <div className="flex items-center justify-between text-[11px] text-slate-600 mb-1">
              <span>Sẵn sàng sàn diễn</span>
              <span className="font-bold text-indigo-700">
                {groupStats.van_nghe.total > 0 ? Math.round((groupStats.van_nghe.ready / groupStats.van_nghe.total) * 100) : 0}%
              </span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-indigo-600 h-full rounded-full transition-all"
                style={{ width: `${groupStats.van_nghe.total > 0 ? (groupStats.van_nghe.ready / groupStats.van_nghe.total) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>

        {/* Pillar 3 */}
        <div 
          onClick={() => {
            setSelectedGroup('nghi_thuc_doi');
            setSelectedCategory('all');
          }}
          className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-sm ${
            selectedGroup === 'nghi_thuc_doi'
              ? 'bg-amber-50/70 border-amber-500 ring-2 ring-amber-500/20'
              : 'bg-white border-slate-200 hover:border-amber-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                <Flag className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase">3. Nghi Thức Đội</h4>
                <p className="text-[11px] text-slate-500">Bộ trống Đội, cờ, khăn quàng & góc học tập</p>
              </div>
            </div>
            <span className="text-xs font-bold font-mono text-amber-800">
              {groupStats.nghi_thuc_doi.ready}/{groupStats.nghi_thuc_doi.total}
            </span>
          </div>

          <div className="mt-3">
            <div className="flex items-center justify-between text-[11px] text-slate-600 mb-1">
              <span>Sẵn sàng duyệt đội</span>
              <span className="font-bold text-amber-800">
                {groupStats.nghi_thuc_doi.total > 0 ? Math.round((groupStats.nghi_thuc_doi.ready / groupStats.nghi_thuc_doi.total) * 100) : 0}%
              </span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-amber-600 h-full rounded-full transition-all"
                style={{ width: `${groupStats.nghi_thuc_doi.total > 0 ? (groupStats.nghi_thuc_doi.ready / groupStats.nghi_thuc_doi.total) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Progress & Overview Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900">
              Tiến Độ Nghiệm Thu Vật Tư Hội Trại
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
              {completedItems}/{totalItems} vật tư hoàn tất
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Đã nghiệm thu đạt chuẩn kỹ thuật Hải Anh: <strong className="text-emerald-700">{verifiedCount}/{totalItems} mục</strong>
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            id="btn-export-material-csv"
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors shadow-2xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Xuất CSV (3 Phần)</span>
          </button>
          <button
            id="btn-add-material-item"
            onClick={() => {
              setEditingId(null);
              setFormName('');
              setFormSpec('');
              setFormNotes('');
              if (selectedGroup !== 'all') {
                setFormGroup(selectedGroup);
                setFormCategory(MAJOR_GROUPS[selectedGroup].categories[0]);
              }
              setIsAdding(!isAdding);
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Vật Tư Mới</span>
          </button>
        </div>
      </div>

      {/* Add / Edit Material Form */}
      {isAdding && (
        <form onSubmit={handleSaveItem} className="bg-emerald-50/40 p-5 rounded-2xl border border-emerald-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-emerald-100 pb-2">
            <h4 className="text-xs font-bold text-emerald-900 uppercase">
              {editingId ? 'Chỉnh Sửa Vật Tư Kỹ Thuật:' : 'Thêm Vật Tư Mới Vào Danh Sách:'}
            </h4>
            <button 
              type="button" 
              onClick={() => setIsAdding(false)} 
              className="text-slate-400 hover:text-slate-700 text-xs cursor-pointer"
            >
              ✕ Đóng
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Tên vật tư kỹ thuật:
              </label>
              <input
                type="text"
                required
                placeholder="VD: Cây tre đực thẳng, Dải lụa múa, Bộ dùi trống..."
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Phân hệ (3 Phần):
              </label>
              <select
                value={formGroup}
                onChange={(e) => handleGroupChangeInForm(e.target.value as MajorGroup)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none font-bold text-slate-900"
              >
                <option value="cam_trai">1. Cắm Trại</option>
                <option value="van_nghe">2. Văn Nghệ</option>
                <option value="nghi_thuc_doi">3. Nghi Thức Đội</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Nhóm chi tiết:
              </label>
              <select
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value as MaterialCategory)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              >
                {MAJOR_GROUPS[formGroup].categories.map((cat) => (
                  <option key={cat} value={cat}>{CATEGORY_LABELS[cat]}</option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Quy cách kỹ thuật chuẩn Hải Anh:
              </label>
              <input
                type="text"
                placeholder="VD: Dài 3.5m, đk 8cm, hoặc vải phi bóng..."
                value={formSpec}
                onChange={(e) => setFormSpec(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Đơn vị tính:
              </label>
              <input
                type="text"
                value={formUnit}
                onChange={(e) => setFormUnit(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Nguồn vật tư:
              </label>
              <select
                value={formSource}
                onChange={(e) => setFormSource(e.target.value as MaterialSource)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="available">Sẵn có trong chi đoàn/đội viên</option>
                <option value="borrow">Đi mượn (trường học / gia đình)</option>
                <option value="craft">Tự làm thủ công (Nữ công/Đội viên)</option>
                <option value="buy">Mua mới từ kinh phí</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Số lượng cần:
              </label>
              <input
                type="number"
                min="1"
                value={formQtyNeeded}
                onChange={(e) => setFormQtyNeeded(Number(e.target.value))}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Số lượng đã có:
              </label>
              <input
                type="number"
                min="0"
                value={formQtyReady}
                onChange={(e) => setFormQtyReady(Number(e.target.value))}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none font-mono"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Người phụ trách / Đơn vị:
              </label>
              <input
                type="text"
                placeholder="VD: Đ/c Tuấn (Bí thư Chi đoàn)..."
                value={formAssignee}
                onChange={(e) => setFormAssignee(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 rounded-xl border border-slate-300 text-slate-600 text-xs hover:bg-slate-100 cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm cursor-pointer"
            >
              {editingId ? 'Cập Nhật Vật Tư' : 'Thêm Vào Danh Sách'}
            </button>
          </div>
        </form>
      )}

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            id="search-materials-input"
            type="text"
            placeholder="Tìm theo tên vật tư, quy cách, người phụ trách..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center flex-wrap gap-2 w-full sm:w-auto justify-end">
          {/* Filter Category */}
          <select
            id="filter-materials-category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 shadow-2xs"
          >
            <option value="all">
              {selectedGroup === 'all' ? 'Tất cả nhóm vật tư' : 'Tất cả nhóm trong phần này'}
            </option>
            {Object.entries(CATEGORY_LABELS)
              .filter(([cat]) => {
                if (selectedGroup === 'all') return true;
                return MAJOR_GROUPS[selectedGroup].categories.includes(cat as MaterialCategory);
              })
              .map(([cat, label]) => (
                <option key={cat} value={cat}>{label}</option>
              ))}
          </select>

          {/* Filter Status */}
          <select
            id="filter-materials-status"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 shadow-2xs"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="completed">Đã sẵn sàng</option>
            <option value="in_progress">Đang làm/Đang mua</option>
            <option value="pending">Chưa chuẩn bị</option>
          </select>
        </div>
      </div>

      {/* Materials Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[11px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4 w-12 text-center">STT</th>
                <th className="py-3.5 px-4">Tên Vật Tư & Quy Cách Kỹ Thuật</th>
                <th className="py-3.5 px-3">Phân Hệ (3 Phần)</th>
                <th className="py-3.5 px-3 text-center">ĐVT</th>
                <th className="py-3.5 px-3 text-center">SL Cần / Có</th>
                <th className="py-3.5 px-3 text-center">Nguồn</th>
                <th className="py-3.5 px-3">Người Phụ Trách</th>
                <th className="py-3.5 px-3 text-center">Trạng Thái</th>
                <th className="py-3.5 px-3 text-center">Nghiệm Thu</th>
                <th className="py-3.5 px-3 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMaterials.map((item, index) => {
                const grp = item.group || getCategoryMajorGroup(item.category);
                const src = SOURCE_LABELS[item.source];
                const isFull = item.quantityReady >= item.quantityNeeded;

                return (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 text-center font-mono text-slate-400">
                      {index + 1}
                    </td>
                    <td className="py-3 px-4 max-w-sm">
                      <p className="font-bold text-slate-900">{item.name}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed font-sans">
                        <strong className="text-slate-700">Quy cách:</strong> {item.specification}
                      </p>
                      {item.notes && (
                        <p className="text-[10px] text-emerald-800 bg-emerald-50 rounded px-1.5 py-0.5 mt-1 inline-block border border-emerald-100">
                          {item.notes}
                        </p>
                      )}
                    </td>
                    <td className="py-3 px-3 text-xs">
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
                        <span className="text-[10px] text-slate-500">
                          {CATEGORY_LABELS[item.category]}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center text-slate-600">
                      {item.unit}
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-semibold">
                      <span className={isFull ? 'text-emerald-600 font-bold' : 'text-amber-600'}>
                        {item.quantityReady}
                      </span>
                      <span className="text-slate-400"> / </span>
                      <span className="text-slate-900">{item.quantityNeeded}</span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${src.bg}`}>
                        {src.text}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[11px] font-medium text-slate-800">
                      {item.assignee}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <select
                        value={item.status}
                        onChange={(e) => handleStatusChange(item.id, e.target.value as MaterialStatus)}
                        className={`text-[10px] font-bold rounded-full px-2.5 py-1 border-0 focus:outline-none cursor-pointer ${
                          item.status === 'completed'
                            ? 'bg-emerald-100 text-emerald-700'
                            : item.status === 'in_progress'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-rose-100 text-rose-700'
                        }`}
                      >
                        <option value="pending">CHƯA CÓ</option>
                        <option value="in_progress">ĐANG LÀM</option>
                        <option value="completed">SẴN SÀNG</option>
                      </select>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => handleToggleVerified(item.id)}
                        className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                          item.verified
                            ? 'bg-emerald-100 border-emerald-300 text-emerald-700'
                            : 'bg-slate-100 border-slate-200 text-slate-400 hover:text-slate-600'
                        }`}
                        title={item.verified ? "Đã nghiệm thu đạt chuẩn thang điểm" : "Bấm để nghiệm thu chuẩn quy định"}
                      >
                        <FileCheck2 className="w-4 h-4" />
                      </button>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleStartEdit(item)}
                          className="text-slate-400 hover:text-emerald-600 p-1 rounded cursor-pointer"
                          title="Sửa"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-slate-400 hover:text-rose-600 p-1 rounded cursor-pointer"
                          title="Xóa"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
