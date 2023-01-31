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

import { Discipline } from '~/models/discipline';

@Table({
  tableName: 'assignments'
})
export class Assignment extends Model {
  @IsUUID(4)
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column
  declare id: string;

  @Column
  declare name: string;

  @Column(DataType.FLOAT)
  declare grade: number;

  @ForeignKey(() => Discipline)
  @Column
  declare disciplineId: string;

  @BelongsTo(() => Discipline)
  declare discipline: Discipline;
}

export interface AssignmentDTO {
  id?: string;
  name: string;
  grade: number;
  disciplineId: string;
}
