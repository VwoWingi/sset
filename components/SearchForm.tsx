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

import React, { useState, useRef, useEffect } from 'react';
import styles from '../styles/Home.module.css';

interface SearchFormProps {
  initialUserId?: string;
  inputQuery: string;
  loading?: boolean;
  error?: string;
  onSubmit: (userId: string, action: 'evaluate') => void;
}

const SearchForm: React.FC<SearchFormProps> = ({
  initialUserId = '',
  inputQuery,
  loading = false,
  error,
  onSubmit,
}) => {
  const [userId, setUserId] = useState(initialUserId);
  const inputRef = useRef<HTMLInputElement>(null);

  // Only sync with initial value on first load or when no local changes exist
  useEffect(() => {
    if (initialUserId && !userId) {
      setUserId(initialUserId);
    }
  }, [initialUserId]);

  const handleUserIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserId(e.target.value);
  };

  const handleSendClick = () => {
    // Get the value directly from the input element - this is bulletproof
    const currentValue = inputRef.current?.value?.trim() || '';
    
    if (currentValue) {
      onSubmit(currentValue, 'evaluate');
    } else {
      alert('Please enter a User ID');
    }
  };

  const handleRandomIdClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const randomId = 'user_' + Math.random().toString(36).substring(2, 8);
    
    // Set in both state AND directly in the input element
    setUserId(randomId);
    if (inputRef.current) {
      inputRef.current.value = randomId;
    }
  };

  const isFormValid = userId.trim() !== '';

  return (
    <>
      <h3 className={styles.subtitle}>Enter User ID</h3>
      <div className={styles.inputContainer}>
        <input
          ref={inputRef}
          type="text"
          id="userIdField"
          className={styles.input}
          placeholder="Enter User ID(eg: hello@vwo.com) to see the response"
          value={userId}
          onChange={handleUserIdChange}
          disabled={loading}
        />
        <a 
          href="#" 
          onClick={handleRandomIdClick} 
          className={styles.assignLink}
          style={{ 
            pointerEvents: loading ? 'none' : 'auto',
            opacity: loading ? 0.6 : 1 
          }}
        >
          Assign Random ID
        </a>
      </div>
      
      <h3 className={styles.subtitle}>Search a Query</h3>
      <div className={styles.inputContainer}>
        <input
          type="text"
          id="inputField"
          className={styles.input}
          placeholder="Enter your query"
          disabled
          value={inputQuery}
          readOnly
        />
        <button
          id="sendButton"
          className={styles.button}
          onClick={handleSendClick}
          disabled={!isFormValid || loading}
        >
          {loading ? 'Processing...' : 'Send'}
        </button>
      </div>
      
      {error && (
        <div style={{ 
          color: 'red', 
          fontSize: '14px', 
          marginTop: '10px',
          padding: '8px',
          backgroundColor: '#ffe6e6',
          border: '1px solid #ffcccc',
          borderRadius: '4px'
        }}>
          {error}
        </div>
      )}
    </>
  );
};

export default SearchForm; 