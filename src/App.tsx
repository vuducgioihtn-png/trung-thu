import React, { useState } from 'react';
import { 
  Trophy, 
  DollarSign, 
  PackageCheck, 
  Sparkles, 
  Eye, 
  FileText, 
  Printer, 
  BookOpen, 
  HelpCircle, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  Calendar, 
  MapPin, 
  Flame,
  Sun,
  Moon,
  ChevronRight,
  Music,
  Map,
  Ruler,
  Lightbulb,
  Tent,
  Flag,
  Info,
  ArrowRight,
  ListTodo,
  Users
} from 'lucide-react';

import { CampVisualizer } from './components/CampVisualizer';
import { CampSiteHandbook } from './components/CampSiteHandbook';
import { PerformanceManager } from './components/PerformanceManager';
import { PioneerRitualManager } from './components/PioneerRitualManager';
import { AiImageStudio } from './components/AiImageStudio';
import { BudgetEstimator } from './components/BudgetEstimator';
import { MaterialManager } from './components/MaterialManager';
import { ScoreSimulator } from './components/ScoreSimulator';
import { CampGuidelinesModal } from './components/CampGuidelinesModal';
import { PrintReportModal } from './components/PrintReportModal';
import { TaskManager } from './components/TaskManager';
import { LotusModelWorkspace } from './components/lotus_model/LotusModelWorkspace';

import { 
  DEFAULT_CAMP_CONFIG, 
  DEFAULT_PERFORMANCE_CONFIG, 
  INITIAL_MATERIALS, 
  INITIAL_BUDGET 
} from './data/defaultData';
import { 
  DEFAULT_CAMP_TASKS,
  DEFAULT_TEAM_MEMBERS
} from './data/teamTaskData';
import { 
  CampVisualConfig, 
  PerformanceConfig, 
  MaterialItem, 
  BudgetItem,
  MajorGroup,
  MAJOR_GROUPS,
  getCategoryMajorGroup,
  CampTask,
  TeamMember
} from './types/camp';
import { calculateTotalScore } from './utils/scoreCalculator';

export default function App() {
  // Master Project Selector: 'main_plan' (Dự án tổng hợp 3 mảng) | 'lotus_model' (Dự án mẫu cổng hoa sen tách riêng)
  const [activeProject, setActiveProject] = useState<'main_plan' | 'lotus_model'>('lotus_model');

  // Main State
  const [campConfig, setCampConfig] = useState<CampVisualConfig>(DEFAULT_CAMP_CONFIG);
  const [perfConfig, setPerfConfig] = useState<PerformanceConfig>(DEFAULT_PERFORMANCE_CONFIG);
  const [materials, setMaterials] = useState<MaterialItem[]>(INITIAL_MATERIALS);
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>(INITIAL_BUDGET);
  const [tasks, setTasks] = useState<CampTask[]>(DEFAULT_CAMP_TASKS);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(DEFAULT_TEAM_MEMBERS);

  // 3 Major Pillars Filter: 'all' | 'cam_trai' | 'van_nghe' | 'nghi_thuc_doi'
  const [majorPillar, setMajorPillar] = useState<MajorGroup | 'all'>('all');

  // Contextual Tabs per Pillar (with Task Management sub-tab)
  const [camTraiTab, setCamTraiTab] = useState<'visualizer' | 'handbook' | 'materials' | 'budget' | 'tasks' | 'score' | 'ai_studio'>('visualizer');
  const [vanNgheTab, setVanNgheTab] = useState<'perf' | 'materials' | 'budget' | 'tasks' | 'score'>('perf');
  const [ritualTab, setRitualTab] = useState<'ritual' | 'materials' | 'budget' | 'tasks' | 'score'>('ritual');
  const [allTab, setAllTab] = useState<'overview' | 'tasks' | 'visualizer' | 'handbook' | 'performance' | 'ritual' | 'budget' | 'materials' | 'score' | 'ai_studio'>('overview');

  // Modals
  const [isGuidelinesOpen, setIsGuidelinesOpen] = useState<boolean>(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);

  // Overall calculations
  const scoreResult = calculateTotalScore(campConfig, perfConfig);
  const totalBudget = budgetItems.reduce((sum, item) => sum + item.total, 0);
  const completedMaterials = materials.filter(m => m.status === 'completed').length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;

  // Breakdown statistics per pillar
  const camTraiBudget = budgetItems
    .filter(i => getCategoryMajorGroup(i.category) === 'cam_trai')
    .reduce((sum, item) => sum + item.total, 0);
  const vanNgheBudget = budgetItems
    .filter(i => getCategoryMajorGroup(i.category) === 'van_nghe')
    .reduce((sum, item) => sum + item.total, 0);
  const ritualBudget = budgetItems
    .filter(i => getCategoryMajorGroup(i.category) === 'nghi_thuc_doi')
    .reduce((sum, item) => sum + item.total, 0);

  const camTraiMaterials = materials.filter(m => getCategoryMajorGroup(m.category) === 'cam_trai');
  const vanNgheMaterials = materials.filter(m => getCategoryMajorGroup(m.category) === 'van_nghe');
  const ritualMaterials = materials.filter(m => getCategoryMajorGroup(m.category) === 'nghi_thuc_doi');

  const camTraiTasks = tasks.filter(t => t.department === 'cam_trai');
  const camTraiTasksCompleted = camTraiTasks.filter(t => t.status === 'completed').length;
  const vanNgheTasks = tasks.filter(t => t.department === 'van_nghe');
  const vanNgheTasksCompleted = vanNgheTasks.filter(t => t.status === 'completed').length;
  const ritualTasks = tasks.filter(t => t.department === 'nghi_thuc_doi');
  const ritualTasksCompleted = ritualTasks.filter(t => t.status === 'completed').length;

  const handleCampConfigChange = (partial: Partial<CampVisualConfig>) => {
    setCampConfig(prev => ({ ...prev, ...partial }));
  };

  // Quick switch to a major pillar
  const handleSelectPillar = (pillar: MajorGroup | 'all') => {
    setMajorPillar(pillar);
  };

  // Header quick jumps
  const handleHeaderJumpScore = () => {
    if (majorPillar === 'cam_trai') setCamTraiTab('score');
    else if (majorPillar === 'van_nghe') setVanNgheTab('score');
    else if (majorPillar === 'nghi_thuc_doi') setRitualTab('score');
    else setAllTab('score');
  };

  const handleHeaderJumpBudget = () => {
    if (majorPillar === 'cam_trai') setCamTraiTab('budget');
    else if (majorPillar === 'van_nghe') setVanNgheTab('budget');
    else if (majorPillar === 'nghi_thuc_doi') setRitualTab('budget');
    else setAllTab('budget');
  };

  const handleHeaderJumpMaterials = () => {
    if (majorPillar === 'cam_trai') setCamTraiTab('materials');
    else if (majorPillar === 'van_nghe') setVanNgheTab('materials');
    else if (majorPillar === 'nghi_thuc_doi') setRitualTab('materials');
    else setAllTab('materials');
  };

  const handleHeaderJumpTasks = () => {
    if (majorPillar === 'cam_trai') setCamTraiTab('tasks');
    else if (majorPillar === 'van_nghe') setVanNgheTab('tasks');
    else if (majorPillar === 'nghi_thuc_doi') setRitualTab('tasks');
    else setAllTab('tasks');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-emerald-600 selection:text-white">
      {/* Top Notification / Banner */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2.5 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-white tracking-wide">KẾ HOẠCH HỘI TRẠI THU NĂM 2026 - XÃ HẢI ANH</span>
            <span className="hidden md:inline text-slate-600">•</span>
            <span className="hidden md:inline text-emerald-400 font-medium">Chủ đề: "Lồng đèn thắp sáng ước mơ"</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>Dịp Tết Trung Thu 2026</span>
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              <span>Sân vận động Xã Hải Anh</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main App Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Branding & Subtitle */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-bold shadow-sm shrink-0">
                <Flame className="w-5 h-5 fill-white text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-900">
                    HỘI TRẠI THU <span className="text-emerald-600">2026</span> - XÃ HẢI ANH
                  </h1>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                    3 PHẦN CHÍNH
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Phân chia cụ thể 3 mảng: <strong>Cắm trại (70đ)</strong> • <strong>Văn nghệ (20đ)</strong> • <strong>Nghi thức Đội (20đ)</strong>
                </p>
              </div>
            </div>

            {/* Quick KPI Badges & Primary Actions */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Score Metric Pill */}
              <div 
                onClick={handleHeaderJumpScore}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-emerald-300 transition-colors cursor-pointer shadow-2xs"
                title="Bấm để xem thẩm định điểm thi đua chi tiết"
              >
                <Trophy className="w-4 h-4 text-amber-500" />
                <div className="text-left">
                  <p className="text-[10px] uppercase font-bold text-slate-500 leading-none">Dự kiến điểm</p>
                  <p className="text-xs font-bold text-slate-900 font-mono mt-0.5 leading-none">
                    <span className="text-emerald-600 font-bold">{scoreResult.totalScore}</span>/110 đ
                  </p>
                </div>
              </div>

              {/* Budget Metric Pill */}
              <div 
                onClick={handleHeaderJumpBudget}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-emerald-300 transition-colors cursor-pointer shadow-2xs"
                title="Bấm để xem chi tiết dự trù kinh phí"
              >
                <DollarSign className="w-4 h-4 text-slate-600" />
                <div className="text-left">
                  <p className="text-[10px] uppercase font-bold text-slate-500 leading-none">Dự trù kinh phí</p>
                  <p className="text-xs font-bold text-slate-900 font-mono mt-0.5 leading-none">
                    {totalBudget.toLocaleString('vi-VN')} đ
                  </p>
                </div>
              </div>

              {/* Materials Metric Pill */}
              <div 
                onClick={handleHeaderJumpMaterials}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-emerald-300 transition-colors cursor-pointer shadow-2xs"
                title="Bấm để quản lý danh sách vật tư"
              >
                <PackageCheck className="w-4 h-4 text-emerald-600" />
                <div className="text-left">
                  <p className="text-[10px] uppercase font-bold text-slate-500 leading-none">Vật tư sẵn sàng</p>
                  <p className="text-xs font-bold text-slate-900 font-mono mt-0.5 leading-none">
                    <span className="text-emerald-600 font-bold">{completedMaterials}</span>/{materials.length} mục
                  </p>
                </div>
              </div>

              {/* Tasks Metric Pill */}
              <div 
                onClick={handleHeaderJumpTasks}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-emerald-300 transition-colors cursor-pointer shadow-2xs"
                title="Bấm để quản lý phân công nhiệm vụ và ghi chú từng thành viên"
              >
                <ListTodo className="w-4 h-4 text-indigo-600" />
                <div className="text-left">
                  <p className="text-[10px] uppercase font-bold text-slate-500 leading-none">Phân công việc</p>
                  <p className="text-xs font-bold text-slate-900 font-mono mt-0.5 leading-none">
                    <span className="text-emerald-600 font-bold">{completedTasks}</span>/{tasks.length} xong
                  </p>
                </div>
              </div>

              {/* Modals Triggers */}
              <button
                id="btn-open-guidelines-modal"
                onClick={() => setIsGuidelinesOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer border border-slate-200 shadow-2xs"
              >
                <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                <span>Quy Định (110đ)</span>
              </button>

              <button
                id="btn-open-print-modal"
                onClick={() => setIsPrintModalOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors cursor-pointer shadow-sm"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>In Bản Dự Trù (3 Phần)</span>
              </button>
            </div>
          </div>

          {/* MASTER PROJECT SWITCHER (CHỌN DỰ ÁN) */}
          <div className="mt-3.5 pt-3 border-t border-slate-200 flex items-center flex-wrap justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Không Gian Dự Án:</span>
              </span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                id="btn-switch-lotus-model"
                onClick={() => setActiveProject('lotus_model')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  activeProject === 'lotus_model'
                    ? 'bg-amber-500 text-slate-950 shadow-sm font-black ring-2 ring-amber-400/50'
                    : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200'
                }`}
              >
                <Sparkles className="w-4 h-4 text-amber-900" />
                <span>Dự Án 2: Mẫu Cổng Tam Quan Hoa Sen (Tách Riêng Theo Ảnh)</span>
                <span className="px-1.5 py-0.5 rounded-full text-[9px] bg-rose-600 text-white font-extrabold uppercase animate-pulse">
                  Mới
                </span>
              </button>

              <button
                id="btn-switch-main-plan"
                onClick={() => setActiveProject('main_plan')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  activeProject === 'main_plan'
                    ? 'bg-slate-900 text-white shadow-sm font-bold'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                <Layers className="w-4 h-4 text-emerald-600" />
                <span>Dự Án 1: Kế Hoạch Hội Trại Tổng Hợp (3 Mảng 110đ)</span>
              </button>
            </div>
          </div>

          {/* 3 MAJOR PILLARS PERSISTENT SELECTOR STRIP (Only active when in Project 1) */}
          {activeProject === 'main_plan' && (
            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center flex-wrap justify-between gap-2.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-emerald-600" />
                  <span>3 Mảng Trọng Tâm:</span>
                </span>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  id="btn-pillar-all"
                  onClick={() => handleSelectPillar('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    majorPillar === 'all'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Toàn Bộ Dự Án</span>
                </button>

                <button
                  id="btn-pillar-cam-trai"
                  onClick={() => handleSelectPillar('cam_trai')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    majorPillar === 'cam_trai'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                  }`}
                >
                  <Tent className="w-3.5 h-3.5" />
                  <span>1. CẮM TRẠI (Cổng & Lều 70đ)</span>
                </button>

                <button
                  id="btn-pillar-van-nghe"
                  onClick={() => handleSelectPillar('van_nghe')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    majorPillar === 'van_nghe'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-indigo-50 text-indigo-800 hover:bg-indigo-100 border border-indigo-200'
                  }`}
                >
                  <Music className="w-3.5 h-3.5" />
                  <span>2. VĂN NGHỆ (14 Em Hát Múa 20đ)</span>
                </button>

                <button
                  id="btn-pillar-nghi-thuc"
                  onClick={() => handleSelectPillar('nghi_thuc_doi')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    majorPillar === 'nghi_thuc_doi'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200'
                  }`}
                >
                  <Flag className="w-3.5 h-3.5" />
                  <span>3. NGHI THỨC ĐỘI (Trống Cờ & Góc Học Tập 20đ)</span>
                </button>
              </div>
            </div>
          )}

          {/* Dynamic Navigation Tabs based on Selected Pillar */}
          {majorPillar === 'cam_trai' && (
            <nav className="flex items-center gap-1.5 sm:gap-2 mt-3 pt-2.5 border-t border-slate-100 overflow-x-auto text-xs font-medium scrollbar-none">
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-lg shrink-0 flex items-center gap-1.5">
                <Tent className="w-3.5 h-3.5 text-emerald-600" />
                Mục Cắm Trại:
              </span>
              <button
                id="tab-cam-visualizer"
                onClick={() => setCamTraiTab('visualizer')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                  camTraiTab === 'visualizer'
                    ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Eye className="w-4 h-4" />
                <span>Phối Cảnh Cổng & Lều Trại (3D/2D)</span>
              </button>
              <button
                id="tab-cam-handbook"
                onClick={() => setCamTraiTab('handbook')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                  camTraiTab === 'handbook'
                    ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Map className="w-4 h-4" />
                <span>Mặt Bằng 2D & Cẩm Nang Kỹ Thuật (8m×10m)</span>
              </button>
              <button
                id="tab-cam-materials"
                onClick={() => setCamTraiTab('materials')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                  camTraiTab === 'materials'
                    ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <PackageCheck className="w-4 h-4" />
                <span>Vật Tư Cắm Trại</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800">
                  {camTraiMaterials.length} mục
                </span>
              </button>
              <button
                id="tab-cam-budget"
                onClick={() => setCamTraiTab('budget')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                  camTraiTab === 'budget'
                    ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <DollarSign className="w-4 h-4" />
                <span>Kinh Phí Cắm Trại</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800">
                  {camTraiBudget.toLocaleString('vi-VN')} đ
                </span>
              </button>
              <button
                id="tab-cam-tasks"
                onClick={() => setCamTraiTab('tasks')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                  camTraiTab === 'tasks'
                    ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <ListTodo className="w-4 h-4" />
                <span>Phân Công Cắm Trại</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800">
                  {camTraiTasksCompleted}/{camTraiTasks.length} việc
                </span>
              </button>
              <button
                id="tab-cam-score"
                onClick={() => setCamTraiTab('score')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                  camTraiTab === 'score'
                    ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Trophy className="w-4 h-4" />
                <span>Biểu Điểm Cắm Trại (70đ / 90đ)</span>
              </button>
              <button
                id="tab-cam-ai"
                onClick={() => setCamTraiTab('ai_studio')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                  camTraiTab === 'ai_studio'
                    ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Studio Ảnh AI Cổng Trại</span>
              </button>
            </nav>
          )}

          {majorPillar === 'van_nghe' && (
            <nav className="flex items-center gap-1.5 sm:gap-2 mt-3 pt-2.5 border-t border-slate-100 overflow-x-auto text-xs font-medium scrollbar-none">
              <span className="text-[11px] font-bold text-indigo-800 bg-indigo-100 px-2.5 py-1 rounded-lg shrink-0 flex items-center gap-1.5">
                <Music className="w-3.5 h-3.5 text-indigo-600" />
                Mục Văn Nghệ:
              </span>
              <button
                id="tab-van-perf"
                onClick={() => setVanNgheTab('perf')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                  vanNgheTab === 'perf'
                    ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Music className="w-4 h-4" />
                <span>Kịch Bản Biểu Diễn (14 Em • 3 Tiết Mục)</span>
              </button>
              <button
                id="tab-van-materials"
                onClick={() => setVanNgheTab('materials')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                  vanNgheTab === 'materials'
                    ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <PackageCheck className="w-4 h-4" />
                <span>Đạo Cụ & Đèn Lồng</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold bg-indigo-100 text-indigo-800">
                  {vanNgheMaterials.length} mục
                </span>
              </button>
              <button
                id="tab-van-budget"
                onClick={() => setVanNgheTab('budget')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                  vanNgheTab === 'budget'
                    ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <DollarSign className="w-4 h-4" />
                <span>Kinh Phí & Thuê Trang Phục</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold bg-indigo-100 text-indigo-800">
                  {vanNgheBudget.toLocaleString('vi-VN')} đ
                </span>
              </button>
              <button
                id="tab-van-tasks"
                onClick={() => setVanNgheTab('tasks')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                  vanNgheTab === 'tasks'
                    ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <ListTodo className="w-4 h-4" />
                <span>Phân Công Văn Nghệ</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold bg-indigo-100 text-indigo-800">
                  {vanNgheTasksCompleted}/{vanNgheTasks.length} việc
                </span>
              </button>
              <button
                id="tab-van-score"
                onClick={() => setVanNgheTab('score')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                  vanNgheTab === 'score'
                    ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Trophy className="w-4 h-4" />
                <span>Biểu Điểm Văn Nghệ (20đ - Hát 10đ, Múa 10đ)</span>
              </button>
            </nav>
          )}

          {majorPillar === 'nghi_thuc_doi' && (
            <nav className="flex items-center gap-1.5 sm:gap-2 mt-3 pt-2.5 border-t border-slate-100 overflow-x-auto text-xs font-medium scrollbar-none">
              <span className="text-[11px] font-bold text-amber-900 bg-amber-100 px-2.5 py-1 rounded-lg shrink-0 flex items-center gap-1.5">
                <Flag className="w-3.5 h-3.5 text-amber-700" />
                Mục Nghi Thức Đội:
              </span>
              <button
                id="tab-rit-main"
                onClick={() => setRitualTab('ritual')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                  ritualTab === 'ritual'
                    ? 'bg-amber-600 text-white shadow-xs font-semibold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Flag className="w-4 h-4" />
                <span>Bố Trí Lều, Dàn Trống & 6 Nghi Thức</span>
              </button>
              <button
                id="tab-rit-materials"
                onClick={() => setRitualTab('materials')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                  ritualTab === 'materials'
                    ? 'bg-amber-600 text-white shadow-xs font-semibold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <PackageCheck className="w-4 h-4" />
                <span>Thiết Bị Trống Cờ & Góc Học Tập</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold bg-amber-100 text-amber-900">
                  {ritualMaterials.length} mục
                </span>
              </button>
              <button
                id="tab-rit-budget"
                onClick={() => setRitualTab('budget')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                  ritualTab === 'budget'
                    ? 'bg-amber-600 text-white shadow-xs font-semibold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <DollarSign className="w-4 h-4" />
                <span>Kinh Phí Nghi Thức Đội</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold bg-amber-100 text-amber-900">
                  {ritualBudget.toLocaleString('vi-VN')} đ
                </span>
              </button>
              <button
                id="tab-rit-tasks"
                onClick={() => setRitualTab('tasks')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                  ritualTab === 'tasks'
                    ? 'bg-amber-600 text-white shadow-xs font-semibold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <ListTodo className="w-4 h-4" />
                <span>Phân Công Nghi Thức</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold bg-amber-100 text-amber-900">
                  {ritualTasksCompleted}/{ritualTasks.length} việc
                </span>
              </button>
              <button
                id="tab-rit-score"
                onClick={() => setRitualTab('score')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                  ritualTab === 'score'
                    ? 'bg-amber-600 text-white shadow-xs font-semibold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Trophy className="w-4 h-4" />
                <span>Biểu Điểm Nghi Thức Đội (20đ)</span>
              </button>
            </nav>
          )}

          {majorPillar === 'all' && (
            <nav className="flex items-center gap-1.5 sm:gap-2 mt-3 pt-2.5 border-t border-slate-100 overflow-x-auto text-xs font-medium scrollbar-none">
              <button
                id="tab-all-overview"
                onClick={() => setAllTab('overview')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                  allTab === 'overview'
                    ? 'bg-slate-900 text-white shadow-xs font-semibold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Bảng Tổng Quan 3 Dự Án</span>
              </button>
              <button
                id="tab-all-tasks"
                onClick={() => setAllTab('tasks')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                  allTab === 'tasks'
                    ? 'bg-slate-900 text-white shadow-xs font-semibold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <ListTodo className="w-4 h-4 text-emerald-400" />
                <span>Phân Công Nhiệm Vụ</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800">
                  {completedTasks}/{tasks.length} xong
                </span>
              </button>
              <button
                id="tab-all-visualizer"
                onClick={() => setAllTab('visualizer')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                  allTab === 'visualizer'
                    ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Eye className="w-4 h-4" />
                <span>1. Phối Cảnh Cắm Trại (70đ)</span>
              </button>
              <button
                id="tab-all-handbook"
                onClick={() => setAllTab('handbook')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                  allTab === 'handbook'
                    ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Map className="w-4 h-4" />
                <span>Mặt Bằng 2D (8m×10m)</span>
              </button>
              <button
                id="tab-all-perf"
                onClick={() => setAllTab('performance')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                  allTab === 'performance'
                    ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Music className="w-4 h-4" />
                <span>2. Kịch Bản Văn Nghệ (20đ)</span>
              </button>
              <button
                id="tab-all-ritual"
                onClick={() => setAllTab('ritual')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                  allTab === 'ritual'
                    ? 'bg-amber-600 text-white shadow-xs font-semibold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Flag className="w-4 h-4" />
                <span>3. Nghi Thức Đội (20đ)</span>
              </button>
              <button
                id="tab-all-budget"
                onClick={() => setAllTab('budget')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                  allTab === 'budget'
                    ? 'bg-slate-900 text-white shadow-xs font-semibold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <DollarSign className="w-4 h-4" />
                <span>Kinh Phí Toàn Đoàn (3 Phần)</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold bg-slate-100 text-slate-700">
                  {totalBudget.toLocaleString('vi-VN')} đ
                </span>
              </button>
              <button
                id="tab-all-materials"
                onClick={() => setAllTab('materials')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                  allTab === 'materials'
                    ? 'bg-slate-900 text-white shadow-xs font-semibold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <PackageCheck className="w-4 h-4" />
                <span>Kho Vật Tư Toàn Đoàn</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold bg-slate-100 text-slate-700">
                  {materials.length} mục
                </span>
              </button>
              <button
                id="tab-all-score"
                onClick={() => setAllTab('score')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                  allTab === 'score'
                    ? 'bg-slate-900 text-white shadow-xs font-semibold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Trophy className="w-4 h-4" />
                <span>Thẩm Định Điểm (110đ)</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold bg-amber-400 text-slate-950">
                  {scoreResult.totalScore}đ
                </span>
              </button>
              <button
                id="tab-all-ai"
                onClick={() => setAllTab('ai_studio')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                  allTab === 'ai_studio'
                    ? 'bg-slate-900 text-white shadow-xs font-semibold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Studio Ảnh AI</span>
              </button>
            </nav>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeProject === 'lotus_model' ? (
          <LotusModelWorkspace
            onBackToMainProject={() => setActiveProject('main_plan')}
            tasks={tasks}
            teamMembers={teamMembers}
            onUpdateTasks={setTasks}
            onUpdateMembers={setTeamMembers}
          />
        ) : (
          <>
            {/* Callout Banner to switch to Lotus Model */}
            <div className="bg-gradient-to-r from-amber-500/15 via-rose-500/10 to-amber-500/15 border border-amber-300/80 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shrink-0 shadow-xs">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-slate-900">Dự Án Mẫu Thực Tế: Cổng Tam Quan Hoa Sen & Lều Chỉ Huy 2026</h3>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-200 text-amber-900 uppercase">Tách riêng theo ảnh</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    6 hoa sen LED hồng, đèn lồng cá chép, bàn học sinh đèn rọi bên phải, cờ trống bên trái, bóc tách BOM và barem 110đ.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveProject('lotus_model')}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                <span>Chuyển Sang Dự Án Mẫu Này</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* ========================================================================= */}
            {/* WORKSPACE 1: DỰ ÁN CẮM TRẠI (CỔNG & LỀU 70Đ - 90Đ)                      */}
            {/* ========================================================================= */}
            {majorPillar === 'cam_trai' && (
          <div className="space-y-6">
            {/* Project 1 Banner Header */}
            <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white p-5 rounded-2xl shadow-sm border border-emerald-700/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center shrink-0">
                  <Tent className="w-6 h-6 text-emerald-300" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/30 text-emerald-200 border border-emerald-400/40">
                      DỰ ÁN 1
                    </span>
                    <h2 className="text-lg font-bold tracking-tight text-white">
                      CẮM TRẠI & KHUÔN VIÊN TRẠI (70 ĐIỂM / 90 ĐIỂM)
                    </h2>
                  </div>
                  <p className="text-xs text-emerald-100/80 mt-1 leading-relaxed">
                    Cổng hộp kép 4 trụ <strong>1,8m × 1,2m</strong> • Mặt bằng <strong>8m × 10m</strong> • Kỹ thuật 8 cọc néo 80cm nút thuyền chài chịu bão
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 text-xs font-mono">
                <div className="bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-700/40 text-right">
                  <p className="text-[10px] text-emerald-300 uppercase font-bold font-sans">Kinh phí cắm trại</p>
                  <p className="font-bold text-white mt-0.5">{camTraiBudget.toLocaleString('vi-VN')} đ</p>
                </div>
                <div className="bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-700/40 text-right">
                  <p className="text-[10px] text-emerald-300 uppercase font-bold font-sans">Vật tư cắm trại</p>
                  <p className="font-bold text-white mt-0.5">{camTraiMaterials.length} loại</p>
                </div>
              </div>
            </div>

            {/* Content for chosen sub-tab */}
            {camTraiTab === 'visualizer' && (
              <CampVisualizer
                config={campConfig}
                onChangeConfig={handleCampConfigChange}
              />
            )}

            {camTraiTab === 'handbook' && (
              <CampSiteHandbook />
            )}

            {camTraiTab === 'materials' && (
              <MaterialManager
                materials={materials}
                onUpdateMaterials={setMaterials}
                initialGroupFilter="cam_trai"
              />
            )}

            {camTraiTab === 'budget' && (
              <BudgetEstimator
                items={budgetItems}
                onUpdateItems={setBudgetItems}
                onOpenPrintModal={() => setIsPrintModalOpen(true)}
                initialGroupFilter="cam_trai"
              />
            )}

            {camTraiTab === 'tasks' && (
              <TaskManager
                tasks={tasks}
                teamMembers={teamMembers}
                onUpdateTasks={setTasks}
                onUpdateMembers={setTeamMembers}
                initialDepartmentFilter="cam_trai"
              />
            )}

            {camTraiTab === 'score' && (
              <ScoreSimulator
                campConfig={campConfig}
                performanceConfig={perfConfig}
                onUpdateCampConfig={setCampConfig}
                onUpdatePerfConfig={setPerfConfig}
                initialTab="gate"
              />
            )}

            {camTraiTab === 'ai_studio' && (
              <AiImageStudio config={campConfig} />
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* WORKSPACE 2: DỰ ÁN VĂN NGHỆ (14 EM HÁT MÚA 20Đ)                           */}
        {/* ========================================================================= */}
        {majorPillar === 'van_nghe' && (
          <div className="space-y-6">
            {/* Project 2 Banner Header */}
            <div className="bg-gradient-to-r from-indigo-950 via-indigo-900 to-purple-950 text-white p-5 rounded-2xl shadow-sm border border-indigo-700/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center shrink-0">
                  <Music className="w-6 h-6 text-indigo-300" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/30 text-indigo-200 border border-indigo-400/40">
                      DỰ ÁN 2
                    </span>
                    <h2 className="text-lg font-bold tracking-tight text-white">
                      HỘI THI VĂN NGHỆ THIẾU NHI (TIÊU CHUẨN 20 ĐIỂM)
                    </h2>
                  </div>
                  <p className="text-xs text-indigo-100/80 mt-1 leading-relaxed">
                    Đội hình chuẩn <strong>14 em (6 nam + 8 nữ)</strong> • 3 tiết mục (Hát 10đ + Múa 10đ) • Thời lượng 7-10 phút • Đạo cụ 14 đèn ông sao led, quạt lụa, hoa sen
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 text-xs font-mono">
                <div className="bg-indigo-950/60 px-3 py-1.5 rounded-xl border border-indigo-700/40 text-right">
                  <p className="text-[10px] text-indigo-300 uppercase font-bold font-sans">Kinh phí văn nghệ</p>
                  <p className="font-bold text-white mt-0.5">{vanNgheBudget.toLocaleString('vi-VN')} đ</p>
                </div>
                <div className="bg-indigo-950/60 px-3 py-1.5 rounded-xl border border-indigo-700/40 text-right">
                  <p className="text-[10px] text-indigo-300 uppercase font-bold font-sans">Đạo cụ & Trang phục</p>
                  <p className="font-bold text-white mt-0.5">{vanNgheMaterials.length} loại</p>
                </div>
              </div>
            </div>

            {/* Content for chosen sub-tab */}
            {vanNgheTab === 'perf' && (
              <PerformanceManager />
            )}

            {vanNgheTab === 'materials' && (
              <MaterialManager
                materials={materials}
                onUpdateMaterials={setMaterials}
                initialGroupFilter="van_nghe"
              />
            )}

            {vanNgheTab === 'budget' && (
              <BudgetEstimator
                items={budgetItems}
                onUpdateItems={setBudgetItems}
                onOpenPrintModal={() => setIsPrintModalOpen(true)}
                initialGroupFilter="van_nghe"
              />
            )}

            {vanNgheTab === 'tasks' && (
              <TaskManager
                tasks={tasks}
                teamMembers={teamMembers}
                onUpdateTasks={setTasks}
                onUpdateMembers={setTeamMembers}
                initialDepartmentFilter="van_nghe"
              />
            )}

            {vanNgheTab === 'score' && (
              <ScoreSimulator
                campConfig={campConfig}
                performanceConfig={perfConfig}
                onUpdateCampConfig={setCampConfig}
                onUpdatePerfConfig={setPerfConfig}
                initialTab="performance"
              />
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* WORKSPACE 3: DỰ ÁN NGHI THỨC ĐỘI & BÀI TRÍ TRẠI (20Đ)                     */}
        {/* ========================================================================= */}
        {majorPillar === 'nghi_thuc_doi' && (
          <div className="space-y-6">
            {/* Project 3 Banner Header */}
            <div className="bg-gradient-to-r from-amber-950 via-amber-900 to-orange-950 text-white p-5 rounded-2xl shadow-sm border border-amber-700/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center shrink-0">
                  <Flag className="w-6 h-6 text-amber-300" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/30 text-amber-200 border border-amber-400/40">
                      DỰ ÁN 3
                    </span>
                    <h2 className="text-lg font-bold tracking-tight text-white">
                      NGHI THỨC ĐỘI, DÀN TRỐNG & BÀI TRÍ TRẠI (20 ĐIỂM)
                    </h2>
                  </div>
                  <p className="text-xs text-amber-100/80 mt-1 leading-relaxed">
                    Quy định bắt buộc: <strong>Bàn học & đèn bàn học BÊN PHẢI</strong> • <strong>Khẩu hiệu 'Thiếu nhi Ninh Bình...' BÊN TRÁI</strong> • Dàn trống Đội 3 chiếc gõ 3 bài quy định
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 text-xs font-mono">
                <div className="bg-amber-950/60 px-3 py-1.5 rounded-xl border border-amber-700/40 text-right">
                  <p className="text-[10px] text-amber-300 uppercase font-bold font-sans">Kinh phí nghi thức</p>
                  <p className="font-bold text-white mt-0.5">{ritualBudget.toLocaleString('vi-VN')} đ</p>
                </div>
                <div className="bg-amber-950/60 px-3 py-1.5 rounded-xl border border-amber-700/40 text-right">
                  <p className="text-[10px] text-amber-300 uppercase font-bold font-sans">Thiết bị & Cờ trống</p>
                  <p className="font-bold text-white mt-0.5">{ritualMaterials.length} loại</p>
                </div>
              </div>
            </div>

            {/* Content for chosen sub-tab */}
            {ritualTab === 'ritual' && (
              <PioneerRitualManager />
            )}

            {ritualTab === 'materials' && (
              <MaterialManager
                materials={materials}
                onUpdateMaterials={setMaterials}
                initialGroupFilter="nghi_thuc_doi"
              />
            )}

            {ritualTab === 'budget' && (
              <BudgetEstimator
                items={budgetItems}
                onUpdateItems={setBudgetItems}
                onOpenPrintModal={() => setIsPrintModalOpen(true)}
                initialGroupFilter="nghi_thuc_doi"
              />
            )}

            {ritualTab === 'tasks' && (
              <TaskManager
                tasks={tasks}
                teamMembers={teamMembers}
                onUpdateTasks={setTasks}
                onUpdateMembers={setTeamMembers}
                initialDepartmentFilter="nghi_thuc_doi"
              />
            )}

            {ritualTab === 'score' && (
              <ScoreSimulator
                campConfig={campConfig}
                performanceConfig={perfConfig}
                onUpdateCampConfig={setCampConfig}
                onUpdatePerfConfig={setPerfConfig}
                initialTab="interior"
              />
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* WORKSPACE 4: TOÀN BỘ DỰ ÁN (TỔNG THỂ 110 ĐIỂM)                           */}
        {/* ========================================================================= */}
        {majorPillar === 'all' && (
          <div className="space-y-6">
            {/* Integrated Overview Dashboard */}
            {allTab === 'overview' && (
              <div className="space-y-6">
                {/* Global Overview Header Card */}
                <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-sm border border-slate-800 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                  <div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      TỔNG HỢP HỘI TRẠI THU 2026
                    </span>
                    <h2 className="text-xl font-bold tracking-tight text-white mt-2">
                      Kế Hoạch Tổng Thể 3 Mảng Trọng Tâm - Xã Hải Anh
                    </h2>
                    <p className="text-sm text-slate-400 mt-1.5 max-w-2xl leading-relaxed">
                      Hệ thống quản lý chuyên sâu kết nối đồng bộ 3 mảng: Cắm trại kỹ thuật, Kịch bản văn nghệ 14 em và Nghi thức Đội thiếu niên tiền phong. Thẩm định điểm 110đ theo quy chế chính thức.
                    </p>
                  </div>

                  <div className="flex items-center gap-3 flex-wrap">
                    <button
                      onClick={() => setIsPrintModalOpen(true)}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
                    >
                      <Printer className="w-4 h-4" />
                      <span>In Báo Cáo Dự Trù (3 Phần)</span>
                    </button>
                    <button
                      onClick={() => setIsGuidelinesOpen(true)}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700 cursor-pointer"
                    >
                      <Info className="w-4 h-4" />
                      <span>Xem Văn Bản Quy Định</span>
                    </button>
                  </div>
                </div>

                {/* Team Task Assignment Quick Banner */}
                <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-4 sm:p-5 border border-indigo-800/40 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center shrink-0">
                      <ListTodo className="w-5 h-5 text-indigo-300" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-sm text-white">
                          Quản Lý Phân Công Nhiệm Vụ & Nhân Sự ({tasks.length} Việc • {teamMembers.length} Thành Viên)
                        </h3>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          {completedTasks}/{tasks.length} hoàn thành
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                        Phân công rõ ràng theo 4 ban (Cắm trại, Văn nghệ, Nghi thức, Hậu cần), theo dõi tiến độ checklist, thời hạn và ghi chú tình trạng từng thành viên.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setAllTab('tasks')}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shrink-0 cursor-pointer shadow-xs"
                  >
                    <Users className="w-4 h-4" />
                    <span>Mở Bảng Phân Công Việc</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* 3 Project Summary Cards with Direct Workspace Jump Buttons */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {/* Card 1: Cắm trại */}
                  <div className="bg-white rounded-2xl border-2 border-emerald-200 hover:border-emerald-500 p-5 shadow-xs transition-all flex flex-col justify-between group">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                          MẢNG 1 • 70-90 ĐIỂM
                        </span>
                        <Tent className="w-5 h-5 text-emerald-600" />
                      </div>
                      <h3 className="font-bold text-base text-slate-900 mt-3 flex items-center gap-2">
                        1. Cắm Trại & Khuôn Viên Trại
                      </h3>
                      <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                        Cổng hộp kép 4 trụ vuông và 2 cửa lách phụ; cửa chính rộng 1,2m cao 1,8m. Mặt bằng 8m×10m, 8 cọc néo 80cm nút thuyền chài.
                      </p>

                      <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-3 gap-1.5 text-xs">
                        <div className="bg-slate-50 p-2 rounded-lg">
                          <p className="text-[10px] text-slate-500 font-medium">Vật tư</p>
                          <p className="font-bold text-slate-800 font-mono text-[11px]">{camTraiMaterials.length} loại</p>
                        </div>
                        <div className="bg-slate-50 p-2 rounded-lg">
                          <p className="text-[10px] text-slate-500 font-medium">Kinh phí</p>
                          <p className="font-bold text-emerald-700 font-mono text-[11px]">{camTraiBudget.toLocaleString('vi-VN')} đ</p>
                        </div>
                        <div className="bg-slate-50 p-2 rounded-lg">
                          <p className="text-[10px] text-slate-500 font-medium">Nhiệm vụ</p>
                          <p className="font-bold text-slate-800 font-mono text-[11px]">{camTraiTasksCompleted}/{camTraiTasks.length} xong</p>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleSelectPillar('cam_trai')}
                      className="mt-5 w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all cursor-pointer shadow-2xs"
                    >
                      <span>Vào Chi Tiết Dự Án Cắm Trại</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>

                  {/* Card 2: Văn nghệ */}
                  <div className="bg-white rounded-2xl border-2 border-indigo-200 hover:border-indigo-500 p-5 shadow-xs transition-all flex flex-col justify-between group">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-100 text-indigo-800">
                          MẢNG 2 • 20 ĐIỂM
                        </span>
                        <Music className="w-5 h-5 text-indigo-600" />
                      </div>
                      <h3 className="font-bold text-base text-slate-900 mt-3 flex items-center gap-2">
                        2. Hội Thi Văn Nghệ Thiếu Nhi
                      </h3>
                      <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                        Đội hình 14 em (6 nam + 8 nữ), 3 bài hát múa thời lượng 7-10 phút. Cue sheet kỹ thuật ánh sáng led, đạo cụ lồng đèn ông sao, quạt lụa, hoa sen.
                      </p>

                      <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-3 gap-1.5 text-xs">
                        <div className="bg-slate-50 p-2 rounded-lg">
                          <p className="text-[10px] text-slate-500 font-medium">Đạo cụ</p>
                          <p className="font-bold text-slate-800 font-mono text-[11px]">{vanNgheMaterials.length} loại</p>
                        </div>
                        <div className="bg-slate-50 p-2 rounded-lg">
                          <p className="text-[10px] text-slate-500 font-medium">Kinh phí</p>
                          <p className="font-bold text-indigo-700 font-mono text-[11px]">{vanNgheBudget.toLocaleString('vi-VN')} đ</p>
                        </div>
                        <div className="bg-slate-50 p-2 rounded-lg">
                          <p className="text-[10px] text-slate-500 font-medium">Nhiệm vụ</p>
                          <p className="font-bold text-slate-800 font-mono text-[11px]">{vanNgheTasksCompleted}/{vanNgheTasks.length} xong</p>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleSelectPillar('van_nghe')}
                      className="mt-5 w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all cursor-pointer shadow-2xs"
                    >
                      <span>Vào Chi Tiết Dự Án Văn Nghệ</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>

                  {/* Card 3: Nghi thức Đội */}
                  <div className="bg-white rounded-2xl border-2 border-amber-200 hover:border-amber-500 p-5 shadow-xs transition-all flex flex-col justify-between group">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900">
                          MẢNG 3 • 20 ĐIỂM
                        </span>
                        <Flag className="w-5 h-5 text-amber-700" />
                      </div>
                      <h3 className="font-bold text-base text-slate-900 mt-3 flex items-center gap-2">
                        3. Nghi Thức Đội & Trống Cờ
                      </h3>
                      <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                        Quy định bắt buộc: Bàn học đèn bàn BÊN PHẢI; Khẩu hiệu & Trống Đội BÊN TRÁI. Mô phỏng dàn trống 3 chiếc (Chào cờ, Hành tiến, Chào mừng).
                      </p>

                      <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-3 gap-1.5 text-xs">
                        <div className="bg-slate-50 p-2 rounded-lg">
                          <p className="text-[10px] text-slate-500 font-medium">Thiết bị</p>
                          <p className="font-bold text-slate-800 font-mono text-[11px]">{ritualMaterials.length} loại</p>
                        </div>
                        <div className="bg-slate-50 p-2 rounded-lg">
                          <p className="text-[10px] text-slate-500 font-medium">Kinh phí</p>
                          <p className="font-bold text-amber-800 font-mono text-[11px]">{ritualBudget.toLocaleString('vi-VN')} đ</p>
                        </div>
                        <div className="bg-slate-50 p-2 rounded-lg">
                          <p className="text-[10px] text-slate-500 font-medium">Nhiệm vụ</p>
                          <p className="font-bold text-slate-800 font-mono text-[11px]">{ritualTasksCompleted}/{ritualTasks.length} xong</p>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleSelectPillar('nghi_thuc_doi')}
                      className="mt-5 w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-all cursor-pointer shadow-2xs"
                    >
                      <span>Vào Chi Tiết Nghi Thức Đội</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>

                {/* Quick Interactive Visualizer preview */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Eye className="w-4 h-4 text-emerald-600" />
                      Phối Cảnh Nhanh Cổng Trại & Lều Trại
                    </h3>
                    <button
                      onClick={() => setAllTab('visualizer')}
                      className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
                    >
                      <span>Mở bản vẽ toàn màn hình</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <CampVisualizer
                    config={campConfig}
                    onChangeConfig={handleCampConfigChange}
                  />
                </div>
              </div>
            )}

            {allTab === 'tasks' && (
              <TaskManager
                tasks={tasks}
                teamMembers={teamMembers}
                onUpdateTasks={setTasks}
                onUpdateMembers={setTeamMembers}
                initialDepartmentFilter="all"
              />
            )}

            {allTab === 'visualizer' && (
              <CampVisualizer
                config={campConfig}
                onChangeConfig={handleCampConfigChange}
              />
            )}

            {allTab === 'handbook' && (
              <CampSiteHandbook />
            )}

            {allTab === 'performance' && (
              <PerformanceManager />
            )}

            {allTab === 'ritual' && (
              <PioneerRitualManager />
            )}

            {allTab === 'budget' && (
              <BudgetEstimator
                items={budgetItems}
                onUpdateItems={setBudgetItems}
                onOpenPrintModal={() => setIsPrintModalOpen(true)}
                initialGroupFilter="all"
              />
            )}

            {allTab === 'materials' && (
              <MaterialManager
                materials={materials}
                onUpdateMaterials={setMaterials}
                initialGroupFilter="all"
              />
            )}

            {allTab === 'score' && (
              <ScoreSimulator
                campConfig={campConfig}
                performanceConfig={perfConfig}
                onUpdateCampConfig={setCampConfig}
                onUpdatePerfConfig={setPerfConfig}
              />
            )}

            {allTab === 'ai_studio' && (
              <AiImageStudio config={campConfig} />
            )}
          </div>
        )}
        </>
      )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-xs text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <p className="font-bold text-slate-800">
              Hội Trại Thu & Văn Nghệ Thiếu Nhi Năm 2026 - Xã Hải Anh
            </p>
            <p className="text-slate-500 mt-0.5">
              Phân định chi tiết 3 phần: Cắm Trại • Văn Nghệ • Nghi Thức Đội - Chuẩn thẩm định 110 điểm thi đua.
            </p>
          </div>
          <div className="flex items-center gap-4 text-slate-600">
            <button 
              onClick={() => setIsGuidelinesOpen(true)}
              className="hover:text-emerald-600 underline cursor-pointer"
            >
              Văn bản quy định hội trại
            </button>
            <span>•</span>
            <button 
              onClick={() => setIsPrintModalOpen(true)}
              className="hover:text-emerald-600 underline cursor-pointer"
            >
              Mẫu biểu dự trù kinh phí (3 Phần)
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <CampGuidelinesModal
        isOpen={isGuidelinesOpen}
        onClose={() => setIsGuidelinesOpen(false)}
      />

      <PrintReportModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        budgetItems={budgetItems}
        campConfig={campConfig}
        perfConfig={perfConfig}
      />
    </div>
  );
}
