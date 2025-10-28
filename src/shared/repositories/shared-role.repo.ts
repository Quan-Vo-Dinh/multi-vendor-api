import { Injectable } from '@nestjs/common'

import { RoleName } from 'src/shared/constants/role.constant'
import { PrismaService } from 'src/shared/services/prisma.service'

@Injectable()
export class SharedRoleRepository {
  private adminRoleId: number | null = null
  private sellerRoleId: number | null = null
  private customerRoleId: number | null = null

  private async getRole(roleName: string): Promise<number> {
    const role = await this.prismaService.role.findFirstOrThrow({
      where: { name: roleName },
    })
    return role.id
  }
  // role service mặc định khi được inject là singleton nên nó chỉ khởi tạo instance một lần trong vòng đời ứng dụng
  // nên việc cache clientRoleId trong RolesService là an toàn và hiệu quả
  // nếu RolesService không phải singleton, ta có thể sử dụng một cơ chế cache khác như Redis hoặc in-memory cache
  constructor(private readonly prismaService: PrismaService) {} // cache role id to avoid multiple db calls
  async getAdminRoleId() {
    if (this.adminRoleId) {
      return this.adminRoleId
    }
    this.adminRoleId = await this.getRole(RoleName.ADMIN)

    return this.adminRoleId
  }

  async getSellerRoleId() {
    if (this.sellerRoleId) {
      return this.sellerRoleId
    }
    this.sellerRoleId = await this.getRole(RoleName.SELLER)

    return this.sellerRoleId
  }

  async getCustomerRoleId() {
    if (this.customerRoleId) {
      return this.customerRoleId
    }
    this.customerRoleId = await this.getRole(RoleName.CUSTOMER)

    return this.customerRoleId
  }
}
