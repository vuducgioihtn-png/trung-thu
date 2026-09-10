export interface PerformanceItem {
  id: string;
  order: number;
  title: string;
  genre: 'Hát múa tập thể' | 'Múa đạo cụ đèn lồng' | 'Hoạt cảnh kịch Trung thu' | 'Đồng diễn dân vũ';
  durationMinutes: number;
  castCount: number;
  maleCount: number;
  femaleCount: number;
  leadPerformers: string;
  musicTrack: string;
  props: string[];
  costumes: string;
  description: string;
  status: 'ready' | 'rehearsing' | 'planned';
}

export interface PerformerMember {
  id: number;
  name: string;
  gender: 'nam' | 'nu';
  grade: string;
  role: string;
  entrySide: 'Cánh gà Trái' | 'Cánh gà Phải';
  costume: string;
  primaryProp: string;
  safetyNote: string;
}

export interface StageCue {
  id: string;
  timestamp: string;
  actName: string;
  audioCue: string;
  lightingCue: string;
  stageAction: string;
  performerCue: string;
  isHighlight: boolean;
}

export interface ChoreographyStep {
  stepNumber: number;
  name: string;
  timeRange: string;
  formation: string;
  propsAction: string;
  visualNote: string;
  musicBeat: string;
  keyHighlight: string;
  positions: {
    id: number;
    label: string;
    gender: 'male' | 'female';
    x: number; // 0 to 440
    y: number; // 0 to 180
    action: string;
    prop: string;
  }[];
}

export const PERFORMER_ROSTER: PerformerMember[] = [
  { id: 1, name: 'Nguyễn Mai Linh', gender: 'nu', grade: 'Lớp 7A', role: 'Đội trưởng / Hát chính lĩnh xướng', entrySide: 'Cánh gà Trái', costume: 'Áo dài cách tân vàng trăng rằm viền đỏ thêu hoa sen', primaryProp: 'Mic cài tai + Hoa sen led nở bung 2 tầng', safetyNote: 'Đứng bục giữa cao 30cm ở màn kết, có hai bạn nam hỗ trợ giữ bục an toàn' },
  { id: 2, name: 'Trần Đức Anh', gender: 'nam', grade: 'Lớp 7B', role: 'Đội phó / Lĩnh xướng nam', entrySide: 'Cánh gà Phải', costume: 'Áo sơ mi trắng thắt khăn quàng đỏ, quần âu xanh than', primaryProp: 'Cờ Đội Thiếu niên Tiền phong gắn cán tre nhung đỏ', safetyNote: 'Giương cờ cao 2.2m góc 45 độ, chú ý khoảng cách đèn sân khấu' },
  { id: 3, name: 'Lê Hải Yến', gender: 'nu', grade: 'Lớp 6A', role: 'Cánh trái chữ V / Múa đèn', entrySide: 'Cánh gà Trái', costume: 'Áo bà ba lụa vàng óng ả, quần lụa đen bóng', primaryProp: 'Đèn ông sao 5 cánh gắn chip led nhấp nháy 3 chế độ', safetyNote: 'Di chuyển giữ cự ly cách mép sân khấu 1.2m' },
  { id: 4, name: 'Phạm Tuấn Kiệt', gender: 'nam', grade: 'Lớp 6B', role: 'Tiết tấu nhịp trống ếch', entrySide: 'Cánh gà Phải', costume: 'Áo bà ba nâu đơm cúc chéo mộc mạc', primaryProp: 'Trống ếch Trung thu da bò + Cặp dùi gỗ quấn lụa', safetyNote: 'Gõ nhịp "Tùng rinh rinh" dứt khoát làm chuẩn cho toàn đội' },
  { id: 5, name: 'Vũ Thảo My', gender: 'nu', grade: 'Lớp 7A', role: 'Múa chính Solo lụa ngũ sắc', entrySide: 'Cánh gà Trái', costume: 'Đầm xòe cánh sen hồng đào, vấn khăn nhung đỏ đính ngọc', primaryProp: 'Dải lụa mềm ngũ sắc dài 2.5m uốn lượn hình sóng', safetyNote: 'Vung lụa theo quỹ đạo tròn tránh chạm vào đèn led các bạn xung quanh' },
  { id: 6, name: 'Hoàng Minh Khang', gender: 'nam', grade: 'Lớp 7C', role: 'Trụ tháp tầng 2 / Đèn lồng lớn', entrySide: 'Cánh gà Phải', costume: 'Áo bà ba xanh lam đồng phục chi đoàn', primaryProp: 'Đèn lồng kéo quân lục giác phát quang', safetyNote: 'Nâng đèn ngang ngực vững vàng trong 45 giây kết màn' },
  { id: 7, name: 'Đặng Quỳnh Chi', gender: 'nu', grade: 'Lớp 6C', role: 'Cánh phải chữ V / Múa đèn', entrySide: 'Cánh gà Phải', costume: 'Áo bà ba lụa vàng óng ả, quần lụa đen bóng', primaryProp: 'Đèn ông sao 5 cánh gắn chip led', safetyNote: 'Di chuyển bước chân lướt nhẹ nhàng đồng bộ với Hải Yến bên cánh trái' },
  { id: 8, name: 'Bùi Gia Huy', gender: 'nam', grade: 'Lớp 6A', role: 'Trụ tháp tầng 1 / Chào Đội', entrySide: 'Cánh gà Phải', costume: 'Đồng phục Đội viên, khăn quàng đỏ', primaryProp: 'Đèn ông sao lớn cán dài 1.2m', safetyNote: 'Đứng tấn vững chãi tạo góc cạnh đế tháp' },
  { id: 9, name: 'Đỗ Bảo Ngọc', gender: 'nu', grade: 'Lớp 5A', role: 'Múa phụ họa hoa sen', entrySide: 'Cánh gà Trái', costume: 'Áo bà ba trắng lụa, nơ tóc cánh sen', primaryProp: 'Cặp hoa sen led phát sáng đổi màu RGB', safetyNote: 'Quỳ gối trên đệm mềm lót đầu gối giấu kín dưới tà áo' },
  { id: 10, name: 'Ngô Quang Dũng', gender: 'nam', grade: 'Lớp 7B', role: 'Trụ tháp tầng 1 / Rước đèn', entrySide: 'Cánh gà Trái', costume: 'Áo bà ba xanh lam, thắt đai đỏ', primaryProp: 'Đèn ông sao lớn cán dài 1.2m', safetyNote: 'Phối hợp nhịp nhàng với Gia Huy tạo đế cân xứng 2 bên' },
  { id: 11, name: 'Trịnh Hà Phương', gender: 'nu', grade: 'Lớp 6B', role: 'Múa phụ họa hoa sen', entrySide: 'Cánh gà Trái', costume: 'Áo bà ba trắng lụa, nơ sen', primaryProp: 'Cặp hoa sen led phát sáng', safetyNote: 'Động tác xòe hoa sen nở bung đúng nhịp phách 1 của điệp khúc' },
  { id: 12, name: 'Lưu Đình Phúc', gender: 'nam', grade: 'Lớp 6C', role: 'Bộ gõ phụ trợ / Thanh la', entrySide: 'Cánh gà Phải', costume: 'Áo bà ba nâu, khăn rằn Nam Bộ', primaryProp: 'Thanh la đồng gõ nhịp "Cắc... cắc... tùng"', safetyNote: 'Tạo hiệu ứng âm thanh cổ truyền rộn ràng cùng tiếng trống' },
  { id: 13, name: 'Phan Thùy Dung', gender: 'nu', grade: 'Lớp 7C', role: 'Vòng cung ngoài / Lụa vàng', entrySide: 'Cánh gà Phải', costume: 'Đầm sen hồng đào, vấn khăn nhung', primaryProp: 'Dải lụa vàng óng mềm mại', safetyNote: 'Chạy uốn lượn quanh vòng ngoài tạo hiệu ứng vầng hào quang mặt trăng' },
  { id: 14, name: 'Tạ Quang Hải', gender: 'nam', grade: 'Lớp 7A', role: 'Rước cờ Tổ quốc kết màn', entrySide: 'Cánh gà Trái', costume: 'Đồng phục Đội viên chỉnh tề, găng tay trắng', primaryProp: 'Cờ Tổ quốc kích thước 1.2m x 0.8m gắn cán tre mạ vàng', safetyNote: 'Bước ra giữa sân khấu đúng giây thứ 08:30 lúc nhạc lên cao trào nhất' }
];

export const STAGE_CUES: StageCue[] = [
  {
    id: 'cue_1',
    timestamp: '00:00 - 00:30',
    actName: 'Mở màn: Màn đêm thức giấc',
    audioCue: 'Tiếng sáo trúc du dương dạo đầu, âm lượng 40% tăng dần lên 70% (Fade In)',
    lightingCue: 'Đèn sân khấu tối mờ (Blue Night 30%), rọi 2 luồng follow spot vàng ấm vào 2 cánh gà',
    stageAction: '8 em nữ cầm đèn sao bước ra nhịp nhàng từ cánh gà Trái, 6 em nam rước cờ và trống từ cánh gà Phải',
    performerCue: 'Bật công tắc đèn led ông sao ở nấc 1 (sáng tĩnh vàng ấm)',
    isHighlight: false
  },
  {
    id: 'cue_2',
    timestamp: '00:30 - 01:30',
    actName: 'Màn 1: Vầng trăng Hải Anh',
    audioCue: 'Tiếng trống ếch "Tùng... rinh... rinh" cất lên, beat nhạc sôi động 100% âm lượng',
    lightingCue: 'Toàn bộ đèn pha sân khấu bật sáng rực rỡ (White Warm 100%), đèn moving quét tia ngũ sắc',
    stageAction: '14 em ráp thành hình Vòng Cung Trăng Rằm mềm mại, nhún chân nhịp 2/4',
    performerCue: 'Chuyển đèn led ông sao sang chế độ chớp nháy đuổi màu theo tiếng trống',
    isHighlight: true
  },
  {
    id: 'cue_3',
    timestamp: '01:30 - 04:00',
    actName: 'Màn 2: Nhịp bước măng non',
    audioCue: 'Hát chính cất giọng lĩnh xướng trong trẻo, dàn đồng ca nam nữ hát bè phụ họa',
    lightingCue: 'Ánh sáng hồng cánh sen bao phủ sân khấu, đèn rọi chính diện vào em Mai Linh và Đức Anh',
    stageAction: 'Đội hình tách làm 2 hàng dọc đan xen lượn sóng, xoay vòng 360 độ uyển chuyển',
    performerCue: '4 em hoa sen quỳ gối xòe hoa nở bung 2 tầng, 4 em nam nâng cao đèn lồng',
    isHighlight: false
  },
  {
    id: 'cue_4',
    timestamp: '04:00 - 06:30',
    actName: 'Màn 3: Lồng đèn thắp sáng ước mơ',
    audioCue: 'Đoạn điệp khúc bùng nổ, bộ gõ dồn dập hùng tráng, tiếng reo hò rộn rã',
    lightingCue: 'Đèn chớp nháy laser quét hình ngôi sao trên phông hậu sân khấu, máy phun bong bóng xà phòng',
    stageAction: 'Xếp thành đội hình Chữ V Chiến Thắng (Victory) tỏa rộng toàn bộ bề ngang sân khấu 8m',
    performerCue: 'Tất cả 14 em cùng cười tươi rạng rỡ nhìn thẳng Ban Giám Khảo, đồng thanh hát vang',
    isHighlight: true
  },
  {
    id: 'cue_5',
    timestamp: '06:30 - 08:30',
    actName: 'Màn 4: Hoa sen đất mẹ dâng Bác',
    audioCue: 'Giai điệu chuyển sang êm ái, tha thiết ca ngợi công ơn Bác Hồ và quê hương Ninh Bình đổi mới',
    lightingCue: 'Đèn vàng ấm nghệ thuật, máy khói lạnh phủ bồng bềnh dưới chân diễn viên như mây trời',
    stageAction: 'Đội hình xoay tròn 2 vòng đồng tâm: Lớp trong xoay thuận chiều kim đồng hồ, lớp ngoài ngược chiều',
    performerCue: 'Dải lụa ngũ sắc 2.5m của Thảo My uốn lượn mềm mại trên làn khói mây',
    isHighlight: false
  },
  {
    id: 'cue_6',
    timestamp: '08:30 - 09:30',
    actName: 'Màn 5: Đại kết màn Kim Tự Tháp',
    audioCue: 'Âm nhạc dâng trào tột đỉnh (Fortissimo fff), tiếng trống hội rền vang đất trời',
    lightingCue: 'Bật 100% công suất tất cả dàn đèn, pháo sáng điện tử (Cold Spark) bắn bùng sáng 2 bên cánh gà',
    stageAction: 'Khối Kim Tự Tháp 3 tầng định hình hoàn mỹ: Cờ Tổ quốc và cờ Đội bay phấp phới ở đỉnh cao',
    performerCue: 'Toàn đội đồng thanh hô: "Thiếu nhi Hải Anh - Vững bước tương lai!", giơ tay chào kiểu Đội viên',
    isHighlight: true
  }
];

export const INITIAL_PERFORMANCE_ITEMS: PerformanceItem[] = [
  {
    id: 'perf_1',
    order: 1,
    title: 'Hát múa: "Lồng Đèn Thắp Sáng Ước Mơ"',
    genre: 'Hát múa tập thể',
    durationMinutes: 4.5,
    castCount: 14,
    maleCount: 6,
    femaleCount: 8,
    leadPerformers: 'Mai Linh (hát chính), Đức Anh (lĩnh xướng nam)',
    musicTrack: 'Beat phối mới âm vang ngày hội (USB MP3 320kbps chuẩn ban tổ chức)',
    props: ['14 Lồng đèn ông sao 5 cánh phát sáng LED RGB', '8 Hoa sen lụa nở bung 2 tầng', 'Cờ Đội & Cờ Tổ quốc'],
    costumes: 'Nam: Quần âu xanh, áo sơ mi trắng thắt khăn quàng đỏ; Nữ: Áo bà ba lụa vàng ánh trăng, quần lụa đen',
    description: 'Tiết mục chủ đạo theo đúng chủ đề Hội trại thu 2026. Vũ đạo hào hùng, tôn vinh ước mơ của thiếu nhi xã Hải Anh vươn lên trong học tập kỷ nguyên mới.',
    status: 'ready',
  },
  {
    id: 'perf_2',
    order: 2,
    title: 'Múa lụa & đèn kéo quân: "Đêm Trăng Cổ Tích"',
    genre: 'Múa đạo cụ đèn lồng',
    durationMinutes: 3.5,
    castCount: 14,
    maleCount: 6,
    femaleCount: 8,
    leadPerformers: 'Thảo My, Hải Yến, Quỳnh Chi',
    musicTrack: 'Dân ca Bắc Bộ phối khí giao hưởng hiện đại',
    props: ['Đèn kéo quân mini tự xoay phát quang', 'Dải lụa mềm ngũ sắc dài 2.5 mét'],
    costumes: 'Đầm xòe cánh sen hồng đào, vấn khăn nhung đỏ đính ngọc trai truyền thống Bắc Bộ',
    description: 'Tái hiện không khí Tết Trung thu truyền thống với ánh sáng lung linh, điệu múa mềm mại lượn sóng tạo hình vầng trăng tròn tháng Tám.',
    status: 'ready',
  },
  {
    id: 'perf_3',
    order: 3,
    title: 'Hoạt cảnh Chú Cuội - Chị Hằng & Múa Lân Tí Hon',
    genre: 'Hoạt cảnh kịch Trung thu',
    durationMinutes: 1.5,
    castCount: 14,
    maleCount: 6,
    femaleCount: 8,
    leadPerformers: 'Tuấn Kiệt (Cuội), Mai Linh (Chị Hằng)',
    musicTrack: 'Tiếng trống lân rộn rã Trung thu và nhạc kịch vui nhộn',
    props: ['Đầu lân nhí đỏ vàng', 'Trống ếch Trung thu', 'Quạt mo Cuội'],
    costumes: 'Chị Hằng đầm voan trắng bồng bềnh, Cuội áo nâu đơm cúc chéo chân chất',
    description: 'Hoạt cảnh kết màn rộn rã, gửi lời chúc Tết Trung thu đoàn kết đến toàn thể nhân dân xã Hải Anh, tổng thời lượng khớp chuẩn 9.5 phút.',
    status: 'ready',
  },
];

export const CHOREOGRAPHY_STEPS: ChoreographyStep[] = [
  {
    stepNumber: 1,
    name: 'Màn 1: Vòng Cung Trăng Rằm',
    timeRange: '0:00 - 1:30',
    formation: 'Vòng cung trăng rằm',
    propsAction: '14 diễn viên cầm đèn ông sao di chuyển từ 2 cánh gà vào giữa sân khấu tạo hình vầng trăng khuyết mềm mại.',
    visualNote: 'Đèn led bật sáng đồng loạt trong bóng đêm, tạo hiệu ứng thị giác lung linh thu hút giám khảo ngay từ nốt nhạc đầu tiên.',
    musicBeat: 'Nhịp 2/4 êm ái, sáo trúc kết hợp trống ếch đệm nhè nhẹ',
    keyHighlight: 'Độ cong vòng cung phải đều tăm tắp, khoảng cách giữa mỗi em đúng 60cm.',
    positions: [
      { id: 3, label: '3', gender: 'female', x: 40, y: 130, action: 'Bước nhún cánh trái', prop: 'Đèn sao LED' },
      { id: 9, label: '9', gender: 'female', x: 80, y: 95, action: 'Múa tay hoa sen', prop: 'Đèn sao LED' },
      { id: 10, label: '10', gender: 'male', x: 130, y: 65, action: 'Giương cao đèn sao', prop: 'Đèn sao lớn' },
      { id: 5, label: '5', gender: 'female', x: 180, y: 45, action: 'Uốn lụa cung tròn', prop: 'Lụa ngũ sắc' },
      { id: 1, label: '1', gender: 'female', x: 220, y: 38, action: 'Hát chính lĩnh xướng', prop: 'Hoa sen LED' },
      { id: 2, label: '2', gender: 'male', x: 260, y: 45, action: 'Lĩnh xướng nam', prop: 'Cờ Đội' },
      { id: 8, label: '8', gender: 'male', x: 310, y: 65, action: 'Giương cao đèn sao', prop: 'Đèn sao lớn' },
      { id: 7, label: '7', gender: 'female', x: 360, y: 95, action: 'Múa tay hoa sen', prop: 'Đèn sao LED' },
      { id: 13, label: '13', gender: 'female', x: 400, y: 130, action: 'Bước nhún cánh phải', prop: 'Đèn sao LED' },
      // Inner accent row
      { id: 4, label: '4', gender: 'male', x: 150, y: 110, action: 'Gõ trống ếch nhịp nhàng', prop: 'Trống ếch' },
      { id: 11, label: '11', gender: 'female', x: 195, y: 95, action: 'Quỳ gối dâng hoa', prop: 'Hoa sen LED' },
      { id: 12, label: '12', gender: 'male', x: 245, y: 95, action: 'Gõ thanh la', prop: 'Thanh la' },
      { id: 6, label: '6', gender: 'male', x: 290, y: 110, action: 'Nâng đèn kéo quân', prop: 'Đèn kéo quân' },
      { id: 14, label: '14', gender: 'male', x: 220, y: 135, action: 'Cúi chào nghi thức', prop: 'Cờ Tổ quốc' }
    ]
  },
  {
    stepNumber: 2,
    name: 'Màn 2: Đan Xen Lượn Sóng',
    timeRange: '1:30 - 4:00',
    formation: '2 Hàng dọc đan xen lượn sóng',
    propsAction: 'Nam nữ ghép cặp xoay tròn 360 độ, hàng trái tiến hàng phải lùi nhịp nhàng như từng đợt sóng biển dạt dào.',
    visualNote: 'Đèn lồng chớp tắt theo nhịp phách, tạo cảm giác chuyển động đa chiều không gian sân khấu.',
    musicBeat: 'Nhịp điệu dồn dập tươi vui, tempo 110 BPM rộn rã',
    keyHighlight: 'Khi xoay vòng, tay cầm đèn ông sao phải giữ nguyên cao độ ngang cằm.',
    positions: [
      // Left wave column
      { id: 3, label: '3', gender: 'female', x: 110, y: 35, action: 'Tiến bước chéo', prop: 'Đèn sao LED' },
      { id: 10, label: '10', gender: 'male', x: 110, y: 70, action: 'Lùi bước né', prop: 'Đèn sao lớn' },
      { id: 5, label: '5', gender: 'female', x: 110, y: 105, action: 'Xoay lụa 180°', prop: 'Lụa ngũ sắc' },
      { id: 4, label: '4', gender: 'male', x: 110, y: 140, action: 'Gõ trống giữ nhịp', prop: 'Trống ếch' },
      // Center leads
      { id: 1, label: '1', gender: 'female', x: 200, y: 60, action: 'Hát chính tiến giữa', prop: 'Hoa sen LED' },
      { id: 2, label: '2', gender: 'male', x: 240, y: 60, action: 'Lĩnh xướng nam phối bè', prop: 'Cờ Đội' },
      { id: 11, label: '11', gender: 'female', x: 200, y: 115, action: 'Múa sen đối xứng', prop: 'Hoa sen LED' },
      { id: 9, label: '9', gender: 'female', x: 240, y: 115, action: 'Múa sen đối xứng', prop: 'Hoa sen LED' },
      // Right wave column
      { id: 13, label: '13', gender: 'female', x: 330, y: 35, action: 'Tiến bước chéo', prop: 'Đèn sao LED' },
      { id: 8, label: '8', gender: 'male', x: 330, y: 70, action: 'Lùi bước né', prop: 'Đèn sao lớn' },
      { id: 7, label: '7', gender: 'female', x: 330, y: 105, action: 'Xoay đèn 360°', prop: 'Đèn sao LED' },
      { id: 6, label: '6', gender: 'male', x: 330, y: 140, action: 'Nâng đèn kéo quân', prop: 'Đèn kéo quân' },
      // Anchors
      { id: 12, label: '12', gender: 'male', x: 160, y: 155, action: 'Gõ thanh la phụ trợ', prop: 'Thanh la' },
      { id: 14, label: '14', gender: 'male', x: 280, y: 155, action: 'Cầm cờ chuẩn bị', prop: 'Cờ Tổ quốc' }
    ]
  },
  {
    stepNumber: 3,
    name: 'Màn 3: Chữ V Chiến Thắng',
    timeRange: '4:00 - 6:30',
    formation: 'Đội hình chữ V tỏa sáng',
    propsAction: 'Hàng trước quỳ gối xòe hoa sen nở bung, hàng sau đứng giương cao đèn lồng ngôi sao tạo mũi tên chữ V vươn tới tương lai.',
    visualNote: 'Đội hình chữ V tượng trưng cho Chiến thắng (Victory) và Việt Nam, động tác dứt khoát, nụ cười rạng rỡ ăn trọn điểm biểu cảm.',
    musicBeat: 'Điệp khúc bùng nổ hoành tráng, hợp xướng nam nữ hòa quyện',
    keyHighlight: 'Đỉnh nhọn chữ V nằm chính giữa tim sân khấu, hai cánh mở đều góc 70 độ.',
    positions: [
      // Left V wing
      { id: 3, label: '3', gender: 'female', x: 50, y: 40, action: 'Giương cao đèn ngoài', prop: 'Đèn sao LED' },
      { id: 10, label: '10', gender: 'male', x: 90, y: 65, action: 'Giương cao đèn sao', prop: 'Đèn sao lớn' },
      { id: 5, label: '5', gender: 'female', x: 130, y: 90, action: 'Múa lụa uốn lượn', prop: 'Lụa ngũ sắc' },
      { id: 9, label: '9', gender: 'female', x: 170, y: 115, action: 'Quỳ dâng hoa sen', prop: 'Hoa sen LED' },
      // Center V apex
      { id: 1, label: '1', gender: 'female', x: 220, y: 140, action: 'Đỉnh chữ V hát vang', prop: 'Hoa sen LED' },
      // Right V wing
      { id: 11, label: '11', gender: 'female', x: 270, y: 115, action: 'Quỳ dâng hoa sen', prop: 'Hoa sen LED' },
      { id: 7, label: '7', gender: 'female', x: 310, y: 90, action: 'Múa đèn nhịp nhàng', prop: 'Đèn sao LED' },
      { id: 8, label: '8', gender: 'male', x: 350, y: 65, action: 'Giương cao đèn sao', prop: 'Đèn sao lớn' },
      { id: 13, label: '13', gender: 'female', x: 390, y: 40, action: 'Giương cao đèn ngoài', prop: 'Đèn sao LED' },
      // Inner support group
      { id: 2, label: '2', gender: 'male', x: 180, y: 55, action: 'Giương cờ Đội bay cao', prop: 'Cờ Đội' },
      { id: 14, label: '14', gender: 'male', x: 260, y: 55, action: 'Giương cờ Tổ quốc', prop: 'Cờ Tổ quốc' },
      { id: 4, label: '4', gender: 'male', x: 190, y: 85, action: 'Trống dồn dập', prop: 'Trống ếch' },
      { id: 12, label: '12', gender: 'male', x: 250, y: 85, action: 'Thanh la nhịp kép', prop: 'Thanh la' },
      { id: 6, label: '6', gender: 'male', x: 220, y: 70, action: 'Nâng cao đèn kéo quân', prop: 'Đèn kéo quân' }
    ]
  },
  {
    stepNumber: 4,
    name: 'Màn 4: Vòng Tròn Hoa Sen 2 Lớp',
    timeRange: '6:30 - 8:30',
    formation: 'Vòng tròn hoa sen xoay 2 lớp',
    propsAction: 'Lớp trong gồm 6 em quỳ xòe hoa sen nở, lớp ngoài 8 em chạy bước lướt xoay tròn quanh trục, lụa ngũ sắc uốn lượn như cánh chim hòa bình.',
    visualNote: 'Khói lạnh mây bay phủ đầy sân khấu, ánh sáng vàng nghệ thuật tạo không gian lung linh như cõi tiên.',
    musicBeat: 'Giai điệu tha thiết, sáo trúc vút cao ca ngợi đất nước',
    keyHighlight: 'Tốc độ quay của 2 vòng phải đều nhau, không ai bị vấp tà áo hay va chạm đạo cụ.',
    positions: [
      // Outer rotating circle (8 kids)
      { id: 3, label: '3', gender: 'female', x: 110, y: 90, action: 'Xoay tròn ngược chiều', prop: 'Đèn sao LED' },
      { id: 10, label: '10', gender: 'male', x: 140, y: 40, action: 'Xoay tròn ngược chiều', prop: 'Đèn sao lớn' },
      { id: 2, label: '2', gender: 'male', x: 220, y: 25, action: 'Xoay tròn ngược chiều', prop: 'Cờ Đội' },
      { id: 8, label: '8', gender: 'male', x: 300, y: 40, action: 'Xoay tròn ngược chiều', prop: 'Đèn sao lớn' },
      { id: 13, label: '13', gender: 'female', x: 330, y: 90, action: 'Xoay tròn ngược chiều', prop: 'Đèn sao LED' },
      { id: 7, label: '7', gender: 'female', x: 300, y: 140, action: 'Xoay tròn ngược chiều', prop: 'Đèn sao LED' },
      { id: 14, label: '14', gender: 'male', x: 220, y: 155, action: 'Xoay tròn ngược chiều', prop: 'Cờ Tổ quốc' },
      { id: 6, label: '6', gender: 'male', x: 140, y: 140, action: 'Xoay tròn ngược chiều', prop: 'Đèn kéo quân' },
      // Inner blooming core (6 kids)
      { id: 1, label: '1', gender: 'female', x: 200, y: 80, action: 'Hát chính tâm vòng', prop: 'Hoa sen LED' },
      { id: 5, label: '5', gender: 'female', x: 240, y: 80, action: 'Xòe lụa quanh tâm', prop: 'Lụa ngũ sắc' },
      { id: 9, label: '9', gender: 'female', x: 180, y: 105, action: 'Quỳ nở cánh sen', prop: 'Hoa sen LED' },
      { id: 11, label: '11', gender: 'female', x: 260, y: 105, action: 'Quỳ nở cánh sen', prop: 'Hoa sen LED' },
      { id: 4, label: '4', gender: 'male', x: 200, y: 120, action: 'Gõ nhịp chậm rãi', prop: 'Trống ếch' },
      { id: 12, label: '12', gender: 'male', x: 240, y: 120, action: 'Thanh la ngân vang', prop: 'Thanh la' }
    ]
  },
  {
    stepNumber: 5,
    name: 'Màn 5: Đại Kết Màn Kim Tự Tháp',
    timeRange: '8:30 - 9:30',
    formation: 'Đội hình kim tự tháp 3 tầng kết màn',
    propsAction: 'Đội trưởng Mai Linh đứng bục giữa nâng cao Quốc kỳ và Đèn lồng chủ đề, toàn đội vẫy tay chào đồng thanh: "Thiếu nhi Hải Anh - Thắp sáng ước mơ!".',
    visualNote: 'Pháo sáng điện tử bắn rực rỡ, toàn bộ khán trường và Ban Giám Khảo đứng dậy vỗ tay tán thưởng.',
    musicBeat: 'Đoạn kết hào sảng vang dội, hợp xướng ngân dài 8 nhịp',
    keyHighlight: 'Tất cả 14 em giữ nguyên tư thế chào Đội viên nghiêm trang trong 10 giây đến khi tắt đèn.',
    positions: [
      // Top Pinnacle Tier 3 (1 kid)
      { id: 1, label: '1', gender: 'female', x: 220, y: 20, action: 'Đứng bục cao nâng Quốc kỳ', prop: 'Cờ Tổ quốc' },
      // Tier 2 (4 kids)
      { id: 2, label: '2', gender: 'male', x: 180, y: 60, action: 'Giương cao cờ Đội', prop: 'Cờ Đội' },
      { id: 6, label: '6', gender: 'male', x: 260, y: 60, action: 'Nâng đèn kéo quân', prop: 'Đèn kéo quân' },
      { id: 5, label: '5', gender: 'female', x: 140, y: 85, action: 'Lụa vàng xòe cánh', prop: 'Lụa ngũ sắc' },
      { id: 13, label: '13', gender: 'female', x: 300, y: 85, action: 'Lụa vàng xòe cánh', prop: 'Lụa ngũ sắc' },
      // Tier 1 - Mid row (4 kids)
      { id: 9, label: '9', gender: 'female', x: 170, y: 105, action: 'Dâng hoa sen nở', prop: 'Hoa sen LED' },
      { id: 11, label: '11', gender: 'female', x: 270, y: 105, action: 'Dâng hoa sen nở', prop: 'Hoa sen LED' },
      { id: 4, label: '4', gender: 'male', x: 205, y: 110, action: 'Trống hội dồn dập', prop: 'Trống ếch' },
      { id: 12, label: '12', gender: 'male', x: 235, y: 110, action: 'Thanh la dồn dập', prop: 'Thanh la' },
      // Base row - Kneeling / Salute (5 kids)
      { id: 10, label: '10', gender: 'male', x: 60, y: 145, action: 'Chào nghi thức Đội', prop: 'Đèn sao lớn' },
      { id: 3, label: '3', gender: 'female', x: 120, y: 145, action: 'Quỳ gối giơ cao đèn', prop: 'Đèn sao LED' },
      { id: 14, label: '14', gender: 'male', x: 220, y: 145, action: 'Cúi chào Ban Giám Khảo', prop: 'Đèn sao LED' },
      { id: 7, label: '7', gender: 'female', x: 320, y: 145, action: 'Quỳ gối giơ cao đèn', prop: 'Đèn sao LED' },
      { id: 8, label: '8', gender: 'male', x: 380, y: 145, action: 'Chào nghi thức Đội', prop: 'Đèn sao lớn' }
    ]
  }
];
