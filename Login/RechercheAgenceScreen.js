import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import ModalRechercheAgence from './ModalRechercheAgence';
import { Couleurs } from '../Composant/Couleurs'; // même fichier de couleurs

export default function RechercheAgenceScreen() {
  const [modalVisible, setModalVisible] = useState(false);

  const handleSearch = (query) => {
    console.log('Recherche lancée pour :', query);
    setModalVisible(false); // Fermer le modal après la recherche
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.openButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.openButtonText}>🔍 Rechercher une agence</Text>
      </TouchableOpacity>

      <ModalRechercheAgence
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSearch={handleSearch}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Couleurs.background,
  },
  openButton: {
    backgroundColor: Couleurs.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  openButtonText: {
    color: Couleurs.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
