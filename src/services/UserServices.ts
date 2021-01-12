import Users from '../models/Users';

import { getRepository } from 'typeorm';

interface Request {
  cpf: string;
  name: string;
  email: string;
  cadastur: string;
  phone: string;
  whatsapp: string;
}

class UserServices {
  public async execute({ cpf, name, email, cadastur, phone, whatsapp }: Request): Promise<Users> {
    const userRepository = getRepository(Users);

    const userExists = await userRepository.findOne({
      where: { cpf, email, cadastur }
    });

    if(userExists) {
      return userExists;
    }

    const user = await userRepository.create({
      cpf,
      name,
      email,
      cadastur,
      phone,
      whatsapp,
    });

    await userRepository.save(user);

    return user;

  }
}

export default UserServices;
