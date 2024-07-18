# Pixel Prompt Frontend

This is the frontend component of Pixel Prompt it's used in conjunction with the container and backend versions. This frontend serves as the user interface for interacting with the underlying ML models and backend services, providing a seamless and intuitive experience across multiple platforms.

A blog post talking about the architecture can be found here: [Cloud Bound](https://medium.com/@HatmanStack/cloud-bound-react-native-and-fastapi-ml-684a658f967a).  

## Preview :zap:

To preview the application visit the hosted version on the Hugging Face Spaces platform [here](https://hatman-pixel-prompt.hf.space).

## Screenshots

<table>
  <tr>
    <td><p align="center"><img src="https://github.com/HatmanStack/pixel-prompt-frontend/blob/main/pics/pixel-prompt-frontend.png" alt="Image 1"></p></td>
    </tr>
    <tr>
    <td><p align="center"><img src="https://github.com/HatmanStack/pixel-prompt-frontend/blob/main/pics/pixel-prompt-frontend-2.png" alt="Image 3"></p></td>
  </tr>
</table>

## Prerequisites

Before running this application locally, ensure that you have the following dependencies installed on your machine:

- Node
- npm (Node Package Manager)

## Installation :hammer:

To install and run the application, follow these steps:

### Frontend
   
   ```shell
   git clone https://github.com/hatmanstack/pixel-prompt-frontend.git
   cd pixel-prompt-frontend
   npm install -g yarn
   yarn
   npm start
   ```

The app will be running locally at http://localhost:19006. For different environments you can switch the port at startup, use 'npm start -- --port 8080' to start Metro(Expo's Compiler) on port 8080.

### Diffusion

- **Random**
- **stabilityai/stable-diffusion-3-medium**
- **stabilityai/stable-diffusion-xl-base-1.0**
- **nerijs/pixel-art-xl**
- **Fictiverse/Voxel_XL_Lora**
- **dallinmackay/Van-Gogh-diffusion**
- **gsdf/Counterfeit-V2.5**

### Prompts

- **Gustavosta/MagicPrompt-Stable-Diffusion**
- **meta-llama/Meta-Llama-3-70B-Instruct**

## Functionality

This App was creating using the HuggingFace Inference API.  Although Free to use, some functionality isn't available yet.  The Style and Layout switches are based on the IP adapter which isn't supported by the Inference API. If you decide to use custom endpoints this is available now

## License

This project is licensed under the [MIT License](LICENSE).

## Acknowledgments :trophy:

This application is built with Expo, a powerful framework for building cross-platform mobile applications. Learn more about Expo: [https://expo.io](https://expo.io)

