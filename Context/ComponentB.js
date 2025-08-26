import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { useUserContext } from './UserProvider'; 
import ComponentC from './ComponentC';

const ComponentB = ({ navigation }) => {
  const { userData } = useUserContext();

  return (
    <View style={styles.container}>
      <Button
        title="Afficher Détails"
        onPress={() => navigation.navigate('ComponentC')}
        color="#6200ee" // Couleur spécifique du bouton
      />
      {/* Montre les détails dans le même écran pour simplifier */}
      <ComponentC />
      <Button
        title="Retour à A"
        onPress={() => navigation.goBack()}
        color="#6200ee" // Couleur spécifique du bouton
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0', // Couleur de fond
    padding: 20,
  },
  button: {
    margin: 10,
    padding: 10,
    backgroundColor: '#6200ee', // Couleur du bouton
    borderRadius: 5,
    width: '80%', // Largeur du bouton
  },
  buttonText: {
    color: '#ffffff', // Couleur du texte du bouton
    textAlign: 'center',
  },
});

export default ComponentB;