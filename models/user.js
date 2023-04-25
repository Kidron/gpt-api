// models/user.js
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY);

module.exports = {
  async findByEmail(email) {
    const { data, error } = await supabase
      .from('users_gpt')
      .select('*')
      .eq('email', email)
      .single();
    return { user: data, error };
  },

  async findById(id) {
    const { data, error } = await supabase
      .from('users_gpt')
      .select('*')
      .eq('id', id)
      .single();
    return { user: data, error };
  },

  async createUser(user) {
    const { data, error } = await supabase.from('users_gpt').insert(user);
    return { user: data, error };
  },
};
