import React, { useState, useEffect } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  View,
  ScrollView,
  Text,
  Pressable,
  useWindowDimensions,
  Image,
  Switch,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";

import SliderComponent from "./components/Slider";
import PromptInputComponent from "./components/PromptInput";
import BreathingComponent from "./components/Breathing";
import DropDownComponent from "./components/DropDown";
import MyImagePicker from "./components/ImagePicker";
import Buttons from "./components/Buttons";
import Expand from "./components/Expand";
import PromptInference from "./components/Prompt";
import Inference from "./components/Inference";
import SoundPlayer from "./components/Sounds";

const assetImage = require("./assets/avocado.jpg");
const circleImage = require("./assets/circle.png");
const addImage = require("./assets/add_image.png");
const rotatedCircle = require("./assets/rotated_circle.png");

export default function App() {
  useFonts({ Sigmar: require("./assets/Sigmar/Sigmar-Regular.ttf") });
  const [inferredImage, setInferredImage] = useState(assetImage);
  const [steps, setSteps] = useState(30);
  const [guidance, setGuidance] = useState(7);
  const [modelID, setModelID] = useState(
    "stabilityai/stable-diffusion-xl-base-1.0"
  );
  const [prompt, setPrompt] = useState("Avocado Armchair");
  const [inferredPrompt, setInferredPrompt] = useState(null);
  const [parameters, setParameters] = useState(null);
  const [activity, setActivity] = useState(false);
  const [modelError, setModelError] = useState(false);
  const [returnedPrompt, setReturnedPrompt] = useState("Avacado Armchair")
  const [initialReturnedPrompt, setInitialReturnedPrompt] = useState('Avacado Armchair')
  const [textInference, setTextInference] = useState(false);
  const [shortPrompt, setShortPrompt] = useState("");
  const [longPrompt, setLongPrompt] = useState(null);
  const [promptLengthValue, setPromptLengthValue] = useState(false);
  const [modelMessage, setModelMessage] = useState("");
  const [inferrenceButton, setInferrenceButton] = useState(null);
  const [flanPrompt, setFlanPrompt] = useState(null);
  const [isImagePickerVisible, setImagePickerVisible] = useState(false);
  const [imageSource, setImageSource] = useState([addImage]);
  const [settingSwitch, setSettingSwitch] = useState(false);
  const [styleSwitch, setStyleSwitch] = useState(false);
  const [soundIncrement, setSoundIncrement] = useState(null);
  const [makeSound, setMakeSound] = useState([null,0]);
  const [promptList, setPromptList] = useState([]);
  const [swapImage, setSwapImage] = useState(false);
 

  const window = useWindowDimensions();
  
  const passModelIDWrapper = (x) => {
    setModelError(false);
    setModelID(x);
  };

  const setPlaySound = (sound) => {
    setSoundIncrement(prevSoundIncrement => prevSoundIncrement + 1);
    setMakeSound([sound, soundIncrement]);
  };

  useEffect(() => {
    if(swapImage){
    if(inferredImage !== addImage){
    setPromptList(prevPromptList => [initialReturnedPrompt,...prevPromptList]);
    setImageSource(prevImageSource => [inferredImage, ...prevImageSource ]);  
    setInferredImage(addImage);
    setInitialReturnedPrompt("");
    setReturnedPrompt('')
    }
    setSwapImage(false);
  }
  }),[swapImage];



  const switchPromptFunction = () => {
    setPromptLengthValue(!promptLengthValue);
    if (promptLengthValue) {
      setInferredPrompt(shortPrompt);
      setPlaySound("switch");
    } else {
      setInferredPrompt(longPrompt);
      setPlaySound("switch");
    }
  };

  const switchToFlan = () => {
    setInferredPrompt(flanPrompt);
  };

  const setParametersWrapper = () => {
    setParameters(`${prompt}-${steps}-${guidance}-${modelID}`);
  };

  return (
    // Main container
    <View style={styles.titlecontainer}>
      <SoundPlayer makeSound={makeSound}/>
      <PromptInference
        setFlanPrompt={setFlanPrompt}
        prompt={prompt}
        textInference={textInference}
        setTextInference={setTextInference}
        setLongPrompt={setLongPrompt}
        setShortPrompt={setShortPrompt}
        setInferredPrompt={setInferredPrompt}
        promptLengthValue={promptLengthValue}
        setActivity={setActivity}
        setModelError={setModelError}
      />
      <Inference
        setInferrenceButton={setInferrenceButton}
        inferrenceButton={inferrenceButton}
        setModelMessage={setModelMessage}
        imageSource={imageSource}
        parameters={parameters}
        modelID={modelID}
        prompt={prompt}
        styleSwitch={styleSwitch}
        settingSwitch={settingSwitch}
        guidance={guidance}
        steps={steps}
        setActivity={setActivity}
        setModelError={setModelError}
        setReturnedPrompt={setReturnedPrompt}
        setInitialReturnedPrompt={setInitialReturnedPrompt}
        setInferredImage={setInferredImage}
      />
      <BreathingComponent />
      <ScrollView
        scrollY={true}
        style={styles.ScrollView}
        showsVerticalScrollIndicator={false}
      >
        {window.width > 1000 ? (
          <View style={styles.rowContainer}>
            {/* Left column */}
            {isImagePickerVisible && (
              <Pressable
              onPress={() => {
                setSwapImage(true);
                setPlaySound("swoosh");
              }}
              style={({ pressed }) => [
                styles.swapButton,
                {
                  top: pressed ? window.height / 2 - 13 : window.height / 2 - 15,
                  left: pressed ? window.width / 2 - 13 : window.width / 2 - 15,
                  width: pressed ? 52 : 60,
                  height: pressed ? 52 : 60,
                },
              ]}
            >
              {({ pressed }) => (
                <Image
                  source={pressed ? rotatedCircle : circleImage}
                  style={[
                    styles.changeButton,
                    pressed ? { width: 52, height: 52 } : { width: 60, height: 60 },
                  ]}
                />
              )}
            </Pressable>
            )}

            <View style={styles.leftColumnContainer}>
              <View>
                <PromptInputComponent
                  setPlaySound={setPlaySound}
                  setPrompt={setPrompt}
                  inferredPrompt={inferredPrompt}
                />
              </View>
              <View style={[styles.rowContainer, { padding: 0 }]}>
                <DropDownComponent
                  setPlaySound={setPlaySound}
                  passModelID={passModelIDWrapper}
                  
                />
                <View style={styles.columnContainer}>
                  <Buttons
                    setPlaySound={setPlaySound}
                    switchToFlan={switchToFlan}
                    setInferrenceButton={setInferrenceButton}
                    activity={activity}
                    longPrompt={longPrompt}
                    setTextInference={setTextInference}
                    switchPromptFunction={switchPromptFunction}
                    promptLengthValue={promptLengthValue}
                    setParametersWrapper={setParametersWrapper}
                  />
                  {modelError ? (
                    <Text style={styles.promptText}>{modelMessage}</Text>
                  ) : (
                    <></>
                  )}
                </View>
              </View>

              
                <Expand
                  setPlaySound={setPlaySound}
                  isImagePickerVisible={isImagePickerVisible}
                  setImagePickerVisible={setImagePickerVisible}
                  window={window}
                />
                {isImagePickerVisible && (
                  <MyImagePicker
                    initialReturnedPrompt={initialReturnedPrompt}
                    setReturnedPrompt={setReturnedPrompt}
                    promptList={promptList}
                    setPromptList={setPromptList}
                    window={window}
                    setPlaySound={setPlaySound}
                    imageSource={imageSource}
                    setImageSource={setImageSource}
                    styleSwitch={styleSwitch}
                    setStyleSwitch={setStyleSwitch}
                    settingSwitch={settingSwitch}
                    setSettingSwitch={setSettingSwitch}
                  />
                )}
                <SliderComponent
                  setSteps={setSteps}
                  setGuidance={setGuidance}
                />
              
            </View>
            
            <View style={styles.rightColumnContainer}>
            <View style={styles.imageCard}>
              {inferredImage && (
                <Image
                  source={
                    typeof inferredImage === "number"
                      ? inferredImage
                      : { uri: inferredImage }
                  }
                  style={styles.imageStyle}
                />
              )}
              </View>
              <Text style={styles.promptText}>{returnedPrompt}</Text>
            </View>
          </View>
        ) : (
          <View style={styles.columnContainer}>
            <PromptInputComponent
              setPlaySound={setPlaySound}
              setPrompt={setPrompt}
              inferredPrompt={inferredPrompt}
            />
            <DropDownComponent
              setPlaySound={setPlaySound}
              passModelID={passModelIDWrapper}
             
            />
            <Buttons
              setPlaySound={setPlaySound}
              switchToFlan={switchToFlan}
              setInferrenceButton={setInferrenceButton}
              activity={activity}
              longPrompt={longPrompt}
              setTextInference={setTextInference}
              switchPromptFunction={switchPromptFunction}
              promptLengthValue={promptLengthValue}
              setParametersWrapper={setParametersWrapper}
            />
            {modelError ? (
              <Text style={styles.promptText}>{modelMessage}</Text>
            ) : (
              <></>
            )}
            <Expand
              setPlaySound={setPlaySound}
              isImagePickerVisible={isImagePickerVisible}
              setImagePickerVisible={setImagePickerVisible}
              window={window}
            />
            <View style={{flex:1, alignItems:"center", justifyContent:"center"}}>
            {isImagePickerVisible && (
              <>
                <MyImagePicker
                  initialReturnedPrompt={initialReturnedPrompt}
                  setReturnedPrompt={setReturnedPrompt}
                  promptList={promptList}
                  setPromptList={setPromptList}
                  window={window}
                  setPlaySound={setPlaySound}
                  imageSource={imageSource}
                  setImageSource={setImageSource}
                  styleSwitch={styleSwitch}
                  setStyleSwitch={setStyleSwitch}
                  settingSwitch={settingSwitch}
                  setSettingSwitch={setSettingSwitch}
                />
                 <Pressable
              onPress={() => {
                setSwapImage(true);
                setPlaySound("swoosh");
              }}
              style={({ pressed }) => [
                styles.swapButtonColumn,
                {
                  
                  width: pressed ? 52 : 60,
                  height: pressed ? 52 : 60,
                },
              ]}
            >
              {({ pressed }) => (
                <Image
                  source={pressed ? rotatedCircle : circleImage}
                  style={[
                    styles.changeButton,
                    pressed ? { width: 52, height: 52 } : { width: 60, height: 60 },
                  ]}
                />
              )}
            </Pressable>
              </>
            )}
            </View>
            <SliderComponent setSteps={setSteps} setGuidance={setGuidance} />
            <View style={styles.imageCard}>
            {inferredImage && (
              <Image
                source={
                  typeof inferredImage === "number"
                    ? inferredImage
                    : { uri: inferredImage }
                }
                style={styles.imageStyle}
              />
            )}
            </View>
            <Text style={styles.promptText}>{returnedPrompt}</Text>
          </View>
        )}
      </ScrollView>
      <StatusBar style="auto" />
    </View>
  );
}

const colors = {
  backgroundColor: "#25292e",
  buttonBackground: "#3a3c3f",
  color: "#FFFFFF",
  button: "#958DA5",
};

const styles = StyleSheet.create({
  titlecontainer: {
    backgroundColor: colors.backgroundColor,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 20,
  },
  rowContainer: {
    backgroundColor: colors.backgroundColor,
    display: "flex",
    flexDirection: "row",
    marginTop: 10,
    overflow: "visible",
    padding: 20,
  },
  leftColumnContainer: {
    flex: 1,
    alignItems: "center", // Center items horizontally
    justifyContent: "flex-start",
    flexDirection: "column",
    marginRight: 10,
  },
  rightColumnContainer: {
    flex: 1,
    alignItems: "center",
    flexDirection: "column",
    marginLeft: 10,
  },
  columnContainer: {
    flex: 1,
    alignItems: "center",
    flexDirection: "column",
  },
  button: {
    margin: 10,
    borderRadius: 4,
    paddingHorizontal: 32,
    elevation: 3,
    fontFamily: "Sigmar",
  },
  swapButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    position: "absolute",
    left: window.width / 2 - 15,
    top: window.height / 2 - 15,
    zIndex: 1,
    elevation: 3,
    backgroundColor: colors.buttonBackground,
  },
  changeButton: {
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center", // change as needed
    elevation: 3, // for Android shadow
    shadowColor: "#000", // for iOS shadow
    shadowOffset: { width: 0, height: 2 }, // for iOS shadow
    shadowOpacity: 0.25, // for iOS shadow
    shadowRadius: 3.84, // for iOS shadow
  },
  swapButtonColumn: {
    width: 60, // adjust size as needed
    height: 60, // adjust size as needed
    borderRadius: 30,
    elevation: 3,
    margin: 20,
    backgroundColor: colors.buttonBackground,
  },
  promptText: {
    color: colors.color,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    letterSpacing: 2,
    lineHeight: 30,
    fontFamily: "Sigmar",
  },
  ScrollView: {
    backgroundColor: colors.backgroundColor,
    marginTop: 50,
    padding: 5,
    
  },
  imageStyle: {
    width: 320,
    height: 440,
    borderRadius: 18,
   
    alignSelf: "center",  
  },
  imageCard:{
    width: 320,
    height: 440,
    borderRadius: 18,
    marginTop: 20,
    marginBottom: 20,
    alignSelf: "center", 
    backgroundColor: colors.backgroundColor, 
    elevation: 3, 
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.25, 
    shadowRadius: 3.84, 
  }
});
