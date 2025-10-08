import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { StatusBar } from 'expo-status-bar';

// Importez vos écrans
import MonMenu from '../Menues/MonMenu';
import AccueilScreen from '../MesScreens/AcceuilScreen';
import Agents from '../Menues/Agents';
import AgencesImmo from '../Menues/AgencesImmo';
import LoginScreen from '../MesScreens/LoginScreen';
import InscriptionScreen from '../MesScreens/InscriptionScreen';
import RegisterScreen from '../MesScreens/RegisterScreen';
import DetailScreen from '../MesScreens/DetailScreen';
import ListScreen from '../MesScreens/ListScreen';
import ListScreentout from '../MesScreens/ListScreentout';
import FilterScreen from '../MesScreens/FilterScreen';
import AppartementCard from '../MesScreens/MapsScreen';
import ListeScreenpvc from '../MesScreens/ListeScreenpvc';
import ListeFiltreScreen from '../MesScreens/ListeFiltreScreen';



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
      <Drawer.Screen name="Propriétés" component={createMenuStack(ListScreen, 'Propriétés')} />
      <Drawer.Screen name="Agents" component={createMenuStack(Agents, 'Agents')} />
      <Drawer.Screen name="Agences Immo" component={createMenuStack(AgencesImmo, 'Sécurité')} />
      <Drawer.Screen name="Connexion" component={createMenuStack(LoginScreen, 'Connexion')} />
      <Drawer.Screen name="Register" component={createMenuStack(RegisterScreen, 'Inscription')} />
      <Drawer.Screen name="Parametre" component={createMenuStack(ListeScreenpvc, 'Confuguration')} /> 


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

        <MainStack.Screen
          name="ListScreentout"
          component={ListScreentout}
          options={{
            headerShown: true, // ✅ header visible
            title: 'Liste Propriétés',
            headerStyle: { backgroundColor: '#0A1F44' },
            headerTintColor: '#FFD700',
            headerTitleAlign: 'center',
          }}
        />

        <MainStack.Screen
          name="FilterScreen"
          component={FilterScreen}
          options={{
            headerShown: true, // ✅ header visible
            title: 'Recherche Propriétés',
            headerStyle: { backgroundColor: '#0A1F44' },
            headerTintColor: '#FFD700',
            headerTitleAlign: 'center',
          }}
        />


        <MainStack.Screen
          name="AppartementCard"
          component={AppartementCard}
          options={{
            headerShown: true, // ✅ header visible
            title: 'Localisation',
            headerStyle: { backgroundColor: '#0A1F44' },
            headerTintColor: '#FFD700',
            headerTitleAlign: 'center',
          }}
        />

         <MainStack.Screen
          name="ListeFiltreScreen"
          component={ListeFiltreScreen}
          options={{
            headerShown: true, // ✅ header visible
            title: 'Resultat trouvé',
            headerStyle: { backgroundColor: '#0A1F44' },
            headerTintColor: '#FFD700',
            headerTitleAlign: 'center',
          }}
        />




      </MainStack.Navigator>
    </NavigationContainer>
  );
}

