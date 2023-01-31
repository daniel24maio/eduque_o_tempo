import {
  Table,
  Column,
  Model,
  PrimaryKey,
  IsUUID,
  Default,
  DataType,
  ForeignKey,
  BelongsTo
} from 'sequelize-typescript';

import { User } from '~/models/user';

@Table({
  tableName: 'todos'
})
export class Todo extends Model {
  @IsUUID(4)
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column
  declare id: string;

  @Column
  declare done: boolean;

  @Column(DataType.TEXT)
  declare message: string;

  @ForeignKey(() => User)
  @Column
  declare userId: string;

  @BelongsTo(() => User)
  declare user: User;
}

export interface TodoDTO {
  id?: string;
  done: boolean;
  userId: string;
  message: string;
}
