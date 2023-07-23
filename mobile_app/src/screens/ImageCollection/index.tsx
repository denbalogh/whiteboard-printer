import React, {useEffect, useState} from 'react';
import {Flex, Box, Spinner, ScrollView} from 'native-base';
// import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PointSize = 10;

const ImageItem = ({
  rows,
  cols,
  boardState,
}: {
  rows: number;
  cols: number;
  boardState: boolean[];
}) => {
  const getBoardIndex = (row: number, col: number) => {
    return row * cols + col;
  };

  return (
    <Flex flex={1} alignItems="center" backgroundColor="primary.50">
      <ScrollView horizontal={true} style={{height: rows * PointSize}}>
        <Flex direction="column">
          {[...Array(rows).keys()].map(i => (
            <Flex key={i} direction="row">
              {[...Array(cols).keys()].map(j => (
                <Box
                  key={`${i}-${j}`}
                  style={{
                    width: PointSize,
                    height: PointSize,
                  }}
                  backgroundColor={
                    boardState[getBoardIndex(i, j)]
                      ? 'primary.900'
                      : 'primary.100'
                  }
                />
              ))}
            </Flex>
          ))}
        </Flex>
      </ScrollView>
    </Flex>
  );
};

const ImageCollectionScreen = () => {
  //   const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  const [imageKeys, setImageKeys] = useState<string[]>([]);
  const [images, setImages] = useState<
    {
      rows: number;
      cols: number;
      boardState: boolean[];
    }[]
  >([]);

  const getAllKeys = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      setImageKeys(keys.filter(key => key.includes('image-')));
    } catch (e) {
      console.log(e);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllKeys();
  }, []);

  useEffect(() => {
    const getAllImages = async () => {
      try {
        const values = await AsyncStorage.multiGet(imageKeys);
        setImages(
          values
            // @ts-ignore
            .sort(
              // @ts-ignore
              ([keyA], [keyB]) =>
                parseInt(keyB.replace('image-', ''), 10) -
                parseInt(keyA.replace('image-', ''), 10),
            )
            // @ts-ignore
            .map(([_, val]) => JSON.parse(val as string)),
        );
        setIsLoading(false);
      } catch (e) {
        console.log(e);
        setIsLoading(false);
      }
    };

    getAllImages();
  }, [imageKeys]);

  if (isLoading) {
    return (
      <Flex flex={1} justifyContent="center" alignItems="center">
        <Spinner />
      </Flex>
    );
  }

  return (
    <ScrollView flex={1}>
      {images.map((image, index) => (
        <Flex mt={4} key={index}>
          <ImageItem {...image} />
        </Flex>
      ))}
    </ScrollView>
  );
};

export default ImageCollectionScreen;
