'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Renderer, Program, Mesh, Color, Plane, Texture } from 'ogl';
import './ElasticMesh.css';

export interface ElasticMeshProps {
  image?: string;
  color1?: string;
  color2?: string;
  highlight?: string;
  showGrid?: boolean;
  gridDensity?: number;
  gridOpacity?: number;
  gridColor?: string;
  borderRadius?: number | string;
  stiffness?: number;
  damping?: number;
  grabRadius?: number;
  pull?: number;
  wobble?: number;
  tilt?: number;
  shading?: number;
  resolution?: number;
  interaction?: 'drag' | 'hover' | 'click' | 'none';
  enabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

const vertexShader = /* glsl */ `
  precision highp float;
  attribute vec3 position;
  attribute vec2 uv;
  attribute vec3 normal;

  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;
  uniform mat3 normalMatrix;

  uniform float uTime;
  uniform vec2 uPointer;
  uniform vec2 uPointerVel;
  uniform float uGrab;
  uniform float uGrabRadius;
  uniform float uPull;
  uniform float uWobble;
  uniform float uTilt;

  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying float vDist;

  void main() {
    vUv = uv;
    vec3 pos = position;

    // Distance to interactive pointer (in normalized space [-1, 1])
    vec2 pDiff = pos.xy - uPointer;
    float d = length(pDiff);
    vDist = d;

    float radius = max(uGrabRadius, 0.001);
    float influence = smoothstep(radius, 0.0, d);

    // Elastic displacement in XY
    pos.xy += uPointerVel * influence * uPull;

    // Depth displacement & wobble waves
    float wave = sin(d * 12.0 - uTime * 3.5) * exp(-d * 2.5) * uWobble;
    pos.z += (influence * uGrab * 0.4 + wave * 0.15);

    // 3D tilt based on mouse position
    pos.z += (pos.x * uPointer.x + pos.y * uPointer.y) * (uTilt * 0.03);

    vPosition = pos;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform vec3 uHighlight;
  uniform float uUseTexture;
  uniform sampler2D uTexture;
  uniform float uShading;
  uniform float uShowGrid;
  uniform float uGridDensity;
  uniform float uGridOpacity;
  uniform vec3 uGridColor;

  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying float vDist;

  void main() {
    vec3 color = vec3(0.0);

    if (uUseTexture > 0.5) {
      vec4 tex = texture2D(uTexture, vUv);
      color = tex.rgb;
    } else {
      // Smooth gradient angle
      float grad = clamp(vUv.x * 0.7 + vUv.y * 0.7, 0.0, 1.0);
      color = mix(uColor1, uColor2, grad);
    }

    // Dynamic directional & ambient shading
    vec3 lightDir = normalize(vec3(0.5, 0.7, 1.0));
    float diff = max(dot(vNormal, lightDir), 0.0);
    vec3 viewDir = vec3(0.0, 0.0, 1.0);
    vec3 halfVector = normalize(lightDir + viewDir);
    float spec = pow(max(dot(vNormal, halfVector), 0.0), 32.0);

    // Specular highlight and diffuse lighting
    color += uHighlight * spec * (0.35 * uShading);
    color += color * (diff - 0.5) * (0.4 * uShading);

    // Grid overlay
    if (uShowGrid > 0.5) {
      vec2 grid = abs(fract(vUv * uGridDensity - 0.5) - 0.5) / fwidth(vUv * uGridDensity);
      float line = min(grid.x, grid.y);
      float gridMask = 1.0 - min(line, 1.0);
      color = mix(color, uGridColor, gridMask * uGridOpacity);
    }

    gl_FragColor = vec4(color, 1.0);
  }
`;

function hexToRgb(hex: string): [number, number, number] {
  let c = hex.replace('#', '');
  if (c.length === 3) {
    c = c.split('').map((char) => char + char).join('');
  }
  const num = parseInt(c, 16) || 0;
  return [(num >> 16 & 255) / 255, (num >> 8 & 255) / 255, (num & 255) / 255];
}

export default function ElasticMesh({
  image,
  color1 = '#921E1F',
  color2 = '#3E0D0E',
  highlight = '#ffffff',
  showGrid = false,
  gridDensity = 24,
  gridOpacity = 0.15,
  gridColor = '#ffffff',
  borderRadius = 0,
  stiffness = 0.08,
  damping = 0.88,
  grabRadius = 0.6,
  pull = 0.35,
  wobble = 0.4,
  tilt = 14,
  shading = 0.8,
  resolution = 36,
  interaction = 'hover',
  enabled = true,
  className = '',
  style = {},
  children,
}: ElasticMeshProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !enabled || !containerRef.current) return;

    const container = containerRef.current;
    let animationFrameId: number;
    let isDestroyed = false;

    // Interactive physics state
    const pointer = { x: 0, y: 0 };
    const targetPointer = { x: 0, y: 0 };
    const pointerVel = { x: 0, y: 0 };
    let isGrabbing = interaction === 'hover';
    let isHovering = false;
    let lastTime = performance.now();

    try {
      const renderer = new Renderer({
        alpha: true,
        antialias: true,
        dpr: Math.min(window.devicePixelRatio || 1, 2),
        powerPreference: 'high-performance',
      });

      const gl = renderer.gl;
      if (!gl) return;

      container.appendChild(gl.canvas);

      // Plane geometry
      const geometry = new Plane(gl, {
        width: 2,
        height: 2,
        widthSegments: resolution,
        heightSegments: resolution,
      });

      // Texture
      let textureUniform: Texture | null = null;
      let useTextureValue = 0;

      if (image) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = image;
        const texture = new Texture(gl);
        img.onload = () => {
          if (isDestroyed) return;
          texture.image = img;
          if (program) {
            program.uniforms.uUseTexture.value = 1.0;
          }
        };
        textureUniform = texture;
        useTextureValue = 0; // will switch to 1 on image load
      }

      const rgb1 = hexToRgb(color1);
      const rgb2 = hexToRgb(color2);
      const rgbHi = hexToRgb(highlight);
      const rgbGrid = hexToRgb(gridColor);

      const program = new Program(gl, {
        vertex: vertexShader,
        fragment: fragmentShader,
        uniforms: {
          uTime: { value: 0 },
          uPointer: { value: [0, 0] },
          uPointerVel: { value: [0, 0] },
          uGrab: { value: 0 },
          uGrabRadius: { value: grabRadius },
          uPull: { value: pull },
          uWobble: { value: wobble },
          uTilt: { value: tilt },
          uShading: { value: shading },
          uColor1: { value: new Color(rgb1[0], rgb1[1], rgb1[2]) },
          uColor2: { value: new Color(rgb2[0], rgb2[1], rgb2[2]) },
          uHighlight: { value: new Color(rgbHi[0], rgbHi[1], rgbHi[2]) },
          uUseTexture: { value: useTextureValue },
          uTexture: { value: textureUniform || new Texture(gl) },
          uShowGrid: { value: showGrid ? 1.0 : 0.0 },
          uGridDensity: { value: gridDensity },
          uGridOpacity: { value: gridOpacity },
          uGridColor: { value: new Color(rgbGrid[0], rgbGrid[1], rgbGrid[2]) },
        },
        transparent: true,
        cullFace: false,
      });

      const mesh = new Mesh(gl, { geometry, program });

      // Resize handler
      const resize = () => {
        if (!container || !renderer) return;
        const width = container.clientWidth || 300;
        const height = container.clientHeight || 200;
        renderer.setSize(width, height);
      };

      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(container);
      resize();

      // Coordinates helper
      const updateCoords = (clientX: number, clientY: number) => {
        const rect = container.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;
        const x = ((clientX - rect.left) / rect.width) * 2 - 1;
        const y = -(((clientY - rect.top) / rect.height) * 2 - 1);
        targetPointer.x = x;
        targetPointer.y = y;
      };

      // Pointer event listeners
      const handlePointerEnter = (e: PointerEvent) => {
        isHovering = true;
        updateCoords(e.clientX, e.clientY);
        if (interaction === 'hover') {
          isGrabbing = true;
        }
      };

      const handlePointerMove = (e: PointerEvent) => {
        updateCoords(e.clientX, e.clientY);
      };

      const handlePointerDown = (e: PointerEvent) => {
        updateCoords(e.clientX, e.clientY);
        if (interaction === 'drag' || interaction === 'click') {
          isGrabbing = true;
        }
      };

      const handlePointerUp = () => {
        if (interaction === 'drag' || interaction === 'click') {
          isGrabbing = false;
        }
      };

      const handlePointerLeave = () => {
        isHovering = false;
        if (interaction === 'hover') {
          isGrabbing = false;
        } else if (interaction === 'drag') {
          isGrabbing = false;
        }
        // Smoothly return target to center
        targetPointer.x = 0;
        targetPointer.y = 0;
      };

      container.addEventListener('pointerenter', handlePointerEnter);
      container.addEventListener('pointermove', handlePointerMove);
      container.addEventListener('pointerdown', handlePointerDown);
      window.addEventListener('pointerup', handlePointerUp);
      container.addEventListener('pointerleave', handlePointerLeave);

      // Render loop
      const render = (time: number) => {
        if (isDestroyed) return;

        const now = time * 0.001;
        const dt = Math.min((time - lastTime) * 0.001, 0.1);
        lastTime = time;

        // Spring physics for pointer
        const dx = targetPointer.x - pointer.x;
        const dy = targetPointer.y - pointer.y;

        pointerVel.x = (pointerVel.x + dx * stiffness) * damping;
        pointerVel.y = (pointerVel.y + dy * stiffness) * damping;

        pointer.x += pointerVel.x;
        pointer.y += pointerVel.y;

        // Grab transition
        const currentGrab = program.uniforms.uGrab.value as number;
        const targetGrab = (isGrabbing || (interaction === 'hover' && isHovering)) ? 1.0 : 0.0;
        program.uniforms.uGrab.value = currentGrab + (targetGrab - currentGrab) * 0.1;

        program.uniforms.uTime.value = now;
        program.uniforms.uPointer.value = [pointer.x, pointer.y];
        program.uniforms.uPointerVel.value = [pointerVel.x, pointerVel.y];

        renderer.render({ scene: mesh });
        animationFrameId = requestAnimationFrame(render);
      };

      animationFrameId = requestAnimationFrame(render);

      // Cleanup
      return () => {
        isDestroyed = true;
        cancelAnimationFrame(animationFrameId);
        resizeObserver.disconnect();

        container.removeEventListener('pointerenter', handlePointerEnter);
        container.removeEventListener('pointermove', handlePointerMove);
        container.removeEventListener('pointerdown', handlePointerDown);
        window.removeEventListener('pointerup', handlePointerUp);
        container.removeEventListener('pointerleave', handlePointerLeave);

        if (gl && gl.canvas && gl.canvas.parentNode === container) {
          container.removeChild(gl.canvas);
        }
      };
    } catch (err) {
      console.error('Failed to initialize ElasticMesh WebGL:', err);
    }
  }, [
    isClient,
    image,
    color1,
    color2,
    highlight,
    showGrid,
    gridDensity,
    gridOpacity,
    gridColor,
    stiffness,
    damping,
    grabRadius,
    pull,
    wobble,
    tilt,
    shading,
    resolution,
    interaction,
    enabled,
  ]);

  return (
    <div
      ref={containerRef}
      className={`elastic-mesh-container ${className}`}
      style={{
        borderRadius: typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius,
        ...style,
      }}
    >
      {children && (
        <div className="relative z-10 w-full h-full pointer-events-none [&_*]:pointer-events-auto">
          {children}
        </div>
      )}
    </div>
  );
}
