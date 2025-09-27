import React from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { STORAGE_KEYS, usePersistentState, User, ScheduleItem } from '../shared';

export default function HomeScreen({ navigation }: { navigation: any }) {
	const [user] = usePersistentState<User | null>(STORAGE_KEYS.user, null);
	const [schedule] = usePersistentState<ScheduleItem[]>(STORAGE_KEYS.schedule, []);
	const nextEvent = [...schedule].sort((a, b) => a.timestamp - b.timestamp).find(s => s.timestamp > Date.now());

	return (
		<ScrollView style={styles.container}>
			<View style={styles.header}>
				<View style={styles.logoCircle}>
					<Ionicons name="people" size={40} color="#1a237e" />
				</View>
				<Text style={styles.title}>GENDERING AI CONFERENCE</Text>
				<Text style={styles.subtitle}>Mövenpick Nairobi • Aug 20–22, 2025</Text>
			</View>

			{/* Dashboard */}
			<View style={styles.dashboard}>
				<Text style={styles.sectionTitle}>Dashboard</Text>
				<View style={styles.dashboardGrid}>
					<Pressable style={styles.dashboardTile} onPress={() => navigation.navigate('Registration')}>
						<Ionicons name="person-add" size={22} color="#1a237e" />
						<Text style={styles.tileText}>Registration</Text>
					</Pressable>
					<Pressable style={styles.dashboardTile} onPress={() => navigation.navigate('Agenda & Schedule')}>
						<Ionicons name="calendar" size={22} color="#1a237e" />
						<Text style={styles.tileText}>Agenda & Schedule</Text>
					</Pressable>
					<Pressable style={styles.dashboardTile} onPress={() => navigation.navigate('Speakers')}>
						<Ionicons name="mic" size={22} color="#1a237e" />
						<Text style={styles.tileText}>Speakers</Text>
					</Pressable>
					<Pressable style={styles.dashboardTile} onPress={() => navigation.navigate('Maps')}>
						<Ionicons name="map" size={22} color="#1a237e" />
						<Text style={styles.tileText}>Maps</Text>
					</Pressable>
					<Pressable style={styles.dashboardTile} onPress={() => navigation.navigate('Messages')}>
						<Ionicons name="chatbubbles" size={22} color="#1a237e" />
						<Text style={styles.tileText}>Messages</Text>
					</Pressable>
					<Pressable style={styles.dashboardTile} onPress={() => navigation.navigate('Sponsors & Partners')}>
						<Ionicons name="people-circle" size={22} color="#1a237e" />
						<Text style={styles.tileText}>Sponsors & Partners</Text>
					</Pressable>
				</View>
			</View>

			{user && (
				<View style={styles.cardSuccess}>
					<Text style={styles.cardTitle}>Welcome, {user.name} 👋</Text>
					<Text style={styles.cardText}>You have {schedule.length} sessions in your schedule.</Text>
				</View>
			)}

			{nextEvent && (
				<View style={styles.cardWarning}>
					<Text style={styles.cardTitle}>Next Event</Text>
					<Text style={styles.cardText}>{nextEvent.title}</Text>
					<Text style={styles.cardText}>⏰ {nextEvent.datetime} • 📍 {nextEvent.venue}</Text>
				</View>
			)}

			{/* Quick Actions removed as requested */}
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
	header: { backgroundColor: '#fff', borderRadius: 12, padding: 16, alignItems: 'center', marginBottom: 12 },
	logoCircle: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#e8eaf6', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
	title: { fontSize: 18, fontWeight: '800', color: '#1a237e' },
	subtitle: { fontSize: 12, color: '#666' },
	cardSuccess: { backgroundColor: '#e8f5e8', borderRadius: 12, padding: 16, marginBottom: 12 },
	cardInfo: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, alignItems: 'center' },
	cardWarning: { backgroundColor: '#fff8e1', borderRadius: 12, padding: 16, marginBottom: 12, borderLeftWidth: 4, borderLeftColor: '#ff9800' },
	cardTitle: { fontWeight: '700', color: '#333', marginBottom: 6 },
	cardText: { color: '#555' },
	primaryButton: { backgroundColor: '#1a237e', borderRadius: 8, paddingVertical: 12, paddingHorizontal: 16, marginTop: 10 },
	primaryButtonText: { color: '#fff', fontWeight: '700' },
	actions: { backgroundColor: '#fff', borderRadius: 12, padding: 16 },
	sectionTitle: { fontWeight: '700', color: '#333', marginBottom: 10 },
	dashboard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12 },
	dashboardGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
	dashboardTile: { width: '48%', backgroundColor: '#e8eaf6', borderRadius: 12, paddingVertical: 16, paddingHorizontal: 12, marginBottom: 10, alignItems: 'center', justifyContent: 'center' },
	tileText: { color: '#1a237e', fontWeight: '700', textAlign: 'center', marginTop: 8 },
	actionButton: { backgroundColor: '#e8eaf6', borderRadius: 8, padding: 12, marginBottom: 8, flexDirection: 'row', alignItems: 'center' },
	actionText: { color: '#1a237e', fontWeight: '600', marginLeft: 8 }
});
