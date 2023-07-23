export type ImageItemType = {
  rows: number;
  cols: number;
  boardState: boolean[];
};

export type ImageCollectionItemType = {
  key: string;
  data: ImageItemType;
};
