import { Wish, NewWish, EditWish } from '@competence-assistant/shared';
import { post, get, put, _delete } from './method';

export default {
  createWish: async (newWish: NewWish) => {
    return post<Wish, NewWish>('wishes', newWish);
  },
  getWishes: async () => {
    return get<Wish[]>(`wishes`);
  },
  editWish: async (editWish: EditWish) => {
    return put<Wish, EditWish>(`wishes/${editWish.id}`, editWish);
  },
  deleteWish: async (id: Wish['id']) => {
    return _delete<null, undefined>(`wishes/${id}`);
  },
};
