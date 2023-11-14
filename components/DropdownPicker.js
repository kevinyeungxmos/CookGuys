import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { MultiSelect } from "react-native-element-dropdown";
import AntDesign from "react-native-vector-icons/AntDesign";

const MenuItemPicker = ({ ...props }) => {
  const renderDataItem = (item) => {
    return (
      <View style={styles.item}>
        <Text>{item.label}</Text>
        {/* <AntDesign style={styles.icon} color="black" name="Safety" size={20} /> */}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <MultiSelect
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        inputSearchStyle={styles.inputSearchStyle}
        labelField="label"
        valueField="value"
        search
        searchPlaceholder="Search..."
        renderItem={renderDataItem}
        renderSelectedItem={(item, unSelect) => (
          <TouchableOpacity onPress={() => unSelect && unSelect(item)}>
            <View style={styles.selectedStyle}>
              <Text style={styles.textSelectedStyle}>{item.label}</Text>
              <AntDesign color="black" name="close" size={17} />
            </View>
          </TouchableOpacity>
        )}
        {...props}
      />
    </View>
  );
};

export default MenuItemPicker;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#efefef",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingBottom: 10,
    marginVertical: 10,
  },
  dropdown: {
    flex: 1,
    minWidth: 20,
    paddingTop: 10,
    paddingBottom: 5,
    borderRadius: 12,
  },
  inputSearchStyle: {
    height: 40,
  },
  item: {
    padding: 17,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectedStyle: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 14,
    backgroundColor: "white",
    marginRight: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  textSelectedStyle: {
    marginRight: 5,
  },
});
