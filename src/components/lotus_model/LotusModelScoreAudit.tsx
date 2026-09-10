import React from 'react';
import { 
  Award, 
  CheckCircle2, 
  Star, 
  ShieldCheck, 
  Check, 
  HelpCircle,
  FileCheck2,
  Trophy
} from 'lucide-react';
import { LOTUS_SCORE_AUDIT } from '../../data/lotusModelData';

export const LotusModelScoreAudit: React.FC = () => {
  const totalMax = LOTUS_SCORE_AUDIT.reduce((s, i) => s + i.maxScore, 0);
  const totalAwarded = LOTUS_SCORE_AUDIT.reduce((s, i) => s + i.awardedScore, 0);

  return (
    <div className="space-y-6">
      {/* Top Banner Competition Audit */}
      <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-emerald-950 text-white p-6 rounded-3xl shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center gap-1.5 w-fit">
              <Trophy className="w-3.5 h-3.5 text-amber-300" />
              Báo Cáo Thẩm Định Điểm Thi Đua
            </span>
            <h2 className="text-2xl font-black mt-2 tracking-tight">
              Kiểm Tra Chuẩn Barem Chấm Thi Mô Hình Cổng Hoa Sen
            </h2>
            <p className="text-xs text-amber-100 mt-1 max-w-2xl leading-relaxed">
              Đối chiếu từng chi tiết thiết kế trên hình ảnh mẫu với Quy chế chấm trại hè xã Hải Anh 2026. Đảm bảo tuân thủ 100% các quy định bắt buộc (Bàn học bên phải, Cờ trống bên trái, Tủ điện an toàn).
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/15 text-center">
            <span className="text-xs text-amber-200 block font-medium">Điểm Đánh Giá Dự Kiến:</span>
            <span className="text-4xl font-black text-amber-300">{totalAwarded} / {totalMax}</span>
            <span className="text-[11px] text-emerald-300 block mt-1 font-bold">XẾP LOẠI XUẤT SẮC (GIẢI NHẤT)</span>
          </div>
        </div>
      </div>

      {/* Mandatory Rules Verification Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
            <Check className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-emerald-950">Góc Học Tập BÊN PHẢI (Chuẩn 100%)</h4>
            <p className="text-[11px] text-emerald-800 mt-0.5 leading-relaxed">
              Bàn học sinh, đèn học rọi sáng, sách vở và pano Ninh Bình đặt đúng 100% bên phải cửa lều, không bị trừ 10 điểm.
            </p>
          </div>
        </div>

        <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
            <Check className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-emerald-950">Trống & Cờ Đội BÊN TRÁI (Chuẩn 100%)</h4>
            <p className="text-[11px] text-emerald-800 mt-0.5 leading-relaxed">
              Cờ Đội thêu, cờ tam giác ngũ sắc và dàn trống 3 chiếc đặt ngay ngắn bên trái, chuẩn điều lệnh nghi thức.
            </p>
          </div>
        </div>

        <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
            <Check className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-emerald-950">An Toàn Điện Chống Giật (Chuẩn 100%)</h4>
            <p className="text-[11px] text-emerald-800 mt-0.5 leading-relaxed">
              Trang bị tủ điện có Aptomat ELCB chống rò 30mA, cách ly mặt đất ẩm ướt, đạt điểm an toàn tối đa.
            </p>
          </div>
        </div>
      </div>

      {/* Criteria Checklist Breakdown */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <FileCheck2 className="w-4 h-4 text-emerald-600" />
            Chi Tiết Barem Điểm 8 Hạng Mục
          </h3>
          <span className="text-xs text-slate-500 font-medium">Đối chiếu quy chế thi đua</span>
        </div>

        <div className="divide-y divide-slate-100">
          {LOTUS_SCORE_AUDIT.map((item, index) => (
            <div key={item.id} className="p-4 hover:bg-slate-50/70 transition-colors">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1 max-w-3xl">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold">
                      Tiêu chí #{index + 1}
                    </span>
                    <span className="text-xs font-bold text-slate-500">
                      {item.section}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">
                    {item.criterion}
                  </h4>
                  <p className="text-xs text-indigo-700 font-medium bg-indigo-50/60 px-2.5 py-1 rounded-lg border border-indigo-100 w-fit">
                    {item.ruleReference}
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed pt-1">
                    <strong className="text-slate-900">Thực tế mẫu đạt được:</strong> {item.howThisModelComplies}
                  </p>
                </div>

                <div className="flex items-center gap-3 bg-emerald-50 px-4 py-2.5 rounded-xl border border-emerald-200 shrink-0">
                  <div className="text-right">
                    <span className="text-[10px] text-emerald-700 font-bold block uppercase">Điểm Đạt Được</span>
                    <span className="text-xl font-black text-emerald-800 font-mono">
                      {item.awardedScore} / {item.maxScore}
                    </span>
                  </div>
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
