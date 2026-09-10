import React, { useState, useMemo } from 'react';
import {
  Users,
  User,
  Edit2,
  Trash2,
  Plus,
  Search,
  X,
  Check,
  Phone,
  Briefcase,
  Tent,
  Music,
  Flag,
  HeartHandshake,
  CheckCircle2,
  Sparkles,
  Layers,
  FileText
} from 'lucide-react';
import { TeamMember, CampTask, TaskDepartment } from '../types/camp';

interface TeamRosterModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamMembers: TeamMember[];
  tasks: CampTask[];
  teamName: string;
  onUpdateTeamName: (name: string) => void;
  onSaveMember: (member: TeamMember) => void;
  onUpdateMemberName: (memberId: string, newName: string) => void;
  onDeleteMember: (memberId: string) => void;
}

export const TeamRosterModal: React.FC<TeamRosterModalProps> = ({
  isOpen,
  onClose,
  teamMembers,
  tasks,
  teamName,
  onUpdateTeamName,
  onSaveMember,
  onUpdateMemberName,
  onDeleteMember,
}) => {
  // Team name edit state
  const [isEditingTeamName, setIsEditingTeamName] = useState<boolean>(false);
  const [tempTeamName, setTempTeamName] = useState<string>(teamName);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [deptFilter, setDeptFilter] = useState<TaskDepartment | 'all'>('all');

  // Quick inline name editing for specific member
  const [inlineEditingMemberId, setInlineEditingMemberId] = useState<string | null>(null);
  const [tempMemberName, setTempMemberName] = useState<string>('');

  // Full member edit modal / sub-view
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);

  // Success toast notification message
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  const deptConfig: Record<TaskDepartment, { label: string; icon: any; bgLight: string; textDark: string; border: string }> = {
    cam_trai: {
      label: '1. Cắm Trại & Cổng (70đ)',
      icon: Tent,
      bgLight: 'bg-emerald-50',
      textDark: 'text-emerald-800',
      border: 'border-emerald-200',
    },
    van_nghe: {
      label: '2. Văn Nghệ 14 Em (20đ)',
      icon: Music,
      bgLight: 'bg-indigo-50',
      textDark: 'text-indigo-800',
      border: 'border-indigo-200',
    },
    nghi_thuc_doi: {
      label: '3. Nghi Thức & Trống Cờ (20đ)',
      icon: Flag,
      bgLight: 'bg-amber-50',
      textDark: 'text-amber-900',
      border: 'border-amber-200',
    },
    hau_can: {
      label: '4. Hậu Cần & Y Tế',
      icon: HeartHandshake,
      bgLight: 'bg-rose-50',
      textDark: 'text-rose-800',
      border: 'border-rose-200',
    },
  };

  const filteredMembers = useMemo(() => {
    return teamMembers.filter(member => {
      if (deptFilter !== 'all' && member.department !== deptFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = member.name.toLowerCase().includes(q);
        const matchRole = member.role.toLowerCase().includes(q);
        const matchPhone = member.phone?.toLowerCase().includes(q) || false;
        if (!matchName && !matchRole && !matchPhone) return false;
      }
      return true;
    });
  }, [teamMembers, deptFilter, searchQuery]);

  if (!isOpen) return null;

  // Handle Team Name Save
  const handleSaveTeamName = () => {
    if (tempTeamName.trim()) {
      onUpdateTeamName(tempTeamName.trim());
      setIsEditingTeamName(false);
      showNotification('Đã cập nhật tên đội ngũ thành công!');
    }
  };

  // Handle Inline Member Name Save
  const handleStartInlineEdit = (member: TeamMember) => {
    setInlineEditingMemberId(member.id);
    setTempMemberName(member.name);
  };

  const handleSaveInlineMemberName = (memberId: string) => {
    if (tempMemberName.trim()) {
      onUpdateMemberName(memberId, tempMemberName.trim());
      setInlineEditingMemberId(null);
      showNotification(`Đã đổi tên thành công: "${tempMemberName.trim()}"!`);
    }
  };

  const handleCancelInlineEdit = () => {
    setInlineEditingMemberId(null);
    setTempMemberName('');
  };

  // Open Full Member Edit Form
  const handleOpenAddMember = () => {
    setEditingMember(null);
    setIsFormOpen(true);
  };

  const handleOpenEditMember = (member: TeamMember) => {
    setEditingMember(member);
    setIsFormOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">
                  Quản Lý Đội Ngũ Nhân Sự
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                  {teamMembers.length} thành viên
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Xem danh sách, sửa tên đội ngũ, cập nhật thông tin thành viên và tự động đồng bộ phân công nhiệm vụ.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
            title="Đóng cửa sổ"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Toast */}
        {successToast && (
          <div className="bg-emerald-600 text-white px-4 py-2.5 text-xs font-semibold flex items-center justify-between transition-all animate-fadeIn">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-200" />
              <span>{successToast}</span>
            </div>
            <button onClick={() => setSuccessToast(null)} className="text-white/80 hover:text-white cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          
          {/* SECTION 1: TEAM NAME EDITING BANNER */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-emerald-950 text-white p-4 sm:p-5 rounded-2xl shadow-xs border border-slate-700/50">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] uppercase tracking-wider font-bold text-emerald-400 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Tên Đội Ngũ / Đơn Vị Thi Đua
                  </span>
                </div>

                {isEditingTeamName ? (
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="text"
                      value={tempTeamName}
                      onChange={e => setTempTeamName(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') handleSaveTeamName();
                        if (e.key === 'Escape') setIsEditingTeamName(false);
                      }}
                      autoFocus
                      placeholder="Nhập tên đội ngũ..."
                      className="flex-1 px-3 py-1.5 rounded-xl bg-white text-slate-900 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    />
                    <button
                      onClick={handleSaveTeamName}
                      className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                      <span>Lưu</span>
                    </button>
                    <button
                      onClick={() => setIsEditingTeamName(false)}
                      className="px-3 py-1.5 bg-white/15 hover:bg-white/25 text-white rounded-xl text-xs font-semibold transition-all cursor-pointer"
                    >
                      Hủy
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2.5 mt-1 flex-wrap">
                    <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
                      {teamName}
                    </h2>
                    <button
                      onClick={() => {
                        setTempTeamName(teamName);
                        setIsEditingTeamName(true);
                      }}
                      className="flex items-center gap-1 px-2.5 py-1 bg-white/15 hover:bg-white/25 text-emerald-200 hover:text-white rounded-lg text-xs font-semibold transition-all cursor-pointer"
                      title="Bấm để chỉnh sửa tên đội ngũ"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Sửa Tên Đội</span>
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={handleOpenAddMember}
                className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs transition-all shadow-sm shrink-0 cursor-pointer self-start sm:self-center"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm Thành Viên Mới</span>
              </button>
            </div>
          </div>

          {/* SECTION 2: SEARCH & FILTER STRIP */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm thành viên theo tên, chức vụ, số điện thoại..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Department Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1 sm:pb-0">
              <button
                onClick={() => setDeptFilter('all')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
                  deptFilter === 'all'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Tất cả ({teamMembers.length})
              </button>
              <button
                onClick={() => setDeptFilter('cam_trai')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
                  deptFilter === 'cam_trai'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                }`}
              >
                Cắm trại
              </button>
              <button
                onClick={() => setDeptFilter('van_nghe')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
                  deptFilter === 'van_nghe'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-indigo-50 text-indigo-800 hover:bg-indigo-100 border border-indigo-200'
                }`}
              >
                Văn nghệ
              </button>
              <button
                onClick={() => setDeptFilter('nghi_thuc_doi')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
                  deptFilter === 'nghi_thuc_doi'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200'
                }`}
              >
                Nghi thức
              </button>
              <button
                onClick={() => setDeptFilter('hau_can')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
                  deptFilter === 'hau_can'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200'
                }`}
              >
                Hậu cần
              </button>
            </div>
          </div>

          {/* SECTION 3: MEMBERS LIST */}
          <div className="space-y-3">
            {filteredMembers.length === 0 ? (
              <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <Users className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-700">Không tìm thấy thành viên nào phù hợp</p>
                <p className="text-xs text-slate-500 mt-1">Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc mảng</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {filteredMembers.map((member, idx) => {
                  const dept = deptConfig[member.department];
                  const DeptIcon = dept.icon;
                  const memberTasks = tasks.filter(t => t.assigneeId === member.id || t.assigneeName === member.name);
                  const completedTasksCount = memberTasks.filter(t => t.status === 'completed').length;
                  const isInlineEditing = inlineEditingMemberId === member.id;

                  return (
                    <div
                      key={member.id}
                      className="bg-white rounded-2xl border border-slate-200 p-4 hover:border-emerald-300 hover:shadow-xs transition-all flex flex-col justify-between space-y-3 relative group"
                    >
                      <div>
                        {/* Top Member Header */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className={`w-11 h-11 rounded-2xl ${member.avatarColor || 'bg-emerald-600'} text-white flex items-center justify-center font-black text-sm shrink-0 shadow-2xs`}>
                              {member.name.charAt(0)}
                            </div>

                            <div className="flex-1 min-w-0">
                              {isInlineEditing ? (
                                <div className="space-y-1">
                                  <div className="flex items-center gap-1.5">
                                    <input
                                      type="text"
                                      value={tempMemberName}
                                      onChange={e => setTempMemberName(e.target.value)}
                                      onKeyDown={e => {
                                        if (e.key === 'Enter') handleSaveInlineMemberName(member.id);
                                        if (e.key === 'Escape') handleCancelInlineEdit();
                                      }}
                                      autoFocus
                                      className="px-2.5 py-1 text-xs font-bold rounded-lg border border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 w-full"
                                      placeholder="Nhập tên mới..."
                                    />
                                    <button
                                      onClick={() => handleSaveInlineMemberName(member.id)}
                                      className="p-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors cursor-pointer shrink-0"
                                      title="Lưu tên mới"
                                    >
                                      <Check className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={handleCancelInlineEdit}
                                      className="p-1 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-600 transition-colors cursor-pointer shrink-0"
                                      title="Hủy"
                                    >
                                      <X className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                  <p className="text-[10px] text-emerald-600 font-medium">Nhấn Enter hoặc ✓ để lưu</p>
                                </div>
                              ) : (
                                <div>
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <h4 className="font-black text-slate-900 text-sm tracking-tight hover:text-emerald-700 transition-colors">
                                      {member.name}
                                    </h4>
                                    <button
                                      onClick={() => handleStartInlineEdit(member)}
                                      className="p-1 rounded text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer"
                                      title="Chỉnh sửa nhanh tên thành viên"
                                    >
                                      <Edit2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                  <p className="text-xs text-slate-600 mt-0.5 font-medium line-clamp-1">
                                    {member.role}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Order Index */}
                          <span className="text-[11px] font-mono text-slate-400 font-bold shrink-0">
                            #{idx + 1}
                          </span>
                        </div>

                        {/* Dept Badge & Phone */}
                        <div className="flex items-center gap-2 mt-3 flex-wrap">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${dept.bgLight} ${dept.textDark} border ${dept.border}`}>
                            <DeptIcon className="w-3 h-3" />
                            <span>{dept.label}</span>
                          </span>

                          {member.phone && (
                            <a
                              href={`tel:${member.phone.replace(/[^0-9]/g, '')}`}
                              className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-600 hover:text-emerald-700 bg-slate-50 hover:bg-emerald-50 px-2 py-0.5 rounded-md border border-slate-200 transition-colors"
                            >
                              <Phone className="w-3 h-3 text-emerald-600" />
                              <span>{member.phone}</span>
                            </a>
                          )}
                        </div>

                        {/* Notes / Experience */}
                        {member.notes && (
                          <p className="text-[11px] text-slate-500 italic mt-2.5 bg-slate-50 p-2 rounded-xl leading-relaxed">
                            {member.notes}
                          </p>
                        )}
                      </div>

                      {/* Bottom Footer: Task Count + Actions */}
                      <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-1 text-slate-600 text-[11px]">
                          <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                          <span className="font-semibold text-slate-900">{memberTasks.length} nhiệm vụ</span>
                          <span className="text-slate-400">({completedTasksCount} đã xong)</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleStartInlineEdit(member)}
                            className="px-2 py-1 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 text-[11px] font-semibold transition-colors cursor-pointer"
                          >
                            Sửa tên
                          </button>
                          <button
                            onClick={() => handleOpenEditMember(member)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-bold transition-colors cursor-pointer"
                          >
                            Sửa chi tiết
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Xóa thành viên "${member.name}" khỏi danh sách đội ngũ?`)) {
                                onDeleteMember(member.id);
                                showNotification(`Đã xóa thành viên "${member.name}"`);
                              }
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Xóa thành viên"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
          <div className="text-slate-500">
            * Mọi thay đổi tên thành viên sẽ được <strong>tự động đồng bộ</strong> vào các nhiệm vụ được phân công.
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition-all shadow-xs cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>

      {/* SUB-MODAL: ADD / EDIT FULL MEMBER DETAILS */}
      {isFormOpen && (
        <MemberFormSubModal
          member={editingMember}
          onClose={() => setIsFormOpen(false)}
          onSave={savedMember => {
            onSaveMember(savedMember);
            setIsFormOpen(false);
            showNotification(editingMember ? 'Đã lưu thông tin thành viên!' : 'Đã thêm thành viên mới!');
          }}
          onDelete={memberId => {
            onDeleteMember(memberId);
            setIsFormOpen(false);
            showNotification('Đã xóa thành viên!');
          }}
        />
      )}
    </div>
  );
};

// =========================================================================
// SUB-COMPONENT: MEMBER FORM (ADD / FULL EDIT)
// =========================================================================
interface MemberFormSubModalProps {
  member: TeamMember | null;
  onClose: () => void;
  onSave: (member: TeamMember) => void;
  onDelete: (id: string) => void;
}

const MemberFormSubModal: React.FC<MemberFormSubModalProps> = ({
  member,
  onClose,
  onSave,
  onDelete,
}) => {
  const [name, setName] = useState(member?.name || '');
  const [role, setRole] = useState(member?.role || '');
  const [department, setDepartment] = useState<TaskDepartment>(member?.department || 'cam_trai');
  const [phone, setPhone] = useState(member?.phone || '');
  const [notes, setNotes] = useState(member?.notes || '');
  const [avatarColor, setAvatarColor] = useState(member?.avatarColor || 'bg-emerald-600');

  const avatarColorOptions = [
    { label: 'Xanh ngọc', value: 'bg-emerald-600' },
    { label: 'Xanh lam', value: 'bg-indigo-600' },
    { label: 'Cam vàng', value: 'bg-amber-600' },
    { label: 'Đỏ hồng', value: 'bg-rose-600' },
    { label: 'Tím hoa cà', value: 'bg-purple-600' },
    { label: 'Xanh mòng két', value: 'bg-teal-600' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Vui lòng nhập họ và tên thành viên');
      return;
    }

    onSave({
      id: member?.id || `mem-${Date.now()}`,
      name: name.trim(),
      role: role.trim() || 'Thành viên đội trại',
      department,
      phone: phone.trim() || undefined,
      notes: notes.trim() || undefined,
      avatarColor,
    });
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-600" />
            <span>{member ? 'Chỉnh Sửa Thông Tin Thành Viên' : 'Thêm Thành Viên Mới Vào Đội'}</span>
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Họ và tên thành viên <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="VD: Nguyễn Văn Hoàng, Vũ Đức Minh..."
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-xs font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Chức vụ / Vai trò trong đội</label>
            <input
              type="text"
              placeholder="VD: Bí thư Chi đoàn, Tổ trưởng Kỹ thuật Dựng trại, Phụ trách văn nghệ..."
              value={role}
              onChange={e => setRole(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Mảng phụ trách chính</label>
              <select
                value={department}
                onChange={e => setDepartment(e.target.value as TaskDepartment)}
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
              >
                <option value="cam_trai">1. Cắm trại & Dựng cổng (70đ)</option>
                <option value="van_nghe">2. Văn nghệ 14 em (20đ)</option>
                <option value="nghi_thuc_doi">3. Nghi thức & Trống cờ (20đ)</option>
                <option value="hau_can">4. Hậu cần & Y tế</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Số điện thoại / Zalo</label>
              <input
                type="text"
                placeholder="VD: 0912.345.678"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Màu sắc nhận diện (Avatar)</label>
            <div className="flex items-center gap-2 flex-wrap pt-1">
              {avatarColorOptions.map(opt => (
                <button
                  type="button"
                  key={opt.value}
                  onClick={() => setAvatarColor(opt.value)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer border ${
                    avatarColor === opt.value ? 'ring-2 ring-slate-900 border-transparent text-white ' + opt.value : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <span className={`w-3 h-3 rounded-full ${opt.value}`} />
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Ghi chú phân công / Kinh nghiệm</label>
            <textarea
              rows={3}
              placeholder="Nhập chuyên môn, năng khiếu hoặc nhiệm vụ dài hạn..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            {member ? (
              <button
                type="button"
                onClick={() => {
                  if (window.confirm(`Xóa thành viên "${member.name}"?`)) {
                    onDelete(member.id);
                  }
                }}
                className="text-rose-600 hover:text-rose-800 font-semibold cursor-pointer"
              >
                Xóa thành viên
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer shadow-xs"
              >
                Lưu Thông Tin
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
