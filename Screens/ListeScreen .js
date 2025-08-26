import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const data = [
  { id: '1', nom: 'Alice', poste: 'Développeuse', sexe: 'Femme' },
  { id: '2', nom: 'Bob', poste: 'Designer', sexe: 'Homme' },
  { id: '3', nom: 'Clara', poste: 'Chef de projet', sexe: 'Femme' },
  { id: '4', nom: 'David', poste: 'Analyste', sexe: 'Homme' },
];

const ListeScreen = () => {
  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>Nom: {item.nom}</Text>
      <Text style={styles.itemText}>Poste: {item.poste}</Text>
      <Text style={styles.itemText}>Sexe: {item.sexe}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  itemContainer: {
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: '#f9c2ff',
    borderRadius: 5,
  },
  itemText: {
    fontSize: 16,
  },
});

export default ListeScreen;