import notifee, { AndroidImportance, TimestampTrigger, TriggerType } from '@notifee/react-native';

export async function ensureChannels() {
  await notifee.createChannel({ id: 'timer', name: 'Focus Timer', importance: AndroidImportance.HIGH });
}

export async function showPersistentTimer(title: string) {
  await ensureChannels();
  await notifee.displayNotification({
    title,
    body: 'Focus session running',
    android: { channelId: 'timer', ongoing: true, asForegroundService: true },
  });
}

export async function cancelAllNotifications() {
  await notifee.cancelAllNotifications();
}

export async function scheduleTimerCompleteNotification(whenEpochMs: number) {
  const trigger: TimestampTrigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: whenEpochMs,
    alarmManager: { allowWhileIdle: true },
  };
  await ensureChannels();
  await notifee.createTriggerNotification(
    {
      title: 'Focus complete',
      body: 'Time to take a break',
      android: { channelId: 'timer' },
    },
    trigger
  );
}