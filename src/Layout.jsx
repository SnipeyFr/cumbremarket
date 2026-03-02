import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { auth } from "@/api/supabaseClient";
import { Button } from "@/components/ui/button";
import { 
  Mountain, 
  Menu, 
  X, 
  User, 
  Package, 
  Plus, 
  LogOut,
  Search
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function Layout({ children, currentPageName }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
          const checkAuth = async () => {
            const isAuth = await auth.isAuthenticated();
            if (isAuth) {
              const userData = await auth.me();
              setUser(userData);
            }
            setIsLoading(false);
          };
          checkAuth();
        }, []);

        // Set favicon and app icons
        useEffect(() => {
          const iconUrl = "/logo-dark.png";

          const setLink = (rel, href) => {
            let link = document.querySelector(`link[rel="${rel}"]`);
            if (!link) {
              link = document.createElement('link');
              link.setAttribute('rel', rel);
              document.head.appendChild(link);
            }
            link.setAttribute('href', href);
          };

          setLink('icon', iconUrl);
          setLink('shortcut icon', iconUrl);
          setLink('apple-touch-icon', iconUrl);
        }, []);

  const isHome = currentPageName === "Home";
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isTransparent = isHome && !isScrolled;

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className={`top-0 z-50 transition-all duration-300 ${isHome ? 'fixed w-full border-b' : 'sticky bg-white border-b border-stone-200'} ${isTransparent ? 'bg-transparent border-transparent' : 'bg-white border-stone-200 shadow-sm'}`}>
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to={createPageUrl("Home")} className="flex items-center gap-3">
              <img 
                src="/logo-dark.png" onError={(e)=>{e.target.style.display="none"}} 
                alt="Cumbre Market Logo" 
                className={`h-12 w-auto transition-all duration-300 ${isTransparent ? 'brightness-0 invert drop-shadow-md' : ''}`}
              />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-6">
              <Link 
                to={createPageUrl("Catalog")} 
                className={`font-medium transition-colors ${isTransparent ? 'text-white/90 hover:text-white' : 'text-stone-600 hover:text-stone-800'}`}
              >
                Explorar
              </Link>
              
              {!isLoading && (
                user ? (
                  <div className="flex items-center gap-3">
                    <Link to={createPageUrl("CreateProduct")}>
                      <Button className="bg-emerald-700 hover:bg-emerald-800 gap-2">
                        <Plus className="w-4 h-4" />
                        Publicar
                      </Button>
                    </Link>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          className={`gap-2 ${isTransparent ? 'text-white hover:bg-white/20 hover:text-white' : 'text-stone-700 hover:text-stone-900 hover:bg-stone-100'}`}
                        >
                          <User className="w-4 h-4" />
                          <span className="max-w-[100px] truncate">
                            {user.display_name || user.full_name || user.email.split('@')[0]}
                          </span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem asChild>
                          <Link to={createPageUrl("Profile")} className="cursor-pointer">
                            <User className="w-4 h-4 mr-2" />
                            Mi perfil
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to={createPageUrl("MyProducts")} className="cursor-pointer">
                            <Package className="w-4 h-4 mr-2" />
                            Mis publicaciones
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => auth.logout()} className="text-red-600 cursor-pointer">
                          <LogOut className="w-4 h-4 mr-2" />
                          Cerrar sesión
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ) : (
                  <Button 
                    onClick={() => window.location.href = '/Login'}
                    variant={isTransparent ? "outline" : "default"}
                    className={isTransparent ? 'bg-transparent border-white text-white hover:bg-white/10' : 'bg-emerald-700 hover:bg-emerald-800'}
                  >
                    Iniciar sesión
                  </Button>
                )
                )}
                </nav>

                {/* Mobile Menu */}
                <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" className={isTransparent ? 'text-white' : 'text-stone-800'}>
                  <Menu className="w-6 h-6" />
                </Button>
                </SheetTrigger>
              <SheetContent side="right" className="w-[300px]">
                <div className="flex flex-col gap-6 mt-8">
                  <Link 
                    to={createPageUrl("Catalog")}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 text-lg font-medium text-stone-700"
                  >
                    <Search className="w-5 h-5" />
                    Explorar productos
                  </Link>
                  
                  {user && (
                    <>
                      <Link 
                        to={createPageUrl("Profile")}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 text-lg font-medium text-stone-700"
                      >
                        <User className="w-5 h-5" />
                        Mi perfil
                      </Link>
                      <Link 
                        to={createPageUrl("CreateProduct")}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 text-lg font-medium text-stone-700"
                      >
                        <Plus className="w-5 h-5" />
                        Publicar equipo
                      </Link>
                      <Link 
                        to={createPageUrl("MyProducts")}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 text-lg font-medium text-stone-700"
                      >
                        <Package className="w-5 h-5" />
                        Mis publicaciones
                      </Link>
                    </>
                  )}
                  
                  <div className="border-t border-stone-200 pt-6 mt-auto">
                    {user ? (
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                            <User className="w-5 h-5 text-emerald-700" />
                          </div>
                          <div>
                            <p className="font-medium text-stone-800">
                              {user.display_name || user.full_name || 'Usuario'}
                            </p>
                            <p className="text-sm text-stone-500">{user.email}</p>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          onClick={() => auth.logout()}
                          className="w-full text-red-600 border-red-200 hover:bg-red-50"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Cerrar sesión
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        onClick={() => window.location.href = '/Login'}
                        className="w-full bg-emerald-700 hover:bg-emerald-800"
                      >
                        Iniciar sesión
                      </Button>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={isHome ? '-mt-16 md:-mt-20' : ''}>
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-stone-900 text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-white/20 backdrop-blur-sm w-14 h-14 flex items-center justify-center rounded-md">
                  <img 
                    src="/logo-dark.png" onError={(e)=>{e.target.style.display="none"}} 
                    alt="Cumbre Market Logo" 
                    className="h-8 w-auto brightness-0 invert"
                  />
                </div>
              </div>
              <p className="text-stone-400 max-w-md">
                El marketplace de la comunidad outdoor chilena. Compra y vende equipos de montaña, 
                trekking y aventura de manera segura y sustentable.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Explorar</h4>
              <ul className="space-y-2 text-stone-400">
                <li><Link to={createPageUrl("Catalog")} className="hover:text-white transition-colors">Todos los productos</Link></li>
                <li><Link to={createPageUrl("Catalog")} className="hover:text-white transition-colors">Mochilas</Link></li>
                <li><Link to={createPageUrl("Catalog")} className="hover:text-white transition-colors">Carpas</Link></li>
                <li><Link to={createPageUrl("Catalog")} className="hover:text-white transition-colors">Calzado</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Cuenta</h4>
              <ul className="space-y-2 text-stone-400">
                <li><Link to={createPageUrl("CreateProduct")} className="hover:text-white transition-colors">Publicar equipo</Link></li>
                <li><Link to={createPageUrl("MyProducts")} className="hover:text-white transition-colors">Mis publicaciones</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-stone-800 mt-12 pt-8 text-center text-stone-500 text-sm">
            <p>© 2024 Cumbre Market. Hecho con ❤️ para la comunidad outdoor de Chile.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}