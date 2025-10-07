import { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApi } from "../Api/getApi";
import Droplist from "../Composant/Droplist";

export default function AjouteCommuneScreen({ onAdd, onCancel, commune, villes }) {
  const [nom, setNom] = useState("");
  const [selectedVille, setSelectedVille] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (commune) {
      setNom(commune.nom_commune || "");
      if (commune.ville) {
        setSelectedVille({ label: commune.ville.nom_ville, value: commune.ville.id });
      }
    }
  }, [commune]);

  const handleSubmit = async () => {
    if (!nom.trim()) {
      setErrorMessage("Le nom de la commune est requis.");
      return;
    }
    if (!selectedVille) {
      setErrorMessage("Veuillez sélectionner une ville.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const token = await AsyncStorage.getItem("token");
      const api = getApi();
      let response;

      if (commune) {
        // modification
        response = await api.put(
          `/api/communes/${commune.id}`,
          { nom_commune: nom.trim(), id_ville: selectedVille.value },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        Alert.alert("✅ Succès", "Commune mise à jour !");
      } else {
        // ajout
        response = await api.post(
          "/api/communes",
          { nom_commune: nom.trim(), id_ville: selectedVille.value },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        Alert.alert("✅ Succès", "Commune ajoutée !");
      }

      // Mettre à jour la liste côté parent
      onAdd();

      // Réinitialiser les champs si on était en ajout
      if (!commune) {
        setNom("");
        setSelectedVille(null);
      }
    } catch (error) {
      console.log("Erreur:", error.response?.data || error.message);
      const msg =
        error.response?.data?.errors?.nom_commune?.[0] ||
        error.response?.data?.message ||
        "Erreur lors de l’enregistrement.";
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {commune ? "Modifier la Commune" : "Ajouter une Commune"}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.formContainer}>
          <Text style={styles.label}>Ville</Text>
          <Droplist
           // label="Ville"
            value={selectedVille}
            onSelect={(item) => { setSelectedVille(item); setErrorMessage(""); }}
            options={villes.map((v) => ({ label: v.nom_ville, value: v.id }))}
            placeholder="Sélectionnez une ville"
            error={errorMessage.includes("ville") ? errorMessage : undefined}
          />
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.label}>Nom de la Commune</Text>
          <TextInput
            style={[styles.input, errorMessage.includes("nom") && styles.inputError]}
            placeholder="Ex: Gombe"
            value={nom}
            onChangeText={(text) => { setNom(text); setErrorMessage(""); }}
            placeholderTextColor="#94a3b8"
          />
          {errorMessage.includes("nom") && <Text style={styles.errorText}>{errorMessage}</Text>}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <Text style={styles.cancelButtonText}>Annuler</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.submitButton, (loading || !nom.trim() || !selectedVille) && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading || !nom.trim() || !selectedVille}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitButtonText}>{commune ? "Mettre à jour" : "Enregistrer"}</Text>}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 16, backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#e2e8f0" },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#1e293b" },
  content: { flex: 1, padding: 24 },
  formContainer: { marginBottom: 24 },
  label: { fontSize: 16, fontWeight: "600", color: "#1e293b", marginBottom: 8 },
  input: { backgroundColor: "#fff", borderWidth: 2, borderColor: "#e2e8f0", borderRadius: 12, padding: 16, fontSize: 16, color: "#1e293b" },
  inputError: { borderColor: "#ef4444" },
  errorText: { color: "#ef4444", marginTop: 4, fontSize: 13 },
  buttonContainer: { flexDirection: "row", gap: 12 },
  cancelButton: { flex: 1, paddingVertical: 16, borderRadius: 12, backgroundColor: "#fff", borderWidth: 2, borderColor: "#e2e8f0", alignItems: "center" },
  cancelButtonText: { fontSize: 16, fontWeight: "600", color: "#64748b" },
  submitButton: { flex: 1, paddingVertical: 16, borderRadius: 12, backgroundColor: "#10b981", alignItems: "center", justifyContent: "center", elevation: 2 },
  submitButtonDisabled: { backgroundColor: "#94a3b8" },
  submitButtonText: { fontSize: 16, fontWeight: "600", color: "#fff" },
});
