import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const Annonce = () => {
  const [selected, setSelected] = useState('Tout'); // État pour le genre sélectionné

  const genres = ['Tout', 'Location', 'Vente', 'Journalier'];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Genre d'annonce</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.buttonContainer}>
        {genres.map((genre) => (
          <TouchableOpacity 
            key={genre} 
            style={[
              styles.button, 
              selected === genre ? styles.selectedButton : null
            ]}
            onPress={() => setSelected(genre)} // Met à jour l'état lors du clic
          >
            <Text style={[
              styles.buttonText, 
              selected === genre ? styles.selectedButtonText : null
            ]}>
              {genre}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row', // Aligne les boutons horizontalement
  },
  button: {
    backgroundColor: 'white', // Couleur par défaut
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#224270',
    paddingVertical: 10,
    paddingHorizontal: 15,
    margin: 5,
    // flex: 1, // Supprimé pour permettre le défilement horizontal
  },
  selectedButton: {
    backgroundColor: '#224270', // Couleur pour le bouton sélectionné
  },
  buttonText: {
    color: '#224270', // Couleur de texte par défaut
    fontWeight: 'bold',
    textAlign: 'center', // Centre le texte
  },
  selectedButtonText: {
    color: 'white', // Texte blanc pour le bouton sélectionné
  },
});

export default Annonce;