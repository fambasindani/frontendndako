import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Proprietes() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const utilisateur = await AsyncStorage.getItem("utilisateur");

        if (token && utilisateur) {
          setUserData({
            token,
            utilisateur: JSON.parse(utilisateur),
          });
        }
      } catch (error) {
        console.error("Erreur lors du chargement :", error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={styles.container}>
        <Text>Aucune donnée trouvée</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Bienvenue sur Concept Immobilier</Text>
      <Text style={styles.text}>🔑 Token : {userData.token}</Text>
      <Text style={styles.text}>👤 Utilisateur :</Text>
      {Object.entries(userData.utilisateur).map(([key, value]) => (
        <Text key={key} style={styles.text}>
          {key} : {String(value)}
        </Text>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  text: {
    fontSize: 16,
    marginVertical: 5,
  },
});
