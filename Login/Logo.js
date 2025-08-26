"use client"

import { View, Image, Text, StyleSheet } from "react-native"
import { Couleurs } from "./Couleurs.js"

const Logo = ({ size = "medium", showText = true, style }) => {
  const getLogoSize = () => {
    switch (size) {
      case "small":
        return { width: 60, height: 60 }
      case "large":
        return { width: 120, height: 120 }
      default:
        return { width: 80, height: 80 }
    }
  }

  const getTextSize = () => {
    switch (size) {
      case "small":
        return 14
      case "large":
        return 20
      default:
        return 16
    }
  }

  return (
    <View style={[styles.container, style]}>
      <Image source={require("../assets/KCI WHITE.png")} style={[styles.logo, getLogoSize()]} resizeMode="contain" />
      {showText && <Text style={[styles.text, { fontSize: getTextSize() }]}>CONCEPT IMMOBILIER</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    marginBottom: 8,
  },
  text: {
    fontWeight: "600",
    color: Couleurs.textPrimary,
    textAlign: "center",
    letterSpacing: 1,
  },
})

export default Logo
