import React, { useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useUserContext } from './UserProvider'; 
import CustomModal from './CustomModal'; // Importer le nouveau composant Modal

const ComponentC = () => {
  const { userData } = useUserContext();
  const [modalVisible, setModalVisible] = useState(false);

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const getMessage = () => {
    if (userData.id === 1) {
      return "Voici l'homme de la maison";
    } else if (userData.id === 2) {
      return "Voici la femme de la maison";
    }
    return "";
  };

  return (
    <View style={styles.container}>
      {userData ? (
        <>
          <Text style={styles.text}>Sexe: {userData.sexe}</Text>
          <Text style={styles.text}>Nom: {userData.nom}</Text>
          <Button title="Afficher le message" onPress={handleOpenModal} />
        </>
      ) : (
        <Text style={styles.noDataText}>Aucun utilisateur sélectionné.</Text>
      )}

      <CustomModal 
        visible={modalVisible} 
        onClose={handleCloseModal} 
        message={getMessage()} // Passer le message basé sur l'ID
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 20,
  },
  text: {
    fontSize: 18,
    marginVertical: 5,
  },
  noDataText: {
    fontSize: 16,
    color: 'gray',
  },
});

export default ComponentC;