# Pixel Prompt Frontend

This is the frontend component of Pixel Prompt it's used in conjunction with the container and backend versions. This frontend serves as the user interface for interacting with the underlying ML models and backend services, providing a seamless and intuitive experience across multiple platforms.

For more discussion about the architectures [Cloud Bound](https://medium.com/@HatmanStack/cloud-bound-react-native-and-fastapi-ml-684a658f967a).  

## Preview :zap:

To preview the application visit the hosted version on the Hugging Face Spaces platform [here](https://huggingface.co/spaces/Hatman/pixel-prompt).

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

#### Image to Image

- **timbrooks/instruct-pix2pix**
- **stabilityai/stable-diffusion-xl-refiner-1.0**
       
#### Text to Image

- **stabilityai/stable-diffusion-3-medium**
- **stabilityai/stable-diffusion-xl-base-1.0**
- **SPO-Diffusion-Models/SPO-SDXL_4k-p_10ep**
- **Fictiverse/Fictiverse/Stable_Diffusion_VoxelArt_Model**
- **Fictiverse/Stable_Diffusion_PaperCut_Model**
- **dallinmackay/Van-Gogh-diffusion**
- **nousr/robo-diffusion**
- **Eugeoter/artiwaifu-diffusion-1.0**
- **nitrosocke/Arcane-Diffusion**
- **Fictiverse/Stable_Diffusion_BalloonArt_Model**
- **prompthero/openjourney**
- **juliajoanna/sdxl-flintstones_finetuning_1**
- **segmind/Segmind-Vega**
- **digiplay/AbsoluteReality_v1.8.1**
- **dreamlike-art/dreamlike-photoreal-2.0**
- **digiplay/Acorn_Photo_v1**

### Prompts

- **mistralai/Mistral-7B-Instruct-v0.3**
- **roborovski/superprompt-v1**
- **google/gemma-1.1-7b-it**

## Functionality

This App was creating using the HuggingFace Inference API.  Although Free to use, some functionality isn't available yet.  The Style and Layout switches are based on the IP adapter which isn't supported by the Inference API. If you decide to use custom endpoints this is available now

## License

This project is licensed under the [MIT License](LICENSE).

## Acknowledgments :trophy:

This application is built with Expo, a powerful framework for building cross-platform mobile applications. Learn more about Expo: [https://expo.io](https://expo.io)

