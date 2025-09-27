import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, Dimensions, Pressable } from 'react-native';

type SpeakerItem = {
  id: string;
  name: string;
  src: any; // require()
};

const SPEAKERS: SpeakerItem[] = [
  { id: 'angela-kanyi', name: 'Angela Kanyi', src: require('./SPEAKERS/Angela Kanyi Poster.jpg') },
  { id: 'audrey-mugeni', name: 'Audrey Mugeni', src: require('./SPEAKERS/Audrey Mugeni Poster.jpg') },
  { id: 'betty-kyalo', name: 'Betty Kyalo', src: require('./SPEAKERS/Betty Kyalo Poster.jpg') },
  { id: 'bridget-rhinohart', name: 'Bridget Rhinohart', src: require('./SPEAKERS/Bridget Rhinohart Poster.jpg') },
  { id: 'bridgit-kurgat', name: 'Bridgit Kurgat', src: require('./SPEAKERS/Bridgit Kurgat Poster.jpg') },
  { id: 'caleb', name: 'Caleb', src: require('./SPEAKERS/Caleb Poster.jpg') },
  { id: 'crystal-isanda', name: 'Crystal Isanda', src: require('./SPEAKERS/Crystal Isanda Poster.jpg') },
  { id: 'editah-hadassa', name: 'Editah Hadassa', src: require('./SPEAKERS/Editah Hadassa Poster.jpg') },
  { id: 'editah-hadassah', name: 'Editah Hadassah', src: require('./SPEAKERS/Editah Hadassah Poster.jpg') },
  { id: 'elizabeth-thuo', name: 'Elizabeth Thuo', src: require('./SPEAKERS/Elizabeth Thuo Poster.jpg') },
  { id: 'elsie-wandera', name: 'Elsie Wandera', src: require('./SPEAKERS/Elsie Wandera Poster.jpg') },
  { id: 'esther-mengi', name: 'Esther Mengi', src: require('./SPEAKERS/Esther Mengi Poster.jpg') },
  { id: 'fatima-derby', name: 'Fatima Derby', src: require('./SPEAKERS/Fatima Derby Poster.jpg') },
  { id: 'florence-ogonjo', name: 'Florence  Ogonjo', src: require('./SPEAKERS/Florence  Ogonjo Poster.jpg') },
  { id: 'florence-awino', name: 'Florence Awino', src: require('./SPEAKERS/Florence Awino Poster.jpg') },
  { id: 'joy-mido', name: 'Joy Mido', src: require('./SPEAKERS/Joy Mido Poster.jpg') },
  { id: 'judy', name: 'Judy', src: require('./SPEAKERS/Judy Poster.jpg') },
  { id: 'kirabo-atuhurira', name: 'Kirabo Atuhurira', src: require('./SPEAKERS/Kirabo Atuhurira Poster.jpg') },
  { id: 'lanice-williams', name: 'Lanice Williams', src: require('./SPEAKERS/Lanice Williams Poster.jpg') },
  { id: 'lilian-mbuthi', name: 'Lilian mbuthi', src: require('./SPEAKERS/Lilian mbuthi Poster.jpg') },
  { id: 'maryfaith-simiyu', name: 'Maryfaith Simiyu', src: require('./SPEAKERS/Maryfaith Simiyu Poster.jpg') },
  { id: 'masana-mulaudzi', name: 'Masana Mulaudzi', src: require('./SPEAKERS/Masana Mulaudzi Poster.jpg') },
  { id: 'melody-mukhwana', name: 'Melody Mukhwana', src: require('./SPEAKERS/Melody Mukhwana Poster.jpg') },
  { id: 'meriem-boudjadja', name: 'Meriem Boudjadja', src: require('./SPEAKERS/Meriem Boudjadja Poster.jpg') },
  { id: 'miriam-wanjiru', name: 'Miriam  Wanjiru', src: require('./SPEAKERS/Miriam  Wanjiru Poster.jpg') },
  { id: 'monique-steijns', name: 'Monique Steijns', src: require('./SPEAKERS/Monique Steijns Poster.jpg') },
  { id: 'muthuri-kathure', name: 'Muthuri Kathure', src: require('./SPEAKERS/Muthuri Kathure Poster.jpg') },
  { id: 'najjuko-joanita', name: 'Najjuko Joanita', src: require('./SPEAKERS/Najjuko Joanita Poster.jpg') },
  { id: 'nyandia-gachago', name: 'Nyandia Gachago', src: require('./SPEAKERS/Nyandia Gachago Poster.jpg') },
  { id: 'rachel-kagoiya', name: 'Rachel Kagoiya', src: require('./SPEAKERS/Rachel Kagoiya Poster.jpg') },
  { id: 'rebecca-ryakitimbo', name: 'rebecca Ryakitimbo', src: require('./SPEAKERS/rebecca Ryakitimbo poster.jpg') },
  { id: 'sharon-kechula', name: 'Sharon Kechula', src: require('./SPEAKERS/Sharon Kechula Poster.jpg') },
  { id: 'sunshine-komusana', name: 'Sunshine Komusana', src: require('./SPEAKERS/Sunshine Komusana Poster.jpg') },
  { id: 't-munyua', name: 'T Munyua', src: require('./SPEAKERS/T Munyua Poster.jpg') },
];

function useNumColumns() {
  const [cols, setCols] = React.useState(2);
  React.useEffect(() => {
    const onChange = () => {
      const width = Dimensions.get('window').width;
      if (width >= 1000) setCols(4); else if (width >= 700) setCols(3); else setCols(2);
    };
    onChange();
    const sub = Dimensions.addEventListener('change', onChange);
    return () => {
      // @ts-ignore - RN older types
      sub?.remove?.();
    };
  }, []);
  return cols;
}

export default function SpeakersScreen() {
  const numColumns = useNumColumns();
  const spacing = 10;
  const containerPadding = 16;
  const width = Dimensions.get('window').width - containerPadding * 2;
  const itemWidth = (width - spacing * (numColumns - 1)) / numColumns;
  const itemHeight = Math.round((itemWidth * 4) / 3); // aspect ratio 3:4

  const renderItem = ({ item }: { item: SpeakerItem }) => (
    <Pressable style={{ width: itemWidth, height: itemHeight, marginRight: spacing, marginBottom: spacing }} onPress={() => {}}>
      <ErrorHandledImage source={item.src} name={item.name} />
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}> 
        <Text style={styles.title}>Speaker Gallery</Text>
        <Text style={styles.count}>{SPEAKERS.length} Items</Text>
      </View>
      <FlatList
        data={SPEAKERS}
        key={numColumns}
        numColumns={numColumns}
        renderItem={renderItem}
        keyExtractor={(it) => it.id}
        contentContainerStyle={{ paddingBottom: 12 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

function ErrorHandledImage({ source, name }: { source: any; name: string }) {
  const [failed, setFailed] = React.useState(false);
  if (failed) {
    return (
      <View style={styles.placeholder}> 
        <Text style={styles.placeholderText}>{name}</Text>
      </View>
    );
  }
  return (
    <Image 
      source={source}
      onError={() => setFailed(true)}
      resizeMode="cover"
      style={styles.image}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16 },
  header: { marginBottom: 12 },
  title: { fontSize: 22, fontWeight: '800', color: '#333' },
  count: { color: '#666', marginTop: 4 },
  image: { width: '100%', height: '100%', borderRadius: 8, backgroundColor: '#e5e7eb' },
  placeholder: { flex: 1, backgroundColor: '#9CA3AF', borderRadius: 8, alignItems: 'center', justifyContent: 'center', padding: 8 },
  placeholderText: { color: '#fff', fontWeight: '700', textAlign: 'center' },
});
