import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function HeroSection() {
  return (
    <section className="relative h-[85vh] md:h-[90vh] min-h-[600px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src="/hero.jpg"
          alt="Montañas chilenas"
          className="w-full h-full object-cover object-center"
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
      </div>
      
      <div className="relative h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
          <div className="max-w-3xl">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-6 text-white drop-shadow-lg leading-tight">
              Compra y Vende <span className="text-emerald-400 block sm:inline">Equipo de Montaña</span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-stone-100 mb-8 max-w-2xl font-light drop-shadow-md leading-relaxed">
              El marketplace de Chile para <span className="font-medium text-white">trekking, escalada y andinismo</span>.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Link to={createPageUrl("Catalog")}>
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto bg-emerald-700 hover:bg-emerald-800 text-white gap-2"
                >
                  Explorar productos
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to={createPageUrl("CreateProduct")}>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="w-full sm:w-auto bg-transparent border-white text-white hover:bg-white/10"
                >
                  Publicar equipo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}