/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'Super Admin' | 'Admin Wilayah' | 'Surveyor' | 'Viewer' | 'Admin' | 'Validator AI';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  regions?: string[];
  region?: string;
  status: boolean | string;
  lastActive?: string;
  avatar?: string;
  avatarUrl?: string;
}

export interface SurveyLog {
  id: string;
  type: string;
  region: string;
  confidenceScore: number;
  aiStatus: 'Valid' | 'Perlu Review' | 'Invalid';
  icon: string;
}

export interface GeospatialAsset {
  id: string;
  name: string;
  category: string;
  address: string;
  coordinates: [number, number];
  areaSize: number;
  status: 'Terverifikasi' | 'Pending' | 'Ditolak';
  timestamp: string;
  imageUrl: string;
  surveyor?: string;
}

export interface PolygonRecord {
  id: string;
  name: string;
  category: string;
  areaSize: number;
  status: 'Draft' | 'Terverifikasi' | 'Review';
  updatedAt: string;
  notes?: string;
  coordinates?: [number, number][];
}

export interface ActivityHistory {
  id: string;
  fileName: string;
  type: 'Import' | 'Export';
  dateTime: string;
  size: string;
  status: 'Proses' | 'Berhasil' | 'Gagal';
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  type: 'anomaly' | 'update' | 'success';
  time: string;
  read: boolean;
}

export interface ReportItem {
  id: string;
  title: string;
  date?: string;
  dateCreated?: string;
  format?: 'PDF' | 'DOCX' | 'CSV' | 'Word' | string;
  formats?: string[];
  size?: string;
  desc?: string;
}
