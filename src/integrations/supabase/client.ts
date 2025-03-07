
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://rifbmpunygikolcdicwt.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpZmJtcHVueWdpa29sY2RpY3d0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEzMjgzNTUsImV4cCI6MjA1NjkwNDM1NX0.A5tNJNrT0P6OecJ553Ix4IhzbdUp0qn0HgW8HNsOWnU";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
