// Require mock setup
const mod = require('module')
const originalRequire = mod.prototype.require
mod.prototype.require = function (path) {
  if (path.includes('configuration/getConnection')) {
    return {
      getConnection: () => ({
        Data: {
          server: 'localhost',
          port: '1433',
          user: 'sa',
          password: 'innosoft',
          name: 'pos13'
        }
      })
    }
  }
  return originalRequire.apply(this, arguments)
}

const { AppDataSource, initializeDatabase } = require('./src/main/typeORM/configurations')
const { AllianceReportService } = require('./src/main/services/reports/AllianceReportService')
const fs = require('fs')

async function run() {
  try {
    await initializeDatabase()

    const lines = await AllianceReportService.getProductLines(1, '2024-11-20', '0010001000015')
    fs.writeFileSync('get_product_lines_debug2.txt', JSON.stringify(lines, null, 2))

    const lines16 = await AllianceReportService.getProductLines(1, '2024-11-20', '0010001000016')
    fs.writeFileSync('get_product_lines_debug16.txt', JSON.stringify(lines16, null, 2))

    console.log('Success!')
  } catch (err) {
    console.error('error', err)
    fs.writeFileSync('get_product_lines_debug2.txt', String(err))
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy()
    }
  }
}

run()
