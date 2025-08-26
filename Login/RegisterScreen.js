"use client"

import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import Input from "./Input.js"
import Button from "./Button.js"
import Logo from "./Logo.js"
import { Couleurs } from "./Couleurs.js"
import PhoneInput from "./PhoneInput.js"
import { useNavigation } from "@react-navigation/native"

const RegisterScreen = () => {
    const navigation = useNavigation(); // Initialisez useNavigation
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [passwordRepeat, setPasswordRepeat] = useState("")
    const [prenom, setPrenom] = useState("")
    const [nom_famille, setNom] = useState("")
    const [telephone, setTelephone] = useState("")
    const [selectedCountry, setSelectedCountry] = useState(null)
    const [rememberMe, setRememberMe] = useState(false)
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState({})
    const [showPassword, setShowPassword] = useState(false)
    const [showPasswordRepeat, setShowPasswordRepeat] = useState(false)

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }

    const validateForm = () => {
        const newErrors = {}

        if (!prenom.trim()) {
            newErrors.prenom = "Le prénom est requis"
        }

        if (!nom_famille.trim()) {
            newErrors.nom_famille = "Le nom de famille est requis"
        }

        if (!email.trim()) {
            newErrors.email = "L'email est requis"
        } else if (!validateEmail(email)) {
            newErrors.email = "Format d'email invalide"
        }

        if (!telephone.trim()) {
            newErrors.telephone = "Le numéro de téléphone est requis"
        }

        if (!password.trim()) {
            newErrors.password = "Le mot de passe est requis"
        } else if (password.length < 6) {
            newErrors.password = "Le mot de passe doit contenir au moins 6 caractères"
        }

        if (password !== passwordRepeat) {
            newErrors.passwordRepeat = "Les mots de passe ne correspondent pas"
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
            Alert.alert("Succès", "Inscription réussie !")
        }, 2000)
    }

    const handleForgotPassword = () => {
        Alert.alert("Mot de passe oublié", "Un email de récupération sera envoyé.")
    }

    const handleSignUp = () => {
         //Alert.alert("Inscription", "Redirection vers la page d'inscription.")
           navigation.navigate('Connexion');


    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            {/* Header avec flèche de retour */}
          {/*   <View style={styles.header}>
                <TouchableOpacity style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={Couleurs.textPrimary} />
                </TouchableOpacity>
            </View> */}

            {/* Logo */}
            <View style={styles.logoContainer}>
                <Logo size="large" />
            </View>

            {/* Formulaire */}
            <View style={styles.formContainer}>
                <View style={styles.signUpContainer}>
                    <Text style={styles.signUpText}>Vous avez un compte ? </Text>
                    <TouchableOpacity onPress={handleSignUp}>
                        <Text style={styles.signUpLink}>Connectez-vous</Text>
                    </TouchableOpacity>
                </View>

                <Input
                    label="Nom de famille *"
                    value={nom_famille}
                    onChangeText={(text) => {
                        setNom(text)
                        if (errors.nom_famille) {
                            setErrors({ ...errors, nom_famille: null })
                        }
                    }}
                    placeholder="Entrez votre nom de famille"
                    error={errors.nom_famille}
                    autoCapitalize="none"
                />

                <Input
                    label="Prénom *"
                    value={prenom}
                    onChangeText={(text) => {
                        setPrenom(text)
                        if (errors.prenom) {
                            setErrors({ ...errors, prenom: null })
                        }
                    }}
                    placeholder="Entrez votre prénom"
                    error={errors.prenom}
                    autoCapitalize="none"
                />

                <Input
                    label="Email *"
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

                <PhoneInput
                    label="Numéro de téléphone *"
                    value={telephone}
                    onChangeText={(text) => {
                        setTelephone(text)
                        if (errors.telephone) {
                            setErrors({ ...errors, telephone: null })
                        }
                    }}
                    selectedCountry={selectedCountry}
                    onCountrySelect={(country) => setSelectedCountry(country)}
                    error={errors.telephone}
                    placeholder="Votre numéro"
                />

                <Input
                    label="Mot de passe *"
                    value={password}
                    onChangeText={(text) => {
                        setPassword(text)
                        if (errors.password) {
                            setErrors({ ...errors, password: null })
                        }
                    }}
                    placeholder="Entrez votre mot de passe"
                    secureTextEntry={true}
                    showPasswordToggle={true} // Assurez-vous que cette propriété est définie
                    error={errors.password}
                    style={{ marginBottom: 16 }} // Exemple de style additionnel
                />

                <Input
                    label="Répelez le mot de passe *"
                    value={passwordRepeat}
                    onChangeText={(text) => {
                        setPasswordRepeat(text)
                        if (errors.passwordRepeat) {
                            setErrors({ ...errors, passwordRepeat: null })
                        }
                    }}
                    placeholder="Répétez votre mot de passe"
                    secureTextEntry={true}
                    showPasswordToggle={true}
                    error={errors.passwordRepeat}
                    style={{ marginBottom: 16 }}
                />

                {/* Bouton d'inscription */}
                <Button
                    title="S'inscrire"
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
        paddingBottom: 70, // Ajout de rembourrage pour assurer la visibilité du bouton
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
    loginButton: {
        marginTop: 8, // Ajustement du margement pour une meilleure visibilité
    },
})

export default RegisterScreen