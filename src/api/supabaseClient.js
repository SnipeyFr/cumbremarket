import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ─── AUTH ────────────────────────────────────────────────────────────────────

export const auth = {
  async me() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    return { ...user, ...profile };
  },

  async isAuthenticated() {
    const { data: { session } } = await supabase.auth.getSession();
    return !!session;
  },

  async redirectToLogin(redirectTo = window.location.href) {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo }
    });
  },

  async logout(redirectTo) {
    await supabase.auth.signOut();
    if (redirectTo) window.location.href = redirectTo;
  }
};

// ─── PRODUCTS ────────────────────────────────────────────────────────────────

export const Product = {
  async filter(filters = {}, order = '-created_at', limit = 100) {
    let query = supabase.from('products').select(`*, profiles(id, full_name, email, avatar_url)`);

    if (filters.is_active !== undefined) query = query.eq('is_active', filters.is_active);
    if (filters.id) query = query.eq('id', filters.id);
    if (filters.seller_id) query = query.eq('seller_id', filters.seller_id);
    if (filters.category) query = query.eq('category', filters.category);

    // Ordering
    const descending = order.startsWith('-');
    const column = order.replace('-', '');
    const dbColumn = column === 'created_date' ? 'created_at' : column;
    query = query.order(dbColumn, { ascending: !descending });

    query = query.limit(limit);

    const { data, error } = await query;
    if (error) throw error;

    // Normalize to match old Base44 shape
    return (data || []).map(normalizeProduct);
  },

  async get(id) {
    const { data, error } = await supabase
      .from('products')
      .select(`*, profiles(id, full_name, email, avatar_url)`)
      .eq('id', id)
      .single();
    if (error) throw error;
    return normalizeProduct(data);
  },

  async create(productData) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase.from('products').insert({
      title: productData.title,
      description: productData.description,
      price: productData.price,
      category: productData.category,
      condition: productData.condition,
      images: productData.images || [],
      location: productData.location,
      is_active: productData.is_active ?? true,
      seller_id: user.id,
      brand: productData.brand,
      contact_method: productData.contact_method,
      contact_phone: productData.contact_phone,
      views: 0,
    }).select().single();

    if (error) throw error;
    return normalizeProduct(data);
  },

  async update(id, updates) {
    const dbUpdates = { ...updates };
    if (dbUpdates.created_date) delete dbUpdates.created_date;

    const { data, error } = await supabase
      .from('products')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return normalizeProduct(data);
  },

  async delete(id) {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;
    return true;
  }
};

// ─── PROFILES ────────────────────────────────────────────────────────────────

export const Profile = {
  async get(id) {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  },

  async update(id, updates) {
    const { data, error } = await supabase.from('profiles').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
  }
};

// ─── STORAGE (Image Upload) ───────────────────────────────────────────────────

export async function uploadImage(file) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const ext = file.name.split('.').pop();
  const filename = `${user.id}/${Date.now()}.${ext}`;

  const { error } = await supabase.storage
    .from('product-images')
    .upload(filename, file, { upsert: false });

  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage
    .from('product-images')
    .getPublicUrl(filename);

  return publicUrl;
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function normalizeProduct(p) {
  if (!p) return p;
  return {
    ...p,
    // Map created_at → created_date to keep old code working
    created_date: p.created_at,
    // Map seller profile info to created_by (email) for backwards compat
    created_by: p.profiles?.email || p.seller_id,
    seller: p.profiles,
  };
}
