import React, { useState } from 'react';
import { 
  Building2, 
  Tent, 
  HeartHandshake, 
  Compass, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle,
  ChevronRight,
  ShieldAlert,
  Layers,
  Award
} from 'lucide-react';

export const CampSpecsDeepDive: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'gate' | 'tent' | 'altar' | 'layout'>('gate');

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-600" />
            <span>Bóc Tách Kỹ Thuật 4 Hạng Mục Trọng Điểm Giật Giải Nhất Hội Trại</span>
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Quy chuẩn vật liệu, thông số kỹ thuật thực địa và tuyệt chiêu thi công ăn trọn 110 điểm tối đa
          </p>
        </div>

        {/* Category Switcher Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl overflow-x-auto">
          <button
            onClick={() => setActiveCategory('gate')}
            className={`px-3 py-1.5 text-xs rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
              activeCategory === 'gate'
                ? 'bg-emerald-600 text-white font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            1. Cổng Hộp Kép (7đ)
          </button>
          <button
            onClick={() => setActiveCategory('tent')}
            className={`px-3 py-1.5 text-xs rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
              activeCategory === 'tent'
                ? 'bg-emerald-600 text-white font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            2. Mái Lều & Cọc 80cm (25đ)
          </button>
          <button
            onClick={() => setActiveCategory('altar')}
            className={`px-3 py-1.5 text-xs rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
              activeCategory === 'altar'
                ? 'bg-emerald-600 text-white font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            3. Ban Thờ & Chó Bưởi (10đ)
          </button>
          <button
            onClick={() => setActiveCategory('layout')}
            className={`px-3 py-1.5 text-xs rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
              activeCategory === 'layout'
                ? 'bg-emerald-600 text-white font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            4. Bố Trí Trái/Phải (10đ)
          </button>
        </div>
      </div>

      {/* Category 1: Gate (Cổng Hộp Kép) */}
      {activeCategory === 'gate' && (
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-emerald-600" />
                <span>Khung Cốt & Kích Thước Lọt Lòng</span>
              </span>
              <ul className="list-disc pl-4 space-y-1 text-slate-700 leading-relaxed">
                <li><strong>Cửa chính:</strong> Cao đúng 1.80m, rộng lọt lòng 1.20m (chuẩn thước Lỗ Ban và thể lệ Hải Anh).</li>
                <li><strong>2 Cửa lách:</strong> Rộng 0.8m mỗi bên, đan nan tre hình quả trám mắt cáo đối xứng.</li>
                <li><strong>Trụ hộp kép:</strong> Gồm 4 cây tre đực già phi 8-10cm, khoảng cách giữa 2 trụ trước-sau là 50cm tạo khối hộp 3D vững chãi.</li>
                <li><strong>Chôn chân cột:</strong> Đào hố sâu 50-60cm, nêm gạch đá chặt trước khi lấp đất, néo dây dù ngầm chống gió giật.</li>
              </ul>
            </div>

            <div className="p-4 bg-amber-50/70 rounded-xl border border-amber-200 space-y-2">
              <span className="font-bold text-amber-900 text-xs flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Chữ Nổi Thủ Công & Mái Đao Truyền Thống</span>
              </span>
              <ul className="list-disc pl-4 space-y-1 text-amber-800 leading-relaxed">
                <li><strong>Vật liệu chữ:</strong> Cắt chữ mút xốp hoặc bọt biển dày 2-3cm, quét sơn nhũ vàng hoặc phủ bột kim tuyến lấp lánh (được cộng 5đ thủ công).</li>
                <li><strong>Dòng chữ bắt buộc:</strong> <em>"LỒNG ĐÈN THẮP SÁNG ƯỚC MƠ"</em> cắt nét chuẩn font không lỗi chính tả.</li>
                <li><strong>Mái đao cong:</strong> Uốn nan tre tạo 2 đầu mái cong vút kiểu đình chùa Bắc Bộ, dán bạt đỏ viền vàng.</li>
                <li><strong>Biểu tượng đỉnh:</strong> Đắp nổi mô hình Khuê Văn Các hoặc Đóa Hoa Sen gắn kiên cố trên đỉnh cổng.</li>
              </ul>
            </div>

            <div className="p-4 bg-rose-50/70 rounded-xl border border-rose-200 space-y-2">
              <span className="font-bold text-rose-900 text-xs flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                <span>Lỗi Tuyệt Đối Tránh (Mất 7-10 điểm)</span>
              </span>
              <ul className="list-disc pl-4 space-y-1 text-rose-800 leading-relaxed">
                <li>In bạt Hiflex phẳng đóng khung sắt: Chỉ được tối đa 3 điểm thay vì 7 điểm hộp kép thủ công.</li>
                <li>Làm cổng quá hẹp (dưới 1.1m) khiến Ban Giám Khảo và đoàn rước khó bước vào lều.</li>
                <li>Chân trụ không chôn sâu: Gió chiều thu ở bãi cỏ Hải Anh làm cổng xiêu vẹo mất an toàn.</li>
                <li>Biển hiệu chữ bị rụng kim tuyến do keo dán dởm khi gặp sương đêm hoặc mưa phùn.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Category 2: Tent & Stakes (Mái Lều & Cọc Néo 80cm) */}
      {activeCategory === 'tent' && (
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                <Tent className="w-4 h-4 text-emerald-600" />
                <span>Quy Chuẩn Cột & Cọc Néo</span>
              </span>
              <ul className="list-disc pl-4 space-y-1 text-slate-700 leading-relaxed">
                <li><strong>Cột chính:</strong> Cao đúng 1.80m, đường kính tre phi 3.0cm, gắn cờ Tổ quốc trên chóp cột.</li>
                <li><strong>Cột phụ (4 góc):</strong> Cao đúng 1.00m, vát bằng đầu trên để không chọc rách bạt.</li>
                <li><strong>Khoảng cách cọc néo đất:</strong> Đo bằng thước dây từ mép lều ra vị trí cắm cọc đúng <strong>80cm</strong> (sai số không quá ±2cm).</li>
                <li><strong>Cự ly chân cột to đến cọc nóc:</strong> Đúng <strong>1.80m</strong> vuông góc với phương lều.</li>
              </ul>
            </div>

            <div className="p-4 bg-emerald-50/70 rounded-xl border border-emerald-200 space-y-2">
              <span className="font-bold text-emerald-900 text-xs flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Kỹ Thuật Đóng Cọc & Căng Bạt Phẳng Lì</span>
              </span>
              <ul className="list-disc pl-4 space-y-1 text-emerald-800 leading-relaxed">
                <li><strong>Góc đóng cọc:</strong> Cọc tre già dài 50cm, đóng xiên góc 45° nghiêng ngược chiều dây kéo bạt.</li>
                <li><strong>Nút thắt:</strong> 100% cọc néo phải thắt bằng <strong>Nút Thuyền Chài (Clove Hitch)</strong>.</li>
                <li><strong>Kỹ thuật nút đồng xu:</strong> Bọc sỏi tròn ở góc bạt rồi siết dây dù, giúp mái bạt căng đét như mặt trống.</li>
                <li><strong>Độ dốc mái:</strong> Đạt góc nghiêng 35° đảm bảo thoát nước mưa tuyệt đối, không có vùng trũng đọng nước.</li>
              </ul>
            </div>

            <div className="p-4 bg-amber-50/70 rounded-xl border border-amber-200 space-y-2">
              <span className="font-bold text-amber-900 text-xs flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Hàng Cọc Song Song Đối Xứng (5đ)</span>
              </span>
              <ul className="list-disc pl-4 space-y-1 text-amber-800 leading-relaxed">
                <li>Dùng dây căng mốc trước khi đóng cọc để 4 cọc hàng trước và 4 cọc hàng sau nằm trên một đường thẳng tắp.</li>
                <li>Đầu cọc nhô khỏi mặt đất khoảng 10-12cm, có khía rãnh khấc chống trượt dây dù.</li>
                <li>Các sợi dây néo kéo xiên cùng một góc độ đều tăm tắp tạo hiệu ứng thị giác kỷ luật nghiêm minh.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Category 3: Altar & Pomelo Dog (Ban Thờ & Chó Bưởi) */}
      {activeCategory === 'altar' && (
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                <HeartHandshake className="w-4 h-4 text-emerald-600" />
                <span>Thứ Tự Nghi Lễ Trang Trọng</span>
              </span>
              <ul className="list-disc pl-4 space-y-1 text-slate-700 leading-relaxed">
                <li><strong>Cờ Tổ quốc:</strong> Treo ở vị trí cao nhất chính giữa vách hậu lều (kích thước 80cm × 120cm).</li>
                <li><strong>Ảnh Bác Hồ:</strong> Treo ngay dưới cờ Tổ quốc, lồng khung kính mạ vàng sạch sẽ, trang nghiêm.</li>
                <li><strong>5 Điều Bác Hồ dạy:</strong> Đóng khung chữ đỏ viền vàng treo dưới ảnh Bác.</li>
                <li><strong>Bàn thờ Bác:</strong> Bàn gỗ trải khăn nhung đỏ có diềm tua rua vàng óng.</li>
              </ul>
            </div>

            <div className="p-4 bg-amber-50/70 rounded-xl border border-amber-200 space-y-2">
              <span className="font-bold text-amber-900 text-xs flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Tuyệt Chiêu Tỉa Chó Bưởi Lông Xù 3 Tầng</span>
              </span>
              <ul className="list-disc pl-4 space-y-1 text-amber-800 leading-relaxed">
                <li><strong>Cốt thân:</strong> Dùng 1 quả đu đủ xanh cắm nối với 1 củ cà rốt hoặc quả cam tròn làm khung đầu và mình.</li>
                <li><strong>Tép bưởi lông xù:</strong> Chọn 3 quả bưởi Đào hoặc bưởi Diễn tép dài, bóc nhẹ từng múi cắm tăm xòe bung như bộ lông xù.</li>
                <li><strong>Mắt và mũi:</strong> Dùng 3 hạt đỗ đen hoặc hạt nhãn bóng loáng ghim làm mắt và mũi.</li>
                <li><strong>Cổ đeo nơ đỏ:</strong> Cột dải ruy băng lụa đỏ thắt nơ bướm xinh xắn ngay cổ chú chó.</li>
              </ul>
            </div>

            <div className="p-4 bg-emerald-50/70 rounded-xl border border-emerald-200 space-y-2">
              <span className="font-bold text-emerald-900 text-xs flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Mâm Ngũ Quả & Hoa Quả Bày Kèm</span>
              </span>
              <ul className="list-disc pl-4 space-y-1 text-emerald-800 leading-relaxed">
                <li><strong>Nải chuối tiêu xanh:</strong> Đặt ở dưới cùng xòe rộng như bàn tay nâng đỡ các loại quả.</li>
                <li><strong>Quả bưởi vàng:</strong> Đặt chính giữa lòng nải chuối.</li>
                <li><strong>Dưa hấu khắc hoa:</strong> Khắc dòng chữ <em>"Hải Anh 2026"</em> hoặc hoa sen tinh xảo.</li>
                <li><strong>Hồng đỏ, thanh long, quýt vàng:</strong> Chèn xen kẽ màu sắc phong phú, tượng trưng ngũ hành no đủ.</li>
                <li><strong>Bánh dẻo, bánh nướng & Lọ hoa tươi:</strong> Hoa huệ trắng hoặc cúc vàng thơm ngát.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Category 4: Left/Right Layout (Bố Trí Trái/Phải Chuẩn Thể Lệ) */}
      {activeCategory === 'layout' && (
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* RIGHT SIDE: STUDY CORNER */}
            <div className="p-4 bg-emerald-50/80 rounded-xl border border-emerald-300 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-900 text-sm flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-emerald-600" />
                  <span>BÊN TAY PHẢI: GÓC HỌC TẬP (Bắt Buộc Chuẩn Vị Trí)</span>
                </span>
                <span className="text-[11px] font-bold text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-200">
                  Chuẩn 100% Thể Lệ
                </span>
              </div>
              <p className="text-emerald-800 leading-relaxed">
                Quy định Điều lệ Hải Anh: Khi đứng từ cổng nhìn vào lều, <strong>toàn bộ Góc học tập BẮT BUỘC nằm ở phía tay PHẢI</strong>. Đặt sai bên sẽ bị trừ toàn bộ điểm chuyên đề.
              </p>
              <div className="bg-white p-3 rounded-lg border border-emerald-200 space-y-1.5 text-slate-700">
                <span className="font-bold text-slate-900 block">Vật dụng bắt buộc trưng bày:</span>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Bàn học sinh phủ khăn sạch sẽ, có đèn bàn học Rạng Đông chiếu sáng ấm áp.</li>
                  <li>Bộ sách vở đạt giải <em>"Vở sạch chữ đẹp"</em> cấp Trường/Huyện của đội viên trong chi đoàn.</li>
                  <li>Bộ dụng cụ học tập: Thước kẻ, compa, êke, bút mực chữ đẹp, hộp bút gỗ.</li>
                  <li>Mô hình sáng tạo thanh thiếu nhi: Mô hình STEM thuyền buồm, cối xay gió hoặc lồng đèn ông sao mini tự chế.</li>
                </ul>
              </div>
            </div>

            {/* LEFT SIDE: SLOGAN & PIONEER */}
            <div className="p-4 bg-blue-50/80 rounded-xl border border-blue-300 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-blue-900 text-sm flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-blue-600" />
                  <span>BÊN TAY TRÁI: KHẨU HIỆU & DỤNG CỤ ĐỘI</span>
                </span>
                <span className="text-[11px] font-bold text-blue-700 bg-white px-2 py-0.5 rounded border border-blue-200">
                  Chuẩn 100% Thể Lệ
                </span>
              </div>
              <p className="text-blue-800 leading-relaxed">
                Quy định Điều lệ Hải Anh: Khi đứng từ cổng nhìn vào lều, <strong>Bảng khẩu hiệu và khu trưng bày truyền thống Đội BẮT BUỘC nằm ở phía tay TRÁI</strong>.
              </p>
              <div className="bg-white p-3 rounded-lg border border-blue-200 space-y-1.5 text-slate-700">
                <span className="font-bold text-slate-900 block">Vật dụng bắt buộc trưng bày:</span>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Bảng khẩu hiệu chữ đỏ nền vàng đúng từng chữ: <em>"Thiếu nhi Ninh Bình vững bước tiến vào kỷ nguyên mới"</em>.</li>
                  <li>Cờ Đội Thiếu niên Tiền phong Hồ Chí Minh và giá treo cắm cờ trang trọng.</li>
                  <li>Bộ trống Đội gồm 1 trống cái và 2 trống con sơn màu đỏ sáng bóng, dùi trống quấn vải sạch sẽ.</li>
                  <li>Tủ sách Kim Đồng: Truyện tranh lịch sử Kim Đồng, Võ Thị Sáu, Lý Tự Trọng, báo Thiếu niên Tiền phong.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
