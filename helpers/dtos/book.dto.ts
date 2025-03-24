import { BookAttributes } from '../../infrastructure/models/book.model';

export interface BookInputDTO {
  title: string;
  author: string;
  isbn: string;
  publication_date?: Date;
  available_copies: number;
}

export interface BookResultDTO extends BookAttributes {}
