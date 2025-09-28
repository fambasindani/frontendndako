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
import Agents from '../Menues/Agents';
import AgencesImmo from '../Menues/AgencesImmo';
import PropertyList from '../MesScreens/ListePropertieScreen';
import LoginScreen from '../MesScreens/LoginScreen';
import InscriptionScreen from '../MesScreens/InscriptionScreen';
import RegisterScreen from '../MesScreens/RegisterScreen';
import DetailScreen from '../MesScreens/DetailScreen';



const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();
const MainStack = createStackNavigator(); // ✅ Stack principal

// Fonction pour créer un Stack avec header + hamburger
function createMenuStack(screen, title) {
  return function StackScreen({ navigation }) {
    return (
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#0A1F44' },
          headerTintColor: '#FFD700',
          headerTitleStyle: { fontWeight: 'bold' },
          headerTitleAlign: 'center',
          headerLeft: () => (
            <TouchableOpacity
              style={{ marginLeft: 15 }}
              onPress={() =>
                title === 'Inscription'
                  ? navigation.goBack()
                  : navigation.toggleDrawer()
              }
            >
              <Icon name={title === 'Inscription' ? 'arrow-left' : 'bars'} size={25} color="#FFD700" />
            </TouchableOpacity>
          ),
        }}
      >
        <Stack.Screen name={title} component={screen} />
      </Stack.Navigator>
    );
  };
}

// ✅ Drawer encapsulé
function MainDrawer() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <MonMenu {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Drawer.Screen name="Accueil" component={createMenuStack(AccueilScreen, 'Accueil')} />
      <Drawer.Screen name="Ajouter une propriété" component={createMenuStack(InscriptionScreen, 'Ajouter une propriété')} />
      <Drawer.Screen name="Propriétés" component={createMenuStack(PropertyList , 'Propriétés')} />
      <Drawer.Screen name="Agents" component={createMenuStack(Agents, 'Agents')} />
      <Drawer.Screen name="Agences Immo" component={createMenuStack(AgencesImmo, 'Agences Immo')} />
      <Drawer.Screen name="Connexion" component={createMenuStack(LoginScreen, 'Connexion')} />
      <Drawer.Screen name="Register" component={createMenuStack(RegisterScreen, 'Inscription')} />
    </Drawer.Navigator>
  );
}
export default function Naviger() {
  return (
    <NavigationContainer>
      <MainStack.Navigator>
        <MainStack.Screen
          name="MainDrawer"
          component={MainDrawer}
          options={{ headerShown: false }} // ❌ pas de header pour le menu
        />
        <MainStack.Screen
          name="Details"
          component={DetailScreen}
          options={{
            headerShown: true, // ✅ header visible
            title: 'Détails de la propriété',
            headerStyle: { backgroundColor: '#0A1F44' },
            headerTintColor: '#FFD700',
            headerTitleAlign: 'center',
          }}
        />
      </MainStack.Navigator>
    </NavigationContainer>
  );
}

