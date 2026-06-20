/**
 * КриптоСдача — приём заявок с сайта и пересылка в Telegram.
 *
 * Деплой: Cloudflare Workers (бесплатный тариф, 100 000 запросов/день — с большим запасом).
 * Секреты (Settings → Variables → Encrypt), НЕ хранить в коде:
 *   BOT_TOKEN      — токен бота от @BotFather
 *   CHAT_ID        — id чата/канала, куда слать заявки
 *   ALLOWED_ORIGIN — https://cryptosdacha.ru
 */

export default {
  async fetch(request, env) {
    const origin = env.ALLOWED_ORIGIN || "https://cryptosdacha.ru";

    const corsHeaders = {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405, headers: corsHeaders });
    }

    let data;
    try {
      data = await request.json();
    } catch {
      return new Response(JSON.stringify({ ok: false, error: "bad_json" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Honeypot: бот заполняет скрытое поле — тихо отвечаем "успех", в Telegram не шлём.
    if (data.company) {
      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const name = String(data.name || "").slice(0, 200).trim();
    const email = String(data.email || "").slice(0, 200).trim();
    const topic = String(data.topic || "").slice(0, 200).trim();
    const message = String(data.message || "").slice(0, 2000).trim();

    if (!name || !email) {
      return new Response(JSON.stringify({ ok: false, error: "missing_fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const text =
      `🟢 Новая заявка — КриптоСдача\n\n` +
      `Имя: ${name}\n` +
      `Email: ${email}\n` +
      `Тема: ${topic || "—"}\n` +
      `Сообщение:\n${message || "—"}`;

    const tgRes = await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: env.CHAT_ID,
        text,
      }),
    });

    if (!tgRes.ok) {
      return new Response(JSON.stringify({ ok: false, error: "telegram_failed" }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  },
};
