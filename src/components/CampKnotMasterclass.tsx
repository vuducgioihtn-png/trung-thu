import React, { useState } from 'react';
import { Sparkles, CheckCircle2, AlertCircle, Wrench, ChevronRight } from 'lucide-react';

interface KnotGuide {
  id: string;
  name: string;
  vietnameseName: string;
  scoreWeight: string;
  mandatory: boolean;
  purpose: string;
  steps: {
    step: number;
    title: string;
    description: string;
    tip: string;
  }[];
  commonMistakes: string;
  inspectionTip: string;
}

const KNOT_GUIDES: KnotGuide[] = [
  {
    id: 'clove_hitch',
    name: 'Clove Hitch',
    vietnameseName: 'Nút Thuyền Chài (Cọc Néo 80cm)',
    scoreWeight: '5 Điểm Bắt Buộc',
    mandatory: true,
    purpose: 'Buộc tất cả các cọc néo đất 80cm quanh lều và buộc thanh xà ngang cổng trại. Không bị tuột khi kéo căng.',
    steps: [
      {
        step: 1,
        title: 'Vòng 1 quanh thân cọc',
        description: 'Vòng dây qua thân cọc tre từ trái sang phải, tạo một vòng tròn nghiêng một góc 45 độ quanh thân cọc.',
        tip: 'Để dư đầu dây ngắn khoảng 15-20cm để dễ dàng khóa nút.'
      },
      {
        step: 2,
        title: 'Bắt chéo tạo chữ X',
        description: 'Vắt đầu dây ngắn đè chéo lên trên sợi dây dài chính, tạo thành một điểm giao cắt hình chữ X rõ ràng trên bề mặt cọc.',
        tip: 'Giữ ngón tay cái chặt ở điểm giao chữ X để dây không bị lỏng khi quấn vòng thứ hai.'
      },
      {
        step: 3,
        title: 'Luồn dưới chữ X và siết chặt',
        description: 'Quấn tiếp một vòng nữa quanh cọc, luồn đầu dây ngắn chui ngược từ dưới lên qua điểm chéo của chữ X, sau đó dùng hai tay rút căng hai đầu.',
        tip: 'Khóa thêm một nút nửa (Half Hitch) ở đầu thừa để đảm bảo 100% không bị tuột dù có gió giật cấp 6.'
      }
    ],
    commonMistakes: 'Buộc nút thắt chết thông thường (nút đơn), quấn vòng bừa bãi không có chữ X -> Bị Ban giám khảo trừ 3-5 điểm.',
    inspectionTip: 'Ban giám khảo sẽ dùng tay kéo thử dây néo: Nếu dây căng chắc và nút có hình chữ X đè lên hai vòng song song là đạt trọn điểm tối đa.'
  },
  {
    id: 'coin_knot',
    name: 'Coin Knot / Pebble Knot',
    vietnameseName: 'Nút Đồng Xu / Nút Bọc Sỏi (Căng Mép Bạt Không Rách)',
    scoreWeight: 'Bí Kíp Chống Rách Bạt',
    mandatory: false,
    purpose: 'Cố định dây néo vào các góc mép bạt dứa/bạt dù mà không làm rách hoặc toác lỗ khuyên bạt khi gặp gió bão.',
    steps: [
      {
        step: 1,
        title: 'Đặt đồng xu hoặc hòn sỏi tròn',
        description: 'Lấy 1 đồng xu hoặc hòn sỏi nhẵn tròn đường kính 2-3cm, đặt vào mặt dưới của góc bạt lều.',
        tip: 'Tuyệt đối không dùng đá có cạnh sắc nhọn vì sẽ chọc thủng bạt.'
      },
      {
        step: 2,
        title: 'Túm bạt bọc kín sỏi',
        description: 'Gấp góc bạt lại, túm trọn vẹn viên sỏi vào bên trong tạo thành một cái túi hình quả đào nhỏ.',
        tip: 'Xoắn nhẹ cổ túi bạt 1 vòng để viên sỏi nằm cố định bên trong chóp bạt.'
      },
      {
        step: 3,
        title: 'Quấn thắt nút thòng lọng siết cổ',
        description: 'Dùng dây dù quấn 2-3 vòng quanh cổ túi bạt ngay dưới viên sỏi, thắt nút thuyền chài hoặc nút thòng lọng siết chặt.',
        tip: 'Lực kéo của dây néo sẽ tì lên viên sỏi tròn thay vì tì vào vải bạt, giúp bạt chịu lực giật hàng trăm kilogam.'
      }
    ],
    commonMistakes: 'Xỏ trực tiếp dây thừng vào lỗ khuyên nhôm của bạt: Gió lớn sẽ làm giật rách toạc góc bạt, làm sập lều.',
    inspectionTip: 'Giúp mái bạt phẳng phiu không tì vết, thể hiện sự chuyên nghiệp và kỹ năng trại sinh dạn dày kinh nghiệm.'
  },
  {
    id: 'reef_knot',
    name: 'Reef Knot',
    vietnameseName: 'Nút Dẹp / Nút Nối Dây (Tháo Nhanh 1 Giây)',
    scoreWeight: 'Kỹ Thuật Trại Sinh',
    mandatory: false,
    purpose: 'Dùng để nối hai đầu dây bạt cùng kích thước, buộc dây giằng đồ đạc trong lều. Chắc chắn nhưng tháo cực nhanh khi cần.',
    steps: [
      {
        step: 1,
        title: 'Phải qua Trái',
        description: 'Cầm hai đầu dây trên hai tay, đặt đầu dây tay PHẢI vắt lên trên và quấn một vòng qua đầu dây tay TRÁI.',
        tip: 'Khẩu quyết: Phải qua Trái, rồi Trái qua Phải.'
      },
      {
        step: 2,
        title: 'Trái qua Phải',
        description: 'Lấy đầu dây tay TRÁI vắt ngược lên trên đầu dây tay PHẢI và quấn thêm một vòng ngược lại.',
        tip: 'Quan sát hai vòng dây lồng vào nhau đối xứng phẳng lì.'
      },
      {
        step: 3,
        title: 'Rút chặt và kiểm tra độ phẳng',
        description: 'Kéo căng hai cặp dây, nút thắt sẽ tự khóa chặt lại thành hình chữ nhật dẹp, không bị cộm.',
        tip: 'Khi muốn tháo: Chỉ cần giật mạnh một đầu dây thẳng hàng, nút sẽ tự bật rời ra trong 1 giây.'
      }
    ],
    commonMistakes: 'Buộc thành nút bò (Granny knot - do lặp lại cùng chiều): Dễ bị tuột khi kéo giật và rất khó tháo.',
    inspectionTip: 'Nút dẹp đạt chuẩn khi hai đầu dây cùng nằm song song ở một phía của vòng dây.'
  },
  {
    id: 'sheepshank',
    name: 'Sheepshank / Tension Hitch',
    vietnameseName: 'Nút Chân Chó / Nút Tăng Đơ (Rút Ngắn Dây Chùng)',
    scoreWeight: 'Cứu Nguy Thi Đấu',
    mandatory: false,
    purpose: 'Rút ngắn đoạn dây néo bị chùng hoặc che chở đoạn dây bị sờn rách mà không cần phải cởi cọc đất hay cắt ngắn dây.',
    steps: [
      {
        step: 1,
        title: 'Gập đôi dây tạo 3 đoạn song song',
        description: 'Gập đoạn dây chùng thành 2 nếp gấp liên tiếp hình chữ S hoặc chữ Z, tạo thành 3 nhánh dây nằm song song.',
        tip: 'Độ dài đoạn gập bằng đúng độ chùng cần rút ngắn.'
      },
      {
        step: 2,
        title: 'Tạo vòng khóa ở hai đầu',
        description: 'Dùng nhánh dây chính ở hai bên lồng một vòng thắt nửa (half hitch) trùm lên chóp của hai nếp gấp.',
        tip: 'Có thể chèn thêm que tre nhỏ vào giữa vòng để chốt chặn tuyệt đối an toàn.'
      },
      {
        step: 3,
        title: 'Kéo căng dây chịu lực',
        description: 'Khi dây néo được kéo căng, lực căng sẽ tự động siết chặt hai vòng khóa ép chặt phần dây gấp bên trong.',
        tip: 'Dây lập tức trở nên căng đét như dây đàn guitar, mái bạt không còn một gợn sóng.'
      }
    ],
    commonMistakes: 'Không kéo căng hai đầu làm vòng khóa bị tuột ra khi chưa có lực tì.',
    inspectionTip: 'Rất hữu dụng vào giữa buổi trưa khi dây dù bị giãn nhiệt dưới trời nắng gắt.'
  }
];

export const CampKnotMasterclass: React.FC = () => {
  const [selectedKnotId, setSelectedKnotId] = useState<string>('clove_hitch');
  const selectedKnot = KNOT_GUIDES.find(k => k.id === selectedKnotId) || KNOT_GUIDES[0];

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Wrench className="w-5 h-5 text-emerald-600" />
            <span>Cẩm Nang 4 Nút Dây Trại Sinh Kỹ Thuật Chuẩn Hải Anh 2026</span>
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Quy trình thắt nút cọc néo 80cm, nút bọc sỏi bạt dù, nút nối dẹp và nút tăng đơ giải cứu dây chùng
          </p>
        </div>

        {/* Quick Tabs for 4 Knots */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl overflow-x-auto">
          {KNOT_GUIDES.map((knot) => (
            <button
              key={knot.id}
              onClick={() => setSelectedKnotId(knot.id)}
              className={`px-3 py-1.5 text-xs rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedKnotId === knot.id
                  ? 'bg-emerald-600 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {knot.name}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Knot Header Details */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50/40 p-4 rounded-xl border border-emerald-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-900">
              {selectedKnot.vietnameseName}
            </span>
            <span className="text-[11px] font-mono font-bold text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-300">
              {selectedKnot.scoreWeight}
            </span>
            {selectedKnot.mandatory && (
              <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                BẮT BUỘC ĐIỀU LỆ
              </span>
            )}
          </div>
          <p className="text-xs text-slate-700 mt-1 font-medium leading-relaxed">
            <strong>Ứng dụng thi công:</strong> {selectedKnot.purpose}
          </p>
        </div>
      </div>

      {/* 3 Step-by-step Visual Execution Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {selectedKnot.steps.map((s) => (
          <div 
            key={s.step} 
            className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between space-y-3 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 rounded-bl-full pointer-events-none" />
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                  {s.step}
                </span>
                <h4 className="text-xs font-bold text-slate-900">{s.title}</h4>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {s.description}
              </p>
            </div>

            <div className="p-2.5 bg-white rounded-lg border border-slate-200/80 text-[11px] text-emerald-800 font-medium space-y-0.5">
              <span className="font-bold flex items-center gap-1 text-emerald-700">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                <span>Mẹo thao tác nhanh:</span>
              </span>
              <p className="text-slate-600">{s.tip}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Warnings & Inspection Standards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
        <div className="p-3.5 bg-rose-50 rounded-xl border border-rose-200 space-y-1">
          <span className="font-bold text-rose-900 flex items-center gap-1.5 text-xs">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            <span>Lỗi kỹ thuật hay gặp (Bị trừ điểm nặng):</span>
          </span>
          <p className="text-rose-800 leading-relaxed">{selectedKnot.commonMistakes}</p>
        </div>

        <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 space-y-1">
          <span className="font-bold text-amber-900 flex items-center gap-1.5 text-xs">
            <CheckCircle2 className="w-4 h-4 text-amber-600" />
            <span>Ban Giám Khảo Xã Hải Anh kiểm tra như thế nào:</span>
          </span>
          <p className="text-amber-800 leading-relaxed">{selectedKnot.inspectionTip}</p>
        </div>
      </div>
    </div>
  );
};
