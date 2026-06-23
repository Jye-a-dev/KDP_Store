"use client";

import React, { useEffect, useRef, useState } from "react";
// @ts-ignore
import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, SceneLoader, Color4, AbstractMesh, ISceneLoaderProgressEvent } from "@babylonjs/core";
// @ts-ignore
import "@babylonjs/loaders/glTF"; // Registers GLTF/GLB loaders
import { formatModelUrl } from "@/utils/formatModelUrl";

interface BabylonViewerProps {
  url: string;
}

export default function BabylonViewer({ url }: BabylonViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cameraRef = useRef<ArcRotateCamera | null>(null);
  const rangeRef = useRef<HTMLInputElement | null>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [zoom, setZoom] = useState(50);

  const handleZoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    if (cameraRef.current) {
      const min = cameraRef.current.lowerRadiusLimit || 0.1;
      const max = cameraRef.current.upperRadiusLimit || 15;
      const percent = val / 100;
      // 0% = furthest (max radius), 100% = closest (min radius)
      cameraRef.current.radius = max - percent * (max - min);
    }
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    // 1. Initialize engine with optimizations
    const engine = new Engine(canvasRef.current, true, {
      preserveDrawingBuffer: false, // Turn off for better memory performance
      stencil: false,              // Stencil buffer not required for basic GLB
      disableWebGL2Support: false,
      powerPreference: "high-performance" // Request discrete GPU if available
    });
    
    // Limit pixel ratio scaling on high-density displays (e.g. Retina) for GPU rendering performance
    const devicePixelRatio = typeof window !== "undefined" ? window.devicePixelRatio : 1;
    engine.setHardwareScalingLevel(1 / Math.min(devicePixelRatio, 1.75));

    const scene = new Scene(engine);
    scene.clearColor = new Color4(0.97, 0.98, 0.98, 1); // #f7f9fa default background color

    // 2. Default camera setup
    const camera = new ArcRotateCamera(
      "camera",
      -Math.PI / 2,
      Math.PI / 2.5,
      5,
      new Vector3(0, 0, 0),
      scene
    );
    camera.attachControl(canvasRef.current, true);
    camera.inputs.removeByType("ArcRotateCameraMouseWheelInput"); // Disable mouse wheel zoom
    camera.lowerRadiusLimit = 1.5;
    camera.upperRadiusLimit = 25;
    camera.useBouncingBehavior = true;
    camera.useAutoRotationBehavior = true;
    if (camera.autoRotationBehavior) {
      camera.autoRotationBehavior.idleRotationSpeed = 0.05;
    }

    // 3. Simple optimized lighting
    const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
    light.intensity = 1.3;

    // 4. Loading Google Drive or direct GLB URL
    const directUrl = formatModelUrl(url);
    
    setLoading(true);
    setLoadingProgress(0);

    SceneLoader.ImportMesh(
      "",
      "",
      directUrl,
      scene,
      (meshes: AbstractMesh[]) => {
        setLoading(false);
        // Automatically frame camera to fit meshes bounding info
        if (meshes.length > 0) {
          scene.createDefaultCameraOrLight(true, true, true);
          const activeCamera = scene.activeCamera as ArcRotateCamera;
          if (activeCamera) {
            cameraRef.current = activeCamera;
            activeCamera.attachControl(canvasRef.current, true);
            
            // Disable mouse wheel zoom completely
            activeCamera.inputs.removeByType("ArcRotateCameraMouseWheelInput");

            // Re-apply camera constraints and auto-rotation behavior on auto camera
            activeCamera.radius = activeCamera.radius * 0.75; // Zoom 25% closer initially
            const min = Math.max(0.1, activeCamera.radius * 0.15);
            const max = activeCamera.radius * 3.0;
            activeCamera.lowerRadiusLimit = min;
            activeCamera.upperRadiusLimit = max;
            activeCamera.useBouncingBehavior = true;
            activeCamera.useAutoRotationBehavior = true;
            if (activeCamera.autoRotationBehavior) {
              activeCamera.autoRotationBehavior.idleRotationSpeed = 0.05;
            }

            // Sync initial zoom state
            const current = activeCamera.radius;
            const percent = ((max - current) / (max - min)) * 100;
            setZoom(Math.round(percent));
          }
        }
      },
      (evt: ISceneLoaderProgressEvent) => {
        if (evt.lengthComputable && evt.total > 0) {
          setLoadingProgress(Math.round((evt.loaded / evt.total) * 100));
        }
      },
      (scene: Scene, msg: string, exception?: any) => {
        console.error("Failed to load model in BabylonJS:", msg, exception);
        setLoading(false);
      },
      ".glb"
    );

    // 5. Render loop
    engine.runRenderLoop(() => {
      scene.render();
      // Sync zoom slider in real-time with camera radius changes (mouse wheel, pinch zoom, etc.)
      if (cameraRef.current && rangeRef.current) {
        const min = cameraRef.current.lowerRadiusLimit || 0.1;
        const max = cameraRef.current.upperRadiusLimit || 15;
        const current = cameraRef.current.radius;
        const percent = ((max - current) / (max - min)) * 100;
        rangeRef.current.value = Math.round(percent).toString();
      }
    });

    // 6. Resize observer
    const handleResize = () => {
      engine.resize();
    };
    window.addEventListener("resize", handleResize);

    // Cleanup to prevent GPU WebGL context leak
    return () => {
      window.removeEventListener("resize", handleResize);
      scene.dispose();
      engine.dispose();
    };
  }, [url]);

  return (
    <div className="relative w-full h-full min-h-87.5 md:min-h-100 flex items-center justify-center">
      <canvas ref={canvasRef} className="w-full h-full max-h-100 outline-none block touch-none" />
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#f7f9fa]/90 backdrop-blur-xs z-10">
          <div className="w-10 h-10 border-4 border-t-[#D12052] border-r-[#F45B26] border-neutral-200 rounded-full animate-spin"></div>
          <p className="mt-4 text-xs font-black uppercase text-[#111111] tracking-wider animate-pulse">
            Đang tải mô hình 3D... {loadingProgress}%
          </p>
        </div>
      )}
      {!loading && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-full border-2 border-[#111111] shadow-[4px_4px_0px_#111111] flex items-center gap-3.5 z-10 min-w-70 select-none justify-between">
          <button
            type="button"
            onClick={() => {
              if (cameraRef.current) {
                const max = cameraRef.current.upperRadiusLimit ?? 15;
                const min = cameraRef.current.lowerRadiusLimit ?? 0.1;
                const step = (max - min) * 0.1;
                cameraRef.current.radius = Math.min(max, cameraRef.current.radius + step);
              }
            }}
            className="w-6 h-6 flex items-center justify-center bg-neutral-100 hover:bg-neutral-200 border-2 border-[#111111] rounded-full text-[10px] font-bold cursor-pointer transition-colors shadow-[1px_1px_0px_#111111] active:translate-x-px active:translate-y-px active:shadow-none select-none"
          >
            ➖
          </button>
          <input
            ref={rangeRef}
            type="range"
            min="0"
            max="100"
            defaultValue={zoom}
            onChange={handleZoomChange}
            className="flex-1 accent-[#D12052] h-1.5 bg-neutral-200 rounded-lg appearance-none cursor-pointer outline-none border border-neutral-300"
          />
          <button
            type="button"
            onClick={() => {
              if (cameraRef.current) {
                const max = cameraRef.current.upperRadiusLimit ?? 15;
                const min = cameraRef.current.lowerRadiusLimit ?? 0.1;
                const step = (max - min) * 0.1;
                cameraRef.current.radius = Math.max(min, cameraRef.current.radius - step);
              }
            }}
            className="w-6 h-6 flex items-center justify-center bg-neutral-100 hover:bg-neutral-200 border-2 border-[#111111] rounded-full text-[10px] font-bold cursor-pointer transition-colors shadow-[1px_1px_0px_#111111] active:translate-x-px active:translate-y-px active:shadow-none select-none"
          >
            ➕
          </button>
        </div>
      )}
    </div>
  );
}
