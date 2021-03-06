#ifdef GL_ES
    precision highp float;
#endif
uniform sampler2D depthTex;
uniform sampler2D noiseTex;  
uniform sampler2D diffuseTex;
uniform bool hasTexture;
varying vec3 vNormal;
uniform mat4 projectionMatrix;
uniform mat4 m;
uniform vec2 noiseScale;
uniform float near;
uniform float far;            
uniform float fov;
uniform float aspectRatio;    
uniform float screenWidth;    
uniform float screenHeight;    
uniform vec3 kernel[16];   
uniform vec4 vColor4Aux;

varying vec2 vTexCoord;   
varying vec3 vLightWeighting;
varying vec4 vcolor4;

const int kernelSize = 16;  
const float radius = 0.5;      

float unpackDepth(const in vec4 rgba_depth)
{
    const vec4 bit_shift = vec4(0.000000059605, 0.000015258789, 0.00390625, 1.0);
    float depth = dot(rgba_depth, bit_shift);
    return depth;
}                

vec3 getViewRay(vec2 tc)
{
    float hfar = 2.0 * tan(fov/2.0) * far;
    float wfar = hfar * aspectRatio;    
    vec3 ray = vec3(wfar * (tc.x - 0.5), hfar * (tc.y - 0.5), -far);    
    return ray;                      
}         
            
//linear view space depth
float getDepth(vec2 coord)
{                          
    return unpackDepth(texture2D(depthTex, coord.xy));
}    

void main()
{          
    vec2 screenPos = vec2(gl_FragCoord.x / screenWidth, gl_FragCoord.y / screenHeight);		                 
    float linearDepth = getDepth(screenPos);          
    vec3 origin = getViewRay(screenPos) * linearDepth;   
    vec3 normal2 = vNormal;   
            
    vec3 rvec = texture2D(noiseTex, screenPos.xy * noiseScale).xyz * 2.0 - 1.0;
    vec3 tangent = normalize(rvec - normal2 * dot(rvec, normal2));
    vec3 bitangent = cross(normal2, tangent);
    mat3 tbn = mat3(tangent, bitangent, normal2);        
    
    float occlusion = 0.0;
    for(int i = 0; i < kernelSize; ++i)
    {    	 
        vec3 sample = origin + (tbn * kernel[i]) * radius;
        vec4 offset = projectionMatrix * vec4(sample, 1.0);		
        offset.xy /= offset.w;
        offset.xy = offset.xy * 0.5 + 0.5;        
        float sampleDepth = -sample.z/far;
        float depthBufferValue = getDepth(offset.xy);				              
        float range_check = abs(linearDepth - depthBufferValue)+radius*0.998;
        if (range_check < radius*1.001 && depthBufferValue <= sampleDepth)
        {
            occlusion +=  1.0;
        }
        
    }   
        
    occlusion = 1.0 - occlusion / float(kernelSize);
                                
    vec3 lightPos = vec3(10.0, 10.0, 10.0);
    vec3 L = normalize(lightPos);
    float DiffuseFactor = dot(normal2, L);
    float NdotL = abs(DiffuseFactor);
    vec3 diffuse = vec3(NdotL);
    vec3 ambient = vec3(1.0);
    vec4 textureColor;
    textureColor = vcolor4;

    gl_FragColor.rgb = vec3((textureColor.xyz)*vLightWeighting * occlusion); 
    gl_FragColor.a = 1.0;   
}
