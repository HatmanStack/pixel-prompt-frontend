import { useEffect } from "react";
import seeds from "../assets/seeds.json";

const PromptInference = ({
  setFlanPrompt,
  prompt,
  textInference,
  setTextInference,
  setLongPrompt,
  setShortPrompt,
  setInferredPrompt,
  promptLengthValue,
  setActivity,
  setModelError,
}) => {
  useEffect(() => {
    if (textInference) {
      setActivity(true);
      setModelError(false);
      let alteredPrompt = "";
      if (prompt === "Avocado Armchair" || prompt === "") {
        const randomIndex = Math.floor(Math.random() * seeds.seeds.length);
        if (randomIndex > seeds.seeds.length - 13) {
          setLongPrompt(seeds.seeds[randomIndex]);
          setShortPrompt(seeds.seeds[randomIndex]);
          setInferredPrompt(seeds.seeds[randomIndex]);
          setActivity(false);
          return;
        }
        alteredPrompt = seeds.seeds[randomIndex];
      } else {
        alteredPrompt = prompt;
      }
      fetch("http://localhost:8000/inferencePrompt", {                        // Change this to your API endpoint and use a library
        method: "POST",                                   // Axios if not running in the same container
        headers: {                                        // http://localhost:8085/inferencePrompt if running locally or w/e port your server is using or                                                        
          "Content-Type": "application/json",             // inferencePrompt if running in a container
        },
        body: JSON.stringify({
          itemString: alteredPrompt
        }),
      }).then((response) => {
        response.json().then((responseData) => {
          console.log(responseData);
          const generatedText = responseData["plain"];
          const longPrompt = generatedText.split("Stable Diffusion Prompt:")[1];
          console.log(longPrompt);
          setFlanPrompt(responseData["magic"]);
          setLongPrompt(longPrompt);
          setShortPrompt(alteredPrompt);
          if (!promptLengthValue) {
            setInferredPrompt(alteredPrompt);
          } else {
            setInferredPrompt(longPrompt);
          }
          setActivity(false);
        }).catch((error) => console.error("Error:", error));
      }).catch((error) => console.error("Fetch Error:", error));
      setTextInference(false);
    }
  }, [textInference]);
};

export default PromptInference;
