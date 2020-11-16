#version 330

#define ZFAR 100.
#define RAY_CAST_ITERATIONS 4000.
#define RAY_CAST_STEP 0.01
#define EQUATION_EPS 0.1

#define inf 1000000.

uniform float time;
uniform ivec2 resolution;
uniform vec3 pos;
uniform vec3 ff;
uniform vec3 rr;
uniform vec3 uu;

float sdLine(in vec3 p, in vec3 m, in vec3 s) { return length(cross(m - p, s))/length(s); }

bool check(in vec3 p) {
    float d1 = sdLine(p, vec3(0., 0., 0.), vec3(0., 0.,  1.));
    float d2 = sdLine(p, vec3(0., 2., 0.), vec3(2., 3.,  4.));

    return distance(vec3(0.), p) < 7 && (d1 < EQUATION_EPS || d2 < EQUATION_EPS || abs(d1 - d2) < EQUATION_EPS);
}

float castRay(in vec3 ro, in vec3 rd) {
    for (float i = 0.; i < RAY_CAST_ITERATIONS; ++i) {
        float t = i * RAY_CAST_STEP;
        vec3 p = ro + rd*t;

        if (check(p))
            return t;
        if (t > ZFAR)
            return inf + 10.;
    }
    return inf + 10.;
}

out vec4 fragColor;
void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5*vec2(resolution)) / float(min(resolution.x, resolution.y));

    vec3 ro = pos;
    vec3 rd = normalize(uv.x*rr + uv.y*uu + 1.*ff);

    float t = castRay(ro, rd);
    vec3 color = vec3(.0);
    if (t < inf) {
        vec3 p = ro + t*rd;
        color = abs(vec3(sin(p.x*6.),
                         sin(p.y*6.),
                         sin(p.z*6.)));// * (1. - t/ZFAR);
    }

    fragColor = vec4(color, 1.);
}
