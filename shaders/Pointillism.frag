// Author: shirleyhuang
// Title: Pointillism

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
    float dotSizeMax = 0.7;
    float dotSizeMin = 0.1;

    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;
    vec2 uv = st;


    float scale = 80.;
    // Scale
    st *= scale;

    // Tile the space
    vec2 i_st = floor(st);
    vec2 f_st = fract(st);

    vec3 grayXfer = vec3(0.3, 0.59, 0.11);

//------------------------Pass 1--------------------
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
            point = 0.5 + 0.25*sin(u_time*3. + 6.2831*point);

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

    vec2 sampleUv = floor(samplePoint*ij+uv*scale)/scale;
    vec3 color = texture2D(tex,sampleUv).xyz + vec3(samplePoint,(samplePoint.x+samplePoint.y)*0.5)*0.3;
    vec3 gray = vec3(dot(grayXfer, color));
    gray = step(m_dist,(1.-gray)*dotSizeMax+dotSizeMin);
    vec3 pass1 = gray*color+(1.-gray);


    //------------------------Pass 2--------------------
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
            point = 0.5 + 0.25*sin(u_time*3. + 13.2831*point);

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

    sampleUv = floor(samplePoint*ij+uv*scale)/scale;
    color = texture2D(tex,sampleUv).xyz + vec3(samplePoint,(samplePoint.x+samplePoint.y)*0.5)*0.3;
    gray = vec3(dot(grayXfer, color));
    gray = step(m_dist,(1.-gray)*dotSizeMax+dotSizeMin);
    vec3 pass2 = gray*color+(1.-gray);

    gl_FragColor = vec4(min(pass1,pass2),1);
}


