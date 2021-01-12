import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  JoinColumn,
} from 'typeorm';

import Appointments from './Appointments';

@Entity('users')
class Users {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(() => Appointments, appointments => appointments.id_user_provider)
  @JoinColumn({ name: 'provider_id' })
  appointments: Appointments;

  @Column()
  cpf: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  cadastur: string;

  @Column()
  phone: string;

  @Column()
  whatsapp: string;
}

export default Users;
