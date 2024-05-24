import { Wish, NewWish, EditWish } from '@competence-assistant/shared';
import { IWishesRepo } from '../domain';
import crypto from 'crypto';
import { Sql } from 'postgres';

class WishesRepo implements IWishesRepo {
  constructor(private sql: Sql) {}

  async createWish(newWish: NewWish, userId: string): Promise<Wish> {
    const wishes = await this.sql<Wish[]>`
      INSERT INTO wishes (id, name, description, type, level, user_id)
      VALUES(
        ${crypto.randomUUID()},
        ${newWish.name},
        ${newWish.description},
        ${newWish.type},
        ${newWish.level},
        ${userId}
      )
      RETURNING
        id,
        name,
        description,
        type,
        level,
        created_at as "createdAt",
        updated_at as "updatedAt"`;

    return wishes[0];
  }

  async getWishes(): Promise<Wish[]> {
    const wishes = await this.sql<Wish[]>`
      SELECT
        id,
        name,
        description,
        type,
        level,
        user_id AS "userId",
        created_at AS "createdAt",
        updated_at AS "updatedAt"
      FROM
        wishes
      ORDER BY created_at ASC
    `;

    return wishes;
  }

  async getWishById(id: Wish['id']): Promise<Wish> {
    const wishes = await this.sql<Wish[]>`
      SELECT
        id,
        name,
        description,
        type,
        level,
        user_id AS "userId",
        created_at AS "createdAt",
        updated_at AS "updatedAt"
      FROM
        wishes
      WHERE
        wishes.id = ${id}
    `;

    return wishes[0];
  }

  async editWish(wish: EditWish): Promise<Wish> {
    const wishes = await this.sql<Wish[]>`
      UPDATE wishes
      SET
        name = ${wish.name},
        description = ${wish.description},
        type = ${wish.type},
        level = ${wish.level},
        updated_at = ${new Date()}
      WHERE wishes.id = ${wish.id}
      RETURNING
        id,
        name,
        description,
        type,
        level,
        created_at AS "createdAt",
        updated_at AS "updatedAt"
    `;

    return wishes[0];
  }

  async deleteWish(id: Wish['id']): Promise<void> {
    await this.sql`
      DELETE FROM wishes
      WHERE id = ${id}
    `;
  }
}

export default WishesRepo;
