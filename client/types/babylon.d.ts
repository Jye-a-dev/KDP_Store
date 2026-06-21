// Custom ambient type declarations for BabylonJS modules to resolve Next.js/TypeScript path mapping issues
declare module "@babylonjs/core" {
  export * from "@babylonjs/core/index";
}

declare module "@babylonjs/loaders/glTF" {
  export * from "@babylonjs/loaders/glTF/index";
}
