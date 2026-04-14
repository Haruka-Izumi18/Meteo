import * as Device from 'expo-device';
import {  StyleSheet, Text, View, ActivityIndicator  } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { fetchWeatherApi } from "openmeteo";
import { useEffect, useState } from 'react';
import * as Location from 'expo-location';

export default function HomeScreen() {
  const [temp, setTemp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [weather, setWeather] = useState('');

  useEffect(() => {
    fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=48.85&longitude=2.35&current_weather=true"
    )
      .then(res => res.json())
      .then(data => {
        setTemp(data.current_weather.temperature);
        const code = data.current_weather.weathercode;
        if (code === 0) setWeather("Ensoleillé");
        else if(code <= 3) setWeather("Nuageux");
        else if(code <= 48) setWeather("brouillard");
        else if(code <= 67) setWeather("Pluie");
        else if(code <= 77) setWeather("Neige");
        else setWeather("Orage");

        setLoading(false);
      });
  }, []);

  return (
    <ThemedView style={styles.container}>
      
        <ThemedView style={styles.heroSection}>
          <ThemedText type="title" style={styles.title}>
           Météo à Paris
          </ThemedText>
          {loading ? (
        <ActivityIndicator />
      ) : (
        <>
        <Text style={{ fontSize: 40 }}>{temp}°C</Text>
        <Text style={{ fontSize: 40 }}>{weather}</Text>
        </>
      )}
        </ThemedView>

    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    alignItems: 'center',
    gap: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.three,
    maxWidth: MaxContentWidth,
  },
  heroSection: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingHorizontal: Spacing.four,
    gap: Spacing.four,
  },
  title: {
    textAlign: 'center',
  },
  code: {
    textTransform: 'uppercase',
  },
  stepContainer: {
    gap: Spacing.three,
    alignSelf: 'stretch',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.four,
    borderRadius: Spacing.four,
  },
});
