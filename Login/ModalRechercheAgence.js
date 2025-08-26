import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  Dimensions,
  StatusBar, // ✅ ajouté ici
} from 'react-native';
import { Couleurs } from './Couleurs';

const { width } = Dimensions.get('window');

export default function ModalRechercheAgence({ visible, onClose, onSearch }) {
  const [query, setQuery] = useState('');

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      {/* ✅ Fond sombre pour la barre de statut */}
      <StatusBar backgroundColor="rgba(0,0,0,0.5)" barStyle="light-content" />

      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              <Text style={styles.title}>Trouver une agence</Text>

              <TextInput
                style={styles.input}
                placeholder="Nom, ville, quartier..."
                placeholderTextColor={Couleurs.inputPlaceholder}
                value={query}
                onChangeText={setQuery}
              />

              <TouchableOpacity style={styles.button} onPress={() => onSearch(query)}>
                <Text style={styles.buttonText}>Rechercher une agence ✅</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}



const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: width * 0.85,
    padding: 20,
    borderRadius: 12,
    backgroundColor: Couleurs.white,
    elevation: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Couleurs.textPrimary,
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: Couleurs.border,
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    backgroundColor: Couleurs.inputBackground,
    color: Couleurs.textPrimary,
    marginBottom: 20,
  },
  button: {
    backgroundColor: Couleurs.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: Couleurs.white,
    fontSize: 16,
    fontWeight: '600',
  },
});
