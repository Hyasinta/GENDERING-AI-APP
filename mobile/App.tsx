import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import React from 'react';
import { Text, View, Pressable, TextInput, ScrollView, Alert, StyleSheet, Dimensions, Image, Animated, Easing } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dayjs from 'dayjs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from './src/screens/HomeScreen';
import RegistrationScreen from './src/screens/RegistrationScreen';
import AgendaScheduleScreen from './src/screens/AgendaScheduleScreen';
import SpeakersScreen from './src/screens/SpeakersScreen';
import MapsScreen from './src/screens/MapsScreen';
import MessagesScreen from './src/screens/MessagesScreen';
import SponsorsPartnersScreen from './src/screens/SponsorsPartnersScreen';

const { width } = Dimensions.get('window');

type RootStackParamList = {
  Start: undefined;
  Dashboard: undefined;
  Registration: undefined;
  Tabs: undefined;
  AppDrawer: undefined;
};

type ScheduleItem = {
  id: string;
  title: string;
  datetime: string;
  duration: number;
  speaker: string;
  venue: string;
  timestamp: number;
  dateAdded: string;
  description?: string;
  type?: string;
};

type User = {
  name: string;
  email: string;
  organization: string;
  bio: string;
  registrationDate: string;
  participantId: string;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const STORAGE_KEYS = {
  user: 'conference-current-user',
  schedule: 'conference-schedule',
};

function usePersistentState<T>(key: string, initial: T) {
  const [value, setValue] = React.useState<T>(initial);
  React.useEffect(() => {
    AsyncStorage.getItem(key).then((v) => {
      if (v) setValue(JSON.parse(v));
    });
  }, [key]);
  React.useEffect(() => {
    AsyncStorage.setItem(key, JSON.stringify(value)).catch(() => {});
  }, [key, value]);
  return [value, setValue] as const;
}

// Dashboard/Home Screen with all features integrated
function StartScreen({ navigation }: { navigation: any }) {
  const fadeIn = React.useRef(new Animated.Value(0)).current;
  const slideUp = React.useRef(new Animated.Value(24)).current;
  const pulse = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeIn, { toValue: 1, duration: 700, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.timing(slideUp, { toValue: 0, duration: 700, easing: Easing.out(Easing.quad), useNativeDriver: true }),
    ]).start();

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.06, duration: 900, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1.0, duration: 900, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [fadeIn, slideUp, pulse]);

  return (
    <View style={startStyles.container}>
      <Animated.View style={[startStyles.card, { opacity: fadeIn, transform: [{ translateY: slideUp }] }]}> 
        <View style={startStyles.logoWrap}>
          <Image source={require('./assets/logo.png')} style={startStyles.logoImage} resizeMode="contain" />
        </View>
        <Text style={startStyles.title}>GENDERING AI CONFERENCE</Text>
        <Animated.View style={{ transform: [{ scale: pulse }], width: '100%' }}>
          <Pressable onPress={() => navigation.replace('AppDrawer')} style={startStyles.cta}>
            <Text style={startStyles.ctaText}>Continue</Text>
          </Pressable>
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const startStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#0c1230',
  },
  card: {
    backgroundColor: 'transparent',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  logoWrap: { alignItems: 'center', marginBottom: 16 },
  logoImage: { width: 240, height: 240 },
  title: { fontSize: 20, fontWeight: '800', color: '#ffffff', textAlign: 'center', marginTop: 12 },
  cta: { backgroundColor: '#1a237e', borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  ctaText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});

function DashboardScreen({ navigation }: { navigation: any }) {
  const [user] = usePersistentState<User | null>(STORAGE_KEYS.user, null);
  const [schedule] = usePersistentState<ScheduleItem[]>(STORAGE_KEYS.schedule, []);
  const [activeSection, setActiveSection] = React.useState('overview');

  const upcoming = [...schedule].sort((a, b) => a.timestamp - b.timestamp);
  const nextEvent = upcoming.find((s) => s.timestamp > Date.now());

  const sections = [
    { id: 'overview', title: 'Overview', icon: 'home' },
    { id: 'registration', title: 'Registration', icon: 'person-add' },
    { id: 'agenda', title: 'Agenda', icon: 'calendar' },
    { id: 'schedule', title: 'My Schedule', icon: 'time' },
    { id: 'profile', title: 'Profile', icon: 'person' },
  ];

  const renderOverview = () => (
    <ScrollView style={styles.sectionContent}>
      {/* Conference Header */}
      <View style={styles.conferenceHeader}>
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Ionicons name="people" size={50} color="#1a237e" />
          </View>
        </View>
        <Text style={styles.conferenceTitle}>GENDERING AI CONFERENCE</Text>
        <Text style={styles.subtitle}>Decolonizing AI: Reclaiming power in the intelligence age from feminist perspective</Text>
        <View style={styles.conferenceDetails}>
          <Text style={styles.hotelInfo}>📍 Mövenpick Hotel, Nairobi, Kenya</Text>
          <Text style={styles.dateInfo}>📅 August 20-22, 2025</Text>
        </View>
      </View>

      {/* User Status */}
      {user ? (
        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeTitle}>Welcome back, {user.name}! 👋</Text>
          <Text style={styles.welcomeSubtext}>You're all set for the conference</Text>
          <View style={styles.userStats}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{schedule.length}</Text>
              <Text style={styles.statLabel}>Sessions</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>3</Text>
              <Text style={styles.statLabel}>Days</Text>
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.registrationPrompt}>
          <Ionicons name="person-add-outline" size={40} color="#1a237e" />
          <Text style={styles.promptTitle}>Ready to join us?</Text>
          <Text style={styles.promptText}>Register now to access the full conference experience</Text>
          <Pressable 
            style={styles.promptButton}
            onPress={() => setActiveSection('registration')}
          >
            <Text style={styles.promptButtonText}>Register Now</Text>
          </Pressable>
        </View>
      )}

      {/* Next Event */}
      {nextEvent && (
        <View style={styles.nextEventCard}>
          <Text style={styles.cardTitle}>🎯 Next Event</Text>
          <Text style={styles.nextEventTitle}>{nextEvent.title}</Text>
          <Text style={styles.nextEventTime}>⏰ {nextEvent.datetime}</Text>
          <Text style={styles.nextEventSpeaker}>👤 {nextEvent.speaker}</Text>
          <Text style={styles.nextEventVenue}>📍 {nextEvent.venue}</Text>
        </View>
      )}

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionGrid}>
          <Pressable 
            style={[styles.actionCard, !user && styles.actionCardDisabled]}
            onPress={() => user ? setActiveSection('agenda') : Alert.alert('Please register first')}
          >
            <Ionicons name="calendar" size={30} color={user ? "#1a237e" : "#ccc"} />
            <Text style={[styles.actionCardText, !user && styles.actionCardTextDisabled]}>Browse Agenda</Text>
          </Pressable>
          <Pressable 
            style={[styles.actionCard, !user && styles.actionCardDisabled]}
            onPress={() => user ? setActiveSection('schedule') : Alert.alert('Please register first')}
          >
            <Ionicons name="time" size={30} color={user ? "#1a237e" : "#ccc"} />
            <Text style={[styles.actionCardText, !user && styles.actionCardTextDisabled]}>My Schedule</Text>
          </Pressable>
        </View>
      </View>

      {/* Conference Highlights */}
      <View style={styles.highlights}>
        <Text style={styles.sectionTitle}>Conference Highlights</Text>
        <View style={styles.highlightCard}>
          <Text style={styles.highlightTitle}>🎯 Day 1: Governance & Ethics</Text>
          <Text style={styles.highlightText}>Power, policy, and accountability in AI</Text>
        </View>
        <View style={styles.highlightCard}>
          <Text style={styles.highlightTitle}>🚀 Day 2: Technical Innovation</Text>
          <Text style={styles.highlightText}>Hands-on tools for social change</Text>
        </View>
        <View style={styles.highlightCard}>
          <Text style={styles.highlightTitle}>🌍 Day 3: Community Futures</Text>
          <Text style={styles.highlightText}>Rural communities and inclusive tech</Text>
        </View>
      </View>
    </ScrollView>
  );

  const renderRegistration = () => <RegistrationComponent navigation={navigation} />;
  
  const renderAgenda = () => <AgendaComponent />;
  
  const renderSchedule = () => <ScheduleComponent />;
  
  const renderProfile = () => <ProfileComponent user={user} />;

  const renderContent = () => {
    switch (activeSection) {
      case 'overview': return renderOverview();
      case 'registration': return renderRegistration();
      case 'agenda': return renderAgenda();
      case 'schedule': return renderSchedule();
      case 'profile': return renderProfile();
      default: return renderOverview();
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Navigation */}
      <View style={styles.topNav}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.navContent}
        >
          {sections.map((section) => (
            <Pressable
              key={section.id}
              style={[
                styles.navItem,
                activeSection === section.id && styles.navItemActive
              ]}
              onPress={() => setActiveSection(section.id)}
            >
              <Ionicons 
                name={section.icon as any} 
                size={20} 
                color={activeSection === section.id ? '#fff' : '#1a237e'} 
              />
              <Text style={[
                styles.navText,
                activeSection === section.id && styles.navTextActive
              ]}>
                {section.title}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Content */}
      {renderContent()}
    </View>
  );
}

// Registration Component
function RegistrationComponent({ navigation }: { navigation: any }) {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [org, setOrg] = React.useState('');
  const [bio, setBio] = React.useState('');
  const [, setUser] = usePersistentState<User | null>(STORAGE_KEYS.user, null);

  const submit = async () => {
    if (!name || !email || !org || !bio) {
      Alert.alert('Missing Information', 'Please fill out all fields to complete your registration.');
      return;
    }
    const userData: User = {
      name,
      email,
      organization: org,
      bio,
      registrationDate: new Date().toISOString(),
      participantId: 'GENAI_' + Date.now(),
    };
    setUser(userData);
    Alert.alert('Registration Successful! 🎉', 'Welcome to the Gendering AI Conference! You can now access all conference features.');
  };

  return (
    <ScrollView style={styles.sectionContent}>
      <View style={styles.screenHeader}>
        <Text style={styles.screenTitle}>Conference Registration</Text>
        <Text style={styles.screenSubtitle}>Join us for three days of transformative discussions</Text>
      </View>
      
      <View style={styles.formContainer}>
        <LabeledInput 
          label="Full Name *" 
          value={name} 
          onChangeText={setName} 
          placeholder="Enter your full name" 
        />
        <LabeledInput 
          label="Email Address *" 
          value={email} 
          onChangeText={setEmail} 
          keyboardType="email-address" 
          placeholder="your.email@example.com" 
        />
        <LabeledInput 
          label="Organization/Institution *" 
          value={org} 
          onChangeText={setOrg} 
          placeholder="Your organization or institution" 
        />
        <LabeledInput 
          label="Professional Bio *" 
          value={bio} 
          onChangeText={setBio} 
          multiline 
          placeholder="Tell us about your work in AI, gender studies, or related fields..." 
        />
        <Pressable style={styles.primaryButton} onPress={submit}>
          <Ionicons name="rocket" size={20} color="white" style={{ marginRight: 8 }} />
          <Text style={styles.primaryButtonText}>Complete Registration</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

// Agenda Component
function AgendaComponent() {
  const [schedule, setSchedule] = usePersistentState<ScheduleItem[]>(STORAGE_KEYS.schedule, []);
  const [user] = usePersistentState<User | null>(STORAGE_KEYS.user, null);
  const [selectedDay, setSelectedDay] = React.useState('day1');
  
  const agenda = getFullAgenda();

  const addToSchedule = (session: ScheduleItem) => {
    if (!user) {
      Alert.alert('Registration Required', 'Please complete your registration to add sessions to your schedule.');
      return;
    }
    if (schedule.find((x) => x.id === session.id)) {
      Alert.alert('Already Added', 'This session is already in your schedule.');
      return;
    }
    const newSession: ScheduleItem = {
      ...session,
      timestamp: dayjs(session.datetime).toDate().getTime(),
      dateAdded: new Date().toISOString(),
    };
    setSchedule([...schedule, newSession]);
    Alert.alert('Added Successfully! ✅', `"${session.title}" has been added to your personal schedule.`);
  };

  const getDayAgenda = (day: string) => {
    return agenda.filter(item => item.id.includes(day));
  };

  const getDayTheme = (day: string) => {
    const themes = {
      day1: { 
        title: 'Governance, Ethics & Justice', 
        description: 'Exploring power, policy, decoloniality, and accountability in AI systems',
        color: '#1a237e'
      },
      day2: { 
        title: 'Feminist AI for Social Change', 
        description: 'Hands-on tools, methodologies, and applications for gender-equitable impact',
        color: '#7b1fa2'
      },
      day3: { 
        title: 'Community & Wellbeing Futures', 
        description: 'Focus on rural communities, mental health, and inclusive technological futures',
        color: '#388e3c'
      }
    };
    return themes[day as keyof typeof themes] || themes.day1;
  };

  const theme = getDayTheme(selectedDay);
  const dayAgenda = getDayAgenda(selectedDay);

  return (
    <ScrollView style={styles.sectionContent}>
      <View style={styles.screenHeader}>
        <Text style={styles.screenTitle}>Conference Agenda</Text>
        <Text style={styles.screenSubtitle}>Explore sessions across three transformative days</Text>
      </View>

      {/* Day Selector */}
      <View style={styles.daySelector}>
        {['day1', 'day2', 'day3'].map((day, index) => (
          <Pressable 
            key={day}
            style={[
              styles.dayButton, 
              selectedDay === day && [styles.dayButtonActive, { backgroundColor: theme.color }]
            ]}
            onPress={() => setSelectedDay(day)}
          >
            <Text style={[
              styles.dayButtonText, 
              selectedDay === day && styles.dayButtonTextActive
            ]}>
              Day {index + 1}
          </Text>
            <Text style={[
              styles.dayButtonDate, 
              selectedDay === day && styles.dayButtonTextActive
            ]}>
              Aug {20 + index}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Day Theme */}
      <View style={[styles.themeBanner, { borderLeftColor: theme.color }]}>
        <Text style={[styles.themeTitle, { color: theme.color }]}>
          {theme.title}
        </Text>
        <Text style={styles.themeDescription}>{theme.description}</Text>
      </View>

      {/* Sessions */}
      <View style={styles.agendaContainer}>
        {dayAgenda.map((session) => (
          <View key={session.id} style={styles.agendaItem}>
            <View style={styles.agendaHeader}>
              <View style={styles.agendaTimeContainer}>
                <Text style={styles.agendaTime}>{session.datetime}</Text>
                <Text style={styles.agendaDuration}>{session.duration} min</Text>
              </View>
              <View style={[styles.sessionTypeBadge, { backgroundColor: theme.color }]}>
                <Text style={styles.sessionTypeText}>{session.type || 'Session'}</Text>
              </View>
            </View>
            <Text style={styles.agendaTitle}>{session.title}</Text>
            {session.description && (
              <Text style={styles.agendaDescription}>{session.description}</Text>
            )}
            <Text style={styles.agendaSpeaker}>👤 {session.speaker}</Text>
            <Text style={styles.agendaVenue}>📍 {session.venue}</Text>
            <Pressable 
              style={[styles.addButton, { backgroundColor: theme.color }]}
              onPress={() => addToSchedule(session)}
            >
              <Ionicons name="add-circle-outline" size={18} color="white" />
              <Text style={styles.addButtonText}>Add to My Schedule</Text>
            </Pressable>
        </View>
      ))}
      </View>
    </ScrollView>
  );
}

// Schedule Component
function ScheduleComponent() {
  const [schedule, setSchedule] = usePersistentState<ScheduleItem[]>(STORAGE_KEYS.schedule, []);
  const [user] = usePersistentState<User | null>(STORAGE_KEYS.user, null);

  const removeFromSchedule = (id: string) => {
    Alert.alert(
      'Remove Session',
      'Are you sure you want to remove this session from your schedule?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive',
          onPress: () => setSchedule(schedule.filter((s) => s.id !== id))
        }
      ]
    );
  };

  if (!user) {
    return (
      <View style={styles.sectionContent}>
        <View style={styles.emptyState}>
          <Ionicons name="person-add-outline" size={80} color="#ccc" />
          <Text style={styles.emptyStateTitle}>Registration Required</Text>
          <Text style={styles.emptyStateText}>
            Please complete your registration to create and manage your personal schedule
          </Text>
        </View>
      </View>
    );
  }

  const upcoming = [...schedule].sort((a, b) => a.timestamp - b.timestamp);
  const nextEvent = upcoming.find((s) => s.timestamp > Date.now());

  return (
    <ScrollView style={styles.sectionContent}>
      <View style={styles.screenHeader}>
        <Text style={styles.screenTitle}>My Personal Schedule</Text>
        <Text style={styles.screenSubtitle}>Your customized conference experience</Text>
      </View>

      {schedule.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="calendar-outline" size={80} color="#ccc" />
          <Text style={styles.emptyStateTitle}>No sessions scheduled yet</Text>
          <Text style={styles.emptyStateText}>
            Browse the agenda to add sessions that interest you most
        </Text>
      </View>
      ) : (
        <>
          {nextEvent && (
            <View style={styles.nextEventCard}>
              <Text style={styles.cardTitle}>🎯 Up Next</Text>
              <Text style={styles.nextEventTitle}>{nextEvent.title}</Text>
              <Text style={styles.nextEventTime}>⏰ {nextEvent.datetime}</Text>
              <Text style={styles.nextEventSpeaker}>👤 {nextEvent.speaker}</Text>
              <Text style={styles.nextEventVenue}>📍 {nextEvent.venue}</Text>
              <Text style={styles.timeRemaining}>
                ⏳ {formatTimeRemaining(nextEvent.timestamp - Date.now())}
          </Text>
            </View>
          )}

          <View style={styles.scheduleStats}>
            <Text style={styles.cardTitle}>📊 Your Schedule</Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{schedule.length}</Text>
                <Text style={styles.statLabel}>Total Sessions</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {schedule.reduce((sum, s) => sum + s.duration, 0)}
                </Text>
                <Text style={styles.statLabel}>Minutes</Text>
              </View>
            </View>
          </View>

          <View style={styles.scheduleContainer}>
            {upcoming.map((session) => (
              <View key={session.id} style={styles.scheduleItem}>
                <View style={styles.scheduleHeader}>
                  <View style={styles.scheduleTimeContainer}>
                    <Text style={styles.scheduleTime}>{session.datetime}</Text>
                    <Text style={styles.scheduleDuration}>{session.duration} min</Text>
                  </View>
                  <Pressable 
                    style={styles.removeButton}
                    onPress={() => removeFromSchedule(session.id)}
                  >
                    <Ionicons name="trash-outline" size={16} color="#fff" />
                  </Pressable>
                </View>
                <Text style={styles.scheduleTitle}>{session.title}</Text>
                <Text style={styles.scheduleSpeaker}>👤 {session.speaker}</Text>
                <Text style={styles.scheduleVenue}>📍 {session.venue}</Text>
        </View>
      ))}
          </View>
        </>
      )}
    </ScrollView>
  );
}

// Profile Component
function ProfileComponent({ user }: { user: User | null }) {
  const [schedule] = usePersistentState<ScheduleItem[]>(STORAGE_KEYS.schedule, []);

    if (!user) {
    return (
      <View style={styles.sectionContent}>
        <View style={styles.emptyState}>
          <Ionicons name="person-outline" size={80} color="#ccc" />
          <Text style={styles.emptyStateTitle}>No Profile Yet</Text>
          <Text style={styles.emptyStateText}>
            Complete your registration to create your conference profile
          </Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.sectionContent}>
      <View style={styles.profileHeader}>
        <View style={styles.profileAvatar}>
          <Text style={styles.profileInitials}>
            {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
          </Text>
        </View>
        <Text style={styles.profileName}>{user.name}</Text>
        <Text style={styles.profileOrg}>{user.organization}</Text>
        <Text style={styles.profileId}>ID: {user.participantId}</Text>
      </View>

      <View style={styles.profileStats}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{schedule.length}</Text>
          <Text style={styles.statLabel}>Sessions Planned</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {dayjs(user.registrationDate).format('MMM D')}
          </Text>
          <Text style={styles.statLabel}>Registered</Text>
        </View>
      </View>

      <View style={styles.profileSection}>
        <Text style={styles.sectionTitle}>Contact Information</Text>
        <View style={styles.infoItem}>
          <Ionicons name="mail" size={20} color="#666" />
          <Text style={styles.infoText}>{user.email}</Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="business" size={20} color="#666" />
          <Text style={styles.infoText}>{user.organization}</Text>
        </View>
      </View>

      <View style={styles.profileSection}>
        <Text style={styles.sectionTitle}>Professional Bio</Text>
        <Text style={styles.bioText}>{user.bio}</Text>
      </View>
    </ScrollView>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator>
        <Stack.Screen 
          name="Start" 
          component={StartScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="AppDrawer" options={{ headerShown: false }}>
          {() => (
            <Drawer.Navigator
              screenOptions={({ navigation }) => ({
                headerStyle: { backgroundColor: '#0c1230' },
                headerTintColor: '#fff',
                headerTitleStyle: { fontWeight: '700' },
                headerLeft: () => (
                  <Pressable onPress={() => navigation.toggleDrawer()} style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
                    <Ionicons name="menu" size={24} color="#ffffff" />
                  </Pressable>
                ),
              })}
            >
              <Drawer.Screen 
                name="Home" 
                component={HomeScreen}
                options={{ drawerIcon: ({ size }) => <Text style={{ fontSize: size }}>🏠</Text> }} 
              />
              <Drawer.Screen 
                name="Registration" 
                component={RegistrationScreen}
                options={{ drawerIcon: ({ size }) => <Text style={{ fontSize: size }}>📝</Text> }} 
              />
              <Drawer.Screen 
                name="Agenda & Schedule" 
                component={AgendaScheduleScreen}
                options={{ drawerIcon: ({ size }) => <Text style={{ fontSize: size }}>📅</Text> }} 
              />
              <Drawer.Screen 
                name="Speakers" 
                component={SpeakersScreen}
                options={{ drawerIcon: ({ size }) => <Text style={{ fontSize: size }}>🎤</Text> }} 
              />
              <Drawer.Screen 
                name="Maps" 
                component={MapsScreen}
                options={{ drawerIcon: ({ size }) => <Text style={{ fontSize: size }}>🗺️</Text> }} 
              />
              <Drawer.Screen 
                name="Messages" 
                component={MessagesScreen}
                options={{ drawerIcon: ({ size }) => <Text style={{ fontSize: size }}>💬</Text> }} 
              />
              <Drawer.Screen 
                name="Sponsors & Partners" 
                component={SponsorsPartnersScreen}
                options={{ drawerIcon: ({ size }) => <Text style={{ fontSize: size }}>🤝</Text> }} 
              />
            </Drawer.Navigator>
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Helper Components
function LabeledInput({ label, multiline, ...props }: any) {
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        {...props}
        style={[styles.textInput, multiline && styles.multilineInput]}
        placeholderTextColor="#999"
      />
    </View>
  );
}

// Helper Functions
function getFullAgenda(): ScheduleItem[] {
  return [
    // Day 1 - Governance, Ethics & Justice
    {
      id: 'opening-day1',
      title: 'Welcome & Opening Ceremony',
      datetime: 'August 20, 2025 09:00',
      duration: 30,
      speaker: 'Rebecca Ryakitimbo & Conference Organizers',
      venue: 'Main Auditorium',
      timestamp: dayjs('August 20, 2025 09:00').toDate().getTime(),
      dateAdded: new Date().toISOString(),
      type: 'Opening',
      description: 'Official welcome and introduction to the three-day conference journey'
    },
    {
      id: 'keynote-day1',
      title: 'Decolonizing AI: Bureaucratic Elites, Feminist Ethos',
      datetime: 'August 20, 2025 09:30',
      duration: 45,
      speaker: 'Dr. Lilian Njeri Mbuthi',
      venue: 'Main Auditorium',
      timestamp: dayjs('August 20, 2025 09:30').toDate().getTime(),
      dateAdded: new Date().toISOString(),
      type: 'Keynote',
      description: 'Examining the intersection of colonial power structures and AI governance through feminist lens'
    },
    {
      id: 'panel-ethics-day1',
      title: 'AI Ethics in the Global South: Challenges and Opportunities',
      datetime: 'August 20, 2025 10:30',
      duration: 60,
      speaker: 'Panel: Dr. Amina Hassan, Prof. Sarah Ochieng, Dr. Fatima Al-Rashid',
      venue: 'Conference Hall A',
      timestamp: dayjs('August 20, 2025 10:30').toDate().getTime(),
      dateAdded: new Date().toISOString(),
      type: 'Panel',
      description: 'Multi-perspective discussion on ethical AI development from African and Middle Eastern contexts'
    },

    // Day 2 - Feminist AI for Social Change
    {
      id: 'workshop-bias-day2',
      title: 'Hands-on: Detecting and Mitigating Gender Bias in AI Systems',
      datetime: 'August 21, 2025 09:00',
      duration: 90,
      speaker: 'Dr. Priya Sharma & Tech Collective Team',
      venue: 'Workshop Lab 1',
      timestamp: dayjs('August 21, 2025 09:00').toDate().getTime(),
      dateAdded: new Date().toISOString(),
      type: 'Workshop',
      description: 'Interactive session with real tools and datasets to identify and address AI bias'
    },
    {
      id: 'showcase-day2',
      title: 'Feminist AI Projects Showcase',
      datetime: 'August 21, 2025 11:00',
      duration: 75,
      speaker: 'Various Innovators & Startups',
      venue: 'Innovation Hub',
      timestamp: dayjs('August 21, 2025 11:00').toDate().getTime(),
      dateAdded: new Date().toISOString(),
      type: 'Showcase',
      description: 'Live demonstrations of AI projects designed with feminist principles and social impact goals'
    },

    // Day 3 - Community & Wellbeing Futures
    {
      id: 'rural-tech-day3',
      title: 'AI for Rural Communities: Bridging the Digital Divide',
      datetime: 'August 22, 2025 09:00',
      duration: 60,
      speaker: 'Community Leaders Panel',
      venue: 'Community Hall',
      timestamp: dayjs('August 22, 2025 09:00').toDate().getTime(),
      dateAdded: new Date().toISOString(),
      type: 'Community Panel',
      description: 'Voices from rural communities on their needs, challenges, and vision for inclusive AI'
    },
    {
      id: 'closing-day3',
      title: 'Closing Ceremony & Call to Action',
      datetime: 'August 22, 2025 16:00',
      duration: 45,
      speaker: 'All Participants & Organizers',
      venue: 'Main Auditorium',
      timestamp: dayjs('August 22, 2025 16:00').toDate().getTime(),
      dateAdded: new Date().toISOString(),
      type: 'Closing',
      description: 'Reflection on key insights and commitment to continued action beyond the conference'
    }
  ];
}

function formatTimeRemaining(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(total / 86400);
  const hours = Math.floor((total % 86400) / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  
  if (days > 0) return `${days}d ${hours}h remaining`;
  if (hours > 0) return `${hours}h ${minutes}m remaining`;
  return `${minutes}m remaining`;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  
  // Top Navigation
  topNav: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingVertical: 8,
  },
  navContent: {
    paddingHorizontal: 16,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  navItemActive: {
    backgroundColor: '#1a237e',
  },
  navText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#1a237e',
    fontWeight: '500',
  },
  navTextActive: {
    color: '#fff',
  },

  // Content
  sectionContent: {
    flex: 1,
    padding: 16,
  },

  // Conference Header
  conferenceHeader: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 16,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e8eaf6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  conferenceTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a237e',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  conferenceDetails: {
    alignItems: 'center',
  },
  hotelInfo: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  dateInfo: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },

  // Welcome Card
  welcomeCard: {
    backgroundColor: '#e8f5e8',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  welcomeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 4,
  },
  welcomeSubtext: {
    fontSize: 14,
    color: '#4caf50',
    marginBottom: 16,
  },
  userStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },

  // Registration Prompt
  registrationPrompt: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#e3f2fd',
    borderStyle: 'dashed',
  },
  promptTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a237e',
    marginTop: 12,
    marginBottom: 8,
  },
  promptText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  promptButton: {
    backgroundColor: '#1a237e',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  promptButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },

  // Next Event Card
  nextEventCard: {
    backgroundColor: '#fff3e0',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#ff9800',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e65100',
    marginBottom: 8,
  },
  nextEventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  nextEventTime: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  nextEventSpeaker: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  nextEventVenue: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  timeRemaining: {
    fontSize: 14,
    fontWeight: '600',
    color: '#f57c00',
  },

  // Quick Actions
  quickActions: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  actionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  actionCardDisabled: {
    backgroundColor: '#f5f5f5',
    elevation: 0,
    shadowOpacity: 0,
  },
  actionCardText: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  actionCardTextDisabled: {
    color: '#ccc',
  },

  // Highlights
  highlights: {
    marginBottom: 20,
  },
  highlightCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#1a237e',
  },
  highlightTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a237e',
    marginBottom: 4,
  },
  highlightText: {
    fontSize: 14,
    color: '#666',
  },

  // Screen Headers
  screenHeader: {
    marginBottom: 20,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  screenSubtitle: {
    fontSize: 16,
    color: '#666',
  },

  // Form Components
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  multilineInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  primaryButton: {
    backgroundColor: '#1a237e',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  // Day Selector
  daySelector: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  dayButton: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  dayButtonActive: {
    backgroundColor: '#1a237e',
  },
  dayButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  dayButtonDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  dayButtonTextActive: {
    color: '#fff',
  },

  // Theme Banner
  themeBanner: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
  },
  themeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  themeDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },

  // Agenda Items
  agendaContainer: {
    gap: 12,
  },
  agendaItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  agendaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  agendaTimeContainer: {
    alignItems: 'flex-start',
  },
  agendaTime: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a237e',
  },
  agendaDuration: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  sessionTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  sessionTypeText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '600',
  },
  agendaTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  agendaDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 18,
  },
  agendaSpeaker: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  agendaVenue: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a237e',
    borderRadius: 6,
    padding: 10,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },

  // Schedule Items
  scheduleContainer: {
    gap: 12,
  },
  scheduleItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  scheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  scheduleTimeContainer: {
    alignItems: 'flex-start',
  },
  scheduleTime: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a237e',
  },
  scheduleDuration: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  scheduleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  scheduleSpeaker: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  scheduleVenue: {
    fontSize: 14,
    color: '#666',
  },
  removeButton: {
    backgroundColor: '#f44336',
    borderRadius: 16,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Schedule Stats
  scheduleStats: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
  },

  // Profile
  profileHeader: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1a237e',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  profileInitials: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  profileOrg: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  profileId: {
    fontSize: 12,
    color: '#999',
  },
  profileStats: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  profileSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 12,
  },
  bioText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },

  // Empty State
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 32,
    lineHeight: 20,
  },
});