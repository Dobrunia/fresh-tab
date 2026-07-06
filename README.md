# Fresh Tab

Hard reload browser extension for Firefox and Zen Browser. One toolbar click clears all site data for the current page origin and reloads it.

**Install:** [Firefox Add-ons](https://addons.mozilla.org/ru/firefox/addon/dobrunia-fresh-tab/)

## Usage

Click the extension icon on an active tab → site data is cleared → hard reload.

## What gets cleared

- Cookies (registrable domain)
- localStorage and sessionStorage
- IndexedDB
- HTTP cache
- Service Workers and Cache Storage
- File System API
- Form autofill data for the site

## Limitations

- Works only on `http://` and `https://` pages.
- Clears the main tab origin only, not third-party iframe storage.
- Site permissions (notifications, camera, etc.) are not reset.

## License

MIT © [Dobrunia](https://github.com/Dobrunia)
