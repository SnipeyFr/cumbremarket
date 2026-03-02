import React from 'react';
import { Leaf, Users, Shield, Heart } from "lucide-react";

const values = [
  {
    icon: Shield,
    title: "Compra Segura",
    description: "Perfiles verificados y sistema de contacto directo entre personas"
  },
  {
    icon: Leaf,
    title: "Sustentable",
    description: "Dale una segunda vida a equipos de calidad y reduce el impacto ambiental"
  },
  {
    icon: Heart,
    title: "Accesible",
    description: "Equipos de montaña de calidad a precios justos para todos"
  },
  {
    icon: Users,
    title: "Comunidad",
    description: "Conecta directamente con otros montañistas y aventureros de Chile"
  }
];

export default function ValueProposition() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-stone-800 mb-4">
            ¿Por qué Cumbre Market?
          </h2>
          <p className="text-stone-500 text-lg max-w-2xl mx-auto">
            Más que un marketplace, somos una comunidad de personas que comparten la pasión por la montaña
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <div 
                key={index}
                className="text-center p-6 rounded-2xl hover:bg-stone-50 transition-colors duration-300"
              >
                <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
                  <Icon className="w-7 h-7 text-emerald-700" />
                </div>
                <h3 className="text-lg font-semibold text-stone-800 mb-2">
                  {value.title}
                </h3>
                <p className="text-stone-500 leading-relaxed">
                  {value.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}