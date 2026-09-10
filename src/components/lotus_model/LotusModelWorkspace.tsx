import React, { useState } from 'react';
import { 
  Eye, 
  Package, 
  DollarSign, 
  Hammer, 
  Award, 
  ListTodo, 
  Printer, 
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  Tent,
  Lightbulb,
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { LotusModelVisualizer } from './LotusModelVisualizer';
import { LotusModelMaterials } from './LotusModelMaterials';
import { LotusModelBudget } from './LotusModelBudget';
import { LotusModelConstructionPlan } from './LotusModelConstructionPlan';
import { LotusModelScoreAudit } from './LotusModelScoreAudit';
import { LotusModelPrintModal } from './LotusModelPrintModal';
import { TaskManager } from '../TaskManager';
import { CampTask, TeamMember } from '../../types/camp';

interface LotusModelWorkspaceProps {
  onBackToMainProject: () => void;
  tasks: CampTask[];
  teamMembers: TeamMember[];
  onUpdateTasks: (tasks: CampTask[]) => void;
  onUpdateMembers: (members: TeamMember[]) => void;
}

export const LotusModelWorkspace: React.FC<LotusModelWorkspaceProps> = ({
  onBackToMainProject,
  tasks,
  teamMembers,
  onUpdateTasks,
  onUpdateMembers,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'visualizer' | 'materials' | 'budget' | 'construction' | 'score' | 'tasks'>('visualizer');
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);

  const subTabs = [
    { id: 'visualizer', label: 'Bản Vẽ & Mô Phỏng Phối Cảnh', icon: Eye },
    { id: 'materials', label: 'Bóc Tách Vật Tư (BOM)', icon: Package },
    { id: 'budget', label: 'Dự Toán Kinh Phí', icon: DollarSign },
    { id: 'construction', label: 'Quy Trình Thi Công 5 Bước', icon: Hammer },
    { id: 'score', label: 'Thẩm Định Barem Điểm', icon: Award },
    { id: 'tasks', label: 'Phân Công Nhiệm Vụ', icon: ListTodo },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Project 2 Header Banner */}
      <div className="bg-gradient-to-r from-amber-900 via-rose-950 to-slate-900 text-white p-6 sm:p-7 rounded-3xl shadow-sm border border-amber-800/30">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={onBackToMainProject}
                className="flex items-center gap-1 px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-full text-xs font-semibold backdrop-blur-md transition-all cursor-pointer border border-white/20"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Trở Về Dự Án Tổng Hợp</span>
              </button>

              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                Dự Án Mẫu Thực Tế (Tách Riêng Theo Ảnh)
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Cổng Tam Quan Hoa Sen & Lều Chỉ Huy Trại Thu 2026
            </h1>

            <p className="text-xs text-amber-100/90 leading-relaxed">
              Mô hình chuyên biệt được xây dựng độc lập theo đúng mẫu thiết kế: Cổng tam quan 4 trụ gỗ nâu mái cong, 6 bông sen LED hồng phát sáng, 2 đèn lồng cá chép đỏ, đèn ông sao trung tâm, lều chữ A rêu quân đội, <strong>bàn học sinh có đèn rọi BẮT BUỘC BÊN PHẢI</strong>, và <strong>trống cờ Đội BẮT BUỘC BÊN TRÁI</strong>.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowPrintModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-2xl text-xs font-black transition-all shadow-md cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>In Bản Vẽ & Dự Toán</span>
            </button>
          </div>
        </div>

        {/* Quick Highlights Bar */}
        <div className="mt-6 pt-5 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-pink-400 animate-pulse" />
            <span className="text-slate-200 font-medium">6 Hoa Sen LED Hồng</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
            <span className="text-slate-200 font-medium">2 Đèn Cá Chép Vượt Vũ Môn</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span className="text-slate-200 font-medium">Bàn Học Bên Phải (Chuẩn 100%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span className="text-slate-200 font-medium">Dự Toán: 7.765.000 đ</span>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="bg-white p-1.5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-1.5 overflow-x-auto">
        {subTabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content Panes */}
      <div>
        {activeSubTab === 'visualizer' && <LotusModelVisualizer />}
        {activeSubTab === 'materials' && <LotusModelMaterials />}
        {activeSubTab === 'budget' && <LotusModelBudget />}
        {activeSubTab === 'construction' && <LotusModelConstructionPlan />}
        {activeSubTab === 'score' && <LotusModelScoreAudit />}
        {activeSubTab === 'tasks' && (
          <div className="space-y-4">
            <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
              <div>
                <p className="font-bold">Hệ Thống Quản Lý Phân Công Nhiệm Vụ Mô Hình Cổng Hoa Sen</p>
                <p className="text-amber-800 text-[11px] mt-0.5">
                  Phân công 4 tổ phụ trách: Tổ mộc (Bác Hòa), Tổ điện & hoa sen (Anh Dũng), Tổ néo lều (Anh Nam), Tổ lễ nghi (Cô Mai).
                </p>
              </div>
            </div>
            <TaskManager
              tasks={tasks}
              teamMembers={teamMembers}
              onUpdateTasks={onUpdateTasks}
              onUpdateMembers={onUpdateMembers}
              initialDepartmentFilter="cam_trai"
            />
          </div>
        )}
      </div>

      {/* Printable Modal */}
      <LotusModelPrintModal
        isOpen={showPrintModal}
        onClose={() => setShowPrintModal(false)}
      />
    </div>
  );
};
