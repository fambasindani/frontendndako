import { View, Text, StyleSheet } from "react-native"
import Listflast from "../Composant/Listflast.js"
import { Couleurs } from "../Composant/Couleurs.js"

const SearchResultsScreen = ({ searchResults = [] }) => {
  const handlePropertyPress = (property) => {
    console.log("Voir résultat:", property.title)
  }

  const handleContactAgent = (property) => {
    console.log("Contacter agent pour:", property.title)
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Résultats de recherche</Text>
      <Text style={styles.subHeader}>{searchResults.length} propriétés trouvées</Text>
      <Listflast
        properties={searchResults}
        onPropertyPress={handlePropertyPress}
        onEditPress={handleContactAgent}
        itemsPerPage={8}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Couleurs.background,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: Couleurs.textPrimary,
    padding: 16,
    paddingBottom: 8,
  },
  subHeader: {
    fontSize: 16,
    color: Couleurs.textSecondary,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
})

export default SearchResultsScreen
