import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import Users from './Users';

@Entity('appointments')
class Appointments {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Users, users => users.appointments)
  @JoinColumn({ name: 'provider_id' })
  id_user_provider: Users;

  @Column()
  provider_id: string;

  @Column()
  date: string;

  @Column()
  hour: string;

  @Column()
  available: boolean;
}

export default Appointments;
