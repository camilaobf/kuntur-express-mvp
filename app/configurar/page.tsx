'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ConfigurarPage() {
  const [currentStep, setCurrentStep] = useState(1);

  // Estados para datos del formulario (se implementarán después)
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedHosting, setSelectedHosting] = useState<any>(null);
  const [isAnnual, setIsAnnual] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    negocio: ''
  });

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (step: number) => {
    if (step >= 1 && step <= 3) {
      setCurrentStep(step);
    }
  };

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
                href="/#roles"
                className="text-kuntur-gray hover:text-kuntur-blue transition-colors font-medium"
              >
                Roles
              </a>
              <a
                href="/#hosting"
                className="text-kuntur-gray hover:text-kuntur-blue transition-colors font-medium"
              >
                Hosting
              </a>
              <a
                href="mailto:hola@kunturexpress.com"
                className="text-kuntur-gray hover:text-kuntur-blue transition-colors font-medium"
              >
                Contacto
              </a>
            </div>

            {/* CTA Button */}
            <Button
              size="sm"
              className="bg-kuntur-blue hover:bg-kuntur-blue/90 text-white px-6"
            >
              Configurando...
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center justify-between mt-2">
            <div className="flex items-center gap-2">
              <span className="text-xl">🦅</span>
              <span className="text-lg font-bold text-kuntur-dark">Kuntur Express</span>
            </div>
            <Button
              size="sm"
              className="bg-kuntur-blue hover:bg-kuntur-blue/90 text-white px-4 text-sm"
            >
              Configurando...
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center justify-between relative">
            {/* Linea de progreso */}
            <div className="absolute left-0 right-0 h-1 bg-kuntur-gray/30 top-1/2 transform -translate-y-1/2 z-0"></div>
            <div
              className="absolute left-0 h-1 bg-kuntur-blue top-1/2 transform -translate-y-1/2 z-0 transition-all duration-300"
              style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
            ></div>

            {/* Steps */}
            <div className="relative z-10 flex items-center justify-between w-full">
              {/* Step 1 */}
              <button
                onClick={() => goToStep(1)}
                className="flex flex-col items-center gap-2 group"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                    currentStep >= 1
                      ? 'bg-kuntur-blue text-white'
                      : 'bg-white border-2 border-kuntur-gray/30 text-kuntur-gray'
                  } ${currentStep > 1 ? 'hover:bg-kuntur-blue/90' : ''}`}
                >
                  {currentStep > 1 ? '✓' : '1'}
                </div>
                <span className={`text-sm font-medium transition-colors ${
                  currentStep >= 1 ? 'text-kuntur-dark' : 'text-kuntur-gray'
                }`}>
                  Roles
                </span>
              </button>

              {/* Step 2 */}
              <button
                onClick={() => goToStep(2)}
                className="flex flex-col items-center gap-2 group"
                disabled={currentStep < 2}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                    currentStep >= 2
                      ? 'bg-kuntur-blue text-white'
                      : 'bg-white border-2 border-kuntur-gray/30 text-kuntur-gray'
                  } ${currentStep > 2 ? 'hover:bg-kuntur-blue/90' : ''} ${
                    currentStep < 2 ? 'cursor-not-allowed opacity-50' : ''
                  }`}
                >
                  {currentStep > 2 ? '✓' : '2'}
                </div>
                <span className={`text-sm font-medium transition-colors ${
                  currentStep >= 2 ? 'text-kuntur-dark' : 'text-kuntur-gray'
                }`}>
                  Hosting
                </span>
              </button>

              {/* Step 3 */}
              <button
                onClick={() => goToStep(3)}
                className="flex flex-col items-center gap-2 group"
                disabled={currentStep < 3}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                    currentStep >= 3
                      ? 'bg-kuntur-blue text-white'
                      : 'bg-white border-2 border-kuntur-gray/30 text-kuntur-gray'
                  } ${currentStep === 3 ? 'hover:bg-kuntur-blue/90' : ''} ${
                    currentStep < 3 ? 'cursor-not-allowed opacity-50' : ''
                  }`}
                >
                  3
                </div>
                <span className={`text-sm font-medium transition-colors ${
                  currentStep >= 3 ? 'text-kuntur-dark' : 'text-kuntur-gray'
                }`}>
                  Datos
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Step Content */}
        <div className="mb-8">
          <Card className="border-kuntur-gray/20">
            <CardHeader>
              <CardTitle className="text-2xl text-kuntur-dark text-center">
                {currentStep === 1 && 'Paso 1: Selección de Roles'}
                {currentStep === 2 && 'Paso 2: Selección de Hosting'}
                {currentStep === 3 && 'Paso 3: Formulario y Resumen'}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="text-center py-12">
                <div className="text-6xl mb-4">
                  {currentStep === 1 && '👥'}
                  {currentStep === 2 && '🖥️'}
                  {currentStep === 3 && '📝'}
                </div>
                <h3 className="text-xl font-semibold text-kuntur-dark mb-2">
                  {currentStep === 1 && 'Paso 1'}
                  {currentStep === 2 && 'Paso 2'}
                  {currentStep === 3 && 'Paso 3'}
                </h3>
                <p className="text-kuntur-gray">
                  {currentStep === 1 && 'Aquí seleccionarás los Roles Kuntur para tu negocio.'}
                  {currentStep === 2 && 'Aquí elegirás el plan de hosting adecuado.'}
                  {currentStep === 3 && 'Aquí completarás tus datos y verás el resumen.'}
                </p>

                {/* Información de estado actual (para debugging) */}
                <div className="mt-8 p-4 bg-kuntur-cream/50 rounded-lg text-left">
                  <h4 className="font-semibold text-kuntur-dark mb-2">Estado Actual:</h4>
                  <ul className="text-sm text-kuntur-gray space-y-1">
                    <li>• Paso actual: {currentStep}</li>
                    <li>• Roles seleccionados: {selectedRoles.length}</li>
                    <li>• Hosting seleccionado: {selectedHosting ? 'Sí' : 'No'}</li>
                    <li>• Plan anual: {isAnnual ? 'Sí' : 'No'}</li>
                    <li>• Formulario completo: {formData.nombre ? 'Sí' : 'No'}</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="border-kuntur-blue text-kuntur-blue hover:bg-kuntur-blue hover:text-white"
          >
            ← Anterior
          </Button>

          <div className="text-center text-kuntur-gray">
            Paso {currentStep} de 3
          </div>

          <Button
            onClick={nextStep}
            disabled={currentStep === 3}
            className="bg-kuntur-blue hover:bg-kuntur-blue/90 text-white"
          >
            {currentStep === 3 ? 'Finalizar' : 'Siguiente →'}
          </Button>
        </div>
      </div>
    </main>
  );
}