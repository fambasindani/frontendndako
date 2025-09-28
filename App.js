//import { SafeAreaView } from "react-native";

import { SafeAreaView } from "react-native";
import { AuthProvider } from "./context/AuthContext";
import Naviger from "./navigation/Navigation";
import { ApiProviderDetails } from "./context/ApiProviderDetails";










// Correct
export default function App() {
  return (
    <AuthProvider>
      <ApiProviderDetails>
        <SafeAreaView style={{ flex: 1 }}>
          <Naviger />
        </SafeAreaView>
      </ApiProviderDetails>
    </AuthProvider>





    /*   <Routages/>  <FilterScreen/>    <AgenceScreen/> 

    <RegisterScreen/>*/













  );
}
