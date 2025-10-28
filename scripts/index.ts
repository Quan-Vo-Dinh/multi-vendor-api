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
      where: { name: RoleName.SUPER_ADMIN },
    })

    if (!adminRole) {
      throw new Error('Admin role not found after creation')
    }

    const sellerRole = await prisma.role.findFirst({
      where: { name: RoleName.SELLER },
    })

    if (!sellerRole) {
      throw new Error('Seller role not found after creation')
    }

    const customerRole = await prisma.role.findFirst({
      where: { name: RoleName.CUSTOMER },
    })

    if (!customerRole) {
      throw new Error('Customer role not found after creation')
    }

    // ============================================================
    // Create Admin User
    // ============================================================
    console.log('\n👤 Creating admin user...')
    const existingAdmin = await prisma.user.findFirst({
      where: { email: envConfig.ADMIN_EMAIL },
    })

    let adminUsersCreated = 0
    if (!existingAdmin) {
      const hashedPassword = await hashingService.hash(envConfig.ADMIN_PASSWORD)

      await prisma.user.create({
        data: {
          email: envConfig.ADMIN_EMAIL,
          name: envConfig.ADMIN_NAME,
          password: hashedPassword,
          phoneNumber: envConfig.ADMIN_PHONE_NUMBER,
          roleId: adminRole.id,
          status: 'ACTIVE',
        },
      })
      adminUsersCreated++
      console.log(`✅ Created admin user: ${envConfig.ADMIN_EMAIL}`)
    } else {
      console.log(`⚠️  Admin user already exists: ${envConfig.ADMIN_EMAIL}`)
    }

    // ============================================================
    // Create Seller User (Hard-coded)
    // ============================================================
    console.log('\n🏪 Creating seller user...')
    const sellerEmail = 'seller@gmail.com'
    const existingSeller = await prisma.user.findFirst({
      where: { email: sellerEmail },
    })

    let sellerUsersCreated = 0
    if (!existingSeller) {
      const hashedPassword = await hashingService.hash('quanseller')

      await prisma.user.create({
        data: {
          email: sellerEmail,
          name: 'John Seller',
          password: hashedPassword,
          phoneNumber: '0987654321',
          roleId: sellerRole.id,
          status: 'ACTIVE',
        },
      })
      sellerUsersCreated++
      console.log(`✅ Created seller user: ${sellerEmail}`)
    } else {
      console.log(`⚠️  Seller user already exists: ${sellerEmail}`)
    }

    // ============================================================
    // Create Customer User (Hard-coded)
    // ============================================================
    console.log('\n🛒 Creating customer user...')
    const customerEmail = 'customer@example.com'
    const existingCustomer = await prisma.user.findFirst({
      where: { email: customerEmail },
    })

    let customerUsersCreated = 0
    if (!existingCustomer) {
      const hashedPassword = await hashingService.hash('customer123!')

      await prisma.user.create({
        data: {
          email: customerEmail,
          name: 'Jane Customer',
          password: hashedPassword,
          phoneNumber: '0123456789',
          roleId: customerRole.id,
          status: 'ACTIVE',
        },
      })
      customerUsersCreated++
      console.log(`✅ Created customer user: ${customerEmail}`)
    } else {
      console.log(`⚠️  Customer user already exists: ${customerEmail}`)
    }

    console.log('\n🎉 Seed completed successfully!')
    console.log(`📊 Summary:`)
    console.log(`   - Roles created: ${rolesCreated}`)
    console.log(`   - Admin users created: ${adminUsersCreated}`)
    console.log(`   - Seller users created: ${sellerUsersCreated}`)
    console.log(`   - Customer users created: ${customerUsersCreated}`)

    return {
      rolesCreated,
      adminUsersCreated,
      sellerUsersCreated,
      customerUsersCreated,
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
  .then(() => {
    console.log('\n✨ Seeding process completed')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 Seeding process failed:', error)
    process.exit(1)
  })
