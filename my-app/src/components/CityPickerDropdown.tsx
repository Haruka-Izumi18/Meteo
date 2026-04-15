import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { useRouter } from 'expo-router';

const data = [
  { label: 'Paris', value: 'Paris' },
  { label: 'Marseille', value: 'Marseille' },
  { label: 'Lille', value: 'Lille' },
];

export const CityPickerDropdown = () => {
  const [value, setValue] = useState<string | null>(null);
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Dropdown
        style={styles.dropdown}
        data={data}
        labelField="label"
        valueField="value"
        placeholder="Choisir..."
        value={value}
        onChange={item => {
          setValue(item.value);
          router.push(`/city/${item.value}`);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    right: 15,
    zIndex: 1000,
    width: 140,
  },
  dropdown: {
    height: 40,
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 12,
    elevation: 5,
  },
});