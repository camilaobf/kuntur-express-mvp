import { z } from 'zod';
import { PaymentMethod, OrderSource, UUID, JSONB } from '@/lib/types/database';

// ============================================
// SCHEMAS BASE
// ============================================

/**
 * Validador de UUID estándar
 */
const uuidSchema = z.string().uuid({
  message: 'UUID inválido'
});

/**
 * Validador de email con formato estricto
 */
const emailSchema = z.string()
  .email({
    message: 'Email inválido'
  })
  .max(200, {
    message: 'Email demasiado largo (máximo 200 caracteres)'
  })
  .toLowerCase()
  .trim();

/**
 * Validador de teléfono (formato boliviano)
 */
const phoneSchema = z.string()
  .optional()
  .refine((phone) => {
    if (!phone) return true; // Optional field
    // Validar formatos bolivianos: +591XXXXXXX, 591XXXXXXX, XXXXXXX
    const bolivianPhoneRegex = /^(\+?591)?[6-7]\d{7}$/;
    return bolivianPhoneRegex.test(phone.replace(/\s/g, ''));
  }, {
    message: 'Teléfono inválido. Formato esperado: +591XXXXXXX o XXXXXXX'
  })
  .transform(phone => phone?.replace(/\s/g, '') || null);

/**
 * Validador de nombres y apellidos
 */
const nameSchema = z.string()
  .min(2, {
    message: 'Debe tener al menos 2 caracteres'
  })
  .max(200, {
    message: 'Máximo 200 caracteres'
  })
  .trim()
  .transform(name => name.replace(/\s+/g, ' ')); // Normalizar espacios

/**
 * Validador de nombre de negocio/empresa
 */
const businessNameSchema = z.string()
  .max(200, {
    message: 'Máximo 200 caracteres'
  })
  .trim()
  .transform(name => name?.replace(/\s+/g, ' ') || null)
  .optional();

// ============================================
// SCHEMAS DE ROLES
// ============================================

/**
 * Schema para un rol individual en la orden
 */
const roleSelectionSchema = z.object({
  id: uuidSchema,
  slug: z.string().min(1, 'Slug requerido').max(50, 'Slug demasiado largo'),
  name: z.string().min(1, 'Nombre requerido').max(100, 'Nombre demasiado largo'),
  price_usdt: z.number()
    .positive('Precio debe ser positivo')
    .max(10000, 'Precio demasiado alto')
    .multipleOf(0.01, 'Precio debe tener máximo 2 decimales')
});

/**
 * Array de roles seleccionados (entre 1 y 6)
 */
const rolesSelectedSchema = z.array(roleSelectionSchema)
  .min(1, 'Debe seleccionar al menos un rol')
  .max(6, 'Máximo 6 roles permitidos');

// ============================================
// SCHEMAS DE HOSTING
// ============================================

/**
 * ID de plan de hosting (opcional)
 */
const hostingPlanIdSchema = uuidSchema
  .nullable()
  .optional();

/**
 * Período de hosting (anual o mensual)
 */
const hostingIsAnnualSchema = z.boolean()
  .default(false);

// ============================================
// SCHEMAS DE DESCUENTOS
// ============================================

/**
 * Código de descuento (opcional)
 */
const discountCodeSchema = z.string()
  .max(20, 'Código demasiado largo')
  .toUpperCase()
  .trim()
  .transform(code => code || null)
  .optional();

/**
 * UTM parameters (opcional)
 */
const utmParamsSchema = z.record(z.string(), z.any())
  .optional()
  .nullable();

// ============================================
// SCHEMA DE CREACIÓN DE ORDEN
// ============================================

/**
 * Schema completo para crear una orden
 */
export const createOrderSchema = z.object({
  // Información del cliente
  client_name: nameSchema,
  client_email: emailSchema,
  client_phone: phoneSchema,
  client_business: businessNameSchema,
  
  // Configuración de productos
  roles_selected: rolesSelectedSchema,
  hosting_plan_id: hostingPlanIdSchema,
  hosting_is_annual: hostingIsAnnualSchema,
  
  // Descuentos y promociones
  discount_code: discountCodeSchema,
  
  // Metadata
  source: z.enum(['web', 'whatsapp', 'instagram', 'facebook', 'referral'] as const)
    .optional()
    .default('web'),
  utm_params: utmParamsSchema
})
.refine((data) => {
  // Validar lógica de negocio
  const cantidadRoles = data.roles_selected.length;
  const tieneHosting = !!data.hosting_plan_id;
  
  // Si tiene 2-3 roles, no permite Starter
  // Si tiene 4+ roles, solo permite Premium
  // Esta validación se puede hacer después en el endpoint con la DB
  
  return true;
}, {
  message: 'Configuración no válida',
  path: ['roles_selected']
});

// ============================================
// SCHEMAS DE ACTUALIZACIÓN DE ORDEN
// ============================================

/**
 * Schema para actualizar estado de pago
 */
export const updatePaymentStatusSchema = z.object({
  payment_status: z.enum(['pending', 'paid', 'failed', 'refunded'] as const),
  payment_method: z.enum(['bank_bob', 'usdt_trc20'] as const).optional(),
  comprobante_url: z.string().url('URL inválida').optional(),
  paid_at: z.string().datetime().optional()
});

/**
 * Schema para subir comprobante
 */
export const uploadComprobanteSchema = z.object({
  comprobante_url: z.string().url({
    message: 'URL del comprobante inválida'
  }),
  payment_method: z.enum(['bank_bob', 'usdt_trc20'] as const, {
    message: 'Método de pago inválido'
  })
});

// ============================================
// SCHEMAS DE QUERY PARAMS
// ============================================

/**
 * Schema para parámetros de orden
 */
export const orderQuerySchema = z.object({
  status: z.enum(['pending', 'paid', 'failed', 'refunded'] as const).optional(),
  source: z.enum(['web', 'whatsapp', 'instagram', 'facebook', 'referral'] as const).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
  order_by: z.enum(['created_at', 'total_usdt', 'client_name']).default('created_at'),
  order_dir: z.enum(['asc', 'desc']).default('desc')
});

/**
 * Schema para búsqueda de órdenes
 */
export const searchOrdersSchema = z.object({
  q: z.string().min(1, 'Término de búsqueda requerido').max(100),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  offset: z.coerce.number().int().min(0).default(0)
});

// ============================================
// SCHEMAS DE VALIDACIÓN DE NEGOCIO
// ============================================

/**
 * Validación de compatibilidad hosting-plan
 */
export const hostingCompatibilitySchema = z.object({
  hosting_plan_slug: z.string().optional(),
  cantidad_roles: z.number().int().min(1).max(6)
})
.refine((data) => {
  if (!data.hosting_plan_slug) return true;
  
  // Si 1 rol → permite todos los planes
  if (data.cantidad_roles === 1) return true;
  
  // Si 2-3 roles → Crecimiento o Premium
  if (data.cantidad_roles >= 2 && data.cantidad_roles <= 3) {
    return !['starter'].includes(data.hosting_plan_slug);
  }
  
  // Si 4+ roles → Solo Premium
  if (data.cantidad_roles >= 4) {
    return data.hosting_plan_slug === 'premium';
  }
  
  return true;
}, {
  message: 'El plan de hosting no es compatible con la cantidad de roles seleccionados',
  path: ['hosting_plan_slug']
});

// ============================================
// SCHEMAS DE DESCUENTOS
// ============================================

/**
 * Schema para validar código HOY5
 */
export const hoy5DiscountSchema = z.object({
  code: z.literal('HOY5', {
    message: 'Código HOY5 inválido'
  }),
  fecha_actual: z.string().datetime()
})
.refine((data) => {
  const fecha = new Date(data.fecha_actual);
  const tomorrow = new Date(fecha);
  tomorrow.setDate(fecha.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  return new Date() < tomorrow;
}, {
  message: 'El código HOY5 ha expirado',
  path: ['code']
});

/**
 * Schema para descuentos personalizados
 */
export const customDiscountSchema = z.object({
  code: z.string().min(1, 'Código requerido').max(20),
  percentage: z.number()
    .min(0.01, 'Descuento mínimo 1%')
    .max(0.40, 'Descuento máximo 40%')
    .multipleOf(0.01, 'Solo 2 decimales'),
  max_uses: z.number().int().min(1).optional(),
  valid_until: z.string().datetime()
});

// ============================================
// TIPOS EXPORTADOS
// ============================================

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdatePaymentStatusInput = z.infer<typeof updatePaymentStatusSchema>;
export type UploadComprobanteInput = z.infer<typeof uploadComprobanteSchema>;
export type OrderQueryInput = z.infer<typeof orderQuerySchema>;
export type SearchOrdersInput = z.infer<typeof searchOrdersSchema>;
export type HostingCompatibilityInput = z.infer<typeof hostingCompatibilitySchema>;
export type Hoy5DiscountInput = z.infer<typeof hoy5DiscountSchema>;
export type CustomDiscountInput = z.infer<typeof customDiscountSchema>;

// ============================================
// FUNCIONES HELPER
// ============================================

/**
 * Valida y sanitiza email
 */
export function validateEmail(email: unknown): string {
  return emailSchema.parse(email);
}

/**
 * Valida y sanitiza teléfono boliviano
 */
export function validatePhone(phone: unknown): string | null {
  return phoneSchema.parse(phone);
}

/**
 * Valida UUID
 */
export function validateUUID(uuid: unknown): string {
  return uuidSchema.parse(uuid);
}

/**
 * Valida objeto completo con schema
 */
export function validateWithSchema<T>(schema: z.ZodSchema<T>, data: unknown): T {
  return schema.parse(data);
}

/**
 * Valida objeto de forma segura (lanza errores específicos)
 */
export function safeValidate<T>(
  schema: z.ZodSchema<T>, 
  data: unknown
): { success: true; data: T } | { success: false; errors: z.ZodIssue[] } {
  const result = schema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  } else {
    return { success: false, errors: result.error.issues };
  }
}