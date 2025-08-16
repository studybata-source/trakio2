import { create } from 'zustand';

export interface SettingsState {
  theme: 'pitchBlack' | 'charcoal' | 'softGrey';
  oledTrueBlack: boolean;
  font: 'system' | 'sfMono' | 'atkinson';
  textScale: 0 | 1 | 2 | 3;
  bold: boolean;
  motion: 'full' | 'reduced' | 'none';
  drawerEnabled: boolean;
  notificationPolicy: 'blockAll' | 'starredOnly' | 'alarmsOnly';
  quickSettings: Array<'torch' | 'airplane' | 'dnd' | 'wifi' | 'bt'>;
  biometricExit: boolean;
  kioskOnReboot: boolean;
  pinnedApps: string[];
  hidePinnedNames: boolean;
  lockPinnedDaily: boolean;
}

export const useSettings = create<SettingsState>(() => ({
  theme: 'pitchBlack',
  oledTrueBlack: true,
  font: 'system',
  textScale: 1,
  bold: false,
  motion: 'full',
  drawerEnabled: false,
  notificationPolicy: 'alarmsOnly',
  quickSettings: ['torch', 'dnd'],
  biometricExit: false,
  kioskOnReboot: false,
  pinnedApps: [],
  hidePinnedNames: false,
  lockPinnedDaily: false,
}));