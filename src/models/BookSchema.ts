import { Schema, model } from 'mongoose';
import IBook from '../interfaces/IBook';

const BookSchema = new Schema<IBook>({
    title: {
        type: String,
        require: true,
    },
    description: {
        type: String,
        default: "",
    },
    authors: {
        type: String,
        default: "",
    },
    favorite: {
        type: String,
        default: "",
    },
    fileCover: {
        type: String,
        default: "",
    },
    fileName: {
        type: String,
        default: "",
    },
    fileBook: {
        type: String,
        default: "",
    }
});

export const BookModel = model('Book', BookSchema);