import React from 'react';
import {AlertDialog, Button} from 'native-base';

type Props = {
  isDialogOpen: boolean;
  handleDialogClose: () => void;
  saveImageToCollection: () => void;
  cancelRef: any;
};

const SaveToCollectionDialog = ({
  isDialogOpen,
  handleDialogClose,
  saveImageToCollection,
  cancelRef,
}: Props) => (
  <AlertDialog
    leastDestructiveRef={cancelRef}
    isOpen={isDialogOpen}
    onClose={handleDialogClose}>
    <AlertDialog.Content>
      <AlertDialog.CloseButton />
      <AlertDialog.Header>Save image to collection</AlertDialog.Header>
      <AlertDialog.Body>
        This will add image to collection for later use.
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
          <Button onPress={saveImageToCollection}>Save</Button>
        </Button.Group>
      </AlertDialog.Footer>
    </AlertDialog.Content>
  </AlertDialog>
);

export default SaveToCollectionDialog;
