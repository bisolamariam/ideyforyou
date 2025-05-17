import { Platform } from 'react-native';
import Toast from 'react-native-toast-message';

export const showAlert = (title: string, message?: string) => {
  Toast.show({
    type: 'info',
    text1: title,
    text2: message,
    position: 'top',
    visibilityTime: 4000,
    autoHide: true,
  });
};
