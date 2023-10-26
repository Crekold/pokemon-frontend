# Pokémon Team Builder 🎮

¡Bienvenido a Pokémon Team Builder! Tu plataforma para crear equipos Pokémon competitivos. Regístrate y empieza a armar tu equipo de ensueño con estadísticas detalladas.

## 🌟 Funcionalidades principales:

- **Registro y Autenticación** 🔒: Usa Auth0 para un registro y acceso seguro.
- **Creación de Equipos Pokémon** 🥇: Construye equipos competitivos y visualiza estadísticas.
- **Perfil de Usuario** 👤: Accede a tu perfil y gestiona tus equipos creados.
- **Información Detallada de Pokémon** 📊: Examina estadísticas detalladas y características de cada Pokémon.
- **Asistencia de Inteligencia Artificial** 🤖: Utiliza la API de OpenAI para obtener recomendaciones y consejos sobre cómo formar los mejores equipos Pokémon.

## 🛠 Instalación y Configuración

### Requisitos previos:

- Node.js y npm instalados.

### Pasos para la instalación:

1. **Instalación de dependencias**:

   ```bash
   npm install
   ```

2. **Configuración de Auth0**:

   - Copia `auth_config.json.example` a un nuevo archivo en la misma carpeta llamado `auth_config.json`.
   - Rellena el archivo con tus credenciales de Auth0:

   ```json
   {
     "domain": "<YOUR AUTH0 DOMAIN>",
     "clientId": "<YOUR AUTH0 CLIENT ID>"
   }
   ```

## 🚀 Desarrollo

Para trabajar en el proyecto y visualizar los cambios en tiempo real:

```bash
npm run serve
```

## 📦 Compilación para producción:

```bash
npm run build
```

## 🖊 Correcciones y estilo de código:

Si necesitas verificar y corregir el estilo de código:

```bash
npm run lint
```

## 👋 Contribuciones:

¡Nos encantaría tener tu ayuda para mejorar la plataforma! Si tienes sugerencias o encuentras errores, no dudes en abrir un issue en la sección de problemas del repositorio.
