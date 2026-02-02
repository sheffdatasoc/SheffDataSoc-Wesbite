const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkPartners() {
    const { data, error } = await supabase
        .from('partners')
        .select('id, name, logo, active')
        .eq('active', true);

    if (error) {
        console.error('Error:', error);
        return;
    }

    console.log('--- Partners Data ---');
    data.forEach(p => {
        console.log(`${p.name} (ID: ${p.id}): ${p.logo}`);
    });
    console.log('---------------------');
}

checkPartners();
