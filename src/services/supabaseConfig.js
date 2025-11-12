import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://ufewunvddtcatmrwgtps.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVmZXd1bnZkZHRjYXRtcndndHBzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NzM5MzUsImV4cCI6MjA3ODU0OTkzNX0.49UKRdn6DLIkPNJOUtU8hEuZ7774qofLgtLtZbcN8Z0";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);