import { defineExtensionMessaging } from '@webext-core/messaging';
interface MessagingProtocol {
  // UI->Background messages
  'auth:signIn': () => void;
  //'auth:signIn': () => SerializedUser | null; <---------- OLD version of ^, see background/index.ts to see why it was changed
  'auth:signInFirefox': () => void;
  'auth:signOut': () => void;
  'summarize:video': () => string;
  'friends:get': () => any[]; // Add this line
  'friends:updateCache': () => void;
}

export const messaging = defineExtensionMessaging<MessagingProtocol>();