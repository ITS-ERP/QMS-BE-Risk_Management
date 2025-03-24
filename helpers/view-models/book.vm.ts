import { BookInputDTO, BookResultDTO } from '../dtos/book.dto';

export class BookInputVM {
  bookData: BookInputDTO;

  constructor(bookData: BookInputDTO) {
    this.bookData = bookData;
  }
}

export class BookResultVM {
  result: BookResultDTO;

  constructor(result: BookResultDTO) {
    this.result = result;
  }
}
