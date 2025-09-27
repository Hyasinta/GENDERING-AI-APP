import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { STORAGE_KEYS, usePersistentState, User } from '../shared';

const ROLES = ['Speaker', 'Attendee', 'Host'] as const;

export default function RegistrationScreen({ route }: any) {
	const [, setUser] = usePersistentState<User | null>(STORAGE_KEYS.user, null);
	const [currentStep, setCurrentStep] = React.useState(0);
	const totalSteps = 4;
	const [fullName, setFullName] = React.useState('');
	const [email, setEmail] = React.useState('');
	const [organization, setOrganization] = React.useState('');
	const [role, setRole] = React.useState<string>('');
	const [bio, setBio] = React.useState('');
	const [submitted, setSubmitted] = React.useState(false);

	// Optional control to choose which step to start at
	React.useEffect(() => {
		const startAt = route?.params?.startAt as string | undefined;
		if (!startAt) return;
		if (startAt === 'personal') setCurrentStep(0);
		if (startAt === 'organization') setCurrentStep(1);
		if (startAt === 'role') setCurrentStep(2);
		if (startAt === 'about') setCurrentStep(3);
	}, [route?.params]);

	const progress = ((currentStep + 1) / totalSteps) * 100;

	const validateStep = () => {
		if (currentStep === 0) return fullName.trim().length > 0 && /.+@.+\..+/.test(email);
		if (currentStep === 1) return organization.trim().length > 0;
		if (currentStep === 2) return role.length > 0;
		if (currentStep === 3) return bio.trim().length > 0;
		return true;
	};

	const next = () => {
		if (!validateStep()) return;
		if (currentStep < totalSteps - 1) setCurrentStep(currentStep + 1);
		else submit();
	};

	const back = () => {
		if (currentStep > 0) setCurrentStep(currentStep - 1);
	};

	const submit = () => {
		const userData: User = {
			name: fullName,
			email,
			organization,
			bio,
			role,
			registrationDate: new Date().toISOString(),
			participantId: 'GENAI_' + Date.now(),
		};
		setUser(userData);
		setSubmitted(true);
	};

	if (submitted) {
		return (
			<View style={{ flex: 1, backgroundColor: '#fff', padding: 24, justifyContent: 'center' }}>
				<View style={styles.successIcon}><Text style={{ color: '#fff', fontWeight: '900' }}>✅</Text></View>
				<Text style={styles.successTitle}>Registration Complete!</Text>
				<Text style={styles.successMessage}>Thank you! Your registration has been saved on this device.</Text>
			</View>
		);
	}

	return (
		<View style={{ flex: 1, backgroundColor: '#f5f7fa' }}>
			{/* Header */}
			<View style={styles.appHeader}>
				<Text style={styles.headerTitle}>Gendering AI Conference Registration</Text>
				<Text style={styles.headerSubtitle}>Join our exclusive event</Text>
			</View>

			{/* Progress */}
			<View style={styles.progressContainer}>
				<View style={styles.progressBar}><View style={[styles.progressFill, { width: `${progress}%` }]} /></View>
		<Text style={styles.progressText}>{
			currentStep === 0 ? 'Personal info' :
			currentStep === 1 ? 'Organization' :
			currentStep === 2 ? 'Your role' :
			'About you'
		}</Text>
			</View>

			{/* Content */}
			<ScrollView style={{ flex: 1, backgroundColor: '#fff' }} contentContainerStyle={{ padding: 24 }}>
				{/* Welcome section removed */}

				{currentStep === 0 && (
					<View>
						<Text style={styles.stepTitle}>Personal Information</Text>
						<Text style={styles.stepDesc}>Tell us a bit about yourself</Text>
						<View style={styles.formGroup}>
							<Text style={styles.formLabel}>Full Name</Text>
							<TextInput style={styles.input} value={fullName} onChangeText={setFullName} placeholder="Enter your full name" />
						</View>
						<View style={styles.formGroup}>
							<Text style={styles.formLabel}>Email Address</Text>
							<TextInput style={styles.input} keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} placeholder="your.email@example.com" />
						</View>
					</View>
				)}

				{currentStep === 1 && (
					<View>
						<Text style={styles.stepTitle}>Organization</Text>
						<Text style={styles.stepDesc}>Where do you work or study?</Text>
						<View style={styles.formGroup}>
							<Text style={styles.formLabel}>Organization</Text>
							<TextInput style={styles.input} value={organization} onChangeText={setOrganization} placeholder="Your company or institution" />
						</View>
					</View>
				)}

				{currentStep === 2 && (
					<View>
						<Text style={styles.stepTitle}>Your Role</Text>
						<Text style={styles.stepDesc}>How will you participate?</Text>
						<View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
							{ROLES.map(r => (
								<Pressable key={r} onPress={() => setRole(r)} style={[styles.chip, role === r && styles.chipActive]}>
									<Text style={[styles.chipText, role === r && styles.chipTextActive]}>{r}</Text>
								</Pressable>
							))}
						</View>
					</View>
				)}

				{currentStep === 3 && (
					<View>
						<Text style={styles.stepTitle}>About You</Text>
						<Text style={styles.stepDesc}>Share your background and interests</Text>
						<View style={styles.formGroup}>
							<Text style={styles.formLabel}>Short Bio</Text>
							<TextInput style={[styles.input, { height: 120, textAlignVertical: 'top' }]} multiline value={bio} onChangeText={setBio} placeholder="Tell us about your background..." />
						</View>
						{/* Review */}
						<View style={{ backgroundColor: '#f7fafc', padding: 12, borderRadius: 12, marginTop: 8 }}>
							<Text style={{ color: '#2d3748', fontWeight: '700', marginBottom: 8 }}>Review</Text>
							<Text style={styles.reviewText}>Name: {fullName}</Text>
							<Text style={styles.reviewText}>Email: {email}</Text>
							<Text style={styles.reviewText}>Organization: {organization}</Text>
							<Text style={styles.reviewText}>Role: {role || '—'}</Text>
						</View>
					</View>
				)}
			</ScrollView>

			{/* Navigation */}
			<View style={styles.navBar}>
				{currentStep > 0 ? (
					<Pressable onPress={back} style={[styles.navButton, styles.navSecondary]}><Text style={styles.navSecondaryText}>Back</Text></Pressable>
				) : <View style={{ flex: 1 }} />}
				<Pressable onPress={next} style={[styles.navButton, styles.navPrimary]}>
					<Text style={styles.navPrimaryText}>{currentStep === totalSteps - 1 ? 'Submit Registration' : 'Continue'}</Text>
				</Pressable>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	appHeader: { backgroundColor: '#2d3748', padding: 20 },
	headerTitle: { color: '#fff', fontSize: 20, fontWeight: '800' },
	headerSubtitle: { color: '#e2e8f0', marginTop: 4 },
	progressContainer: { backgroundColor: '#fff', padding: 16, borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
	progressBar: { height: 4, backgroundColor: '#edf2f7', borderRadius: 2, overflow: 'hidden' },
	progressFill: { height: '100%', backgroundColor: '#2d3748' },
	progressText: { fontSize: 12, color: '#718096', marginTop: 8, textAlign: 'center' },
	welcomeIcon: { width: 80, height: 80, borderRadius: 20, backgroundColor: '#2d3748', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
	welcomeTitle: { fontSize: 24, fontWeight: '800', color: '#2d3748', marginBottom: 8 },
	welcomeDescription: { color: '#718096', textAlign: 'center', marginBottom: 16 },
	primaryButton: { backgroundColor: '#2d3748', paddingVertical: 14, paddingHorizontal: 24, borderRadius: 12 },
	primaryButtonText: { color: '#fff', fontWeight: '700' },
	stepTitle: { fontSize: 20, fontWeight: '800', color: '#2d3748', marginBottom: 6 },
	stepDesc: { color: '#718096', marginBottom: 12 },
	formGroup: { marginBottom: 16 },
	formLabel: { fontSize: 14, fontWeight: '700', color: '#4a5568', marginBottom: 6 },
	input: { backgroundColor: '#f7fafc', borderWidth: 2, borderColor: '#e2e8f0', borderRadius: 12, padding: 12, fontSize: 16, color: '#2d3748' },
	chip: { backgroundColor: '#e8eaf6', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 20 },
	chipActive: { backgroundColor: '#1a237e' },
	chipText: { color: '#1a237e', fontWeight: '700' },
	chipTextActive: { color: '#fff' },
	navBar: { flexDirection: 'row', gap: 12, padding: 16, borderTopWidth: 1, borderTopColor: '#e2e8f0', backgroundColor: '#fff' },
	navButton: { flex: 1, borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
	navSecondary: { backgroundColor: '#f7fafc', borderWidth: 2, borderColor: '#e2e8f0' },
	navPrimary: { backgroundColor: '#2d3748' },
	navSecondaryText: { color: '#4a5568', fontWeight: '700' },
	navPrimaryText: { color: '#fff', fontWeight: '700' },
	successIcon: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#2f855a', alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginBottom: 16 },
	successTitle: { fontSize: 24, fontWeight: '800', color: '#2d3748', textAlign: 'center', marginBottom: 8 },
	successMessage: { color: '#718096', textAlign: 'center' },
		reviewText: { color: '#2d3748', marginBottom: 4 },
});


