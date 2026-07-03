(function (global) {
  const app = (global.__portfolioApp = global.__portfolioApp || {});
  const config = app.config || {};

  let firebaseReady = false;
  let firebaseAppInstance = null;
  let firestoreInstance = null;
  let authInstance = null;

  const fallbackStore = {
    get(collectionName) {
      return app.utils?.storage?.get(`${config.storageKeys?.comments || 'portfolio'}:${collectionName}`, []);
    },
    set(collectionName, value) {
      return app.utils?.storage?.set(`${config.storageKeys?.comments || 'portfolio'}:${collectionName}`, value);
    }
  };

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[src="${src}"]`);
      if (existing) {
        if (existing.dataset.loaded === 'true') return resolve();
        existing.addEventListener('load', resolve, { once: true });
        existing.addEventListener('error', reject, { once: true });
        return;
      }
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.addEventListener('load', () => {
        script.dataset.loaded = 'true';
        resolve();
      }, { once: true });
      script.addEventListener('error', reject, { once: true });
      document.head.appendChild(script);
    });
  }

  async function initializeFirebase() {
    if (firebaseReady) return true;
    if (!config.firebase?.apiKey) return false;

    try {
      await loadScript('https://www.gstatic.com/firebasejs/10.13.0/firebase-app-compat.js');
      await loadScript('https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore-compat.js');
      await loadScript('https://www.gstatic.com/firebasejs/10.13.0/firebase-auth-compat.js');
      const firebase = global.firebase;
      if (!firebase) return false;

      firebaseAppInstance = firebase.initializeApp(config.firebase);
      firestoreInstance = firebase.firestore();
      authInstance = firebase.auth();
      firestoreInstance.enablePersistence?.({ synchronizeTabs: true }).catch(() => {});
      firebaseReady = true;
      return true;
    } catch (error) {
      console.warn('Firebase unavailable, falling back to local persistence.', error);
      return false;
    }
  }

  async function signInAnonymously() {
    if (!firebaseReady || !authInstance) return null;
    try {
      await authInstance.signInAnonymously();
      return authInstance.currentUser;
    } catch (error) {
      console.warn('Anonymous login failed.', error);
      return null;
    }
  }

  async function addDocument(collectionName, data) {
    if (firebaseReady && firestoreInstance) {
      return firestoreInstance.collection(collectionName).add({ ...data, createdAt: new Date().toISOString() });
    }
    const items = fallbackStore.get(collectionName);
    const next = [...items, { id: app.utils.uuid(), ...data, createdAt: new Date().toISOString() }];
    fallbackStore.set(collectionName, next);
    return Promise.resolve(next[next.length - 1]);
  }

  async function updateDocument(collectionName, id, data) {
    if (firebaseReady && firestoreInstance) {
      return firestoreInstance.collection(collectionName).doc(id).update(data);
    }
    const items = fallbackStore.get(collectionName);
    const next = items.map((item) => (item.id === id ? { ...item, ...data } : item));
    fallbackStore.set(collectionName, next);
    return Promise.resolve(next.find((item) => item.id === id));
  }

  async function deleteDocument(collectionName, id) {
    if (firebaseReady && firestoreInstance) {
      return firestoreInstance.collection(collectionName).doc(id).delete();
    }
    const items = fallbackStore.get(collectionName);
    const next = items.filter((item) => item.id !== id);
    fallbackStore.set(collectionName, next);
    return Promise.resolve(true);
  }

  async function queryDocuments(collectionName, options = {}) {
    if (firebaseReady && firestoreInstance) {
      let query = firestoreInstance.collection(collectionName);
      if (options.where) {
        options.where.forEach(([field, operator, value]) => {
          query = query.where(field, operator, value);
        });
      }
      if (options.orderBy) {
        query = query.orderBy(options.orderBy[0], options.orderBy[1] || 'desc');
      }
      const snapshot = await query.get();
      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    }
    return fallbackStore.get(collectionName);
  }

  function listenCollection(collectionName, callback, options = {}) {
    if (firebaseReady && firestoreInstance) {
      let query = firestoreInstance.collection(collectionName);
      if (options.where) {
        options.where.forEach(([field, operator, value]) => {
          query = query.where(field, operator, value);
        });
      }
      if (options.orderBy) {
        query = query.orderBy(options.orderBy[0], options.orderBy[1] || 'desc');
      }
      return query.onSnapshot((snapshot) => callback(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })), snapshot));
    }

    const items = fallbackStore.get(collectionName);
    callback(items);
    return () => {};
  }

  app.firebase = {
    initializeFirebase,
    signInAnonymously,
    addDocument,
    updateDocument,
    deleteDocument,
    queryDocuments,
    listenCollection,
    getAuth: () => authInstance,
    getFirestore: () => firestoreInstance,
    isReady: () => firebaseReady
  };
})(window);
