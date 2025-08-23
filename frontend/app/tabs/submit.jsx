import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function SubmitScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Submit Page</Text>
      {/* Add your submit form or content here */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 22,
    fontWeight: 'bold',
  },
});