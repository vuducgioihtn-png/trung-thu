export type GateType = 'hop_kep' | 'hop_don' | 'cong_don';

export type ViewAngle = 'overview' | 'gate' | 'gate_exploded' | 'side_elevation' | 'interior' | 'altar_detail' | 'technical';
export type LightingMode = 'day' | 'night';

export interface CampVisualConfig {
  gateType: GateType;
  gateHeight: number; // in meters, standard 1.8m
  gateWidth: number; // in meters, standard 1.2m
  gateTitle: string; // "Lồng đèn thắp sáng ước mơ"
  historicalEmblem: 'khue_van_cac' | 'chua_mot_cot' | 'hoa_sen' | 'thap_rua';
  decorationType: 'craft' | 'print'; // craft = 5 pts, print = 3 pts
  hasSideDoors: boolean;
  
  // Tent details
  poleHeight: number; // standard 1.8m
  poleDiameter: number; // standard 3cm
  hasSturdyStakes: boolean;
  flatRoof: boolean;
  isClean: boolean;

  // Interior decorations
  hasTopNationalFlag: boolean;
  hasUncleHoPortrait: boolean;
  hasFiveTeachings: boolean;
  hasFruitTray: boolean;
  hasFlowerVase: boolean;
  
  // Study corner (RIGHT side)
  studyCornerRight: boolean;
  hasBooksAndPens: boolean;
  hasStudyDesk: boolean;
  hasStudyLamp: boolean;

  // Slogan (LEFT side)
  sloganLeft: boolean;
  sloganText: string; // "Thiếu nhi Ninh Bình vững bước tiến vào kỷ nguyên mới"
  hasStoryBooks: boolean;
  hasPioneerEquip: boolean; // trống, cờ Đội
  hasGoodLighting: boolean;

  // Technical layout
  knotDistanceCm: number; // standard 80cm
  isCloveHitchKnot: boolean; // nút thuyền chài
  poleToStakeDistanceM: number; // standard 1.8m
  correctKnots: boolean;
  parallelEdges: boolean;
  alignedStakes: boolean;
  overallAesthetics: number; // 0-10 pts
}

export interface PerformanceConfig {
  singingCorrectTopic: boolean;
  singingGoodMelody: boolean;
  dancingCorrectTopic: boolean;
  dancingTeamSize: number; // >= 12
  hasBothGenders: boolean;
  dancingCorrectRhythm: boolean;
  dancingGraceful: boolean;
  
  // Penalties
  inappropriateCostume: boolean;
  disrespectedLottery: boolean;
  misleadingPropaganda: boolean;
  wrongSongTopic: boolean;
}

export type MaterialCategory = 
  | 'gate' // Cổng trại
  | 'tent_structure' // Khung cọc mái lều
  | 'interior_ceremony' // Bàn thờ Bác & Nghi lễ
  | 'study_corner' // Góc học tập & Khẩu hiệu
  | 'pioneer_gear' // Đạo cụ thiết bị Đội
  | 'performance' // Trang phục & Đạo cụ văn nghệ
  | 'logistics_feasting'; // Ánh sáng & Phá cỗ

export type MajorGroup = 'cam_trai' | 'van_nghe' | 'nghi_thuc_doi';

export interface MajorGroupInfo {
  id: MajorGroup;
  title: string;
  shortTitle: string;
  badge: string;
  description: string;
  categories: MaterialCategory[];
}

export const MAJOR_GROUPS: Record<MajorGroup, MajorGroupInfo> = {
  cam_trai: {
    id: 'cam_trai',
    title: '1. Cắm Trại (Khung Lều, Cổng & Mặt Bằng)',
    shortTitle: 'Cắm Trại',
    badge: '110đ Thi Đua',
    description: 'Cổng hộp kép 1.8m×1.2m, khung cọc mái bạt, dây néo 80cm, ban thờ Bác, đèn rọi & phá cỗ Trung thu',
    categories: ['gate', 'tent_structure', 'interior_ceremony', 'logistics_feasting'],
  },
  van_nghe: {
    id: 'van_nghe',
    title: '2. Văn Nghệ (Hát Múa 14 Em)',
    shortTitle: 'Văn Nghệ',
    badge: '20đ Văn Nghệ',
    description: '14 Đèn ông sao led, hoa sen lụa nở 2 tầng, trang phục bà ba/đầm sen, dải lụa ngũ sắc, nhạc beat USB',
    categories: ['performance'],
  },
  nghi_thuc_doi: {
    id: 'nghi_thuc_doi',
    title: '3. Nghi Thức Đội (Trống Cờ & Góc Học Tập)',
    shortTitle: 'Nghi Thức Đội',
    badge: 'Quy Chuẩn Đội',
    description: 'Bộ trống Đội 3 chiếc + dùi, cờ Đội, cờ Tổ quốc, khăn quàng đỏ, góc học tập (BÊN PHẢI) & khẩu hiệu (BÊN TRÁI)',
    categories: ['pioneer_gear', 'study_corner'],
  },
};

export const getCategoryMajorGroup = (cat: MaterialCategory): MajorGroup => {
  if (cat === 'performance') return 'van_nghe';
  if (cat === 'pioneer_gear' || cat === 'study_corner') return 'nghi_thuc_doi';
  return 'cam_trai';
};

export type MaterialStatus = 'pending' | 'in_progress' | 'completed';
export type MaterialSource = 'buy' | 'borrow' | 'available' | 'craft';

export interface MaterialItem {
  id: string;
  name: string;
  category: MaterialCategory;
  group?: MajorGroup;
  specification: string; // Quy cách kích thước kỹ thuật chuẩn
  unit: string;
  quantityNeeded: number;
  quantityReady: number;
  estimatedCost: number; // Đơn giá dự kiến (VNĐ)
  source: MaterialSource;
  status: MaterialStatus;
  assignee: string; // Người phụ trách
  verified: boolean; // Đã nghiệm thu đạt chuẩn thang điểm
  notes?: string;
}

export type FundingSource = 'chi_doan' | 'xom' | 'xa_doan' | 'phu_huynh' | 'tai_tro';

export interface BudgetItem {
  id: string;
  category: MaterialCategory;
  group?: MajorGroup;
  name: string;
  unit: string;
  unitPrice: number;
  quantity: number;
  total: number;
  fundingSource: FundingSource;
  isPaid: boolean;
  note?: string;
}

export interface ScoreItem {
  id: string;
  section: 'van_nghe' | 'cong' | 'chu_de' | 'trai_khung' | 've_sinh' | 'trang_tri' | 'ky_thuat' | 'tong_the' | 'tru_diem';
  name: string;
  maxScore: number;
  currentScore: number;
  condition: string;
  isCompliant: boolean;
  deductionReason?: string;
}

// ----------------------------------------------------
// TASK ASSIGNMENT & TEAM MEMBER TYPES
// ----------------------------------------------------
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'delayed';
export type TaskPriority = 'high' | 'medium' | 'low';
export type TaskDepartment = 'cam_trai' | 'van_nghe' | 'nghi_thuc_doi' | 'hau_can';

export interface TaskChecklistItem {
  id: string;
  text: string;
  done: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: TaskDepartment;
  phone?: string;
  notes?: string;
  avatarColor?: string;
}

export interface CampTask {
  id: string;
  title: string;
  department: TaskDepartment;
  assigneeId: string;
  assigneeName: string;
  coAssignees?: string[];
  status: TaskStatus;
  priority: TaskPriority;
  deadline: string;
  notes: string;
  checklist?: TaskChecklistItem[];
  scoringImpact?: string;
}
