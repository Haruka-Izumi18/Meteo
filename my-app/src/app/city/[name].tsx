import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Link } from "expo-router";


export default function CityWeather () {
    const { name } = useLocalSearchParams();

    const [loading, setLoading] = useState(true);
    const [temp, setTemp] = useState(null);
    const [weather,setWeather] = useState("");
    const [weatherColor, setWeatherColor] = useState("#000");
    const [weatherIcon, setWeatherIcon] = useState<any>("");

useEffect(() => {
    const fetchWeather = async () => {
    const coords: any = {
    Paris: { latitude: 48.85, longitude: 2.35 },
    Marseille: { latitude: 43.302574, longitude: 5.369074 },
    Lille: { latitude: 50.624378, longitude: 3.067859}
  };

  const { latitude, longitude } = coords[name as string];
  const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`,
        );
        const data = await res.json();
        setTemp(data.current_weather.temperature);
        const code = data.current_weather.weathercode;

        if (code === 0) {setWeather("Ensoleillé");
          setWeatherColor("#F54927");
          setWeatherIcon("weather-sunny");
        } else if (code <= 3) {setWeather("Nuageux");
          setWeatherColor("#B3C3D5");
          setWeatherIcon("weather-cloudy");
        } else if (code <= 48) {setWeather("brouillard");
          setWeatherColor("#CAD6D9");
          setWeatherIcon("weather-fog");
        } else if (code <= 67) {setWeather("Pluie");
          setWeatherColor("#1189D9");
          setWeatherIcon("weather-pouring");
        } else if (code <= 77) {setWeather("Neige");
          setWeatherColor("#27D7F2");
          setWeatherIcon("weather-snowy-heavy");
         } else {setWeather("Orage");
          setWeatherColor("#F2EF27");
          setWeatherIcon("weather-lightning");
      } 
      setLoading(false);
    };
    fetchWeather()
}, [name]
);

    return(
        <View style={styles.container}>
           <Text style={styles.title}>Météo à {name || "..."}</Text>
      {loading ? (
        <ActivityIndicator />
      ) : (
        <View style={styles.info}>
        <MaterialCommunityIcons
        name={weatherIcon}
        size={50}
        color="black"
        />
          <Text style={[styles.meteo, { color: weatherColor }]}>{weather}</Text>
          <Text style={styles.meteo}>{temp}°C</Text>
        </View>
      )}

      <Link href="/" style={styles.link}>Routeur</Link>
        </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FEFCE8"
  },

  title: {
    textAlign: "center",
    fontSize: 40,
    fontWeight: "bold",
  },
  meteo: {
    textAlign: "center",
    fontSize: 30,
  },
  info: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 20
  },
  link:{
    color: 'blue', marginTop: 10
  }
});