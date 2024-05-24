import { Wish, NewWish, EditWish, User } from '@competence-assistant/shared';
import { IWishesService, IWishesRepo } from '../domain';

import { Forbidden } from '../../../pkg/error';
import AuthService from '../../../pkg/auth/firebase';

export default class WishesService implements IWishesService {
  constructor(private wishesRepo: IWishesRepo, private authService: AuthService) {}

  async createWish(newWish: NewWish, userId: User['id']): Promise<Wish> {
    const wish = await this.wishesRepo.createWish(newWish, userId);
    return wish;
  }

  async getWishes(): Promise<Wish[]> {
    const wishes = await this.wishesRepo.getWishes();
    return wishes;
  }

  async editWish(editWish: EditWish, userId: User['id']): Promise<Wish> {
    const storedWish = await this.wishesRepo.getWishById(editWish.id);

    const canEdit = storedWish.userId === userId || (await this.authService.userIsAdmin(userId));

    if (!canEdit) {
      throw new Forbidden('user not authorized to edit request');
    }

    const wish = await this.wishesRepo.editWish(editWish);
    return wish;
  }

  async deleteWish(id: Wish['id'], userId: User['id']): Promise<void> {
    const storedWish = await this.wishesRepo.getWishById(id);

    const canDelete = storedWish.userId === userId || (await this.authService.userIsAdmin(userId));

    if (!canDelete) {
      throw new Forbidden('user not authorized to edit request');
    }

    await this.wishesRepo.deleteWish(id);
  }
}
