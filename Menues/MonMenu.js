// MonMenu.js
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { StatusBar } from 'expo-status-bar';

export default function MonMenu(props) {
  const menuItems = [
    { label: 'Accueil', icon: 'home', screen: 'Accueil' },
    { label: 'Ajouter une propriété', icon: 'building', screen: 'Ajouter une propriété' },
    { label: 'Propriétés', icon: 'building', screen: 'Propriétés' },
    { label: 'Agents', icon: 'users', screen: 'Agents' },
    { label: 'Agences Immo', icon: 'cubes', screen: 'Agences Immo' },
    { label: 'Connexion', icon: 'cubes', screen: 'Connexion' },
  ];

  return (
    <>
    <StatusBar backgroundColor="rgba(0,0,0,0.5)" barStyle="light-content" />
    <DrawerContentScrollView {...props} contentContainerStyle={styles.container}>
      {/* Logo + Titre */}
      <View style={styles.logoContainer}>
        <Image source={require('../assets/KCI WHITE.png')} style={styles.logo} />
        <Text style={styles.title}>CONCEPT IMMOBILIER</Text>
      </View>

      <View style={styles.separator} />

      {/* Menu items */}
      {menuItems.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.menuItem}
          activeOpacity={0.7}
          onPress={() => props.navigation.navigate(item.screen)}
        >
          <Icon name={item.icon} size={20} color="#FFD700" style={styles.icon} />
          <Text style={styles.label}>{item.label}</Text>
        </TouchableOpacity>
      ))}
    </DrawerContentScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A1F44',
    paddingTop: 0,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  title: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: 'bold',
  },
  separator: {
    height: 1,
    backgroundColor: '#FFD700',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  icon: {
    marginRight: 15,
  },
  label: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});
