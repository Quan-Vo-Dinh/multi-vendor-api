import { resolve } from 'path'

import { config } from 'dotenv'

import { validateEnv } from 'src/shared/config'
import { RoleName } from 'src/shared/constants/role.constant'
import { HashingService } from 'src/shared/services/hashing.service'
import { PrismaService } from 'src/shared/services/prisma.service'

// Load environment variables
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env'
config({ path: resolve(process.cwd(), envFile) })

// Validate environment variables
const envConfig = validateEnv(process.env)

const prisma = new PrismaService()
const hashingService = new HashingService()

const main = async () => {
  await prisma.$connect()

  try {
    console.log('🌱 Starting seed data...')

    // Seed roles first
    const rolesData = [
      {
        name: RoleName.SUPER_ADMIN,
        description: 'Super administrator with full system access',
        isActive: true,
      },
      {
        name: RoleName.ADMIN,
        description: 'Administrator with management access',
        isActive: true,
      },
      {
        name: RoleName.SELLER,
        description: 'Seller role for shop owners',
        isActive: true,
      },
      {
        name: RoleName.CUSTOMER,
        description: 'Regular customer role',
        isActive: true,
      },
    ]

    let rolesCreated = 0
    for (const roleData of rolesData) {
      const existingRole = await prisma.role.findFirst({
        where: { name: roleData.name },
      })

      if (!existingRole) {
        await prisma.role.create({
          data: roleData,
        })
        rolesCreated++
        console.log(`✅ Created role: ${roleData.name}`)
      } else {
        console.log(`⚠️  Role already exists: ${roleData.name}`)
      }
    }

    // Get admin role for user creation
    const adminRole = await prisma.role.findFirst({
      where: { name: 'super_admin' },
    })

    if (!adminRole) {
      throw new Error('Admin role not found after creation')
    }

    const existingAdmin = await prisma.user.findFirst({
      where: { email: envConfig.ADMIN_EMAIL },
    })

    let adminUsersCreated = 0
    if (!existingAdmin) {
      const adminEmail = envConfig.ADMIN_EMAIL
      const adminName = envConfig.ADMIN_NAME
      const adminPhoneNumber = envConfig.ADMIN_PHONE_NUMBER
      const adminPassword = envConfig.ADMIN_PASSWORD

      const hashedPassword = await hashingService.hash(adminPassword)

      await prisma.user.create({
        data: {
          email: adminEmail,
          name: adminName,
          password: hashedPassword,
          phoneNumber: adminPhoneNumber,
          roleId: adminRole.id,
        },
      })
      adminUsersCreated++
      console.log('✅ Created admin user')
    } else {
      console.log('⚠️  Admin user already exists')
    }

    console.log('\n🎉 Seed completed successfully!')
    console.log(`📊 Summary:`)
    console.log(`   - Roles created: ${rolesCreated}`)
    console.log(`   - Admin users created: ${adminUsersCreated}`)

    return {
      rolesCreated,
      adminUsersCreated,
      success: true,
    }
  } catch (error) {
    console.error('❌ Error during seeding:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .then((result) => {
    console.log('\n✨ Seeding process completed')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 Seeding process failed:', error)
    process.exit(1)
  })
