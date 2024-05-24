import { Wish, NewWish, EditWish, User } from '@competence-assistant/shared';

export interface IWishesRepo {
  createWish(wish: NewWish, userId: User['id']): Promise<Wish>;
  getWishes(): Promise<Wish[]>;
  getWishById(id: Wish['id']): Promise<Wish>;
  editWish(wish: EditWish): Promise<Wish>;
  deleteWish(id: Wish['id']): Promise<void>;
}

export interface IWishesService {
  createWish(wish: NewWish, userId: User['id']): Promise<Wish>;
  getWishes(): Promise<Wish[]>;
  editWish(wish: EditWish, userId: User['id']): Promise<Wish>;
  deleteWish(id: Wish['id'], userId: User['id']): Promise<void>;
}
