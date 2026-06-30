import { API_BASE_URL } from '../../../core/constants/api_config';

export function formatImages(images2d: any): string[] {
  let list: string[] = [];
  if (Array.isArray(images2d)) {
    list = images2d;
  } else if (typeof images2d === 'string' && images2d.trim()) {
    const trimmed = images2d.trim();
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) list = parsed;
        else list = [trimmed];
      } catch (e) {
        list = [trimmed];
      }
    } else if (trimmed.includes(',')) {
      list = trimmed.split(',').map((img) => img.trim()).filter(Boolean);
    } else {
      list = [trimmed];
    }
  }

  // Double JSON parse check to handle double-serialization e.g. ["[\"https://...\"]"]
  let resolvedList: string[] = [];
  for (const item of list) {
    if (typeof item === 'string' && item.trim()) {
      const trimmedItem = item.trim();
      if (trimmedItem.startsWith('[') && trimmedItem.endsWith(']')) {
        try {
          const parsed = JSON.parse(trimmedItem);
          if (Array.isArray(parsed)) {
            resolvedList.push(...parsed);
            continue;
          }
        } catch {}
      }
      resolvedList.push(trimmedItem);
    }
  }

  return resolvedList.map((img) => {
    if (!img) return '';
    let trimmedImg = img.trim();
    if (trimmedImg.startsWith('"') && trimmedImg.endsWith('"')) {
      trimmedImg = trimmedImg.slice(1, -1);
    }
    if (trimmedImg.startsWith('/') || trimmedImg.startsWith('uploads/')) {
      const cleanPath = trimmedImg.startsWith('/') ? trimmedImg : `/${trimmedImg}`;
      return `${API_BASE_URL}${cleanPath}`;
    }
    return trimmedImg;
  }).filter(Boolean);
}

export function formatModelUrl(url: string | null | undefined): string {
  if (!url) return '';
  const trimmed = url.trim();

  // 1. Google Drive direct link conversion
  const driveRegex = /(?:\/file\/d\/|id=)([a-zA-Z0-9_-]+)/;
  const match = trimmed.match(driveRegex);
  if (match && (trimmed.includes('drive.google.com') || trimmed.includes('docs.google.com'))) {
    const fileId = match[1];
    return `https://docs.google.com/uc?export=download&id=${fileId}`;
  }

  // 2. Full HTTP/HTTPS URLs
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  // 3. Local relative paths (e.g., /uploads/3d/...)
  if (trimmed.startsWith('/') || trimmed.startsWith('uploads/')) {
    const cleanPath = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
    return `${API_BASE_URL}${cleanPath}`;
  }

  // 4. Default: Plain filename uploaded directly to Supabase storage bucket "3d model"
  const bucketUrl = 'https://jvjzdxblwznjlhoxsjux.supabase.co/storage/v1/object/public/3d%20model';
  return `${bucketUrl}/${encodeURIComponent(trimmed)}`;
}

export function formatVND(price: string | number): string {
  const n = typeof price === 'string' ? parseFloat(price) : price;
  if (isNaN(n)) return '—';
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M₫`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K₫`;
  return `${Math.round(n)}₫`;
}

export function get3DHtml(modelUrl: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
      <style>
        html, body {
          overflow: hidden;
          width: 100%;
          height: 100%;
          margin: 0;
          padding: 0;
          background-color: #f7f9fa;
        }
        #canvas {
          width: 100%;
          height: 100%;
          touch-action: none;
          outline: none;
        }
        #loading {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background-color: rgba(247, 249, 250, 0.9);
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          z-index: 10;
        }
        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #F45B26;
          border-right: 4px solid #D12052;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .text {
          margin-top: 15px;
          font-size: 12px;
          font-weight: 900;
          color: #111111;
          letter-spacing: 1px;
          text-transform: uppercase;
        }
      </style>
      <script src="https://cdn.babylonjs.com/babylon.js"></script>
      <script src="https://cdn.babylonjs.com/loaders/babylonjs.loaders.min.js"></script>
    </head>
    <body>
      <div id="loading">
        <div class="spinner"></div>
        <div id="loading-text" class="text">Đang tải mô hình 3D... 0%</div>
      </div>
      <canvas id="canvas"></canvas>

      <script>
        const url = "${modelUrl}";
        const canvas = document.getElementById("canvas");
        
        const engine = new BABYLON.Engine(canvas, true, {
          preserveDrawingBuffer: false,
          stencil: false,
          disableWebGL2Support: false,
          powerPreference: "high-performance"
        });
        
        engine.setHardwareScalingLevel(1 / Math.min(window.devicePixelRatio || 1, 1.75));

        const scene = new BABYLON.Scene(engine);
        scene.clearColor = new BABYLON.Color4(0.97, 0.98, 0.98, 1);

        const camera = new BABYLON.ArcRotateCamera(
          "camera",
          -Math.PI / 2,
          Math.PI / 2.5,
          5,
          new BABYLON.Vector3(0, 0, 0),
          scene
        );
        camera.attachControl(canvas, true);
        camera.lowerRadiusLimit = 1.5;
        camera.upperRadiusLimit = 25;
        camera.useBouncingBehavior = true;
        camera.useAutoRotationBehavior = true;
        if (camera.autoRotationBehavior) {
          camera.autoRotationBehavior.idleRotationSpeed = 0.05;
        }

        const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
        light.intensity = 1.3;

        const loadingDiv = document.getElementById("loading");
        const loadingText = document.getElementById("loading-text");

        BABYLON.SceneLoader.ImportMesh(
          "",
          "",
          url,
          scene,
          function (meshes) {
            loadingDiv.style.display = "none";
            if (meshes.length > 0) {
              scene.createDefaultCameraOrLight(true, true, true);
              const activeCamera = scene.activeCamera;
              if (activeCamera) {
                activeCamera.attachControl(canvas, true);
                activeCamera.radius = activeCamera.radius * 0.75;
                const min = Math.max(0.1, activeCamera.radius * 0.15);
                const max = activeCamera.radius * 3.0;
                activeCamera.lowerRadiusLimit = min;
                activeCamera.upperRadiusLimit = max;
                activeCamera.useBouncingBehavior = true;
                activeCamera.useAutoRotationBehavior = true;
                if (activeCamera.autoRotationBehavior) {
                  activeCamera.autoRotationBehavior.idleRotationSpeed = 0.05;
                }
              }
            }
          },
          function (evt) {
            if (evt.lengthComputable && evt.total > 0) {
              const progress = Math.round((evt.loaded / evt.total) * 100);
              loadingText.innerText = "Đang tải mô hình 3D... " + progress + "%";
            }
          },
          function (scene, msg, exception) {
            console.error("Failed to load model:", msg, exception);
            loadingText.innerText = "Lỗi khi tải mô hình 3D";
            const spinner = document.querySelector(".spinner");
            if (spinner) spinner.style.display = "none";
          },
          ".glb"
        );

        engine.runRenderLoop(function () {
          scene.render();
        });

        window.addEventListener("resize", function () {
          engine.resize();
        });
      </script>
    </body>
    </html>
  `;
}
