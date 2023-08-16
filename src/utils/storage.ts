import browser from "webextension-polyfill";
export interface LocalStorage {
    options?: LocalStorageOptions
}

export interface LocalStorageOptions {
    hasOverlay: boolean
}

export type LocalStorageKeys = keyof LocalStorage

export async function setStoredOptions(options: LocalStorageOptions): Promise<void> {
    const vals: LocalStorage = {
      options,
    }
    try {
        await browser.storage.local.set(vals);
      } catch (error) {
        console.error('Error saving options:', error);
      }
  }

  export async function getStoredOptions(): Promise<LocalStorageOptions | any> {
    const keys: LocalStorageKeys[] = ['options']
    try {
        const options = await browser.storage.local.get(keys);
        return options;
      } catch (error) {
        console.error('Error retrieving options:', error);
        return null;
      }
  }