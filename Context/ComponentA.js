import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { useUserContext } from './UserProvider'; // Assurez-vous que le chemin est correct

const ComponentA = ({ navigation }) => {
  const { setUserData } = useUserContext(); // Utiliser le hook pour accéder aux données

const handleSelectUser = (id) => {
  if (id === 1) {
    setUserData({ id: 1, sexe: 'Masculin', nom: 'Pierre' });
  } else if (id === 2) {
    setUserData({ id: 2, sexe: 'Féminin', nom: 'Nicole' });
  }
  navigation.navigate('ComponentB');
};

  return (
    <View style={styles.container}>
      <Button
        title="Sélectionner Pierre"
        onPress={() => handleSelectUser(1)}
        color="#6200ee" // Couleur spécifique du bouton
      />
      <Button
        title="Sélectionner Nicole"
        onPress={() => handleSelectUser(2)}
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
  },
  button: {
    margin: 10,
    padding: 10,
    backgroundColor: '#6200ee', // Couleur du bouton
    borderRadius: 5,
  },
  buttonText: {
    color: '#ffffff', // Couleur du texte du bouton
    textAlign: 'center',
  },
});

export default ComponentA;