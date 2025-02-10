import dotenv from 'dotenv'

async function globalSetup(config: any) {
  dotenv.config({
    path: '.env',
    override: true
  })
}

module.exports = globalSetup
