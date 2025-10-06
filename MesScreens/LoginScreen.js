import React, { useContext, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";


import { useNavigation } from "@react-navigation/native";
import { getApi } from "../Api/getApi.js";
import ModalPop from "../Modal/Message.js";

import { AuthContext } from "../context/AuthContext.js"; // Importez le contexte

import Logo from "../Composant/Logo.js";
import { Couleurs } from "../Composant/Couleurs.js";
import Button from "../Composant/Button.js";
import Input from "../Composant/Input.js";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginScreen = () => {
  const navigation = useNavigation();
  const { login } = useContext(AuthContext); // Utilisez le contexte

  // États des champs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("success");

  // Validation email
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Validation formulaire
  const validateForm = () => {
    const newErrors = {};
    if (!email.trim()) newErrors.email = "L'email est requis";
    else if (!validateEmail(email)) newErrors.email = "Format d'email invalide";

    if (!password.trim()) newErrors.password = "Le mot de passe est requis";
    else if (password.length < 6) newErrors.password = "Le mot de passe doit contenir au moins 6 caractères";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      const api = getApi();
      const response = await api.post("api/login", { email, password });
      const data = response.data;

      // Vérifiez si le token existe dans la réponse
      if (data.token) {
        await login(data.token, data.utilisateur); // Utilisez la fonction login du contexte
        setEmail("");
        setPassword("");

        await AsyncStorage.setItem("token", data.token);
        await AsyncStorage.setItem("userRole", data.utilisateur.role);
        await AsyncStorage.setItem("userId", data.utilisateur.id.toString());
        await AsyncStorage.setItem("userPrenom", data.utilisateur.prenom);
        await AsyncStorage.setItem("userNom", data.utilisateur.nom_famille);

        setModalMessage("Connexion réussie !");
        setModalType("success");
        setModalVisible(true);
        navigation.navigate('Propriétés');

        setTimeout(() => {
          setModalVisible(false);
        }, 1500);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setModalMessage(error.response.data.message || "Identifiants invalides");
      } else {
        console.error("Erreur login:", error);
        setModalMessage("Une erreur inconnue s'est produite.");
      }

      setModalType("error");
      setModalVisible(true);
    } finally {
      setLoading(false);
    }
  };

  // Redirection vers la page d'inscription
  const handleSignUp = () => {
    navigation.navigate("Register");
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.logoContainer}>
        <Logo size="large" />
      </View>

      <View style={styles.formContainer}>
        <View style={styles.signUpContainer}>
          <Text style={styles.signUpText}>Vous n'avez pas de compte ? </Text>
          <TouchableOpacity onPress={handleSignUp}>
            <Text style={styles.signUpLink}>Inscrivez-vous</Text>
          </TouchableOpacity>
        </View>

        <Input
          label="Email"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            if (errors.email) setErrors({ ...errors, email: null });
          }}
          placeholder="Entrez votre email"
          keyboardType="email-address"
          error={errors.email}
          autoCapitalize="none"
        />

        <Input
          label="Mot de passe"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            if (errors.password) setErrors({ ...errors, password: null });
          }}
          placeholder="Entrez votre mot de passe"
          secureTextEntry={true}
          showPasswordToggle={true}
          error={errors.password}
        />

        <Button
          title={loading ? "Connexion..." : "Se connecter"}
          onPress={handleLogin}
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
  );
};

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
});

export default LoginScreen;