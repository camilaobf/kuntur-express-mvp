import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <main className="min-h-screen bg-kuntur-cream">
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
            <Button variant="outline" size="lg" className="border-kuntur-blue text-kuntur-blue hover:bg-kuntur-blue hover:text-white px-8 py-6 text-lg">
              Ver Demo
            </Button>
          </div>
        </div>
      </div>

      {/* Roles Showcase Section */}
      <div className="bg-white py-20">
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
    </main>
  );
}