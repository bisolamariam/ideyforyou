import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const HomeScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('free'); // 'free' or 'paid'
  
  const renderHousingCard = (name, spaces, images, hasCost = false) => {
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View>
            {hasCost && <Text style={styles.costIndicator}>$</Text>}
            <Text style={styles.cardTitle}>{name}</Text>
            <Text style={styles.cardSubtitle}>
              {spaces} Spaces. Managed by co-op. 1-2 weeks
            </Text>
          </View>
          <TouchableOpacity style={styles.favoriteButton}>
            <Icon name="shield-check" size={24} color="#000" />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity style={styles.messageButton}>
          <Icon name="message-outline" size={20} color="#666" />
          <Text style={styles.messageText}>Message contact</Text>
        </TouchableOpacity>
        
        <View style={styles.imageContainer}>
          {images.map((image, index) => (
            <Image 
              key={index}
              source={{ uri: image }}
              style={styles.propertyImage}
            />
          ))}
        </View>
        
        <TouchableOpacity style={styles.feedbackButton}>
          <Icon name="message-alert-outline" size={20} color="#000" />
          <Text style={styles.feedbackText}>
            See feedback from Rafiki peers/mentors on the area, the property, and contact person
          </Text>
        </TouchableOpacity>
      </View>
    );
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton}>
          <Icon name="menu" size={24} color="#000" />
        </TouchableOpacity>
        
        <View style={styles.locationContainer}>
          <Text style={styles.locationLabel}>JS</Text>
          <Text style={styles.location}>Chicago, IL</Text>
          <Icon name="chevron-down" size={20} color="#000" />
        </View>
        
        <TouchableOpacity style={styles.alertButton}>
          <Icon name="bell-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.searchContainer}>
        <Icon name="magnify" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search survivor-friendly neighborhood"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity style={styles.voiceButton}>
          <Icon name="microphone" size={20} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <Icon name="tune-variant" size={20} color="#666" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'free' && styles.activeTab]}
          onPress={() => setActiveTab('free')}
        >
          <Icon name="home-outline" size={20} color={activeTab === 'free' ? '#FFD700' : '#666'} />
          <Text style={[styles.tabText, activeTab === 'free' && styles.activeTabText]}>
            Free Spaces
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'paid' && styles.activeTab]}
          onPress={() => setActiveTab('paid')}
        >
          <Icon name="home-city-outline" size={20} color={activeTab === 'paid' ? '#FFD700' : '#666'} />
          <Text style={[styles.tabText, activeTab === 'paid' && styles.activeTabText]}>
            Paid Spaces
          </Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content}>
        {activeTab === 'free' ? (
          <>
            {renderHousingCard('Hyde Park', 15, [
              'https://placeholder.com/400x300',
              'https://placeholder.com/400x300'
            ])}
            {renderHousingCard('Kenwood', 15, [
              'https://placeholder.com/400x300',
              'https://placeholder.com/400x300'
            ])}
          </>
        ) : (
          <>
            {renderHousingCard('Hyde Park', 15, [
              'https://placeholder.com/400x300',
              'https://placeholder.com/400x300'
            ], true)}
            {renderHousingCard('Kenwood', 15, [
              'https://placeholder.com/400x300',
              'https://placeholder.com/400x300'
            ], true)}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  menuButton: {
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationLabel: {
    backgroundColor: '#FFD700',
    color: '#000',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
    fontWeight: 'bold',
  },
  location: {
    fontSize: 16,
    fontWeight: '500',
  },
  alertButton: {
    padding: 8,
    backgroundColor: '#000',
    borderRadius: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    margin: 16,
    borderRadius: 25,
    paddingHorizontal: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  voiceButton: {
    padding: 8,
  },
  filterButton: {
    padding: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#FFD700',
  },
  tabText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#000',
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    margin: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  costIndicator: {
    backgroundColor: '#FFD700',
    color: '#000',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 16,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  favoriteButton: {
    padding: 8,
  },
  messageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  messageText: {
    marginLeft: 8,
    color: '#666',
  },
  imageContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  propertyImage: {
    width: '48%',
    height: 150,
    borderRadius: 8,
    marginRight: '4%',
  },
  feedbackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFD700',
    padding: 12,
    borderRadius: 8,
  },
  feedbackText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: '#000',
  },
});

export default HomeScreen;