require('dotenv').config();
if (!global.WebSocket) {
  try {
    global.WebSocket = require('ws');
  } catch (e) {}
}

const { createClient } = require('@supabase/supabase-js');
const postgres = require('postgres');

async function testConnections() {
  console.log('--------------------------------------------------');
  console.log('1️⃣  Testing Supabase REST Client Connection...');
  console.log('--------------------------------------------------');
  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing from .env');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Ping Supabase PostgREST endpoint
    const { error } = await supabase.from('_test_ping_').select('*').limit(1);

    // PostgREST error codes PGRST205 or PGRST301 confirm credentials and host are valid
    if (error && error.code !== 'PGRST205' && error.code !== 'PGRST301' && error.code !== '42P01') {
      console.log('⚠️  Supabase API error:', error.message, `(Code: ${error.code})`);
    } else {
      console.log('✅ SUCCESS: Supabase REST API connected successfully!');
      console.log(`   URL: ${supabaseUrl}`);
    }
  } catch (err) {
    console.error('❌ Supabase REST Client Failed:', err.message);
  }



//don't need to connect to postgres directly
  // console.log('\n--------------------------------------------------');
  // console.log('2️⃣  Testing Postgres Direct Database Connection...');
  // console.log('--------------------------------------------------');
  // try {
  //   const dbUrl = process.env.DATABASE_URL;
  //   if (!dbUrl) {
  //     throw new Error('DATABASE_URL missing from .env');
  //   }

  //   const sql = postgres(dbUrl, { connect_timeout: 5 });
  //   const result = await sql`SELECT NOW() as current_time, current_database();`;
  //   console.log('✅ SUCCESS: Postgres Direct Database connected successfully!');
  //   console.log('   Database Name:', result[0].current_database);
  //   console.log('   Server Time:', result[0].current_time);
  //   await sql.end();
  // } catch (err) {
  //   console.error('❌ Postgres Direct DB Connection Failed:', err.message);
  //   if (err.message.includes('password authentication failed')) {
  //     console.log('   💡 Tip: Verify your database password in DATABASE_URL inside .env.');
  //   } else if (err.message.includes('ECONNREFUSED') || err.message.includes('ETIMEDOUT')) {
  //     console.log('   💡 Tip: Direct connections to db.[ref].supabase.co require IPv6 or connection pooler.');
  //     console.log('      Try using Supabase Connection Pooler URL from your Supabase Dashboard:');
  //     console.log('      Settings -> Database -> Connection String -> Pooler (Port 6543 or 5432)');
  //   }
  // }
}

testConnections();
