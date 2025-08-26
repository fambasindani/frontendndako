"use client"

import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert,   StatusBar } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import Input from "./Input.js"
import Button from "./Button.js"
import Logo from "./Logo.js"
import { Couleurs } from "./Couleurs.js"
import { useNavigation } from "@react-navigation/native"

const LoginScreen = () => {
    const navigation = useNavigation(); // Initialisez useNavigation
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validateForm = () => {
    const newErrors = {}

    if (!email.trim()) {
      newErrors.email = "L'email est requis"
    } else if (!validateEmail(email)) {
      newErrors.email = "Format d'email invalide"
    }

    if (!password.trim()) {
      newErrors.password = "Le mot de passe est requis"
    } else if (password.length < 6) {
      newErrors.password = "Le mot de passe doit contenir au moins 6 caractères"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleLogin = async () => {
    if (!validateForm()) return

    setLoading(true)

    // Simulation d'une connexion
    setTimeout(() => {
      setLoading(false)
      Alert.alert("Succès", "Connexion réussie !")
    }, 2000)
  }

  const handleForgotPassword = () => {
    Alert.alert("Mot de passe oublié", "Un email de récupération sera envoyé.")
  }

  const handleSignUp = () => {
   // Alert.alert("Inscription", "Redirection vers la page d'inscription.")
     navigation.navigate('Register');
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>

      {/* Header avec flèche de retour 
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Couleurs.textPrimary} />
        </TouchableOpacity>
      </View>
      
       */}





      {/* Logo */}
      <View style={styles.logoContainer}>
        <Logo size="large" />
      </View>

      {/* Formulaire */}
      <View style={styles.formContainer}>
        <View style={styles.signUpContainer}>
          <Text style={styles.signUpText}>Vous n'avez pas un compte ? </Text>
          <TouchableOpacity onPress={handleSignUp}>
            <Text style={styles.signUpLink}>Inscrivez-vous</Text>
          </TouchableOpacity>
        </View>

        <Input
          label="Email"
          value={email}
          onChangeText={(text) => {
            setEmail(text)
            if (errors.email) {
              setErrors({ ...errors, email: null })
            }
          }}
          placeholder="Entrez votre email"
          keyboardType="email-address"
          error={errors.email}
          autoCapitalize="none"
        />

        <Input
          label="Password"
          value={password}
          onChangeText={(text) => {
            setPassword(text)
            if (errors.password) {
              setErrors({ ...errors, password: null })
            }
          }}
          placeholder="Entrez votre mot de passe"
          secureTextEntry={true}
          showPasswordToggle={true}
          error={errors.password}
        />

        {/* Remember me et Forgot password */}
        <View style={styles.optionsContainer}>
          <TouchableOpacity style={styles.rememberContainer} onPress={() => setRememberMe(!rememberMe)}>
            <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
              {rememberMe && <Ionicons name="checkmark" size={16} color={Couleurs.white} />}
            </View>
            <Text style={styles.rememberText}>Rester connecté</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleForgotPassword}>
            <Text style={styles.forgotText}>Mot de passe oublié?</Text>
          </TouchableOpacity>
        </View>

        {/* Bouton de connexion */}
        <Button
          title="Se connecter"
          onPress={handleLogin}
          loading={loading}
          style={styles.loginButton}
          icon="checkmark-circle"
          iconPosition="right"
        />
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Couleurs.background,
    paddingTop: 20,
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  formContainer: {
    flex: 1,
  },
  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 32,
  },
  signUpText: {
    fontSize: 14,
    color: Couleurs.textSecondary,
  },
  signUpLink: {
    fontSize: 14,
    color: Couleurs.primary,
    fontWeight: "600",
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 32,
  },
  rememberContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: Couleurs.border,
    borderRadius: 4,
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: Couleurs.primary,
    borderColor: Couleurs.primary,
  },
  rememberText: {
    fontSize: 14,
    color: Couleurs.textSecondary,
  },
  forgotText: {
    fontSize: 14,
    color: Couleurs.primary,
    fontWeight: "500",
  },
  loginButton: {
    marginTop: 8,
  },
})

export default LoginScreen
