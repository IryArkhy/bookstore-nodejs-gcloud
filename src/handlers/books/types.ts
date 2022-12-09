export type CreateBookReqBody = {
  title: string;
  asset: string;
  authorID: string;
  description: string;
  genres: string[];
  price: number;
  year: number;
};

export type GetBooksReqQuery = {
  offset: string;
  limit: string;
  authorID: string;
  genre: string;
  year: string;
};

export type UpdateBookReqBody = {
  authorID: string;
  price?: number;
  title?: string;
  description?: string;
};

export type DeleteBookReqBody = {
  authorID: string;
};
