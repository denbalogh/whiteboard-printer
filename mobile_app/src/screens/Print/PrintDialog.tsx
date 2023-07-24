import React, {useState} from 'react';
import {AlertDialog, Button, Flex} from 'native-base';

type Props = {
  isDialogOpen: boolean;
  handleDialogClose: () => void;
  print: () => void;
  cancelRef: any;
};

const PrintDialog = ({
  isDialogOpen,
  handleDialogClose,
  print,
  cancelRef,
}: Props) => {
  const [distance, setDistance] = useState<'1' | '2'>('2');

  return (
    <AlertDialog
      leastDestructiveRef={cancelRef}
      isOpen={isDialogOpen}
      onClose={handleDialogClose}>
      <AlertDialog.Content>
        <AlertDialog.CloseButton />
        <AlertDialog.Header>Start printing</AlertDialog.Header>
        <AlertDialog.Body>
          Choose distance between points:
          <Flex direction="row" mt={4}>
            <Button
              flex={1}
              mr={2}
              variant={distance === '1' ? 'subtle' : 'ghost'}
              onPress={() => setDistance('1')}>
              1 cm
            </Button>
            <Button
              flex={1}
              ml={2}
              variant={distance === '2' ? 'subtle' : 'ghost'}
              onPress={() => setDistance('2')}>
              2 cm
            </Button>
          </Flex>
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
            <Button onPress={print}>Start printing</Button>
          </Button.Group>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog>
  );
};

export default PrintDialog;
