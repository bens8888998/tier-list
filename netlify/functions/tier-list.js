const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

exports.handler = async (event) => {
  if (event.httpMethod === 'POST') {
    try {
      const items = JSON.parse(event.body);

      // delete existing
      await supabase.from('tier_list').delete().neq('id', 0);

      // insert new list with position
      const insertData = items.map((item, index) => ({
        position: index + 1,
        name: item.name,
        ben: item.ben,
        finn: item.finn
      }));

      await supabase.from('tier_list').insert(insertData);

      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Saved' })
      };
    } catch (err) {
      return { statusCode: 500, body: 'Failed to save: ' + err.message };
    }
  }

  if (event.httpMethod === 'GET') {
    try {
      const { data, error } = await supabase
        .from('tier_list')
        .select('*')
        .order('position', { ascending: true });

      if (error) {
        return { statusCode: 500, body: 'Read error: ' + error.message };
      }

      return {
        statusCode: 200,
        body: JSON.stringify(data)
      };
    } catch (err) {
      return { statusCode: 500, body: 'Failed to load: ' + err.message };
    }
  }

  return {
    statusCode: 405,
    body: 'Method Not Allowed'
  };
};
