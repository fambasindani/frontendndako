import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import Detail1 from "../Composant/Details1";
import Details2 from "../Composant/Details2";
import ContactButtons from "../Composant/ContactButtons";

export default function DetailScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Partie 1 : Carrousel + infos principales */}
      <Detail1 />

      {/* Partie 2 : Description + détails du bien + contact */}
      <View style={styles.section}>
        <Details2 />
        <ContactButtons />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    paddingBottom: 40, // 👈 marge en bas pour laisser respirer
  },
  section: {
    marginTop: 10,
  },
});
