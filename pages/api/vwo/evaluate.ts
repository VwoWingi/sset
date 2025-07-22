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
import { evaluateFlag, trackEvent } from '../../../lib/vwo-server';
import type { VWOResponse } from '../../../lib/vwo-server';

// Use Node.js runtime for better compatibility with VWO SDK
export const config = {
  runtime: 'nodejs',
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<VWOResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  }

  try {
    console.log('[VWO API] Evaluate endpoint called');
    const { userId } = req.body;

    if (!userId || typeof userId !== 'string' || userId.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'User ID is required and must be a non-empty string'
      });
    }

    console.log(`[VWO API] Evaluating flag for user: ${userId}`);
    // Evaluate flag for the user
    const flagResult = await evaluateFlag(userId);
    
    if (!flagResult.success) {
      return res.status(500).json(flagResult);
    }

    // Track event for the user
    const trackResult = await trackEvent(userId);
    
    if (!trackResult.success) {
      console.warn(`Event tracking failed for user ${userId}: ${trackResult.error}`);
      // Don't fail the request if tracking fails, just log it
    }

    return res.status(200).json(flagResult);
  } catch (error: any) {
    console.error('VWO evaluation error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
} 