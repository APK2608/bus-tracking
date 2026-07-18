const path = require("path");

require("dotenv").config({ path: path.resolve(__dirname, "../src/.env") });
require("dotenv").config();

const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: false,
        autoRefreshToken: false,
    },
});

const adminSupabase = supabaseServiceRoleKey
    ? createClient(supabaseUrl, supabaseServiceRoleKey, {
          auth: {
              persistSession: false,
              autoRefreshToken: false,
          },
      })
    : null;

module.exports = {
    supabase,
    adminSupabase,
};