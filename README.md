# EventTech

Prototipo académico estático para gestionar inventario, cotizaciones, reservas, disponibilidad por fecha y pagos.

## Ver el prototipo en local

Abre `index.html` en un navegador. La aplicación no requiere instalar paquetes ni configurar un servidor.

## Publicar con GitHub Pages

1. Inicia sesión en GitHub con la cuenta `eventTech`.
2. Crea un repositorio nuevo llamado **`eventtech`** y selecciona visibilidad **Public**.
3. Extrae el archivo `EventTech-GitHub-Pages.zip` en tu computador.
4. En el nuevo repositorio, selecciona **Add file → Upload files** y arrastra los archivos extraídos directamente a la raíz:
   - `index.html`
   - `styles.css`
   - `app.js`
   - `.nojekyll`
   - `README.md`
5. Confirma la carga con **Commit changes**.
6. Abre **Settings → Pages**. En **Build and deployment**, elige **Deploy from a branch**, selecciona la rama **main** y la carpeta **/(root)**, y pulsa **Save**.
7. Cuando GitHub Pages termine la publicación, la dirección será:

   `https://eventtech.github.io/eventtech/`

Puede tardar unos minutos en quedar disponible. Si la página muestra un error 404, revisa que `index.html` esté en la raíz del repositorio y espera un poco más.

## Alcance y datos

- Es una aplicación estática: GitHub Pages solo aloja los archivos; no hay servidor, base de datos, cuentas de usuario ni pasarela de pagos.
- Las operaciones y datos de ejemplo se guardan en el `localStorage` de cada navegador. Cada persona que abra el enlace tendrá sus propios datos en ese dispositivo.
- El prototipo usa datos ficticios. No ingreses información personal o financiera real.
