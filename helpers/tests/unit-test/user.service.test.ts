import { Request } from 'express';
import { UserService } from '../../../business-layer/services/user.service';
import { UserRepository } from '../../../data-access/repositories/user.repository';
import { UserAttributes } from '../../../infrastructure/models/user.model';
import { Model } from 'sequelize';
import { UserInputVM } from '../../view-models/user.vm';
import { RoleUser } from '../../enum/roleUser.enum';

jest.mock('../../../data-access/repositories/user.repository');

describe('UserService', () => {
  let userService: UserService;
  let req: Partial<Request>;
  let createdUser: Model<UserAttributes>;

  beforeEach(() => {
    userService = new UserService();
    req = {};
  });

  describe('findAllUsers', () => {
    it('should return all users', async () => {
      const mockUsers = [
        {
          toJSON: () => ({
            pkid: 1,
            username: 'johndoe',
            full_name: 'John Doe',
            email: 'john.doe@example.com',
            role: 'borrower',
            password: 'password123',
            tenant_id: null,
            created_by: 'system',
            created_date: new Date('2024-07-15T14:49:59.000Z'),
            created_host: 'localhost',
            updated_by: null,
            updated_date: null,
            updated_host: null,
            is_deleted: null,
            deleted_by: null,
            deleted_date: null,
            deleted_host: null,
          }),
        },
        {
          toJSON: () => ({
            pkid: 2,
            username: 'janedoe',
            full_name: 'Jane Doe',
            email: 'jane.doe@example.com',
            role: 'staff',
            password: 'password123',
            tenant_id: null,
            created_by: 'system',
            created_date: new Date('2024-07-15T14:49:59.000Z'),
            created_host: 'localhost',
            updated_by: null,
            updated_date: null,
            updated_host: null,
            is_deleted: null,
            deleted_by: null,
            deleted_date: null,
            deleted_host: null,
          }),
        },
      ] as unknown as Model<UserAttributes>[];

      (UserRepository.prototype.findAll as jest.Mock).mockResolvedValue(
        mockUsers,
      );

      const result = await userService.findAllUsers(req as Request);
      expect(result.map((user) => user.toJSON())).toEqual(
        mockUsers.map((user) => user.toJSON()),
      );
    });
  });

  describe('findUserByID', () => {
    it('should return a user by id', async () => {
      const mockUser = {
        toJSON: () => ({
          pkid: 2,
          username: 'janedoe',
          full_name: 'Jane Doe',
          email: 'jane.doe@example.com',
          role: 'staff',
          password: 'password123',
          tenant_id: null,
          created_by: 'system',
          created_date: new Date('2024-07-15T14:49:59.000Z'),
          created_host: 'localhost',
          updated_by: null,
          updated_date: null,
          updated_host: null,
          is_deleted: null,
          deleted_by: null,
          deleted_date: null,
          deleted_host: null,
        }),
        _attributes: {}, // Mocking other properties of the Sequelize model
        _creationAttributes: {},
      } as unknown as Model<UserAttributes>;

      (UserRepository.prototype.findByID as jest.Mock).mockResolvedValue(
        mockUser,
      );

      const result = await userService.findUserByID(req as Request, 2);
      expect(result?.toJSON()).toEqual(mockUser.toJSON());
    });
  });
});
