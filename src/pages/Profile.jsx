import React, { useState, useEffect } from 'react';
import { useMutation } from "@tanstack/react-query";
import { Profile as ProfileAPI, auth, uploadImage } from "@/api/supabaseClient";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Loader2, CheckCircle, User, Mail, Phone, MapPin, Mountain } from "lucide-react";
import { setSEO } from "@/components/seo";

const ACTIVITIES = [
  "Trekking",
  "Montañismo",
  "Escalada",
  "Trail Running",
  "Camping",
  "Ski/Snowboard",
  "MTB",
  "Kayak"
];

export default function Profile() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    display_name: "",
    phone: "",
    location: "",
    bio: "",
    favorite_activities: []
  });

  useEffect(() => {
    const loadUser = async () => {
      const isAuth = await auth.isAuthenticated();
      if (isAuth) {
        const userData = await auth.me();
        setUser(userData);
        setFormData({
          display_name: userData.display_name || "",
          phone: userData.phone || "",
          location: userData.location || "",
          bio: userData.bio || "",
          favorite_activities: userData.favorite_activities || []
        });
      }
      setIsLoading(false);
    };
    loadUser();
  }, []);

  React.useEffect(() => {
    setSEO({
      title: "Mi perfil | Comunidad outdoor de Chile | Cumbre Market",
      description: "Actualiza tu perfil y conecta con la comunidad de montañismo en Chile. Comparte actividades como trekking, escalada y andinismo.",
      canonicalPath: "/Profile"
    });
  }, []);

  const updateMutation = useMutation({
    mutationFn: async (data) => {
      await ProfileAPI.update(userData.id, data);
      const updatedUser = await auth.me();
      return updatedUser;
    },
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
      setFormData({
        display_name: updatedUser.display_name || "",
        phone: updatedUser.phone || "",
        location: updatedUser.location || "",
        bio: updatedUser.bio || "",
        favorite_activities: updatedUser.favorite_activities || []
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleActivity = (activity) => {
    setFormData(prev => ({
      ...prev,
      favorite_activities: prev.favorite_activities.includes(activity)
        ? prev.favorite_activities.filter(a => a !== activity)
        : [...prev.favorite_activities, activity]
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <h2 className="text-2xl font-bold text-stone-800 mb-4">
              Inicia sesión
            </h2>
            <p className="text-stone-500 mb-6">
              Necesitas una cuenta para ver tu perfil
            </p>
            <Button 
              onClick={() => window.location.href = '/Login'}
              className="w-full bg-emerald-700 hover:bg-emerald-800"
            >
              Iniciar sesión
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="bg-white border-b border-stone-200 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4">
          <Link to={createPageUrl("Home")}>
            <Button variant="ghost" className="gap-2 text-stone-600 hover:text-stone-800">
              <ArrowLeft className="w-4 h-4" />
              Volver
            </Button>
          </Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Header con avatar */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
              <User className="w-10 h-10 text-emerald-700" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-stone-800">
                {user.display_name || user.full_name || 'Mi Perfil'}
              </h1>
              <p className="text-stone-500">{user.email}</p>
              {user.role === 'admin' && (
                <Badge className="mt-1 bg-emerald-100 text-emerald-800 border-0">
                  Administrador
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Mensaje de éxito */}
        {success && (
          <Card className="mb-6 border-emerald-200 bg-emerald-50">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3 text-emerald-800">
                <CheckCircle className="w-5 h-5" />
                <p className="font-medium">Perfil actualizado correctamente</p>
              </div>
            </CardContent>
          </Card>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información Personal */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Información Personal
              </CardTitle>
              <CardDescription>
                Actualiza tu información de contacto y perfil
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="display_name">Nombre completo</Label>
                <Input
                  id="display_name"
                  placeholder="Juan Pérez"
                  value={formData.display_name}
                  onChange={(e) => handleChange('display_name', e.target.value)}
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <Input
                    id="email"
                    value={user.email}
                    disabled
                    className="h-12 pl-11 bg-stone-100 text-stone-500 cursor-not-allowed"
                  />
                </div>
                <p className="text-xs text-stone-500">
                  El correo electrónico no se puede modificar
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">WhatsApp / Teléfono</Label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <Input
                    id="phone"
                    placeholder="+56 9 1234 5678"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className="h-12 pl-11"
                  />
                </div>
                <p className="text-xs text-stone-500">
                  Será visible cuando publiques equipos
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Ubicación</Label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <Input
                    id="location"
                    placeholder="Santiago, Providencia"
                    value={formData.location}
                    onChange={(e) => handleChange('location', e.target.value)}
                    className="h-12 pl-11"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sobre ti */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mountain className="w-5 h-5" />
                Sobre ti
              </CardTitle>
              <CardDescription>
                Cuéntale a la comunidad sobre tu experiencia outdoor
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="bio">Biografía</Label>
                <Textarea
                  id="bio"
                  placeholder="Cuéntanos sobre tu experiencia en la montaña, tus aventuras favoritas..."
                  value={formData.bio}
                  onChange={(e) => handleChange('bio', e.target.value)}
                  className="min-h-[120px] resize-none"
                />
              </div>

              <div className="space-y-3">
                <Label>Actividades favoritas</Label>
                <div className="flex flex-wrap gap-2">
                  {ACTIVITIES.map((activity) => {
                    const isSelected = formData.favorite_activities.includes(activity);
                    return (
                      <button
                        key={activity}
                        type="button"
                        onClick={() => toggleActivity(activity)}
                        className={`
                          px-4 py-2 rounded-full text-sm font-medium transition-all
                          ${isSelected 
                            ? 'bg-emerald-700 text-white shadow-md' 
                            : 'bg-white border border-stone-200 text-stone-600 hover:border-emerald-300'
                          }
                        `}
                      >
                        {activity}
                      </button>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Botones */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              type="submit" 
              disabled={updateMutation.isPending}
              className="flex-1 h-12 bg-emerald-700 hover:bg-emerald-800"
            >
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Guardando...
                </>
              ) : (
                'Guardar cambios'
              )}
            </Button>
            <Link to={createPageUrl("Home")} className="flex-1">
              <Button 
                type="button" 
                variant="outline" 
                className="w-full h-12"
              >
                Cancelar
              </Button>
            </Link>
          </div>
        </form>

        {/* Estadísticas */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg">Actividad en Cumbre Market</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-4 bg-stone-50 rounded-xl">
                <p className="text-2xl font-bold text-emerald-700">
                  {user.role === 'admin' ? '∞' : '0'}
                </p>
                <p className="text-sm text-stone-500 mt-1">Publicaciones</p>
              </div>
              <div className="p-4 bg-stone-50 rounded-xl">
                <p className="text-2xl font-bold text-emerald-700">
                  Miembro
                </p>
                <p className="text-sm text-stone-500 mt-1">
                  Desde {new Date(user.created_date).getFullYear()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Zona peligrosa */}
        <Card className="mt-8 border-red-200">
          <CardHeader>
            <CardTitle className="text-lg text-red-700">Zona de peligro</CardTitle>
            <CardDescription>
              Acciones irreversibles con tu cuenta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="outline" 
              onClick={() => auth.logout()}
              className="w-full sm:w-auto text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
            >
              Cerrar sesión
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}