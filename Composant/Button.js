"use client"

import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { Couleurs } from "./Couleurs.js"

const Button = ({
  title,
  onPress,
  variant = "primary",
  size = "medium",
  disabled = false,
  loading = false,
  icon,
  iconPosition = "left",
  style,
  textStyle,
  ...props
}) => {
  const getButtonStyle = () => {
    const baseStyle = [styles.button, styles[`button${variant.charAt(0).toUpperCase() + variant.slice(1)}`]]

    if (size === "small") baseStyle.push(styles.buttonSmall)
    if (size === "large") baseStyle.push(styles.buttonLarge)
    if (disabled) baseStyle.push(styles.buttonDisabled)

    return baseStyle
  }

  const getTextStyle = () => {
    const baseStyle = [styles.text, styles[`text${variant.charAt(0).toUpperCase() + variant.slice(1)}`]]

    if (size === "small") baseStyle.push(styles.textSmall)
    if (size === "large") baseStyle.push(styles.textLarge)
    if (disabled) baseStyle.push(styles.textDisabled)

    return baseStyle
  }

  return (
    <TouchableOpacity
      style={[...getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...props}
    >
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator size="small" color={variant === "primary" ? Couleurs.white : Couleurs.primary} />
        ) : (
          <>
            {icon && iconPosition === "left" && (
              <Ionicons
                name={icon}
                size={size === "small" ? 16 : size === "large" ? 24 : 20}
                color={variant === "primary" ? Couleurs.white : Couleurs.primary}
                style={styles.iconLeft}
              />
            )}
            <Text style={[...getTextStyle(), textStyle]}>{title}</Text>
            {icon && iconPosition === "right" && (
              <Ionicons
                name={icon}
                size={size === "small" ? 16 : size === "large" ? 24 : 20}
                color={variant === "primary" ? Couleurs.white : Couleurs.primary}
                style={styles.iconRight}
              />
            )}
          </>
        )}
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
  },
  buttonPrimary: {
    backgroundColor: Couleurs.primary,
  },
  buttonSecondary: {
    backgroundColor: Couleurs.secondary,
  },
  buttonOutline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: Couleurs.primary,
  },
  buttonSmall: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 36,
  },
  buttonLarge: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    minHeight: 56,
  },
  buttonDisabled: {
    backgroundColor: Couleurs.disabled,
    borderColor: Couleurs.disabled,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  textPrimary: {
    color: Couleurs.white,
  },
  textSecondary: {
    color: Couleurs.white,
  },
  textOutline: {
    color: Couleurs.primary,
  },
  textSmall: {
    fontSize: 14,
  },
  textLarge: {
    fontSize: 18,
  },
  textDisabled: {
    color: Couleurs.textSecondary,
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
})

export default Button
