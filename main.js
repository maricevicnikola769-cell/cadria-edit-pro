// CADRIA EDIT – samostalan Windows program (Electron).
// Program nosi sopstveni ugrađeni Chrome, pa ne zavisi od Edge-a ni od bilo kog pregledača.
// Editor (folder html) ostaje isti: novi izgled, logo, export bez interneta, AI preko interneta.
const { app, BrowserWindow, protocol, net, session, shell, dialog, Menu } = require('electron');
const path = require('path');
const { pathToFileURL } = require('url');

const APP_ID = 'Nikola.CadriaEdit';
const HTML_DIR = path.join(__dirname, 'html');
const START_URL = 'app://cadria/index.html';

// Editor se učitava sa adrese app://cadria/ (kao pravi sajt), da bi radili moduli,
// AI (WebGL, WebAssembly), mikrofon i čuvanje podešavanja (tema, poslednji meni).
protocol.registerSchemesAsPrivileged([{
  scheme: 'app',
  privileges: { standard: true, secure: true, supportFetchAPI: true, corsEnabled: true, stream: true, codeCache: true },
}]);

app.setAppUserModelId(APP_ID); // sopstvena ikonica i dugme na traci zadataka

// Samo jedan program odjednom: drugi klik na ikonicu otvara još jedan prozor u istom programu.
if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.on('second-instance', () => createWindow());
  app.whenReady().then(start);
}

function start() {
  Menu.setApplicationMenu(null); // bez File/Edit/View menija na vrhu

  protocol.handle('app', (request) => {
    const url = new URL(request.url);
    let rel = decodeURIComponent(url.pathname);
    if (rel === '/' || rel === '') rel = '/index.html';
    // ugrađeni ffmpeg (ProRes izvoz i rezervna MP4 konverzija rade i bez interneta)
    const ff = rel.match(/^\/ffmpeg\/(ffmpeg|util|core)\/(.+)$/);
    if (ff) {
      const base = path.join(__dirname, 'node_modules', '@ffmpeg', ff[1], 'dist', 'esm');
      const f = path.normalize(path.join(base, ff[2]));
      if (!f.startsWith(base)) return new Response('Nije dozvoljeno', { status: 403 });
      return net.fetch(pathToFileURL(f).toString());
    }
    const file = path.normalize(path.join(HTML_DIR, rel));
    if (!file.startsWith(HTML_DIR)) return new Response('Nije dozvoljeno', { status: 403 });
    return net.fetch(pathToFileURL(file).toString());
  });

  const ses = session.defaultSession;

  // Mikrofon, kamera, pristup fajlovima (Sačuvaj kao), celi ekran - dozvoljeno samo editoru.
  const own = (u) => typeof u === 'string' && u.startsWith('app://cadria');
  ses.setPermissionRequestHandler((wc, permission, callback, details) => {
    callback(own(details.requestingUrl || wc.getURL()));
  });
  ses.setPermissionCheckHandler((wc, permission, origin) => own(origin) || own(wc && wc.getURL()));

  // Sve što bi išlo u "Preuzimanja" pita gde da se sačuva (direktno na disk).
  ses.on('will-download', (event, item) => {
    item.setSaveDialogOptions({
      title: 'Sačuvaj kao',
      defaultPath: path.join(app.getPath('videos'), item.getFilename()),
    });
  });

  createWindow();
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 880,
    minWidth: 960,
    minHeight: 600,
    title: 'CADRIA EDIT',
    icon: path.join(__dirname, 'build', 'icon.png'),
    backgroundColor: '#0b1220',
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      spellcheck: false,
      backgroundThrottling: false, // export ne usporava kad je prozor u pozadini
    },
  });
  win.once('ready-to-show', () => { win.maximize(); win.show(); });

  // Linkovi ka spoljnim sajtovima otvaraju se u običnom pregledaču.
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:/i.test(url)) shell.openExternal(url);
    return { action: 'deny' };
  });
  win.webContents.on('will-navigate', (e, url) => {
    if (!url.startsWith('app://cadria')) { e.preventDefault(); if (/^https?:/i.test(url)) shell.openExternal(url); }
  });

  // Pitaj pre zatvaranja da se slučajno ne izgubi posao (editor sam odlučuje preko beforeunload).
  win.webContents.on('will-prevent-unload', (e) => {
    const choice = dialog.showMessageBoxSync(win, {
      type: 'question', buttons: ['Zatvori', 'Otkaži'], defaultId: 1, cancelId: 1,
      title: 'CADRIA EDIT', message: 'Da li želite da zatvorite editor?', detail: 'Nesačuvane izmene biće izgubljene.',
    });
    if (choice === 0) e.preventDefault();
  });

  // F12 = alati za programere, F11 = ceo ekran
  win.webContents.on('before-input-event', (e, input) => {
    if (input.type !== 'keyDown') return;
    if (input.key === 'F12') { win.webContents.toggleDevTools(); e.preventDefault(); }
    else if (input.key === 'F11') { win.setFullScreen(!win.isFullScreen()); e.preventDefault(); }
  });

  win.loadURL(START_URL);
  return win;
}

app.on('window-all-closed', () => app.quit());
