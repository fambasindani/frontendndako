"use client"

import { useState } from "react"
import { View, TextInput, Text, TouchableOpacity, StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { Couleurs } from "./Couleurs"

const Input = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = "default",
  error,
  showPasswordToggle = false,
  multiline = false,
  numberOfLines = 1,
  style,
  ...props
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible)
  }

  const getBorderColor = () => {
    if (error) return Couleurs.borderError
    if (isFocused) return Couleurs.borderFocus
    return Couleurs.border
  }

  const getInputContainerStyle = () => {
    const baseStyle = [styles.inputContainer, { borderColor: getBorderColor() }, error && styles.inputContainerError]

    if (multiline) {
      const height = Math.max(48, (numberOfLines || 1) * 24 + 24) // 24px per line + padding
      return [...baseStyle, { height, alignItems: "flex-start", paddingVertical: 12 }]
    }

    return baseStyle
  }

  const getInputStyle = () => {
    const baseStyle = [styles.input, error && styles.inputError]

    if (multiline) {
      return [...baseStyle, { textAlignVertical: "top", minHeight: numberOfLines * 20 }, style]
    }

    return [...baseStyle, style]
  }

  return (
    <View style={styles.container}>
      {label && <Text style={[styles.label, error && styles.labelError]}>{label}</Text>}

      <View style={getInputContainerStyle()}>
        <TextInput
          style={getInputStyle()}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Couleurs.inputPlaceholder}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={numberOfLines}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />

        {showPasswordToggle && !multiline && (
          <TouchableOpacity style={styles.eyeIcon} onPress={togglePasswordVisibility} activeOpacity={0.7}>
            <Ionicons
              name={isPasswordVisible ? "eye-off-outline" : "eye-outline"}
              size={24}
              color={error ? Couleurs.error : Couleurs.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: Couleurs.textPrimary,
    marginBottom: 8,
  },
  labelError: {
    color: Couleurs.error,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Couleurs.inputBackground,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
  },
  inputContainerError: {
    borderColor: Couleurs.borderError,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Couleurs.textPrimary,
    paddingVertical: 0,
  },
  inputError: {
    color: Couleurs.textPrimary,
  },
  eyeIcon: {
    padding: 4,
    marginLeft: 8,
  },
  errorText: {
    fontSize: 12,
    color: Couleurs.error,
    marginTop: 4,
    marginLeft: 4,
  },
})

export default Input
