import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Platform,
  StatusBar,
  Image,
  TextInput,
} from "react-native";
import { FlatList } from "react-native";

const recipesData = [
  {
    id: 1,
    chefName: "John Doe",
    recipeName: "Rice",
    imageUrl: "https://example.com/spaghetti.jpg",
  },
  {
    id: 2,
    chefName: "Peter Doe",
    recipeName: "Curry",
    imageUrl: "https://example.com/spaghetti.jpg",
  },
  {
    id: 3,
    chefName: "David Doe",
    recipeName: "Ramen",
    imageUrl: "https://example.com/spaghetti.jpg",
  },
  // Add more recipe objects as needed
];

const RecipeItem = ({ chefName, recipeName, imageUrl }) => (
  <View style={styles.item}>
    <Image source={{ uri: imageUrl }} style={styles.image} />
    <Text style={styles.recipeName}>{recipeName}</Text>
    <Text style={styles.chefName}>Chef: {chefName}</Text>
  </View>
);

const RecipesScreen = ({ navigation }) => {
  const [searchText, setSearchText] = useState("");

  // Filter the recipes based on the search text
  const filteredRecipes = recipesData.filter((recipe) =>
    recipe.recipeName.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search recipes..."
        autoCapitalize="sentences"
        value={searchText}
        onChangeText={(text) => setSearchText(text)}
      />

      <FlatList
        data={filteredRecipes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <RecipeItem
            chefName={item.chefName}
            recipeName={item.recipeName}
            imageUrl={item.imageUrl}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  searchInput: {
    padding: 16,
    fontSize: 18,
    borderBottomWidth: 1,
    borderColor: "gray",
    marginBottom: 16,
  },
  item: {
    // Your item styles here
  },
  image: {
    // Your image styles here
  },
  recipeName: {
    // Your recipe name styles here
  },
  chefName: {
    // Your chef name styles here
  },
});

export default RecipesScreen;
