import { NextRequest, NextResponse } from 'next/server';
import { supabaseClient, handleSupabaseError } from '@/lib/supabase';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { validateUUID } from '@/lib/validations';

/**
 * POST /api/orders/upload-comprobante
 *
 * Sube el comprobante de pago de una orden a Supabase Storage
 * o localmente si Supabase no está configurado
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    console.log('📤 Iniciando upload de comprobante...');

    // 1. Parsear FormData
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const orderId = formData.get('orderId') as string;
    const paymentMethod = formData.get('paymentMethod') as string;

    // 2. Validar datos obligatorios
    if (!file) {
      console.log('❌ No se proporcionó archivo');
      return NextResponse.json(
        { success: false, error: 'No se proporcionó archivo' },
        { status: 400 }
      );
    }

    if (!orderId || !validateUUID(orderId)) {
      console.log('❌ ID de orden inválido:', orderId);
      return NextResponse.json(
        { success: false, error: 'ID de orden inválido' },
        { status: 400 }
      );
    }

    if (!paymentMethod || !['transfer', 'usdt'].includes(paymentMethod)) {
      console.log('❌ Método de pago inválido:', paymentMethod);
      return NextResponse.json(
        { success: false, error: 'Método de pago inválido' },
        { status: 400 }
      );
    }

    // 3. Validar archivo
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      console.log('❌ Tipo de archivo no válido:', file.type);
      return NextResponse.json(
        { success: false, error: 'Tipo de archivo no válido. Solo se permiten JPG, PNG, WEBP y PDF' },
        { status: 400 }
      );
    }

    if (file.size > maxSize) {
      console.log('❌ Archivo demasiado grande:', file.size);
      return NextResponse.json(
        { success: false, error: 'El archivo es muy grande. Máximo permitido: 5MB' },
        { status: 400 }
      );
    }

    // 4. Verificar que la orden exista
    console.log(`🔍 Buscando orden: ${orderId}`);
    const { data: order, error: orderError } = await supabaseClient
      .from('orders')
      .select('id, order_number, payment_status')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      console.log('❌ Orden no encontrada:', orderId);
      return NextResponse.json(
        { success: false, error: 'Orden no encontrada' },
        { status: 404 }
      );
    }

    if (order.payment_status === 'paid') {
      console.log('❌ Orden ya está pagada:', orderId);
      return NextResponse.json(
        { success: false, error: 'Esta orden ya ha sido pagada' },
        { status: 400 }
      );
    }

    // 5. Determinar si usamos Supabase Storage o almacenamiento local
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const useSupabase = supabaseUrl && supabaseServiceKey;

    let comprobanteUrl: string;

    if (useSupabase) {
      // 5a. Subir a Supabase Storage
      console.log('☁️ Subiendo a Supabase Storage...');
      comprobanteUrl = await uploadToSupabase(file, orderId);
    } else {
      // 5b. Guardar localmente (fallback para desarrollo)
      console.log('💾 Guardando localmente (fallback)...');
      comprobanteUrl = await uploadLocally(file, orderId);
    }

    // 6. Actualizar orden con la URL del comprobante
    console.log('🔄 Actualizando orden con comprobante...');
    const { error: updateError } = await supabaseClient
      .from('orders')
      .update({
        payment_status: 'paid',
        payment_method: paymentMethod === 'transfer' ? 'bank_bob' : 'usdt_trc20',
        comprobante_url: comprobanteUrl,
        comprobante_uploaded_at: new Date().toISOString(),
        paid_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId);

    if (updateError) {
      console.log('❌ Error actualizando orden:', updateError);
      return NextResponse.json(
        { success: false, error: 'Error actualizando la orden' },
        { status: 500 }
      );
    }

    // 7. Registrar interacción
    await supabaseClient
      .from('order_interactions')
      .insert({
        order_id: orderId,
        type: 'payment_received',
        description: 'Comprobante de pago subido exitosamente',
        metadata: {
          payment_method: paymentMethod,
          comprobante_url: comprobanteUrl,
          file_name: file.name,
          file_size: file.size,
          file_type: file.type,
          upload_method: useSupabase ? 'supabase_storage' : 'local_storage'
        }
      });

    console.log(`✅ Comprobante subido exitosamente para orden ${order.order_number}`);

    return NextResponse.json({
      success: true,
      data: {
        url: comprobanteUrl,
        order_number: order.order_number,
        payment_status: 'paid'
      }
    });

  } catch (error) {
    console.error('💥 Error subiendo comprobante:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Error interno del servidor'
      },
      { status: 500 }
    );
  }
}

/**
 * Sube archivo a Supabase Storage
 */
async function uploadToSupabase(file: File, orderId: string): Promise<string> {
  try {
    // Generar nombre de archivo único
    const timestamp = Date.now();
    const extension = file.name.split('.').pop();
    const fileName = `${orderId}-${timestamp}.${extension}`;
    const filePath = `comprobantes/${fileName}`;

    console.log(`📁 Subiendo archivo: ${filePath}`);

    // Subir a Supabase Storage
    const { data, error } = await supabaseClient.storage
      .from('comprobantes')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('❌ Error subiendo a Supabase Storage:', error);
      throw new Error(`Error subiendo a Supabase Storage: ${error.message}`);
    }

    // Obtener URL pública
    const { data: urlData } = supabaseClient.storage
      .from('comprobantes')
      .getPublicUrl(filePath);

    console.log(`✅ Archivo subido a Supabase: ${urlData.publicUrl}`);
    return urlData.publicUrl;

  } catch (error) {
    console.error('❌ Error en uploadToSupabase:', error);
    throw error;
  }
}

/**
 * Guarda archivo localmente (fallback para desarrollo)
 */
async function uploadLocally(file: File, orderId: string): Promise<string> {
  try {
    // Crear directorio local si no existe
    const localDir = join(process.cwd(), 'public', 'comprobantes');
    await mkdir(localDir, { recursive: true });

    // Generar nombre de archivo único
    const timestamp = Date.now();
    const extension = file.name.split('.').pop();
    const fileName = `${orderId}-${timestamp}.${extension}`;
    const filePath = join(localDir, fileName);

    console.log(`💾 Guardando archivo localmente: ${filePath}`);

    // Convertir File a Buffer y guardar
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await writeFile(filePath, buffer);

    // Retornar URL relativa para acceso público
    const publicUrl = `/comprobantes/${fileName}`;
    console.log(`✅ Archivo guardado localmente: ${publicUrl}`);

    return publicUrl;

  } catch (error) {
    console.error('❌ Error en uploadLocally:', error);
    throw new Error(`Error guardando archivo localmente: ${error instanceof Error ? error.message : 'Error desconocido'}`);
  }
}

/**
 * OPTIONS /api/orders/upload-comprobante
 *
 * Soporte para CORS
 */
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