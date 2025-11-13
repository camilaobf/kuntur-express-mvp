// ============================================
// TIPOS BASE
// ============================================

export type UUID = string;
export type JSONB = Record<string, any>;
export type Timestamp = string;

// ============================================
// TIPOS DE ENUMS
// ============================================

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type PaymentMethod = 'bank_bob' | 'usdt_trc20' | null;
export type OrderSource = 'web' | 'whatsapp' | 'instagram' | 'facebook' | 'referral';
export type OrderStatus = 'created' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

// ============================================
// TIPOS DE ENTIDADES
// ============================================

/**
 * Rol Kuntur - Agente de IA especializado
 */
export interface RoleKuntur {
  id: UUID;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  price_usdt: number;
  delivery_days: number;
  ideal_for: string[];
  features: string[];
  is_active: boolean;
  created_at: Timestamp;
  updated_at: Timestamp;
}

/**
 * Plan de hosting para Roles Kuntur
 */
export interface HostingPlan {
  id: UUID;
  slug: string;
  name: string;
  description: string;
  monthly_price: number;
  annual_price: number;
  discount_annual: number;
  capacity: string;
  ideal_roles_min: number | null;
  ideal_roles_max: number | null;
  features: string[];
  ideal_for: string;
  is_active: boolean;
  created_at: Timestamp;
  updated_at: Timestamp;
}

/**
 * Descuento diario configurable
 */
export interface DailyDiscount {
  id: UUID;
  code: string;
  description: string;
  percentage: number;
  max_uses: number | null;
  times_used: number;
  valid_until: Timestamp;
  is_active: boolean;
  created_at: Timestamp;
  updated_at: Timestamp;
}

/**
 * Orden de compra principal
 */
export interface Order {
  id: UUID;
  order_number: string;

  // Datos del cliente
  client_name: string;
  client_email: string;
  client_phone: string | null;
  client_business: string | null;

  // Configuración
  roles_selected: RoleSelection[];
  hosting_plan_id: UUID | null;
  hosting_is_annual: boolean;

  // Pricing
  subtotal_usdt: number;
  discount_total: number;
  total_usdt: number;
  exchange_rate: number;
  total_bob: number;

  // Estado de pago
  payment_status: PaymentStatus;
  payment_method: PaymentMethod;
  comprobante_url: string | null;
  comprobante_uploaded_at: Timestamp | null;
  paid_at: Timestamp | null;

  // Metadata
  source: OrderSource;
  utm_params: JSONB | null;
  created_at: Timestamp;
  updated_at: Timestamp;
}

/**
 * Selección de rol dentro de una orden
 */
export interface RoleSelection {
  id: UUID;
  slug: string;
  name: string;
  tagline: string;
  price_usdt: number;
}

/**
 * Interacción registrada con una orden
 */
export interface OrderInteraction {
  id: UUID;
  order_id: UUID;
  type: string;
  description: string;
  metadata: JSONB | null;
  created_at: Timestamp;
}

/**
 * Orden con hosting e interacciones incluidas
 */
export interface OrderWithHosting extends Order {
  hosting_plan: HostingPlan | null;
  interactions: OrderInteraction[];
}

/**
 * Tasa de cambio USDT/BOB
 */
export interface ExchangeRate {
  id: UUID;
  rate: number;
  source: 'binance_p2p' | 'official_fallback' | 'manual';
  metadata: JSONB | null;
  created_at: Timestamp;
}

// ============================================
// TIPOS DE API RESPONSES
// ============================================

/**
 * Response estándar de API
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  details?: string[];
}

/**
 * Response para creación de orden
 */
export interface CreateOrderResponse {
  success: boolean;
  data?: {
    order_id: UUID;
    order_number: string;
    total_usdt: number;
    total_bob: number;
    exchange_rate: number;
    pricing_details: PricingDetails;
  } | null;
  error?: string;
  details?: string[];
}

/**
 * Response para obtener una orden
 */
export interface GetOrderResponse {
  success: boolean;
  data?: Order;
  error?: string;
}

/**
 * Response para listar órdenes
 */
export interface ListOrdersResponse {
  success: boolean;
  data?: {
    orders: Order[];
    total: number;
    limit: number;
    offset: number;
  };
  error?: string;
}

// ============================================
// TIPOS DE CÁLCULOS
// ============================================

/**
 * Resultado del cálculo de precios
 */
export interface PricingCalculation {
  subtotal_roles: number;
  subtotal_hosting: number;
  subtotal: number;
  descuento_roles: number;
  descuento_hosting: number;
  descuento_hoy5: number;
  descuento_total: number;
  total_usdt: number;
  ahorro: number;
}

/**
 * Detalles de pricing para mostrar en respuestas
 */
export interface PricingDetails {
  subtotal: number;
  subtotal_roles: number;
  subtotal_hosting: number;
  discount_percentage: number;
  discount_amount: number;
  descuentos_aplicados: {
    roles: number;
    hosting: number;
    hoy5: number;
    extra: number;
  };
}

// ============================================
// TIPOS DE FORMULARIOS
// ============================================

/**
 * Datos para crear una nueva orden
 */
export interface CreateOrderData {
  client_name: string;
  client_email: string;
  client_phone?: string;
  client_business?: string;
  roles_selected: RoleSelection[];
  hosting_plan_id?: UUID;
  hosting_is_annual?: boolean;
  discount_code?: string;
  source?: OrderSource;
  utm_params?: JSONB;
}

/**
 * Datos para actualizar estado de pago
 */
export interface UpdatePaymentData {
  payment_status: PaymentStatus;
  payment_method?: PaymentMethod;
  comprobante_url?: string;
  paid_at?: Timestamp;
}

/**
 * Datos para subir comprobante
 */
export interface UploadComprobanteData {
  comprobante_url: string;
  payment_method: PaymentMethod;
}

// ============================================
// TIPOS DE QUERY
// ============================================

/**
 * Parámetros para filtrar órdenes
 */
export interface OrderFilters {
  status?: PaymentStatus;
  source?: OrderSource;
  client_email?: string;
  date_from?: Timestamp;
  date_to?: Timestamp;
}

/**
 * Parámetros de paginación
 */
export interface PaginationParams {
  limit: number;
  offset: number;
}

/**
 * Parámetros de ordenamiento
 */
export interface OrderByParams {
  field: 'created_at' | 'total_usdt' | 'client_name';
  direction: 'asc' | 'desc';
}

/**
 * Parámetros completos para query de órdenes
 */
export interface OrderQueryParams extends OrderFilters, PaginationParams, OrderByParams {}

// ============================================
// TIPOS DE ESTADÍSTICAS
// ============================================

/**
 * Estadísticas de órdenes
 */
export interface OrderStats {
  total_orders: number;
  total_revenue_usdt: number;
  total_revenue_bob: number;
  pending_orders: number;
  paid_orders: number;
  failed_orders: number;
  average_order_value: number;
  orders_by_source: Record<OrderSource, number>;
  orders_by_status: Record<PaymentStatus, number>;
  revenue_by_month: Array<{
    month: string;
    revenue_usdt: number;
    orders_count: number;
  }>;
}

/**
 * Estadísticas de roles más vendidos
 */
export interface RoleStats {
  role_id: UUID;
  role_name: string;
  times_selected: number;
  revenue_generated: number;
  percentage_of_total: number;
}