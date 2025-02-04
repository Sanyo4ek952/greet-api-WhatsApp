const storageKey = {
    idInstance: 'accessToken',
    apiTokenInstance: 'apiTokenInstance',
}

export const storage = {
    deleteIdInstance: () => localStorage.removeItem(storageKey.idInstance),
    getIdInstance: () => localStorage.getItem(storageKey.idInstance),
    setIdInstance: (idInstance: string) => localStorage.setItem(storageKey.idInstance, idInstance),
    deleteApiTokenInstance: () => localStorage.removeItem(storageKey.apiTokenInstance),
    getApiTokenInstance: () => localStorage.getItem(storageKey.apiTokenInstance),
    setApiTokenInstance: (apiTokenInstance: string) => localStorage.setItem(storageKey.apiTokenInstance, apiTokenInstance),
}
