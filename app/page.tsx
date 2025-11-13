import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <main className="min-h-screen bg-kuntur-cream">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-kuntur-gray/20">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <span className="text-2xl">🦅</span>
              <span className="text-xl font-bold text-kuntur-dark">Kuntur Express</span>
            </div>

            {/* Links */}
            <div className="hidden md:flex items-center gap-8">
              <a
                href="#roles"
                className="text-kuntur-gray hover:text-kuntur-blue transition-colors font-medium"
              >
                Roles
              </a>
              <a
                href="#hosting"
                className="text-kuntur-gray hover:text-kuntur-blue transition-colors font-medium"
              >
                Hosting
              </a>
              <a
                href="https://calendar.app.google/c8X1Rhn3f6dFgzzBA"
                className="text-kuntur-gray hover:text-kuntur-blue transition-colors font-medium"
              >
                Contacto
              </a>
            </div>

            {/* CTA Button */}
            <Button
              size="sm"
              className="bg-kuntur-blue hover:bg-kuntur-blue/90 text-white px-6"
              asChild
            >
              <a href="/configurar">Configurar ahora</a>
            </Button>
          </div>

          {/* Mobile menu button - placeholder for future mobile menu */}
          <div className="md:hidden flex items-center justify-between mt-2">
            <div className="flex items-center gap-2">
              <span className="text-xl">🦅</span>
              <span className="text-lg font-bold text-kuntur-dark">Kuntur Express</span>
            </div>
            <Button
              size="sm"
              className="bg-kuntur-blue hover:bg-kuntur-blue/90 text-white px-4 text-sm"
              asChild
            >
              <a href="/configurar">Configurar</a>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-kuntur-dark mb-6">
            Activá tus Roles Kuntur: inteligencia que impulsa tu negocio 24/7
          </h1>

          <p className="text-xl md:text-2xl text-kuntur-gray mb-10 max-w-3xl mx-auto">
            Recepcionistas, vendedores y gestores digitales listos en 7 días. Trabajan mientras vos descansás.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-kuntur-blue hover:bg-kuntur-blue/90 text-white px-8 py-6 text-lg">
              Configurar mis Roles Kuntur
            </Button>
            <Button variant="outline" size="lg" className="border-kuntur-blue text-kuntur-blue hover:bg-kuntur-blue hover:text-white px-8 py-6 text-lg" asChild>
              <a href="https://calendar.app.google/c8X1Rhn3f6dFgzzBA">
                Agendar Consulta Gratuita
              </a>
            </Button>
          </div>
        </div>
      </div>

      {/* Roles Showcase Section */}
      <div id="roles" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-kuntur-dark mb-4">
              Roles Kuntur
            </h2>
            <p className="text-xl text-kuntur-gray">
              Elegí los roles perfectos para tu negocio
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* 1. Recepcionista Kuntur */}
            <Card className="hover:shadow-lg transition-shadow border-kuntur-gray/20">
              <CardHeader>
                <CardTitle className="text-xl text-kuntur-dark">Recepcionista Kuntur</CardTitle>
                <CardDescription className="text-lg text-kuntur-blue font-medium">
                  Tu primera impresión, siempre perfecta
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-kuntur-gray mb-4">
                  Atiende consultas, agenda citas y deriva clientes las 24 horas del día.
                </p>
                <div className="space-y-2 text-sm">
                  <p className="text-kuntur-gray">
                    <span className="font-semibold">Ideal para:</span> Clínicas, salones de belleza, estudios jurídicos
                  </p>
                  <p className="text-kuntur-gray">
                    <span className="font-semibold">Entrega:</span> 7 días
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-kuntur-gray/20">
                  <p className="text-2xl font-bold text-kuntur-blue">120 USDT</p>
                </div>
              </CardContent>
            </Card>

            {/* 2. Vendedor Kuntur */}
            <Card className="hover:shadow-lg transition-shadow border-kuntur-gray/20">
              <CardHeader>
                <CardTitle className="text-xl text-kuntur-dark">Vendedor Kuntur</CardTitle>
                <CardDescription className="text-lg text-kuntur-blue font-medium">
                  Vende mientras dormís
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-kuntur-gray mb-4">
                  Muestra productos, calcula totales y envía QR de pago automáticamente.
                </p>
                <div className="space-y-2 text-sm">
                  <p className="text-kuntur-gray">
                    <span className="font-semibold">Ideal para:</span> E-commerce, tiendas físicas, mayoristas
                  </p>
                  <p className="text-kuntur-gray">
                    <span className="font-semibold">Entrega:</span> 7 días
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-kuntur-gray/20">
                  <p className="text-2xl font-bold text-kuntur-blue">120 USDT</p>
                </div>
              </CardContent>
            </Card>

            {/* 3. Promotora Kuntur */}
            <Card className="hover:shadow-lg transition-shadow border-kuntur-gray/20">
              <CardHeader>
                <CardTitle className="text-xl text-kuntur-dark">Promotora Kuntur</CardTitle>
                <CardDescription className="text-lg text-kuntur-blue font-medium">
                  Tu marca, siempre presente
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-kuntur-gray mb-4">
                  Presenta promociones y mantiene el engagement con tus clientes.
                </p>
                <div className="space-y-2 text-sm">
                  <p className="text-kuntur-gray">
                    <span className="font-semibold">Ideal para:</span> Retail, gastronomía, eventos
                  </p>
                  <p className="text-kuntur-gray">
                    <span className="font-semibold">Entrega:</span> 7 días
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-kuntur-gray/20">
                  <p className="text-2xl font-bold text-kuntur-blue">120 USDT</p>
                </div>
              </CardContent>
            </Card>

            {/* 4. Community Kuntur */}
            <Card className="hover:shadow-lg transition-shadow border-kuntur-gray/20">
              <CardHeader>
                <CardTitle className="text-xl text-kuntur-dark">Community Kuntur</CardTitle>
                <CardDescription className="text-lg text-kuntur-blue font-medium">
                  Tu comunidad, siempre activa
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-kuntur-gray mb-4">
                  Gestiona redes, responde comentarios y modera grupos automáticamente.
                </p>
                <div className="space-y-2 text-sm">
                  <p className="text-kuntur-gray">
                    <span className="font-semibold">Ideal para:</span> Influencers, marcas personales, agencias
                  </p>
                  <p className="text-kuntur-gray">
                    <span className="font-semibold">Entrega:</span> 10 días
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-kuntur-gray/20">
                  <p className="text-2xl font-bold text-kuntur-blue">120 USDT</p>
                </div>
              </CardContent>
            </Card>

            {/* 5. Gestor Kuntur */}
            <Card className="hover:shadow-lg transition-shadow border-kuntur-gray/20">
              <CardHeader>
                <CardTitle className="text-xl text-kuntur-dark">Gestor Kuntur</CardTitle>
                <CardDescription className="text-lg text-kuntur-blue font-medium">
                  Organizá sin esfuerzo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-kuntur-gray mb-4">
                  Organiza clientes, envía recordatorios y hace seguimiento constante.
                </p>
                <div className="space-y-2 text-sm">
                  <p className="text-kuntur-gray">
                    <span className="font-semibold">Ideal para:</span> Servicios, suscripciones, membresías
                  </p>
                  <p className="text-kuntur-gray">
                    <span className="font-semibold">Entrega:</span> 10 días
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-kuntur-gray/20">
                  <p className="text-2xl font-bold text-kuntur-blue">120 USDT</p>
                </div>
              </CardContent>
            </Card>

            {/* 6. Personal Kuntur */}
            <Card className="hover:shadow-lg transition-shadow border-kuntur-gray/20">
              <CardHeader>
                <CardTitle className="text-xl text-kuntur-dark">Personal Kuntur</CardTitle>
                <CardDescription className="text-lg text-kuntur-blue font-medium">
                  Tu asistente personal 24/7
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-kuntur-gray mb-4">
                  Agenda, tareas y recordatorios inteligentes para tu día a día.
                </p>
                <div className="space-y-2 text-sm">
                  <p className="text-kuntur-gray">
                    <span className="font-semibold">Ideal para:</span> Emprendedores, freelancers, ejecutivos
                  </p>
                  <p className="text-kuntur-gray">
                    <span className="font-semibold">Entrega:</span> 12 días
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-kuntur-gray/20">
                  <p className="text-2xl font-bold text-kuntur-blue">120 USDT</p>
                </div>
              </CardContent>
            </Card>

            {/* 7. Kuntur Full */}
            <Card className="hover:shadow-lg transition-shadow border-kuntur-blue/50 bg-kuntur-cream/50">
              <CardHeader>
                <CardTitle className="text-xl text-kuntur-dark">Kuntur Full</CardTitle>
                <CardDescription className="text-lg text-kuntur-blue font-medium">
                  El ecosistema completo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-kuntur-gray mb-4">
                  Los 6 roles trabajando en equipo para tu negocio.
                </p>
                <div className="space-y-2 text-sm">
                  <p className="text-kuntur-gray">
                    <span className="font-semibold">Ideal para:</span> Negocios establecidos, expansión rápida
                  </p>
                  <p className="text-kuntur-gray">
                    <span className="font-semibold">Entrega:</span> 14-21 días
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-kuntur-gray/20">
                  <div className="flex items-baseline gap-2">
                    <p className="text-2xl font-bold text-kuntur-blue">510 USDT</p>
                    <p className="text-sm text-green-600 font-medium">(ahorrás 30%)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Hosting Plans Section */}
      <div id="hosting" className="bg-kuntur-cream py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-kuntur-dark mb-4">
              Hosting Express
            </h2>
            <p className="text-xl text-kuntur-gray">
              Servidor dedicado para que tus Roles Kuntur funcionen 24/7
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Starter Plan */}
            <Card className="hover:shadow-lg transition-shadow border-kuntur-gray/20">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-kuntur-dark">Starter</CardTitle>
                <div className="mt-4">
                  <p className="text-3xl font-bold text-kuntur-blue">20 USDT</p>
                  <p className="text-kuntur-gray">/mes</p>
                  <p className="text-sm text-kuntur-gray mt-2">
                    o <span className="font-semibold">192 USDT/año</span> (ahorrás 20%)
                  </p>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-6">
                  <p className="text-kuntur-gray font-medium">
                    1 rol, hasta 1,200 conversaciones/mes
                  </p>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    <span className="text-kuntur-gray">Servidor dedicado</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    <span className="text-kuntur-gray">Créditos de IA incluidos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    <span className="text-kuntur-gray">Integración WhatsApp/Email</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    <span className="text-kuntur-gray">Soporte por email</span>
                  </div>
                </div>

                <div className="text-center pt-4 border-t border-kuntur-gray/20">
                  <p className="text-sm text-kuntur-gray">
                    <span className="font-semibold">Ideal para:</span> Emprendedores iniciando
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Crecimiento Plan - MÁS ELEGIDO */}
            <Card className="hover:shadow-lg transition-shadow border-kuntur-blue/50 bg-white relative scale-105">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-kuntur-blue text-white px-4 py-1 text-sm font-semibold">
                  ⭐ MÁS ELEGIDO
                </Badge>
              </div>
              <CardHeader className="text-center pt-8">
                <CardTitle className="text-2xl text-kuntur-dark">Crecimiento</CardTitle>
                <div className="mt-4">
                  <p className="text-3xl font-bold text-kuntur-blue">60 USDT</p>
                  <p className="text-kuntur-gray">/mes</p>
                  <p className="text-sm text-kuntur-gray mt-2">
                    o <span className="font-semibold">540 USDT/año</span> (ahorrás 25%)
                  </p>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-6">
                  <p className="text-kuntur-gray font-medium">
                    2-3 roles, hasta 3,000 conversaciones/mes
                  </p>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    <span className="text-kuntur-gray">Todo de Starter +</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    <span className="text-kuntur-gray">Más créditos de IA</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    <span className="text-kuntur-gray">Soporte prioritario</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    <span className="text-kuntur-gray">Monitoreo avanzado</span>
                  </div>
                </div>

                <div className="text-center pt-4 border-t border-kuntur-gray/20">
                  <p className="text-sm text-kuntur-gray">
                    <span className="font-semibold">Ideal para:</span> Negocios en expansión
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Premium Plan */}
            <Card className="hover:shadow-lg transition-shadow border-kuntur-gray/20">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-kuntur-dark">Premium</CardTitle>
                <div className="mt-4">
                  <p className="text-3xl font-bold text-kuntur-blue">150 USDT</p>
                  <p className="text-kuntur-gray">/mes</p>
                  <p className="text-sm text-kuntur-gray mt-2">
                    o <span className="font-semibold">1,260 USDT/año</span> (ahorrás 30%)
                  </p>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-6">
                  <p className="text-kuntur-gray font-medium">
                    4-6 roles, hasta 10,000 conversaciones/mes
                  </p>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    <span className="text-kuntur-gray">Todo de Crecimiento +</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    <span className="text-kuntur-gray">Créditos ilimitados de IA</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    <span className="text-kuntur-gray">Soporte VIP 24/7</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    <span className="text-kuntur-gray">Consultoría mensual</span>
                  </div>
                </div>

                <div className="text-center pt-4 border-t border-kuntur-gray/20">
                  <p className="text-sm text-kuntur-gray">
                    <span className="font-semibold">Ideal para:</span> Operaciones a gran escala
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Simple Footer */}
      <footer className="bg-kuntur-dark text-kuntur-cream py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="mb-4">
            <img src="/logo-full-claro.png" alt="Kuntur Express" className="h-8 mx-auto mb-4" />
          </div>
          <p className="text-sm text-kuntur-gray mb-4">
            © 2025 Kuntur Express. Todos los derechos reservados.
          </p>
          <div className="flex justify-center gap-6 text-sm">
            <span className="hover:text-kuntur-blue cursor-pointer transition-colors">
              WhatsApp: +59164036038
            </span>
            <span className="text-kuntur-gray">|</span>
            <span className="hover:text-kuntur-blue cursor-pointer transition-colors">
              hola@kunturexpress.com
            </span>
          </div>
        </div>
      </footer>
    </main>
  );
}