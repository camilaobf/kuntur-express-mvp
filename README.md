# 🦅 Kuntur Express - Roles Kuntur

**Plataforma de configuración y venta de Roles Kuntur** - Agentes de IA especializados para negocios en Bolivia.

---

## 🎯 Descripción del Proyecto

Kuntur Express es un sistema completo para la venta de **Roles Kuntur** (agentes de IA especializados) que incluye:

- 🎯 **Configurador interactivo** de productos con 3 pasos
- 💰 **Sistema de pricing dinámico** con descuentos progresivos
- 💱 **Cotización USDT/BOB** en tiempo real (Binance P2P)
- 📱 **Checkout con 2 métodos** de pago (QR banco + QR USDT)
- 📎 **Validación automática** de comprobantes con IA
- 📧 **Emails transaccionales** (Resend)
- 📅 **Integración Google Calendar** para asesorías

### **Roles Kuntur Disponibles:**

| Rol | Precio USDT | Ideal para |
|-----|-------------|-------------|
| **Kuntur Sales** | $120 | Vendedores, cerradores de ventas |
| **Kuntur Support** | $120 | Soporte técnico, atención al cliente |
| **Kuntur Marketing** | $120 | Marketing digital, redes sociales |
| **Kuntur Content** | $120 | Creación de contenido, copywriting |
| **Kuntur Analytics** | $120 | Análisis de datos, BI |
| **Kuntur Operations** | $120 | Operaciones, logística |
| **Kuntur Finance** | $120 | Contabilidad, finanzas |

### **Planes de Hosting Express:**

| Plan | Mensual (USDT) | Anual (USDT) | Descuento | Capacidad |
|------|----------------|--------------|-----------|-----------|
| **Starter** | 20 | 192 | 20% | 1 rol, 1.2k conversaciones |
| **Crecimiento** | 60 | 540 | 25% | 2-3 roles, 3k conversaciones |
| **Premium** | 150 | 1,260 | 30% | 4-6 roles, 10k conversaciones |

---

## 🛠️ Stack Tecnológico

```
Frontend:  Next.js 14 (App Router) + TypeScript + Tailwind + shadcn/ui
Backend:   Next.js API Routes + Supabase (PostgreSQL)
Emails:    Resend (bot@kunturexpress.com)
Pagos:     QR estáticos (banco BOB + USDT TRC20)
Cache:     Vercel Edge (30 min)
Deploy:    Vercel FREE tier
```

### **Dependencias Principales:**

```json
{
  "@supabase/supabase-js": "^2.39.0",
  "@supabase/auth-helpers-nextjs": "^0.8.7",
  "resend": "^3.0.0",
  "zod": "^3.22.4",
  "react-hook-form": "^7.49.0",
  "@hookform/resolvers": "^3.3.3",
  "date-fns": "^3.0.0",
  "clsx": "^2.0.0",
  "tailwind-merge": "^2.2.0",
  "sonner": "^1.3.1",
  "lucide-react": "^0.300.0"
}
```

---

## 📋 Requisitos Previos

- **Node.js 18+** instalado
- **Cuenta Supabase** (gratuita)
- **Cuenta Resend** (para emails)
- **Git** configurado

---

## 🚀 Instalación y Configuración

### 1. **Clonar el Repositorio**

```bash
git clone https://github.com/tu-usuario/kuntur-express-mvp.git
cd kuntur-express-mvp
```

### 2. **Instalar Dependencias**

```bash
npm install
# o
yarn install
# o
pnpm install
```

### 3. **Configurar Variables de Entorno**

Copia el archivo de ejemplo:

```bash
cp .env.example .env.local
```

Edita `.env.local` con tus datos:

```env
# Supabase Database & Storage
NEXT_PUBLIC_SUPABASE_URL=https://tu-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key-aqui

# Email Service (Resend)
RESEND_API_KEY=re_tu_api_key_aqui
RESEND_FROM_EMAIL=bot@kunturexpress.com

# URLs de la Aplicación
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Monitoreo y Analytics
NEXT_PUBLIC_TIKTOK_PIXEL_ID=D4ATLEJC77U5N735V5I0
```

### 4. **Configurar Supabase Database**

1. Ve a tu [Dashboard Supabase](https://supabase.com/dashboard)
2. Crea un nuevo proyecto o usa uno existente
3. Copia el schema desde `supabase-schema.sql`
4. Ejecuta el SQL en el editor de Supabase
5. Crea el bucket de Storage `comprobantes`
6. Configura las políticas de acceso

### 5. **Configurar Resend**

1. Crea cuenta en [Resend](https://resend.com)
2. Genera un API key
3. Verifica tu dominio de email
4. Configura `RESEND_API_KEY` en `.env.local`

### 6. **Ejecutar la Aplicación**

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 🗄️ Base de Datos (Supabase)

### **Schema Principal:**

```sql
-- Tablas principales
roles_kuntur              -- Catálogo de roles disponibles
hosting_plans            -- Planes de hosting
orders                   -- Órdenes de compra
order_interactions       -- Historial de interacciones
daily_discounts          -- Descuentos diarios
exchange_rates           -- Tasas de cambio USDT/BOB

-- Storage Bucket
comprobantes/            -- Comprobantes de pago (files)
```

### **Configuración de Storage:**

1. Crear bucket: `comprobantes`
2. Política pública: `SELECT` para todos
3. Política insert: `INSERT` para usuarios autenticados

---

## 🔧 Scripts Disponibles

```bash
npm run dev          # Inicia desarrollo en http://localhost:3000
npm run build        # Build para producción
npm run start        # Inicia producción (después de npm run build)
npm run lint         # Revisa linting con ESLint
npm run type-check   # Revisa tipos con TypeScript
```

---

## 📁 Estructura del Proyecto

```
kuntur-express-mvp/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── orders/               # Endpoints de órdenes
│   │   ├── rate/                 # Cotización USDT/BOB
│   │   └── email/                # Envío de emails
│   ├── configurar/               # Configurador 3 pasos
│   ├── orden/[id]/               # Checkout individual
│   ├── layout.tsx                # Layout principal
│   └── page.tsx                  # Landing page
├── components/                   # Componentes React
│   ├── ui/                       # shadcn/ui base
│   ├── landing/                  # Componentes landing
│   ├── configurator/             # Wizard configurador
│   └── checkout/                 # Componentes checkout
├── lib/                          # Utilidades
│   ├── supabase.ts               # Cliente Supabase
│   ├── pricing.ts                # Cálculos de precios
│   ├── validations.ts            # Zod schemas
│   └── types/                    # Tipos TypeScript
├── public/                       # Assets estáticos
│   ├── logo-*.png               # Logos marca
│   ├── qr-*.png                 # QR códigos pago
│   └── comprobantes/             # Upload temporal local
├── .env.example                  # Variables ejemplo
├── README.md                     # Este archivo
├── package.json                  # Dependencias
├── tailwind.config.ts           # Config Tailwind
├── tsconfig.json                # Config TypeScript
└── supabase-schema.sql          # Schema BD
```

---

## 🧠 Lógica de Negocio

### **Cálculo de Precios:**

```typescript
// Descuentos por cantidad de roles
1 rol:    $120 c/u (0% descuento)
2-3 roles: $110 c/u (~8% descuento)
4-5 roles: $95 c/u (~20% descuento)
6 roles:   $85 c/u (~30% descuento)

// Descuento adicional hosting anual
Hosting anual: 20-30% descuento según plan

// Código HOY5: 5% adicional (mismo día)
// Descuento máximo total: 40%
```

### **Compatibilidad Hosting-Roles:**

- **1 rol:** Starter, Crecimiento, Premium
- **2-3 roles:** Crecimiento, Premium (Starter deshabilitado)
- **4+ roles:** Solo Premium (otros deshabilitados)

### **Métodos de Pago:**

1. **Transferencia Bancaria** (BOB)
   - QR estático Banco
   - Validación manual comprobante

2. **USDT TRC20**
   - QR estático wallet
   - Validación automática con IA

---

## 📧 Configuración de Emails

| Email | Uso |
|-------|-----|
| `hola@kunturexpress.com` | General, footer, contacto |
| `ventas@kunturexpress.com` | Notificaciones internas |
| `roles@kunturexpress.com` | Confirmaciones de roles |
| `pagos@kunturexpress.com` | Dudas sobre pagos |
| `bot@kunturexpress.com` | **Envío automático (Resend)** |

---

## 🚀 Deploy a Producción

### **Vercel (Recomendado):**

1. **Conectar GitHub:**
   ```bash
   # Subir a GitHub
   git add .
   git commit -m "feat: MVP completo de Kuntur Express"
   git push origin main
   ```

2. **Configurar en Vercel:**
   - Importa el repositorio desde GitHub
   - Configura variables de entorno en Vercel
   - Deploy automático en cada push

3. **Dominio Personalizado:**
   - Configura `kunturexpress.com` en Vercel
   - Actualiza `NEXT_PUBLIC_APP_URL` en producción

### **Variables de Entorno en Vercel:**

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
RESEND_API_KEY=...
RESEND_FROM_EMAIL=bot@kunturexpress.com
NEXT_PUBLIC_APP_URL=https://kunturexpress.com
NEXT_PUBLIC_TIKTOK_PIXEL_ID=D4ATLEJC77U5N735V5I0
```

---

## 📊 Monitoreo y Analytics

### **TikTok Pixel:**

Configurado automáticamente en `layout.tsx`:
- Pixel ID: `D4ATLEJC77U5N735V5I0`
- Eventos: PageView, StartCheckout, Purchase

### **Próximas Integraciones:**

- Google Analytics 4
- Hotjar o Clarity
- Console error tracking

---

## 🐛 Troubleshooting

### **Errores Comunes:**

1. **"Module not found: '@/lib/supabase'"**
   ```bash
   npm install @supabase/supabase-js
   ```

2. **"Module not found: 'zod'"**
   ```bash
   npm install zod
   ```

3. **Error de conexión Supabase:**
   - Verifica `.env.local`
   - Revisa URL y API keys
   - Confirma proyecto activo en Supabase

4. **Upload de archivos falla:**
   - Configura bucket `comprobantes` en Supabase Storage
   - Verifica políticas de acceso
   - Revisa `SUPABASE_SERVICE_ROLE_KEY`

### **Logs y Debug:**

```bash
# Ver logs de desarrollo
npm run dev

# Revisión de tipos
npm run type-check

# Linting
npm run lint
```

---

## 🤝 Contribuir

1. Fork el proyecto
2. Crear branch: `git checkout -b feature/nueva-feature`
3. Commit: `git commit -m 'feat: agregar nueva feature'`
4. Push: `git push origin feature/nueva-feature`
5. Pull Request

---

## 📞 Soporte y Contacto

- **WhatsApp:** +59164036038
- **Email:** hola@kunturexpress.com
- **GitHub Issues:** [Crear Issue](https://github.com/tu-usuario/kuntur-express-mvp/issues)

---

## 📄 Licencia

Este proyecto es propiedad de **Kuntur Express**. Uso comercial prohibido sin autorización.

---

**Versión:** 1.0.0
**Última Actualización:** Noviembre 2025
**Mantenido por:** Kuntur Express Team

---

## 📚 Documentación Adicional

- [Documentación Supabase](https://supabase.com/docs)
- [Documentación Resend](https://resend.com/docs)
- [Documentación Next.js](https://nextjs.org/docs)
- [Documentación Tailwind](https://tailwindcss.com/docs)
- [Documentación shadcn/ui](https://ui.shadcn.com/)