import IBook from "./interfaces/IBook";
import { BookModel } from "./models/BookSchema";

export default class BooksRepository{
    
    async createBook(book: IBook) {
        try {
            const newBook = new BookModel(book);
            await newBook.save();
        } catch(e) {
            console.error(e);
        }
    };
    
    async getBook(id: string) {
        try {
            return await BookModel.findById(id).select('-__v');
        } catch (e) {
            console.error(e);
        }
    };
    
    async getBooks() {
        try {
            return await BookModel.find().select('-__v');
        } catch (e) {
            console.error(e);
        }
    };
    
    async updateBook(id: string, book: IBook) {
        try {
            const oldBook = await BookModel.findByIdAndUpdate(id, book);
            return oldBook;
        } catch (e) {
            console.error(e);
        }
    };
    
    async deleteBook(id: string) {
        try {
            await BookModel.deleteOne({ _id: id });
        } catch (e) {
            console.error(e)
        }
    };
}