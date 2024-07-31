import React from 'react';
import { StyleSheet, View } from 'react-native';
import AppMapView from '../../components/AppMapView';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <AppMapView />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
