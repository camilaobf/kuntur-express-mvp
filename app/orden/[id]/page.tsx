'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

interface OrderData {
  id: string;
  order_number: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  client_business: string;
  roles_selected: Array<{
    id: string;
    name: string;
    tagline: string;
    price: string;
  }>;
  hosting_plan_id?: string;
  hosting_is_annual: boolean;
  total_usdt: number;
  total_bob: number;
  exchange_rate: number;
  payment_status: string;
  created_at: string;
}

export default function OrderPage() {
  const params = useParams();
  const orderId = params.id as string;

  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<'transfer' | 'usdt'>('transfer');

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/orders/${orderId}`);
      const data = await response.json();

      if (data.success && data.data) {
        setOrder(data.data);
      } else {
        console.error('Error fetching order:', data.error);
      }
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-kuntur-cream">
        <div className="max-w-4xl mx-auto px-4 py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-kuntur-blue mx-auto mb-4"></div>
            <p className="text-kuntur-gray">Cargando orden...</p>
          </div>
        </div>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="min-h-screen bg-kuntur-cream">
        <div className="max-w-4xl mx-auto px-4 py-20">
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-2xl text-kuntur-dark">Orden no encontrada</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-kuntur-gray mb-6">
                La orden solicitada no existe o ha sido eliminada.
              </p>
              <Button asChild className="bg-kuntur-blue hover:bg-kuntur-blue/90">
                <a href="/configurar">Volver al configurador</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-kuntur-cream">
      <div className="max-w-4xl mx-auto px-4 py-20">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-kuntur-dark mb-2">
            Orden #{order.order_number}
          </h1>
          <p className="text-kuntur-gray">
            Generada el {new Date(order.created_at).toLocaleDateString('es-BO', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </p>
          <Badge
            className={`mt-2 ${
              order.payment_status === 'paid'
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}
          >
            {order.payment_status === 'paid' ? 'Pagada' : 'Pendiente de pago'}
          </Badge>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Columna Izquierda: Resumen */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-kuntur-dark">Resumen del Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Datos del Cliente */}
                <div>
                  <h3 className="font-semibold text-kuntur-dark mb-3">Datos del Cliente</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Nombre:</span> {order.client_name}</p>
                    <p><span className="font-medium">Email:</span> {order.client_email}</p>
                    <p><span className="font-medium">Teléfono:</span> {order.client_phone}</p>
                    <p><span className="font-medium">Negocio:</span> {order.client_business}</p>
                  </div>
                </div>

                {/* Roles Seleccionados */}
                <div>
                  <h3 className="font-semibold text-kuntur-dark mb-3">Roles Kuntur</h3>
                  <div className="space-y-3">
                    {order.roles_selected.map((role, index) => (
                      <div key={index} className="p-3 bg-white border border-kuntur-gray/20 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-kuntur-dark">{role.name}</p>
                            <p className="text-sm text-kuntur-gray">{role.tagline}</p>
                          </div>
                          <span className="text-kuntur-blue font-semibold">{role.price}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Hosting */}
                {order.hosting_plan_id && (
                  <div>
                    <h3 className="font-semibold text-kuntur-dark mb-3">Hosting Express</h3>
                    <div className="p-3 bg-white border border-kuntur-gray/20 rounded-lg">
                      <p className="font-medium text-kuntur-dark">
                        {order.hosting_is_annual ? 'Plan Anual' : 'Plan Mensual'}
                      </p>
                    </div>
                  </div>
                )}

                {/* Totales */}
                <div className="border-t border-kuntur-gray/20 pt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-kuntur-gray">Subtotal:</span>
                      <span className="text-kuntur-dark">${order.total_usdt} USDT</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-kuntur-gray">Total en BOB:</span>
                      <span className="text-kuntur-dark">${order.total_bob.toFixed(2)} BOB</span>
                    </div>
                    <div className="flex justify-between text-sm text-kuntur-gray">
                      <span>Tasa de cambio:</span>
                      <span>${order.exchange_rate} BOB/USDT</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Columna Derecha: Métodos de Pago */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-kuntur-dark">Métodos de Pago</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Opciones de pago */}
                <div className="space-y-4">
                  {/* Opción 1: Transferencia Bancaria */}
                  <div
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      paymentMethod === 'transfer'
                        ? 'border-kuntur-blue bg-kuntur-blue/10'
                        : 'border-kuntur-gray/20 hover:border-kuntur-blue/50'
                    }`}
                    onClick={() => setPaymentMethod('transfer')}
                  >
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={paymentMethod === 'transfer'}
                        className="mt-1"
                        readOnly
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-kuntur-dark">Transferencia Bancaria</h4>
                        <p className="text-sm text-kuntur-gray mt-1">
                          Realiza una transferencia a nuestra cuenta bancaria
                        </p>
                        <div className="mt-3">
                          <img
                            src="/qr-banco.png"
                            alt="QR Banco"
                            className="w-32 h-32 border border-kuntur-gray/20 rounded-lg"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Opción 2: USDT TRC20 */}
                  <div
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      paymentMethod === 'usdt'
                        ? 'border-kuntur-blue bg-kuntur-blue/10'
                        : 'border-kuntur-gray/20 hover:border-kuntur-blue/50'
                    }`}
                    onClick={() => setPaymentMethod('usdt')}
                  >
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={paymentMethod === 'usdt'}
                        className="mt-1"
                        readOnly
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-kuntur-dark">USDT TRC20</h4>
                        <p className="text-sm text-kuntur-gray mt-1">
                          Envía USDT a nuestra dirección TRC20
                        </p>
                        <div className="mt-3">
                          <img
                            src="/qr-usdt.png"
                            alt="QR USDT"
                            className="w-32 h-32 border border-kuntur-gray/20 rounded-lg"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Botón de Subir Comprobante */}
                <div className="border-t border-kuntur-gray/20 pt-6">
                  <Button
                    className="w-full bg-kuntur-blue hover:bg-kuntur-blue/90 text-white"
                    disabled={order.payment_status === 'paid'}
                  >
                    {order.payment_status === 'paid' ? 'Pagado' : 'Subir Comprobante'}
                  </Button>
                  {order.payment_status === 'paid' && (
                    <p className="text-center text-sm text-green-600 mt-2">
                      ✅ Esta orden ya ha sido pagada
                    </p>
                  )}
                </div>

                {/* Instrucciones */}
                <div className="bg-kuntur-cream/50 p-4 rounded-lg">
                  <h4 className="font-semibold text-kuntur-dark mb-2">Instrucciones:</h4>
                  <ol className="text-sm text-kuntur-gray space-y-1 list-decimal list-inside">
                    <li>Seleccioná tu método de pago preferido</li>
                    <li>Escanea el código QR correspondiente</li>
                    <li>Realiza el pago por el monto total</li>
                    <li>Subí el comprobante de pago aquí mismo</li>
                    <li>Recibirás confirmación por email</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Botón de regreso */}
        <div className="mt-8 text-center">
          <Button
            variant="outline"
            asChild
            className="border-kuntur-blue text-kuntur-blue hover:bg-kuntur-blue hover:text-white"
          >
            <a href="/configurar">← Volver al configurador</a>
          </Button>
        </div>
      </div>
    </main>
  );
}