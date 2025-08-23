import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: '10%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  text: {
    fontSize: 24,
    fontFamily: 'BalsamiqSans_400Regular', 
    color: '#333',
  },
});

export default function RankScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Rank Page</Text>
    </View>
  );
}