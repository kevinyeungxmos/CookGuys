import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Tags from "react-native-tags";
import AntDesign from "react-native-vector-icons/AntDesign";

const TagInput = ({ icon, initialTags, onChangeTags, style }) => {
  const [tags, setTags] = useState(initialTags);
  useEffect(() => {
    setTags(initialTags);
  }, [initialTags]);

  return (
    <View style={styles.componentContainer}>
      {icon}
      <Tags
        initialText=""
        textInputProps={{
          placeholder: "Enter Comma-separated Tags",
          blurOnSubmit: false,
        }}
        initialTags={tags}
        onChangeTags={onChangeTags}
        createTagOnString={[","]}
        createTagOnReturn
        renderTag={({ tag, index, onPress, deleteTagOnPress, readonly }) => (
          <TouchableOpacity key={`${tag}-${index}`} onPress={onPress}>
            <View style={styles.selectedStyle}>
              <Text style={styles.textSelectedStyle}>{`#${tag}`}</Text>
              <AntDesign color="black" name="close" size={17} />
            </View>
          </TouchableOpacity>
        )}
        containerStyle={styles.container}
        inputContainerStyle={styles.textInputContainer}
        inputStyle={styles.textInput}
      />
    </View>
  );
};

export default TagInput;

const styles = StyleSheet.create({
  componentContainer: {
    width: "100%",
    backgroundColor: "#efefef",
    flexDirection: "row",
    borderRadius: 5,
    paddingHorizontal: 10,
    margin: 10,
    paddingVertical: 10,
  },
  container: {
    flex: 1,
  },
  textInputContainer: {
    fontWeight: "bold",
  },
  textInput: { backgroundColor: "#efefef", fontSize: 16 },
  selectedStyle: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 14,
    backgroundColor: "white",
    marginTop: 5,
    marginRight: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    elevation: 2,
  },
  textSelectedStyle: {
    marginRight: 5,
    fontSize: 16,
  },
});
