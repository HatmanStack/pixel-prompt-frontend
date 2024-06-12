import { useEffect, useState } from 'react';

const Inference = ({ setModelMessage, imageSource, parameters, modelID, prompt, isImagePickerVisible, styleSwitch, settingSwitch, guidance, steps, setActivity, setModelError, setReturnedPrompt, setInferredImage}) => {
const [encodedImage, setEncodedImage] = useState('')

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

  // useEffect hook for img2img
  useEffect(() =>{
    if(encodedImage){
      let scaledIP = {none: {"key2": [0.0, 0.0]}}
      if (styleSwitch) {
        scaledIP = {
          up: { block_0: [0.0, 1.0, 0.0] },
        };
      }
      if (settingSwitch) {
        scaledIP = {
          down: { block_2: [0.0, 1.0] },
        };
      }
      if (styleSwitch && settingSwitch) {
        scaledIP = {
          down: { block_2: [0.0, 1.0] },
          up: { block_0: [0.0, 1.0, 0.0] }
        };
      }
      console.log(scaledIP)
    fetch('/img2img', {              // Change this to your API endpoint and use a library  
      method: 'POST',                               // Axios if not running in the same container
        headers: {                                  // http://localhost:8085/api if running locally or w/e port your server is using or                    
          'Content-Type': 'application/json',         // /api if running in a container
        },
        body: JSON.stringify({
          prompt: prompt,
          steps: steps,
          guidance: guidance,
          modelID: modelID,
          image: encodedImage,              // Holders Until File Upload Optional with FastAPI is fixed
          scale: scaledIP               // Holders Until File Upload Optional with FastAPI is fixed
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
      setModelMessage('Model Error!');
      setActivity(false);
      setModelError(true);
      console.log(error);
    });
  }
},[encodedImage])
  

// useEffect hook for txt2img
  useEffect(() => {
    if (parameters ){
      
      console.log(parameters)
      setActivity(true);
      if (isImagePickerVisible) { // isImagePickerVisible  Check for timeline on IP Adapater inference API
        setModelMessage('Inference API Not Documented For Image to Image Yet!');
        setActivity(false);
        setModelError(true);
        // getBase64Image();
      }else{
      const ipScaleHolder = {"key1": {"key2": [0.0, 0.0]}}
      fetch('/api ', {             // Change this to your API endpoint and use a library  
      method: 'POST',                                  // Axios if not running in the same container
        headers: {                                   // http://localhost:8085/api if running locally or w/e port your server is using or
          'Content-Type': 'application/json',           // /api if running in a container
        },
        body: JSON.stringify({
          prompt: prompt,
          steps: steps,
          guidance: guidance,
          modelID: modelID,
          image: 'test',            // Holders Until File Upload Optional with FastAPI is fixed
          scale: ipScaleHolder         // Holders Until File Upload Optional with FastAPI is fixed
        })
    })
    .then(response => response.json())
    .then( responseData => {
        console.log(responseData.output)
        if(responseData.output == "Model Waking"){
          setModelMessage('Model Waking');
          setActivity(false);
          setModelError(true);
        }
        setActivity(false);
        setReturnedPrompt(prompt);
        setInferredImage('data:image/png;base64,' + responseData.output);
      })
      .catch(function (error) {
      setModelMessage('Model Error!');
      setActivity(false);
      setModelError(true);
      
      console.log(error);
    });
  }}
  },[parameters]);

};

export default Inference;