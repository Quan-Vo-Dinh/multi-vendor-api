import * as fs from 'fs'
import * as path from 'path'
import { resolve } from 'path'

import { HTTPMethod } from '@prisma/client'
import { config } from 'dotenv'

import { validateEnv } from 'src/shared/config'
import { PrismaService } from 'src/shared/services/prisma.service'

// Load environment variables
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env'
config({ path: resolve(process.cwd(), envFile) })

// Validate environment variables
validateEnv(process.env)

const prisma = new PrismaService()

// ============================================================
// DYNAMIC ROUTE SCANNER
// ============================================================

interface RouteDefinition {
  path: string
  method: HTTPMethod
  controller: string
  module: string
  handlerName: string
}

/**
 * Convert method name to human-readable action
 * Examples: findAll -> View, create -> Create, update -> Update
 */
function methodNameToAction(methodName: string, httpMethod: HTTPMethod): string {
  const lowerMethod = methodName.toLowerCase()

  // Common patterns
  if (lowerMethod.includes('findall') || lowerMethod.includes('getall')) return 'View'
  if (lowerMethod.includes('findone') || lowerMethod.includes('getone')) return 'View Detail'
  if (lowerMethod.includes('create')) return 'Create'
  if (lowerMethod.includes('update')) return 'Update'
  if (lowerMethod.includes('delete') || lowerMethod.includes('remove')) return 'Delete'
  if (lowerMethod.includes('upload')) return 'Upload'
  if (lowerMethod.includes('download')) return 'Download'
  if (lowerMethod.includes('export')) return 'Export'
  if (lowerMethod.includes('import')) return 'Import'
  if (lowerMethod.includes('activate')) return 'Activate'
  if (lowerMethod.includes('deactivate')) return 'Deactivate'
  if (lowerMethod.includes('setup')) return 'Setup'
  if (lowerMethod.includes('verify')) return 'Verify'
  if (lowerMethod.includes('login')) return 'Login'
  if (lowerMethod.includes('logout')) return 'Logout'
  if (lowerMethod.includes('register')) return 'Register'
  if (lowerMethod.includes('forgot')) return 'Forgot Password'
  if (lowerMethod.includes('reset')) return 'Reset Password'
  if (lowerMethod.includes('refresh')) return 'Refresh Token'
  if (lowerMethod.includes('sendotp')) return 'Send OTP'

  // Fallback to HTTP method mapping
  switch (httpMethod) {
    case 'GET':
      return 'View'
    case 'POST':
      return 'Create'
    case 'PUT':
    case 'PATCH':
      return 'Update'
    case 'DELETE':
      return 'Delete'
    default:
      return 'Access'
  }
}

/**
 * Generate human-readable permission name from route
 */
function generatePermissionName(route: RouteDefinition): string {
  const action = methodNameToAction(route.handlerName, route.method)

  // Special case for root controller routes
  if (!route.path.includes('/') || route.path === '/') {
    return action
  }

  const segments = route.path.split('/').filter((s) => s && !s.startsWith(':'))

  // For base routes like GET /languages -> "View Languages"
  if (segments.length === 1) {
    // Capitalize first letter
    const moduleName = segments[0].charAt(0).toUpperCase() + segments[0].slice(1)
    return `${action} ${moduleName}`
  }

  // For detail routes like GET /languages/:id -> "View Language Detail"
  if (route.path.includes(':') && action === 'View') {
    const moduleName = segments[0].charAt(0).toUpperCase() + segments[0].slice(1)
    // Singularize (simple: remove trailing 's')
    const singular = moduleName.endsWith('s') ? moduleName.slice(0, -1) : moduleName
    return `${action} ${singular} Detail`
  }

  // For sub-resources like POST /auth/2fa/setup -> "Setup Two Factor Auth"
  const subPath = segments.slice(1).join(' ')
  if (subPath) {
    const formattedSubPath = subPath
      .replace(/2fa/gi, 'Two Factor Auth')
      .replace(/otp/gi, 'OTP')
      .replace(/-/g, ' ')
      .replace(/\//g, ' ')
      .split(' ')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ')

    return `${action} ${formattedSubPath}`
  }

  return `${action} ${route.module}`
}

/**
 * Generate description for permission
 */
function generateDescription(route: RouteDefinition, permissionName: string): string {
  return `Allows to ${permissionName.toLowerCase()} - ${route.method} ${route.path}`
}

/**
 * Scan a controller file and extract routes
 */
function scanController(filePath: string): RouteDefinition[] {
  const routes: RouteDefinition[] = []
  const content = fs.readFileSync(filePath, 'utf-8')

  // Extract controller decorator path
  const controllerMatch = content.match(/@Controller\(['"]([^'"]*)['"]\)/)
  const basePath = controllerMatch ? controllerMatch[1] : ''

  // Extract module name from file path or controller name
  const pathParts = filePath.split(path.sep)
  const moduleIndex = pathParts.indexOf('modules')
  let moduleName = 'System'

  if (moduleIndex !== -1 && pathParts[moduleIndex + 1]) {
    moduleName = pathParts[moduleIndex + 1].charAt(0).toUpperCase() + pathParts[moduleIndex + 1].slice(1)
  } else if (basePath) {
    moduleName = basePath.charAt(0).toUpperCase() + basePath.slice(1)
  }

  // Match all HTTP method decorators with their handlers
  // This regex matches:
  // @Get() or @Get('path') or @Get(':id')
  // followed by possible decorators and the method name
  const methodRegex = /@(Get|Post|Put|Delete|Patch)\((?:['"]([^'"]*)['"]\))?\s*[\s\S]*?(\w+)\s*\(/gi
  let match

  while ((match = methodRegex.exec(content)) !== null) {
    const [, httpMethod, routePath, handlerName] = match
    const method = httpMethod.toUpperCase() as HTTPMethod

    // Build full path
    let fullPath = '/'
    if (basePath) {
      fullPath += basePath
    }
    if (routePath) {
      fullPath += fullPath.endsWith('/') ? routePath : `/${routePath}`
    }

    // Clean up path
    fullPath = fullPath.replace(/\/+/g, '/') // Remove double slashes
    if (fullPath !== '/' && fullPath.endsWith('/')) {
      fullPath = fullPath.slice(0, -1) // Remove trailing slash
    }

    routes.push({
      path: fullPath,
      method,
      controller: path.basename(filePath, '.ts'),
      module: moduleName,
      handlerName,
    })
  }

  return routes
}

/**
 * Scan all controllers in the project
 */
function scanAllControllers(): RouteDefinition[] {
  const allRoutes: RouteDefinition[] = []
  const srcPath = path.join(__dirname, '..', 'src')

  function scanDirectory(dir: string) {
    const items = fs.readdirSync(dir)

    for (const item of items) {
      const fullPath = path.join(dir, item)
      const stat = fs.statSync(fullPath)

      if (stat.isDirectory()) {
        scanDirectory(fullPath)
      } else if (item.endsWith('.controller.ts')) {
        const routes = scanController(fullPath)
        allRoutes.push(...routes)
      }
    }
  }

  scanDirectory(srcPath)
  return allRoutes
}

/**
 * Filter routes that should be excluded from permissions
 */
function shouldExcludeRoute(route: RouteDefinition): boolean {
  const excludedPatterns = [
    /^\/$/, // Root path (/)
    /^\/health$/, // Health check
    /^\/metrics$/, // Metrics
    /^\/favicon/, // Favicon
  ]

  // Also exclude if it's the AppController GET / route
  if (route.controller === 'app.controller' && route.path === '/') {
    return true
  }

  return excludedPatterns.some((pattern) => pattern.test(route.path))
}

/**
 * Generate permissions from scanned routes
 */
function generatePermissionsFromRoutes(): Array<{
  name: string
  description: string
  path: string
  method: HTTPMethod
  module: string
}> {
  console.log('🔍 Scanning controllers for routes...\n')

  const routes = scanAllControllers()
  const filteredRoutes = routes.filter((route) => !shouldExcludeRoute(route))

  console.log(`📋 Found ${filteredRoutes.length} routes to convert to permissions:\n`)

  const permissions = filteredRoutes.map((route) => {
    const name = generatePermissionName(route)
    const description = generateDescription(route, name)

    console.log(`  ✓ ${route.method.padEnd(6)} ${route.path.padEnd(45)} → ${name}`)

    return {
      name,
      description,
      path: route.path,
      method: route.method,
      module: route.module,
    }
  })

  console.log('\n')
  return permissions
}

// ============================================================
// TWO-WAY SYNC LOGIC
// ============================================================

/**
 * Create a unique key for route comparison
 */
function createRouteKey(path: string, method: HTTPMethod): string {
  return `${method}:${path}`
}

async function main() {
  try {
    console.log('🔄 Starting TWO-WAY permission synchronization...\n')
    console.log('='.repeat(70))
    console.log('\n')

    // Step 1: Find admin user to set as creator
    const adminUser = await prisma.user.findFirst({
      where: {
        role: {
          name: {
            in: ['super_admin', 'admin'],
          },
        },
      },
    })

    if (!adminUser) {
      console.error('❌ Admin user not found. Please create an admin user first.')
      process.exit(1)
    }

    console.log(`✅ Found admin user: ${adminUser.email}\n`)

    // Step 2: Scan all routes from controllers
    const scannedPermissions = generatePermissionsFromRoutes()

    // Create a Map of route keys from scanned permissions
    const scannedRouteMap = new Map(scannedPermissions.map((p) => [createRouteKey(p.path, p.method), p]))

    // Step 3: Get all existing permissions from database (including soft-deleted ones)
    console.log('📂 Fetching existing permissions from database...\n')
    const existingPermissions = await prisma.permission.findMany({
      select: {
        id: true,
        name: true,
        path: true,
        method: true,
        module: true,
        description: true,
        deletedAt: true,
      },
    })

    console.log(`   Found ${existingPermissions.length} existing permissions in database\n`)

    // Separate active and soft-deleted permissions
    const activePermissions = existingPermissions.filter((p) => p.deletedAt === null)
    const softDeletedPermissions = existingPermissions.filter((p) => p.deletedAt !== null)

    console.log(`   - Active: ${activePermissions.length}`)
    console.log(`   - Soft-deleted: ${softDeletedPermissions.length}\n`)

    // Create a Map of route keys from database permissions (only active ones for comparison)
    const dbRouteMap = new Map(activePermissions.map((p) => [createRouteKey(p.path, p.method), p]))

    // ============================================================
    // PHASE 1: CLEANUP - Remove obsolete permissions (including soft-deleted)
    // ============================================================
    console.log('='.repeat(70))
    console.log('🧹 PHASE 1: CLEANUP - Removing obsolete permissions')
    console.log('='.repeat(70))
    console.log('\n')

    const permissionsToDelete: typeof existingPermissions = []

    // Add active permissions that no longer have routes in app
    for (const [routeKey, dbPermission] of dbRouteMap) {
      if (!scannedRouteMap.has(routeKey)) {
        permissionsToDelete.push(dbPermission)
      }
    }

    // Add ALL soft-deleted permissions (clean them up completely)
    permissionsToDelete.push(...softDeletedPermissions)

    let deletedCount = 0
    let deleteErrorCount = 0

    if (permissionsToDelete.length > 0) {
      console.log(`⚠️  Found ${permissionsToDelete.length} permissions to remove:\n`)
      console.log(`   - Obsolete (no longer in app): ${permissionsToDelete.length - softDeletedPermissions.length}`)
      console.log(`   - Soft-deleted (cleanup): ${softDeletedPermissions.length}\n`)

      for (const permission of permissionsToDelete) {
        try {
          await prisma.permission.delete({
            where: { id: permission.id },
          })

          const status = permission.deletedAt ? '(was soft-deleted)' : '(obsolete route)'
          console.log(`   🗑️  Hard deleted: ${permission.name} (${permission.method} ${permission.path}) ${status}`)
          deletedCount++
        } catch (error) {
          console.error(`   ❌ Error deleting "${permission.name}":`, error)
          deleteErrorCount++
        }
      }

      console.log(`\n✅ Cleanup completed: ${deletedCount} deleted, ${deleteErrorCount} errors\n`)
    } else {
      console.log('✨ No obsolete permissions found. Database is clean!\n')
    }

    // ============================================================
    // PHASE 2: ADD - Create permissions for new routes
    // ============================================================
    console.log('='.repeat(70))
    console.log('➕ PHASE 2: ADD - Creating missing permissions')
    console.log('='.repeat(70))
    console.log('\n')

    const permissionsToCreate: typeof scannedPermissions = []

    for (const [routeKey, scannedPermission] of scannedRouteMap) {
      if (!dbRouteMap.has(routeKey)) {
        permissionsToCreate.push(scannedPermission)
      }
    }

    let createdCount = 0
    let createErrorCount = 0

    if (permissionsToCreate.length > 0) {
      console.log(`📝 Found ${permissionsToCreate.length} new routes to add as permissions:\n`)

      for (const permission of permissionsToCreate) {
        try {
          await prisma.permission.create({
            data: {
              name: permission.name,
              description: permission.description,
              path: permission.path,
              method: permission.method,
              module: permission.module,
              createdBy: {
                connect: { id: adminUser.id },
              },
            },
          })

          console.log(`   ✅ Created: ${permission.name} (${permission.method} ${permission.path})`)
          createdCount++
        } catch (error) {
          console.error(`   ❌ Error creating "${permission.name}":`, error)
          createErrorCount++
        }
      }

      console.log(`\n✅ Addition completed: ${createdCount} created, ${createErrorCount} errors\n`)
    } else {
      console.log('✨ No new permissions to add. All routes are already in database!\n')
    }

    // ============================================================
    // PHASE 3: UPDATE - Update existing permissions (name, description, module)
    // ============================================================
    console.log('='.repeat(70))
    console.log('� PHASE 3: UPDATE - Synchronizing existing permissions')
    console.log('='.repeat(70))
    console.log('\n')

    let updatedCount = 0
    let updateErrorCount = 0

    for (const [routeKey, scannedPermission] of scannedRouteMap) {
      const dbPermission = dbRouteMap.get(routeKey)

      if (dbPermission) {
        // Check if any field needs update
        const needsUpdate =
          dbPermission.name !== scannedPermission.name ||
          dbPermission.description !== scannedPermission.description ||
          dbPermission.module !== scannedPermission.module

        if (needsUpdate) {
          try {
            await prisma.permission.update({
              where: { id: dbPermission.id },
              data: {
                name: scannedPermission.name,
                description: scannedPermission.description,
                module: scannedPermission.module,
                updatedBy: {
                  connect: { id: adminUser.id },
                },
              },
            })

            console.log(
              `   🔄 Updated: ${scannedPermission.name} (${scannedPermission.method} ${scannedPermission.path})`,
            )
            updatedCount++
          } catch (error) {
            console.error(`   ❌ Error updating "${scannedPermission.name}":`, error)
            updateErrorCount++
          }
        }
      }
    }

    if (updatedCount > 0) {
      console.log(`\n✅ Update completed: ${updatedCount} updated, ${updateErrorCount} errors\n`)
    } else {
      console.log('✨ No permissions need updating. Everything is in sync!\n')
    }

    // ============================================================
    // FINAL SUMMARY
    // ============================================================
    console.log('='.repeat(70))
    console.log('📊 SYNCHRONIZATION SUMMARY')
    console.log('='.repeat(70))
    console.log('\n')
    console.log(`📋 Routes scanned from app:        ${scannedPermissions.length}`)
    console.log(`📂 Permissions in database:        ${existingPermissions.length}`)
    console.log('\n')
    console.log(`🗑️  Obsolete permissions deleted:  ${deletedCount}`)
    console.log(`➕ New permissions created:        ${createdCount}`)
    console.log(`🔄 Existing permissions updated:   ${updatedCount}`)
    console.log('\n')
    console.log(`❌ Total errors:                   ${deleteErrorCount + createErrorCount + updateErrorCount}`)
    console.log('\n')
    console.log('='.repeat(70))
    console.log('✨ Two-way synchronization completed successfully!')
    console.log('='.repeat(70))
    console.log('\n')
  } catch (error) {
    console.error('❌ Fatal error during synchronization:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the synchronization
main()
