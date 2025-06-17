// import 'react-native-url-polyfill/auto';
// import { createClient } from '@supabase/supabase-js';

// const supabaseUrl = 'https://hkvwmllfwprziimjnzli.supabase.co';
// const supabaseAnonKey =
// 	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhrdndtbGxmd3ByemlpbWpuemxpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwMzI2MzIsImV4cCI6MjA2NDYwODYzMn0.9R-YBFm-5qXPUZVwoS4FWEmM3ogYgVSPMYGQqPXiOqk';

// export const supabase = createClient(supabaseUrl, supabaseAnonKey);

import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
