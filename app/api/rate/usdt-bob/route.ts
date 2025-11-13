import { NextResponse } from 'next/server';

type BinanceAd = { adv: { price: string } };

/**
 * Obtiene la cotización USDT/BOB desde Binance P2P
 * 
 * Endpoint: GET /api/rate/usdt-bob
 * Cache: 30 minutos (Vercel Edge)
 * Fallback: 10.7 (tipo oficial)
 */
async function fetchBinanceP2P() {
  try {
    console.log('💱 Obteniendo tasa USDT/BOB desde Binance P2P...');
    
    const res = await fetch(
      'https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page: 1,
          rows: 10,
          asset: 'USDT',
          tradeType: 'SELL', // Vendedores (nosotros compramos)
          fiat: 'BOB',
          payTypes: [],
          publisherType: null
        }),
        // Timeout de 10 segundos
        signal: AbortSignal.timeout(10000)
      }
    );
    
    if (!res.ok) {
      throw new Error(`Binance API error: ${res.status} ${res.statusText}`);
    }
    
    const data = await res.json();
    const rows: BinanceAd[] = data?.data || [];
    
    if (!rows || rows.length === 0) {
      throw new Error('No data received from Binance P2P');
    }
    
    // Promedio de los primeros 3 vendedores
    const topPrices = rows.slice(0, 3).map(r => parseFloat(r.adv.price));
    const avg = topPrices.reduce((a, b) => a + b, 0) / topPrices.length;
    
    // Validar que el precio sea razonable
    if (avg < 5 || avg > 20) {
      console.warn('⚠️ Precio sospechoso:', avg);
      throw new Error('Precio fuera de rango razonable');
    }
    
    const rate = parseFloat(avg.toFixed(4));
    console.log(`✅ Tasa obtenida: ${rate} (${rows.length} vendedores)`);
    
    return { 
      rate, 
      source: 'binance_p2p',
      vendors_count: rows.length,
      top_prices: topPrices
    };
    
  } catch (error) {
    console.error('❌ Error obteniendo tasa de Binance:', error);
    throw error;
  }
}

/**
 * GET /api/rate/usdt-bob
 */
export async function GET() {
  try {
    // Intentar obtener tasa de Binance P2P
    try {
      const { rate, source, vendors_count, top_prices } = await fetchBinanceP2P();
      
      return NextResponse.json(
        { 
          rate, 
          source, 
          vendors_count,
          top_prices,
          ts: Date.now(),
          currency: 'BOB',
          base: 'USDT'
        },
        { 
          headers: { 
            'Cache-Control': 's-maxage=1800, stale-while-revalidate=60', // 30 min
            'Content-Type': 'application/json'
          } 
        }
      );
    } catch (binanceError) {
      console.warn('⚠️ Fallback a tasa oficial:', binanceError);
      
      // Fallback: tipo de cambio oficial
      const fallbackRate = 10.7;
      
      return NextResponse.json(
        { 
          rate: fallbackRate, 
          source: 'official_fallback', 
          ts: Date.now(),
          degraded: true,
          fallback_reason: 'binance_api_error',
          currency: 'BOB',
          base: 'USDT'
        },
        { 
          headers: { 
            'Cache-Control': 's-maxage=300, stale-while-revalidate=60', // 5 min
            'Content-Type': 'application/json'
          } 
        }
      );
    }
    
  } catch (error) {
    console.error('💥 Error crítico en endpoint de tasa:', error);
    
    // Último recurso: tasa hardcodeada
    return NextResponse.json(
      { 
        rate: 10.7, 
        source: 'emergency_fallback', 
        ts: Date.now(),
        degraded: true,
        fallback_reason: 'critical_error',
        error: 'Emergency fallback activated',
        currency: 'BOB',
        base: 'USDT'
      },
      { 
        status: 200, // Siempre 200 para no romper el frontend
        headers: { 
          'Cache-Control': 's-maxage=60', // 1 min solo
          'Content-Type': 'application/json'
        } 
      }
    );
  }
}

/**
 * OPTIONS para CORS
 */
export async function OPTIONS(): Promise<NextResponse> {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}