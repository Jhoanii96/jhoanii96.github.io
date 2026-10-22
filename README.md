# Jhon.dev - Personal Portfolio & Data Engineering Hub

Sitio web personal y portafolio interactivo alojado en **GitHub Pages** (`https://jhoanii96.github.io`).

La arquitectura modular utiliza **Jekyll**, lo que permite mantener un `index.html` conciso (~12 líneas) e incluir cada sección (`home`, `about`, `qualification`, `services`, `projects`, `contact`) desde archivos HTML independientes en `_includes/sections/`.

---

## 🚀 Cómo ejecutar y previsualizar localmente

Dado que el proyecto utiliza etiquetas Liquid (`{% include ... %}` y `{{ content }}`), abrir `index.html` directamente en el navegador con doble clic mostrará las etiquetas sin procesar. Para compilar y previsualizar el sitio localmente puedes usar cualquiera de las siguientes opciones:

---

### Jekyll nativo (Recomendado para entorno Ruby)

Si tienes **Ruby** y **Jekyll** instalados en tu máquina:

1. Instala Bundler y las dependencias (si aplica):
   ```bash
   gem install jekyll bundler
   ```
2. Ejecuta el servidor local de Jekyll:
   ```bash
   jekyll serve
   ```
   > **Nota en Windows:** Si deseas recarga automática y evitar problemas de caché, puedes usar:
   > ```bash
   > jekyll serve --livereload
   > ```
3. Abre tu navegador en:
   ```text
   http://localhost:4000
   ```


---

## 📁 Estructura del proyecto

```text
jhoanii96.github.io/
├── _config.yml               # Configuración global del sitio y Jekyll
├── _layouts/
│   └── default.html          # Plantilla base: Head, Tailwind, Nav, Footer, Modal y Scripts
├── _includes/
│   └── sections/
│       ├── home.html         # Sección Home / Hero
│       ├── about.html        # Sección Sobre mí (Bio, Skill Matrix, Certificaciones)
│       ├── qualification.html# Sección Experiencia Laboral y Educación
│       ├── services.html     # Sección Servicios y Consultoría
│       ├── projects.html     # Sección Proyectos y Casos de Estudio
│       └── contact.html      # Sección Contacto y Redes
├── assets/                   # Archivos estáticos
│   ├── css/                  # Estilos adicionales
│   ├── files/                # Documentos, proyectos adjuntos y CVs
│   ├── img/                  # Imágenes, diagramas y fotos de perfil
│   └── js/                   # Scripts auxiliares (estrellas interactivas, etc.)
├── index.html                # Punto de entrada modular (llama a cada sección)
└── README.md                 # Guía de ejecución y documentación
```

---

## 🌐 Despliegue en GitHub Pages

El repositorio debe llamarse `usuario.github.io` para publicar un sitio de usuario, como
este proyecto. En GitHub, comprueba que la rama `main` esté configurada como fuente de
despliegue en **Settings > Pages > Build and deployment > Deploy from a branch**.

### Publicar desde Visual Studio Code

1. Guarda todos los archivos modificados.
2. Abre **Source Control** (`Ctrl + Shift + G`).
3. Revisa los cambios y pulsa **+** junto a cada archivo, o selecciona **Stage All Changes**.
4. Escribe un mensaje descriptivo, por ejemplo:
   ```text
   Update portfolio projects
   ```
5. Pulsa **Commit**.
6. Selecciona **Sync Changes** o **Push** para enviar el commit a GitHub.

También puedes ejecutar el mismo flujo desde la terminal integrada:

```bash
git status
git add .
git commit -m "Update portfolio projects"
git push origin main
```

Si es la primera publicación del repositorio, configura el remoto y la rama antes del
primer `push`:

```bash
git remote add origin https://github.com/usuario/usuario.github.io.git
git branch -M main
git push -u origin main
```

Al hacer `git push` a la rama `main`:
1. GitHub Pages detecta automáticamente el archivo `_config.yml` y la estructura Jekyll.
2. Compila el sitio en sus servidores e inyecta los `_includes/` y `_layouts/`.
3. Tu sitio se actualiza en minutos en `https://jhoanii96.github.io`.

> **Nota:** Los cambios pueden tardar unos minutos en aparecer. Si el despliegue falla,
> revisa la pestaña **Actions** del repositorio y confirma que `_site/` no se está
> subiendo: GitHub Pages debe generar esa carpeta durante el despliegue.
