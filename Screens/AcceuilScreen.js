import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import Annonce from "../Composant/Annonce "; // ✅ retiré l’espace
import Accueil1 from "../Composant/Accueil1"; // ton 2ème composant
import Accueil2 from "../Composant/Accueil2"; // ton 3ème composant

export default function AccueilScreen() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 30 }} // 👈 espace en bas
    >
      {/* Composant Annonce */}
      <Annonce />

      {/* Propriétés ajoutées récemment */}
      <Accueil1 />

      {/* Dernières propriétés */}
      <Accueil2 />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5", // couleur de fond
  },
});
