# CADRIA EDIT – samostalan program (Electron)

Program sada nosi **sopstveni ugrađeni Chrome**. Ne treba mu Edge, Chrome ni Python.
Editor je isti: novi izgled, logo A, export bez interneta, AI preko interneta.

GitHub od ovog foldera pravi:
- **CadriaEdit-Setup.exe**: instalacija (ikonica na radnoj površini i u Start meniju), ~100 MB;
- **CadriaEdit-prenosna.zip**: verzija bez instalacije (raspakuj i pokreni `CADRIA EDIT.exe`).

## Bez instalacije (u pregledaču)
Fajl `html/index.html` možeš otvoriti i direktno u Chrome-u ili Edge-u (dupli klik).
Radi montaža i export, i bez interneta. Program (instalacija) je ipak bolji:
ProRes, režim za duge videe i snimanje direktno na disk rade samo u programu.

## Postavljanje na GitHub
1. Na **github.com/new** napravite NOVI repozitorijum `cadria-edit-pro`, **Public**.
2. Kliknite **uploading an existing file**, iz ovog foldera označite sve (**Ctrl+A**), prevucite i **Commit changes**.
3. Folder `.github` GitHub preskače, pa: **Add file → Create new file**, ime
   `.github/workflows/build.yml`, nalepite sadržaj istoimenog fajla (otvorite ga Notepad-om) → **Commit changes**.
4. U **Actions** sačekajte zelenu kvačicu (~5–8 min), pa preuzmite fajlove iz **Releases**.

## Nova verzija editora
Zamenite `html/index.html` novom verzijom (na GitHub-u: folder `html` → **Add file → Upload files**).
Build se pokreće sam. U novoj verziji moraju ostati:
1. `<script src="desktop-bridge.js"></script>` odmah posle `<meta charset="UTF-8">`;
2. `import('./lib/mp4-muxer.mjs')` i `import('./lib/webm-muxer.mjs')` (export bez interneta);
3. blokovi `cadria-novi-izgled` (novi izgled).
Najlakše: pošaljite novu verziju Claude-u da je pripremi.

## Snimanje fajlova
Export videa, titlovi, projekat, slike – sve ide **direktno na disk** preko prozora „Sačuvaj kao“.

## Bez interneta radi
Montaža, efekti, titlovi, export u MP4/WebM, mikrofon, snimanje fajlova.

## Internet traži
AI popravka i automatski titlovi (model se preuzima), praćenje lica, Google fontovi.

## Izvoz u druge formate (levi meni → Podešavanja)
GIF animacija, Apple ProRes (.mov), XML za Premiere/DaVinci i EDL.
ProRes radi i bez interneta (ffmpeg je ugrađen u program).

## Prečice
**F11** – ceo ekran, **F12** – alati za programere (za traženje grešaka).

## Napomene
- Pri prvom pokretanju Windows može prikazati *„Windows protected your PC“* → **More info → Run anyway**.
- Ako je bila instalirana stara verzija (Python/Edge), možete je ukloniti iz *Settings → Apps*.
