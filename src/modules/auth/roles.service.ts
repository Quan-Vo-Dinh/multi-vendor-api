import { Injectable } from '@nestjs/common'

import { RoleName } from 'src/shared/constants/role.constant'
import { PrismaService } from 'src/shared/services/prisma.service'

@Injectable()
export class RolesService {
  private clientRoleId: number | null = null
  // role service mặc định khi được inject là singleton nên nó chỉ khởi tạo instance một lần trong vòng đời ứng dụng
  // nên việc cache clientRoleId trong RolesService là an toàn và hiệu quả
  // nếu RolesService không phải singleton, ta có thể sử dụng một cơ chế cache khác như Redis hoặc in-memory cache
  constructor(private readonly prismaService: PrismaService) {} // cache role id to avoid multiple db calls
  async getClientRoleId() {
    if (this.clientRoleId) {
      return this.clientRoleId
    }
    const role = await this.prismaService.role.findFirstOrThrow({
      where: { name: RoleName.SELLER },
    })
    this.clientRoleId = role.id
    return this.clientRoleId
  }
}
