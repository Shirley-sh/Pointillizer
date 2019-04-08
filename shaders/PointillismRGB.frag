

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

void main() {
    float dotSizeMax = 0.8;
    float dotSizeMin = 0.05;

    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;
    vec2 uv = st;
    vec3 color = vec3(.0);

    float scale = 100.;
    // Scale
    st *= scale;

    // Tile the space
    vec2 i_st = floor(st);
    vec2 f_st = fract(st);

//------------------------R--------------------
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
            point = 0.5 + 0.3*sin(u_time + 6.2831*point);

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
    color += texture2D(tex,samplePoint).xyz;
    color *= vec3(step(m_dist,0.5));

    float r = texture2D(tex,samplePoint).x;
    r = step(m_dist,r*dotSizeMax+dotSizeMin);

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
            point = 0.5 + 0.3*sin(u_time + 16.2831*point);

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
    color += texture2D(tex,samplePoint).xyz;
    color *= vec3(step(m_dist,0.5));

    float g = texture2D(tex,samplePoint).y;
    g = step(m_dist,g*dotSizeMax+dotSizeMin);

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
            point = 0.5 + 0.3*sin(u_time + 26.2831*point);

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
    color += texture2D(tex,samplePoint).xyz;
    color *= vec3(step(m_dist,0.5));

    float b = texture2D(tex,samplePoint).z;
    b = step(m_dist,b*dotSizeMax+dotSizeMin);

    gl_FragColor = vec4(r,g,b,1.);
}


