import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const SupabaseTest = () => {
  const [message, setMessage] = useState('Connecting...');

  useEffect(() => {
    const testConnection = async () => {
      try {
        const { data, error } = await supabase.from('Lease').select('*').limit(1);
        if (error) {
          setMessage(`❌ Supabase error: ${error.message}`);
        } else {
          setMessage(`✅ Supabase connected. ${data.length} record(s) fetched.`);
        }
      } catch (err) {
        setMessage(`❌ Exception: ${err.message}`);
      }
    };

    testConnection();
  }, []);

  return <div style={{ padding: '1rem', background: '#f0f0f0' }}>{message}</div>;
};

export default SupabaseTest;
