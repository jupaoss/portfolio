import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { flowmapVert, flowmapFrag, displacementVert, displacementFrag } from '@/app/shaders/flowmapShaders';

interface UseFlowmapOptions {
  src: string;
  falloff?: number;
  dissipation?: number;
  displacement?: number;
  rgbSplit?: number;
}

export const useFlowmap = ({
  src,
  falloff = 0.08,
  dissipation = 0.975,
  displacement = 0.10,
  rgbSplit = 0.010,
}: UseFlowmapOptions) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const resizeFnRef  = useRef<(() => void) | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas    = canvasRef.current;
    if (!container || !canvas) return;

    let W = Math.max(1, container.offsetWidth);
    let H = Math.max(1, container.offsetHeight);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(W, H, false);
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    renderer.autoClear = false;

    const rtP: THREE.RenderTargetOptions = {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      type: THREE.HalfFloatType,
    };
    let rtA     = new THREE.WebGLRenderTarget(W, H, rtP);
    let rtB     = new THREE.WebGLRenderTarget(W, H, rtP);
    let sceneRT = new THREE.WebGLRenderTarget(W, H, { ...rtP, type: THREE.UnsignedByteType });

    const ortho = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const quad  = new THREE.PlaneGeometry(2, 2);

    // Scene
    const tex = new THREE.TextureLoader().load(src);
    const imageScene = new THREE.Scene();
    imageScene.add(new THREE.Mesh(quad.clone(), new THREE.MeshBasicMaterial({ map: tex })));

    // Flowmap pass
    const flowU = {
      uFlowMap:       { value: null as THREE.Texture | null },
      uMousePosition: { value: new THREE.Vector2(0, 0) },
      uFalloff:       { value: falloff },
      uDissipation:   { value: dissipation },
      uVelocity:      { value: new THREE.Vector2(0, 0) },
      uAspect:        { value: W / H },
    };
    const flowScene = new THREE.Scene();
    flowScene.add(new THREE.Mesh(quad.clone(), new THREE.ShaderMaterial({
      uniforms: flowU,
      vertexShader: flowmapVert,
      fragmentShader: flowmapFrag,
    })));

    // Displacement pass
    const dispU = {
      uRenderTexture: { value: null as THREE.Texture | null },
      uFlowTexture:   { value: null as THREE.Texture | null },
      uDisplacement:  { value: displacement },
      uRgbSplit:      { value: rgbSplit },
    };
    const dispScene = new THREE.Scene();
    dispScene.add(new THREE.Mesh(quad.clone(), new THREE.ShaderMaterial({
      uniforms: dispU,
      vertexShader: displacementVert,
      fragmentShader: displacementFrag,
    })));

    // Mouse
    const mouse = new THREE.Vector2(0, 0);
    const lastMouse = new THREE.Vector2(0, 0);
    const velocity = new THREE.Vector2(0, 0);
    let updateVel = false;

    const onMouseMove = (e: MouseEvent) => {
      const r = container.getBoundingClientRect();
      lastMouse.copy(mouse);
      mouse.set(
        ((e.clientX - r.left) / W) * 2 - 1,
        -(((e.clientY - r.top) / H) * 2 - 1),
      );
      velocity.set(
        (mouse.x - lastMouse.x) / 0.016,
        (mouse.y - lastMouse.y) / 0.016,
      );
      updateVel = true;
    };
    container.addEventListener('mousemove', onMouseMove);

    const onResize = () => {
      const newW = container.offsetWidth;
      const newH = container.offsetHeight;
      if (newW === 0 || newH === 0) return;
      W = newW; H = newH;
      renderer.setSize(W, H, false);
      rtA.setSize(W, H); rtB.setSize(W, H); sceneRT.setSize(W, H);
      flowU.uAspect.value = W / H;
    };
    resizeFnRef.current = onResize;
    window.addEventListener('resize', onResize);

    const ro = new ResizeObserver(onResize);
    ro.observe(container);

    const tick = () => {
      if (W === 0 || H === 0) return;

      // 1. Render image to offscreen RT
      renderer.setRenderTarget(sceneRT);
      renderer.clear();
      renderer.render(imageScene, ortho);

      // 2. Ping-pong flowmap
      if (!updateVel) {
        velocity.set(
          THREE.MathUtils.lerp(velocity.x, 0, 0.5),
          THREE.MathUtils.lerp(velocity.y, 0, 0.5),
        );
      }
      updateVel = false;
      flowU.uMousePosition.value.copy(mouse);
      flowU.uVelocity.value.set(
        THREE.MathUtils.lerp(velocity.x, 0, 0.1),
        THREE.MathUtils.lerp(velocity.y, 0, 0.1),
      );
      flowU.uFlowMap.value = rtA.texture;
      renderer.setRenderTarget(rtB);
      renderer.clear();
      renderer.render(flowScene, ortho);
      const tmp = rtA; rtA = rtB; rtB = tmp;

      // 3. Displacement + RGB → screen
      dispU.uRenderTexture.value = sceneRT.texture;
      dispU.uFlowTexture.value   = rtA.texture;
      renderer.setRenderTarget(null);
      renderer.clear();
      renderer.render(dispScene, ortho);
    };

    gsap.ticker.add(tick);

    return () => {
      resizeFnRef.current = null;
      gsap.ticker.remove(tick);
      container.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      ro.disconnect();
      rtA.dispose(); rtB.dispose(); sceneRT.dispose();
      renderer.dispose();
      tex.dispose();
    };
  }, [src, falloff, dissipation, displacement, rgbSplit]);

  const resize = () => resizeFnRef.current?.();

  return { containerRef, canvasRef, resize };
};
