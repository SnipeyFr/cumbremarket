import React, { useState, useMemo, useEffect } from 'react';
import { setSEO } from "@/components/seo";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@/api/supabaseClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  SlidersHorizontal, 
  X, 
  Loader2,
  Backpack, 
  Tent, 
  Moon, 
  Footprints, 
  Shirt, 
  Mountain, 
  Flame, 
  Compass,
  LayoutGrid,
  Filter
} from "lucide-react";
import ProductCard from "@/components/ProductCard.jsx";
import { createPageUrl } from "@/utils";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const categories = [
  { value: "all", label: "Todo", icon: LayoutGrid },
  { value: "mochilas", label: "Mochilas", icon: Backpack },
  { value: "carpas", label: "Carpas", icon: Tent },
  { value: "sacos_dormir", label: "Sacos", icon: Moon },
  { value: "calzado", label: "Calzado", icon: Footprints },
  { value: "ropa", label: "Ropa", icon: Shirt },
  { value: "escalada", label: "Escalada", icon: Mountain },
  { value: "camping", label: "Camping", icon: Flame },
  { value: "accesorios", label: "Accesorios", icon: Compass },
];

const conditionOptions = [
  { value: "all", label: "Todas las condiciones" },
  { value: "nuevo", label: "Nuevo" },
  { value: "como_nuevo", label: "Como nuevo" },
  { value: "buen_estado", label: "Buen estado" },
  { value: "usado", label: "Usado" },
];

const sortOptions = [
        { value: "recent", label: "Más recientes" },
        { value: "price_low", label: "Menor precio" },
        { value: "price_high", label: "Mayor precio" },
      ];

      const PAGE_LIMIT = 100;

export default function Catalog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCondition, setSelectedCondition] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    setSEO({
      title: "Catálogo de Equipo de Montaña Usado | Cumbre Market Chile",
      description: "Encuentra el mejor equipo de montaña usado en Chile: mochilas, carpas, sacos, ropa técnica y equipo de escalada. Precios accesibles y gear verificado.",
      canonicalPath: "/Catalog",
      ogType: "website",
      structuredData: {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "Catálogo Cumbre Market",
        "description": "Venta de equipo de montaña y outdoor usado en Chile",
        "url": window.location.href
      }
    });
  }, []);

  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => Product.filter({ is_active: true }, '-created_at', PAGE_LIMIT),
    initialData: [],
  });

  // Filter and sort products
  const filteredProducts = useMemo(() => {
            return products
              .filter(p => {
                const q = searchQuery.toLowerCase();
                const matchesSearch = searchQuery === "" || 
                  p.title?.toLowerCase().includes(q) ||
                  p.brand?.toLowerCase().includes(q) ||
                  p.description?.toLowerCase().includes(q);
                const matchesCategory = selectedCategory === "all" || p.category === selectedCategory;
                const matchesCondition = selectedCondition === "all" || p.condition === selectedCondition;
                return matchesSearch && matchesCategory && matchesCondition;
              })
              .sort((a, b) => {
                if (sortBy === "price_low") return (a.price || 0) - (b.price || 0);
                if (sortBy === "price_high") return (b.price || 0) - (a.price || 0);
                return new Date(b.created_date) - new Date(a.created_date);
              });
          }, [products, searchQuery, selectedCategory, selectedCondition, sortBy]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedCondition("all");
    setSortBy("recent");
  };

  const hasActiveFilters = searchQuery || selectedCategory !== "all" || selectedCondition !== "all";

  const FiltersContent = () => (
    <div className="space-y-8">
      <div>
        <h3 className="font-semibold text-stone-800 mb-4 flex items-center gap-2">
          <LayoutGrid className="w-4 h-4" /> Categorías
        </h3>
        <div className="space-y-2">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  selectedCategory === cat.value
                    ? 'bg-emerald-50 text-emerald-700 font-medium'
                    : 'text-stone-600 hover:bg-stone-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${selectedCategory === cat.value ? 'text-emerald-600' : 'text-stone-400'}`} />
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-stone-800 mb-4 flex items-center gap-2">
          <Filter className="w-4 h-4" /> Condición
        </h3>
        <RadioGroup value={selectedCondition} onValueChange={setSelectedCondition}>
          {conditionOptions.map((opt) => (
            <div key={opt.value} className="flex items-center space-x-2">
              <RadioGroupItem value={opt.value} id={`condition-${opt.value}`} />
              <Label htmlFor={`condition-${opt.value}`} className="text-stone-600 font-normal cursor-pointer">
                {opt.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Search Header */}
      <div className="bg-white border-b border-stone-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
              <Input
                placeholder="Buscar equipo de montaña usado en Chile: mochilas, carpas, escalada..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 bg-stone-50 border-stone-200 rounded-full focus:bg-white transition-colors"
              />
            </div>
            
            <Button
              variant="outline"
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className={`lg:hidden h-12 px-4 rounded-full border-stone-200 ${showMobileFilters ? 'bg-stone-100' : ''}`}
            >
              <SlidersHorizontal className="w-5 h-5" />
            </Button>

            <div className="hidden lg:block w-48">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="h-12 rounded-full border-stone-200">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Mobile Filters */}
          {showMobileFilters && (
            <div className="lg:hidden mt-4 pt-4 border-t border-stone-100 animate-in slide-in-from-top-2">
              <div className="space-y-4">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FiltersContent />
                {hasActiveFilters && (
                  <Button 
                    variant="ghost" 
                    onClick={clearFilters}
                    className="w-full text-stone-500"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Limpiar filtros
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-28 space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-stone-900">Filtros</h2>
                {hasActiveFilters && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={clearFilters}
                    className="text-stone-500 h-auto p-0 hover:bg-transparent hover:text-red-600"
                  >
                    Limpiar
                  </Button>
                )}
              </div>
              <FiltersContent />
            </div>
          </aside>

          {/* Results Grid */}
          <main className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-stone-800 mb-1">Equipo de Montaña Usado</h1>
                <p className="text-stone-500">
                  {filteredProducts.length} {filteredProducts.length === 1 ? 'producto' : 'productos'} en Chile
                </p>
              </div>
            </div>
            
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl border border-stone-100 shadow-sm">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-stone-50 flex items-center justify-center">
                  <Search className="w-10 h-10 text-stone-300" />
                </div>
                <h3 className="text-xl font-semibold text-stone-700 mb-2">
                  No encontramos productos
                </h3>
                <p className="text-stone-500 mb-6">
                  Intenta con otros filtros o términos de búsqueda
                </p>
                <Button onClick={clearFilters} variant="outline">
                  Limpiar filtros
                </Button>
              </div>
            )}
            <div className="mt-12 pt-6 border-t border-stone-200">
              <p className="text-sm text-stone-400">
                Encuentra equipo de montaña usado para trekking, escalada y andinismo en Chile. ¿Tienes gear que ya no usas? <a href={createPageUrl('CreateProduct')} className="underline hover:text-emerald-700">publica tu equipo usado</a> y véndelo a la comunidad outdoor.
              </p>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}