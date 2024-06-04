import React, { useState, useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View, ScrollView, Text, Pressable, Image, useWindowDimensions } from 'react-native';
import { registerRootComponent } from 'expo';
import { StatusBar } from 'expo-status-bar';
import {useFonts } from 'expo-font'; 
import seeds from './assets/seeds.json'; 

import SliderComponent from './components/Slider';
import PromptInputComponent from './components/PromptInput';
import BreathingComponent from './components/Breathing';
import DropDownComponent from './components/DropDown';

const assetImage = require('./assets/avocado.jpg');

export default function App() {
  useFonts({'Sigmar': require('./assets/Sigmar/Sigmar-Regular.ttf')});
  const [inferredImage, setInferredImage] = useState(assetImage);
  const [steps, setSteps] = useState(45);
  const [guidance, setGuidance] = useState(10);
  const [modelID, setModelID] = useState('stabilityai/stable-diffusion-xl-base-1.0')
  const [prompt, setPrompt] = useState('Avocado Armchair');
  const [inferredPrompt, setInferredPrompt] = useState('');
  const [parameters, setParameters] = useState('')
  const [activity, setActivity] = useState(false);
  const [modelError, setModelError] = useState(false);
  const [returnedPrompt, setReturnedPrompt] = useState('Avocado Armchair');
  const [textInference, setTextInference] = useState(false);
  const {width} = useWindowDimensions();
  
  const passModelIDWrapper = (x) => {
      setModelError(false);
      setModelID(x)};
  
    useEffect(() => {
      if (parameters != ''){
        console.log(parameters)
        setActivity(true);
        fetch('/api', {             // Change this to your API endpoint and use a library  
        method: 'POST',            // like axios if not running seperate in the same container
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt,
          steps: steps,
          guidance: guidance,
          modelID: modelID
        })
      })
      .then(response => response.json())
      .then( responseData => {
          setActivity(false);
          setReturnedPrompt(prompt);
          setInferredImage('data:image/png;base64,' + responseData.output);
        })
        .catch(function (error) {
        setActivity(false);
        setModelError(true);
        console.log(error);
      });
    }
    },[parameters]);


    useEffect(() => { 
      if(textInference){
        setActivity(true);
        setModelError(false);
        let alteredPrompt = '';     
        if(prompt === 'Avocado Armchair' || prompt === ''){
          const randomIndex = Math.floor(Math.random() * seeds.seeds.length);
          alteredPrompt = seeds.seeds[randomIndex];
        }else {
          alteredPrompt = prompt;
        }
        alteredPrompt = `Complete this prompt for a Stable Diffusion Model. Return only the completed Prompt: ${alteredPrompt}`;
        fetch('/inferencePrompt', {             // Change this to your API endpoint and use a library  
          method: 'POST',                       // like axios if not running seperate in the same container
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: alteredPrompt,
            modelID: 'mistralai/Mistral-7B-Instruct-v0.3'
          })
        })
        .then(response => response.json())
        .then( responseData => {
          console.log(responseData[0]["generated_text"] );
          setInferredPrompt(responseData[0]["generated_text"]);
          setActivity(false);
        })
        .catch(error => console.error('Error:', error));
        }
    setTextInference(false);
    },[textInference]);
  

  return (
      // Main container
      <View style={styles.titlecontainer}>
        <BreathingComponent /> 
        <ScrollView scrollY={true} style={styles.ScrollView} showsVerticalScrollIndicator={false}> 
          {width > 1000 ? (<View style={styles.rowContainer}>
              {/* Left column */}
              <View style={styles.columnContainer}>
                  <View>
                  <PromptInputComponent setPrompt={setPrompt} inferredPrompt={inferredPrompt}/>
                  </View>
                  <View style={styles.rowContainer}>
                    <DropDownComponent passModelID={passModelIDWrapper} />
                      <View style={styles.columnContainer}>
                      {activity ?
                        <ActivityIndicator size="large" color="#B58392" style={styles.activityIndicator} /> :
                        <div >
                        <Pressable
                          onPress={() => { setTextInference(true); } }
                          style={({ pressed }) => [{ backgroundColor: pressed ? '#958DA5' : '#9DA58D', }, styles.button]}>
                          {({ pressed }) => (<Text style={styles.promptText}>{pressed ? 'INFERRED!' : 'Prompt'}</Text>)}
                        </Pressable>
                        <Pressable
                          onPress={() => { setParameters(`${prompt}-${steps}-${guidance}-${modelID}`); } }
                          style={({ pressed }) => [{ backgroundColor: pressed ? '#9DA58D' : '#958DA5', }, styles.button]}>
                          {({ pressed }) => (<Text style={styles.promptText}>{pressed ? 'INFERRED!' : 'Inference'}</Text>)}
                        </Pressable>
                        </div>}
                      {modelError ? <Text style={styles.promptText}>Model Error!</Text>:<></>}
                      </View>
                    </View>
                  <View>
                    <SliderComponent setSteps={setSteps} setGuidance={setGuidance} />
                  </View>
                </View>
                {/* Right column */}
                <View style={styles.columnContainer}>
                  <View style={styles.columnContainer}>
                  {inferredImage && <Image source={inferredImage} style={styles.imageStyle} />}
                    <Text style={styles.promptText}>{returnedPrompt}</Text>
                  </View>
                </View>
             
          </View>) : 
          (<View style={styles.columnContainer}>
            <PromptInputComponent setPrompt={setPrompt} inferredPrompt={inferredPrompt}/>
                <DropDownComponent passModelID={passModelIDWrapper} />
                {activity ?
                  <ActivityIndicator size="large" color="#B58392"/> :
                  <div >
                  <Pressable
                    onPress={() => { setTextInference(true); } }
                    style={({ pressed }) => [{ backgroundColor: pressed ? '#958DA5' : '#9DA58D', }, styles.button]}>
                    {({ pressed }) => (<Text style={styles.promptText}>{pressed ? 'INFERRED!' : 'Prompt'}</Text>)}
                  </Pressable>
                  <Pressable
                    onPress={() => { setParameters(`${prompt}-${steps}-${guidance}-${modelID}`); } }
                    style={({ pressed }) => [{ backgroundColor: pressed ? '#9DA58D' : '#958DA5', }, styles.button]}>
                    {({ pressed }) => (<Text style={styles.promptText}>{pressed ? 'INFERRED!' : 'Inference'}</Text>)}
                  </Pressable>
                  </div>}
                  {modelError ? <Text style={styles.promptText}>Model Error!</Text>:<></>}
                <SliderComponent setSteps={setSteps} setGuidance={setGuidance} />   
                {inferredImage && <Image source={inferredImage} style={styles.imageStyle} />}
                <Text style={styles.promptText}>{returnedPrompt}</Text>
            </View>)}
        </ScrollView><StatusBar style="auto" />
    </View>
  );
}

const colors = {
  backgroundColor: '#25292e',
  color: '#FFFFFF',
  button: '#958DA5',
};

const styles = StyleSheet.create({
  titlecontainer: {
    backgroundColor: colors.backgroundColor,
    position: 'absolute', 
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,  
    padding: 20
  },
  rowContainer: {
    backgroundColor: colors.backgroundColor,
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    marginTop: 10,
    overflow: 'auto',
    padding: 20
  },
  columnContainer: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column', 
  },
  button:{
    margin: 20,
    borderRadius: 4,
    paddingHorizontal: 32,
    elevation: 3,
    fontFamily: 'Sigmar',
  },
  activityIndicator:{
    marginLeft: 50
  },
  promptText: {
    color: colors.color,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 2,
    lineHeight: 30,
    fontFamily: 'Sigmar',
  },
  ScrollView: {
    backgroundColor: colors.backgroundColor,
    marginTop: 50,
    padding: 5
  },
  imageStyle: {
    width: 320,
    height: 440,
    borderRadius: 18,
    marginTop: 20,
    marginBottom: 20,
    alignSelf: 'center'
  }
});

registerRootComponent(App);