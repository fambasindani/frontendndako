"use client"

import { useEffect, useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import Input from "../Composant/Input.js"
import Button from "../Composant/Button.js"
import Logo from "../Composant/Logo.js"
import { Couleurs } from "../Composant/Couleurs.js"
import PhoneInput from "../Composant/PhoneInput.js"
import { useNavigation } from "@react-navigation/native"
import Droplist from "../Composant/Droplist.js"
import axios from "axios"
import { getApi } from "../Api/getApi.js"
import ModalPop from "../Modal/Message.js"

const RegisterScreen = () => {
    const navigation = useNavigation()

    // États des champs
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [passwordRepeat, setPasswordRepeat] = useState("")
    const [prenom, setPrenom] = useState("")
    const [nom_famille, setNom] = useState("")
    const [telephone, setTelephone] = useState("")
    const [selectedCountry, setSelectedCountry] = useState(null)
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState({})
    const [typesOptions, setTypesOptions] = useState([])  // options du Droplist
    const [typeProprietaire, setTypeProprietaire] = useState(null) // valeur sélectionnée
    const [modalVisible, setModalVisible] = useState(false)
    const [modalMessage, setModalMessage] = useState("")
    const [modalType, setModalType] = useState("success") // "success" ou "error"


    // Options pour le type de propriété
    /*  const typesProprietaire = [
         { value: "parcelle", label: "Parcelle" },
         { value: "maison", label: "Maison" },
         { value: "appartement", label: "Appartement" },
         { value: "villa", label: "Villa" },
         { value: "terrain", label: "Terrain" },
         { value: "bureau", label: "Bureau" },
         { value: "commerce", label: "Commerce" },
     ] */




    useEffect(() => {
        const fetchTypes = async () => {
            try {
                const api = getApi()
                const response = await api.get("api/compte") // juste /compte
                const data = response.data

                // Transformer la réponse pour le Droplist
                const options = data.map(item => ({
                    value: item.id,
                    label: item.compte
                }))
                setTypesOptions(options) // <-- ici
            } catch (error) {
                console.error("Erreur lors du chargement des types :", error)
                Alert.alert("Erreur", "Impossible de charger les types de compte")
            }
        }

        fetchTypes()
    }, [])





    // Validation email
    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

    // Validation du formulaire
    const validateForm = () => {
        const newErrors = {}

        if (!prenom.trim()) newErrors.prenom = "Le prénom est requis"
        if (!nom_famille.trim()) newErrors.nom_famille = "Le nom de famille est requis"
        if (!email.trim()) newErrors.email = "L'email est requis"
        else if (!validateEmail(email)) newErrors.email = "Format d'email invalide"
        if (!telephone.trim()) newErrors.telephone = "Le numéro de téléphone est requis"
        if (!typeProprietaire) newErrors.typeProprietaire = "Le type de propriété est requis"
        if (!password.trim()) newErrors.password = "Le mot de passe est requis"
        else if (password.length < 6) newErrors.password = "Le mot de passe doit contenir au moins 6 caractères"
        if (password !== passwordRepeat) newErrors.passwordRepeat = "Les mots de passe ne correspondent pas"

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    // Gestion de l'inscription


    const handleRegister = async () => {
        if (!validateForm()) return

        setLoading(true)
        setErrors({}) // reset des erreurs avant l'envoi

        const formData = {
            prenom,
            nom_famille,
            email,
            telephone,
            password,
            role: "admin", // ou récupérer dynamiquement si besoin
            id_type_compte: typeProprietaire?.value,
        }

        try {
            const api = getApi() // ton instance Axios
            const response = await api.post("/api/utilisateurs", formData)

            setLoading(false)
            setModalMessage(response.data.message)
            setModalType("success")
            setModalVisible(true)

            //Alert.alert("Succès", "Inscription réussie !")
            //console.log("Réponse API :", response.data)

            // Optionnel : réinitialiser le formulaire
            setPrenom("")
            setNom("")
            setEmail("")
            setTelephone("")
            setPassword("")
            setPasswordRepeat("")
            setTypeProprietaire(null)

        } catch (error) {
            setLoading(false)

            if (error.response && error.response.status === 422) {
                // Validation Laravel
                const backendErrors = error.response.data.errors
                // Convertir en objet utilisable par setErrors
                const formattedErrors = {}
                for (let key in backendErrors) {
                    formattedErrors[key] = backendErrors[key][0] // prendre le 1er message
                }
                setErrors(formattedErrors)
            } else {
                console.error(error)
                // Alert.alert("Erreur", "Une erreur est survenue lors de l'inscription")

                setModalMessage("Une erreur est survenue !")
                setModalType("error")
                setModalVisible(true)

            }
        }
    }

    // Redirection vers la page de connexion
    const handleSignUp = () => {
        navigation.navigate('Connexion')
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <View style={styles.logoContainer}>
                <Logo size="large" />
            </View>

            <View style={styles.formContainer}>
                <View style={styles.signUpContainer}>
                    <Text style={styles.signUpText}>Vous avez un compte ? </Text>
                    <TouchableOpacity onPress={handleSignUp}>
                        <Text style={styles.signUpLink}>Connectez-vous</Text>
                    </TouchableOpacity>
                </View>

                <Droplist
                    label="Type de propriété *"
                    value={typeProprietaire}
                    onSelect={(item) => {
                        setTypeProprietaire(item)
                        if (errors.typeProprietaire) setErrors({ ...errors, typeProprietaire: null })
                    }}
                    placeholder="Sélectionner le type"
                    options={typesOptions}  // <-- ici, les options
                    error={errors.typeProprietaire}
                />



                <Input
                    label="Nom de famille *"
                    value={nom_famille}
                    onChangeText={(text) => {
                        setNom(text)
                        if (errors.nom_famille) setErrors({ ...errors, nom_famille: null })
                    }}
                    placeholder="Entrez votre nom de famille"
                    error={errors.nom_famille}
                />

                <Input
                    label="Prénom *"
                    value={prenom}
                    onChangeText={(text) => {
                        setPrenom(text)
                        if (errors.prenom) setErrors({ ...errors, prenom: null })
                    }}
                    placeholder="Entrez votre prénom"
                    error={errors.prenom}
                />

                <Input
                    label="Email *"
                    value={email}
                    onChangeText={(text) => {
                        setEmail(text)
                        if (errors.email) setErrors({ ...errors, email: null })
                    }}
                    placeholder="Entrez votre email"
                    keyboardType="email-address"
                    error={errors.email}
                />

                <PhoneInput
                    label="Numéro de téléphone *"
                    value={telephone}
                    onChangeText={(text) => {
                        setTelephone(text)
                        if (errors.telephone) setErrors({ ...errors, telephone: null })
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
                        if (errors.password) setErrors({ ...errors, password: null })
                    }}
                    placeholder="Entrez votre mot de passe"
                    secureTextEntry={true}
                    showPasswordToggle={true}
                    error={errors.password}
                />

                <Input
                    label="Répélez le mot de passe *"
                    value={passwordRepeat}
                    onChangeText={(text) => {
                        setPasswordRepeat(text)
                        if (errors.passwordRepeat) setErrors({ ...errors, passwordRepeat: null })
                    }}
                    placeholder="Répétez votre mot de passe"
                    secureTextEntry={true}
                    showPasswordToggle={true}
                    error={errors.passwordRepeat}
                />

                <Button
                    title="S'inscrire"
                    onPress={handleRegister}
                    loading={loading}
                    style={styles.loginButton}
                    icon="checkmark-circle"
                    iconPosition="right"
                />
                <ModalPop
                    visible={modalVisible}
                    message={modalMessage}
                    type={modalType}
                    onClose={() => setModalVisible(false)}
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
        paddingBottom: 70,
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
        marginTop: 8,
    },
})

export default RegisterScreen
