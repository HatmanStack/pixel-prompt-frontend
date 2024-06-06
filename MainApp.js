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
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import seeds from "./assets/seeds.json";


import SliderComponent from "./components/Slider";
import PromptInputComponent from "./components/PromptInput";
import BreathingComponent from "./components/Breathing";
import DropDownComponent from "./components/DropDown";
import MyImagePicker from "./components/ImagePicker";

const assetImage = require("./assets/avocado.jpg");


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
  const [parameters, setParameters] = useState("");
  const [activity, setActivity] = useState(false);
  const [modelError, setModelError] = useState(false);
  const [returnedPrompt, setReturnedPrompt] = useState("Avocado Armchair");
  const [textInference, setTextInference] = useState(false);
  const [encodedImage, setEncodedImage] = useState('')
  const window = useWindowDimensions();

  const [isImagePickerVisible, setImagePickerVisible] = useState(false);
  const [imageSource, setImageSource] = useState(require('./assets/busta.png'));
  const [settingSwitch, setSettingSwitch] = useState(false);
  const [styleSwitch, setStyleSwitch] = useState(false);

  const passModelIDWrapper = (x) => {
    setModelError(false);
    setModelID(x);
  };

  const swapImage = () => {
    setImageSource(inferredImage);
  };

  const getBase64Image = () => { 
    console.log(imageSource)
    fetch(imageSource)
    .then(response => response.blob())
    .then(blob => {
      console.log(blob.type);
      const reader = new FileReader();
      reader.readAsDataURL(blob); // blob is your file object
      reader.onloadend = function() {
        let base64data = reader.result;               
        setEncodedImage(base64data);
      }
    })
    .catch(error => console.error(error));
  }

  useEffect(() =>{
    if(encodedImage){
      const modelIDHard = "stabilityai/stable-diffusion-xl-refiner-1.0"
    let scaledIP = {"key1": {"key2": [0.0, 0.0]}}
    if (styleSwitch) {
      scaledIP = {
        up: { block_0: [0.0, 1.0, 0.0] },
      };
    }
    if (settingSwitch) {
      scaledIP = {
        down: { block_2: [0.0, 1.0] },
        up: { block_0: [0.0, 1.0, 0.0] },
      };
    }
    fetch('/api', {              // Change this to your API endpoint and use a library  
      method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt,
          steps: steps,
          guidance: guidance,
          modelID: modelIDHard,
          image: encodedImage,              // Holders Until File Upload Optional with FastAPI is fixed
          scale: scaledIP                 // Holders Until File Upload Optional with FastAPI is fixed
        })
    })
    .then(response => response.json())
    .then( responseData => {
        setActivity(false);
        setReturnedPrompt(prompt);
        setEncodedImage(null);
        setInferredImage('data:image/png;base64,' + responseData.output);
      })
      .catch(function (error) {
      setActivity(false);
      setModelError(true);
      console.log(error);
    });
  }
},[encodedImage])
  

  useEffect(() => {
    if (parameters != ''){
      console.log(parameters)
      setActivity(true);
      if (false) { // isImagePickerVisible  Check for timeline on IP Adapater inference API
        getBase64Image();
      }else{
      const holder = 'test'
      const ipScaleHolder = {"key1": {"key2": [0.0, 0.0]}}
      fetch('/api', {             // Change this to your API endpoint and use a library  
      method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt,
          steps: steps,
          guidance: guidance,
          modelID: modelID,
          image: holder,            // Holders Until File Upload Optional with FastAPI is fixed
          scale: 'test'          // Holders Until File Upload Optional with FastAPI is fixed
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
  }}
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
      alteredPrompt = `I'm giving you a seed string for a stable diffusion model. Return two versions \
        in fewer than 500 tokens. A long version and a shortened version.  Make both descriptive and creative. \
        Here is the seed string. : ${alteredPrompt}`;
      
      fetch('/inferencePrompt', {             // Change this to your API endpoint and use a library  
        method: 'POST',                                           // Axios if not running in the same container
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
                  swapImage();
                }}
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                  position: "absolute",
                  left: window.width / 2 - 15,
                  top: window.height / 2 - 15,
                  zIndex: 1,
                  elevation: 3,
                  backgroundColor: "#3a3c3f",
                }}
              >
                <Image
                  source={require("./assets/circle.png")}
                  style={styles.changeButton}
                />
              </Pressable>
            )}

            <View style={styles.leftColumnContainer}>
              <View>
                <PromptInputComponent
                  setPrompt={setPrompt}
                  inferredPrompt={inferredPrompt}
                />
              </View>
              <View style={styles.dropdownRowContainer}>
                <DropDownComponent passModelID={passModelIDWrapper} />
                <View style={styles.columnContainer}>
                  {activity ? (
                    <ActivityIndicator
                      size="large"
                      color="#B58392"
                      style={{ margin: 25 }}
                    />
                  ) : (
                    <div>
                      <Pressable
                        onPress={() => {
                          setTextInference(true);
                        }}
                        style={({ pressed }) => [
                          { backgroundColor: pressed ? "#958DA5" : "#9DA58D" },
                          styles.button,
                        ]}
                      >
                        {({ pressed }) => (
                          <Text style={styles.promptText}>
                            {pressed ? "INFERRED!" : "Prompt"}
                          </Text>
                        )}
                      </Pressable>
                      <Pressable
                        onPress={() => {
                          setParameters(
                            `${prompt}-${steps}-${guidance}-${modelID}`
                          );
                        }}
                        style={({ pressed }) => [
                          { backgroundColor: pressed ? "#9DA58D" : "#958DA5" },
                          styles.button,
                        ]}
                      >
                        {({ pressed }) => (
                          <Text style={styles.promptText}>
                            {pressed ? "INFERRED!" : "Inference"}
                          </Text>
                        )}
                      </Pressable>
                    </div>
                  )}
                  {modelError ? (
                    <Text style={styles.promptText}>Model Error!</Text>
                  ) : (
                    <></>
                  )}
                </View>
              </View>
              <View>
                <Pressable
                  style={styles.expandButton}
                  onPress={() => setImagePickerVisible(!isImagePickerVisible)}
                >
                  {isImagePickerVisible ? (
                    <Image
                      source={require("./assets/right.png")}
                      style={styles.expandImage}
                    />
                  ) : (
                    <Image
                      source={require("./assets/down.png")}
                      style={styles.expandImage}
                    />
                  )}
                </Pressable>
                {isImagePickerVisible && (
                  <MyImagePicker
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
            </View>
            {/* Right column */}

            <View style={styles.rightColumnContainer}>
              {inferredImage && (
                <Image source={inferredImage} style={styles.imageStyle} />
              )}
              <Text style={styles.promptText}>{returnedPrompt}</Text>
            </View>
          </View>
        ) : (
          <View style={styles.columnContainer}>
            <PromptInputComponent
              setPrompt={setPrompt}
              inferredPrompt={inferredPrompt}
            />
            <DropDownComponent passModelID={passModelIDWrapper} />
            {activity ? (
              <ActivityIndicator size="large" color="#B58392" style={{ margin: 25 }}/>
            ) : (
              <div>
                <Pressable
                  onPress={() => {
                    setTextInference(true);
                  }}
                  style={({ pressed }) => [
                    { backgroundColor: pressed ? "#958DA5" : "#9DA58D" },
                    styles.button,
                  ]}
                >
                  {({ pressed }) => (
                    <Text style={styles.promptText}>
                      {pressed ? "INFERRED!" : "Prompt"}
                    </Text>
                  )}
                </Pressable>
                <Pressable
                  onPress={() => {
                    setParameters(`${prompt}-${steps}-${guidance}-${modelID}`);
                  }}
                  style={({ pressed }) => [
                    { backgroundColor: pressed ? "#9DA58D" : "#958DA5" },
                    styles.button,
                  ]}
                >
                  {({ pressed }) => (
                    <Text style={styles.promptText}>
                      {pressed ? "INFERRED!" : "Inference"}
                    </Text>
                  )}
                </Pressable>
              </div>
            )}
            {modelError ? (
              <Text style={styles.promptText}>Model Error!</Text>
            ) : (
              <></>
            )}
            <Pressable
              style={[styles.expandButton, { alignSelf: 'flex-start', marginLeft: '20%' }]}
              onPress={() => setImagePickerVisible(!isImagePickerVisible)}
            >
              {isImagePickerVisible ? (
                <Image
                  source={require("./assets/right.png")}
                  style={styles.expandImage}
                />
              ) : (
                <Image
                  source={require("./assets/down.png")}
                  style={styles.expandImage}
                />
              )}
            </Pressable>
            {isImagePickerVisible && (
              <>
                <MyImagePicker
                  imageSource={imageSource}
                  setImageSource={setImageSource}
                  styleSwitch={styleSwitch}
                  setStyleSwitch={setStyleSwitch}
                  settingSwitch={settingSwitch}
                  setSettingSwitch={setSettingSwitch}
                />
                <Pressable 
                  onPress={() => {
                    swapImage();
                  }}
                  style={styles.pressable}>
                  <Image
                    source={require("./assets/circle.png")}
                    style={styles.changeButton}
                  />
                </Pressable>
              </>
            )}
            <SliderComponent setSteps={setSteps} setGuidance={setGuidance} />
            {inferredImage && (
              <Image source={inferredImage} style={styles.imageStyle} />
            )}
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
  dropdownRowContainer: {
    backgroundColor: colors.backgroundColor,
    display: "flex",
    flexDirection: "row",
    marginTop: 10,
    overflow: "visible",
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
    margin: 20,
    borderRadius: 4,
    paddingHorizontal: 32,
    elevation: 3,
    fontFamily: "Sigmar",
  },
  columnButton: {
    margin: 20,
    borderRadius: 4,
    paddingHorizontal: 32,
    elevation: 3,
    fontFamily: "Sigmar",
    width: 200,
  },
  expandButton: {
    width: 30, // adjust size as needed
    height: 30, // adjust size as needed
    borderRadius: 15, // half of size to make it circular
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.buttonBackground, // change as needed
    elevation: 3, // for Android shadow
    shadowColor: "#000", // for iOS shadow
    shadowOffset: { width: 0, height: 2 }, // for iOS shadow
    shadowOpacity: 0.25, // for iOS shadow
    shadowRadius: 3.84, // for iOS shadow
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
  expandImage: {
    width: 20,
    height: 20,
  },
  pressable: {
    width: 60, // adjust size as needed
    height: 60, // adjust size as needed
    borderRadius: 30,
    elevation: 3,
    margin: 20,
    backgroundColor: colors.buttonBackground,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  activityIndicator: {
    marginLeft: 50,
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
    marginTop: 20,
    marginBottom: 20,
    alignSelf: "center",
  },
});


