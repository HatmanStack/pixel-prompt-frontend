import { useEffect } from "react";

function getScaledIP(styleSwitch, settingSwitch) {
  let scaledIP = { none: { key2: [0.0, 0.0] } };
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
      up: { block_0: [0.0, 1.0, 0.0] },
    };
  }
  return scaledIP;
}


const Inference = ({
  setImageSource,
  setPromptList,
  setInferrenceButton,
  inferrenceButton,
  setModelMessage,
  modelID,
  prompt,
  styleSwitch,
  settingSwitch,
  guidance,
  steps,
  setActivity,
  setModelError,
  setReturnedPrompt,
  setInitialReturnedPrompt,
  setInferredImage,
}) => {
  
  useEffect(() => {
    const requestOptions = {
        method: 'GET'
    };
    fetch('/core', requestOptions)
        .then((response) => response.json()) 
        .then((responseData) => {
          console.log(responseData);
          if (responseData.prompt.length > 0) {
            responseData.prompt.forEach((prompt, index) => {
              setPromptList(prevPromptList => [prompt, ...prevPromptList]);
            });
            responseData.base64.forEach((image, index) => {
              setImageSource(prevImageSource => [image, ...prevImageSource]);
            });
          }
        })
        .catch((error) => {
            console.error('There was an error!', error);
        });
}, []);
    

  /**  useEffect hook for txt2img  */

  useEffect(() => {
    if (inferrenceButton) {
      setActivity(true);
      let inferreceModel = modelID.value;
      const ipScaleHolder = getScaledIP(styleSwitch, settingSwitch);
        fetch("http://localhost:8000/api", {                             // Change this to your API endpoint and use a library                                         
          method: "POST",                           // Axios if not running in the same container
          headers: {                                // http://localhost:8000/api if running locally or w/e port your server is using or
             "Content-Type": "application/json",    // /api if running in a container
          },
          body: JSON.stringify({
            prompt: prompt,
            steps: steps,
            guidance: guidance,
            modelID: inferreceModel,
            modelLabel: modelID.label,
            image: "test",                  
            scale: ipScaleHolder,           
          }),
        })
          .then((response) => response.json())
          .then((responseData) => {
            if (responseData.output == "Model Waking") {
              setModelMessage("Model Waking");
              setActivity(false);
              setModelError(true);
              setInferrenceButton(false);
            }else {
              setInitialReturnedPrompt(modelID.label + " " + prompt);
            }
            setInferrenceButton(false);
            setActivity(false);
            setReturnedPrompt(prompt);
            setInferredImage("data:image/png;base64," + responseData.output);
          })
          .catch(function (error) {
            setModelMessage("Model Error!");
            setActivity(false);
            setModelError(true);
            setInferrenceButton(false);
            console.log(error);
          });
      }
 
  }, [inferrenceButton]);
};

export default Inference;
