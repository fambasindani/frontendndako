import React, { useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

export default function Details2() {
   

  return (
    <View style={styles.container}>
      {/* Description */}
      <Text style={styles.sectionTitle}>Description</Text>
      <Text style={styles.description}>
        Composition: 3 Chambres + Salon + 3 salle de bain + cuisine + Toilette
        visiteur + 2 balcons + buanderie + parkin pour véhicules. Tout charge,
        portail et sécurité absolue.
      </Text>

      {/* Détails du bien */}
      <Text style={styles.sectionTitle}>Détails du bien</Text>
      <View style={styles.detailBox}>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Date d'ajout:</Text>
          <Text style={styles.value}>15 août 2025</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Prix :</Text>
          <Text style={styles.value}>3000 $</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Type :</Text>
          <Text style={styles.value}>Maison</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Chambres :</Text>
          <Text style={styles.value}>3</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Salle de bains :</Text>
          <Text style={styles.value}>2</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Statut :</Text>
          <Text style={styles.value}>A Vendre - Disponible</Text>
        </View>
      </View>

      {/* Contact vendeur */}
      <Text style={styles.sectionTitle}>Contactez le vendeur</Text>
      <View style={styles.contactBox}>
        <View style={styles.contactHeader}>
          <Icon name="user-circle" size={40} color="#888" />
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.contactName}>Schadrack Sina</Text>
            <Text style={styles.contactRole}>Agent Immo</Text>
          </View>
        </View>

        {/* Téléphone */}
        <View style={styles.contactRow}>
          <Icon name="phone" size={18} color="#0d6efd" />
          <Text style={styles.contactText}> +243899786683 </Text>
        </View>

        {/* Email */}
        <View style={styles.contactRow}>
          <Icon name="envelope" size={18} color="#0d6efd" />
          <Text style={styles.contactText}> schadrack@gmail.com </Text>
        </View>

        {/* WhatsApp */}
        <TouchableOpacity style={styles.contactRow}>
          <Icon name="whatsapp" size={18} color="green" />
          <Text style={styles.contactText}> whatsapp </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: "#fff",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
    color: "#222",
  },
  description: {
    fontSize: 14,
    color: "#444",
    marginBottom: 10,
    lineHeight: 20,
  },
  detailBox: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ddd",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  value: {
    fontSize: 14,
    color: "#444",
  },
  contactBox: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 12,
  },
  contactHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  contactName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  contactRole: {
    fontSize: 13,
    color: "#666",
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  contactText: {
    marginLeft: 10,
    fontSize: 14,
    color: "#333",
  },
});
