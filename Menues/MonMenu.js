import React, { useContext } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { StatusBar } from 'expo-status-bar';
import { AuthContext } from '../context/AuthContext';
import { CommonActions } from '@react-navigation/native';

export default function MonMenu(props) {
  const { isConnected, logout } = useContext(AuthContext);


  const handleRefresh = (screenName) => {
    props.navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: screenName }],
      })
    );
  };

  // Fonction pour gérer la déconnexion
  const handleLogout = async () => {
    Alert.alert(
      "Déconnexion",
      "Voulez-vous vraiment vous déconnecter ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Oui",
          onPress: async () => {
            await logout();
            props.navigation.navigate("Accueil"); // Redirection après logout
          },
        },
      ],
      { cancelable: true }
    );
  };

  // Définition dynamique des items du menu
  const menuItems = [


    // { label: 'Accueil', icon: 'home', screen: 'Accueil' },


    {
      label: 'Accueil',
      icon: 'home',
      action: () => {
        props.navigation.navigate('Accueil', { refresh: Date.now() });
      },
    },


      

    {
      label: 'Ajouter une propriété',
      icon: 'building',
      action: () => {
        if (!isConnected) {
          props.navigation.navigate('Connexion'); // non connecté → Login
        } else {
          // props.navigation.navigate('Ajouter une propriété'); // connecté → Ajouter une propriété

          props.navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'Ajouter une propriété' }],
            })
          );

        }
      },
    },


      {
      label: 'Propriétés',
      icon: 'building',
      action: () => {
        if (!isConnected) {
          props.navigation.navigate('Connexion');
        } else {
          props.navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'Propriétés' }],
            })
          );

        }
      },
    },


     {
      label: 'Parametre',
      icon: 'info-circle',
      action: () => {
        props.navigation.navigate('Parametre');
      },
    },
 

   


  

    

   // { label: 'Agents', icon: 'users', screen: 'Agents' },
    { label: 'Sécurité', icon: 'cubes', screen: 'Agences Immo' },
   // { label: 'Liste', icon: 'cubes', screen: 'ListScreen' },

    // Connexion seulement si non connecté
    //  ...(!isConnected ? [{ label: 'Connexion', icon: 'user', screen: 'Connexion' }] : []),

    // Connexion seulement si non connecté


    ...(!isConnected
      ? [
        {
          label: 'Connexion',
          icon: 'user',
          action: () => {
            // navigation vers LoginScreen et réinitialisation complète
            props.navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: 'Connexion' }],
              })
            );
          },
        },
      ]
      : []
    ),






    // Déconnexion seulement si connecté
    ...(isConnected ? [{ label: 'Déconnecter', icon: 'sign-out-alt', action: handleLogout }] : []),
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

        {/* Items du menu */}
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={() => {
              if (item.action) {
                item.action(); // action personnalisée (connexion conditionnelle ou logout)
              } else if (item.screen) {
                props.navigation.navigate(item.screen); // navigation classique
              }
            }}
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
  container: { flex: 1, backgroundColor: '#0A1F44', paddingTop: 0 },
  logoContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 30 },
  logo: { width: 100, height: 100, resizeMode: 'contain', marginBottom: 10 },
  title: { color: '#FFD700', fontSize: 18, fontWeight: 'bold' },
  separator: { height: 1, backgroundColor: '#FFD700', marginHorizontal: 20, marginBottom: 20 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, paddingHorizontal: 20 },
  icon: { marginRight: 15 },
  label: { color: '#fff', fontSize: 16, fontWeight: '500' },
});
