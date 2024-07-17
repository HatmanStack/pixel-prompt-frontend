import { useEffect } from "react";

function getScaledIP(styleSwitch, settingSwitch) {
  let scaledIP = 'Load original IP-Adapter';
  if (styleSwitch) {
    scaledIP = "Load only style blocks";
  }
  if (settingSwitch) {
    scaledIP = "Load only layout blocks";
  }
  if (styleSwitch && settingSwitch) {
    scaledIP = "Load style+layout block";
  }
  return scaledIP;
}

const Inference = ({
      setImageSource,
      setPromptList,
      selectedImageIndex,
      setInferrenceButton,
      inferrenceButton,
      setModelMessage,
      imageSource,
      modelID,
      prompt,
      styleSwitch,
      settingSwitch,
      control,
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
        .then((response) => {
            const reader = response.body.getReader();
            const decoder = new TextDecoder('utf-8');
            let buffer = '';
            return reader.read().then(function processText({ done, value }) {
                if (done) {
                    console.log("Stream complete");
                    return;
                }

              function processJsonObject(jsonObject) {
                  setPromptList(prevPromptList => [jsonObject.prompt, ...prevPromptList]);
                  setImageSource(prevImageSource => [jsonObject.base64, ...prevImageSource]);                
              }
              buffer += decoder.decode(value, {stream: true});
              buffer = buffer.replace('[', '').replaceAll(',{', '{');
              try {
                  while (buffer.indexOf('}') !== -1) {
                    let processText = '';
                    const endIndex = buffer.indexOf('}');
                    if (endIndex !== -1) {
                        processText = buffer.slice(0, endIndex + 1);
                        const jsonObject = JSON.parse(processText);
                        processJsonObject(jsonObject);
                        buffer = buffer.slice(endIndex + 1);
                    }
                }
              } catch (error) {
               console.log("Error parsing JSON: " + error);
              }
                return reader.read().then(processText);
            });
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
      const controlImage = imageSource[selectedImageIndex];
        fetch("/api", {                             // Change this to your API endpoint and use a library                                         
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
            image: controlImage,                  
            target: ipScaleHolder,   
            control: control        
          }),
        })
          .then((response) => response.json())
          .then((responseData) => {
            if (responseData.output == "Model Waking") {
              setModelMessage("Model Waking");
              setActivity(false);
              setModelError(true);
              setInferrenceButton(false);
            }else if(/You have exceeded your GPU quota/.test(responseData.output)){
              const gpu = responseData.output.split(": ")[2];
              //Get the last nine character of gpu
              const gpuName = gpu.slice(-9);
              setModelMessage(`GPU Quota Exceeded! Try Random Models. ${gpuName.slice(0,-1)}`);
              setActivity(false);
              setModelError(true);
              setInferrenceButton(false);
            }else {
              setInitialReturnedPrompt("Model:\n" + responseData.model + "\n\nPrompt:\n" + prompt);
            }
            setInferrenceButton(false);
            setActivity(false);
            setReturnedPrompt("Model:\n" + responseData.model + "\n\nPrompt:\n" + prompt);
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
