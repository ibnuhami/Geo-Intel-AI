/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { User, SurveyLog, GeospatialAsset, PolygonRecord, ActivityHistory, NotificationItem, ReportItem } from '../types';

export const mockUsers: User[] = [
  {
    id: 'USR-001',
    name: 'Budi Santoso',
    email: 'budi.santoso@geointel.ai',
    role: 'Super Admin',
    regions: ['Nasional (Semua Wilayah)'],
    status: true,
    lastActive: '2 Jam yang lalu',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120'
  },
  {
    id: 'USR-002',
    name: 'Siti Rahmawati',
    email: 'siti.r@geointel.ai',
    role: 'Admin Wilayah',
    regions: ['Jawa Barat', 'Banten'],
    status: true,
    lastActive: 'Kemarin, 14:30',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120'
  },
  {
    id: 'USR-003',
    name: 'Agus Gunawan',
    email: 'agus.g@geointel.ai',
    role: 'Surveyor',
    regions: ['Bandung Raya'],
    status: true,
    lastActive: 'Hari ini, 09:15',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120'
  },
  {
    id: 'USR-004',
    name: 'Dian Permata',
    email: 'dian.p@geointel.ai',
    role: 'Viewer',
    regions: ['DKI Jakarta'],
    status: true,
    lastActive: '3 Hari yang lalu',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120'
  }
];

export const mockSurveyLogs: SurveyLog[] = [
  {
    id: '#GEO-8021',
    type: 'Fasilitas Umum',
    region: 'Jakarta Selatan',
    confidenceScore: 0.98,
    aiStatus: 'Valid',
    icon: 'Building'
  },
  {
    id: '#GEO-8022',
    type: 'Infrastruktur Jalan',
    region: 'Jakarta Selatan',
    confidenceScore: 0.65,
    aiStatus: 'Perlu Review',
    icon: 'Milestone'
  },
  {
    id: '#GEO-8023',
    type: 'Area Komersil',
    region: 'Depok',
    confidenceScore: 0.20,
    aiStatus: 'Invalid',
    icon: 'ShoppingBag'
  },
  {
    id: '#GEO-8024',
    type: 'Ruang Terbuka Hijau',
    region: 'Bogor',
    confidenceScore: 0.95,
    aiStatus: 'Valid',
    icon: 'TreePine'
  },
  {
    id: '#GEO-8025',
    type: 'Fasilitas Kesehatan',
    region: 'Jakarta Timur',
    confidenceScore: 0.88,
    aiStatus: 'Valid',
    icon: 'HeartPulse'
  },
  {
    id: '#GEO-8026',
    type: 'Pendidikan',
    region: 'Tangerang Selatan',
    confidenceScore: 0.58,
    aiStatus: 'Perlu Review',
    icon: 'GraduationCap'
  }
];

export const mockAssets: GeospatialAsset[] = [
  {
    id: 'AST-2023-091',
    name: 'Puskesmas Kebon Jeruk',
    category: 'Kesehatan',
    address: 'Jl. Kebon Jeruk Raya No. 27, Jakarta Barat',
    coordinates: [-6.1983, 106.7725],
    areaSize: 4500,
    status: 'Terverifikasi',
    timestamp: '2h ago',
    imageUrl: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&q=80&w=400',
    surveyor: 'Budi S.'
  },
  {
    id: 'AST-2023-092',
    name: 'RSUD Tarakan',
    category: 'Rumah Sakit',
    address: 'Jl. Kyai Caringin No.7, Cideng, Jakarta Pusat',
    coordinates: [-6.1725, 106.8105],
    areaSize: 18200,
    status: 'Terverifikasi',
    timestamp: '1d ago',
    imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=400',
    surveyor: 'Ani R.'
  },
  {
    id: 'AST-2023-093',
    name: 'SMAN 70 Jakarta',
    category: 'Sekolah',
    address: 'Jl. Bulungan Blok C No.1, Kebayoran Baru, Jakarta Selatan',
    coordinates: [-6.2425, 106.7981],
    areaSize: 12450,
    status: 'Pending',
    timestamp: '3h ago',
    imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=400',
    surveyor: 'Citra M.'
  },
  {
    id: 'AST-2023-094',
    name: 'Koperasi Merah Putih',
    category: 'Koperasi',
    address: 'Jl. Sudirman Kav 50, Plaza Selatan, Jakarta',
    coordinates: [-6.2185, 106.8122],
    areaSize: 850,
    status: 'Terverifikasi',
    timestamp: '5d ago',
    imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=400',
    surveyor: 'Agus G.'
  },
  {
    id: 'AST-2023-095',
    name: 'Gudang Logistik Indah',
    category: 'Industri',
    address: 'Kawasan Industri Pulo Gadung Kav 12, Jakarta Timur',
    coordinates: [-6.1912, 106.9110],
    areaSize: 35000,
    status: 'Terverifikasi',
    timestamp: '1w ago',
    imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=400',
    surveyor: 'Agus G.'
  },
  {
    id: 'AST-2023-096',
    name: 'BUMDes Maju Makmur',
    category: 'BUMDes',
    address: 'Jl. Desa Makmur No. 4, Sukamakmur, Bogor',
    coordinates: [-6.5821, 106.9312],
    areaSize: 1200,
    status: 'Pending',
    timestamp: '2w ago',
    imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=400',
    surveyor: 'Dian P.'
  }
];

export const mockPolygons: PolygonRecord[] = [
  {
    id: 'POL-001',
    name: 'Kawasan Industri A',
    category: 'Bangunan',
    areaSize: 12450,
    status: 'Terverifikasi',
    updatedAt: 'Hari ini, 10:30',
    notes: 'Kawasan industri manufaktur dengan kepatuhan hijau.',
    coordinates: [
      [-6.240, 106.795],
      [-6.245, 106.795],
      [-6.245, 106.800],
      [-6.240, 106.800]
    ]
  },
  {
    id: 'POL-002',
    name: 'Lahan Parkir B',
    category: 'Lahan',
    areaSize: 5200,
    status: 'Review',
    updatedAt: 'Kemarin, 14:15',
    notes: 'Rencana ekspansi lahan parkir bertingkat terpadu.',
    coordinates: [
      [-6.242, 106.796],
      [-6.244, 106.796],
      [-6.244, 106.798],
      [-6.242, 106.798]
    ]
  },
  {
    id: 'POL-003',
    name: 'RTH Kebayoran',
    category: 'Fasilitas Umum',
    areaSize: 9800,
    status: 'Draft',
    updatedAt: '12 Jul 2026, 09:30',
    notes: 'Taman kota baru yang dilengkapi lintasan lari.',
    coordinates: [
      [-6.245, 106.799],
      [-6.248, 106.799],
      [-6.248, 106.802],
      [-6.245, 106.802]
    ]
  }
];

export const mockActivityHistory: ActivityHistory[] = [
  {
    id: 'ACT-001',
    fileName: 'jalan_provinsi_jabar.geojson',
    type: 'Import',
    dateTime: 'Hari ini, 14:30',
    size: '24.5 MB',
    status: 'Proses'
  },
  {
    id: 'ACT-002',
    fileName: 'export_fasilitas_kesehatan_jkt.shp',
    type: 'Export',
    dateTime: 'Kemarin, 09:15',
    size: '12.8 MB',
    status: 'Berhasil'
  },
  {
    id: 'ACT-003',
    fileName: 'data_sensor_cuaca_q1_2023.csv',
    type: 'Import',
    dateTime: '12 Okt 2023, 16:45',
    size: '156.2 MB',
    status: 'Berhasil'
  },
  {
    id: 'ACT-004',
    fileName: 'batas_admin_error.kml',
    type: 'Import',
    dateTime: '10 Okt 2023, 11:20',
    size: '3.1 MB',
    status: 'Gagal'
  }
];

export const mockNotifications: NotificationItem[] = [
  {
    id: 'NOT-001',
    title: 'Data Anomaly Detected',
    description: 'Unusual polygon area expansion detected in sector 7G. Requires manual verification.',
    type: 'anomaly',
    time: '10 mins ago',
    read: false
  },
  {
    id: 'NOT-002',
    title: 'System Update Complete',
    description: 'GeoIntel AI core engine updated to v2.4. Mapping rendering speed increased by 15%.',
    type: 'update',
    time: '2 hours ago',
    read: false
  },
  {
    id: 'NOT-003',
    title: 'Data Import Successful',
    description: 'Batch import of 5,000 asset coordinates completed without errors.',
    type: 'success',
    time: 'Yesterday, 14:30',
    read: true
  }
];

export const mockReports: ReportItem[] = [
  {
    id: 'REP-001',
    title: 'Laporan Bulanan Aset Regional Barat',
    date: '24 Oct 2023, 09:41',
    format: 'PDF',
    size: '2.4MB'
  },
  {
    id: 'REP-002',
    title: 'Analisis Vegetasi Koridor SUTET 500kV',
    date: '22 Oct 2023, 14:15',
    format: 'PDF',
    size: '5.1MB'
  },
  {
    id: 'REP-003',
    title: 'Incident Report: Flooding Sektor D',
    date: '18 Oct 2023, 08:30',
    format: 'DOCX',
    size: '1.2MB'
  },
  {
    id: 'REP-004',
    title: 'Survey Topografi Kuartal 3',
    date: '10 Oct 2023, 11:20',
    format: 'PDF',
    size: '8.4MB'
  }
];
