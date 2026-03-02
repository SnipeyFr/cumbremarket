import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Product, auth } from "@/api/supabaseClient";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Plus, 
  Loader2, 
  Eye, 
  EyeOff, 
  Trash2, 
  Edit,
  MoreVertical,
  Package,
  CheckCircle2
} from "lucide-react";
import { setSEO } from "@/components/seo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const formatPrice = (price) => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0
  }).format(price);
};

const conditionLabels = {
  nuevo: "Nuevo",
  como_nuevo: "Como nuevo",
  buen_estado: "Buen estado",
  usado: "Usado"
};

export default function MyProducts() {
  const [user, setUser] = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [activeTab, setActiveTab] = useState('active');
  const queryClient = useQueryClient();

  React.useEffect(() => {
    setSEO({
      title: "Mis publicaciones | Vende equipo de montaña usado en Chile | Cumbre Market",
      description: "Gestiona tus publicaciones de equipo outdoor usado en Chile. Pausa, activa o marca como vendido fácilmente.",
      canonicalPath: "/MyProducts"
    });
  }, []);

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

  const { data: products, isLoading } = useQuery({
    queryKey: ['my-products', user?.email],
    queryFn: () => Product.filter({ created_by: user.email }, '-created_date'),
    enabled: !!user,
    initialData: [],
  });

  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, is_active }) => Product.update(id, { is_active }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-products', user?.email] }),
  });

  const markAsSoldMutation = useMutation({
    mutationFn: (id) => Product.update(id, { status: 'sold', is_active: false }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-products', user?.email] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => Product.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-products', user?.email] });
      setDeleteId(null);
    },
  });

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
              Inicia sesión
            </h2>
            <p className="text-stone-500 mb-6">
              Necesitas una cuenta para ver tus publicaciones
            </p>
            <Button 
              onClick={() => auth.redirectToLogin(window.location.href)}
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
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to={createPageUrl("Home")}>
              <Button variant="ghost" className="gap-2 text-stone-600 hover:text-stone-800">
                <ArrowLeft className="w-4 h-4" />
                Volver
              </Button>
            </Link>
            <Link to={createPageUrl("CreateProduct")}>
              <Button className="bg-emerald-700 hover:bg-emerald-800 gap-2">
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Nueva publicación</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-stone-800 mb-2">
            Mis publicaciones
          </h1>
          <p className="text-stone-500">
            Gestiona tus equipos publicados en Cumbre Market
          </p>
        </div>

        {/* Stats */}
        {!isLoading && products.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm">
              <p className="text-sm text-stone-500 mb-1">Total Vistas</p>
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-emerald-600" />
                <span className="text-2xl font-bold text-stone-800">
                  {products.reduce((acc, p) => acc + (p.views || 0), 0)}
                </span>
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm">
              <p className="text-sm text-stone-500 mb-1">Activos</p>
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-600" />
                <span className="text-2xl font-bold text-stone-800">
                  {products.filter(p => p.status !== 'sold' && p.is_active).length}
                </span>
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm">
              <p className="text-sm text-stone-500 mb-1">Ventas</p>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span className="text-2xl font-bold text-stone-800">
                  {products.filter(p => p.status === 'sold').length}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-stone-200">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-4 py-2 font-medium transition-colors border-b-2 ${
              activeTab === 'active'
                ? 'border-emerald-700 text-emerald-700'
                : 'border-transparent text-stone-500 hover:text-stone-700'
            }`}
          >
            Activos ({products.filter(p => p.status !== 'sold').length})
          </button>
          <button
            onClick={() => setActiveTab('sold')}
            className={`px-4 py-2 font-medium transition-colors border-b-2 ${
              activeTab === 'sold'
                ? 'border-emerald-700 text-emerald-700'
                : 'border-transparent text-stone-500 hover:text-stone-700'
            }`}
          >
            Vendidos ({products.filter(p => p.status === 'sold').length})
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
          </div>
        ) : products.length > 0 ? (
          <div className="space-y-4">
            {products.filter(p => activeTab === 'sold' ? p.status === 'sold' : p.status !== 'sold').map((product) => (
              <Card key={product.id} className={`overflow-hidden ${!product.is_active ? 'opacity-60' : ''}`}>
                <CardContent className="p-0">
                  <div className="flex flex-col sm:flex-row">
                    {/* Image */}
                    <div className="sm:w-40 h-40 flex-shrink-0 bg-stone-100">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0]}
                          alt={product.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-10 h-10 text-stone-300" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          {product.status === 'sold' && (
                            <Badge className="bg-green-100 text-green-700 border-green-200">
                              Vendido
                            </Badge>
                          )}
                          {!product.is_active && product.status !== 'sold' && (
                            <Badge variant="secondary" className="bg-stone-200 text-stone-600">
                              Pausado
                            </Badge>
                          )}
                          <Badge variant="outline" className="text-xs">
                            {conditionLabels[product.condition]}
                          </Badge>
                        </div>
                        <h3 className="font-semibold text-stone-800 truncate mb-1">
                          {product.title}
                        </h3>
                        <p className="text-lg font-bold text-emerald-700 mb-2">
                          {formatPrice(product.price)}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-stone-400">
                          <span className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {product.views || 0} vistas
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <Link to={createPageUrl(`ProductDetail?id=${product.id}`)}>
                          <Button variant="outline" size="sm">
                            Ver
                          </Button>
                        </Link>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {product.status !== 'sold' && (
                              <>
                                <DropdownMenuItem asChild>
                                  <Link to={createPageUrl(`EditProduct?id=${product.id}`)}>
                                    <Edit className="w-4 h-4 mr-2" />
                                    Editar
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => toggleActiveMutation.mutate({ 
                                    id: product.id, 
                                    is_active: !product.is_active 
                                  })}
                                >
                                  {product.is_active ? (
                                    <>
                                      <EyeOff className="w-4 h-4 mr-2" />
                                      Pausar publicación
                                    </>
                                  ) : (
                                    <>
                                      <Eye className="w-4 h-4 mr-2" />
                                      Activar publicación
                                    </>
                                  )}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => markAsSoldMutation.mutate(product.id)}
                                  className="text-green-700 focus:text-green-700"
                                >
                                  <CheckCircle2 className="w-4 h-4 mr-2" />
                                  Marcar como vendido
                                </DropdownMenuItem>
                              </>
                            )}
                            <DropdownMenuItem
                              onClick={() => setDeleteId(product.id)}
                              className="text-red-600 focus:text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-stone-100 flex items-center justify-center">
              <Package className="w-10 h-10 text-stone-300" />
            </div>
            <h3 className="text-xl font-semibold text-stone-700 mb-2">
              Aún no tienes publicaciones
            </h3>
            <p className="text-stone-500 mb-6">
              Publica tu primer equipo y comienza a vender
            </p>
            <Link to={createPageUrl("CreateProduct")}>
              <Button className="bg-emerald-700 hover:bg-emerald-800">
                <Plus className="w-4 h-4 mr-2" />
                Publicar equipo
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar publicación?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El producto será eliminado permanentemente del marketplace.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteMutation.mutate(deleteId)}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}