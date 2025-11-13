'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

// Datos de los roles Kuntur (extraídos de BRAND-KIT.md)
const rolesData = [
  {
    id: 'recepcionista',
    name: 'Recepcionista Kuntur',
    tagline: 'Tu primera impresión, siempre perfecta',
    price: '120 USDT',
    description: 'Atiende consultas, agenda citas y deriva clientes las 24 horas del día.'
  },
  {
    id: 'vendedor',
    name: 'Vendedor Kuntur',
    tagline: 'Vende mientras dormís',
    price: '120 USDT',
    description: 'Muestra productos, calcula totales y envía QR de pago automáticamente.'
  },
  {
    id: 'promotora',
    name: 'Promotora Kuntur',
    tagline: 'Tu marca, siempre presente',
    price: '120 USDT',
    description: 'Presenta promociones y mantiene el engagement con tus clientes.'
  },
  {
    id: 'community',
    name: 'Community Kuntur',
    tagline: 'Tu comunidad, siempre activa',
    price: '120 USDT',
    description: 'Gestiona redes, responde comentarios y modera grupos automáticamente.'
  },
  {
    id: 'gestor',
    name: 'Gestor Kuntur',
    tagline: 'Organizá sin esfuerzo',
    price: '120 USDT',
    description: 'Organiza clientes, envía recordatorios y hace seguimiento constante.'
  },
  {
    id: 'personal',
    name: 'Personal Kuntur',
    tagline: 'Tu asistente personal 24/7',
    price: '120 USDT',
    description: 'Agenda, tareas y recordatorios inteligentes para tu día a día.'
  },
  {
    id: 'kuntur-full',
    name: 'Kuntur Full',
    tagline: 'El ecosistema completo',
    price: '510 USDT',
    description: 'Los 6 roles trabajando en equipo para tu negocio.'
  }
];

// Datos de planes de hosting (extraídos de BRAND-KIT.md)
const hostingPlans = [
  {
    id: 'starter',
    name: 'Starter',
    monthlyPrice: 20,
    annualPrice: 192,
    annualDiscount: 20,
    capacity: '1 rol, hasta 1,200 conversaciones/mes',
    features: [
      'Servidor dedicado',
      'Créditos de IA incluidos',
      'Integración WhatsApp/Email',
      'Soporte por email'
    ],
    ideal: 'Emprendedores iniciando'
  },
  {
    id: 'crecimiento',
    name: 'Crecimiento',
    monthlyPrice: 60,
    annualPrice: 540,
    annualDiscount: 25,
    capacity: '2-3 roles, hasta 3,000 conversaciones/mes',
    features: [
      'Todo de Starter +',
      'Más créditos de IA',
      'Soporte prioritario',
      'Monitoreo avanzado'
    ],
    ideal: 'Negocios en expansión'
  },
  {
    id: 'premium',
    name: 'Premium',
    monthlyPrice: 150,
    annualPrice: 1260,
    annualDiscount: 30,
    capacity: '4-6 roles, hasta 10,000 conversaciones/mes',
    features: [
      'Todo de Crecimiento +',
      'Créditos ilimitados de IA',
      'Soporte VIP 24/7',
      'Consultoría mensual'
    ],
    ideal: 'Operaciones a gran escala'
  }
];

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

  // Función para manejar la selección de roles
  const toggleRole = (roleId: string) => {
    setSelectedRoles(prev => {
      if (prev.includes(roleId)) {
        return prev.filter(id => id !== roleId);
      } else {
        return [...prev, roleId];
      }
    });
  };

  // Función para manejar el click en la card
  const handleCardClick = (roleId: string) => {
    toggleRole(roleId);
  };

  // Función para seleccionar hosting
  const selectHosting = (planId: string) => {
    setSelectedHosting(planId);
  };

  // Función para verificar compatibilidad de hosting con roles seleccionados
  const isHostingCompatible = (planId: string): boolean => {
    const roleCount = selectedRoles.length;

    // Si se seleccionó Kuntur Full, solo Premium es compatible
    if (selectedRoles.includes('kuntur-full')) {
      return planId === 'premium';
    }

    // Reglas de compatibilidad normales
    if (roleCount === 1) return true;           // Todos los planes soportan 1 rol
    if (roleCount >= 2 && roleCount <= 3) {
      return planId === 'crecimiento' || planId === 'premium'; // Solo Crecimiento y Premium
    }
    if (roleCount >= 4) return planId === 'premium'; // Solo Premium para 4+ roles

    return true;
  };

  // Función para obtener mensaje de incompatibilidad
  const getIncompatibilityMessage = (planId: string): string => {
    const roleCount = selectedRoles.length;

    if (selectedRoles.includes('kuntur-full')) {
      return 'Kuntur Full requiere plan Premium';
    }

    if (planId === 'starter' && roleCount > 1) {
      return 'Este plan solo soporta 1 rol';
    }

    if (planId === 'crecimiento' && roleCount > 3) {
      return 'Este plan soporta hasta 3 roles';
    }

    return 'Plan no compatible con los roles seleccionados';
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
              {currentStep === 1 && (
                <div>
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-kuntur-dark mb-2">👥 Paso 1: Selección de Roles</h3>
                    <p className="text-kuntur-gray">Elegí los Roles Kuntur que tu negocio necesita</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {rolesData.map((role) => (
                      <Card
                        key={role.id}
                        className={`cursor-pointer transition-all hover:shadow-lg ${
                          selectedRoles.includes(role.id)
                            ? 'border-kuntur-blue bg-kuntur-cream/50'
                            : 'border-kuntur-gray/20 hover:border-kuntur-blue/50'
                        }`}
                        onClick={() => handleCardClick(role.id)}
                      >
                        <CardHeader className="pb-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-lg text-kuntur-dark mb-2">
                                {role.name}
                              </CardTitle>
                              <p className="text-sm text-kuntur-blue font-medium">
                                {role.tagline}
                              </p>
                            </div>
                            <Checkbox
                              checked={selectedRoles.includes(role.id)}
                              onChange={() => {}} // Se maneja con el click de la card
                              className="mt-1"
                            />
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <p className="text-sm text-kuntur-gray mb-4">
                            {role.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <p className="text-lg font-bold text-kuntur-blue">
                              {role.price}
                            </p>
                            {role.id === 'kuntur-full' && (
                              <Badge variant="secondary" className="text-xs">
                                Ahorrás 30%
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <div className="text-center">
                    <p className="text-lg font-semibold text-kuntur-dark mb-2">
                      {selectedRoles.length} {selectedRoles.length === 1 ? 'rol seleccionado' : 'roles seleccionados'}
                    </p>
                    <p className="text-sm text-kuntur-gray">
                      {selectedRoles.length === 0 && 'Seleccioná al menos un rol para continuar'}
                      {selectedRoles.length > 0 && '¡Perfecto! Ahora elegí tu plan de hosting'}
                    </p>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div>
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-kuntur-dark mb-2">🖥️ Paso 2: Selección de Hosting</h3>
                    <p className="text-kuntur-gray mb-4">Elegí el plan de hosting para tus Roles Kuntur</p>

                    {/* Toggle Mensual/Anual */}
                    <div className="flex items-center justify-center gap-4">
                      <span className={`font-medium ${!isAnnual ? 'text-kuntur-dark' : 'text-kuntur-gray'}`}>
                        Mensual
                      </span>
                      <button
                        onClick={() => setIsAnnual(!isAnnual)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          isAnnual ? 'bg-kuntur-blue' : 'bg-kuntur-gray/30'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            isAnnual ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                      <span className={`font-medium ${isAnnual ? 'text-kuntur-dark' : 'text-kuntur-gray'}`}>
                        Anual
                        {isAnnual && (
                          <span className="text-sm text-green-600 font-semibold ml-2">
                            Ahorrás hasta 30%
                          </span>
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {hostingPlans.map((plan) => {
                      const isCompatible = isHostingCompatible(plan.id);
                      const isSelected = selectedHosting === plan.id;
                      const currentPrice = isAnnual ? plan.annualPrice : plan.monthlyPrice;

                      return (
                        <Card
                          key={plan.id}
                          className={`cursor-pointer transition-all ${
                            isSelected
                              ? 'border-kuntur-blue bg-kuntur-cream/50 ring-2 ring-kuntur-blue/20'
                              : isCompatible
                              ? 'border-kuntur-gray/20 hover:border-kuntur-blue/50 hover:shadow-lg'
                              : 'border-kuntur-gray/10 opacity-50 cursor-not-allowed'
                          }`}
                          onClick={() => isCompatible && selectHosting(plan.id)}
                        >
                          <CardHeader className="text-center pb-4">
                            {plan.id === 'crecimiento' && (
                              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                <Badge className="bg-kuntur-blue text-white px-3 py-1 text-xs font-semibold">
                                  ⭐ MÁS ELEGIDO
                                </Badge>
                              </div>
                            )}
                            <CardTitle className="text-2xl text-kuntur-dark mb-4">
                              {plan.name}
                            </CardTitle>
                            <div className="space-y-1">
                              <p className="text-3xl font-bold text-kuntur-blue">
                                ${currentPrice} USDT
                              </p>
                              <p className="text-kuntur-gray">
                                /{isAnnual ? 'año' : 'mes'}
                              </p>
                              {isAnnual && (
                                <p className="text-sm text-green-600 font-medium">
                                  (ahorrás {plan.annualDiscount}%)
                                </p>
                              )}
                            </div>
                          </CardHeader>
                          <CardContent className="text-center">
                            <div className="mb-6">
                              <p className="text-kuntur-gray font-medium">
                                {plan.capacity}
                              </p>
                            </div>

                            <div className="space-y-3 mb-6">
                              {plan.features.map((feature, index) => (
                                <div key={index} className="flex items-center gap-2 justify-start">
                                  <span className="text-green-600">✓</span>
                                  <span className="text-sm text-kuntur-gray text-left">
                                    {feature}
                                  </span>
                                </div>
                              ))}
                            </div>

                            <div className="pt-4 border-t border-kuntur-gray/20">
                              <p className="text-sm text-kuntur-gray">
                                <span className="font-semibold">Ideal para:</span> {plan.ideal}
                              </p>
                            </div>

                            {!isCompatible && (
                              <div className="mt-4 p-3 bg-red-50 rounded-lg">
                                <p className="text-xs text-red-600 font-medium">
                                  {getIncompatibilityMessage(plan.id)}
                                </p>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>

                  <div className="text-center">
                    {selectedHosting ? (
                      <div>
                        <p className="text-lg font-semibold text-kuntur-dark mb-2">
                          Plan seleccionado: {hostingPlans.find(p => p.id === selectedHosting)?.name}
                        </p>
                        <p className="text-sm text-kuntur-gray">
                          Perfecto! Ahora completá tus datos
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-lg font-semibold text-kuntur-dark mb-2">
                          Seleccioná un plan de hosting
                        </p>
                        <p className="text-sm text-kuntur-gray">
                          Elegí el plan que mejor se adapte a tus necesidades
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📝</div>
                  <h3 className="text-xl font-semibold text-kuntur-dark mb-2">Paso 3</h3>
                  <p className="text-kuntur-gray">Aquí completarás tus datos y verás el resumen.</p>
                </div>
              )}

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
            disabled={
              currentStep === 3 ||
              (currentStep === 1 && selectedRoles.length === 0) ||
              (currentStep === 2 && !selectedHosting)
            }
            className="bg-kuntur-blue hover:bg-kuntur-blue/90 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentStep === 3 ? 'Finalizar' :
             currentStep === 1 && selectedRoles.length === 0 ? 'Seleccioná roles →' :
             currentStep === 2 && !selectedHosting ? 'Seleccioná hosting →' : 'Siguiente →'}
          </Button>
        </div>
      </div>
    </main>
  );
}