import React from 'react';
import { setSEO } from "@/components/seo";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@/api/supabaseClient";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";
import HeroSection from "@/components/HeroSection";
import ValueProposition from "@/components/ValueProposition";
import ProductCard from "@/components/ProductCard.jsx";
import CategoryFilter from "@/components/CategoryFilter";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = React.useState("all");

  React.useEffect(() => {
    setSEO({
      title: "Cumbre Market | Compra y Vende Equipo de Montaña en Chile",
      description: "El marketplace N°1 de Chile para equipo de montaña usado. Compra y vende mochilas, carpas, zapatos y equipo de escalada de forma segura y sustentable.",
      canonicalPath: "/",
      ogImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80",
      structuredData: {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Cumbre Market",
        "url": window.location.origin,
        "potentialAction": {
          "@type": "SearchAction",
          "target": `${window.location.origin}/Catalog?q={search_term_string}`,
          "query-input": "required name=search_term_string"
        }
      }
    });
  }, []);

  const { data: products, isLoading } = useQuery({
    queryKey: ['featured-products'],
    queryFn: () => Product.filter({ is_active: true }, '-created_at', 8),
    initialData: [],
  });

  const filteredProducts = selectedCategory === "all" 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-stone-50">
      <HeroSection />

      {/* Buying CTA */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-emerald-800 to-emerald-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            ¿Necesitas equipo?
          </h2>
          <p className="text-emerald-200 text-lg mb-8 max-w-2xl mx-auto">
            Encuentra todo lo que necesitas para tu próxima aventura. Mochilas, carpas, ropa y más, verificado y a precios justos.
          </p>
          <Link to={createPageUrl("Catalog")}>
            <Button size="lg" className="bg-white text-emerald-800 hover:bg-stone-100 px-10 py-6 text-lg rounded-full shadow-xl transition-all duration-300 hover:scale-105">
              Explorar catálogo
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
      
      <ValueProposition />
      
      {/* Featured Products */}
      <section className="py-16 md:py-24 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-stone-800 mb-2">
                Publicaciones recientes
              </h2>
              <p className="text-stone-500">
                Descubre lo último que ha llegado al marketplace
              </p>
            </div>
            <Link to={createPageUrl("Catalog")}>
              <Button variant="ghost" className="text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 gap-2">
                Ver todo el catálogo
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          
          <div className="mb-8">
            <CategoryFilter 
              selected={selectedCategory} 
              onChange={setSelectedCategory} 
            />
          </div>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-stone-400 text-lg mb-4">
                No hay productos en esta categoría todavía
              </p>
              <Link to={createPageUrl("CreateProduct")}>
                <Button className="bg-emerald-700 hover:bg-emerald-800">
                  Sé el primero en publicar
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-emerald-800 to-emerald-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            ¿Tienes equipo que ya no usas?
          </h2>
          <p className="text-emerald-200 text-lg mb-8 max-w-2xl mx-auto">
            Dale una nueva vida a tu gear. Publica tu equipo en minutos y conecta con personas que lo aprovecharán en sus próximas aventuras.
          </p>
          <Link to={createPageUrl("CreateProduct")}>
            <Button size="lg" className="bg-white text-emerald-800 hover:bg-stone-100 px-10 py-6 text-lg rounded-full shadow-xl transition-all duration-300 hover:scale-105">
              Publicar ahora
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}