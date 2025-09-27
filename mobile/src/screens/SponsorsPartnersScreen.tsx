import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, Pressable, Dimensions } from 'react-native';

// ensure Metro attempts to resolve this asset at bundle time (normalized filename)
const acetLogo = require('./Partners/acet-logo-colour-high-resolution.png');

type Sponsor = {
  id: number;
  name: string;
  src: any; // require
  dark?: boolean;
};

const ALL_SPONSORS: Sponsor[] = [
  { id: 1, name: 'Logo 1', src: require('./Partners/144 Logo.png') },
  { id: 2, name: 'Logo 2', src: acetLogo },
  { id: 3, name: 'Logo 3', src: require('./Partners/acet_logo_retina-04-1.png'), dark: true },
  { id: 4, name: 'Logo 4', src: require('./Partners/AI4D Update (1).png') },
  { id: 5, name: 'Logo 5', src: require('./Partners/GCG logo light-13.png'), dark: true },
  { id: 6, name: 'Logo 6', src: require('./Partners/aorai-logo-900px.png') },
  { id: 7, name: 'Logo 7', src: require('./Partners/GCG Logo-13 (1).png') },
  { id: 8, name: 'Logo 8', src: require('./Partners/IDRC New logo.png') },
  { id: 9, name: 'Logo 9', src: require('./Partners/idrc_logo-wordmark.png') },
  { id: 10, name: 'Logo 10', src: require('./Partners/Project~ETHER logo-01.png') },
  { id: 11, name: 'Logo 11', src: require('./Partners/Siasa Place Logo_2018 Big.jpg') },
  { id: 12, name: 'Logo 12', src: require('./Partners/UK International Development Logo Colour PNG.png') },
  { id: 13, name: 'Logo 13', src: require('./Partners/UNFPA LOGO_WHITE.png'), dark: true },
  { id: 14, name: 'Logo 14', src: require('./Partners/UNFPA_Logo.png') },
];

function useNumColumns() {
  const [cols, setCols] = React.useState(2);
  React.useEffect(() => {
    const onChange = () => {
      const w = Dimensions.get('window').width;
      if (w >= 900) setCols(3); else setCols(2);
    };
    onChange();
    const sub = Dimensions.addEventListener('change', onChange);
    return () => {
      // @ts-ignore older RN types
      sub?.remove?.();
    };
  }, []);
  return cols;
}

export default function SponsorsPartnersScreen() {
  const numColumns = useNumColumns();
  const spacing = 16;
  const containerPadding = 16;
  const width = Dimensions.get('window').width - containerPadding * 2;
  const cardWidth = (width - spacing * (numColumns - 1)) / numColumns;

  const renderItem = ({ item }: { item: Sponsor }) => (
    <Pressable
      style={[styles.card, { width: cardWidth, marginRight: spacing, backgroundColor: item.dark ? '#2d3748' : '#fff' }]}
      onPress={() => {}}
    >
      <ErrorHandledLogo source={item.src} dark={!!item.dark} name={item.name} />
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}> 
        <Text style={styles.headerTitle}>Sponsors & Partners</Text>
        <Text style={styles.subtitle}>Supporting our mission</Text>
      </View>

      <View style={styles.countWrap}>
        <Text style={styles.countBadge}>{ALL_SPONSORS.length} total</Text>
      </View>

      <FlatList
        data={ALL_SPONSORS}
        key={numColumns}
        numColumns={numColumns}
        renderItem={renderItem}
        keyExtractor={(it) => String(it.id)}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      />

      <Text style={styles.footer}>Thank you to our supporters</Text>
    </View>
  );
}

function ErrorHandledLogo({ source, dark, name }: { source: any; dark: boolean; name: string }) {
  const [failed, setFailed] = React.useState(false);
  if (failed) {
    return (
      <View style={[styles.placeholder, dark && styles.placeholderDark]}> 
        <Text style={[styles.placeholderText, dark && { color: '#fff' }]}>{name}</Text>
      </View>
    );
  }
  return (
    <Image 
      source={source}
      resizeMode="contain"
      onError={() => setFailed(true)}
      style={styles.logo}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
  header: { backgroundColor: '#2d3748', paddingVertical: 24, paddingHorizontal: 16, borderRadius: 16, marginBottom: 16 },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: '800' },
  subtitle: { color: '#e2e8f0', marginTop: 4 },
  countWrap: { alignItems: 'center', marginVertical: 12 },
  countBadge: { color: '#fff', backgroundColor: '#6b46c1', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20, fontWeight: '700' },
  card: { height: 120, borderRadius: 16, padding: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 16, borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)', shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 2 },
  logo: { width: '100%', height: '100%' },
  placeholder: { width: 80, height: 60, borderRadius: 8, backgroundColor: '#edf2f7', borderWidth: 2, borderColor: '#e2e8f0', alignItems: 'center', justifyContent: 'center' },
  placeholderDark: { backgroundColor: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.3)' },
  placeholderText: { color: '#718096', fontSize: 12, fontWeight: '600', textAlign: 'center' },
  footer: { textAlign: 'center', color: '#718096', marginTop: 8 },
});
