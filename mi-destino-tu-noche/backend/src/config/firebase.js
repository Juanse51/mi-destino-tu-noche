// =====================================================
// Configuración de Firebase (Notificaciones Push)
// =====================================================

const admin = require('firebase-admin');

let firebaseApp = null;

const initializeFirebase = () => {
  if (firebaseApp) return firebaseApp;
  
  try {
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT 
      ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
      : require('../../firebase-service-account.json');
    
    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    
    console.log('✅ Firebase inicializado correctamente');
    return firebaseApp;
  } catch (error) {
    console.warn('⚠️ Firebase no configurado:', error.message);
    return null;
  }
};

// Enviar notificación push a un usuario
const sendPushNotification = async (token, title, body, data = {}) => {
  if (!firebaseApp) {
    console.warn('Firebase no está configurado');
    return null;
  }
  
  try {
    const message = {
      token,
      notification: {
        title,
        body
      },
      data: {
        ...data,
        click_action: 'FLUTTER_NOTIFICATION_CLICK'
      },
      android: {
        priority: 'high',
        notification: {
          sound: 'default',
          channelId: 'default'
        }
      },
      apns: {
        payload: {
          aps: {
            sound: 'default',
            badge: 1
          }
        }
      }
    };
    
    const response = await admin.messaging().send(message);
    console.log('Notificación enviada:', response);
    return response;
  } catch (error) {
    console.error('Error enviando notificación:', error);
    return null;
  }
};

// Enviar notificación a múltiples usuarios
const sendPushToMultiple = async (tokens, title, body, data = {}) => {
  if (!firebaseApp || !tokens.length) return null;
  
  try {
    const message = {
      tokens,
      notification: { title, body },
      data
    };
    
    const response = await admin.messaging().sendMulticast(message);
    console.log(`Notificaciones enviadas: ${response.successCount}/${tokens.length}`);
    return response;
  } catch (error) {
    console.error('Error enviando notificaciones:', error);
    return null;
  }
};

module.exports = {
  initializeFirebase,
  sendPushNotification,
  sendPushToMultiple
};
