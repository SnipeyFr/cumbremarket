import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Product } from "@/api/supabaseClient";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  User, 
  MessageCircle, 
  Mail, 
  ChevronLeft, 
  ChevronRight,
  Share2,
  Loader2,
  AlertCircle
} from "lucide-react";
import { format } from "date-fns";
import { setSEO } from "@/components/seo";
import { es } from "date-fns/locale";

const categoryLabels = {
  mochilas: "Mochilas",
  carpas: "Carpas",
  sacos_dormir: "Sacos de dormir",
  calzado: "Calzado",
  ropa: "Ropa",
  escalada: "Escalada",
  camping: "Camping",
  accesorios: "Accesorios",
  otros: "Otros"
};

const conditionLabels = {
  nuevo: "Nuevo",
  como_nuevo: "Como nuevo",
  buen_estado: "Buen estado",
  usado: "Usado"
};

const conditionColors = {
  nuevo: "bg-emerald-100 text-emerald-800",
  como_nuevo: "bg-teal-100 text-teal-800",
  buen_estado: "bg-amber-100 text-amber-800",
  usado: "bg-stone-100 text-stone-700"
};

const formatPrice = (price) => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0
  }).format(price);
};

export default function ProductDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const queryClient = useQueryClient();

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => Product.filter({ id: productId }),
    enabled: !!productId,
    select: (data) => data[0],
  });

  // SEO
  useEffect(() => {
    if (product) {
      const cat = categoryLabels[product.category] || 'Equipo outdoor';
      const brandPart = product.brand ? `${product.brand} ` : '';
      const description = `Compra ${brandPart}${product.title} en Chile. Condición: ${conditionLabels[product.condition]}. Ideal para ${cat.toLowerCase()}. Equipo de montaña usado verificado por la comunidad.`;
      const imageUrl = product.images?.[0] || "";
      
      setSEO({
        title: `${brandPart}${product.title} | ${cat} usado - Cumbre Market`,
        description: description,
        canonicalPath: `/ProductDetail?id=${product.id}`,
        ogImage: imageUrl,
        ogType: 'product',
        structuredData: {
          "@context": "https://schema.org/",
          "@type": "Product",
          "name": product.title,
          "image": product.images || [],
          "description": product.description || description,
          "brand": {
            "@type": "Brand",
            "name": product.brand || "Genérico"
          },
          "offers": {
            "@type": "Offer",
            "url": window.location.href,
            "priceCurrency": "CLP",
            "price": product.price,
            "itemCondition": product.condition === 'nuevo' ? "https://schema.org/NewCondition" : "https://schema.org/UsedCondition",
            "availability": "https://schema.org/InStock",
            "seller": {
              "@type": "Person",
              "name": product.created_by?.split('@')[0] || "Usuario de Cumbre Market"
            }
          }
        }
      });
    }
  }, [product?.id]);

  // Increment views
  useEffect(() => {
    if (product) {
      Product.update(product.id, { 
        views: (product.views || 0) + 1 
      });
    }
  }, [product?.id]);

  const handleWhatsApp = () => {
    if (product?.contact_phone) {
      const message = encodeURIComponent(`¡Hola! Vi tu publicación "${product.title}" en Cumbre Market y me interesa. ¿Sigue disponible?`);
      const phone = product.contact_phone.replace(/\D/g, '');
      window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
    }
  };

  const handleEmail = () => {
    if (product?.created_by) {
      const subject = encodeURIComponent(`Consulta sobre: ${product.title} - Cumbre Market`);
      const body = encodeURIComponent(`¡Hola!\n\nVi tu publicación "${product.title}" en Cumbre Market y me interesa.\n\n¿Podrías darme más información?\n\nGracias!`);
      window.open(`mailto:${product.created_by}?subject=${subject}&body=${body}`, '_blank');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: product.title,
        text: `Mira este equipo en Cumbre Market: ${product.title}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const nextImage = () => {
    if (product?.images?.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
    }
  };

  const prevImage = () => {
    if (product?.images?.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-4">
        <AlertCircle className="w-16 h-16 text-stone-300 mb-4" />
        <h2 className="text-xl font-semibold text-stone-700 mb-2">Producto no encontrado</h2>
        <p className="text-stone-500 mb-6">Este producto ya no está disponible o fue eliminado</p>
        <Link to={createPageUrl("Catalog")}>
          <Button className="bg-emerald-700 hover:bg-emerald-800">
            Volver al catálogo
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="bg-white border-b border-stone-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to={createPageUrl("Catalog")}>
              <Button variant="ghost" className="gap-2 text-stone-600 hover:text-stone-800">
                <ArrowLeft className="w-4 h-4" />
                Volver
              </Button>
            </Link>
            <Button variant="ghost" onClick={handleShare} className="gap-2 text-stone-600">
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Compartir</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-2xl overflow-hidden shadow-sm relative group">
              {product.images && product.images.length > 0 ? (
                <>
                  <img
                    src={product.images[currentImageIndex]}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                  {product.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                        {product.images.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setCurrentImageIndex(idx)}
                            className={`w-2 h-2 rounded-full transition-colors ${
                              idx === currentImageIndex ? 'bg-white' : 'bg-white/50'
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-stone-100">
                  <div className="text-stone-300">
                    <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
            
            {/* Thumbnail Gallery */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      idx === currentImageIndex ? 'border-emerald-600' : 'border-transparent'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge className={`${conditionColors[product.condition]} border-0`}>
                  {conditionLabels[product.condition]}
                </Badge>
                <Badge variant="outline" className="border-stone-200 text-stone-600">
                  {categoryLabels[product.category]}
                </Badge>
              </div>
              
              {product.brand && (
                <p className="text-sm text-stone-400 uppercase tracking-wider mb-1">
                  {product.brand}
                </p>
              )}
              
              <h1 className="text-2xl md:text-3xl font-bold text-stone-800 mb-4">
                {(product.brand && !product.title?.toLowerCase().includes(product.brand.toLowerCase())) ? `${product.brand} ${product.title}` : product.title}
              </h1>
              <p className="text-stone-600 mb-3">
                Compra equipo de montaña usado en Chile para trekking, escalada y andinismo. Este producto es parte de nuestro catálogo outdoor de segunda mano.
              </p>
              <ul className="list-disc pl-5 text-stone-600 mb-4">
                {product.brand && <li><strong>Marca:</strong> {product.brand}</li>}
                <li><strong>Condición:</strong> {conditionLabels[product.condition]}</li>
                <li><strong>Uso recomendado:</strong> {categoryLabels[product.category]}</li>
              </ul>
              
              <p className="text-3xl md:text-4xl font-bold text-emerald-700">
                {formatPrice(product.price)}
              </p>
            </div>

            {/* Meta Info */}
            <div className="flex flex-wrap gap-4 text-sm text-stone-500">
              {product.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{product.location}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>
                  Publicado {format(new Date(product.created_date), "d 'de' MMMM", { locale: es })}
                </span>
              </div>
              {product.created_by && (
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{product.created_by.split('@')[0]}</span>
                </div>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div className="pt-6 border-t border-stone-200">
                <h3 className="font-semibold text-stone-800 mb-3">Descripción</h3>
                <p className="text-stone-600 whitespace-pre-wrap leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Contact Buttons */}
            <div className="pt-6 border-t border-stone-200 space-y-3">
              <h3 className="font-semibold text-stone-800 mb-4">Contactar al vendedor</h3>
              
              {(product.contact_method === 'whatsapp' || product.contact_method === 'ambos') && product.contact_phone && (
                <Button 
                  onClick={handleWhatsApp}
                  className="w-full h-14 bg-green-600 hover:bg-green-700 text-lg gap-3 rounded-xl"
                >
                  <MessageCircle className="w-5 h-5" />
                  Contactar por WhatsApp
                </Button>
              )}
              
              {(product.contact_method === 'email' || product.contact_method === 'ambos') && (
                <Button 
                  onClick={handleEmail}
                  variant="outline"
                  className="w-full h-14 text-lg gap-3 rounded-xl border-stone-300"
                >
                  <Mail className="w-5 h-5" />
                  Enviar correo
                </Button>
              )}
              
              {!product.contact_method && (
                <Button 
                  onClick={handleEmail}
                  variant="outline"
                  className="w-full h-14 text-lg gap-3 rounded-xl border-stone-300"
                >
                  <Mail className="w-5 h-5" />
                  Enviar correo al vendedor
                </Button>
              )}
            </div>

            {/* Safety Notice */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="text-sm text-amber-800">
                <strong>Consejo de seguridad:</strong> Siempre revisa el equipo en persona antes de comprar. 
                Reúnete en lugares públicos y seguros.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}