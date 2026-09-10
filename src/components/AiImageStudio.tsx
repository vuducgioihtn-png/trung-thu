import React, { useState } from 'react';
import { 
  Sparkles, 
  Image as ImageIcon, 
  Download, 
  RefreshCw, 
  Copy, 
  Check, 
  ExternalLink, 
  Sliders, 
  Lightbulb,
  AlertCircle
} from 'lucide-react';
import { CampVisualConfig } from '../types/camp';

interface AiImageStudioProps {
  config: CampVisualConfig;
}

export const AiImageStudio: React.FC<AiImageStudioProps> = ({ config }) => {
  const [selectedPreset, setSelectedPreset] = useState<'night_festival' | 'day_gate' | 'altar_fruits' | 'performance_dance'>('night_festival');
  const [styleMode, setStyleMode] = useState<string>('Chụp ảnh thực tế 4K chân thực (Photorealistic)');
  const [customPromptDetails, setCustomPromptDetails] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);

  // Ready-to-use prompt templates for Hai Anh 2026
  const getPromptForPreset = () => {
    switch (selectedPreset) {
      case 'night_festival':
        return `A magnificent high-resolution photograph of a traditional Vietnamese Mid-Autumn Festival youth camp in Hai Anh commune, Ninh Binh, Vietnam, 2026.
Atmosphere: Magical festive night under a luminous harvest full moon in a starry indigo sky.
Gate Architecture: Elaborate 4-pillar square double entrance gate (cổng hộp kép) made of polished bamboo and mahogany wood with 2 side gates, measuring 1.8m high by 1.2m wide, decorated with a red lacquered signboard with glowing golden Vietnamese calligraphy "LỒNG ĐÈN THẮP SÁNG ƯỚC MƠ" and a miniature glowing Khue Van Cac pavilion emblem at the apex.
Lighting & Decor: Countless traditional five-pointed glowing star lanterns (lồng đèn ông sao), warm fairy lights cascading down the tent canopy, bright lantern reflections.
Behind the gate: The well-pitched canvas tent with tight guy ropes, and cheerful Vietnamese children in blue and white pioneer uniforms with red neckerchiefs celebrating the festival.
Style: ${styleMode}. Cinematic warm festival lighting, highly detailed 8k photography.`;

      case 'day_gate':
        return `Photorealistic architectural shot of an authentic Vietnamese village youth pioneer camp gate in Hai Anh commune, Ninh Binh, celebrating Mid-Autumn 2026.
Gate Structure: Double box square gate (cổng hộp kép, 4 trụ vuông) with 2 side entrance wing doors (cửa lách), constructed from sturdy bamboo canes and woodwork.
Dimensions: Main entrance door 1.8m tall and 1.2m wide.
Top Board: Traditional red horizontal board with handcrafted raised golden 3D letters reading "LỒNG ĐÈN THẮP SÁNG ƯỚC MƠ".
Ornaments: Intricate lotus and Khue Van Cac historical emblem on top, paired red vertical couplet banners on pillars. Hanging paper star lanterns, red flags with yellow stars fluttering in the clear blue afternoon sky.
Behind: Neat blue canvas tent with clean 1.8m center pole, guy lines staked with clove hitch knots.
Style: ${styleMode}. Crisp daylight, ultra-detailed architectural and cultural photography.`;

      case 'altar_fruits':
        return `A detailed close-up festival photograph of the interior ceremonial altar and study corner of a Vietnamese youth pioneer camp for Mid-Autumn 2026.
Top Center: Embroidered Vietnam National Flag, framed portrait of Uncle Ho Chi Minh, and the Five Teachings of Uncle Ho in golden script on red board.
Table Altar: Elaborate festive Mid-Autumn five-fruit tray (mâm ngũ quả) featuring an adorable carved pomelo dog with black bean eyes, a green watermelon carved with traditional dragon motif, yellow bananas, red persimmons, and dragonfruit; accompanied by a white porcelain vase with fresh yellow chrysanthemums.
On the Right: Student study corner with a neat wooden desk, glowing study lamp, fountain pen, and artistic pyramid stack of neat notebooks.
On the Left: Vibrant red banner reading "Thiếu nhi Ninh Bình vững bước tiến vào kỷ nguyên mới", Young Pioneer brass snare drum, and Pioneer flag.
Style: ${styleMode}. Warm ambient indoor camp lighting, richly textured documentary photography.`;

      case 'performance_dance':
        return `A lively, joyful photograph of Vietnamese school children performing the Mid-Autumn Festival group dance on an outdoor festival stage in Hai Anh commune, 2026.
Performers: A synchronized ensemble of 14 boys and girls aged 10-14, dressed in vibrant traditional Vietnamese costumes with silk sashes and red pioneer scarves.
Props: Each dancer holds an illuminated lotus flower lantern that glows warmly in the evening twilight.
Background: The festival backdrop banner reading "HỘI TRẠI THU NĂM 2026 - LỒNG ĐÈN THẮP SÁNG ƯỚC MƠ - XÃ HẢI ANH", flanked by large colorful star lanterns and festive stage lighting.
Style: ${styleMode}. Expressive movement, joyful smiles, graceful dance poses, stunning cultural celebration photography.`;
    }
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    setApiError(null);

    try {
      const response = await fetch('/api/ai/generate-camp-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          style: styleMode,
          viewMode: selectedPreset === 'night_festival' ? 'night' : 'day',
          customDetails: customPromptDetails,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Lỗi khi gọi mô hình tạo ảnh AI');
      }

      if (data.imageUrl) {
        setGeneratedImage(data.imageUrl);
      }
    } catch (err: any) {
      console.error(err);
      setApiError(err.message || 'Không thể tạo ảnh từ API. Bạn có thể copy câu lệnh prompt chi tiết bên dưới.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(getPromptForPreset());
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  return (
    <div id="ai-image-studio-root" className="space-y-6">
      {/* Studio Header Card */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 border border-slate-800 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-semibold mb-2 border border-emerald-500/25">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>AI Trại Thu Xã Hải Anh 2026</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white">
              Studio Tạo Phối Cảnh Trại & Văn Nghệ
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Tạo ảnh phối cảnh 3D/thực tế sắc nét cho cổng trại hộp kép (1,8m x 1,2m), lều trại, mâm ngũ quả, góc học tập và các tiết mục văn nghệ theo đúng chủ đề <strong className="text-emerald-400">"Lồng đèn thắp sáng ước mơ"</strong>.
            </p>
          </div>

          <button
            id="btn-copy-ai-prompt"
            onClick={handleCopyPrompt}
            className="self-start sm:self-center flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors shadow-sm cursor-pointer"
          >
            {copiedPrompt ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-300">Đã chép Prompt!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-emerald-400" />
                <span>Sao chép Prompt 4K</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Preset Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <button
          id="preset-night-festival"
          onClick={() => setSelectedPreset('night_festival')}
          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
            selectedPreset === 'night_festival'
              ? 'bg-slate-900 text-white border-emerald-500 ring-2 ring-emerald-500/20 shadow-sm'
              : 'bg-white border-slate-200 hover:border-slate-300 text-slate-900'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold ${selectedPreset === 'night_festival' ? 'text-emerald-400' : 'text-slate-500'}`}>Góc nhìn 1</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${selectedPreset === 'night_festival' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-100 text-slate-700'}`}>Đêm hội</span>
          </div>
          <h4 className={`text-sm font-semibold mt-1 ${selectedPreset === 'night_festival' ? 'text-white' : 'text-slate-900'}`}>Đêm Hội Trăng Rằm</h4>
          <p className={`text-xs mt-1 line-clamp-2 ${selectedPreset === 'night_festival' ? 'text-slate-300' : 'text-slate-500'}`}>
            Cổng trại rực rỡ đèn lồng ông sao, đèn led sao băng, ánh trăng rằm tháng Tám lung linh.
          </p>
        </button>

        <button
          id="preset-day-gate"
          onClick={() => setSelectedPreset('day_gate')}
          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
            selectedPreset === 'day_gate'
              ? 'bg-slate-900 text-white border-emerald-500 ring-2 ring-emerald-500/20 shadow-sm'
              : 'bg-white border-slate-200 hover:border-slate-300 text-slate-900'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold ${selectedPreset === 'day_gate' ? 'text-emerald-400' : 'text-slate-500'}`}>Góc nhìn 2</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${selectedPreset === 'day_gate' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-100 text-slate-700'}`}>Cận cảnh cổng</span>
          </div>
          <h4 className={`text-sm font-semibold mt-1 ${selectedPreset === 'day_gate' ? 'text-white' : 'text-slate-900'}`}>Cổng Hộp Kép 4 Trụ</h4>
          <p className={`text-xs mt-1 line-clamp-2 ${selectedPreset === 'day_gate' ? 'text-slate-300' : 'text-slate-500'}`}>
            Chi tiết 4 trụ vuông, 2 cửa lách, kích thước chuẩn 1,8m x 1,2m, chữ nổi "Lồng đèn thắp sáng ước mơ".
          </p>
        </button>

        <button
          id="preset-altar-fruits"
          onClick={() => setSelectedPreset('altar_fruits')}
          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
            selectedPreset === 'altar_fruits'
              ? 'bg-slate-900 text-white border-emerald-500 ring-2 ring-emerald-500/20 shadow-sm'
              : 'bg-white border-slate-200 hover:border-slate-300 text-slate-900'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold ${selectedPreset === 'altar_fruits' ? 'text-emerald-400' : 'text-slate-500'}`}>Góc nhìn 3</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${selectedPreset === 'altar_fruits' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-100 text-slate-700'}`}>Nội thất</span>
          </div>
          <h4 className={`text-sm font-semibold mt-1 ${selectedPreset === 'altar_fruits' ? 'text-white' : 'text-slate-900'}`}>Ban Thờ Bác & Mâm Quả</h4>
          <p className={`text-xs mt-1 line-clamp-2 ${selectedPreset === 'altar_fruits' ? 'text-slate-300' : 'text-slate-500'}`}>
            Cờ Tổ quốc, ảnh Bác, 5 điều Bác dạy, mâm ngũ quả chó bưởi, góc học tập bên phải, khẩu hiệu bên trái.
          </p>
        </button>

        <button
          id="preset-performance-dance"
          onClick={() => setSelectedPreset('performance_dance')}
          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
            selectedPreset === 'performance_dance'
              ? 'bg-slate-900 text-white border-emerald-500 ring-2 ring-emerald-500/20 shadow-sm'
              : 'bg-white border-slate-200 hover:border-slate-300 text-slate-900'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold ${selectedPreset === 'performance_dance' ? 'text-emerald-400' : 'text-slate-500'}`}>Góc nhìn 4</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${selectedPreset === 'performance_dance' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-100 text-slate-700'}`}>Văn nghệ</span>
          </div>
          <h4 className={`text-sm font-semibold mt-1 ${selectedPreset === 'performance_dance' ? 'text-white' : 'text-slate-900'}`}>Tiết Mục Múa Lồng Đèn</h4>
          <p className={`text-xs mt-1 line-clamp-2 ${selectedPreset === 'performance_dance' ? 'text-slate-300' : 'text-slate-500'}`}>
            Đội hình từ 12 đội viên nam nữ, trang phục rực rỡ, múa dẻo với đạo cụ hoa sen và lồng đèn phát sáng.
          </p>
        </button>
      </div>

      {/* Control Panel: Style & Generate Action */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Phong cách mỹ thuật AI:
            </label>
            <select
              id="select-ai-style"
              value={styleMode}
              onChange={(e) => setStyleMode(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="Chụp ảnh thực tế 4K chân thực (Photorealistic)">
                Chụp ảnh thực tế 4K chân thực (Photorealistic)
              </option>
              <option value="3D Phối cảnh kiến trúc sân vườn lễ hội (ArchViz 3D Render)">
                3D Phối cảnh kiến trúc sân vườn lễ hội (ArchViz 3D Render)
              </option>
              <option value="Bản vẽ phác thảo thi công màu nước (Hand-drawn Watercolor)">
                Bản vẽ phác thảo thi công màu nước (Hand-drawn Watercolor)
              </option>
              <option value="Tranh minh họa cổ tích Trung thu dân gian (Folk Art Illustration)">
                Tranh minh họa cổ tích Trung thu dân gian (Folk Art Illustration)
              </option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Chi tiết bổ sung (tùy chọn):
            </label>
            <input
              id="input-custom-details"
              type="text"
              placeholder="VD: Thêm cờ ngũ sắc hai bên, bổ sung đèn kéo quân xoay..."
              value={customPromptDetails}
              onChange={(e) => setCustomPromptDetails(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Generate Button */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <span>Mô hình AI: Google Gemini Imagen / Flash Image trực tiếp</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-generate-ai-image"
              onClick={handleGenerate}
              disabled={isLoading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold text-xs transition-colors shadow-sm cursor-pointer"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>Đang xử lý tạo ảnh AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-white fill-white" />
                  <span>Tạo Ảnh Phối Cảnh AI</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Error message display */}
        {apiError && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-800">Thông báo tạo ảnh AI:</p>
              <p className="mt-0.5 text-amber-700 leading-relaxed">{apiError}</p>
              <p className="mt-1 text-[11px] text-amber-600">
                Gợi ý: Bạn có thể nhấn nút <strong>"Sao chép Prompt 4K"</strong> phía trên để dán vào bất kỳ công cụ AI nào (Google Gemini, Midjourney, Canva) hoặc sử dụng <strong>Mô hình Canvas 1:1 tương tác</strong> ở tab bên cạnh.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Generated Image Result Display or Full Prompt Breakdown */}
      {generatedImage ? (
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-emerald-600" />
              <span>Kết Quả Ảnh Tạo Bởi AI</span>
            </h3>
            <a
              href={generatedImage}
              download="trai_thu_hai_anh_2026.png"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Tải ảnh về máy</span>
            </a>
          </div>
          <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-950 flex items-center justify-center">
            <img
              src={generatedImage}
              alt="Ảnh phối cảnh trại thu Hải Anh 2026"
              className="w-full max-h-[520px] object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      ) : (
        /* Prompt Breakdown Box */
        <div className="bg-slate-900 text-slate-200 rounded-2xl p-4 sm:p-5 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-bold uppercase tracking-wider">
              <span>Bản Mô Tả Chi Tiết Kỹ Thuật (Prompt Grounding)</span>
            </div>
            <button
              onClick={handleCopyPrompt}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </button>
          </div>
          <p className="text-xs font-mono text-slate-300 bg-slate-950 p-3.5 rounded-xl border border-slate-800 whitespace-pre-wrap leading-relaxed">
            {getPromptForPreset()}
          </p>
        </div>
      )}
    </div>
  );
};
