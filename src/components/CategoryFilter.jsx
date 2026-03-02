import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  Backpack, 
  Tent, 
  Moon, 
  Footprints, 
  Shirt, 
  Mountain, 
  Flame, 
  Compass,
  LayoutGrid
} from "lucide-react";

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

export default function CategoryFilter({ selected, onChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map((cat) => {
        const Icon = cat.icon;
        const isActive = selected === cat.value;
        return (
          <Button
            key={cat.value}
            variant={isActive ? "default" : "outline"}
            onClick={() => onChange(cat.value)}
            className={`
              flex-shrink-0 gap-2 rounded-full transition-all duration-300
              ${isActive 
                ? "bg-emerald-700 hover:bg-emerald-800 text-white shadow-lg shadow-emerald-200" 
                : "bg-white hover:bg-stone-50 text-stone-600 border-stone-200 hover:border-stone-300"
              }
            `}
          >
            <Icon className="w-4 h-4" />
            <span className="hidden sm:inline">{cat.label}</span>
          </Button>
        );
      })}
    </div>
  );
}