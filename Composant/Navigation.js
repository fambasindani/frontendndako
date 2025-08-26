import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { StatusBar } from 'expo-status-bar';

// Importez vos écrans
import MonMenu from '../Menues/MonMenu';
import AccueilScreen from '../Screens/AcceuilScreen';
import AjouterPropriete from '../Menues/AjouterPropriete';
import Proprietes from '../Menues/Proprietes';
import Agents from '../Menues/Agents';
import AgencesImmo from '../Menues/AgencesImmo';
import LoginScreen from '../Login/LoginScreen';
import RegisterScreen from '../Login/RegisterScreen';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

// Fonction pour créer un Stack avec header + hamburger
function createMenuStack(screen, title) {
  return function StackScreen({ navigation, route }) {
    return (
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#0A1F44' },
          headerTintColor: '#FFD700',
          headerTitleStyle: { fontWeight: 'bold' },
          headerTitleAlign: 'center',
          headerLeft: () => {
            if (title === 'Inscription') {
              return (
                <TouchableOpacity
                  style={{ marginLeft: 15 }}
                  onPress={() => navigation.goBack()} // Retourne à l'écran précédent
                >
                  <Icon name="arrow-left" size={25} color="#FFD700" />
                </TouchableOpacity>
              );
            }
            return (
              <TouchableOpacity
                style={{ marginLeft: 15 }}
                onPress={() => navigation.toggleDrawer()} // Ouvre le menu
              >
                <Icon name="bars" size={25} color="#FFD700" />
              </TouchableOpacity>
            );
          },
        }}
      >
        <Stack.Screen name={title} component={screen} />
      </Stack.Navigator>
    );
  };
}

export default function Naviger() {
  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" />
      <View style={{ backgroundColor: "#0A1F44", height: 40 }} />
      <Drawer.Navigator
        drawerContent={(props) => <MonMenu {...props} />}
        screenOptions={{ headerShown: false }}
      >
        <Drawer.Screen name="Accueil" component={createMenuStack(AccueilScreen, 'Accueil')} />
        <Drawer.Screen name="Ajouter une propriété" component={createMenuStack(AjouterPropriete, 'Ajouter une propriété')} />
        <Drawer.Screen name="Propriétés" component={createMenuStack(Proprietes, 'Propriétés')} />
        <Drawer.Screen name="Agents" component={createMenuStack(Agents, 'Agents')} />
        <Drawer.Screen name="Agences Immo" component={createMenuStack(AgencesImmo, 'Agences Immo')} />
        <Drawer.Screen name="Connexion" component={createMenuStack(LoginScreen, 'Connexion')} />
        <Drawer.Screen name="Register" component={createMenuStack(RegisterScreen, 'Inscription')} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}