import { Button } from "@/components/ui/button";

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
    </main>
  );
}