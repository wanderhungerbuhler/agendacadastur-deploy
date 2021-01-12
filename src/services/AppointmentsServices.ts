import Appointments from '../models/Appointments';
import Users from '../models/Users';

import { getRepository } from 'typeorm';

interface Request {
  provider_id?: string;
  date: string;
  hour: string;
  available: boolean;
}

class AppointmentsServices {
  public async execute({ provider_id, date, hour, available }: Request): Promise<Appointments> {
    const appointmentsRepository = getRepository(Appointments);
    const userRepository = getRepository(Users);

    const appointmentsExists = await appointmentsRepository.findOne({
      where: { date, hour }
    });

    // if(appointmentsExists) {
    //   throw new Error('Já existe agendamento cadastrado neste horário');
    // }

    const userExists = await userRepository.findOne({
      relations: ['appointments'],
      where: { id: provider_id }
    });

    if(appointmentsExists) {
      appointmentsExists.provider_id = userExists?.id as string;
      appointmentsExists.date = date;
      appointmentsExists.hour = hour;
      appointmentsExists.available = false;

      await appointmentsRepository.save(appointmentsExists);

      return appointmentsExists;
    }

    const appointments = await appointmentsRepository.create({
      provider_id,
      date,
      hour,
      available
    });

    await appointmentsRepository.save(appointments);

    return appointments;
  }
}

export default AppointmentsServices;
