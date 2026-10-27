/// <reference types="nativewind/types" />

// Allow side-effect imports of global stylesheets (e.g. `import './global.css'`).
// NativeWind processes these through Metro; the module itself has no runtime export.
declare module '*.css' {}
