import React, { useState, useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View, ScrollView, Text, Pressable, Dimensions, Image } from 'react-native';
import { registerRootComponent } from 'expo';
import { StatusBar } from 'expo-status-bar';
import {useFonts } from 'expo-font'; 
import axios from 'axios';

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
  const [parameters, setParameters] = useState('')
  const [activity, setActivity] = useState(false);
  const [modelError, setModelError] = useState(false);
  const [returnedPrompt, setReturnedPrompt] = useState('Avocado Armchair');
  const windowWidth = Dimensions.get('window').width;

  const passPromptWrapper = (x) => {setPrompt(x)};
  const passStepsWrapper = (x) => {setSteps(x)};
  const passGuidanceWrapper = (x) => {setGuidance(x)};
  const passModelIDWrapper = (x) => {
      setModelError(false);
      setModelID(x)};
  
    useEffect(() => {
      if (parameters != ''){
        setActivity(true);
        //axios.post("https://react-native-serve-ml-ervjof6qfq-uc.a.run.app/api", {
        axios.post("http://0.0.0.0:8085/api", {
        // Create Body to send to our backend
        prompt: prompt,
        steps: steps,
        guidance: guidance,
        modelID: modelID
      })
      .then(response => {
        console.log(response);
        setActivity(false);
        setReturnedPrompt(prompt);
        setInferredImage('data:image/png;base64,' + response.data.output);
      })
      .catch(function (error) {
        setActivity(false);
        setModelError(true);
        console.log(error);
      });
    }
    },[parameters]);

  return (
      // Main container
      <View style={styles.titlecontainer}>
        <BreathingComponent /> 
        <ScrollView scrollY={true} style={styles.ScrollView} showsVerticalScrollIndicator={false}> 
          {windowWidth > 1000 ? (<View style={styles.rowContainer}>
              {/* Left column */}
              <View style={styles.columnContainer}>
                  <View>
                    <PromptInputComponent passPrompt={passPromptWrapper} />
                  </View>
                  <View style={styles.rowContainer}>
                    <DropDownComponent passModelID={passModelIDWrapper} />
                      <View style={styles.columnContainer}>
                      {activity ?
                        <ActivityIndicator size="large" color="#B58392" style={styles.activityIndicator} /> :
                        <Pressable
                          onPress={() => { setParameters(`${prompt}-${steps}-${guidance}-${modelID}`); } }
                          style={({ pressed }) => [{ backgroundColor: pressed ? '#9DA58D' : '#958DA5', }, styles.button]}>
                          {({ pressed }) => (<Text style={styles.promptText}>{pressed ? 'INFERRED!' : 'Inference'}</Text>)}
                        </Pressable>}
                      {modelError ? <Text style={styles.promptText}>Model Error!</Text>:<></>}
                      </View>
                    </View>
                  <View>
                    <SliderComponent passSteps={passStepsWrapper} passGuidance={passGuidanceWrapper} />
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
            <PromptInputComponent passPrompt={passPromptWrapper} />
                <DropDownComponent passModelID={passModelIDWrapper} />
                {activity ?
                  <ActivityIndicator size="large" color="#B58392"/> :
                  <Pressable
                    onPress={() => { setParameters(`${prompt}-${steps}-${guidance}-${modelID}`); } }
                    style={({ pressed }) => [{ backgroundColor: pressed ? '#9DA58D' : '#958DA5', }, styles.button]}>
                    {({ pressed }) => (<Text style={styles.promptText}>{pressed ? 'INFERRED!' : 'Inference'}</Text>)}
                  </Pressable>}
                  {modelError ? <Text style={styles.promptText}>Model Error!</Text>:<></>}
                <SliderComponent passSteps={passStepsWrapper} passGuidance={passGuidanceWrapper} />   
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