import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const TypeImmobilier = () => {
  const types = [
    'Tout',
    'Appartement',
    'Studio',
    'Maison',
    'Villa',
    'Parcelle',
    'Terrain',
    'Commercial',
    'Flat Hôtel',
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Types d'immobilier</Text>
      <View style={styles.buttonContainer}>
        {types.map((type, index) => (
          <TouchableOpacity 
            key={index} 
            style={[
              styles.button, 
              type === 'Tout' ? styles.selectedButton : null
            ]}
          >
            <Text style={[
              styles.buttonText, 
              type === 'Tout' ? styles.selectedButtonText : null
            ]}>{type}</Text>
          </TouchableOpacity>
        ))}
      </View>
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
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: 'white', // Couleur par défaut
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#224270',
    paddingVertical: 10,
    paddingHorizontal: 15,
    margin: 5,
  },
  selectedButton: {
    backgroundColor: '#224270', // Couleur pour le bouton "Tout"
  },
  buttonText: {
    color: '#224270', // Couleur de texte par défaut
    fontWeight: 'bold',
  },
  selectedButtonText: {
    color: 'white', // Texte blanc pour le bouton "Tout"
  },
});

export default TypeImmobilier;