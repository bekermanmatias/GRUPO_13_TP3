# GRUPO_13_TP3

- Rau Bekerman Matias
- Borda Patricio
- Borda Lucio

# App de Recetas

Una aplicación móvil desarrollada con React Native y Expo que permite a los usuarios descubrir, guardar y gestionar recetas de cocina. La aplicación incluye funcionalidades de autenticación de usuarios, búsqueda de recetas por ingredientes, y gestión de favoritos.

## Características

- Autenticación de usuarios (registro e inicio de sesión)
- Búsqueda de recetas por nombre o ingredientes
- Guardado de recetas favoritas
- Modo oscuro/claro
- Lista de ingredientes interactiva
- Visualización detallada de recetas
- Interfaz adaptativa para diferentes dispositivos

## Librerías Principales

- **React Native**: Framework principal para el desarrollo móvil
- **Expo**: Plataforma de desarrollo para React Native
- **Firebase**: 
  - Authentication para gestión de usuarios
  - Firestore para base de datos en tiempo real
- **Expo Router**: Navegación entre pantallas
- **AsyncStorage**: Almacenamiento local persistente
- **Expo Icons**: Iconografía de la aplicación

## Instalación y Uso

### Prerrequisitos

- Node.js (versión 14 o superior)
- npm o yarn
- Expo CLI

### Pasos de Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/bekermanmatias/GRUPO_13_TP3.git
cd GRUPO_13_TP3
cd app-recetas
```

2. Instala las dependencias:
```bash
npm install
```

3. Configuración de Firebase:
   - La configuración de Firebase ya está incluida en el archivo `firebaseConfig.ts` por motivos académicos
   - En un proyecto real, estas credenciales deberían estar en variables de entorno
   - El proyecto ya está configurado con:
     - Firebase Authentication para gestión de usuarios
     - Cloud Firestore para almacenamiento de datos

4. Inicia la aplicación:
```bash
npx expo start
```

5. Ejecución de la aplicación:
   - IMPORTANTE: Debido a problemas con Firebase en Expo Go, la aplicación solo funciona correctamente en navegador
   - Presiona 'w' cuando inicie el servidor para abrir en navegador web o abrir el qr en tu dispositivo móvil

## En caso de problemas:

Limpiar caché con:

```bash
npx expo start --clear
```

##  Uso de la Aplicación

1. Regístrate o inicia sesión
2. Explora recetas en la pestaña principal
3. Busca recetas por ingredientes
4. Al entrar en una receta podrás:
   - Ver la lista completa de ingredientes
   - Marcar los ingredientes que ya tienes (se guardan automáticamente)
   - Visualizar los pasos detallados de preparación
   - Guardar la receta en favoritos
5. En la sección de ingredientes puedes:
   - Buscar recetas por los ingredientes que tengas disponibles
   - Ver recetas sugeridas según tus búsquedas
6. Dentro de perfil, podes seleccionar el tema

