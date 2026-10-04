# DicomBridge-Site

Рекламный сайт приложения **DicomBridge** — фоновый шлюз DICOM → PACS.

- 🖤💙 Черно-голубой дизайн + 3D (Three.js: частицы, икосаэдр, торы, параллакс)
- 🔄 **Автосинхронизация с GitHub**: сайт при каждой загрузке запрашивает `https://api.github.com/repos/dosik74/DicomBridge/releases` и перерисовывает блок «Скачать». Новый релиз на GitHub = новая карточка на сайте автоматически (+ автообновление каждые 5 минут).
- ⬇ Прямые кнопки скачивания `.exe` из релизов (`browser_download_url`).
- 🖼 Лого из `assets/logo.png` (оптимизировано из 44 МБ → ~190 КБ).

## Запуск локально

Просто открой `index.html` в браузере (интернет нужен для Three.js CDN и GitHub API).

Или через сервер:

```bat
python -m http.server 8000
```

→ http://localhost:8000

## Структура

```
index.html   разметка
styles.css   черно-голубой glass/neon дизайн
app.js       Three.js фон + fetch релизов GitHub + tilt/анимации
assets/      logo.png, logo-small.png, favicon.png
```

## Приложение

Исходники и релизы: https://github.com/dosik74/DicomBridge
