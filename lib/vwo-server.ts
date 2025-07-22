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

import { init, IVWOClient, LogLevelEnum } from 'vwo-fme-node-sdk';
import config, { validateConfig } from '../config/vwo-config';

interface VWOLog {
  level: string;
  message: string;
  timestamp: string;
}

interface FlagVariable {
  content?: string;
  background?: string;
}

interface VWOResponse {
  success: boolean;
  data?: {
    content: string;
    modelName: string;
    backgroundColor: string;
    isEnabled: boolean;
    userId: string;
    settings?: any;
    logs: VWOLog[];
  };
  error?: string;
}

// Global VWO client instance (singleton pattern for server)
let vwoClient: IVWOClient | null = null;
let initializationPromise: Promise<IVWOClient> | null = null;
const logs: VWOLog[] = [];

// Add log function
function addLog(level: string, message: string): void {
  const timestamp = new Date().toISOString();
  logs.push({ level, message, timestamp });
  console.log(`[VWO ${level.toUpperCase()}] ${timestamp} ${message}`);
}

/**
 * Initialize VWO SDK (singleton pattern)
 * Returns the same client instance for subsequent calls
 */
export async function initializeVWOClient(): Promise<IVWOClient> {
  if (vwoClient) {
    return vwoClient;
  }

  if (initializationPromise) {
    return initializationPromise;
  }

  initializationPromise = (async () => {
    try {
      // Validate configuration first
      const validation = validateConfig();
      if (!validation.isValid) {
        const errorMessage = `VWO Configuration errors: ${validation.errors.join(', ')}`;
        addLog('error', errorMessage);
        throw new Error(errorMessage);
      }

      addLog('info', 'Initializing VWO SDK on server...');
      
      const client = await init({
        accountId: config.vwo.accountId,
        sdkKey: config.vwo.sdkKey,
        shouldWaitForTrackingCalls: true,
        logger: {
          level: config.vwo.logLevel || LogLevelEnum.DEBUG,
          transport: {
            log: (level: string, message: string) => {
              addLog(level, message);
            }
          },
        },
      });

      vwoClient = client;
      addLog('info', 'VWO SDK initialized successfully on server');
      return client;
    } catch (error: any) {
      addLog('error', `Failed to initialize VWO SDK: ${error.message}`);
      throw new Error(`VWO SDK initialization failed: ${error.message}`);
    }
  })();

  return initializationPromise;
}

// Evaluate flag and get response for a user
export async function evaluateFlag(userId: string): Promise<VWOResponse> {
  try {
    // Clear previous logs at the start of each evaluation
    logs.length = 0;
    
    if (!userId || userId.trim() === '') {
      return {
        success: false,
        error: 'User ID is required'
      };
    }

    const trimmedUserId = userId.trim();
    addLog('info', `Evaluating flag for user: ${trimmedUserId}`);
    
    const client = await initializeVWOClient();
    
    const userContext = {
      id: trimmedUserId,
      customVariables: config.vwo.customVariables || {},
    };

    const flag = await client.getFlag(config.vwo.flagKey, userContext);
    const isEnabled = flag.isEnabled();
    const variables = flag.getVariables();
    const settings = client.originalSettings;

    addLog('info', `Flag evaluation result - Enabled: ${isEnabled} for user: ${trimmedUserId}`);

    // Default content
    const defaultContent =
      'To reset your password:\n1. Open the app and go to the login screen.\n2. Tap "Forgot Password?" below the password field.\n3. Enter your registered email address and submit.\n4. Check your inbox for a password reset email (it may take a few minutes).\n5. Click the link in the email and follow the instructions to create a new password.\n6. Return to the app and log in with your new password.';

    // Get variables from flag
    const modelName = flag.getVariable(config.vwo.variableKey1, 'GPT-4') as string;
    const contentVariable = flag.getVariable(config.vwo.variableKey2, {}) as FlagVariable;
    const content = contentVariable?.content || defaultContent;
    const backgroundColor = contentVariable?.background || '#fff';

    return {
      success: true,
      data: {
        content,
        modelName,
        backgroundColor,
        isEnabled,
        userId: trimmedUserId,
        settings,
        logs: [...logs] // Return copy of current evaluation logs only
      }
    };
  } catch (error: any) {
    addLog('error', `Flag evaluation failed: ${error.message}`);
    return {
      success: false,
      error: `Flag evaluation failed: ${error.message}`
    };
  }
}

// Track event for a user
export async function trackEvent(userId: string): Promise<{ success: boolean; error?: string }> {
  try {
    if (!userId || userId.trim() === '') {
      return {
        success: false,
        error: 'User ID is required for event tracking'
      };
    }

    addLog('info', `Tracking event for user: ${userId}`);
    
    const client = await initializeVWOClient();
    
    const userContext = {
      id: userId.trim(),
      customVariables: config.vwo.customVariables || {},
    };

    await client.trackEvent(config.vwo.eventName, userContext);
    addLog('info', `Event tracked successfully for user: ${userId}`);

    return { success: true };
  } catch (error: any) {
    addLog('error', `Event tracking failed: ${error.message}`);
    return {
      success: false,
      error: `Event tracking failed: ${error.message}`
    };
  }
}

// Get current logs
export function getLogs(): VWOLog[] {
  return [...logs];
}

// Clear logs (for testing or maintenance)
export function clearLogs(): void {
  logs.length = 0;
  addLog('info', 'Logs cleared');
}

// Export types
export type { VWOResponse, VWOLog, FlagVariable }; 