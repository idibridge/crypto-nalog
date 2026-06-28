# КриптоСдача

Налоговый и бухгалтерский консалтинг по криптовалюте — для физлиц и компаний в РФ.

## Структура (чистые URL без .html, июнь 2026)

```
crypto-nalog/
├── index.html                 # Главная (cryptosdacha.ru/)
├── services/index.html        # Услуги для физлиц (/services/)
├── business/index.html        # Для бизнеса (/business/)
├── how-it-works/index.html    # Как работает (/how-it-works/)
├── blog/index.html            # Блог (/blog/)
├── blog/<slug>/index.html     # Статьи блога (/blog/<slug>/)
├── contacts/index.html        # Контакты (/contacts/)
├── privacy/index.html         # Политика конфиденциальности (/privacy/)
├── css/styles.css
├── js/main.js
├── sitemap.xml
├── robots.txt
├── CNAME
│
├── services.html, business.html, how-it-works.html,
├── blog.html, contacts.html, blog/<slug>.html
│     ^ редирект-заглушки на новые адреса (для старых ссылок/закладок,
│       noindex + meta-refresh + JS-редирект, GitHub Pages не поддерживает
│       серверные 301-редиректы)
```

Все внутренние ссылки — абсолютные от корня (`/services/`, `/css/styles.css` и т.д.),
поэтому работают одинаково на любой вложенности.

## Локальный запуск

Любой статический сервер из корня папки, например:
`python3 -m http.server 8000`

## Дальнейшая настройка

- `README-search-consoles.md` — подключение Google Search Console и Яндекс.Вебмастера.
- `README-leads-bot.md` — создание Telegram-бота и бесплатного обработчика
  заявок (Cloudflare Workers), код обработчика — `leads-bot/worker.js`.
- `privacy/index.html` — политика конфиденциальности (152-ФЗ). Перед
  публикацией внести реквизиты юрлица, когда будет зарегистрировано ООО.

