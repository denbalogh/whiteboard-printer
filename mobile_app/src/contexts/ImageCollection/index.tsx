import React, {
  useState,
  useEffect,
  createContext,
  ReactNode,
  useContext,
} from 'react';
import type {ImageItemType, ImageCollectionItemType} from '../../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ImageCollectionContextType = {
  images: ImageCollectionItemType[];
  isLoading: boolean;
  saveImage: (image: ImageItemType, onSuccess: () => void) => void;
  deleteImage: (key: string) => void;
};

const ImageCollectionContext = createContext<ImageCollectionContextType>({
  images: [],
  saveImage: () => {},
  deleteImage: () => {},
  isLoading: true,
});

const ImageCollectionContextProvider = ({children}: {children: ReactNode}) => {
  const [images, setImages] = useState<ImageCollectionItemType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getImages = async (keys: string[]) => {
    try {
      const values = await AsyncStorage.multiGet(keys);
      setImages(
        values.map(([key, val]) => ({
          key,
          data: JSON.parse(val as string),
        })),
      );
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    const getAllKeys = async () => {
      try {
        const keys = await AsyncStorage.getAllKeys();
        const imageKeys = keys.filter(key => key.includes('image-'));
        await getImages(imageKeys);
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    };

    getAllKeys();
  }, []);

  const saveImage = async (image: ImageItemType, onSuccess: () => void) => {
    try {
      const jsonValue = JSON.stringify(image);
      const key = `image-${Date.now()}`;
      await AsyncStorage.setItem(key, jsonValue);
      setImages(prevImages => [{key, data: image}, ...prevImages]);
      onSuccess();
    } catch (e) {
      console.log(e);
    }
  };

  const deleteImage = async (key: string) => {
    try {
      await AsyncStorage.removeItem(key);
      setImages(prevImages => prevImages.filter(img => img.key !== key));
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <ImageCollectionContext.Provider
      value={{
        images,
        saveImage,
        isLoading,
        deleteImage,
      }}>
      {children}
    </ImageCollectionContext.Provider>
  );
};

export {ImageCollectionContextProvider};

export default () => useContext(ImageCollectionContext);
