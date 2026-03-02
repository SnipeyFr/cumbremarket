import React, { useState } from 'react';
import { supabase } from '@/api/supabaseClient';
import { useNavigate, Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Mountain, Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('login'); // 'login' | 'register' | 'forgot'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      navigate(createPageUrl('Home'));
    } catch (err) {
      setError(err.message === 'Invalid login credentials' 
        ? 'Email o contraseña incorrectos' 
        : err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } }
      });
      if (error) throw error;
      setSuccess('¡Cuenta creada! Revisa tu email para confirmar tu cuenta.');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/Login`
      });
      if (error) throw error;
      setSuccess('Te enviamos un correo para restablecer tu contraseña.');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/Home` }
      });
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to={createPageUrl('Home')} className="inline-flex items-center gap-2">
            <Mountain className="w-8 h-8 text-emerald-700" />
            <span className="text-2xl font-bold text-stone-800">CumbreMarket</span>
          </Link>
          <p className="text-stone-500 mt-2 text-sm">El marketplace outdoor de Chile</p>
        </div>

        <Card className="shadow-sm border-stone-200">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">
              {mode === 'login' && 'Iniciar sesión'}
              {mode === 'register' && 'Crear cuenta'}
              {mode === 'forgot' && 'Recuperar contraseña'}
            </CardTitle>
            <CardDescription>
              {mode === 'login' && 'Bienvenido de vuelta a la comunidad outdoor'}
              {mode === 'register' && 'Únete a la comunidad outdoor de Chile'}
              {mode === 'forgot' && 'Te enviaremos un correo para restablecer tu contraseña'}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Google Login */}
            {mode !== 'forgot' && (
              <>
                <Button
                  onClick={handleGoogleLogin}
                  variant="outline"
                  className="w-full h-12 border-stone-300 gap-3"
                  disabled={loading}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continuar con Google
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-stone-200" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-stone-400">o con email</span>
                  </div>
                </div>
              </>
            )}

            {/* Error / Success */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm px-4 py-3 rounded-lg">
                {success}
              </div>
            )}

            {/* Form */}
            <form onSubmit={mode === 'login' ? handleEmailLogin : mode === 'register' ? handleRegister : handleForgotPassword} className="space-y-4">
              {mode === 'register' && (
                <div className="space-y-1.5">
                  <Label htmlFor="fullName">Nombre completo</Label>
                  <Input
                    id="fullName"
                    placeholder="Tu nombre"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    required
                    className="h-11"
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="email">Correo electrónico</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="h-11 pl-10"
                  />
                </div>
              </div>

              {mode !== 'forgot' && (
                <div className="space-y-1.5">
                  <Label htmlFor="password">Contraseña</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                      minLength={6}
                      className="h-11 pl-10 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {mode === 'login' && (
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => { setMode('forgot'); setError(''); setSuccess(''); }}
                    className="text-sm text-emerald-700 hover:underline"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-emerald-700 hover:bg-emerald-800 text-base"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                  mode === 'login' ? 'Iniciar sesión' :
                  mode === 'register' ? 'Crear cuenta' :
                  'Enviar correo'
                )}
              </Button>
            </form>

            {/* Toggle mode */}
            <div className="text-center text-sm text-stone-500 pt-2">
              {mode === 'login' && (
                <>
                  ¿No tienes cuenta?{' '}
                  <button onClick={() => { setMode('register'); setError(''); setSuccess(''); }} className="text-emerald-700 font-medium hover:underline">
                    Regístrate
                  </button>
                </>
              )}
              {mode === 'register' && (
                <>
                  ¿Ya tienes cuenta?{' '}
                  <button onClick={() => { setMode('login'); setError(''); setSuccess(''); }} className="text-emerald-700 font-medium hover:underline">
                    Inicia sesión
                  </button>
                </>
              )}
              {mode === 'forgot' && (
                <button onClick={() => { setMode('login'); setError(''); setSuccess(''); }} className="text-emerald-700 font-medium hover:underline">
                  Volver al inicio de sesión
                </button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
