-- ============================================
-- KUNTUR EXPRESS - SUPABASE SCHEMA
-- ============================================
-- Versión: 2.0
-- Fecha: Noviembre 2025
-- ============================================

-- Limpiar tablas existentes (solo para desarrollo)
DROP TABLE IF EXISTS order_interactions CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS daily_discounts CASCADE;
DROP TABLE IF EXISTS campaigns CASCADE;
DROP TABLE IF EXISTS hosting_plans CASCADE;
DROP TABLE IF EXISTS roles_kuntur CASCADE;

-- ============================================
-- TABLA: roles_kuntur
-- ============================================

CREATE TABLE roles_kuntur (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  tagline VARCHAR(200),
  price_usdt DECIMAL(10,2) NOT NULL,
  delivery_days INT NOT NULL,
  ideal_for TEXT[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE roles_kuntur IS 'Catálogo de Roles Kuntur disponibles';

-- ============================================
-- TABLA: hosting_plans
-- ============================================

CREATE TABLE hosting_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  monthly_price DECIMAL(10,2) NOT NULL,
  annual_price DECIMAL(10,2) NOT NULL,
  discount_annual DECIMAL(5,4) NOT NULL,
  conversations_limit INT NOT NULL,
  ideal_roles_min INT,
  ideal_roles_max INT,
  features JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE hosting_plans IS 'Planes de hosting disponibles';

-- ============================================
-- TABLA: daily_discounts
-- ============================================

CREATE TABLE daily_discounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(20) UNIQUE NOT NULL,
  percentage DECIMAL(5,4) NOT NULL,
  valid_until TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN DEFAULT true,
  max_uses INT DEFAULT NULL,
  times_used INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE daily_discounts IS 'Códigos de descuento diarios (HOY5)';

-- ============================================
-- TABLA: campaigns
-- ============================================

CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  subtitle TEXT,
  remaining_slots INT NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE campaigns IS 'Campañas promocionales ("Quedan X lugares")';

-- ============================================
-- TABLA: orders
-- ============================================

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(20) UNIQUE NOT NULL,
  
  -- Cliente
  client_name VARCHAR(200) NOT NULL,
  client_email VARCHAR(200) NOT NULL,
  client_phone VARCHAR(50),
  client_business VARCHAR(200),
  
  -- Configuración
  roles_selected JSONB NOT NULL,
  hosting_plan_id UUID REFERENCES hosting_plans(id),
  hosting_is_annual BOOLEAN DEFAULT false,
  
  -- Pricing
  subtotal_usdt DECIMAL(10,2) NOT NULL,
  discount_total DECIMAL(5,4) DEFAULT 0,
  total_usdt DECIMAL(10,2) NOT NULL,
  exchange_rate DECIMAL(10,4) NOT NULL,
  total_bob DECIMAL(10,2) NOT NULL,
  
  -- Pago
  payment_method VARCHAR(20), -- 'bank_bob' o 'usdt_trc20'
  payment_status VARCHAR(20) DEFAULT 'pending' 
    CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  comprobante_url TEXT,
  comprobante_uploaded_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  
  -- Metadata
  source VARCHAR(50), -- 'web', 'whatsapp', etc
  utm_params JSONB,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE orders IS 'Órdenes de compra de clientes';

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- TABLA: order_interactions
-- ============================================

CREATE TABLE order_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  description TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE order_interactions IS 'Timeline de interacciones con cada orden';

-- ============================================
-- ÍNDICES
-- ============================================

CREATE INDEX idx_orders_email ON orders(client_email);
CREATE INDEX idx_orders_status ON orders(payment_status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);
CREATE INDEX idx_orders_number ON orders(order_number);
CREATE INDEX idx_daily_discounts_code ON daily_discounts(code) WHERE is_active = true;
CREATE INDEX idx_order_interactions_order ON order_interactions(order_id);
CREATE INDEX idx_roles_slug ON roles_kuntur(slug);
CREATE INDEX idx_hosting_slug ON hosting_plans(slug);

-- ============================================
-- SEEDS: ROLES KUNTUR
-- ============================================

INSERT INTO roles_kuntur (slug, name, description, tagline, price_usdt, delivery_days, ideal_for) VALUES
(
  'recepcionista', 
  'Recepcionista Kuntur', 
  'Atiende consultas, agenda citas y deriva clientes las 24 horas del día.', 
  'Tu primera impresión, siempre perfecta', 
  120, 
  7, 
  ARRAY['Clínicas', 'Salones de belleza', 'Estudios jurídicos']
),
(
  'vendedor', 
  'Vendedor Kuntur', 
  'Muestra productos, calcula totales y envía QR de pago automáticamente.', 
  'Vende mientras dormís', 
  120, 
  7, 
  ARRAY['E-commerce', 'Tiendas físicas', 'Mayoristas']
),
(
  'promotora', 
  'Promotora Kuntur', 
  'Presenta promociones y mantiene el engagement con tus clientes.', 
  'Tu marca, siempre presente', 
  120, 
  7, 
  ARRAY['Retail', 'Gastronomía', 'Eventos']
),
(
  'community', 
  'Community Kuntur', 
  'Gestiona redes, responde comentarios y modera grupos automáticamente.', 
  'Tu comunidad, siempre activa', 
  120, 
  10, 
  ARRAY['Influencers', 'Marcas personales', 'Agencias']
),
(
  'gestor', 
  'Gestor Kuntur', 
  'Organiza clientes, envía recordatorios y hace seguimiento constante.', 
  'Organizá sin esfuerzo', 
  120, 
  10, 
  ARRAY['Servicios', 'Suscripciones', 'Membresías']
),
(
  'personal', 
  'Personal Kuntur', 
  'Agenda, tareas y recordatorios inteligentes para tu día a día.', 
  'Tu asistente personal 24/7', 
  120, 
  12, 
  ARRAY['Emprendedores', 'Freelancers', 'Ejecutivos']
),
(
  'full', 
  'Kuntur Full', 
  'Los 6 roles trabajando en equipo para tu negocio.', 
  'El ecosistema completo', 
  510, 
  21, 
  ARRAY['Negocios establecidos', 'Expansión rápida']
);

-- ============================================
-- SEEDS: HOSTING PLANS
-- ============================================

INSERT INTO hosting_plans (
  slug, 
  name, 
  monthly_price, 
  annual_price, 
  discount_annual, 
  conversations_limit, 
  ideal_roles_min, 
  ideal_roles_max,
  features
) VALUES
(
  'starter', 
  'Starter', 
  20, 
  192, 
  0.20, 
  1200, 
  1, 
  1,
  '{"support": "email", "priority": false, "monitoring": "basic", "credits": "standard"}'::jsonb
),
(
  'crecimiento', 
  'Crecimiento', 
  60, 
  540, 
  0.25, 
  3000, 
  2, 
  3,
  '{"support": "priority", "priority": true, "monitoring": "advanced", "credits": "enhanced"}'::jsonb
),
(
  'premium', 
  'Premium', 
  150, 
  1260, 
  0.30, 
  10000, 
  4, 
  6,
  '{"support": "vip_24_7", "priority": true, "monitoring": "enterprise", "credits": "unlimited", "consulting": true}'::jsonb
);

-- ============================================
-- SEEDS: CÓDIGO HOY5 (generar diariamente)
-- ============================================

INSERT INTO daily_discounts (code, percentage, valid_until, is_active) VALUES
(
  'HOY5', 
  0.05, 
  (CURRENT_DATE + INTERVAL '1 day')::timestamptz, 
  true
);

-- ============================================
-- FUNCIONES ÚTILES
-- ============================================

-- Generar próximo order_number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS VARCHAR AS $$
DECLARE
  year INT;
  last_num INT;
  new_num VARCHAR;
BEGIN
  year := EXTRACT(YEAR FROM NOW());
  
  SELECT COALESCE(
    MAX(CAST(SUBSTRING(order_number FROM 9) AS INT)), 
    0
  ) INTO last_num
  FROM orders
  WHERE order_number LIKE 'KX-' || year || '-%';
  
  new_num := 'KX-' || year || '-' || LPAD((last_num + 1)::TEXT, 3, '0');
  
  RETURN new_num;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- PERMISOS (ajustar según necesidad)
-- ============================================

-- Si usás RLS (Row Level Security), configurá aquí
-- ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY ...

-- ============================================
-- VERIFICACIÓN
-- ============================================

-- Verificar que todo se creó correctamente
DO $$
BEGIN
  RAISE NOTICE '✅ Schema creado correctamente';
  RAISE NOTICE 'Roles insertados: %', (SELECT COUNT(*) FROM roles_kuntur);
  RAISE NOTICE 'Hosting plans insertados: %', (SELECT COUNT(*) FROM hosting_plans);
  RAISE NOTICE 'Códigos de descuento: %', (SELECT COUNT(*) FROM daily_discounts);
END $$;

-- ============================================
-- NOTAS IMPORTANTES
-- ============================================

/*
1. DESPUÉS DE EJECUTAR ESTE SQL:
   - Verificá que todas las tablas se crearon
   - Ejecutá: SELECT * FROM roles_kuntur;
   - Ejecutá: SELECT * FROM hosting_plans;

2. PARA DESARROLLO LOCAL:
   - Este schema incluye DROP TABLE para limpiar
   - En producción, comentá los DROP TABLE

3. CÓDIGO HOY5:
   - Se debe regenerar diariamente
   - Podés hacerlo con un cron job o GitHub Action
   - O manualmente cada día

4. ORDER_NUMBER:
   - Se genera automáticamente con la función
   - Formato: KX-2025-001, KX-2025-002, etc.

5. SUPABASE STORAGE:
   - Crear bucket "comprobantes" para guardar imágenes
   - Configurar políticas de acceso apropiadas
*/
