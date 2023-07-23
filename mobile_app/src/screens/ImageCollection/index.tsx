import React, {useState, useRef} from 'react';
import {Flex, Spinner, ScrollView, AlertDialog, Button} from 'native-base';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import useImageCollectionContext from '../../contexts/ImageCollection';
import type {ImageItemType} from '../../types';

import ImageItem from './ImageItem';

const ImageCollectionScreen = () => {
  const navigation = useNavigation();
  const route =
    useRoute<
      RouteProp<
        {ImageCollection: {load: (image: ImageItemType) => void}},
        'ImageCollection'
      >
    >();

  const {isLoading, images, deleteImage} = useImageCollectionContext();

  const {load} = route.params;

  const [imageKeyToRemove, setImageKeyToRemove] = useState('');

  const cancelRef = useRef(null);

  const handleDialogOpen = (key: string) => {
    setImageKeyToRemove(key);
  };

  const handleDialogClose = () => {
    setImageKeyToRemove('');
  };

  if (isLoading) {
    return (
      <Flex flex={1} justifyContent="center" alignItems="center">
        <Spinner />
      </Flex>
    );
  }

  return (
    <Flex flex={1}>
      <ScrollView flex={1}>
        {images.map(({data, key}, index) => (
          <Flex mt={4} key={index}>
            <ImageItem
              {...data}
              onPress={() => {
                load(data);
                navigation.goBack();
              }}
              onDeletePress={() => handleDialogOpen(key)}
            />
          </Flex>
        ))}
      </ScrollView>
      <AlertDialog
        leastDestructiveRef={cancelRef}
        isOpen={imageKeyToRemove !== ''}
        onClose={handleDialogClose}>
        <AlertDialog.Content>
          <AlertDialog.CloseButton />
          <AlertDialog.Header>Remove image from collection</AlertDialog.Header>
          <AlertDialog.Body>
            This will permanently remove image from collection.
          </AlertDialog.Body>
          <AlertDialog.Footer>
            <Button.Group space={2}>
              <Button
                variant="unstyled"
                colorScheme="coolGray"
                onPress={handleDialogClose}
                ref={cancelRef}>
                Cancel
              </Button>
              <Button
                colorScheme="danger"
                onPress={() => {
                  deleteImage(imageKeyToRemove);
                  handleDialogClose();
                }}>
                Remove
              </Button>
            </Button.Group>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
    </Flex>
  );
};

export default ImageCollectionScreen;
