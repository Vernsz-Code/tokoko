export const LocalStoragePusher = (namespace) => {
    const getKey = (key) => {
        return `${namespace}_${key}`;
    };

    const setItem = (key, value) => {
        try {
            if (window.localStorage) {
                window.localStorage.setItem(getKey(key), JSON.stringify(value));
            } else {
                console.error('LocalStorage not supported.');
            }
        } catch (err) {
            console.error(`Error setting localStorage item: ${err.message}`);
        }
    };

    const getItem = (key) => {
        try {
            if (window.localStorage) {
                const item = window.localStorage.getItem(getKey(key));
                return item ? JSON.parse(item) : undefined;
            } else {
                console.error('LocalStorage not supported.');
            }
        } catch (err) {
            console.error(`Error getting localStorage item: ${err.message}`);
        }
    };

    const removeItem = (key) => {
        try {
            if (window.localStorage) {
                window.localStorage.removeItem(getKey(key));
            } else {
                console.error('LocalStorage not supported.');
            }
        } catch (err) {
            console.error(`Error removing localStorage item: ${err.message}`);
        }
    };

    return { setItem, getItem, removeItem };
};
