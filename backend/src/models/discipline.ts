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
  tableName: 'discipline'
})
export class Discipline extends Model {
  @IsUUID(4)
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column
  declare id: string;

  @Column
  declare name: string;

  @ForeignKey(() => User)
  @Column
  declare userId: string;

  @BelongsTo(() => User)
  declare user: User;
}

export interface DisciplineDTO {
  id?: string;
  name: string;
  userId: string;
}
