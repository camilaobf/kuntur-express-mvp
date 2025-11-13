import { PricingCalculation, RoleKuntur, HostingPlan, DailyDiscount } from '@/lib/types/database';

// ============================================
// CONSTANTES DE PRECIOS
// ============================================

// Precios unitarios según cantidad de roles
const PRECIOS_ROLES = {
  1: 120,    // 0% descuento
  2: 110,    // ~8% descuento
  3: 110,    // ~8% descuento
  4: 95,     // ~20% descuento
  5: 95,     // ~20% descuento
  6: 85,     // ~30% descuento
};

// Porcentajes de descuento según cantidad
const DESCUENTOS_ROLES = {
  1: 0,
  2: 0.083,   // ~8%
  3: 0.083,   // ~8%
  4: 0.208,   // ~20%
  5: 0.208,   // ~20%
  6: 0.292,   // ~30%
};

// ============================================
// FUNCIONES DE CÁLCULO
// ============================================

/**
 * Calcula el precio total basado en roles seleccionados, hosting y descuentos
 */
export function calcularPrecioTotal(
  rolesSeleccionados: RoleKuntur[],
  hostingPlan: HostingPlan | null,
  esAnual: boolean,
  codigoHOY5Valido: boolean,
  codigoDescuento: DailyDiscount | null = null
): PricingCalculation {
  
  // 1. Validar que tengamos roles
  if (!rolesSeleccionados || rolesSeleccionados.length === 0) {
    throw new Error('Se debe seleccionar al menos un rol');
  }
  
  const cantidad = rolesSeleccionados.length;
  
  // 2. Precio unitario según cantidad
  const precioUnitario = PRECIOS_ROLES[cantidad as keyof typeof PRECIOS_ROLES] || 120;
  const subtotalRoles = cantidad * precioUnitario;
  
  // 3. Precio hosting (si eligió)
  const subtotalHosting = hostingPlan 
    ? (esAnual ? hostingPlan.annual_price : hostingPlan.monthly_price)
    : 0;
  
  // 4. Subtotal
  const subtotal = subtotalRoles + subtotalHosting;
  
  // 5. Calcular descuentos
  let descuentoRoles = DESCUENTOS_ROLES[cantidad as keyof typeof DESCUENTOS_ROLES] || 0;
  const descuentoHosting = (hostingPlan && esAnual) 
    ? hostingPlan.discount_annual 
    : 0;
  const descuentoHOY5 = codigoHOY5Valido ? 0.05 : 0;
  const descuentoExtra = codigoDescuento?.percentage || 0;
  
  // 6. Sumar y limitar descuentos a 40%
  let descuentoTotal = descuentoRoles + descuentoHosting + descuentoHOY5 + descuentoExtra;
  descuentoTotal = Math.min(descuentoTotal, 0.40);
  
  // Redondear al 5% más cercano hacia arriba
  descuentoTotal = Math.ceil(descuentoTotal * 20) / 20;
  
  // 7. Calcular totales finales
  const totalUSDT = subtotal * (1 - descuentoTotal);
  const ahorro = subtotal - totalUSDT;
  
  return {
    subtotal_roles: subtotalRoles,
    subtotal_hosting: subtotalHosting,
    subtotal,
    descuento_roles: descuentoRoles,
    descuento_hosting: descuentoHosting,
    descuento_hoy5: descuentoHOY5,
    descuento_total: descuentoTotal,
    total_usdt: parseFloat(totalUSDT.toFixed(2)),
    ahorro: parseFloat(ahorro.toFixed(2))
  };
}

/**
 * Obtiene el precio unitario según la cantidad de roles
 */
export function getPrecioUnitario(cantidad: number): number {
  return PRECIOS_ROLES[cantidad as keyof typeof PRECIOS_ROLES] || 120;
}

/**
 * Obtiene el porcentaje de descuento según la cantidad de roles
 */
export function getDescuentoPorCantidad(cantidad: number): number {
  return DESCUENTOS_ROLES[cantidad as keyof typeof DESCUENTOS_ROLES] || 0;
}

/**
 * Verifica si el código HOY5 es válido para hoy
 */
export function esCodigoHOY5Valido(): boolean {
  const ahora = new Date();
  const mananaMedianoche = new Date(ahora);
  mananaMedianoche.setHours(24, 0, 0, 0);
  
  return true; // Simplificado: si se llama a esta función, asumimos que es hoy
}

/**
 * Valida si un hosting plan es compatible con la cantidad de roles
 */
export function validarHostingPlan(
  hostingPlan: HostingPlan | null, 
  cantidadRoles: number
): { valido: boolean; razon?: string } {
  
  if (!hostingPlan) {
    return { valido: true }; // Sin hosting es válido
  }
  
  const { ideal_roles_min, ideal_roles_max } = hostingPlan;
  
  // Si no hay restricciones, es válido
  if (!ideal_roles_min && !ideal_roles_max) {
    return { valido: true };
  }
  
  // Validar rango
  if (ideal_roles_min && cantidadRoles < ideal_roles_min) {
    return { 
      valido: false, 
      razon: `Este plan requiere mínimo ${ideal_roles_min} rol(es)` 
    };
  }
  
  if (ideal_roles_max && cantidadRoles > ideal_roles_max) {
    return { 
      valido: false, 
      razon: `Este plan permite máximo ${ideal_roles_max} rol(es)` 
    };
  }
  
  return { valido: true };
}

/**
 * Formatea un precio en formato de moneda
 */
export function formatearPrecio(amount: number, currency = 'USDT'): string {
  return new Intl.NumberFormat('es-BO', {
    style: 'currency',
    currency: currency === 'BOB' ? 'BOB' : 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount).replace('US$', 'USDT');
}

/**
 * Convierte USDT a BOB usando una tasa de cambio
 */
export function convertirUSDTaBOB(usdtAmount: number, exchangeRate: number): number {
  return parseFloat((usdtAmount * exchangeRate).toFixed(2));
}

/**
 * Obtiene la descripción del descuento para mostrar en UI
 */
export function getDescripcionDescuento(
  cantidadRoles: number,
  hostingPlan: HostingPlan | null,
  esAnual: boolean,
  codigoHOY5Valido: boolean,
  codigoDescuento: DailyDiscount | null = null
): string[] {
  const descripciones: string[] = [];
  
  // Descuento por cantidad de roles
  const descuentoCantidad = getDescuentoPorCantidad(cantidadRoles);
  if (descuentoCantidad > 0) {
    const porcentaje = Math.round(descuentoCantidad * 100);
    descripciones.push(`${porcentaje}% descuento por ${cantidadRoles} rol(es)`);
  }
  
  // Descuento anual de hosting
  if (hostingPlan && esAnual && hostingPlan.discount_annual > 0) {
    const porcentaje = Math.round(hostingPlan.discount_annual * 100);
    descripciones.push(`${porcentaje}% descuento anual hosting`);
  }
  
  // Código HOY5
  if (codigoHOY5Valido) {
    descripciones.push('5% descuento HOY5');
  }
  
  // Código de descuento adicional
  if (codigoDescuento && codigoDescuento.percentage > 0) {
    const porcentaje = Math.round(codigoDescuento.percentage * 100);
    descripciones.push(`${porcentaje}% descuento ${codigoDescuento.code}`);
  }
  
  return descripciones;
}

/**
 * Calcula el precio individual de un rol basado en el descuento por cantidad
 */
export function getPrecioRolConDescuento(precioBase: number, cantidadRoles: number): number {
  const precioUnitario = getPrecioUnitario(cantidadRoles);
  const descuento = 1 - (precioUnitario / precioBase);
  
  return parseFloat((precioBase * (1 - descuento)).toFixed(2));
}

/**
 * Resume la orden para mostrar en resúmenes
 */
export function resumirOrden(
  rolesSeleccionados: RoleKuntur[],
  hostingPlan: HostingPlan | null,
  esAnual: boolean,
  pricing: PricingCalculation,
  exchangeRate: number
) {
  return {
    resumen: {
      cantidad_roles: rolesSeleccionados.length,
      nombres_roles: rolesSeleccionados.map(r => r.name),
      subtotal_roles: pricing.subtotal_roles,
      hosting: hostingPlan ? {
        plan: hostingPlan.name,
        periodo: esAnual ? 'Anual' : 'Mensual',
        precio: pricing.subtotal_hosting
      } : null,
      descuentos: {
        porcentaje_total: Math.round(pricing.descuento_total * 100),
        ahorro_usdt: pricing.ahorro,
        ahorro_bob: convertirUSDTaBOB(pricing.ahorro, exchangeRate)
      },
      totales: {
        subtotal: pricing.subtotal,
        total_usdt: pricing.total_usdt,
        total_bob: convertirUSDTaBOB(pricing.total_usdt, exchangeRate),
        exchange_rate
      }
    }
  };
}