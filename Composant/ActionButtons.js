import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // Assurez-vous d'installer expo vector icons

const ActionButtons = () => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button}>
        <MaterialIcons name="arrow-back" size={20} color="#224270" />
        <Text style={styles.buttonText}>Annuler</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Appliquer</Text>
        <MaterialIcons name="check" size={20} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9D74E', // Couleur jaune
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
    flex: 1,
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#224270', // Couleur du texte pour "Annuler"
    marginRight: 5,
    fontWeight: 'bold',
  },
  applyButtonText: {
    color: 'white', // Couleur du texte pour "Appliquer"
    marginLeft: 5,
    fontWeight: 'bold',
  },
});

export default ActionButtons;