// Author: shirley huang
// Title: PoinillismCMYK

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
uniform sampler2D tex;

vec2 random2( vec2 p ) {
    return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
}

vec4 rgb2cmyk(vec3 col){
    float c,m,y,k;
     k = min(1. - col.r, 1. - col.g);
     k = min(k, 1.-col.b);
     c = (1. - col.r - k) / (1. - k);
     m = (1. - col.g - k)/ (1. - k);
     y = (1. - col.b - k) / (1. - k);
    return vec4(c,m,y,k);
}

vec3 printCmyk(float c, float m, float y, float k){
    vec3 cyan = vec3(1.,0.,0.);
    vec3 magenta = vec3(0.,1.,0.);
    vec3 yellow = vec3(0.,0.,1.);
    return (vec3(1.)-cyan*c*0.7) 
            * (vec3(1.)-magenta*m*0.7)
            * (vec3(1.)-yellow*y*0.7)
            * (vec3(1.)-k*0.7);
}

void main() {
    float dotSizeMax = 0.7;
    float dotSizeMin = 0.1;
    float scale = 150.;

    float c,m,y,k;


    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;
    vec2 uv = st;
    st *= scale;

    // Tile the space
    vec2 i_st = floor(st);
    vec2 f_st = fract(st);

//------------------------C--------------------
    float m_dist = 1.;  // minimun distance
    vec2 samplePoint = vec2(0.);
    vec2 ij = vec2(.0);
    for (int y= -1; y <= 1; y++) {
        for (int x= -1; x <= 1; x++) {
            // Neighbor place in the grid
            vec2 neighbor = vec2(float(x),float(y));

            // Random position from current + neighbor place in the grid
            vec2 point = random2(i_st + neighbor);

			// Animate the point
            point = 0.5 + 0.35*sin(u_time + 6.2831*point);

			// Vector between the pixel and the point
            vec2 diff = neighbor + point - f_st;

            // Distance to the point
            float dist = length(diff);

            // Keep the closer distance
            if(m_dist>dist){
                samplePoint = point;
                ij = vec2(x,y)*0.5;
            }
            m_dist = min(m_dist, dist);
        }
    }
    samplePoint = floor(samplePoint*ij+uv*scale)/scale;

    c = rgb2cmyk(texture2D(tex,samplePoint).xyz).x;
    c = step(m_dist,c*dotSizeMax+dotSizeMin);

//------------------------M--------------------
    m_dist = 1.;  // minimun distance
    samplePoint = vec2(0.);
    ij = vec2(.0);
    for (int y= -1; y <= 1; y++) {
        for (int x= -1; x <= 1; x++) {
            // Neighbor place in the grid
            vec2 neighbor = vec2(float(x),float(y));

            // Random position from current + neighbor place in the grid
            vec2 point = random2(i_st + neighbor);

            // Animate the point
            point = 0.5 + 0.35*sin(u_time + 16.2831*point);

            // Vector between the pixel and the point
            vec2 diff = neighbor + point - f_st;

            // Distance to the point
            float dist = length(diff);

            // Keep the closer distance
            if(m_dist>dist){
                samplePoint = point;
                ij = vec2(x,y)*0.5;
            }
            m_dist = min(m_dist, dist);
        }
    }
    samplePoint = floor(samplePoint*ij+uv*scale)/scale;

    m = rgb2cmyk(texture2D(tex,samplePoint).xyz).y;
    m = step(m_dist,m*dotSizeMax+dotSizeMin);

    //------------------------Y--------------------
    m_dist = 1.;  // minimun distance
    samplePoint = vec2(0.);
    ij = vec2(.0);
    for (int y= -1; y <= 1; y++) {
        for (int x= -1; x <= 1; x++) {
            // Neighbor place in the grid
            vec2 neighbor = vec2(float(x),float(y));

            // Random position from current + neighbor place in the grid
            vec2 point = random2(i_st + neighbor);

            // Animate the point
            point = 0.5 + 0.35*sin(u_time + 26.2831*point);

            // Vector between the pixel and the point
            vec2 diff = neighbor + point - f_st;

            // Distance to the point
            float dist = length(diff);

            // Keep the closer distance
            if(m_dist>dist){
                samplePoint = point;
                ij = vec2(x,y)*0.5;
            }
            m_dist = min(m_dist, dist);
        }
    }
    samplePoint = floor(samplePoint*ij+uv*scale)/scale;

    y = rgb2cmyk(texture2D(tex,samplePoint).xyz).z;
    y = step(m_dist,y*dotSizeMax+dotSizeMin);

    //------------------------G--------------------
    m_dist = 1.;  // minimun distance
    samplePoint = vec2(0.);
    ij = vec2(.0);
    for (int y= -1; y <= 1; y++) {
        for (int x= -1; x <= 1; x++) {
            // Neighbor place in the grid
            vec2 neighbor = vec2(float(x),float(y));

            // Random position from current + neighbor place in the grid
            vec2 point = random2(i_st + neighbor);

            // Animate the point
            point = 0.5 + 0.35*sin(u_time + 26.2831*point);

            // Vector between the pixel and the point
            vec2 diff = neighbor + point - f_st;

            // Distance to the point
            float dist = length(diff);

            // Keep the closer distance
            if(m_dist>dist){
                samplePoint = point;
                ij = vec2(x,y)*0.5;
            }
            m_dist = min(m_dist, dist);
        }
    }
    samplePoint = floor(samplePoint*ij+uv*scale)/scale;

    k = rgb2cmyk(texture2D(tex,samplePoint).xyz).w;
    k = step(m_dist,k*dotSizeMax+dotSizeMin);

    vec3 finalColor = printCmyk(c,m,y,k);
    gl_FragColor = vec4(finalColor,1.);
}


