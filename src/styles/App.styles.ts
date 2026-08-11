import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#2A0825', // Primary Background (Deep Plum/Grape-Black)
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#FF5E97', // Neon Pink border
    backgroundColor: '#4A1542', // Secondary Background (Medium Berry)
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFEBF3', // Creamy Pink text
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#FFF385', // Lemon accent text
    marginTop: 2,
  },
  container: {
    flex: 1,
    padding: 15,
  },
  card: {
    backgroundColor: '#4A1542', // Medium Berry card background
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#FF5E97', // Neon Pink border
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFEBF3', // Creamy Pink text
    marginBottom: 12,
  },
  cardDescription: {
    fontSize: 13,
    color: '#FFEBF3', // Creamy Pink text
    lineHeight: 18,
    marginBottom: 12,
    opacity: 0.8,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFF385', // Lemon label
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#2A0825', // Deep background inside cards
    borderColor: '#4A1542', // Medium Berry border
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: '#FFEBF3', // Creamy Pink text
    fontSize: 14,
    marginBottom: 12,
  },
  permissionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 99,
  },
  badgeText: {
    color: '#2A0825',
    fontSize: 11,
    fontWeight: 'bold',
  },
  permissionButton: {
    backgroundColor: '#FF5E97', // Neon Pink button
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  actionButton: {
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#2A0825', // Dark berry text on bright buttons
    fontSize: 14,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#4A1542', // Medium Berry border
    marginVertical: 15,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  statusLabel: {
    fontSize: 14,
    color: '#FFF385', // Lemon label
    marginRight: 8,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  statusVal: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF5E97', // Neon Pink text header
    marginBottom: 8,
    marginTop: 5,
  },
  consoleContainer: {
    backgroundColor: '#2A0825', // Deep background
    borderColor: '#4A1542', // Medium Berry border
    borderWidth: 1,
    borderRadius: 8,
    height: 200,
    padding: 10,
  },
  consoleScroll: {
    flex: 1,
  },
  consoleText: {
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 4,
  },
  emptyLogsText: {
    color: '#FF5E97', // Neon Pink text
    fontStyle: 'italic',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 80,
  },
});
