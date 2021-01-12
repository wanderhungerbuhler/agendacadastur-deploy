import { Request, Response } from 'express';

import UserServices from '../services/UserServices';
import AppointmentsServices from '../services/AppointmentsServices';

import Mail from '../mail/mail';

class UserController {
  async create (request: Request, response: Response) {
    try {
      const {
        cpf,
        name,
        email,
        cadastur,
        phone,
        whatsapp,

        date,
        hour
      } = request.body;

      const createUser = new UserServices();

      const user = await createUser.execute({
        cpf,
        name,
        email,
        cadastur,
        phone,
        whatsapp
      });

      const createAppointments = new AppointmentsServices();

      const appointments = await createAppointments.execute({
        provider_id: user.id,
        date,
        hour,
        available: false
      });

      const success = response.json({ user, appointments });

      if(success) {
        Mail({
          name,
          email,
          cadastur,
          date,
          hour
        });
      }

      // // return response.json({
      // //   user,
      // //   appointments
      // // });

    } catch (err) {
      return response.status(400).json({ error: err.message });
    }

  }
}

export default UserController;
