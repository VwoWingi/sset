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

import { LogLevelEnum } from 'vwo-fme-node-sdk';

// Helper function to safely parse JSON with fallback
function safeJsonParse<T>(value: string | undefined, defaultValue: T): T {
  if (!value || value.trim() === '') {
    return defaultValue;
  }
  
  try {
    return JSON.parse(value);
  } catch (error) {
    console.warn(`Failed to parse JSON from environment variable: ${value}. Using default value.`);
    return defaultValue;
  }
}

interface VWOConfig {
  accountId: string;
  sdkKey: string;
  flagKey: string;
  eventName: string;
  customVariables?: Record<string, unknown>;
  attributes: Record<string, string | number | boolean>;
  logLevel: string;
  variableKey1: string;
  variableKey2: string;
}

interface Config {
  vwo: VWOConfig;
}

// Server-side configuration - no NEXT_PUBLIC_ prefix needed
const config: Config = {
  vwo: {
    accountId: String(Number(process.env.VWO_ACCOUNT_ID) || 0),
    sdkKey: process.env.VWO_SDK_KEY || '',
    flagKey: process.env.VWO_FLAG_KEY || '',
    eventName: process.env.VWO_EVENT_NAME || '',
    attributes: safeJsonParse(process.env.VWO_USER_ATTRIBUTES, {}),
    customVariables: safeJsonParse(process.env.VWO_CUSTOM_VARIABLES, {}),
    logLevel: process.env.VWO_LOG_LEVEL || LogLevelEnum.DEBUG,
    variableKey1: process.env.VWO_VARIABLE_KEY_1 || 'model_name',
    variableKey2: process.env.VWO_VARIABLE_KEY_2 || 'query_answer',
  },
};

// Server-side validation function
export function validateConfig(): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  const requiredFields: (keyof VWOConfig)[] = ['accountId', 'sdkKey', 'flagKey'];
  
  for (const field of requiredFields) {
    if (!config.vwo[field]) {
      errors.push(`Missing required configuration: VWO_${field.toUpperCase()}`);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

export default config;
export type { Config, VWOConfig };
