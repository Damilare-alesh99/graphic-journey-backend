require('dotenv').config();
if (!global.WebSocket) {
  try {
    global.WebSocket = require('ws');
  } catch (e) {
   console.log(e)
  }
}

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing from environment variables.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;