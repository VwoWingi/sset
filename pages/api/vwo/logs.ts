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

import type { NextApiRequest, NextApiResponse } from 'next';
import { getLogs } from '../../../lib/vwo-server';
import type { VWOLog } from '../../../lib/vwo-server';

// Use Node.js runtime for better compatibility with VWO SDK
// export const config = {
//   runtime: 'nodejs',
// };

interface LogsResponse {
  success: boolean;
  logs?: VWOLog[];
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LogsResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  }

  try {
    const logs = getLogs();
    
    return res.status(200).json({
      success: true,
      logs
    });
  } catch (error: any) {
    console.error('VWO logs retrieval error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
} 