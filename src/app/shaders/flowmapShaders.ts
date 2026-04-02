export const flowmapVert = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = vec4(position, 1.0); }
`;

export const flowmapFrag = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uFlowMap;
  uniform vec2      uMousePosition;
  uniform float     uFalloff;
  uniform float     uDissipation;
  uniform vec2      uVelocity;
  uniform float     uAspect;

  void main() {
    vec4 color = texture2D(uFlowMap, vUv) * uDissipation;
    vec2 mouseUv = (uMousePosition + 1.0) * 0.5;
    vec2 cursor  = vUv - mouseUv;
    cursor.x    *= uAspect;
    vec3 stamp = vec3(
      uVelocity * vec2(1.0, -1.0),
      1.0 - pow(1.0 - min(1.0, length(uVelocity)), 3.0)
    );
    float falloff = smoothstep(uFalloff, 0.0, length(cursor));
    color.rgb = mix(color.rgb, stamp, vec3(falloff));
    gl_FragColor = color;
  }
`;

export const displacementVert = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = vec4(position, 1.0); }
`;

export const displacementFrag = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uRenderTexture;
  uniform sampler2D uFlowTexture;
  uniform float     uDisplacement;
  uniform float     uRgbSplit;

  void main() {
    vec4 flow    = texture2D(uFlowTexture, vUv);
    vec2 distort = vUv - flow.xy * uDisplacement;
    float r  = texture2D(uRenderTexture, distort + flow.xy * uRgbSplit).r;
    float gr = texture2D(uRenderTexture, distort).g;
    float b  = texture2D(uRenderTexture, distort - flow.xy * uRgbSplit).b;
    float mixVal = clamp((abs(flow.r) + abs(flow.g) + abs(flow.b)) * 1.5, 0.0, 1.0);
    vec4 base = texture2D(uRenderTexture, distort);
    gl_FragColor = mix(base, vec4(r, gr, b, base.a), mixVal);
  }
`;
