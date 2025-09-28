import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import ContactButtons from "../Composant/ContactButtons";
import Detail1 from "../Composant/Details1";
import Details2 from "../Composant/Details2";
import { ApiProviderDetails } from "../context/ApiProviderDetails";
import { useRoute } from "@react-navigation/native";

export default function DetailScreen() {
     const route = useRoute(); // Utilisez useRoute pour accéder aux paramètres
      const { id: routeId } = route.params || {}; // Récupérez l'id des paramètres

  return (

      <ApiProviderDetails routeId={routeId}>   
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Partie 1 : Carrousel + infos principales */}
      <Detail1 />

      {/* Partie 2 : Description + détails du bien + contact */}
      <View style={styles.section}>
        <Details2 />
        <ContactButtons />
      </View>
    </ScrollView>
    </ApiProviderDetails>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
   // paddingBottom: 10, // 👈 marge en bas pour laisser respirer
  },
  section: {
    marginTop: 10,
  },
});
