import React, { useState, useEffect } from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@reachout_language';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState(i18n.language);

  useEffect(() => {
    // Update local state when i18n language changes
    setCurrentLang(i18n.language);
  }, [i18n.language]);

  const toggleLanguage = async () => {
    const newLang = currentLang === 'en' ? 'zh-HK' : 'en';
    try {
      await i18n.changeLanguage(newLang);
      await AsyncStorage.setItem(STORAGE_KEY, newLang);
      setCurrentLang(newLang);
    } catch (error) {
      console.log('Error switching language:', error);
    }
  };

  return (
    <Pressable style={styles.languageToggle} onPress={toggleLanguage}>
      <Text style={styles.languageText}>
        {currentLang === 'en' ? '中' : 'EN'}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  languageToggle: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#F7941F',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 40,
    shadowColor: '#F7941F',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  languageText: {
    fontSize: 14,
    fontFamily: 'BalsamiqSans_700Bold',
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default LanguageSwitcher;