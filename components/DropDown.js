import { useState } from "react";
import { StyleSheet } from "react-native";
import { Dropdown } from "react-native-element-dropdown";

export default function DropDownComponent({
  passModelID,
  
}) {
    const [placeholderModelID, setPlaceholderModelID] = useState("Model ID");
      const data = [ 
        {
          label: "Random",
          value: "Random",
        },
        {
          label: "Stable Diffusion 3",
          value: "stabilityai/stable-diffusion-3-medium",
        },
        {
          label: "OpenDalle",
          value: "dataautogpt3/OpenDalleV1.1",
        },
        {
          label: "Stable Hamster",
          value: "SG161222/RealVisXL_V4.0",
        },
        {
          label: "Juggernaut",
          value: "digiplay/Juggernaut_final",
        },
        {
          label: "Kolors",
          value: "gokaygokay/Kolors",
        },
        {
          label: "Stable Diffusion XL",
          value: "stabilityai/stable-diffusion-xl-base-1.0",
        },   
        { label: "Fluently", value: "fluently/Fluently-XL-Final" },
        { label: "Pixel", value: "nerijs/pixel-art-xl" },
        { label: "Voxel", value: "Fictiverse/Voxel_XL_Lora" },
        { label: "Van-Gogh", value: "dallinmackay/Van-Gogh-diffusion" },
        { label: "Anime - (gsdf)", value: "gsdf/Counterfeit-V2.5" },
      ];
      
  return (
    <Dropdown
      style={styles.dropdown}
      selectedTextStyle={styles.selectedTextStyle}
      placeholderStyle={styles.placeholderStyle}
      data={data}
      labelField="label"
      valueField="value"
      placeholder={placeholderModelID}
      onChange={(item) => {
        passModelID(item);
        setPlaceholderModelID(item.label);
      }}
    />
  );
}

const colors = {
  borderBottomColor: "#9DA58D",
  color: "#FFFFFF",
};
const styles = StyleSheet.create({
  dropdown: {
    margin: 16,
    height: 50,
    width: 340,
    borderBottomColor: colors.borderBottomColor,
    borderBottomWidth: 3,
  },
  placeholderStyle: {
    color: colors.color,
    fontSize: 25,
    fontFamily: "Sigmar",
    textAlign: "center",
    letterSpacing: 3,
  },
  selectedTextStyle: {
    color: colors.color,
    fontSize: 20,
    fontFamily: "Sigmar",
    letterSpacing: 3,
    textAlign: "center",
  },
});
