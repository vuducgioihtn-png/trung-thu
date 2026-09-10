import React, { useState, useMemo } from 'react';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  Hourglass,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  User,
  Users,
  Phone,
  Calendar,
  ListTodo,
  Columns3,
  Printer,
  ChevronDown,
  CheckSquare,
  FileText,
  Sparkles,
  Tent,
  Music,
  Flag,
  HeartHandshake,
  X,
  MessageSquare,
  Save,
  Check,
  AlertCircle
} from 'lucide-react';
import { CampTask, TeamMember, TaskStatus, TaskPriority, TaskDepartment, TaskChecklistItem } from '../types/camp';
import { TeamRosterModal } from './TeamRosterModal';

interface TaskManagerProps {
  tasks: CampTask[];
  teamMembers: TeamMember[];
  onUpdateTasks: (tasks: CampTask[]) => void;
  onUpdateMembers: (members: TeamMember[]) => void;
  initialDepartmentFilter?: TaskDepartment | 'all';
}

export const TaskManager: React.FC<TaskManagerProps> = ({
  tasks,
  teamMembers,
  onUpdateTasks,
  onUpdateMembers,
  initialDepartmentFilter = 'all',
}) => {
  // State for Filters & Search
  const [departmentFilter, setDepartmentFilter] = useState<TaskDepartment | 'all'>(initialDepartmentFilter);
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');
  const [assigneeFilter, setAssigneeFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // View mode: 'list' (chi tiết & ghi chú), 'members' (theo nhân sự), 'kanban' (bảng cột trạng thái)
  const [viewMode, setViewMode] = useState<'list' | 'members' | 'kanban'>('list');

  // Modals state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState<boolean>(false);
  const [editingTask, setEditingTask] = useState<CampTask | null>(null);
  const [isTeamRosterModalOpen, setIsTeamRosterModalOpen] = useState<boolean>(false);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState<boolean>(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);

  // Team Name
  const [teamName, setTeamName] = useState<string>(() => {
    return localStorage.getItem('camp_team_name') || 'Chi Đoàn Thôn 3 - Xã Hải Anh';
  });

  const handleUpdateTeamName = (newName: string) => {
    setTeamName(newName);
    try {
      localStorage.setItem('camp_team_name', newName);
    } catch (e) {
      // ignore
    }
  };

  const handleUpdateMemberName = (memberId: string, newName: string) => {
    const member = teamMembers.find(m => m.id === memberId);
    if (!member || !newName.trim()) return;
    const oldName = member.name;
    const trimmedName = newName.trim();

    // 1. Update member
    const updatedMembers = teamMembers.map(m =>
      m.id === memberId ? { ...m, name: trimmedName } : m
    );
    onUpdateMembers(updatedMembers);

    // 2. Sync assignee name in tasks
    const updatedTasks = tasks.map(t => {
      let modified = false;
      let newAssigneeName = t.assigneeName;
      let newCoAssignees = t.coAssignees;

      if (t.assigneeId === memberId || t.assigneeName === oldName) {
        newAssigneeName = trimmedName;
        modified = true;
      }
      if (t.coAssignees && t.coAssignees.includes(oldName)) {
        newCoAssignees = t.coAssignees.map(co => (co === oldName ? trimmedName : co));
        modified = true;
      }
      return modified ? { ...t, assigneeName: newAssigneeName, coAssignees: newCoAssignees } : t;
    });
    onUpdateTasks(updatedTasks);
  };

  // Quick inline note editing for a specific task
  const [editingNoteTaskId, setEditingNoteTaskId] = useState<string | null>(null);
  const [tempNoteText, setTempNoteText] = useState<string>('');

  // Department labels and styling
  const deptConfig: Record<TaskDepartment, { label: string; icon: any; color: string; bgLight: string; textDark: string; border: string }> = {
    cam_trai: {
      label: 'Cắm Trại & Dựng Cổng',
      icon: Tent,
      color: 'bg-emerald-600',
      bgLight: 'bg-emerald-50',
      textDark: 'text-emerald-800',
      border: 'border-emerald-200',
    },
    van_nghe: {
      label: 'Văn Nghệ 14 Em',
      icon: Music,
      color: 'bg-indigo-600',
      bgLight: 'bg-indigo-50',
      textDark: 'text-indigo-800',
      border: 'border-indigo-200',
    },
    nghi_thuc_doi: {
      label: 'Nghi Thức & Trống Cờ',
      icon: Flag,
      color: 'bg-amber-600',
      bgLight: 'bg-amber-50',
      textDark: 'text-amber-900',
      border: 'border-amber-200',
    },
    hau_can: {
      label: 'Hậu Cần & Y Tế',
      icon: HeartHandshake,
      color: 'bg-rose-600',
      bgLight: 'bg-rose-50',
      textDark: 'text-rose-800',
      border: 'border-rose-200',
    },
  };

  const statusConfig: Record<TaskStatus, { label: string; icon: any; badgeClass: string; borderClass: string; bgSoft: string }> = {
    completed: {
      label: 'Đã hoàn thành',
      icon: CheckCircle2,
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      borderClass: 'border-emerald-400',
      bgSoft: 'bg-emerald-50/50',
    },
    in_progress: {
      label: 'Đang thực hiện',
      icon: Hourglass,
      badgeClass: 'bg-blue-100 text-blue-800 border-blue-300',
      borderClass: 'border-blue-400',
      bgSoft: 'bg-blue-50/50',
    },
    pending: {
      label: 'Chờ thực hiện',
      icon: Clock,
      badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
      borderClass: 'border-amber-400',
      bgSoft: 'bg-amber-50/50',
    },
    delayed: {
      label: 'Chậm tiến độ / Cần hỗ trợ',
      icon: AlertTriangle,
      badgeClass: 'bg-rose-100 text-rose-800 border-rose-300',
      borderClass: 'border-rose-400',
      bgSoft: 'bg-rose-50/50',
    },
  };

  const priorityConfig: Record<TaskPriority, { label: string; class: string }> = {
    high: { label: 'Ưu tiên cao (Khẩn cấp)', class: 'bg-rose-100 text-rose-800 border-rose-300' },
    medium: { label: 'Ưu tiên trung bình', class: 'bg-amber-100 text-amber-800 border-amber-300' },
    low: { label: 'Ưu tiên thường', class: 'bg-slate-100 text-slate-700 border-slate-300' },
  };

  // Filtered tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      if (departmentFilter !== 'all' && task.department !== departmentFilter) return false;
      if (statusFilter !== 'all' && task.status !== statusFilter) return false;
      if (assigneeFilter !== 'all' && task.assigneeId !== assigneeFilter) return false;
      if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchTitle = task.title.toLowerCase().includes(query);
        const matchNotes = task.notes?.toLowerCase().includes(query) || false;
        const matchAssignee = task.assigneeName.toLowerCase().includes(query);
        const matchCoAssignee = task.coAssignees?.some(c => c.toLowerCase().includes(query)) || false;
        if (!matchTitle && !matchNotes && !matchAssignee && !matchCoAssignee) return false;
      }
      return true;
    });
  }, [tasks, departmentFilter, statusFilter, assigneeFilter, priorityFilter, searchQuery]);

  // Task Statistics
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'completed').length;
    const inProgress = tasks.filter(t => t.status === 'in_progress').length;
    const pending = tasks.filter(t => t.status === 'pending').length;
    const delayed = tasks.filter(t => t.status === 'delayed').length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    const byDept = {
      cam_trai: {
        total: tasks.filter(t => t.department === 'cam_trai').length,
        completed: tasks.filter(t => t.department === 'cam_trai' && t.status === 'completed').length,
      },
      van_nghe: {
        total: tasks.filter(t => t.department === 'van_nghe').length,
        completed: tasks.filter(t => t.department === 'van_nghe' && t.status === 'completed').length,
      },
      nghi_thuc_doi: {
        total: tasks.filter(t => t.department === 'nghi_thuc_doi').length,
        completed: tasks.filter(t => t.department === 'nghi_thuc_doi' && t.status === 'completed').length,
      },
      hau_can: {
        total: tasks.filter(t => t.department === 'hau_can').length,
        completed: tasks.filter(t => t.department === 'hau_can' && t.status === 'completed').length,
      },
    };

    return { total, completed, inProgress, pending, delayed, percentage, byDept };
  }, [tasks]);

  // Quick cycle task status
  const handleCycleStatus = (task: CampTask) => {
    const nextStatusMap: Record<TaskStatus, TaskStatus> = {
      pending: 'in_progress',
      in_progress: 'completed',
      completed: 'pending',
      delayed: 'in_progress',
    };
    const nextStatus = nextStatusMap[task.status];
    const updated = tasks.map(t => (t.id === task.id ? { ...t, status: nextStatus } : t));
    onUpdateTasks(updated);
  };

  const handleDirectSetStatus = (taskId: string, newStatus: TaskStatus) => {
    const updated = tasks.map(t => (t.id === taskId ? { ...t, status: newStatus } : t));
    onUpdateTasks(updated);
  };

  // Toggle checklist item
  const handleToggleChecklist = (taskId: string, checkId: string) => {
    const updated = tasks.map(t => {
      if (t.id !== taskId) return t;
      const updatedChecklist = (t.checklist || []).map(c =>
        c.id === checkId ? { ...c, done: !c.done } : c
      );
      // Auto complete task if all checklist done
      const allDone = updatedChecklist.length > 0 && updatedChecklist.every(c => c.done);
      return {
        ...t,
        checklist: updatedChecklist,
        status: allDone ? 'completed' : t.status === 'completed' ? 'in_progress' : t.status,
      };
    });
    onUpdateTasks(updated);
  };

  // Quick Note editing
  const handleStartEditNote = (task: CampTask) => {
    setEditingNoteTaskId(task.id);
    setTempNoteText(task.notes || '');
  };

  const handleSaveNote = (taskId: string) => {
    const updated = tasks.map(t => (t.id === taskId ? { ...t, notes: tempNoteText } : t));
    onUpdateTasks(updated);
    setEditingNoteTaskId(null);
  };

  // Delete task
  const handleDeleteTask = (taskId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa nhiệm vụ này?')) {
      onUpdateTasks(tasks.filter(t => t.id !== taskId));
    }
  };

  // Open Edit modal
  const handleOpenEditTask = (task: CampTask) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  // Open Create modal
  const handleOpenCreateTask = () => {
    setEditingTask(null);
    setIsTaskModalOpen(true);
  };

  // Save Task from Modal
  const handleSaveTaskModal = (taskData: CampTask) => {
    if (editingTask) {
      onUpdateTasks(tasks.map(t => (t.id === taskData.id ? taskData : t)));
    } else {
      onUpdateTasks([...tasks, { ...taskData, id: `task-${Date.now()}` }]);
    }
    setIsTaskModalOpen(false);
    setEditingTask(null);
  };

  // Save Member from Modal
  const handleSaveMemberModal = (memberData: TeamMember) => {
    const isExisting = teamMembers.some(m => m.id === memberData.id);
    const oldMember = isExisting ? teamMembers.find(m => m.id === memberData.id) : null;

    if (isExisting) {
      const updatedMembers = teamMembers.map(m => (m.id === memberData.id ? memberData : m));
      onUpdateMembers(updatedMembers);

      if (oldMember && oldMember.name !== memberData.name) {
        const updatedTasks = tasks.map(t => {
          let modified = false;
          let newAssigneeName = t.assigneeName;
          let newCoAssignees = t.coAssignees;

          if (t.assigneeId === memberData.id || t.assigneeName === oldMember.name) {
            newAssigneeName = memberData.name;
            modified = true;
          }
          if (t.coAssignees && t.coAssignees.includes(oldMember.name)) {
            newCoAssignees = t.coAssignees.map(co => (co === oldMember.name ? memberData.name : co));
            modified = true;
          }
          return modified ? { ...t, assigneeName: newAssigneeName, coAssignees: newCoAssignees } : t;
        });
        onUpdateTasks(updatedTasks);
      }
    } else {
      onUpdateMembers([...teamMembers, { ...memberData, id: memberData.id || `mem-${Date.now()}` }]);
    }
    setIsMemberModalOpen(false);
    setEditingMember(null);
  };

  const handleDeleteMember = (memberId: string) => {
    if (window.confirm('Xóa thành viên này khỏi danh sách?')) {
      onUpdateMembers(teamMembers.filter(m => m.id !== memberId));
    }
  };

  return (
    <div className="space-y-6">
      {/* ---------------------------------------------------- */}
      {/* 1. TOP STATS & OVERALL PROGRESS CARD                 */}
      {/* ---------------------------------------------------- */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 pb-5 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <ListTodo className="w-5 h-5 text-emerald-600" />
                <span>Quản Lý & Phân Công Nhiệm Vụ Đội Cắm Trại</span>
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Theo dõi phân công công việc từng thành viên, trạng thái triển khai, ghi chú kỹ thuật và nhắc nhở tiêu chuẩn chấm điểm hội trại.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => setIsPrintModalOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all cursor-pointer shadow-2xs"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span>In Bảng Phân Công</span>
            </button>
            <button
              onClick={() => setIsTeamRosterModalOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 text-xs font-semibold transition-all cursor-pointer shadow-2xs border border-transparent hover:border-emerald-200"
              title="Bấm để xem danh sách đội ngũ và chỉnh sửa tên"
            >
              <Users className="w-4 h-4 text-emerald-600" />
              <span>Đội Ngũ ({teamMembers.length})</span>
            </button>
            <button
              onClick={handleOpenCreateTask}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm Nhiệm Vụ Mới</span>
            </button>
          </div>
        </div>

        {/* 4 Status Counters + Progress Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-600">Tổng nhiệm vụ</span>
              <ListTodo className="w-4 h-4 text-slate-400" />
            </div>
            <p className="text-xl font-bold text-slate-900 mt-1 font-mono">{stats.total}</p>
            <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${stats.percentage}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-500 mt-1 font-medium">Tiến độ chung: {stats.percentage}%</p>
          </div>

          <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-800">Đã hoàn thành</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-xl font-bold text-emerald-700 mt-1 font-mono">{stats.completed}</p>
            <p className="text-[10px] text-emerald-600 mt-2 font-medium">
              Đạt {Math.round((stats.completed / (stats.total || 1)) * 100)}% khối lượng
            </p>
          </div>

          <div className="bg-blue-50/70 p-3 rounded-xl border border-blue-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-blue-800">Đang thực hiện</span>
              <Hourglass className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-xl font-bold text-blue-700 mt-1 font-mono">{stats.inProgress}</p>
            <p className="text-[10px] text-blue-600 mt-2 font-medium">
              Đang làm: {stats.inProgress} việc
            </p>
          </div>

          <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-amber-900">Chờ / Cần hỗ trợ</span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl font-bold text-amber-800 font-mono">{stats.pending}</span>
              {stats.delayed > 0 && (
                <span className="text-xs font-bold text-rose-600 bg-rose-100 px-1.5 py-0.5 rounded">
                  {stats.delayed} chậm
                </span>
              )}
            </div>
            <p className="text-[10px] text-amber-700 mt-2 font-medium">
              Cần đốc thúc tiến độ
            </p>
          </div>
        </div>

        {/* 4 Pillars Quick Progress Badges */}
        <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div 
            onClick={() => setDepartmentFilter(departmentFilter === 'cam_trai' ? 'all' : 'cam_trai')}
            className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
              departmentFilter === 'cam_trai' ? 'bg-emerald-100 border-emerald-400 font-bold' : 'bg-slate-50 border-slate-200 hover:bg-emerald-50'
            }`}
          >
            <div className="flex items-center gap-2">
              <Tent className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate">1. Cắm trại</span>
            </div>
            <span className="font-mono text-emerald-700 font-bold ml-1 shrink-0">
              {stats.byDept.cam_trai.completed}/{stats.byDept.cam_trai.total}
            </span>
          </div>

          <div 
            onClick={() => setDepartmentFilter(departmentFilter === 'van_nghe' ? 'all' : 'van_nghe')}
            className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
              departmentFilter === 'van_nghe' ? 'bg-indigo-100 border-indigo-400 font-bold' : 'bg-slate-50 border-slate-200 hover:bg-indigo-50'
            }`}
          >
            <div className="flex items-center gap-2">
              <Music className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span className="truncate">2. Văn nghệ</span>
            </div>
            <span className="font-mono text-indigo-700 font-bold ml-1 shrink-0">
              {stats.byDept.van_nghe.completed}/{stats.byDept.van_nghe.total}
            </span>
          </div>

          <div 
            onClick={() => setDepartmentFilter(departmentFilter === 'nghi_thuc_doi' ? 'all' : 'nghi_thuc_doi')}
            className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
              departmentFilter === 'nghi_thuc_doi' ? 'bg-amber-100 border-amber-400 font-bold' : 'bg-slate-50 border-slate-200 hover:bg-amber-50'
            }`}
          >
            <div className="flex items-center gap-2">
              <Flag className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span className="truncate">3. Nghi thức</span>
            </div>
            <span className="font-mono text-amber-800 font-bold ml-1 shrink-0">
              {stats.byDept.nghi_thuc_doi.completed}/{stats.byDept.nghi_thuc_doi.total}
            </span>
          </div>

          <div 
            onClick={() => setDepartmentFilter(departmentFilter === 'hau_can' ? 'all' : 'hau_can')}
            className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
              departmentFilter === 'hau_can' ? 'bg-rose-100 border-rose-400 font-bold' : 'bg-slate-50 border-slate-200 hover:bg-rose-50'
            }`}
          >
            <div className="flex items-center gap-2">
              <HeartHandshake className="w-3.5 h-3.5 text-rose-600 shrink-0" />
              <span className="truncate">4. Hậu cần</span>
            </div>
            <span className="font-mono text-rose-700 font-bold ml-1 shrink-0">
              {stats.byDept.hau_can.completed}/{stats.byDept.hau_can.total}
            </span>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 2. FILTER CONTROLS & VIEW SWITCHER                   */}
      {/* ---------------------------------------------------- */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm theo tên nhiệm vụ, ghi chú kỹ thuật, hoặc người phụ trách..."
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

          {/* View mode toggle */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl shrink-0 self-start md:self-auto text-xs font-medium">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ListTodo className="w-3.5 h-3.5 text-emerald-600" />
              <span>Chi Tiết & Ghi Chú</span>
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'kanban'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Columns3 className="w-3.5 h-3.5 text-indigo-600" />
              <span>Bảng Tiến Độ Cột</span>
            </button>
            <button
              onClick={() => setViewMode('members')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'members'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-amber-600" />
              <span>Theo Nhân Sự</span>
            </button>
          </div>
        </div>

        {/* Second Row: Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          {/* Department Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium shrink-0">Mảng:</span>
            <select
              value={departmentFilter}
              onChange={e => setDepartmentFilter(e.target.value as any)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="all">Tất cả các mảng</option>
              <option value="cam_trai">1. Cắm trại & Dựng cổng</option>
              <option value="van_nghe">2. Văn nghệ 14 em</option>
              <option value="nghi_thuc_doi">3. Nghi thức & Trống cờ</option>
              <option value="hau_can">4. Hậu cần & Y tế</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium shrink-0">Trạng thái:</span>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as any)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="completed">Đã hoàn thành</option>
              <option value="in_progress">Đang thực hiện</option>
              <option value="pending">Chờ thực hiện</option>
              <option value="delayed">Chậm tiến độ / Cần hỗ trợ</option>
            </select>
          </div>

          {/* Assignee Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium shrink-0">Phụ trách:</span>
            <select
              value={assigneeFilter}
              onChange={e => setAssigneeFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="all">Tất cả thành viên ({teamMembers.length})</option>
              {teamMembers.map(m => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.role})
                </option>
              ))}
            </select>
          </div>

          {/* Priority Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium shrink-0">Ưu tiên:</span>
            <select
              value={priorityFilter}
              onChange={e => setPriorityFilter(e.target.value as any)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="all">Tất cả ưu tiên</option>
              <option value="high">Ưu tiên cao (Khẩn cấp)</option>
              <option value="medium">Ưu tiên trung bình</option>
              <option value="low">Ưu tiên thường</option>
            </select>
          </div>

          {/* Clear Filters */}
          {(departmentFilter !== 'all' || statusFilter !== 'all' || assigneeFilter !== 'all' || priorityFilter !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setDepartmentFilter('all');
                setStatusFilter('all');
                setAssigneeFilter('all');
                setPriorityFilter('all');
                setSearchQuery('');
              }}
              className="text-xs text-rose-600 hover:text-rose-700 underline font-medium ml-auto cursor-pointer"
            >
              Xóa bộ lọc
            </button>
          )}
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 3. MAIN CONTENT VIEWS                                */}
      {/* ---------------------------------------------------- */}

      {/* VIEW 1: DETAILED LIST WITH NOTES & CHECKLISTS */}
      {viewMode === 'list' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>Hiển thị <strong>{filteredTasks.length}</strong> / {tasks.length} nhiệm vụ</span>
            <span className="text-[11px] text-slate-400">Bấm vào trạng thái để chuyển nhanh tiến độ</span>
          </div>

          {filteredTasks.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
              <ListTodo className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-bold text-slate-700">Không tìm thấy nhiệm vụ phù hợp</p>
              <p className="text-xs text-slate-500 mt-1">Thử thay đổi từ khóa tìm kiếm hoặc bỏ bớt tiêu chí lọc</p>
            </div>
          ) : (
            <div className="space-y-3.5">
              {filteredTasks.map(task => {
                const dept = deptConfig[task.department];
                const status = statusConfig[task.status];
                const priority = priorityConfig[task.priority];
                const StatusIcon = status.icon;
                const DeptIcon = dept.icon;
                const isEditingNote = editingNoteTaskId === task.id;

                const completedChecklistCount = (task.checklist || []).filter(c => c.done).length;
                const totalChecklistCount = (task.checklist || []).length;

                return (
                  <div
                    key={task.id}
                    className={`bg-white rounded-2xl border transition-all p-5 shadow-xs hover:shadow-sm ${status.bgSoft} border-slate-200`}
                  >
                    {/* Top Row: Title + Department + Priority + Status */}
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          {/* Department Badge */}
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${dept.bgLight} ${dept.textDark} border ${dept.border}`}>
                            <DeptIcon className="w-3 h-3" />
                            {dept.label}
                          </span>

                          {/* Priority Badge */}
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${priority.class}`}>
                            {priority.label}
                          </span>

                          {/* Scoring Impact Badge */}
                          {task.scoringImpact && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-200">
                              <Sparkles className="w-3 h-3 text-amber-600" />
                              {task.scoringImpact}
                            </span>
                          )}
                        </div>

                        <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                          {task.title}
                        </h3>
                      </div>

                      {/* Status quick toggle button */}
                      <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
                        <button
                          onClick={() => handleCycleStatus(task)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer shadow-2xs ${status.badgeClass}`}
                          title="Bấm để đổi trạng thái sang bước tiếp theo"
                        >
                          <StatusIcon className="w-3.5 h-3.5" />
                          <span>{status.label}</span>
                          <span className="text-[10px] opacity-70 ml-1">↺</span>
                        </button>

                        <button
                          onClick={() => handleOpenEditTask(task)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                          title="Sửa toàn bộ nhiệm vụ"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Xóa nhiệm vụ"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Middle Section: Assignees + Deadline */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-3 text-xs">
                      {/* Person In Charge */}
                      <div className="flex items-center gap-2 bg-slate-50/80 p-2 rounded-xl border border-slate-200/60">
                        <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                          {task.assigneeName.charAt(0)}
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-[10px] text-slate-500 font-medium">Người phụ trách chính:</p>
                          <p className="font-bold text-slate-900 truncate">{task.assigneeName}</p>
                          {task.coAssignees && task.coAssignees.length > 0 && (
                            <p className="text-[10px] text-slate-500 truncate">
                              Phối hợp: <span className="text-slate-700 font-medium">{task.coAssignees.join(', ')}</span>
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Deadline */}
                      <div className="flex items-center gap-2.5 bg-slate-50/80 p-2 rounded-xl border border-slate-200/60">
                        <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                          <Calendar className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-500 font-medium">Thời hạn hoàn thành:</p>
                          <p className="font-bold text-slate-900">{task.deadline}</p>
                        </div>
                      </div>
                    </div>

                    {/* ------------------------------------------------ */}
                    {/* GHI CHÚ CÔNG VIỆC (TASK NOTES) - HIGHLIGHTED BOX */}
                    {/* ------------------------------------------------ */}
                    <div className="mt-2 bg-amber-50/40 rounded-xl p-3 border border-amber-200/70 text-xs">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-1.5 font-bold text-amber-900">
                          <MessageSquare className="w-3.5 h-3.5 text-amber-700" />
                          <span>Ghi Chú & Lưu Ý Kỹ Thuật Chấm Điểm:</span>
                        </div>
                        {!isEditingNote && (
                          <button
                            onClick={() => handleStartEditNote(task)}
                            className="text-[11px] text-amber-700 hover:text-amber-950 font-semibold underline cursor-pointer"
                          >
                            Chỉnh sửa ghi chú
                          </button>
                        )}
                      </div>

                      {isEditingNote ? (
                        <div className="space-y-2 mt-1">
                          <textarea
                            rows={3}
                            value={tempNoteText}
                            onChange={e => setTempNoteText(e.target.value)}
                            className="w-full p-2.5 rounded-lg border border-amber-300 bg-white text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                            placeholder="Nhập ghi chú kỹ thuật, lưu ý giám khảo hoặc thông tin cần nhớ..."
                          />
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setEditingNoteTaskId(null)}
                              className="px-2.5 py-1 rounded-md text-xs text-slate-600 hover:bg-amber-100/50 cursor-pointer"
                            >
                              Hủy
                            </button>
                            <button
                              onClick={() => handleSaveNote(task.id)}
                              className="flex items-center gap-1 px-3 py-1 rounded-md bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs cursor-pointer shadow-2xs"
                            >
                              <Save className="w-3 h-3" />
                              <span>Lưu Ghi Chú</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-slate-700 leading-relaxed italic">
                          "{task.notes || 'Chưa có ghi chú cụ thể. Bấm chỉnh sửa để bổ sung ghi chú kỹ thuật cho nhiệm vụ này.'}"
                        </p>
                      )}
                    </div>

                    {/* Interactive Checklist (If Available) */}
                    {task.checklist && task.checklist.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-slate-100">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                            <CheckSquare className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Các bước kiểm tra tiến độ ({completedChecklistCount}/{totalChecklistCount}):</span>
                          </span>
                          <span className="text-[10px] font-mono text-slate-500">
                            {Math.round((completedChecklistCount / totalChecklistCount) * 100)}%
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                          {task.checklist.map(item => (
                            <label
                              key={item.id}
                              className={`flex items-start gap-2 p-2 rounded-lg border text-xs cursor-pointer transition-all ${
                                item.done
                                  ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900 line-through opacity-80'
                                  : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={item.done}
                                onChange={() => handleToggleChecklist(task.id, item.id)}
                                className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                              />
                              <span className="leading-snug">{item.text}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: KANBAN COLUMNS */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
          {(['pending', 'in_progress', 'delayed', 'completed'] as TaskStatus[]).map(statusKey => {
            const config = statusConfig[statusKey];
            const StatusIcon = config.icon;
            const columnTasks = filteredTasks.filter(t => t.status === statusKey);

            return (
              <div key={statusKey} className="bg-slate-100/80 rounded-2xl p-3 border border-slate-200/80 space-y-3">
                {/* Column Header */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <StatusIcon className="w-4 h-4 text-slate-700" />
                    <span className="text-xs font-bold text-slate-800">{config.label}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-white text-slate-700 text-xs font-bold font-mono shadow-2xs">
                    {columnTasks.length}
                  </span>
                </div>

                {/* Column Cards */}
                <div className="space-y-2.5 max-h-[680px] overflow-y-auto pr-1">
                  {columnTasks.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-400 bg-white/60 rounded-xl border border-dashed border-slate-200">
                      Không có nhiệm vụ
                    </div>
                  ) : (
                    columnTasks.map(task => {
                      const dept = deptConfig[task.department];
                      return (
                        <div
                          key={task.id}
                          className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-2xs hover:shadow-xs transition-all space-y-2 group"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${dept.bgLight} ${dept.textDark}`}>
                              {dept.label}
                            </span>
                            <span className="text-[10px] font-bold text-slate-500 font-mono">
                              {task.deadline.split('(')[0]}
                            </span>
                          </div>

                          <h4 className="text-xs font-bold text-slate-900 leading-snug">
                            {task.title}
                          </h4>

                          {/* Person in charge */}
                          <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-slate-100">
                            <div className="flex items-center gap-1.5">
                              <User className="w-3 h-3 text-slate-400" />
                              <span className="font-semibold text-slate-700">{task.assigneeName}</span>
                            </div>

                            {/* Dropdown to change column */}
                            <select
                              value={task.status}
                              onChange={e => handleDirectSetStatus(task.id, e.target.value as TaskStatus)}
                              className="text-[10px] font-bold rounded bg-slate-50 border border-slate-200 text-slate-700 py-0.5 px-1 cursor-pointer"
                            >
                              <option value="pending">Chờ làm</option>
                              <option value="in_progress">Đang làm</option>
                              <option value="delayed">Chậm</option>
                              <option value="completed">Đã xong</option>
                            </select>
                          </div>

                          {/* Notes snippet */}
                          {task.notes && (
                            <p className="text-[10px] text-slate-500 bg-slate-50 p-1.5 rounded-md italic line-clamp-2">
                              "{task.notes}"
                            </p>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 3: BY MEMBER (PERSONNEL WORKLOAD MATRIX) */}
      {viewMode === 'members' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teamMembers.map(member => {
            const memberTasks = tasks.filter(t => t.assigneeId === member.id);
            const completedCount = memberTasks.filter(t => t.status === 'completed').length;
            const inProgressCount = memberTasks.filter(t => t.status === 'in_progress').length;
            const pct = memberTasks.length > 0 ? Math.round((completedCount / memberTasks.length) * 100) : 0;
            const dept = deptConfig[member.department];

            return (
              <div
                key={member.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3.5 flex flex-col justify-between"
              >
                <div>
                  {/* Member header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 rounded-xl ${member.avatarColor || 'bg-emerald-600'} text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-2xs`}>
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4
                            onClick={() => { setEditingMember(member); setIsMemberModalOpen(true); }}
                            className="font-bold text-slate-900 text-sm leading-tight hover:text-emerald-700 cursor-pointer transition-colors"
                            title="Bấm để chỉnh sửa tên và thông tin thành viên"
                          >
                            {member.name}
                          </h4>
                          <button
                            onClick={() => { setEditingMember(member); setIsMemberModalOpen(true); }}
                            className="p-0.5 rounded text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer"
                            title="Sửa tên thành viên"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5 font-medium">{member.role}</p>
                        <span className={`inline-block px-2 py-0.2 rounded-full text-[10px] font-bold mt-1 ${dept.bgLight} ${dept.textDark}`}>
                          {dept.label}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => { setEditingMember(member); setIsMemberModalOpen(true); }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                      title="Sửa thông tin thành viên"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Phone & notes */}
                  <div className="mt-3 text-xs space-y-1 text-slate-500 bg-slate-50 p-2 rounded-xl">
                    {member.phone && (
                      <div className="flex items-center gap-1.5 text-slate-700 font-mono">
                        <Phone className="w-3 h-3 text-emerald-600" />
                        <span>{member.phone}</span>
                      </div>
                    )}
                    <p className="italic text-[11px] leading-relaxed">
                      {member.notes || 'Không có ghi chú thêm.'}
                    </p>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-3 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-600">Tiến độ công việc:</span>
                      <span className="font-mono font-bold text-slate-900">{completedCount}/{memberTasks.length} ({pct}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-600 h-full rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  {/* Assigned tasks list preview */}
                  <div className="mt-3 space-y-1.5">
                    <p className="text-[11px] font-bold text-slate-700">Nhiệm vụ được giao ({memberTasks.length}):</p>
                    {memberTasks.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">Chưa giao nhiệm vụ nào</p>
                    ) : (
                      memberTasks.map(task => {
                        const st = statusConfig[task.status];
                        return (
                          <div
                            key={task.id}
                            className="p-2 rounded-lg bg-slate-50 border border-slate-200/80 text-xs flex items-center justify-between gap-2"
                          >
                            <span className={`truncate ${task.status === 'completed' ? 'line-through text-slate-400' : 'text-slate-800 font-medium'}`}>
                              {task.title}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold shrink-0 ${st.badgeClass}`}>
                              {st.label}
                            </span>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setEditingTask({
                      id: '',
                      title: '',
                      department: member.department,
                      assigneeId: member.id,
                      assigneeName: member.name,
                      status: 'pending',
                      priority: 'high',
                      deadline: 'Sáng 14/8 ÂL',
                      notes: '',
                    });
                    setIsTaskModalOpen(true);
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Giao Thêm Nhiệm Vụ Cho {member.name.split(' ').slice(-1)[0]}</span>
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 4. MODAL: ADD / EDIT TASK                            */}
      {/* ---------------------------------------------------- */}
      {isTaskModalOpen && (
        <TaskEditModal
          task={editingTask}
          teamMembers={teamMembers}
          onClose={() => { setIsTaskModalOpen(false); setEditingTask(null); }}
          onSave={handleSaveTaskModal}
        />
      )}

      {/* ---------------------------------------------------- */}
      {/* 5. MODAL: FULL TEAM ROSTER & MEMBER MANAGEMENT       */}
      {/* ---------------------------------------------------- */}
      <TeamRosterModal
        isOpen={isTeamRosterModalOpen}
        onClose={() => setIsTeamRosterModalOpen(false)}
        teamMembers={teamMembers}
        tasks={tasks}
        teamName={teamName}
        onUpdateTeamName={handleUpdateTeamName}
        onSaveMember={handleSaveMemberModal}
        onUpdateMemberName={handleUpdateMemberName}
        onDeleteMember={handleDeleteMember}
      />

      {/* ---------------------------------------------------- */}
      {/* 6. MODAL: ADD / EDIT TEAM MEMBER (SINGLE)            */}
      {/* ---------------------------------------------------- */}
      {isMemberModalOpen && (
        <MemberEditModal
          member={editingMember}
          teamMembers={teamMembers}
          onClose={() => { setIsMemberModalOpen(false); setEditingMember(null); }}
          onSave={handleSaveMemberModal}
          onDelete={handleDeleteMember}
        />
      )}

      {/* ---------------------------------------------------- */}
      {/* 7. MODAL: PRINT TASK SHEET                           */}
      {/* ---------------------------------------------------- */}
      {isPrintModalOpen && (
        <PrintTasksModal
          tasks={tasks}
          teamMembers={teamMembers}
          teamName={teamName}
          onClose={() => setIsPrintModalOpen(false)}
        />
      )}
    </div>
  );
};

// =========================================================================
// SUBCOMPONENT: TASK EDIT MODAL
// =========================================================================
interface TaskEditModalProps {
  task: CampTask | null;
  teamMembers: TeamMember[];
  onClose: () => void;
  onSave: (task: CampTask) => void;
}

const TaskEditModal: React.FC<TaskEditModalProps> = ({ task, teamMembers, onClose, onSave }) => {
  const [title, setTitle] = useState(task?.title || '');
  const [department, setDepartment] = useState<TaskDepartment>(task?.department || 'cam_trai');
  const [assigneeId, setAssigneeId] = useState(task?.assigneeId || teamMembers[0]?.id || '');
  const [coAssigneesText, setCoAssigneesText] = useState(task?.coAssignees?.join(', ') || '');
  const [status, setStatus] = useState<TaskStatus>(task?.status || 'pending');
  const [priority, setPriority] = useState<TaskPriority>(task?.priority || 'medium');
  const [deadline, setDeadline] = useState(task?.deadline || 'Sáng 14/8 ÂL (10h00)');
  const [notes, setNotes] = useState(task?.notes || '');
  const [scoringImpact, setScoringImpact] = useState(task?.scoringImpact || '');
  
  // Checklist items
  const [checklist, setChecklist] = useState<TaskChecklistItem[]>(task?.checklist || []);
  const [newCheckItem, setNewCheckItem] = useState('');

  const handleAddCheckItem = () => {
    if (newCheckItem.trim()) {
      setChecklist([...checklist, { id: `c-${Date.now()}`, text: newCheckItem.trim(), done: false }]);
      setNewCheckItem('');
    }
  };

  const handleRemoveCheckItem = (id: string) => {
    setChecklist(checklist.filter(c => c.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Vui lòng nhập tên công việc');
      return;
    }

    const selectedMember = teamMembers.find(m => m.id === assigneeId);
    const coAssignees = coAssigneesText
      ? coAssigneesText.split(',').map(s => s.trim()).filter(Boolean)
      : undefined;

    const savedTask: CampTask = {
      id: task?.id || `task-${Date.now()}`,
      title: title.trim(),
      department,
      assigneeId,
      assigneeName: selectedMember ? selectedMember.name : 'Chưa phân công',
      coAssignees,
      status,
      priority,
      deadline: deadline.trim(),
      notes: notes.trim(),
      scoringImpact: scoringImpact.trim() || undefined,
      checklist: checklist.length > 0 ? checklist : undefined,
    };

    onSave(savedTask);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <ListTodo className="w-5 h-5 text-emerald-600" />
            <span>{task ? 'Chỉnh Sửa Nhiệm Vụ' : 'Phân Công Nhiệm Vụ Mới'}</span>
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Tên nhiệm vụ / công việc *</label>
            <input
              type="text"
              required
              placeholder="VD: Gia công khung 4 trụ cổng hộp kép 1.8m x 1.2m"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Mảng dự án</label>
              <select
                value={department}
                onChange={e => setDepartment(e.target.value as TaskDepartment)}
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none cursor-pointer"
              >
                <option value="cam_trai">1. Cắm trại & Dựng cổng</option>
                <option value="van_nghe">2. Văn nghệ 14 em</option>
                <option value="nghi_thuc_doi">3. Nghi thức & Trống cờ</option>
                <option value="hau_can">4. Hậu cần & Y tế</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Người phụ trách chính *</label>
              <select
                value={assigneeId}
                onChange={e => setAssigneeId(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none cursor-pointer"
              >
                {teamMembers.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.role})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Trạng thái</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as TaskStatus)}
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none cursor-pointer"
              >
                <option value="pending">Chờ thực hiện</option>
                <option value="in_progress">Đang thực hiện</option>
                <option value="completed">Đã hoàn thành</option>
                <option value="delayed">Chậm tiến độ / Cần hỗ trợ</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Mức độ ưu tiên</label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as TaskPriority)}
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none cursor-pointer"
              >
                <option value="high">Ưu tiên cao (Khẩn cấp)</option>
                <option value="medium">Ưu tiên trung bình</option>
                <option value="low">Ưu tiên thường</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Thời hạn hoàn thành</label>
              <input
                type="text"
                placeholder="VD: Sáng 14/8 ÂL (10h00)"
                value={deadline}
                onChange={e => setDeadline(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Người phối hợp cùng (cách nhau dấu phẩy)</label>
              <input
                type="text"
                placeholder="VD: Nguyễn Văn Hoàng, Đỗ Quang Huy"
                value={coAssigneesText}
                onChange={e => setCoAssigneesText(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Tác động điểm thi đua (nếu có)</label>
              <input
                type="text"
                placeholder="VD: Trọng số 15đ Cổng trại (kết cấu vững chắc)"
                value={scoringImpact}
                onChange={e => setScoringImpact(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Detailed Notes */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Ghi chú công việc & Lưu ý kỹ thuật *
            </label>
            <textarea
              rows={3}
              placeholder="Nhập hướng dẫn chi tiết, nhắc nhở kỹ thuật, quy định BGK hoặc các điểm cần lưu ý..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none leading-relaxed"
            />
          </div>

          {/* Checklist Management */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Các bước kiểm tra / Checklist tiến độ con
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Thêm một bước kiểm tra (VD: Cắt gọt mút xốp dày 3cm)..."
                value={newCheckItem}
                onChange={e => setNewCheckItem(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddCheckItem(); } }}
                className="flex-1 p-2 rounded-xl border border-slate-300 bg-white text-xs"
              />
              <button
                type="button"
                onClick={handleAddCheckItem}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs cursor-pointer"
              >
                + Thêm
              </button>
            </div>

            {checklist.length > 0 && (
              <div className="space-y-1.5 max-h-32 overflow-y-auto bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                {checklist.map(item => (
                  <div key={item.id} className="flex items-center justify-between gap-2 text-xs bg-white p-1.5 rounded-lg border border-slate-200">
                    <span className={item.done ? 'line-through text-slate-400' : 'text-slate-800'}>
                      {item.text}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveCheckItem(item.id)}
                      className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
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
              Lưu Nhiệm Vụ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// =========================================================================
// SUBCOMPONENT: MEMBER EDIT MODAL
// =========================================================================
interface MemberEditModalProps {
  member: TeamMember | null;
  teamMembers: TeamMember[];
  onClose: () => void;
  onSave: (member: TeamMember) => void;
  onDelete: (id: string) => void;
}

const MemberEditModal: React.FC<MemberEditModalProps> = ({ member, teamMembers, onClose, onSave, onDelete }) => {
  const [name, setName] = useState(member?.name || '');
  const [role, setRole] = useState(member?.role || '');
  const [department, setDepartment] = useState<TaskDepartment>(member?.department || 'cam_trai');
  const [phone, setPhone] = useState(member?.phone || '');
  const [notes, setNotes] = useState(member?.notes || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      id: member?.id || `mem-${Date.now()}`,
      name: name.trim(),
      role: role.trim() || 'Thành viên đội trại',
      department,
      phone: phone.trim() || undefined,
      notes: notes.trim() || undefined,
      avatarColor: member?.avatarColor || 'bg-emerald-600',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-600" />
            <span>{member ? 'Sửa Thông Tin Thành Viên' : 'Thêm Thành Viên Mới'}</span>
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Họ và tên *</label>
            <input
              type="text"
              required
              placeholder="VD: Nguyễn Văn Hoàng"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Chức vụ / Vai trò trong đội</label>
            <input
              type="text"
              placeholder="VD: Tổ trưởng Dựng trại, Phụ trách âm thanh..."
              value={role}
              onChange={e => setRole(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Mảng phụ trách chính</label>
              <select
                value={department}
                onChange={e => setDepartment(e.target.value as TaskDepartment)}
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none cursor-pointer"
              >
                <option value="cam_trai">1. Cắm trại & Dựng cổng</option>
                <option value="van_nghe">2. Văn nghệ 14 em</option>
                <option value="nghi_thuc_doi">3. Nghi thức & Trống cờ</option>
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
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Ghi chú phân công / Kinh nghiệm</label>
            <textarea
              rows={3}
              placeholder="Nhập chuyên môn, điểm mạnh hoặc nhiệm vụ dài hạn..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            {member ? (
              <button
                type="button"
                onClick={() => { onDelete(member.id); onClose(); }}
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

// =========================================================================
// SUBCOMPONENT: PRINT TASKS MODAL (CHUẨN IN ẤN DÁN TẠI LỀU CHỈ HUY)
// =========================================================================
interface PrintTasksModalProps {
  tasks: CampTask[];
  teamMembers: TeamMember[];
  teamName?: string;
  onClose: () => void;
}

const PrintTasksModal: React.FC<PrintTasksModalProps> = ({ tasks, teamMembers, teamName, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-4xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
        {/* Modal Controls */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 print:hidden">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-base">Bảng Phân Công Nhiệm Vụ Hội Trại 2026</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>In Ngay (Print / PDF)</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Content Sheet */}
        <div className="p-4 sm:p-6 text-slate-900 space-y-5 bg-white font-sans text-xs">
          {/* Header */}
          <div className="text-center pb-4 border-b-2 border-slate-900">
            <p className="font-bold uppercase tracking-wide text-xs">ĐOÀN TNCS HỒ CHÍ MINH XÃ HẢI ANH</p>
            <p className="font-bold uppercase tracking-wide text-xs text-slate-700">{teamName ? teamName.toUpperCase() : 'CHI ĐOÀN THÔN 3'}</p>
            <h2 className="text-base sm:text-lg font-black uppercase text-slate-950 mt-2">
              BẢNG PHÂN CÔNG NHIỆM VỤ HỘI TRẠI THU 2026
            </h2>
            <p className="italic text-slate-600 text-[11px] mt-0.5">
              Chủ đề: "LỒNG ĐÈN THẮP SÁNG ƯỚC MƠ" • Địa điểm: Sân vận động trung tâm xã Hải Anh
            </p>
          </div>

          {/* Table of Tasks */}
          <table className="w-full border-collapse border border-slate-300 text-left text-[11px]">
            <thead>
              <tr className="bg-slate-100 font-bold border-b border-slate-300 text-slate-900">
                <th className="border border-slate-300 p-2 w-8 text-center">STT</th>
                <th className="border border-slate-300 p-2 w-48">Nhiệm Vụ / Công Việc</th>
                <th className="border border-slate-300 p-2 w-28">Mảng / Bộ Phận</th>
                <th className="border border-slate-300 p-2 w-36">Người Phụ Trách</th>
                <th className="border border-slate-300 p-2 w-28">Thời Hạn</th>
                <th className="border border-slate-300 p-2 w-24 text-center">Trạng Thái</th>
                <th className="border border-slate-300 p-2">Ghi Chú & Lưu Ý Kỹ Thuật</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task, idx) => {
                const statusLabels: Record<TaskStatus, string> = {
                  completed: 'Đã hoàn thành',
                  in_progress: 'Đang làm',
                  pending: 'Chờ làm',
                  delayed: 'Chậm',
                };
                const deptLabels: Record<TaskDepartment, string> = {
                  cam_trai: 'Cắm trại',
                  van_nghe: 'Văn nghệ',
                  nghi_thuc_doi: 'Nghi thức Đội',
                  hau_can: 'Hậu cần',
                };

                return (
                  <tr key={task.id} className="border-b border-slate-200 hover:bg-slate-50/50">
                    <td className="border border-slate-300 p-2 text-center font-bold">{idx + 1}</td>
                    <td className="border border-slate-300 p-2 font-bold text-slate-950">{task.title}</td>
                    <td className="border border-slate-300 p-2 font-medium">{deptLabels[task.department]}</td>
                    <td className="border border-slate-300 p-2 font-semibold">
                      {task.assigneeName}
                      {task.coAssignees && task.coAssignees.length > 0 && (
                        <span className="block text-[10px] text-slate-500 font-normal">
                          (+ {task.coAssignees.join(', ')})
                        </span>
                      )}
                    </td>
                    <td className="border border-slate-300 p-2 font-mono text-[10px]">{task.deadline}</td>
                    <td className="border border-slate-300 p-2 text-center font-bold">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                        task.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                        task.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                        task.status === 'delayed' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {statusLabels[task.status]}
                      </span>
                    </td>
                    <td className="border border-slate-300 p-2 text-slate-700 italic text-[10.5px]">
                      {task.notes}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Signatures */}
          <div className="grid grid-cols-2 gap-8 pt-8 mt-6 text-center text-xs">
            <div>
              <p className="font-bold uppercase text-slate-900">TỔ TRƯỞNG KỸ THUẬT & DỰNG TRẠI</p>
              <p className="italic text-slate-500 text-[10px] mt-0.5">(Ký và ghi rõ họ tên)</p>
              <div className="h-16" />
              <p className="font-bold text-slate-800">Vũ Đức Minh</p>
            </div>
            <div>
              <p className="italic text-slate-600 text-[11px]">Hải Anh, ngày 13 tháng 8 Âm lịch 2026</p>
              <p className="font-bold uppercase text-slate-900 mt-1">BÍ THƯ CHI ĐOÀN - TỔNG CHỈ HUY</p>
              <p className="italic text-slate-500 text-[10px] mt-0.5">(Ký và duyệt)</p>
              <div className="h-16" />
              <p className="font-bold text-slate-800">Nguyễn Văn Hoàng</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
