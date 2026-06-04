# Operación Goldra

Web estática para una despedida en clave de briefing clasificado. Es una landing móvil-first, sin backend, sin login, sin base de datos y sin frameworks.

La web está pensada para compartirse por enlace, no para posicionarse ni indexarse.

## Privacidad

La web no usa nombres reales. El novio aparece como `Sujeto raptado` y los grupos aparecen como `Comando Avanzadilla`, `Comando Extracción` y `Comando Primos`. El punto de extracción se mantiene clasificado y no tiene enlace público.

## Abrir localmente

Desde la raíz del proyecto:

```bash
python -m http.server 8080
```

Entrar en:

```text
http://localhost:8080
```

## Subir a GitHub

```bash
git init
git add .
git commit -m "Publicacion inicial Operacion Goldra"
git branch -M main
git remote add origin URL_DEL_REPO
git push -u origin main
```

## Desplegar en Vercel

1. Importar el repositorio.
2. Framework: Other.
3. Build command: vacío.
4. Output directory: vacío o raíz.
5. Deploy.

## Cambiar playlist

Edita el enlace del botón `Abrir playlist` en la sección `Playlist oficial de la operación` de `index.html`.

## Música

Coloca el archivo de audio en `assets/intro.mp3`. La música empieza tras pulsar el botón rojo de entrada y se puede pausar o reactivar con el botón flotante. No uses música con derechos si la web se publica públicamente.

## Cambiar mapas

Edita los botones de la sección `Mapas de misión` en `index.html`. Cada enlace está en el atributo `href` de su botón.

## Cambiar lista de suministros

Edita la sección `Suministros disponibles` en `index.html`. Hay un comentario preparado para pegar la lista final de bebidas y marcas cuando esté cerrada.

## Cambiar parche/logo

Sustituye `parche_risto.jpeg` en la raíz del proyecto por la nueva imagen manteniendo el mismo nombre. La pantalla inicial, el hero, el favicon, las previsualizaciones sociales y el footer usan ese archivo directamente.

## Cambiar textos del planning

Edita la sección `Planning operativo` en `index.html`.

## Pantalla inicial

Al cargar la web aparece una entrada clasificada con el emblema `parche_risto.jpeg` y un botón rojo. Al pulsarlo, se guarda la entrada en `sessionStorage` para no repetirla durante la misma sesión. En el footer hay un botón `Repetir entrada` que limpia ese estado y vuelve a mostrar la pantalla inicial.
