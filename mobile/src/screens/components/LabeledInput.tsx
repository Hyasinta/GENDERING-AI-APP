import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

export default function LabeledInput({ label, multiline, style, ...props }: any) {
	return (
		<View style={styles.container}>
			<Text style={styles.label}>{label}</Text>
			<TextInput
				{...props}
				style={[styles.input, multiline && styles.multiline, style]}
				placeholderTextColor="#999"
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { marginBottom: 12 },
	label: { fontSize: 12, fontWeight: '700', color: '#333', marginBottom: 6 },
	input: { borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 8, padding: 12, backgroundColor: '#fafafa' },
	multiline: { height: 90, textAlignVertical: 'top' },
});













