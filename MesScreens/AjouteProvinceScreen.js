import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { getApi } from "../Api/getApi";

export default function AjouteProvinceScreen({ onAdd, onCancel, province }) {
  const [nom, setNom] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const isEditMode = !!province; // vrai si on modifie

  useEffect(() => {
    if (province) setNom(province.nom_province);
  }, [province]);

  const handleChange = (text) => {
    if (errorMessage) setErrorMessage("");
    setNom(text);
  };

  const handleSubmit = async () => {
    if (!nom.trim()) {
      setErrorMessage("Le nom de la province est requis.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        setErrorMessage("Aucun token trouvé. Veuillez vous reconnecter.");
        setLoading(false);
        return;
      }

      const api = getApi();
      let response;

      if (isEditMode) {
        response = await api.put(
          `/api/provinces/${province.id}`,
          { nom_province: nom.trim() },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        response = await api.post(
          "/api/provinces",
          { nom_province: nom.trim() },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      if (response.status === 200 || response.status === 201) {
        onAdd(response.data); // renvoie l'objet complet
        setNom("");
        setErrorMessage("");
      } else {
        setErrorMessage("Réponse inattendue du serveur.");
      }
    } catch (error) {
      console.log("Erreur:", error.response?.data || error.message);
      const msg =
        error.response?.data?.errors?.nom_province?.[0] ||
        error.response?.data?.message ||
        "Erreur lors de l'enregistrement.";
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
          {isEditMode ? "Modifier la Province" : "Ajouter une Province"}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.formContainer}>
          <Text style={styles.label}>Nom de la Province</Text>
          <TextInput
            style={[styles.input, errorMessage ? styles.inputErrorBorder : null]}
            placeholder="Ex: Kinshasa"
            value={nom}
            onChangeText={handleChange}
            placeholderTextColor="#94a3b8"
          />
          {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={onCancel} disabled={loading}>
            <Text style={styles.cancelButtonText}>Annuler</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.submitButton, (!nom.trim() || loading) && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={!nom.trim() || loading}
          >
            <Ionicons name={loading ? "time" : "checkmark-circle"} size={20} color="#fff" />
            <Text style={styles.submitButtonText}>{loading ? "Envoi..." : "Enregistrer"}</Text>
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
  formContainer: { marginBottom: 16 },
  label: { fontSize: 16, fontWeight: "600", color: "#1e293b", marginBottom: 8 },
  input: { backgroundColor: "#fff", borderWidth: 2, borderColor: "#e2e8f0", borderRadius: 12, padding: 16, fontSize: 16, color: "#1e293b" },
  inputErrorBorder: { borderColor: "#ef4444" },
  errorText: { marginTop: 8, color: "#ef4444", fontSize: 13, fontWeight: "600" },
  buttonContainer: { flexDirection: "row", gap: 12, marginTop: 24 },
  cancelButton: { flex: 1, paddingVertical: 16, borderRadius: 12, backgroundColor: "#fff", borderWidth: 2, borderColor: "#e2e8f0", alignItems: "center" },
  cancelButtonText: { fontSize: 16, fontWeight: "600", color: "#64748b" },
  submitButton: { flex: 1, flexDirection: "row", paddingVertical: 16, borderRadius: 12, backgroundColor: "#10b981", alignItems: "center", justifyContent: "center", gap: 8, elevation: 2, shadowColor: "#10b981", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4 },
  submitButtonDisabled: { backgroundColor: "#94a3b8", elevation: 0 },
  submitButtonText: { fontSize: 16, fontWeight: "600", color: "#fff" },
});
