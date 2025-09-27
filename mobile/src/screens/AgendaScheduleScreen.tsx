import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, Alert, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import { STORAGE_KEYS, usePersistentState, User, ScheduleItem, getFullAgenda, formatTimeRemaining } from '../shared';

export default function AgendaScheduleScreen() {
  const [user] = usePersistentState<User | null>(STORAGE_KEYS.user, null);
  const [schedule, setSchedule] = usePersistentState<ScheduleItem[]>(STORAGE_KEYS.schedule, []);
  const [selectedDay, setSelectedDay] = React.useState<'all' | 'day1' | 'day2' | 'day3'>('all');
  const [currentPage, setCurrentPage] = React.useState<'agenda' | 'schedule'>('agenda');
  const [search, setSearch] = React.useState('');
  const [favorites, setFavorites] = React.useState<Set<string>>(new Set());

  const agenda = getFullAgenda();
  const theme = {
    day1: { title: 'Governance, Ethics & Justice', color: '#1a237e' },
    day2: { title: 'Feminist AI for Social Change', color: '#7b1fa2' },
    day3: { title: 'Community & Wellbeing Futures', color: '#388e3c' },
    all: { title: 'All Days', color: '#4a5568' },
  }[selectedDay];

  const dayAgenda = agenda
    .filter(a => selectedDay === 'all' ? true : a.id.includes(selectedDay))
    .filter(a => {
      if (!search.trim()) return true;
      const term = search.toLowerCase();
      return (
        a.title.toLowerCase().includes(term) ||
        a.speaker.toLowerCase().includes(term) ||
        a.venue.toLowerCase().includes(term) ||
        (a.description || '').toLowerCase().includes(term) ||
        (a.type || '').toLowerCase().includes(term)
      );
    })
    .sort((a, b) => dayjs(a.datetime).toDate().getTime() - dayjs(b.datetime).toDate().getTime());

  // Optional: react-navigation param to open a specific tab
  // @ts-ignore route may be injected by navigator
  React.useEffect(() => {
    // no-op here unless route params are provided by navigation
  }, []);

  const addToSchedule = (session: ScheduleItem) => {
    if (!user) {
      Alert.alert('Registration required', 'Please register to add sessions.');
      return;
    }
    if (schedule.find(s => s.id === session.id)) return;
    const s: ScheduleItem = { ...session, timestamp: dayjs(session.datetime).toDate().getTime(), dateAdded: new Date().toISOString() };
    setSchedule([...schedule, s]);
  };

  const removeFromSchedule = (id: string) => {
    Alert.alert('Remove Session', 'Remove this session from your schedule?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => setSchedule(schedule.filter(s => s.id !== id)) }
    ]);
  };

  const toggleFavorite = (id: string) => {
    const next = new Set(favorites);
    if (next.has(id)) next.delete(id); else next.add(id);
    setFavorites(next);
  };

  const upcoming = [...schedule].sort((a, b) => a.timestamp - b.timestamp);
  const nextEvent = upcoming.find(s => s.timestamp > Date.now());
  const totalMinutes = schedule.reduce((sum, s) => sum + (s.duration || 0), 0);

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginRight: 8 }}>
              <Text style={{ color: '#fff' }}>🤖</Text>
            </View>
            <Text style={{ color: '#fff', fontWeight: '700' }}>Gendering AI Conf</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <View style={styles.iconBtn}><Text style={{ color: '#fff' }}>🔔</Text></View>
            <View style={styles.iconBtn}><Text style={{ color: '#fff' }}>⋯</Text></View>
          </View>
        </View>

        {/* Search */}
        {currentPage === 'agenda' ? (
          <View style={styles.searchBar}>
            <Text style={{ color: 'rgba(255,255,255,0.7)', marginRight: 8 }}>🔍</Text>
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search sessions..."
              placeholderTextColor="rgba(255,255,255,0.7)"
              style={styles.searchInput}
            />
          </View>
        ) : null}

        {/* Tabs */}
        <View style={styles.tabs}>
          <Pressable onPress={() => setCurrentPage('agenda')} style={[styles.tab, currentPage === 'agenda' && styles.tabActive]}>
            <Text style={[styles.tabText, currentPage === 'agenda' && styles.tabTextActive]}>Agenda</Text>
          </Pressable>
          <Pressable onPress={() => setCurrentPage('schedule')} style={[styles.tab, currentPage === 'schedule' && styles.tabActive]}>
            <Text style={[styles.tabText, currentPage === 'schedule' && styles.tabTextActive]}>My Schedule</Text>
          </Pressable>
        </View>

        {/* Day selector only on agenda */}
        {currentPage === 'agenda' ? (
          <View style={styles.daySelector}>
            {(['all','day1','day2','day3'] as const).map((d, i) => (
              <Pressable key={d} onPress={() => setSelectedDay(d)} style={[styles.dayBtn, selectedDay === d && [styles.dayBtnActive, { backgroundColor: theme.color }]]}>
                <Text style={[styles.dayBtnText, selectedDay === d && styles.dayBtnTextActive]}>{d === 'all' ? 'All Days' : `Day ${i}`}</Text>
              </Pressable>
            ))}
          </View>
        ) : null}
      </View>

      {/* Agenda page */}
      {currentPage === 'agenda' ? (
        <>
          <View style={[styles.themeBanner, { borderLeftColor: theme.color }]}>
            <Text style={[styles.themeTitle, { color: theme.color }]}>{theme.title}</Text>
          </View>

          {dayAgenda.map(session => (
            <View key={session.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.time}>{session.datetime}</Text>
                <Text style={styles.duration}>{session.duration} min</Text>
              </View>
              <Text style={styles.sessionTitle}>{session.title}</Text>
              {session.description ? <Text style={styles.sessionDesc}>{session.description}</Text> : null}
              <Text style={styles.meta}>👤 {session.speaker}</Text>
              <Text style={styles.meta}>📍 {session.venue}</Text>
              <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
                <Pressable style={[styles.addBtn, { backgroundColor: theme.color, flex: 1 }]} onPress={() => addToSchedule(session)}>
                  <Ionicons name="add-circle-outline" size={18} color="#fff" />
                  <Text style={styles.addText}>Add to My Schedule</Text>
                </Pressable>
                <Pressable onPress={() => toggleFavorite(session.id)} style={styles.favBtn}>
                  <Text style={{ fontSize: 16 }}>{favorites.has(session.id) ? '⭐' : '☆'}</Text>
                </Pressable>
              </View>
            </View>
          ))}
        </>
      ) : null}

      {/* Schedule page */}
      {currentPage === 'schedule' ? (
        <>
          {!user ? (
            <View style={styles.empty}> 
              <Ionicons name="person-add-outline" size={64} color="#ccc" />
              <Text style={styles.emptyTitle}>Registration required</Text>
              <Text style={styles.emptyText}>Please register to create and manage your schedule.</Text>
            </View>
          ) : schedule.length === 0 ? (
            <View style={styles.empty}> 
              <Ionicons name="calendar-outline" size={64} color="#ccc" />
              <Text style={styles.emptyTitle}>No events scheduled</Text>
              <Text style={styles.emptyText}>Add events from the Agenda tab.</Text>
            </View>
          ) : (
            <>
              {/* Stats */}
              <View style={styles.statsRow}>
                <View style={styles.statCard}>
                  <Text style={styles.statNumber}>{schedule.length}</Text>
                  <Text style={styles.statLabel}>Events</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statNumber}>{(totalMinutes / 60).toFixed(1)}</Text>
                  <Text style={styles.statLabel}>Hours</Text>
                </View>
              </View>

              {nextEvent && (
                <View style={styles.nextCard}>
                  <Text style={styles.cardTitle}>Up Next</Text>
                  <Text style={styles.cardText}>{nextEvent.title}</Text>
                  <Text style={styles.cardText}>⏰ {nextEvent.datetime} • 📍 {nextEvent.venue}</Text>
                  <Text style={styles.cardText}>⏳ {formatTimeRemaining(nextEvent.timestamp - Date.now())}</Text>
                </View>
              )}

              {upcoming.map(s => (
                <View key={s.id} style={styles.item}>
                  <View style={styles.itemHeader}>
                    <Text style={styles.time}>{s.datetime}</Text>
                    <Text style={styles.duration}>{s.duration} min</Text>
                    <Pressable style={styles.removeBtn} onPress={() => removeFromSchedule(s.id)}>
                      <Ionicons name="trash-outline" size={16} color="#fff" />
                    </Pressable>
                  </View>
                  <Text style={styles.title2}>{s.title}</Text>
                  <Text style={styles.meta}>👤 {s.speaker}</Text>
                  <Text style={styles.meta}>📍 {s.venue}</Text>
                </View>
              ))}
            </>
          )}
        </>
      ) : null}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
  header: { marginBottom: 12, backgroundColor: '#2d3748', padding: 16, borderRadius: 12 },
  title: { fontSize: 22, fontWeight: '800', color: '#1a237e' },
  subtitle: { color: '#e2e8f0' },
  iconBtn: { width: 36, height: 36, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginLeft: 8 },
  searchBar: { flexDirection: 'row', alignItems: 'center', marginTop: 8, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 12, paddingHorizontal: 12 },
  searchInput: { flex: 1, color: '#fff', paddingVertical: 10, fontSize: 16 },
  tabs: { flexDirection: 'row', gap: 8, marginTop: 12 },
  tab: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)' },
  tabActive: { backgroundColor: '#fff' },
  tabText: { color: '#fff', fontWeight: '600' },
  tabTextActive: { color: '#2d3748' },
  daySelector: { flexDirection: 'row', marginVertical: 8, gap: 8 },
  dayBtn: { flex: 1, backgroundColor: '#e8eaf6', padding: 10, borderRadius: 8, alignItems: 'center' },
  dayBtnActive: { backgroundColor: '#1a237e' },
  dayBtnText: { color: '#1a237e', fontWeight: '700' },
  dayBtnTextActive: { color: '#fff' },
  themeBanner: { backgroundColor: '#fff', borderRadius: 12, padding: 12, borderLeftWidth: 4, marginBottom: 12 },
  themeTitle: { fontWeight: '700' },
  sectionHeader: { marginTop: 8, marginBottom: 6 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#333' },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 10 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  time: { color: '#1a237e', fontWeight: '700' },
  duration: { color: '#00bcd4' },
  sessionTitle: { fontWeight: '700', color: '#333', marginBottom: 4 },
  sessionDesc: { color: '#666', marginBottom: 6 },
  meta: { color: '#666', marginBottom: 2 },
  addBtn: { flexDirection: 'row', gap: 6, alignItems: 'center', justifyContent: 'center', padding: 10, borderRadius: 8, marginTop: 6 },
  addText: { color: '#fff', fontWeight: '700' },
  favBtn: { width: 44, height: 44, borderRadius: 8, backgroundColor: '#f7fafc', alignItems: 'center', justifyContent: 'center' },
  empty: { alignItems: 'center', paddingVertical: 24 },
  emptyTitle: { fontWeight: '700', color: '#333', marginTop: 8 },
  emptyText: { color: '#666' },
  nextCard: { backgroundColor: '#fff3e0', borderRadius: 12, padding: 12, marginBottom: 12, borderLeftWidth: 4, borderLeftColor: '#ff9800' },
  cardTitle: { fontWeight: '700', color: '#e65100', marginBottom: 4 },
  cardText: { color: '#555' },
  item: { backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 10 },
  itemHeader: { flexDirection: 'row', alignItems: 'center' },
  title2: { fontWeight: '700', color: '#333', marginTop: 6 },
  removeBtn: { marginLeft: 8, backgroundColor: '#f44336', borderRadius: 16, padding: 8 },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  statCard: { flex: 1, backgroundColor: '#2d3748', borderRadius: 12, padding: 14, alignItems: 'center' },
  statNumber: { color: '#fff', fontSize: 20, fontWeight: '800' },
  statLabel: { color: '#e2e8f0', fontSize: 12 },
});



