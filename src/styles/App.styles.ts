import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#020617', // Dark Slate-950 Primary Background
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B', // Slate-800 border
    backgroundColor: '#0F172A', // Slate-900 Secondary Background
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#F8FAFC', // Slate-50 Primary Text
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#818CF8', // Indigo-400 Accent Text
    marginTop: 2,
  },
  container: {
    flex: 1,
    padding: 15,
  },
  card: {
    backgroundColor: '#0F172A', // Slate-900 Card Background
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#1E293B', // Slate-800 Border
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F8FAFC', // Slate-50 Title Text
    marginBottom: 12,
  },
  cardDescription: {
    fontSize: 13,
    color: '#94A3B8', // Slate-400 Description Text
    lineHeight: 18,
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#818CF8', // Indigo-400 Label
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#020617', // Deep Slate-950 background inside cards
    borderColor: '#1E293B', // Slate-800 border
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: '#F8FAFC', // Slate-50 text
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
    color: '#F8FAFC',
    fontSize: 11,
    fontWeight: 'bold',
  },
  permissionButton: {
    backgroundColor: '#4F46E5', // Indigo-600 button
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
    color: '#FFFFFF', // White text on buttons
    fontSize: 14,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#1E293B', // Slate-800 border
    marginVertical: 15,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  statusLabel: {
    fontSize: 14,
    color: '#94A3B8', // Slate-400 label
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
    color: '#818CF8', // Indigo-400 text header
    marginBottom: 8,
    marginTop: 5,
  },
  consoleContainer: {
    backgroundColor: '#020617', // Deep Slate-950 background
    borderColor: '#1E293B', // Slate-800 border
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
    color: '#64748B', // Slate-500 text
    fontStyle: 'italic',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 80,
  },
});
