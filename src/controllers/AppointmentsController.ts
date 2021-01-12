import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import Appointments from '../models/Appointments';

import AppointmentsServices from '../services/AppointmentsServices';

class AppointmentsController {
  async index(request: Request, response: Response) {
    const { date } = request.query;

    const appointmentsRepository = getRepository(Appointments);

    const findAppointmentsExists = await appointmentsRepository.find({
      where: { date, available: true },
    });

    return response.json(findAppointmentsExists);
  }

  async show(request: Request, response: Response) {
    const { date } = request.body;

    const appointmentsRepository = getRepository(Appointments);

    const findAppointmentsExistsAndAreUnavailable = await appointmentsRepository.find({
      relations: ['id_user_provider'],
      where: { date, available: false }
    });

    const usersAppointments = findAppointmentsExistsAndAreUnavailable.map(user => {
      return user;
    });

    const users = usersAppointments.map(user => {
      return {
        nome: user.id_user_provider.name,
        telefone: user.id_user_provider.phone,
        whatsapp: user.id_user_provider.whatsapp,
        data_agendamento: user.date,
        hora_agendamento: user.hour
      }
    });

    return response.json(users);
  }

  async create(request: Request, response: Response) {
    try {
      const { date, hour, available } = request.body;

      const createAppointments = new AppointmentsServices();

      const appointments = await createAppointments.execute({
        date,
        hour,
        available,
      });

      return response.status(200).json(appointments);
    } catch (err) {
      return response.status(400).json({ error: err.message });
    }
  }
}

export default AppointmentsController;
