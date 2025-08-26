//import { SafeAreaView } from "react-native";

import { SafeAreaView } from "react-native";


import Naviger from "./Composant/Navigation";


import Routages from "./Context/Routages";
import FilterScreen from "./Screens/FilterScreen";
import AgenceScreen from "./Screens/AgenceScreen";
import LoginScreen from "./Login/LoginScreen";
import InscriptionScreen from "./Login/InscriptionScreen";
import ListScreen from "./Login/ListScreen";
import MapsScreen from "./Login/MapsScreen";
import ModalRechercheAgence from "./Login/ModalRechercheAgence";
import RechercheAgenceScreen from "./Login/RechercheAgenceScreen";
import ListeScreen from "./Screens/ListeScreen ";
import DetailScreen from "./Screens/DetailScreen";
import AccueilScreen from "./Screens/AcceuilScreen";
import Accueil from "./Menues/Accueil";
import MonMenu from "./Menues/MonMenu";
import AppScreen from "./Screens/AppScreen";
import PropertyList from "./Composant/PropertiesList";
import TypeImmobilier from "./Composant/TypeImmobilier";
import PropertyCards from "./Composant/PropertyCards";
import RegisterScreen from "./Login/RegisterScreen";






// Correct
export default function App() {
  return (
 
     <SafeAreaView style={{ flex: 1}}>
         
         <Naviger/>
       
      </SafeAreaView> 
      
     /*   <Routages/>  <FilterScreen/>    <AgenceScreen/> 

     <RegisterScreen/>*/


         
    
       
     


   




  );
}
