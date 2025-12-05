import { StyleSheet, View, Text } from 'react-native';
import LottieView from 'lottie-react-native';
import { type AnimationType } from '@/src/utils/weatherCodeMapper';

interface LottieLoaderProps {
  message?: string;
  size?: number;
  source?: AnimationType
}

export const LottieLoader: React.FC<LottieLoaderProps> = ({ 
  message = 'Загрузка...', 
  size = 150,
  source = '@/src/assets/animation/Weather-mist.json'
}) => {
  return (
    <View style={styles.container}>
      <LottieView
        source={source}
        autoPlay
        loop
        style={{ width: size, height: size }}
      />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    marginTop: 16,
    fontSize: 14,
    color: '#9ca3af',
  },
});
