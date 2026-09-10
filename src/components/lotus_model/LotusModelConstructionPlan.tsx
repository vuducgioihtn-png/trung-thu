import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Users, 
  CheckSquare, 
  Square, 
  AlertTriangle, 
  CheckCircle2,
  HardHat,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { LOTUS_CONSTRUCTION_STEPS } from '../../data/lotusModelData';
import { LotusConstructionStep } from '../../types/lotusModel';

export const LotusModelConstructionPlan: React.FC = () => {
  const [steps, setSteps] = useState<LotusConstructionStep[]>(LOTUS_CONSTRUCTION_STEPS);
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});

  const toggleTask = (taskKey: string) => {
    setCompletedTasks(prev => ({
      ...prev,
      [taskKey]: !prev[taskKey],
    }));
  };

  const totalChecklistItems = steps.reduce((sum, step) => sum + step.checklist.length, 0);
  const finishedCount = Object.values(completedTasks).filter(Boolean).length;
  const progressPercent = Math.round((finishedCount / totalChecklistItems) * 100);

  return (
    <div className="space-y-6">
      {/* Top Banner Execution Roadmap */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
            Quy Trình Thi Công Thực Tế 5 Giai Đoạn
          </span>
          <h2 className="text-xl font-black text-slate-900 mt-2">
            Kế Hoạch Dựng Cổng Tam Quan Hoa Sen & Lều Chỉ Huy
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Kế hoạch thi công chi tiết từng giờ, phân công rõ người chỉ huy, số lượng nhân công và các biện pháp an toàn bắt buộc tại xã Hải Anh.
          </p>
        </div>

        <div className="w-full sm:w-64 bg-slate-50 p-4 rounded-2xl border border-slate-200">
          <div className="flex justify-between text-xs font-bold mb-1.5">
            <span className="text-slate-700">Tiến Độ Thi Công:</span>
            <span className="text-emerald-600 font-mono">{progressPercent}%</span>
          </div>
          <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
            <div 
              className="bg-emerald-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500 mt-1.5 text-right font-medium">
            Đã hoàn thành {finishedCount}/{totalChecklistItems} đầu việc
          </p>
        </div>
      </div>

      {/* 5 Steps Vertical Timeline */}
      <div className="space-y-6">
        {steps.map((step) => {
          const stepTaskKeys = step.checklist.map((_, i) => `step-${step.stepNumber}-task-${i}`);
          const isAllDone = stepTaskKeys.every(k => completedTasks[k]);

          return (
            <div 
              key={step.stepNumber}
              className={`bg-white rounded-2xl border transition-all overflow-hidden shadow-xs ${
                isAllDone ? 'border-emerald-300 bg-emerald-50/10' : 'border-slate-200'
              }`}
            >
              {/* Step Header */}
              <div className="p-5 border-b border-slate-100 bg-slate-50/70 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm ${
                    isAllDone 
                      ? 'bg-emerald-600 text-white shadow-xs' 
                      : 'bg-slate-900 text-white'
                  }`}>
                    {step.stepNumber}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      {step.title}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5 flex-wrap">
                      <span className="flex items-center gap-1 text-indigo-700 font-medium">
                        <Calendar className="w-3.5 h-3.5" />
                        {step.timeline}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {step.durationHours} giờ
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        {step.workersCount} nhân lực ({step.leader})
                      </span>
                    </div>
                  </div>
                </div>

                {isAllDone && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Đã hoàn thành bước này
                  </span>
                )}
              </div>

              {/* Step Body */}
              <div className="p-5 grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Checklist (2 Cols) */}
                <div className="lg:col-span-2 space-y-3">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckSquare className="w-3.5 h-3.5 text-emerald-600" />
                    Danh Mục Công Việc Cần Thực Hiện:
                  </h4>
                  <div className="space-y-2">
                    {step.checklist.map((taskText, tIndex) => {
                      const key = `step-${step.stepNumber}-task-${tIndex}`;
                      const done = !!completedTasks[key];

                      return (
                        <div 
                          key={key}
                          onClick={() => toggleTask(key)}
                          className={`flex items-start gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                            done 
                              ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900' 
                              : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                          }`}
                        >
                          <div className="mt-0.5 text-slate-400 shrink-0">
                            {done ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                            ) : (
                              <Square className="w-4 h-4 text-slate-300" />
                            )}
                          </div>
                          <span className={`leading-relaxed font-medium ${done ? 'line-through opacity-80' : ''}`}>
                            {taskText}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Safety & Criteria (1 Col) */}
                <div className="space-y-4">
                  {/* Safety Warnings */}
                  <div className="bg-rose-50 p-3.5 rounded-xl border border-rose-200 text-xs space-y-1.5">
                    <h5 className="font-bold text-rose-900 flex items-center gap-1.5">
                      <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                      Lưu Ý An Toàn Lao Động:
                    </h5>
                    <ul className="space-y-1 pl-4">
                      {step.safetyWarnings.map((warn, wi) => (
                        <li key={wi} className="list-disc text-rose-800">
                          {warn}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Acceptance Criteria */}
                  <div className="bg-sky-50 p-3.5 rounded-xl border border-sky-200 text-xs space-y-1">
                    <h5 className="font-bold text-sky-900 flex items-center gap-1.5">
                      <HardHat className="w-3.5 h-3.5 text-sky-600" />
                      Tiêu Chí Nghiệm Thu:
                    </h5>
                    <p className="text-sky-800 leading-relaxed pl-5">
                      {step.acceptanceCriteria}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
