(function () {
    const canvas = document.getElementById('shader-canvas-ANIMATION_2');

    function syncSize() {
        const w = canvas.clientWidth || 1280;
        const h = canvas.clientHeight || 720;
        if (canvas.width !== w || canvas.height !== h) {
            canvas.width = w;
            canvas.height = h;
        }
    }
    if (typeof ResizeObserver !== 'undefined') {
        new ResizeObserver(syncSize).observe(canvas);
    }
    syncSize();

    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return;

    const vs = `attribute vec2 a_position;
    varying vec2 v_texCoord;
    void main() {
        v_texCoord = a_position * 0.5 + 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
    }`;

    const fs = `precision highp float;

    uniform float u_time;
    uniform vec2 u_resolution;
    uniform vec2 u_mouse;

    varying vec2 v_texCoord;

    float hash(float n) { return fract(sin(n) * 43758.5453123); }
    float hash2(vec2 p) {
        p = fract(p * vec2(123.34, 456.21));
        p += dot(p, p + 45.32);
        return fract(p.x * p.y);
    }
    vec2 hash22(vec2 p) {
        float n = sin(dot(p, vec2(127.1, 311.7)));
        return fract(vec2(n, n + 1.0) * 43758.5453123);
    }

    float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        float a = hash2(i);
        float b = hash2(i + vec2(1.0, 0.0));
        float c = hash2(i + vec2(0.0, 1.0));
        float d = hash2(i + vec2(1.0, 1.0));
        return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
    }

    float fbm(vec2 p) {
        float value = 0.0;
        float amplitude = 0.5;
        for (int i = 0; i < 5; i++) {
            value += amplitude * noise(p);
            p *= 2.0;
            amplitude *= 0.5;
        }
        return value;
    }

    void main() {
        vec2 uv = v_texCoord;
        vec2 p = (uv - 0.5) * u_resolution.xy / min(u_resolution.x, u_resolution.y);
        float aspect = u_resolution.x / u_resolution.y;

        // Deep space background
        vec3 color = vec3(0.005, 0.0, 0.015);

        // Nebula background with FBM — moves slowly
        float nebula1 = fbm(p * 1.5 + u_time * 0.02);
        float nebula2 = fbm(p * 2.0 - u_time * 0.015 + vec2(5.2, 1.3));
        float nebula3 = fbm(p * 0.8 + u_time * 0.01);

        vec3 nebulaColor1 = mix(vec3(0.0, 0.05, 0.15), vec3(0.0, 0.2, 0.4), nebula1);
        vec3 nebulaColor2 = mix(vec3(0.15, 0.0, 0.3), vec3(0.4, 0.0, 0.5), nebula2);
        vec3 nebulaColor3 = mix(vec3(0.05, 0.0, 0.1), vec3(0.1, 0.0, 0.2), nebula3);

        color += nebulaColor1 * 0.15 * nebula1;
        color += nebulaColor2 * 0.12 * nebula2;
        color += nebulaColor3 * 0.08 * nebula3;

        // Distant galaxy glow — drifts
        float galaxy = exp(-length(p - vec2(0.3 + sin(u_time * 0.01) * 0.05, 0.2 + cos(u_time * 0.012) * 0.05)) * 3.0);
        color += vec3(0.1, 0.05, 0.2) * galaxy * 0.3;

        // Mouse-reactive glow
        vec2 mouseNorm = u_mouse / u_resolution;
        vec2 mouseP = (mouseNorm - 0.5) * vec2(aspect, 1.0);
        float mouseGlow = exp(-length(p - mouseP) * 4.0) * 0.3;
        color += vec3(0.1, 0.2, 0.3) * mouseGlow;

        // Star layers with drift — parallax movement
        vec2 drift = vec2(u_time * 0.003, u_time * 0.001);

        for(float layer = 0.0; layer < 5.0; layer++) {
            float density = mix(0.995, 0.97, layer / 4.0);
            float baseSize = mix(0.003, 0.015, layer / 4.0);
            float brightness = mix(0.8, 1.5, layer / 4.0);
            float parallax = mix(0.2, 1.0, layer / 4.0);

            float scale = mix(80.0, 25.0, layer / 4.0);
            vec2 movingP = p + drift * parallax;
            vec2 grid = floor(movingP * scale);
            vec2 sub = fract(movingP * scale) - 0.5;

            float h = hash2(grid + layer * 100.0);

            if(h > density) {
                vec2 starOffset = (hash22(grid + layer * 50.0) - 0.5) * 0.8;
                vec2 starPos = sub - starOffset;

                float twinkleSpeed = 1.0 + hash2(grid + layer * 200.0) * 3.0;
                float twinkle = sin(u_time * twinkleSpeed + h * 100.0) * 0.5 + 0.5;
                twinkle = mix(0.3, 1.0, twinkle);

                float sizeVar = hash(grid.x + grid.y * 37.0 + layer);
                float starSize = baseSize * (0.5 + sizeVar);

                float dist = length(starPos);
                float core = smoothstep(starSize, 0.0, dist);
                float glow = exp(-dist * dist / (starSize * starSize * 4.0));

                float temp = hash2(grid + layer * 300.0);
                vec3 starColor;
                if(temp < 0.15) {
                    starColor = mix(vec3(0.7, 0.85, 1.0), vec3(0.9, 0.95, 1.0), temp / 0.15);
                } else if(temp < 0.4) {
                    starColor = vec3(1.0, 1.0, 0.95);
                } else if(temp < 0.7) {
                    starColor = mix(vec3(1.0, 1.0, 0.9), vec3(1.0, 0.9, 0.6), (temp - 0.4) / 0.3);
                } else if(temp < 0.9) {
                    starColor = mix(vec3(1.0, 0.8, 0.5), vec3(1.0, 0.6, 0.3), (temp - 0.7) / 0.2);
                } else {
                    starColor = mix(vec3(1.0, 0.5, 0.3), vec3(0.9, 0.3, 0.2), (temp - 0.9) / 0.1);
                }

                float intensity = (core + glow * 0.5) * brightness * twinkle;
                color += starColor * intensity;
            }
        }

        // Occasional bright stars with cross diffraction spikes — also drift
        for(float i = 0.0; i < 8.0; i++) {
            vec2 pos = hash22(vec2(i * 7.3, i * 13.7)) * 2.0 - 1.0;
            pos.x *= aspect;
            pos += drift * 0.5 + vec2(sin(u_time * 0.005 + i), cos(u_time * 0.007 + i)) * 0.02;

            float h = hash(i * 17.0);
            if(h > 0.6) {
                float dist = length(p - pos);
                float spikeSize = 0.008 + hash(i) * 0.012;

                float glow = exp(-dist * dist / (spikeSize * spikeSize * 2.0));

                vec2 delta = p - pos;
                float spike1 = exp(-abs(delta.x) * 80.0 - delta.y * delta.y * 200.0) * spikeSize * 20.0;
                float spike2 = exp(-abs(delta.y) * 80.0 - delta.x * delta.x * 200.0) * spikeSize * 20.0;

                float twinkle = sin(u_time * (0.5 + hash(i * 3.0) * 2.0) + i * 10.0) * 0.3 + 0.7;

                vec3 brightColor = mix(vec3(0.9, 0.95, 1.0), vec3(1.0, 0.9, 0.7), hash(i * 5.0));
                color += brightColor * (glow + spike1 + spike2) * twinkle * 0.8;
            }
        }

        // Subtle vignette
        float vignette = 1.0 - length(p) * 0.4;
        vignette = smoothstep(0.0, 1.0, vignette);
        color *= vignette;

        // Tone mapping and gamma correction
        color = color / (1.0 + color * 0.3);
        color = pow(color, vec3(0.95));

        gl_FragColor = vec4(color, 1.0);
    }`;

    function cs(type, src) {
        const s = gl.createShader(type);
        gl.shaderSource(s, src);
        gl.compileShader(s);
        return s;
    }

    const prog = gl.createProgram();
    gl.attachShader(prog, cs(gl.VERTEX_SHADER, vs));
    gl.attachShader(prog, cs(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const pos = gl.getAttribLocation(prog, 'a_position');
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, 'u_time');
    const uRes = gl.getUniformLocation(prog, 'u_resolution');
    const uMouse = gl.getUniformLocation(prog, 'u_mouse');

    let mouse = { x: canvas.width / 2, y: canvas.height / 2 };
    window.addEventListener('mousemove', (event) => {
        const rect = canvas.getBoundingClientRect();
        if (rect.width && rect.height) {
            const nx = (event.clientX - rect.left) / rect.width;
            const ny = 1.0 - (event.clientY - rect.top) / rect.height;
            mouse.x = nx * canvas.width;
            mouse.y = ny * canvas.height;
        }
    });

    function render(t) {
        if (typeof ResizeObserver === 'undefined') syncSize();
        gl.viewport(0, 0, canvas.width, canvas.height);
        if (uTime) gl.uniform1f(uTime, t * 0.001);
        if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
        if (uMouse) gl.uniform2f(uMouse, mouse.x, mouse.y);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        requestAnimationFrame(render);
    }
    render(0);
})();