// Javlja editoru da radi kao program (ne u pregledaču), da bi fajlove snimao direktno na disk.
// pathFor: putanja izabranog fajla na disku (za XML izvoz u Premiere/DaVinci bez ponovnog povezivanja).
const { contextBridge, webUtils } = require('electron');
contextBridge.exposeInMainWorld('cadriaDesktop', {
  version: process.versions.electron,
  pathFor: (file) => { try { return webUtils.getPathForFile(file); } catch (e) { return ''; } },
});
