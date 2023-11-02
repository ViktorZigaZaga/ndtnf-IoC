import 'reflect-metadata';
import { Container } from 'inversify';
import BooksRepository from './BooksRepository';

const myCcontainer = new Container();
myCcontainer.bind(BooksRepository).toSelf();

export { myCcontainer };