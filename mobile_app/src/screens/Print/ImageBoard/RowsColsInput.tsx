import {Flex, Input, Text} from 'native-base';
import React, {useState} from 'react';

const RowsColsInput = ({
  rows,
  cols,
  onChange,
}: {
  rows: number;
  cols: number;
  onChange: (rows: number, cols: number) => void;
}) => {
  const [editedRows, setEditedRows] = useState<string>(`${rows}`);
  const [editedCols, setEditedCols] = useState<string>(`${cols}`);

  const handleSubmit = () => {
    const intRows = parseInt(editedRows, 10);
    const intCols = parseInt(editedCols, 10);
    if (isNaN(intRows) || isNaN(intCols)) {
      return;
    }

    onChange(intRows, intCols);
  };

  return (
    <Flex direction="row" p={2}>
      <Flex flex={1} mr={1}>
        <Text>Rows</Text>
        <Input
          size="md"
          placeholder="Rows"
          type="text"
          value={`${editedRows}`}
          onChangeText={val => setEditedRows(val)}
          keyboardType="numeric"
          onSubmitEditing={handleSubmit}
        />
      </Flex>
      <Flex flex={1} ml={1}>
        <Text>Cols</Text>
        <Input
          size="md"
          placeholder="Cols"
          type="text"
          value={`${editedCols}`}
          onChangeText={val => setEditedCols(val)}
          keyboardType="numeric"
          onSubmitEditing={handleSubmit}
        />
      </Flex>
    </Flex>
  );
};

export default RowsColsInput;
