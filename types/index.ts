/**
 * Copyright 2025 Wingify Software Pvt. Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// Re-export VWO types from lib
export type { VWOLog, VWOResponse, FlagVariable } from '../lib/vwo-server';

// SSR Page Props
export interface HomePageProps {
  initialUserId?: string;
  vwoData?: VWOData;
  error?: string;
}

export interface VWOData {
  content: string;
  modelName: string;
  backgroundColor: string;
  isEnabled: boolean;
  userId: string;
  settings?: any;
  logs: VWOLog[];
}

// Component Props
export interface SearchFormProps {
  initialUserId?: string;
  inputQuery: string;
  loading?: boolean;
  error?: string;
}

export interface ResponseDisplayProps {
  vwoData?: VWOData;
  settings?: any;
  logs?: VWOLog[];
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  header?: React.ReactNode;
  children: React.ReactNode;
}

// Form Data
export interface SearchFormData {
  userId: string;
  action: 'evaluate' | 'generate_id';
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

// Settings Display Types
export interface CampaignInfo {
  name: string;
  status: string;
  variationsCount: number;
  variations: VariationInfo[];
}

export interface VariationInfo {
  name: string;
  weight: number;
  variables: VariableInfo[];
}

export interface VariableInfo {
  key: string;
  value: any;
  isDefault: boolean;
}

// Import React for React.ReactNode
import React from 'react';
import type { VWOLog } from '../lib/vwo-server'; 