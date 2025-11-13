import { NextRequest, NextResponse } from 'next/server';
import { supabaseClient, executeSupabaseOperation, handleSupabaseError } from '@/lib/supabase';
import { validateUUID } from '@/lib/validations';
import { GetOrderResponse, OrderWithHosting, OrderInteraction } from '@/lib/types/database';

// ============================================
// ENDPOINT: GET /api/orders/[id]
// ============================================

/**
 * Obtiene una orden específica por su ID
 * 
 * Devuelve la información completa de la orden incluyendo:
 * - Datos del cliente y configuración
 * - Detalles del plan de hosting (si aplica)
 * - Información de pago
 * - Todas las interacciones asociadas
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<GetOrderResponse>> {
  try {
    const orderId = params.id;
    
    console.log(`🔍 Buscando orden: ${orderId}`);
    
    // 1. Validar que el ID sea un UUID válido
    if (!orderId || !validateUUID(orderId)) {
      console.log('❌ ID de orden inválido:', orderId);
      return NextResponse.json(
        { 
          success: false, 
          error: 'ID de orden inválido' 
        },
        { status: 400 }
      );
    }

    // 2. Obtener la orden con JOIN a hosting_plans
    console.log('📋 Obteniendo datos de la orden...');
    
    const { data: order, error: orderError } = await supabaseClient
      .from('orders')
      .select(`
        *,
        hosting_plan:hosting_plans (
          id,
          slug,
          name,
          monthly_price,
          annual_price,
          discount_annual,
          conversations_limit,
          features,
          is_active
        )
      `)
      .eq('id', orderId)
      .single();

    if (orderError) {
      if (orderError.code === 'PGRST116') {
        console.log('❌ Orden no encontrada:', orderId);
        return NextResponse.json(
          { 
            success: false, 
            error: 'Orden no encontrada' 
          },
          { status: 404 }
        );
      }
      handleSupabaseError(orderError);
    }

    if (!order) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Orden no encontrada' 
        },
        { status: 404 }
      );
    }

    console.log('✅ Orden encontrada:', order.order_number);

    // 3. Obtener interacciones de la orden
    console.log('📝 Obteniendo interacciones de la orden...');
    
    const { data: interactions, error: interactionsError } = await supabaseClient
      .from('order_interactions')
      .select('*')
      .eq('order_id', orderId)
      .order('created_at', { ascending: true });

    if (interactionsError) {
      console.log('⚠️ Error obteniendo interacciones:', interactionsError);
      // No fallamos el request si hay error en las interacciones
      interactions = [];
    }

    // 4. Estructurar respuesta
    console.log('🏗️ Estructurando respuesta...');
    
    const orderWithHosting: OrderWithHosting = {
      ...order,
      hosting_plan: order.hosting_plan as any || null,
      interactions: interactions || []
    };

    // 5. Sanitizar datos sensibles (si aplica)
    const sanitizedOrder = sanitizeOrderData(orderWithHosting);

    console.log(`🎉 Orden ${order.order_number} recuperada exitosamente`);

    return NextResponse.json({
      success: true,
      data: sanitizedOrder
    }, { status: 200 });

  } catch (error) {
    console.error('💥 Error inesperado obteniendo orden:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error interno del servidor' 
      },
      { status: 500 }
    );
  }
}

// ============================================
// ENDPOINT: PATCH /api/orders/[id] (actualización de estado)
// ============================================

/**
 * Actualiza el estado de pago de una orden
 * Usado principalmente para marcar como pagada después de validar comprobante
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const orderId = params.id;
    
    console.log(`🔄 Actualizando orden: ${orderId}`);
    
    // 1. Validar UUID
    if (!orderId || !validateUUID(orderId)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'ID de orden inválido' 
        },
        { status: 400 }
      );
    }

    // 2. Parsear body
    const body = await request.json();
    const { payment_status, payment_method, comprobante_url, paid_at } = body;

    // 3. Validar campos requeridos
    if (!payment_status) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'payment_status es requerido' 
        },
        { status: 400 }
      );
    }

    // 4. Validar valores permitidos
    const validStatuses = ['pending', 'paid', 'failed', 'refunded'];
    if (!validStatuses.includes(payment_status)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'payment_status inválido' 
        },
        { status: 400 }
      );
    }

    // 5. Preparar datos de actualización
    const updateData: any = {
      payment_status,
      updated_at: new Date().toISOString()
    };

    if (payment_method) {
      const validMethods = ['bank_bob', 'usdt_trc20'];
      if (!validMethods.includes(payment_method)) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'payment_method inválido' 
          },
          { status: 400 }
        );
      }
      updateData.payment_method = payment_method;
    }

    if (comprobante_url) {
      try {
        new URL(comprobante_url);
        updateData.comprobante_url = comprobante_url;
        updateData.comprobante_uploaded_at = new Date().toISOString();
      } catch {
        return NextResponse.json(
          { 
            success: false, 
            error: 'comprobante_url inválido' 
          },
          { status: 400 }
        );
      }
    }

    if (paid_at) {
      updateData.paid_at = paid_at;
    } else if (payment_status === 'paid') {
      updateData.paid_at = new Date().toISOString();
    }

    // 6. Actualizar orden
    console.log('💾 Actualizando orden en la base de datos...');
    
    const { data: updatedOrder, error: updateError } = await supabaseClient
      .from('orders')
      .update(updateData)
      .eq('id', orderId)
      .select('id, order_number, payment_status, payment_method, paid_at')
      .single();

    if (updateError) {
      if (updateError.code === 'PGRST116') {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Orden no encontrada' 
          },
          { status: 404 }
        );
      }
      handleSupabaseError(updateError);
    }

    // 7. Registrar interacción
    console.log('📝 Registrando interacción de actualización...');
    
    const interactionType = payment_status === 'paid' ? 'payment_confirmed' : 
                          payment_status === 'failed' ? 'payment_failed' : 
                          'status_updated';
    
    await supabaseClient
      .from('order_interactions')
      .insert({
        order_id: orderId,
        type: interactionType,
        description: `Estado actualizado a: ${payment_status}`,
        metadata: {
          previous_status: 'pending', // Esto podría obtenerse de la DB si fuera necesario
          new_status: payment_status,
          payment_method,
          has_comprobante: !!comprobante_url,
          updated_by: 'api_patch'
        }
      });

    console.log(`✅ Orden ${updatedOrder.order_number} actualizada exitosamente`);

    return NextResponse.json({
      success: true,
      data: updatedOrder
    }, { status: 200 });

  } catch (error) {
    console.error('💥 Error actualizando orden:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error interno del servidor' 
      },
      { status: 500 }
    );
  }
}

// ============================================
// ENDPOINT: DELETE /api/orders/[id] (eliminar/cancelar)
// ============================================

/**
 * Cancela o elimina una orden
 * Solo permite cancelar órdenes en estado 'pending'
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const orderId = params.id;
    
    console.log(`🗑️ Cancelando orden: ${orderId}`);
    
    // 1. Validar UUID
    if (!orderId || !validateUUID(orderId)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'ID de orden inválido' 
        },
        { status: 400 }
      );
    }

    // 2. Verificar que la orden exista y esté en estado pendiente
    const { data: order, error: orderError } = await supabaseClient
      .from('orders')
      .select('id, order_number, payment_status')
      .eq('id', orderId)
      .single();

    if (orderError) {
      if (orderError.code === 'PGRST116') {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Orden no encontrada' 
          },
          { status: 404 }
        );
      }
      handleSupabaseError(orderError);
    }

    if (order.payment_status !== 'pending') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Solo se pueden cancelar órdenes en estado pendiente' 
        },
        { status: 400 }
      );
    }

    // 3. Marcar como cancelada (soft delete)
    const { error: cancelError } = await supabaseClient
      .from('orders')
      .update({ 
        payment_status: 'refunded',
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId);

    if (cancelError) {
      handleSupabaseError(cancelError);
    }

    // 4. Registrar interacción
    await supabaseClient
      .from('order_interactions')
      .insert({
        order_id: orderId,
        type: 'order_cancelled',
        description: 'Orden cancelada por el cliente',
        metadata: {
          cancelled_at: new Date().toISOString(),
          previous_status: 'pending',
          new_status: 'refunded'
        }
      });

    console.log(`✅ Orden ${order.order_number} cancelada exitosamente`);

    return NextResponse.json({
      success: true,
      data: {
        id: orderId,
        order_number: order.order_number,
        status: 'cancelled'
      }
    }, { status: 200 });

  } catch (error) {
    console.error('💥 Error cancelando orden:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error interno del servidor' 
      },
      { status: 500 }
    );
  }
}

// ============================================
// FUNCIONES HELPER
// ============================================

/**
 * Sanitiza datos sensibles de la orden antes de devolverlos
 */
function sanitizeOrderData(order: OrderWithHosting): OrderWithHosting {
  return {
    ...order,
    // Si hay datos sensibles en el futuro, removerlos aquí
    // Por ahora, todos los datos son seguros de mostrar
  };
}

// ============================================
// MÉTODO: OPTIONS (para CORS)
// ============================================

export async function OPTIONS(): Promise<NextResponse> {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}