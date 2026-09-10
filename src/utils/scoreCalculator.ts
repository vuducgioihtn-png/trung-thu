import { CampVisualConfig, PerformanceConfig } from '../types/camp';

export interface ScoreReport {
  artScore: number; // Max 20
  campScore: number; // Max 90
  totalScore: number; // Max 110
  breakdown: {
    section: string;
    items: {
      name: string;
      maxScore: number;
      actualScore: number;
      passed: boolean;
      note?: string;
    }[];
  }[];
  deductions: {
    description: string;
    points: number;
  }[];
  warnings: string[];
  recommendations: string[];
}

export function calculateScore(
  camp: CampVisualConfig,
  art: PerformanceConfig
): ScoreReport {
  const deductions: { description: string; points: number }[] = [];
  const warnings: string[] = [];
  const recommendations: string[] = [];

  // ----------------------------------------------------
  // I. VĂN NGHỆ (20 điểm)
  // ----------------------------------------------------
  let singingScore = 0;
  if (art.singingCorrectTopic && art.singingGoodMelody) {
    singingScore = 10;
  } else if (art.singingCorrectTopic) {
    singingScore = 6;
    warnings.push("Văn nghệ: Cần luyện tập thêm giai điệu & đúng nhạc bài hát để đạt trọn 10 điểm.");
  } else {
    singingScore = 2;
    warnings.push("Văn nghệ: Bài hát chưa đúng chủ đề Trung thu/quê hương đất nước.");
  }

  // 2. Múa
  const danceTopicScore = art.dancingCorrectTopic ? 2 : 0;
  const danceTeamSizeScore = (art.dancingTeamSize >= 12 && art.hasBothGenders) ? 2 : (art.dancingTeamSize >= 12 ? 1 : 0);
  if (art.dancingTeamSize < 12) {
    warnings.push(`Văn nghệ: Đội hình múa hiện có ${art.dancingTeamSize} bạn (Quy định: từ 12 đội viên trở lên, có cả nam và nữ).`);
  } else if (!art.hasBothGenders) {
    warnings.push("Văn nghệ: Đội hình múa cần kết hợp cả nam và nữ để đạt trọn 2 điểm số lượng.");
  }

  const danceRhythmScore = art.dancingCorrectRhythm ? 3 : 1;
  const danceGraceScore = art.dancingGraceful ? 3 : 1;
  const danceTotal = danceTopicScore + danceTeamSizeScore + danceRhythmScore + danceGraceScore;

  // Điểm trừ văn nghệ
  let artDeduction = 0;
  if (art.inappropriateCostume) {
    artDeduction += 1;
    deductions.push({ description: "Văn nghệ: Trang phục không đạt yêu cầu", points: 1 });
  }
  if (art.disrespectedLottery) {
    artDeduction += 1;
    deductions.push({ description: "Văn nghệ: Không tôn trọng kết quả bốc thăm", points: 1 });
  }
  if (art.misleadingPropaganda) {
    artDeduction += 2;
    deductions.push({ description: "Văn nghệ: Tuyên truyền sai lệch quan điểm / phát ngôn không đúng lúc", points: 2 });
  }
  if (art.wrongSongTopic) {
    artDeduction += 1;
    deductions.push({ description: "Văn nghệ: Đưa bài hát không đúng chủ đề", points: 1 });
  }

  const finalArtScore = Math.max(0, singingScore + danceTotal - artDeduction);

  // ----------------------------------------------------
  // II. ĐIỂM TRẠI VÀ TRANG TRÍ TRẠI (90 điểm)
  // ----------------------------------------------------
  // 1. Cổng (15 điểm)
  let gateTypeScore = 3;
  if (camp.gateType === 'hop_kep') {
    gateTypeScore = 7;
  } else if (camp.gateType === 'hop_don') {
    gateTypeScore = 5;
  }
  if (camp.gateType !== 'hop_kep') {
    recommendations.push("Nâng cấp cổng lên hộp kép (4 trụ vuông, 2 cửa lách) để đạt điểm tối đa 7đ cho loại cổng.");
  }

  // Kích thước cổng: cửa cao 1.8m, rộng 1.2m
  let gateDimensionScore = 2;
  const heightDiff = Math.abs(camp.gateHeight - 1.8);
  const widthDiff = Math.abs(camp.gateWidth - 1.2);
  if (heightDiff > 0.05 || widthDiff > 0.05) {
    gateDimensionScore = Math.max(0.5, 2 - (heightDiff + widthDiff) * 2);
    deductions.push({ 
      description: `Kích thước cổng lệch chuẩn (Hiện tại: ${camp.gateHeight}m x ${camp.gateWidth}m, Chuẩn: 1,8m x 1,2m)`, 
      points: Number((2 - gateDimensionScore).toFixed(1)) 
    });
  }

  // Trang trí cổng: thủ công đẹp = 5đ, in phun = 3đ
  const gateDecoScore = camp.decorationType === 'craft' ? 5 : 3;
  if (camp.decorationType === 'print') {
    recommendations.push("Chuyển từ bạt in phun sang chữ xốp đắp nổi thủ công để lấy trọn 5 điểm trang trí cổng.");
  }

  const gateTotal = Math.min(15, Number((gateTypeScore + gateDimensionScore + gateDecoScore).toFixed(1)));

  // 2. Chủ đề (10 điểm)
  const isTitleCorrect = camp.gateTitle.trim().toUpperCase() === 'LỒNG ĐÈN THẮP SÁNG ƯỚC MƠ';
  const titleTextScore = isTitleCorrect ? 5 : 2;
  if (!isTitleCorrect) {
    warnings.push("Chủ đề cổng phải ghi đúng chuẩn: 'Lồng đèn thắp sáng ước mơ' (hiện tại chưa chính xác).");
  }
  const colorScore = 2; // Màu sắc trang nhã
  const emblemScore = camp.historicalEmblem ? 3 : 0;
  if (!camp.historicalEmblem) {
    warnings.push("Thiếu biểu tượng lịch sử (Khuê Văn Các, Chùa Một Cột, Hoa sen) trên cổng trại (-3 điểm).");
  }
  const titleTotal = titleTextScore + colorScore + emblemScore;

  // 3. Trại (65 điểm)
  // a. Cột, cọc, mái (20 điểm)
  let poleScore = 10;
  if (Math.abs(camp.poleHeight - 1.8) > 0.05 || Math.abs(camp.poleDiameter - 3.0) > 0.2) {
    poleScore = 5;
    deductions.push({ 
      description: `Cột chính sai quy chuẩn (Hiện tại: cao ${camp.poleHeight}m, phi ${camp.poleDiameter}cm. Chuẩn: cao 1,8m, phi 3cm)`, 
      points: 5 
    });
  }
  const stakeSturdyScore = camp.hasSturdyStakes ? 5 : 2;
  const roofScore = camp.flatRoof ? 5 : 2;
  const columnRoofTotal = poleScore + stakeSturdyScore + roofScore;

  // b. Vệ sinh (10 điểm)
  const hygieneScore = camp.isClean ? 10 : 4;
  if (!camp.isClean) {
    deductions.push({ description: "Khu vực trại chưa giữ vệ sinh sạch sẽ", points: 6 });
  }

  // c. Trang trí (20 điểm)
  let decoInteriorScore = 0;
  // Cờ TQ, ảnh Bác, 5 điều Bác dạy (4đ)
  if (camp.hasTopNationalFlag && camp.hasUncleHoPortrait && camp.hasFiveTeachings) {
    decoInteriorScore += 4;
  } else {
    deductions.push({ description: "Thiếu cờ Tổ quốc, ảnh Bác hoặc 5 điều Bác Hồ dạy ở vị trí trên cùng", points: 2 });
  }

  // Mâm ngũ quả, lọ hoa (4đ)
  if (camp.hasFruitTray && camp.hasFlowerVase) {
    decoInteriorScore += 4;
  } else {
    deductions.push({ description: "Thiếu mâm ngũ quả hoặc lọ hoa tươi", points: 2 });
  }

  // Góc học tập (bên phải): Sách vở, bút mực, bàn học, đèn học (4đ)
  if (camp.studyCornerRight && camp.hasStudyDesk && camp.hasStudyLamp && camp.hasBooksAndPens) {
    decoInteriorScore += 4;
  } else if (!camp.studyCornerRight) {
    deductions.push({ description: "Treo/đặt góc học tập SAI VỊ TRÍ (Quy định: phải ở BÊN PHẢI trại)", points: 1 });
    decoInteriorScore += 2;
  } else {
    deductions.push({ description: "Góc học tập thiếu bàn học, đèn học, sách vở hoặc bút mực", points: 2 });
    decoInteriorScore += 2;
  }

  // Chủ đề năm học 2026-2027 (bên trái): "Thiếu nhi Ninh Bình vững bước tiến vào kỷ nguyên mới" (4đ)
  const isSloganCorrect = camp.sloganText.includes("Thiếu nhi Ninh Bình vững bước tiến vào kỷ nguyên mới");
  if (camp.sloganLeft && isSloganCorrect) {
    decoInteriorScore += 4;
  } else if (!camp.sloganLeft) {
    deductions.push({ description: "Treo khẩu hiệu chủ đề năm học SAI VỊ TRÍ (Quy định: phải ở BÊN TRÁI trại)", points: 1 });
    decoInteriorScore += 2;
  } else {
    deductions.push({ description: "Nội dung khẩu hiệu năm học chưa đúng chuẩn", points: 2 });
    decoInteriorScore += 2;
  }

  // Tranh truyện kèm theo (1đ)
  if (camp.hasStoryBooks) {
    decoInteriorScore += 1;
  } else {
    deductions.push({ description: "Thiếu tranh truyện thiếu nhi kèm theo", points: 0.5 });
  }

  // Thiết bị Đội: trống, cờ (1đ)
  if (camp.hasPioneerEquip) {
    decoInteriorScore += 1;
  } else {
    deductions.push({ description: "Thiếu trang thiết bị của Đội (trống Đội, cờ Đội)", points: 0.5 });
  }

  // Ánh sáng tốt (2đ)
  if (camp.hasGoodLighting) {
    decoInteriorScore += 2;
  } else {
    deductions.push({ description: "Ánh sáng trại chưa đạt chuẩn độ rực rỡ và an toàn", points: 1 });
  }

  // d. Kỹ thuật (15 điểm)
  let techScore = 0;
  // Khoảng cách từ nút đồng xu tới cọc con 80 cm, buộc nút thuyền chài: 4đ
  if (Math.abs(camp.knotDistanceCm - 80) <= 2 && camp.isCloveHitchKnot) {
    techScore += 4;
  } else if (!camp.isCloveHitchKnot) {
    deductions.push({ description: "Buộc sai nút thuyền chài ở cọc con", points: 2 });
    techScore += 1;
  } else {
    deductions.push({ description: `Khoảng cách nút đồng xu tới cọc con không đúng 80cm (hiện tại: ${camp.knotDistanceCm}cm)`, points: 1.5 });
    techScore += 2;
  }

  // Khoảng cách từ chân cột to tới chân cọc con buộc nóc = 1,8m: 2đ
  if (Math.abs(camp.poleToStakeDistanceM - 1.8) <= 0.05) {
    techScore += 2;
  } else {
    deductions.push({ description: `Khoảng cách chân cột to đến cọc con nóc không đúng 1,8m (hiện tại: ${camp.poleToStakeDistanceM}m)`, points: 1 });
    techScore += 1;
  }

  // Nút buộc đúng: 2đ
  techScore += camp.correctKnots ? 2 : 0;
  if (!camp.correctKnots) deductions.push({ description: "Có các nút buộc chưa đúng kỹ thuật", points: 0.5 });

  // Các cạnh trại song song nhau: 2đ
  techScore += camp.parallelEdges ? 2 : 0;
  if (!camp.parallelEdges) deductions.push({ description: "Các cạnh của trại chưa song song đều nhau", points: 0.5 });

  // Cọc thẳng hàng trước sau: 5đ
  techScore += camp.alignedStakes ? 5 : 2;
  if (!camp.alignedStakes) deductions.push({ description: "Cọc trước không thẳng hàng các cọc sau", points: 0.5 });

  // e. Trang trí tổng thể đẹp, thẩm mỹ, sáng tạo: 10đ
  const overallAestheticsScore = Math.min(10, Math.max(0, camp.overallAesthetics));

  const finalCampScore = Math.min(
    90,
    Number(
      (
        gateTotal +
        titleTotal +
        columnRoofTotal +
        hygieneScore +
        decoInteriorScore +
        techScore +
        overallAestheticsScore
      ).toFixed(1)
    )
  );

  const totalScore = Number((finalArtScore + finalCampScore).toFixed(1));

  const breakdown = [
    {
      section: 'I. ĐIỂM VĂN NGHỆ (20 điểm)',
      items: [
        { name: '1. Hát (đúng chủ đề Trung thu/Bác Hồ/quê hương, đúng nhạc, giai điệu)', maxScore: 10, actualScore: singingScore, passed: singingScore === 10 },
        { name: '2. Múa: Đúng chủ đề (2đ), Quân số ≥12 có nam nữ (2đ), Đúng nhịp (3đ), Dẻo đẹp (3đ)', maxScore: 10, actualScore: danceTotal, passed: danceTotal === 10 },
      ],
    },
    {
      section: 'II. ĐIỂM TRẠI: 1. CỔNG TRẠI (15 điểm)',
      items: [
        { name: 'Loại cổng (Hộp kép 4 trụ 2 cửa lách: 7đ | Hộp đơn 2 trụ: 5đ | Cổng đơn: 3đ)', maxScore: 7, actualScore: gateTypeScore, passed: gateTypeScore === 7 },
        { name: 'Kích thước chuẩn (Cửa cao 1,8m; Rộng 1,2m)', maxScore: 2, actualScore: gateDimensionScore, passed: gateDimensionScore === 2 },
        { name: 'Trang trí đẹp phù hợp thủ công (5đ) / In phun (3đ)', maxScore: 5, actualScore: gateDecoScore, passed: gateDecoScore === 5 },
      ],
    },
    {
      section: 'II. ĐIỂM TRẠI: 2. CHỦ ĐỀ CỔNG (10 điểm)',
      items: [
        { name: 'Chữ đẹp đúng nội dung: "Lồng đèn thắp sáng ước mơ"', maxScore: 5, actualScore: titleTextScore, passed: titleTextScore === 5 },
        { name: 'Màu sắc trang nhã', maxScore: 2, actualScore: colorScore, passed: true },
        { name: 'Có biểu tượng lịch sử kèm theo (Khuê Văn Các / Hoa sen / Chùa 1 Cột)', maxScore: 3, actualScore: emblemScore, passed: emblemScore === 3 },
      ],
    },
    {
      section: 'II. ĐIỂM TRẠI: 3a. CỘT, CỌC, MÁI (20 điểm)',
      items: [
        { name: 'Cột chính cao 1,8m đường kính 3cm', maxScore: 10, actualScore: poleScore, passed: poleScore === 10 },
        { name: 'Cọc con chắc chắn, đảm bảo', maxScore: 5, actualScore: stakeSturdyScore, passed: stakeSturdyScore === 5 },
        { name: 'Mái trại, mái phẳng đẹp', maxScore: 5, actualScore: roofScore, passed: roofScore === 5 },
      ],
    },
    {
      section: 'II. ĐIỂM TRẠI: 3b. VỆ SINH (10 điểm)',
      items: [
        { name: 'Vệ sinh khuôn viên trại sạch sẽ, ngăn nắp', maxScore: 10, actualScore: hygieneScore, passed: hygieneScore === 10 },
      ],
    },
    {
      section: 'II. ĐIỂM TRẠI: 3c. TRANG TRÍ NỘI THẤT (20 điểm)',
      items: [
        { name: 'Trên cùng là cờ Tổ quốc, ảnh Bác Hồ, 5 điều Bác Hồ dạy', maxScore: 4, actualScore: (camp.hasTopNationalFlag && camp.hasUncleHoPortrait && camp.hasFiveTeachings) ? 4 : 2, passed: camp.hasTopNationalFlag && camp.hasUncleHoPortrait && camp.hasFiveTeachings },
        { name: 'Có mâm ngũ quả, lọ hoa', maxScore: 4, actualScore: (camp.hasFruitTray && camp.hasFlowerVase) ? 4 : 2, passed: camp.hasFruitTray && camp.hasFlowerVase },
        { name: 'Góc học tập (BÊN PHẢI): Sách vở, bút mực, bàn học, đèn học', maxScore: 4, actualScore: (camp.studyCornerRight && camp.hasStudyDesk && camp.hasStudyLamp && camp.hasBooksAndPens) ? 4 : 2, passed: camp.studyCornerRight && camp.hasStudyDesk && camp.hasStudyLamp && camp.hasBooksAndPens },
        { name: 'Chủ đề năm học 2026-2027 (BÊN TRÁI): "Thiếu nhi Ninh Bình vững bước tiến vào kỷ nguyên mới"', maxScore: 4, actualScore: (camp.sloganLeft && isSloganCorrect) ? 4 : 2, passed: camp.sloganLeft && isSloganCorrect },
        { name: 'Có tranh truyện kèm theo', maxScore: 1, actualScore: camp.hasStoryBooks ? 1 : 0, passed: camp.hasStoryBooks },
        { name: 'Trang thiết bị của Đội: trống, cờ', maxScore: 1, actualScore: camp.hasPioneerEquip ? 1 : 0, passed: camp.hasPioneerEquip },
        { name: 'Ánh sáng tốt, an toàn', maxScore: 2, actualScore: camp.hasGoodLighting ? 2 : 1, passed: camp.hasGoodLighting },
      ],
    },
    {
      section: 'II. ĐIỂM TRẠI: 3d. KỸ THUẬT (15 điểm)',
      items: [
        { name: 'Khoảng cách từ nút đồng xu tới cọc con 80 cm, buộc nút thuyền chài', maxScore: 4, actualScore: (Math.abs(camp.knotDistanceCm - 80) <= 2 && camp.isCloveHitchKnot) ? 4 : 2, passed: Math.abs(camp.knotDistanceCm - 80) <= 2 && camp.isCloveHitchKnot },
        { name: 'Khoảng cách từ chân cột to tới chân cọc con buộc nóc trại = 1,8m', maxScore: 2, actualScore: Math.abs(camp.poleToStakeDistanceM - 1.8) <= 0.05 ? 2 : 1, passed: Math.abs(camp.poleToStakeDistanceM - 1.8) <= 0.05 },
        { name: 'Nút buộc đúng kỹ thuật', maxScore: 2, actualScore: camp.correctKnots ? 2 : 1, passed: camp.correctKnots },
        { name: 'Các cạnh của trại song song nhau', maxScore: 2, actualScore: camp.parallelEdges ? 2 : 1, passed: camp.parallelEdges },
        { name: 'Cọc trước thẳng hàng cọc sau, néo chắc chắn', maxScore: 5, actualScore: camp.alignedStakes ? 5 : 3, passed: camp.alignedStakes },
      ],
    },
  ];

  return {
    artScore: finalArtScore,
    campScore: finalCampScore,
    totalScore,
    breakdown,
    deductions,
    warnings,
    recommendations,
  };
}

export function calculateTotalScore(
  camp: CampVisualConfig,
  art: PerformanceConfig
) {
  const report = calculateScore(camp, art);
  const maxScore = 110;
  const percentage = Math.round((report.totalScore / maxScore) * 100);

  const isSloganCorrect = camp.sloganText.includes("Thiếu nhi Ninh Bình vững bước tiến vào kỷ nguyên mới");

  const breakdownSummary = {
    performance: {
      total: report.artScore,
      singingScore: (art.singingCorrectTopic && art.singingGoodMelody) ? 10 : (art.singingCorrectTopic ? 6 : 2),
      danceScore: (art.dancingCorrectTopic ? 2 : 0) + ((art.dancingTeamSize >= 12 && art.hasBothGenders) ? 2 : 1) + (art.dancingCorrectRhythm ? 3 : 1) + (art.dancingGraceful ? 3 : 1),
    },
    gate: {
      total: Math.min(15, (camp.gateType === 'hop_kep' ? 7 : (camp.gateType === 'hop_don' ? 5 : 3)) + (Math.abs(camp.gateHeight - 1.8) <= 0.05 && Math.abs(camp.gateWidth - 1.2) <= 0.05 ? 2 : 1) + (camp.decorationType === 'craft' ? 5 : 3)),
      typeScore: camp.gateType === 'hop_kep' ? 7 : (camp.gateType === 'hop_don' ? 5 : 3),
      dimensionScore: Math.abs(camp.gateHeight - 1.8) <= 0.05 && Math.abs(camp.gateWidth - 1.2) <= 0.05 ? 2 : 1,
      decoScore: camp.decorationType === 'craft' ? 5 : 3,
    },
    theme: {
      total: (camp.gateTitle.trim().toUpperCase() === 'LỒNG ĐÈN THẮP SÁNG ƯỚC MƠ' ? 5 : 2) + 2 + (camp.historicalEmblem ? 3 : 0),
      titleScore: camp.gateTitle.trim().toUpperCase() === 'LỒNG ĐÈN THẮP SÁNG ƯỚC MƠ' ? 5 : 2,
      presentationScore: (camp.historicalEmblem ? 3 : 0) + 2,
    },
    interiorAndTent: {
      total: report.campScore - Math.min(15, (camp.gateType === 'hop_kep' ? 7 : (camp.gateType === 'hop_don' ? 5 : 3)) + (Math.abs(camp.gateHeight - 1.8) <= 0.05 && Math.abs(camp.gateWidth - 1.2) <= 0.05 ? 2 : 1) + (camp.decorationType === 'craft' ? 5 : 3)) - ((camp.gateTitle.trim().toUpperCase() === 'LỒNG ĐÈN THẮP SÁNG ƯỚC MƠ' ? 5 : 2) + 2 + (camp.historicalEmblem ? 3 : 0)),
      structureScore: (Math.abs(camp.poleHeight - 1.8) <= 0.05 && Math.abs(camp.poleDiameter - 3.0) <= 0.2 ? 10 : 5) + (camp.hasSturdyStakes ? 5 : 2) + (camp.flatRoof ? 5 : 2),
      hygieneScore: camp.isClean ? 10 : 4,
      interiorDecoScore: ((camp.hasTopNationalFlag && camp.hasUncleHoPortrait && camp.hasFiveTeachings) ? 4 : 2) + ((camp.hasFruitTray && camp.hasFlowerVase) ? 4 : 2) + ((camp.studyCornerRight && camp.hasStudyDesk && camp.hasStudyLamp && camp.hasBooksAndPens) ? 4 : 2) + ((camp.sloganLeft && isSloganCorrect) ? 4 : 2) + (camp.hasStoryBooks ? 1 : 0) + (camp.hasPioneerEquip ? 1 : 0) + (camp.hasGoodLighting ? 2 : 1),
      techScore: ((Math.abs(camp.knotDistanceCm - 80) <= 2 && camp.isCloveHitchKnot) ? 4 : 2) + (Math.abs(camp.poleToStakeDistanceM - 1.8) <= 0.05 ? 2 : 1) + (camp.correctKnots ? 2 : 1) + (camp.parallelEdges ? 2 : 1) + (camp.alignedStakes ? 5 : 3),
    },
  };

  return {
    totalScore: report.totalScore,
    maxScore,
    percentage,
    deductions: report.deductions.map(d => `${d.description} (-${d.points}đ)`),
    warnings: report.warnings,
    recommendations: report.recommendations,
    breakdown: breakdownSummary,
    detailedReport: report,
  };
}

