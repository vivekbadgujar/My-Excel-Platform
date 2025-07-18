import { Capacitor } from '@capacitor/core';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar } from '@capacitor/status-bar';
import { Network } from '@capacitor/network';
import { Share } from '@capacitor/share';
import { Filesystem, Directory } from '@capacitor/filesystem';

export const isNative = Capacitor.isNativePlatform();

export const initializeApp = async () => {
  if (isNative) {
    // Hide splash screen
    await SplashScreen.hide();
    
    // Set status bar
    await StatusBar.setStyle({ style: 'light' });
    await StatusBar.setBackgroundColor({ color: '#2563eb' });
    
    // Check network status
    const status = await Network.getStatus();
    console.log('Network status:', status);
    
    // Listen for network changes
    Network.addListener('networkStatusChange', (status) => {
      console.log('Network status changed:', status);
    });
  }
};

export const shareContent = async (title: string, text: string, url?: string) => {
  if (isNative) {
    try {
      await Share.share({
        title,
        text,
        url,
        dialogTitle: 'Share Excel Data'
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  } else {
    // Web fallback
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback to clipboard
      await navigator.clipboard.writeText(text);
      alert('Content copied to clipboard!');
    }
  }
};

export const saveFileToDevice = async (filename: string, data: string) => {
  if (isNative) {
    try {
      const result = await Filesystem.writeFile({
        path: filename,
        data,
        directory: Directory.Documents,
        encoding: 'utf8'
      });
      console.log('File saved:', result);
      return result;
    } catch (error) {
      console.error('Error saving file:', error);
      throw error;
    }
  } else {
    // Web fallback - download file
    const blob = new Blob([data], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
};

export const checkNetworkStatus = async () => {
  if (isNative) {
    const status = await Network.getStatus();
    return status.connected;
  }
  return navigator.onLine;
};
