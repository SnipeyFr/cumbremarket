import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";

const formatPrice = (price) => {
  if (price == null) return "";
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    minimumFractionDigits: 0,
  }).format(price);
};

export default function ProductCard({ product }) {
  const image = product?.images?.[0];
  return (
    <Link to={createPageUrl(`ProductDetail?id=${product.id}`)} aria-label={`Ver ${product.title}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow bg-white border-stone-200">
        <div className="aspect-square bg-stone-100 overflow-hidden">
          {image ? (
            <img
              src={image}
              alt={product.title || "Producto"}
              loading="lazy"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-stone-300 text-sm">
              Sin imagen
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-stone-800 line-clamp-2 mb-1">{product.title}</h3>
          {product.brand ? (
            <p className="text-xs text-stone-500 mb-2 uppercase tracking-wide">{product.brand}</p>
          ) : null}
          <p className="text-emerald-700 font-bold">{formatPrice(product.price)}</p>
        </CardContent>
      </Card>
    </Link>
  );
}