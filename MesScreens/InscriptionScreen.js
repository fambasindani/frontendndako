import { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Input from "../Composant/Input.js";
import Button from "../Composant/Button.js";
import Droplist from "../Composant/Droplist.js";
import { Couleurs } from "../Composant/Couleurs.js"; 
import { getApi } from "../Api/getApi.js";
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

const InscriptionScreen = () => {
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [typesProprietaire, setTypesProprietaire] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [villes, setVilles] = useState([]);
  const [communes, setCommunes] = useState([]);
  const [utilisateurId, setUtilisateurId] = useState("");

  const [formData, setFormData] = useState({
    typeProprietaire: null,
    prix: "",
    nombreChambres: "",
    nombreSalleBains: "",
    dimension: "",
    description: "",
    statut: 1,
    province: null,
    ville: null,
    commune: null,
    avenue: "",
    quartier: "",
    imagePrincipale: null,
    autresImages: [],
    latitude: null,
    longitude: null,
  });

  // Localisation en temps réel
  useEffect(() => {
    let locationSubscriber;
    const getLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert("Permission refusée", "Accordez l'accès à la localisation pour continuer.");
        return;
      }

      locationSubscriber = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, distanceInterval: 1 },
        (loc) => {
          setFormData(prev => ({
            ...prev,
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
          }));
        }
      );
    };

    getLocation();
    return () => locationSubscriber && locationSubscriber.remove();
  }, []);

  // Charger types de propriété
  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        setUtilisateurId(userId);
        const token = await AsyncStorage.getItem("token");
        if (!token) return setFetching(false);

        const api = getApi();
        const res = await api.get("/api/type-proprietes", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const options = res.data.map(item => ({ value: item.id, label: item.nom_propriete }));
        setTypesProprietaire(options);
      } catch (err) {
        console.error("Erreur types de propriété :", err.response?.data || err.message);
      } finally {
        setFetching(false);
      }
    };
    fetchTypes();
  }, []);

  // Charger provinces
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) return;
        const api = getApi();
        const res = await api.get("/api/provinces", { headers: { Authorization: `Bearer ${token}` } });
        const opts = res.data.map(p => ({ value: p.id, label: p.nom_province }));
        setProvinces(opts);
      } catch (err) {
        console.error("Erreur provinces :", err.response?.data || err.message);
      }
    };
    fetchProvinces();
  }, []);

  // Charger villes quand province change
  useEffect(() => {
    if (!formData.province) {
      setVilles([]);
      setCommunes([]);
      return;
    }
    const fetchVilles = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) return;
        const api = getApi();
        const res = await api.get("/api/villes", { headers: { Authorization: `Bearer ${token}` } });
        const filtered = res.data
          .filter(v => v.id_province === formData.province.value)
          .map(v => ({ value: v.id, label: v.nom_ville }));
        setVilles(filtered);
        setCommunes([]);
      } catch (err) {
        console.error("Erreur villes :", err.response?.data || err.message);
      }
    };
    fetchVilles();
  }, [formData.province]);

  // Charger communes quand ville change
  useEffect(() => {
    if (!formData.ville) {
      setCommunes([]);
      return;
    }
    const fetchCommunes = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) return;
        const api = getApi();
        const res = await api.get("/api/communes", { headers: { Authorization: `Bearer ${token}` } });
        const filtered = res.data
          .filter(c => c.id_ville === formData.ville.value)
          .map(c => ({ value: c.id, label: c.nom_commune }));
        setCommunes(filtered);
      } catch (err) {
        console.error("Erreur communes :", err.response?.data || err.message);
      }
    };
    fetchCommunes();
  }, [formData.ville]);

  // Validation
  const validateForm = () => {
    const newErrors = {};
    if (!formData.typeProprietaire) newErrors.typeProprietaire = "Le type de propriété est requis";
    if (!formData.prix.trim()) newErrors.prix = "Le prix est requis";
    else if (isNaN(formData.prix) || Number.parseFloat(formData.prix) <= 0)
      newErrors.prix = "Le prix doit être un nombre valide";
    if (!formData.nombreChambres.trim()) newErrors.nombreChambres = "Le nombre de chambres est requis";
    if (!formData.nombreSalleBains.trim()) newErrors.nombreSalleBains = "Le nombre de salles de bains est requis";
    if (!formData.dimension.trim()) newErrors.dimension = "La dimension est requise";
    if (!formData.description.trim()) newErrors.description = "La description est requise";
    else if (formData.description.length < 20)
      newErrors.description = "La description doit contenir au moins 20 caractères";
    if (!formData.province) newErrors.province = "Veuillez sélectionner une province";
    if (!formData.ville) newErrors.ville = "Veuillez sélectionner une ville";
    if (!formData.commune) newErrors.commune = "Veuillez sélectionner une commune";
    if (!formData.avenue) newErrors.avenue = "Veuillez saisir l'avenue";
    if (!formData.quartier) newErrors.quartier = "Veuillez saisir le quartier";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Upload image principale
  const handleChargerImagePrincipale = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return Alert.alert("Permission refusée !");
    const picker = await ImagePicker.launchImageLibraryAsync({ quality: 0.7 });
    if (!picker.canceled) return setFormData(prev => ({ ...prev, imagePrincipale: picker.assets[0].uri }));
  };

  // Upload autres images
  const handleChargerImages = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return Alert.alert("Permission refusée !");
    const picker = await ImagePicker.launchImageLibraryAsync({ allowsMultipleSelection: true, quality: 0.7 });
    if (!picker.canceled) {
      const selected = picker.assets.map(a => a.uri);
      setFormData(prev => ({ ...prev, autresImages: selected }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return Alert.alert("Erreur", "Veuillez corriger les erreurs.");
    if (!formData.imagePrincipale) return Alert.alert("Erreur", "Image principale requise.");
    if (!formData.autresImages.length) return Alert.alert("Erreur", "Autres images requises.");
    if (formData.latitude === null || formData.longitude === null) return Alert.alert("Erreur", "Coordonnées requises.");

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return Alert.alert("Erreur", "Authentification requise !");
      const api = getApi();
      const formToSend = new FormData();
      formToSend.append("id_utilisateur", utilisateurId);
      formToSend.append("id_province", formData.province.value);
      formToSend.append("id_type", formData.typeProprietaire.value);
      formToSend.append("id_ville", formData.ville.value);
      formToSend.append("id_commune", formData.commune.value);
      formToSend.append("quartier", formData.quartier);
      formToSend.append("avenue", formData.avenue);
      formToSend.append("prix", parseFloat(formData.prix));
      formToSend.append("nombre_chambre", parseInt(formData.nombreChambres, 10));
      formToSend.append("nombre_salle_de_bain", parseInt(formData.nombreSalleBains, 10));
      formToSend.append("dimension", formData.dimension);
      formToSend.append("description", formData.description);
      formToSend.append("latitude", formData.latitude);
      formToSend.append("longitude", formData.longitude);
      formToSend.append("statut", formData.statut);

      formToSend.append("image_principale", { uri: formData.imagePrincipale, type: "image/jpeg", name: "image_principale.jpg" });
      formData.autresImages.forEach((uri, i) => {
        formToSend.append(`autres_images[${i}]`, { uri, type: "image/jpeg", name: `autres_image_${i}.jpg` });
      });

      await api.post("/api/proprietes", formToSend, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" }
      });

      Alert.alert("Succès", "Propriété ajoutée !");
      setFormData({
        typeProprietaire: null, prix: "", nombreChambres: "", nombreSalleBains: "", dimension: "",
        description: "", statut: 1, province: null, ville: null, commune: null, avenue: "",
        quartier: "", imagePrincipale: null, autresImages: [], latitude: null, longitude: null
      });
    } catch (err) {
      console.error(err);
      Alert.alert("Erreur", "Impossible d'ajouter la propriété.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return (
    <View style={styles.loader}>
      <ActivityIndicator size="large" color={Couleurs.primary} />
      <Text>Chargement des types...</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Droplist label="Type de propriété" value={formData.typeProprietaire} options={typesProprietaire} placeholder="Sélectionner le type"
          onSelect={item => { setFormData(prev => ({ ...prev, typeProprietaire: item })); setErrors(prev => ({ ...prev, typeProprietaire: null })); }}
          error={errors.typeProprietaire} />

        <Droplist label="Province" value={formData.province} options={provinces} placeholder="-- Choisir une province --"
          onSelect={item => { setFormData(prev => ({ ...prev, province: item, ville: null, commune: null })); setErrors(prev => ({ ...prev, province: null })); }}
          error={errors.province} />

        <Droplist label="Ville" value={formData.ville} options={villes} placeholder="-- Choisir une ville --"
          onSelect={item => { setFormData(prev => ({ ...prev, ville: item, commune: null })); setErrors(prev => ({ ...prev, ville: null })); }}
          disabled={!formData.province} error={errors.ville} />

        <Droplist label="Commune" value={formData.commune} options={communes} placeholder="-- Choisir une commune --"
          onSelect={item => { setFormData(prev => ({ ...prev, commune: item })); setErrors(prev => ({ ...prev, commune: null })); }}
          disabled={!formData.ville} error={errors.commune} />

        <Input label="Quartier" value={formData.quartier} onChangeText={text => { setFormData(prev => ({ ...prev, quartier: text })); setErrors(prev => ({ ...prev, quartier: null })); }} placeholder="Entrer le quartier" error={errors.quartier} />
        <Input label="Avenue" value={formData.avenue} onChangeText={text => { setFormData(prev => ({ ...prev, avenue: text })); setErrors(prev => ({ ...prev, avenue: null })); }} placeholder="Entrer l'avenue" error={errors.avenue} />
        <Input label="Prix: Vente ou Location" value={formData.prix} onChangeText={text => { setFormData(prev => ({ ...prev, prix: text })); setErrors(prev => ({ ...prev, prix: null })); }} placeholder="Entrer le prix" keyboardType="numeric" error={errors.prix} />

        <View style={styles.row}>
          <View style={styles.halfWidth}>
            <Input label="Nombre Chambres" value={formData.nombreChambres} onChangeText={text => { setFormData(prev => ({ ...prev, nombreChambres: text })); setErrors(prev => ({ ...prev, nombreChambres: null })); }} placeholder="0" keyboardType="numeric" error={errors.nombreChambres} />
          </View>
          <View style={styles.halfWidth}>
            <Input label="Nombre salle de bains" value={formData.nombreSalleBains} onChangeText={text => { setFormData(prev => ({ ...prev, nombreSalleBains: text })); setErrors(prev => ({ ...prev, nombreSalleBains: null })); }} placeholder="0" keyboardType="numeric" error={errors.nombreSalleBains} />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.halfWidth}>
            <Input label="Dimension" value={formData.dimension} onChangeText={text => { setFormData(prev => ({ ...prev, dimension: text })); setErrors(prev => ({ ...prev, dimension: null })); }} placeholder="Ex: 100m²" error={errors.dimension} />
          </View>
        </View>

        <Input label="Description de la propriété" value={formData.description} onChangeText={text => { setFormData(prev => ({ ...prev, description: text })); setErrors(prev => ({ ...prev, description: null })); }} placeholder="Décrivez votre propriété en détail..." multiline={true} numberOfLines={4} style={styles.textArea} error={errors.description} />

        <TouchableOpacity style={styles.uploadButton} onPress={handleChargerImagePrincipale} activeOpacity={0.8}>
          <Ionicons name="cloud-upload-outline" size={24} color={Couleurs.primary} />
          <Text style={styles.uploadText}>Charger l'image principale</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.uploadButton} onPress={handleChargerImages} activeOpacity={0.8}>
          <Ionicons name="cloud-upload-outline" size={24} color={Couleurs.primary} />
          <Text style={styles.uploadText}>Charger autres images</Text>
        </TouchableOpacity>

        <Text style={styles.imageCountText}>Nombre d'images sélectionnées : {formData.autresImages.length}</Text>

        <View style={styles.statutContainer}>
          <Text style={styles.statutLabel}>Statut de la propriété</Text>
          <View style={styles.statutButtons}>
            <TouchableOpacity style={[styles.statutButton, formData.statut === 1 && styles.statutButtonActive]} onPress={() => setFormData(prev => ({ ...prev, statut: 1 }))} activeOpacity={0.8}>
              <Text style={[styles.statutButtonText, formData.statut === 1 && styles.statutButtonTextActive]}>En Vente</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.statutButton, formData.statut === 0 && styles.statutButtonActive]} onPress={() => setFormData(prev => ({ ...prev, statut: 0 }))} activeOpacity={0.8}>
              <Text style={[styles.statutButtonText, formData.statut === 0 && styles.statutButtonTextActive]}>En Location</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Button title="Ajouter" onPress={handleSubmit} loading={loading} icon="add-circle" iconPosition="right" style={styles.submitButton} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Couleurs.background },
  content: { padding: 20, paddingBottom: 40 },
  row: { flexDirection: "row", justifyContent: "space-between", gap: 12 },
  halfWidth: { flex: 1 },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Couleurs.white,
    borderWidth: 2,
    borderColor: Couleurs.primary,
    borderStyle: "dashed",
    borderRadius: 8,
    paddingVertical: 20,
    paddingHorizontal: 16,
    marginBottom: 10,
    marginTop: 10,
  },
  uploadText: { marginLeft: 10, color: Couleurs.primary },
  statutContainer: { marginVertical: 12 },
  statutLabel: { marginBottom: 6, fontWeight: "600" },
  statutButtons: { flexDirection: "row", gap: 12 },
  statutButton: { flex: 1, paddingVertical: 10, borderRadius: 6, borderWidth: 1, borderColor: Couleurs.primary, alignItems: "center" },
  statutButtonActive: { backgroundColor: Couleurs.primary },
  statutButtonText: { color: Couleurs.primary, fontWeight: "600" },
  statutButtonTextActive: { color: Couleurs.white },
  textArea: { textAlignVertical: "top" },
  submitButton: { marginTop: 20 },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  imageCountText: { marginTop: 4, marginBottom: 8, textAlign: "center" },
});

export default InscriptionScreen;
