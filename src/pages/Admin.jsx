import React, { useState, useEffect } from 'react';
import { supabase } from '@/api/supabaseClient';
import { useAuth } from '@/lib/AuthContext';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Package, Eye, EyeOff, Trash2, Search, Loader2, ShieldAlert, ArrowLeft, RefreshCw, Mountain } from 'lucide-react';

const ADMIN_EMAILS = ['abzta123@gmail.com'];

const formatPrice = (price) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 }).format(price);

export default function Admin() {
  const { user, isLoadingAuth } = useAuth();
  const [tab, setTab] = useState('stats');
  const [stats, setStats] = useState({ users: 0, products: 0, active: 0, inactive: 0 });
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const isAdmin = user && ADMIN_EMAILS.includes(user.email);

  useEffect(() => { if (!isLoadingAuth && isAdmin) loadAll(); }, [isLoadingAuth, isAdmin]);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [{ data: profiles }, { data: prods }] = await Promise.all([
        supabase.from('profiles').select('*').order('created_at', { ascending: false }),
        supabase.from('products').select('*, profiles(full_name, email)').order('created_at', { ascending: false })
      ]);
      setUsers(profiles || []);
      setProducts(prods || []);
      setStats({ users: profiles?.length || 0, products: prods?.length || 0, active: prods?.filter(p => p.is_active).length || 0, inactive: prods?.filter(p => !p.is_active).length || 0 });
    } finally { setLoading(false); }
  };

  const toggleProduct = async (id, current) => {
    await supabase.from('products').update({ is_active: !current }).eq('id', id);
    setProducts(prev => prev.map(p => p.id === id ? { ...p, is_active: !current } : p));
  };

  const deleteProduct = async (id) => {
    if (!confirm('¿Eliminar esta publicación?')) return;
    await supabase.from('products').delete().eq('id', id);
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const deleteUser = async (id) => {
    if (!confirm('¿Eliminar este usuario y todas sus publicaciones?')) return;
    await supabase.from('products').delete().eq('seller_id', id);
    await supabase.from('profiles').delete().eq('id', id);
    loadAll();
  };

  if (isLoadingAuth) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-emerald-600" /></div>;
  if (!isAdmin) return (
    <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-4 gap-4">
      <ShieldAlert className="w-16 h-16 text-stone-300" />
      <h2 className="text-xl font-semibold text-stone-700">Acceso restringido</h2>
      <Link to={createPageUrl('Home')}><Button variant="outline">Volver al inicio</Button></Link>
    </div>
  );

  const filteredProducts = products.filter(p => p.title?.toLowerCase().includes(search.toLowerCase()) || p.profiles?.email?.toLowerCase().includes(search.toLowerCase()));
  const filteredUsers = users.filter(u => u.full_name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="bg-white border-b border-stone-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to={createPageUrl('Home')}><Button variant="ghost" size="sm" className="gap-2"><ArrowLeft className="w-4 h-4" /> Volver</Button></Link>
            <div className="flex items-center gap-2"><Mountain className="w-5 h-5 text-emerald-700" /><h1 className="font-bold text-stone-800">Admin Dashboard</h1></div>
          </div>
          <Button onClick={loadAll} variant="outline" size="sm" className="gap-2"><RefreshCw className="w-4 h-4" /> Actualizar</Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Usuarios', value: stats.users, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Publicaciones', value: stats.products, icon: Package, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Activas', value: stats.active, icon: Eye, color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'Inactivas', value: stats.inactive, icon: EyeOff, color: 'text-stone-500', bg: 'bg-stone-100' },
          ].map((s, i) => (
            <Card key={i} className="border-stone-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div><p className="text-sm text-stone-500">{s.label}</p><p className="text-3xl font-bold text-stone-800 mt-1">{s.value}</p></div>
                  <div className={`w-12 h-12 ${s.bg} rounded-xl flex items-center justify-center`}><s.icon className={`w-6 h-6 ${s.color}`} /></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex gap-2 mb-6">
          {['stats', 'products', 'users'].map(t => (
            <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${tab === t ? 'bg-emerald-700 text-white' : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'}`}>
              {t === 'stats' ? 'Resumen' : t === 'products' ? 'Publicaciones' : 'Usuarios'}
            </button>
          ))}
        </div>

        {tab !== 'stats' && (
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <Input placeholder="Buscar..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 h-11 bg-white" />
          </div>
        )}

        {loading ? <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-emerald-600" /></div> : (
          <>
            {tab === 'stats' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-stone-200"><CardHeader><CardTitle className="text-base">Últimas publicaciones</CardTitle></CardHeader>
                  <CardContent><div className="space-y-3">{products.slice(0, 5).map(p => (<div key={p.id} className="flex items-center justify-between text-sm"><span className="text-stone-700 truncate max-w-[200px]">{p.title}</span><span className="text-emerald-700 font-medium">{formatPrice(p.price)}</span></div>))}</div></CardContent>
                </Card>
                <Card className="border-stone-200"><CardHeader><CardTitle className="text-base">Últimos usuarios</CardTitle></CardHeader>
                  <CardContent><div className="space-y-3">{users.slice(0, 5).map(u => (<div key={u.id} className="flex items-center justify-between text-sm"><span className="text-stone-700 truncate max-w-[200px]">{u.full_name || 'Sin nombre'}</span><span className="text-stone-400 truncate max-w-[150px]">{u.email}</span></div>))}</div></CardContent>
                </Card>
              </div>
            )}

            {tab === 'products' && (
              <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-stone-50 border-b border-stone-200">
                    <tr>
                      <th className="text-left px-4 py-3 text-stone-600 font-medium">Producto</th>
                      <th className="text-left px-4 py-3 text-stone-600 font-medium hidden md:table-cell">Vendedor</th>
                      <th className="text-left px-4 py-3 text-stone-600 font-medium">Precio</th>
                      <th className="text-left px-4 py-3 text-stone-600 font-medium">Estado</th>
                      <th className="text-left px-4 py-3 text-stone-600 font-medium">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {filteredProducts.map(p => (
                      <tr key={p.id} className="hover:bg-stone-50">
                        <td className="px-4 py-3"><div className="flex items-center gap-3">{p.images?.[0] && <img src={p.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover" />}<span className="font-medium text-stone-800 truncate max-w-[150px]">{p.title}</span></div></td>
                        <td className="px-4 py-3 text-stone-500 hidden md:table-cell">{p.profiles?.email || '—'}</td>
                        <td className="px-4 py-3 text-emerald-700 font-medium">{formatPrice(p.price)}</td>
                        <td className="px-4 py-3"><Badge className={p.is_active ? 'bg-emerald-100 text-emerald-700 border-0' : 'bg-stone-100 text-stone-500 border-0'}>{p.is_active ? 'Activa' : 'Inactiva'}</Badge></td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button onClick={() => toggleProduct(p.id, p.is_active)} className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-500">{p.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
                            <button onClick={() => deleteProduct(p.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-stone-500 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredProducts.length === 0 && <div className="text-center py-12 text-stone-400">No hay publicaciones</div>}
              </div>
            )}

            {tab === 'users' && (
              <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-stone-50 border-b border-stone-200">
                    <tr>
                      <th className="text-left px-4 py-3 text-stone-600 font-medium">Usuario</th>
                      <th className="text-left px-4 py-3 text-stone-600 font-medium hidden md:table-cell">Email</th>
                      <th className="text-left px-4 py-3 text-stone-600 font-medium hidden md:table-cell">Ubicación</th>
                      <th className="text-left px-4 py-3 text-stone-600 font-medium">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {filteredUsers.map(u => (
                      <tr key={u.id} className="hover:bg-stone-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            {u.avatar_url ? <img src={u.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover" /> : <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-medium text-xs">{(u.full_name || u.email || '?')[0].toUpperCase()}</div>}
                            <span className="font-medium text-stone-800">{u.full_name || 'Sin nombre'}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-stone-500 hidden md:table-cell">{u.email}</td>
                        <td className="px-4 py-3 text-stone-500 hidden md:table-cell">{u.location || '—'}</td>
                        <td className="px-4 py-3"><button onClick={() => deleteUser(u.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-stone-500 hover:text-red-600"><Trash2 className="w-4 h-4" /></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredUsers.length === 0 && <div className="text-center py-12 text-stone-400">No hay usuarios</div>}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
