import React, { useState, useEffect } from 'react';
import { useMutation } from "@tanstack/react-query";
import { Product, auth, uploadImage } from "@/api/supabaseClient";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Loader2, CheckCircle } from "lucide-react";
import { setSEO } from "@/components/seo";
import ImageUploader from "@/components/ImageUploader";

const categories = [
  { value: "mochilas", label: "Mochilas" },
  { value: "carpas", label: "Carpas" },
  { value: "sacos_dormir", label: "Sacos de dormir" },
  { value: "calzado", label: "Calzado" },
  { value: "ropa", label: "Ropa" },
  { value: "escalada", label: "Escalada" },
  { value: "camping", label: "Camping" },
  { value: "accesorios", label: "Accesorios" },
  { value: "otros", label: "Otros" },
];

const conditions = [
  { value: "nuevo", label: "Nuevo - Sin usar, con etiquetas" },
  { value: "como_nuevo", label: "Como nuevo - Usado muy poco" },
  { value: "buen_estado", label: "Buen estado - Uso normal, funciona perfecto" },
  { value: "usado", label: "Usado - Con desgaste pero funcional" },
];

const contactMethods = [
  { value: "whatsapp", label: "Solo WhatsApp" },
  { value: "email", label: "Solo correo electrónico" },
  { value: "ambos", label: "WhatsApp y correo" },
];

export default function CreateProduct() {
  const [user, setUser] = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    condition: "",
    brand: "",
    images: [],
    location: "",
    contact_method: "whatsapp",
    contact_phone: "",
  });

  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await auth.isAuthenticated();
      if (isAuth) {
        const userData = await auth.me();
        setUser(userData);
      }
      setIsCheckingAuth(false);
    };
    checkAuth();
  }, []);

  React.useEffect(() => {
    setSEO({
      title: "Publicar equipo de montaña usado en Chile | Cumbre Market",
      description: "Vende tu equipo outdoor usado en Chile: mochilas, carpas, escalada, trekking y más. Publica gratis en Cumbre Market.",
      canonicalPath: "/CreateProduct"
    });
  }, []);

  const createMutation = useMutation({
    mutationFn: (data) => Product.create(data),
    onSuccess: () => {
      setSuccess(true);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate({
      ...formData,
      price: parseFloat(formData.price),
      is_active: true,
      views: 0,
    });
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (isCheckingAuth) {
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
              Inicia sesión para publicar
            </h2>
            <p className="text-stone-500 mb-6">
              Necesitas una cuenta para publicar equipos en Cumbre Market
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

  if (success) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-8 pb-8 text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-emerald-100 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-stone-800 mb-2">
              ¡Publicación creada!
            </h2>
            <p className="text-stone-500 mb-6">
              Tu equipo ya está visible en el marketplace
            </p>
            <div className="flex flex-col gap-3">
              <Link to={createPageUrl("MyProducts")}>
                <Button className="w-full bg-emerald-700 hover:bg-emerald-800">
                  Ver mis publicaciones
                </Button>
              </Link>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSuccess(false);
                  setFormData({
                    title: "",
                    description: "",
                    price: "",
                    category: "",
                    condition: "",
                    brand: "",
                    images: [],
                    location: "",
                    contact_method: "whatsapp",
                    contact_phone: "",
                  });
                }}
              >
                Publicar otro equipo
              </Button>
            </div>
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-stone-800 mb-2">
            Publicar equipo
          </h1>
          <p className="text-stone-500">
            Completa la información de tu equipo para publicarlo en el marketplace
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Fotos del equipo</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUploader
                images={formData.images}
                onChange={(images) => handleChange('images', images)}
                maxImages={5}
              />
            </CardContent>
          </Card>

          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Información básica</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Título del anuncio *</Label>
                <Input
                  id="title"
                  placeholder="Ej: Mochila Osprey Atmos 65L"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  required
                  className="h-12"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Categoría *</Label>
                  <Select value={formData.category} onValueChange={(v) => handleChange('category', v)} required>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Selecciona categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="brand">Marca</Label>
                  <Input
                    id="brand"
                    placeholder="Ej: Osprey, The North Face"
                    value={formData.brand}
                    onChange={(e) => handleChange('brand', e.target.value)}
                    className="h-12"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Estado del equipo *</Label>
                <Select value={formData.condition} onValueChange={(v) => handleChange('condition', v)} required>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Selecciona el estado" />
                  </SelectTrigger>
                  <SelectContent>
                    {conditions.map(cond => (
                      <SelectItem key={cond.value} value={cond.value}>{cond.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  placeholder="Describe tu equipo: características, talla, años de uso, razón de venta..."
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  className="min-h-[120px] resize-none"
                />
              </div>
            </CardContent>
          </Card>

          {/* Price */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Precio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="price">Precio en pesos chilenos *</Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500">$</span>
                  <Input
                    id="price"
                    type="number"
                    placeholder="50000"
                    value={formData.price}
                    onChange={(e) => handleChange('price', e.target.value)}
                    required
                    className="h-12 pl-8"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contacto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="location">Ubicación</Label>
                <Input
                  id="location"
                  placeholder="Ej: Santiago, Providencia"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label>Método de contacto preferido</Label>
                <Select value={formData.contact_method} onValueChange={(v) => handleChange('contact_method', v)}>
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {contactMethods.map(method => (
                      <SelectItem key={method.value} value={method.value}>{method.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {(formData.contact_method === 'whatsapp' || formData.contact_method === 'ambos') && (
                <div className="space-y-2">
                  <Label htmlFor="contact_phone">Número de WhatsApp</Label>
                  <Input
                    id="contact_phone"
                    placeholder="+56 9 1234 5678"
                    value={formData.contact_phone}
                    onChange={(e) => handleChange('contact_phone', e.target.value)}
                    className="h-12"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Submit */}
          <Button 
            type="submit" 
            disabled={createMutation.isPending || !formData.title || !formData.price || !formData.category || !formData.condition}
            className="w-full h-14 bg-emerald-700 hover:bg-emerald-800 text-lg rounded-xl"
          >
            {createMutation.isPending ? (
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
            ) : null}
            Publicar equipo
          </Button>
        </form>
      </div>
    </div>
  );
}