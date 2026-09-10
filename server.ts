import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const PORT = 3000;

async function startServer() {
  const app = express();
  app.use(express.json({ limit: "15mb" }));

  // Lazy Gemini client getter
  const getGeminiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return null;
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  };

  // API Health
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    });
  });

  // AI Camp Advisor & Score Analysis
  app.post("/api/ai/analyze-compliance", async (req, res) => {
    try {
      const { campConfig, performanceConfig } = req.body;
      const ai = getGeminiClient();

      if (!ai) {
        return res.status(200).json({
          fallback: true,
          suggestions: [
            "Đảm bảo cổng hộp kép đủ 4 trụ vuông và 2 cửa lách bên (đạt 7/7 điểm loại cổng).",
            "Cửa chính phải đo chính xác: cao đúng 1,8m và rộng đúng 1,2m để không bị trừ 0,5 - 1,5 điểm.",
            "Chủ đề cổng bắt buộc đúng chính xác: 'Lồng đèn thắp sáng ước mơ' kèm biểu tượng lịch sử (Khuê Văn Các hoặc hoa sen) (đạt 10/10 điểm chủ đề).",
            "Cột chính lều phải cao 1,8m và đường kính 3cm (10 điểm).",
            "Khoảng cách từ nút đồng xu tới cọc con phải đúng 80cm và buộc nút thuyền chài (4 điểm).",
            "Khoảng cách từ chân cột to tới chân cọc con buộc nóc trại = 1,8m (2 điểm).",
            "Nội thất: Trên cùng cờ Tổ quốc + ảnh Bác + 5 điều Bác dạy (4đ); Giữa: mâm ngũ quả + lọ hoa (4đ); Bên phải: Góc học tập (bàn, đèn, bút, sách) (4đ); Bên trái: Khẩu hiệu 'Thiếu nhi Ninh Bình vững bước tiến vào kỷ nguyên mới' (4đ); Kèm tranh truyện (1đ), Trống cờ Đội (1đ), Ánh sáng tốt (2đ).",
            "Văn nghệ: Đội hình múa phải có từ 12 đội viên trở lên (có cả nam và nữ) để đạt trọn 2 điểm số lượng.",
          ],
        });
      }

      const prompt = `
Bạn là chuyên gia thẩm định và cố vấn kỹ thuật cắm trại - văn nghệ Trung thu thiếu nhi tại xã Hải Anh năm 2026.
Dựa trên THANG ĐIỂM THI ĐUA VĂN NGHỆ - TRẠI THU NĂM 2026 XÃ HẢI ANH:
- Văn nghệ: 20 điểm (Hát đúng chủ đề/nhịp 10đ; Múa đúng chủ đề 2đ, từ 12 đội viên nam nữ 2đ, đúng nhịp 3đ, dẻo đẹp 3đ; Trừ 5đ)
- Cổng trại: 15 điểm (Hộp kép 4 trụ 2 lách 7đ; kích thước cao 1.8m rộng 1.2m 2đ; trang trí thủ công/đẹp 5đ)
- Chủ đề: 10 điểm ("Lồng đèn thắp sáng ước mơ", chữ đẹp 5đ, màu sắc nhã 2đ, biểu tượng lịch sử 3đ)
- Trại: Cột chính 1.8m phi 3cm (10đ), Cọc con chắc chắn (5đ), Mái phẳng đẹp (5đ)
- Vệ sinh: 10đ
- Trang trí: Trên cùng cờ TQ, ảnh Bác, 5 điều Bác dạy (4đ); Mâm ngũ quả + lọ hoa (4đ); Góc học tập bên PHẢI (4đ); Khẩu hiệu năm học bên TRÁI "Thiếu nhi Ninh Bình vững bước tiến vào kỷ nguyên mới" (4đ); Tranh truyện (1đ); Thiết bị Đội trống cờ (1đ); Ánh sáng (2đ).
- Kỹ thuật: Nút đồng xu tới cọc con 80cm nút thuyền chài (4đ); Chân cột to tới cọc nóc 1.8m (2đ); Nút buộc đúng (2đ); Cạnh song song (2đ); Cọc thẳng hàng (5đ).
- Điểm trừ: Thiếu mục trừ 0.5đ, treo sai vị trí trừ 1đ, nút buộc sai trừ 0.5đ, cọc lệch trừ 0.5đ.

Dữ liệu hiện tại của chi đoàn:
Trại: ${JSON.stringify(campConfig)}
Văn nghệ: ${JSON.stringify(performanceConfig)}

Hãy đưa ra nhận xét chi tiết:
1. Dự đoán tổng điểm dự kiến (trên thang 110 điểm).
2. Các nguy cơ bị trừ điểm cụ thể theo từng điều khoản.
3. Hướng dẫn khắc phục và mẹo thi đua để đạt giải Nhất toàn xã.
Trả về dưới dạng JSON có cấu trúc:
{
  "estimatedScore": number,
  "riskWarnings": string[],
  "checklistPassed": string[],
  "checklistFailed": string[],
  "expertAdvice": string[]
}
`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const parsed = JSON.parse(response.text || "{}");
      return res.json(parsed);
    } catch (error: any) {
      console.error("Compliance error:", error);
      res.status(500).json({ error: error?.message || "Lỗi phân tích AI" });
    }
  });

  // AI Generate Image / Camp Visual
  app.post("/api/ai/generate-camp-image", async (req, res) => {
    try {
      const { style, viewMode, customDetails } = req.body;
      const ai = getGeminiClient();

      if (!ai) {
        return res.status(400).json({
          error: "Chưa cấu hình GEMINI_API_KEY trong cài đặt Secrets.",
        });
      }

      const promptText = `A stunning photorealistic 4k festival photo of a Vietnamese Mid-Autumn youth pioneer camp in Hai Anh commune, Ninh Binh province, 2026.
The camp gate is an elaborate traditional square box gate with 4 large wooden pillars and 2 side wing doors, dimensions 1.8m high by 1.2m wide, with intricate golden and red dragon and lotus carvings, red banner with clear Vietnamese calligraphy 'Lồng đèn thắp sáng ước mơ' and historical emblem of Khue Van Cac.
Behind the gate is the camp tent with 1.8m center pole, perfectly pitched blue-red-yellow canvas, guy ropes secured with clove hitch knots to neat stakes exactly 80cm apart.
Inside the tent: centered at top is the National Flag of Vietnam, portrait of Uncle Ho Chi Minh, the Five Teachings of Uncle Ho; centered table with a glorious Mid-Autumn five-fruit tray (mâm ngũ quả) with sculpted pomelo dog and fresh flowers; on the RIGHT side is a student study corner with wooden desk, lamp, books, ink pens; on the LEFT side is the slogan banner 'Thiếu nhi Ninh Bình vững bước tiến vào kỷ nguyên mới', Pioneer brass snare drum and Young Pioneer flag.
Atmosphere: ${
        viewMode === "night"
          ? "Festive night scene illuminated by glowing colorful traditional five-point star lanterns (lồng đèn ông sao), warm fairy lights, bright full moon in starry sky"
          : "Bright golden sunny afternoon, colorful fluttering flags, joyful Vietnamese children in blue and white youth pioneer uniforms with red scarves"
      }.
Style: ${style || "photorealistic high detailed architectural photography"}. ${customDetails || ""}`;

      // Call gemini-3.1-flash-image
      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-image",
        contents: {
          parts: [{ text: promptText }],
        },
        config: {
          imageConfig: {
            aspectRatio: "16:9",
            imageSize: "1K",
          },
        },
      });

      let imageUrl: string | null = null;
      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData?.data) {
            imageUrl = `data:image/png;base64,${part.inlineData.data}`;
            break;
          }
        }
      }

      if (imageUrl) {
        return res.json({ imageUrl, prompt: promptText });
      }

      return res.status(500).json({
        error: "Không nhận được dữ liệu ảnh từ mô hình AI.",
        prompt: promptText,
      });
    } catch (error: any) {
      console.error("AI image generation error:", error);
      res.status(500).json({
        error: error?.message || "Lỗi tạo ảnh AI. Vui lòng kiểm tra lại hạn ngạch API.",
      });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Hải Anh 2026 Camp Server running on http://localhost:${PORT}`);
  });
}

startServer();
