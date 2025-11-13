import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabaseClient, executeSupabaseOperation, handleSupabaseError } from '@/lib/supabase';
import { 
  createOrderSchema, 
  CreateOrderInput,
  validateWithSchema,
  safeValidate 
} from '@/lib/validations';
import { 
  calcularPrecioTotal, 
  validarHostingPlan,
  convertirUSDTaBOB,
  esCodigoHOY5Valido,
  resumirOrden 
} from '@/lib/pricing';
import { 
  CreateOrderResponse, 
  RoleKuntur, 
  HostingPlan, 
  DailyDiscount,
  Order,
  OrderInteraction 
} from '@/lib/types/database';

// ============================================
// TIPO DE RESPUESTA
// ============================================

interface OrderCreationResult {
  order_id: string;
  order_number: string;
  total_usdt: number;
  total_bob: number;
  exchange_rate: number;
  pricing_details: any;
}

// ============================================
// ENDPOINT: POST /api/orders/create
// ============================================

/**
 * Crea una nueva orden en el sistema
 * 
 * Flujo completo:
 * 1. Validar datos de entrada
 * 2. Obtener tasa de cambio USDT/BOB
 * 3. Obtener información de roles y hosting de la DB
 * 4. Calcular precios con descuentos
 * 5. Insertar orden en la BD
 * 6. Registrar interacción inicial
 * 7. Retornar resultado
 */
export async function POST(request: NextRequest): Promise<NextResponse<CreateOrderResponse>> {
  try {
    console.log('🛒 Iniciando creación de orden...');
    
    // 1. Parsear y validar request body
    let body: CreateOrderInput;
    try {
      const rawBody = await request.json();
      console.log('📝 Body recibido:', JSON.stringify(rawBody, null, 2));
      
      const validation = safeValidate(createOrderSchema, rawBody);
      if (!validation.success) {
        console.log('❌ Error de validación:', validation.errors);
        return NextResponse.json(
          { 
            success: false, 
            error: 'Datos inválidos',
            details: validation.errors.map(e => `${e.path.join('.')}: ${e.message}`)
          },
          { status: 400 }
        );
      }
      
      body = validation.data;
    } catch (error) {
      console.log('❌ Error parseando JSON:', error);
      return NextResponse.json(
        { 
          success: false, 
          error: 'JSON inválido o mal formado' 
        },
        { status: 400 }
      );
    }

    const { roles_selected, hosting_plan_id, hosting_is_annual, discount_code } = body;

    // 2. Obtener tasa de cambio USDT/BOB
    console.log('💱 Obteniendo tasa de cambio USDT/BOB...');
    let exchangeRate = 10.7; // Default fallback
    let rateSource = 'fallback';
    
    try {
      const rateResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || ''}/api/rate/usdt-bob`, {
        headers: { 'Cache-Control': 'no-cache' }
      });
      
      if (rateResponse.ok) {
        const rateData = await rateResponse.json();
        exchangeRate = rateData.rate;
        rateSource = rateData.source;
        console.log(`💰 Tasa obtenida: ${exchangeRate} (${rateSource})`);
      } else {
        console.log('⚠️ Error obteniendo tasa, usando fallback');
      }
    } catch (error) {
      console.log('⚠️ Error de red obteniendo tasa, usando fallback:', error);
    }

    // 3. Obtener información de roles de la base de datos
    console.log('🔍 Verificando roles en la base de datos...');
    const roleIds = roles_selected.map(r => r.id);
    
    const { data: dbRoles, error: rolesError } = await supabaseClient
      .from('roles_kuntur')
      .select('*')
      .in('id', roleIds)
      .eq('is_active', true);

    if (rolesError) {
      handleSupabaseError(rolesError);
    }

    if (!dbRoles || dbRoles.length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'No se encontraron los roles seleccionados' 
        },
        { status: 400 }
      );
    }

    // Verificar que todos los roles existan
    if (dbRoles.length !== roles_selected.length) {
      const foundIds = dbRoles.map(r => r.id);
      const missingIds = roleIds.filter(id => !foundIds.includes(id));
      console.log('❌ Roles no encontrados:', missingIds);
      
      return NextResponse.json(
        { 
          success: false, 
          error: 'Algunos roles seleccionados no existen o no están activos',
          missing: missingIds
        },
        { status: 400 }
      );
    }

    // 4. Obtener información del hosting plan (si aplica)
    let hostingPlan: HostingPlan | null = null;
    if (hosting_plan_id) {
      console.log('🏠 Verificando plan de hosting...');
      
      const { data: dbHosting, error: hostingError } = await supabaseClient
        .from('hosting_plans')
        .select('*')
        .eq('id', hosting_plan_id)
        .eq('is_active', true)
        .single();

      if (hostingError) {
        if (hostingError.code === 'PGRST116') {
          return NextResponse.json(
            { 
              success: false, 
              error: 'Plan de hosting no encontrado' 
            },
            { status: 400 }
          );
        }
        handleSupabaseError(hostingError);
      }

      hostingPlan = dbHosting;

      // Validar compatibilidad hosting-plan
      const compatibilidad = validarHostingPlan(hostingPlan, roles_selected.length);
      if (!compatibilidad.valido) {
        return NextResponse.json(
          { 
            success: false, 
            error: compatibilidad.razon || 'Plan de hosting incompatible' 
          },
          { status: 400 }
        );
      }
    }

    // 5. Validar códigos de descuento
    let codigoHOY5Valido = false;
    let codigoDescuento: DailyDiscount | null = null;

    if (discount_code) {
      console.log('🎫 Validando código de descuento:', discount_code);
      
      if (discount_code.toUpperCase() === 'HOY5') {
        codigoHOY5Valido = esCodigoHOY5Valido();
        if (!codigoHOY5Valido) {
          return NextResponse.json(
            { 
              success: false, 
              error: 'El código HOY5 ha expirado' 
            },
            { status: 400 }
          );
        }
      } else {
        // Buscar código personalizado
        const { data: dbDiscount, error: discountError } = await supabaseClient
          .from('daily_discounts')
          .select('*')
          .eq('code', discount_code.toUpperCase())
          .eq('is_active', true)
          .gte('valid_until', new Date().toISOString())
          .single();

        if (discountError && discountError.code !== 'PGRST116') {
          handleSupabaseError(discountError);
        }

        if (dbDiscount) {
          // Verificar límite de usos
          if (dbDiscount.max_uses && dbDiscount.times_used >= dbDiscount.max_uses) {
            return NextResponse.json(
              { 
                success: false, 
                error: 'Código de descuento ya agotado' 
              },
              { status: 400 }
            );
          }
          
          codigoDescuento = dbDiscount;
        } else {
          return NextResponse.json(
            { 
              success: false, 
              error: 'Código de descuento inválido o expirado' 
            },
            { status: 400 }
          );
        }
      }
    }

    // 6. Calcular precios
    console.log('🧮 Calculando precios...');
    const pricing = calcularPrecioTotal(
      dbRoles as RoleKuntur[],
      hostingPlan,
      hosting_is_annual || false,
      codigoHOY5Valido,
      codigoDescuento
    );

    const totalBOB = convertirUSDTaBOB(pricing.total_usdt, exchangeRate);

    console.log('💰 Resumen de cálculo:', {
      subtotal: pricing.subtotal,
      descuento_total: `${Math.round(pricing.descuento_total * 100)}%`,
      total_usdt: pricing.total_usdt,
      total_bob: totalBOB,
      ahorro: pricing.ahorro
    });

    // 7. Generar número de orden
    console.log('🔢 Generando número de orden...');
    const { data: orderNumberResult, error: orderNumberError } = await supabaseClient
      .rpc('generate_order_number');

    if (orderNumberError) {
      handleSupabaseError(orderNumberError);
    }

    const orderNumber = orderNumberResult;
    console.log('📋 Número de orden generado:', orderNumber);

    // 8. Insertar orden en la base de datos
    console.log('💾 Insertando orden en la base de datos...');
    const orderData = {
      order_number: orderNumber,
      
      // Cliente
      client_name: body.client_name,
      client_email: body.client_email,
      client_phone: body.client_phone || null,
      client_business: body.client_business || null,
      
      // Configuración
      roles_selected: roles_selected,
      hosting_plan_id: hosting_plan_id || null,
      hosting_is_annual: hosting_is_annual || false,
      
      // Pricing
      subtotal_usdt: pricing.subtotal,
      discount_total: pricing.descuento_total,
      total_usdt: pricing.total_usdt,
      exchange_rate: exchangeRate,
      total_bob: totalBOB,
      
      // Estado inicial
      payment_status: 'pending' as const,
      payment_method: null,
      comprobante_url: null,
      comprobante_uploaded_at: null,
      paid_at: null,
      
      // Metadata
      source: body.source || 'web',
      utm_params: body.utm_params || null
    };

    const { data: createdOrder, error: insertError } = await supabaseClient
      .from('orders')
      .insert(orderData)
      .select('id, order_number, total_usdt, total_bob, exchange_rate')
      .single();

    if (insertError) {
      console.error('❌ Error insertando orden:', insertError);
      handleSupabaseError(insertError);
    }

    console.log('✅ Orden creada exitosamente:', createdOrder.id);

    // 9. Actualizar usos del código de descuento (si aplica)
    if (codigoDescuento) {
      console.log('🔄 Actualizando usos del código de descuento...');
      await supabaseClient
        .from('daily_discounts')
        .update({ times_used: codigoDescuento.times_used + 1 })
        .eq('id', codigoDescuento.id);
    }

    // 10. Insertar interacción inicial
    console.log('📝 Registrando interacción inicial...');
    const interactionData = {
      order_id: createdOrder.id,
      type: 'order_created',
      description: 'Orden creada exitosamente via web',
      metadata: {
        roles_count: roles_selected.length,
        has_hosting: !!hosting_plan_id,
        hosting_annual: hosting_is_annual,
        has_discount: !!(codigoHOY5Valido || codigoDescuento),
        discount_code: discount_code || null,
        source: body.source || 'web',
        pricing_summary: resumirOrden(
          dbRoles as RoleKuntur[],
          hostingPlan,
          hosting_is_annual || false,
          pricing,
          exchangeRate
        )
      }
    };

    await supabaseClient
      .from('order_interactions')
      .insert(interactionData);

    // 11. Preparar respuesta
    const result: OrderCreationResult = {
      order_id: createdOrder.id,
      order_number: createdOrder.order_number,
      total_usdt: createdOrder.total_usdt,
      total_bob: createdOrder.total_bob,
      exchange_rate: createdOrder.exchange_rate,
      pricing_details: {
        subtotal: pricing.subtotal,
        subtotal_roles: pricing.subtotal_roles,
        subtotal_hosting: pricing.subtotal_hosting,
        discount_percentage: Math.round(pricing.descuento_total * 100),
        discount_amount: pricing.ahorro,
        descuentos_aplicados: {
          roles: Math.round(pricing.descuento_roles * 100),
          hosting: Math.round(pricing.descuento_hosting * 100),
          hoy5: codigoHOY5Valido ? 5 : 0,
          extra: codigoDescuento ? Math.round(codigoDescuento.percentage * 100) : 0
        }
      }
    };

    console.log('🎉 Orden completada exitosamente');
    
    return NextResponse.json({
      success: true,
      data: result
    }, { status: 201 });

  } catch (error) {
    console.error('💥 Error inesperado creando orden:', error);
    
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
// MÉTODO: OPTIONS (para CORS)
// ============================================

export async function OPTIONS(): Promise<NextResponse> {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

// ============================================
// MÉTODO: GET (no permitido)
// ============================================

export async function GET(): Promise<NextResponse> {
  return NextResponse.json(
    { 
      success: false, 
      error: 'Método no permitido. Usa POST para crear órdenes' 
    },
    { status: 405 }
  );
}