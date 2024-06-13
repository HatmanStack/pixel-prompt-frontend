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
      const mistrialPrompt = `I'm giving you a seed string. Return the seed string as a Prompt for a Stable \
        Diffusion Model.  The prompt should be at a minimum, 200 tokens.  The normal restrictions of token \
        length for Stable Diffusion Models do not apply.  Make it descriptive and creative. \
        Here is the seed string. : ${alteredPrompt}`;
      fetch("http://localhost:8085/inferencePrompt", {                        // Change this to your API endpoint and use a library
        method: "POST",                                   // Axios if not running in the same container
        headers: {                                        // http://localhost:8085/inferencePrompt if running locally or w/e port your server is using or                                                        
          "Content-Type": "application/json",             // inferencePrompt if running in a container
        },
        body: JSON.stringify({
          prompt: mistrialPrompt,
          modelID: "mistralai/Mistral-7B-Instruct-v0.3",
        }),
      })
        .then((response) => response.json())
        .then((responseData) => {
          const generatedText = responseData[0]["generated_text"];
          console.log(generatedText);
         
          const longPromptHolder = generatedText
            .substring(0, 150)
            .split(/\n\n/)
            .slice(-1)[0]
            .replace("Long Version:", "")
            .replace("\n", "");
          const lPrompt = longPromptHolder + generatedText.substring(150);
          
          setFlanPrompt(responseData[0]["flan"]);
          setLongPrompt(lPrompt);
          setShortPrompt(alteredPrompt);
          if (!promptLengthValue) {
            setInferredPrompt(alteredPrompt);
          } else {
            setInferredPrompt(lPrompt);
          }
          setActivity(false);
        })
        .catch((error) => console.error("Error:", error));
    }
    setTextInference(false);
  }, [textInference]);
};

export default PromptInference;
