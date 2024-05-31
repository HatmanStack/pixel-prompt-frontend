# Pixel Prompt Frontend

This repository houses the frontend component of the Pixel Prompt application, a versatile platform designed to streamline the deployment of large-scale machine learning (ML) applications. Built using React Native, this frontend seamlessly integrates with a symmetrical backend component powered by FastAPI and Docker.

While currently deployed with diffusion models, Pixel Prompt is engineered to serve a wide range of ML workloads, offering flexibility and scalability. The frontend leverages React to construct robust and responsive static components, enabling efficient deployment within a containerized environment alongside the backend or as a separate entity for optimized resource utilization.

## Components and Deployment Architectures

To ensure a comprehensive understanding of the application's architecture, we've outlined the key components and deployment strategies:

1. **Frontend**: Developed using React Native, this component serves as the primary user interface, facilitating seamless interactions with the underlying ML models and backend services.

2. **Backend**: The backend component, built with FastAPI and Docker, provides a robust and scalable foundation for hosting and managing the ML models and associated APIs.

3. **Containerization**: Leveraging Docker, both the frontend and backend components can be packaged into lightweight and portable containers, ensuring consistent and reproducible deployments across diverse environments.

4. **Deployment Architectures**: Pixel Prompt supports flexible deployment architectures, allowing users to deploy the frontend and backend components together within a single container or as separate entities. This modular approach enables optimizations based on resource requirements, scaling needs, and performance considerations.

With its versatile architecture and cutting-edge technologies, Pixel Prompt empowers developers and researchers to  integrate and deploy a wide range of ML models. For more discussion about the architectures [Cloud Bound](https://medium.com/@HatmanStack/cloud-bound-react-native-and-fastapi-ml-684a658f967a).  

## Preview

To preview the application visit the hosted version on the Hugging Face Spaces platform [here](https://huggingface.co/spaces/Hatman/react-native-serve-ml).

## Screenshots

<table>
  <tr>
    <td><img src="https://github.com/HatmanStack/pixel-prompt-frontend/blob/main/pics/pixel-prompt-frontend.png" alt="Image 1"></td>
    <td><img src="https://github.com/HatmanStack/pixel-prompt-frontend/blob/main/pics/pixel-prompt_frontend-1.png" alt="Image 2"></td>
    </tr>
    <tr>
    <td><img src="https://github.com/HatmanStack/pixel-prompt-frontend/blob/main/pics/pixel-prompt-frontend-2.png" alt="Image 3"></td>
  </tr>
</table>

## Prerequisites

Before running this application locally, ensure that you have the following dependencies installed on your machine:

### Frontend

- Node
- npm (Node Package Manager)

### Backend

- Pytorch for cpu is installed by default for a cuda install refer to the pytorch [download helper](https://pytorch.org/get-started/locally/)

## Installation

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

## License

This project is licensed under the [MIT License](LICENSE).

## Acknowledgments

- This application is built with Expo, a powerful framework for building cross-platform mobile applications. Learn more about Expo: [https://expo.io](https://expo.io)

