# Fresh Tab

Hard reload расширение для Zen Browser (Firefox): одна кнопка на тулбаре очищает все site data текущей страницы и перезагружает её.

## Установка (temporary)

1. Открой `about:debugging#/runtime/this-firefox` в Zen Browser.
2. Нажми **Load Temporary Add-on…** и выбери `manifest.json` из этой папки.
3. Закрепи иконку на тулбаре (Pin to Toolbar).
4. После перезапуска браузера повтори шаги 1–2.

## Использование

Клик по иконке расширения на активной вкладке → очистка данных origin → hard reload.

## Что очищается

- Cookies (весь registrable domain)
- localStorage и sessionStorage
- IndexedDB
- HTTP cache
- Service Workers и Cache Storage
- File System API
- Form autofill data для сайта

## Проверка

1. Открой любую http/https страницу.
2. В консоли DevTools выполни:

```javascript
localStorage.setItem("test", "1");
sessionStorage.setItem("test", "1");
document.cookie = "test=1; path=/";
indexedDB.open("test-db");
caches.open("test-cache");
```

3. Кликни иконку Fresh Tab.
4. После reload проверь Application/Storage в DevTools — всё должно быть пусто.

## Ограничения

- Работает только на `http://` и `https://` страницах.
- Очищается origin главной вкладки, не third-party iframe storage.
- Permissions сайта (уведомления, камера и т.д.) не сбрасываются.
