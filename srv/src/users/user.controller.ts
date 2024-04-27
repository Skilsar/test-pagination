import { UserService } from './users.service';
import { Controller, Get, Logger, Query } from '@nestjs/common';
import {UsersResponseDto} from "./users.response.dto";

@Controller('users')
export class UserController {
  private readonly logger = new Logger(UserController.name);
  constructor(private userService: UserService) {}

  @Get()
  async getUsers(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ): Promise<{ users: UsersResponseDto[]; total: number }> {
    const parsedPage = parseInt(page, 10) || 1;
    const parsedLimit = parseInt(limit, 10) || 20;
    return this.userService.findAll(parsedPage, parsedLimit);
  }
}
