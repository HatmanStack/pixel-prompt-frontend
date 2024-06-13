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
      alteredPrompt = `I'm giving you a seed string for a stable diffusion model. Return two versions \
        A long version and a shortened version.  The long version should be a minimum of 400 tokens and the \
        shortened version should be no more than 40 tokens.  Make both descriptive and creative. \
        Here is the seed string. : ${alteredPrompt}`;
      fetch("/inferencePrompt ", {                        // Change this to your API endpoint and use a library
        method: "POST",                                   // Axios if not running in the same container
        headers: {                                        // http://localhost:8085/api if running locally or w/e port your server is using or                                                        
          "Content-Type": "application/json",             // inferencePrompt if running in a container
        },
        body: JSON.stringify({
          prompt: alteredPrompt,
          modelID: "mistralai/Mistral-7B-Instruct-v0.3",
        }),
      })
        .then((response) => response.json())
        .then((responseData) => {
          const generatedText = responseData[0]["generated_text"];
          const splitPrompt = generatedText.split(
            /Short(?:ened)? (?:Version:)?/i
          );
          const longPromptHolder = splitPrompt[0]
            .substring(0, 150)
            .split(/\n\n/)
            .slice(-1)[0]
            .replace("Long Version:", "")
            .replace("\n", "");
          const lPrompt = longPromptHolder + splitPrompt[0].substring(150);
          const holderShortPrompt = splitPrompt[1]
            .substring(0, 150)
            .split(/\n\n/)
            .slice(-1)[0]
            .replace("\n", "");
          const sPrompt =
            holderShortPrompt + splitPrompt[1].substring(150).split(/\n\n/)[0];
          setFlanPrompt(responseData[0]["flan"]);
          setLongPrompt(lPrompt);
          setShortPrompt(sPrompt);
          if (!promptLengthValue) {
            setInferredPrompt(sPrompt);
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
