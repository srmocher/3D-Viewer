// Toon Fragment shader for multiple lights.

#version 410 core

in vec2 textCoord;
struct LightProperties {
    int isEnabled;
    int isLocal;
    int isSpot;
    vec3 ambient;
    vec3 color;
    vec3 position;
    vec3 halfVector;
    vec3 coneDirection;
    float spotCosCutoff;
    float spotExponent;
    float constantAttenuation;
    float linearAttenuation;
    float quadraticAttenuation;
};

// the set of lights to apply, per invocation of this shader
const int MAXLIGHTS = 4;
uniform LightProperties Lights[MAXLIGHTS];

// material description
uniform vec3 ambient;	
uniform vec3 diffuse;
uniform vec3 specular;
uniform float shininess;
uniform bool textureEnabled;

uniform sampler2D textVar; // for texture mapping

in vec3 Normal;		// normal in eye coordinates
in vec4 Position;	// vertex position in eye coordinates

out vec4 FragColor;

void main()
{
	vec3 scatteredLight = vec3(0.f);
	vec3 reflectedLight = vec3(0.f);
	vec3 eyeDirection;
	vec3 lightDirection;
	vec3 halfVector;
	vec3 myNormal;
	float attenuation = 1.0f;
	float diffuseIntensity;
	float specularCoeff;

    // loop over all the lights
     

        attenuation = 1.0;

        eyeDirection = normalize(-vec3(Position));	// since we are in eye coordinates
													// eye position is 0,0,0
        // for local lights, compute per-fragment direction,
        // halfVector, and attenuation
        if (Lights[0].isLocal == 1) 
		{
		    lightDirection = Lights[0].position - vec3(Position);
            float lightDistance = length(lightDirection);
            lightDirection = normalize(lightDirection);

			
				if (Lights[0].isSpot == 1) 
				{
					vec3 myConeDirection = normalize(Lights[0].coneDirection);
					float spotCos = dot(lightDirection,
										-myConeDirection);
					
				}
            halfVector = normalize(lightDirection + eyeDirection);
        } 
		else
		// directional light
		{
			lightDirection = normalize(Lights[0].position);
			halfVector = normalize(lightDirection + eyeDirection);
        }

		myNormal = normalize(Normal);

        diffuseIntensity  = max(0.0, dot(myNormal, lightDirection));
       
		if(diffuseIntensity >=0 && diffuseIntensity < 1.0/7.0)
			diffuseIntensity = 0.0;
		if(diffuseIntensity >= 1.0/7.0 && diffuseIntensity < 2.0/7.0)
			diffuseIntensity = 1.0/7.0;
		if(diffuseIntensity >= 2.0/7.0 && diffuseIntensity < 3.0/7.0)
			diffuseIntensity = 2.0/7.0;
		if(diffuseIntensity >= 3.0/7.0 && diffuseIntensity < 4.0/7.0)
			diffuseIntensity = 3.0/7.0;
		if(diffuseIntensity >= 4.0/7.0 && diffuseIntensity < 5.0/7.0)
			diffuseIntensity = 4.0/7.0;
		if(diffuseIntensity >= 5.0/7.0 && diffuseIntensity < 6.0/7.0)
			diffuseIntensity = 5.0/7.0;
		if(diffuseIntensity >= 6.0/7.0 && diffuseIntensity < 7.0/7.0)
			diffuseIntensity = 6.0/7.0;
		
		// Accumulate all the lights’ effects as it interacts with material properties

		scatteredLight += Lights[0].color * ambient  +
                          Lights[0].color * (diffuseIntensity* diffuse) ;
        

    

	vec3 rgb = min(scatteredLight, vec3(1.0));
	//vec3 rgb(1.0,0.0,0.0);

		FragColor = vec4(rgb,1.0f);

}