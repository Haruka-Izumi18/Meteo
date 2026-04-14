import * as Device from 'expo-device';
import {  StyleSheet, Text, View, ActivityIndicator  } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
    <View style={styles.container}>
          <Text style={styles.title}>
           Météo à Paris
          </Text>
          {loading ? (
        <ActivityIndicator />
      ) : (
        <>
        <Text style={styles.meteo}>{weather}</Text>
        <Text style={styles.meteo}>{temp}°C</Text>
        </>
      )}
        </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  title: {
    textAlign: 'center',
    fontSize: 40,
    fontWeight: 'bold'
  },
  meteo: {
    textAlign: 'center',
    fontSize: 30,
  },
});
