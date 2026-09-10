export interface LotusHotspot {
  id: string;
  name: string;
  category: 'gate' | 'lighting' | 'altar' | 'study_corner' | 'pioneer' | 'structure';
  x: number; // percentage 0-100 on canvas
  y: number; // percentage 0-100 on canvas
  title: string;
  specs: string;
  materials: string[];
  scoringRule: string;
  notes: string;
}

export interface LotusMaterialItem {
  id: string;
  name: string;
  category: 'cong_tam_quan' | 'hoa_sen_den_long' | 'leu_khung_bat' | 'noi_that_le_nghi' | 'goc_hoc_tap' | 'nghi_thuc_doi' | 'dien_chieu_sang' | 'san_vuon_hang_rao';
  specification: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  totalCost: number;
  source: 'mua_moi' | 'thue_muon' | 'co_san' | 'tu_che_tai_tro';
  status: 'chua_co' | 'dang_chuan_bi' | 'da_san_sang';
  assignee: string;
  notes?: string;
}

export interface LotusConstructionStep {
  stepNumber: number;
  title: string;
  phase: 'chuan_bi' | 'gia_cong_xuong' | 'lap_dung_khung' | 'dien_trang_tri' | 'hoan_thien_noi_that';
  timeline: string;
  durationHours: number;
  leader: string;
  workersCount: number;
  checklist: string[];
  safetyWarnings: string[];
  acceptanceCriteria: string;
}

export interface LotusScoreAuditItem {
  id: string;
  section: string;
  criterion: string;
  maxScore: number;
  awardedScore: number;
  ruleReference: string;
  howThisModelComplies: string;
  isPerfect: boolean;
}
