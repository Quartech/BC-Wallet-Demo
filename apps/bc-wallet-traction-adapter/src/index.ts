import dotenv from 'dotenv'
import express from 'express'

dotenv.config()

import { environment } from './environment'
import { MessageProcessor } from './message-processor'

async function main() {
  const processor = new MessageProcessor(environment.messageBroker.MESSAGE_PROCESSOR_TOPIC)

  // Create Express app for health checks
  const app = express()
  const port = process.env.PORT || 3000

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'traction-adapter',
      messageProcessor: processor.isConnected() ? 'connected' : 'disconnected',
    })
  })

  try {
    // Start the message processor
    await processor.start()
    console.log('AMQ 1.0 message processor started')

    // Start the Express server
    app.listen(port, () => {
      console.log(`Health check server listening on port ${port}`)
    })

    process.on('SIGINT', async () => {
      console.log('Received SIGINT. Shutting down...')
      await processor.stop()
      process.exit(0)
    })

    process.on('SIGTERM', async () => {
      console.log('Received SIGTERM. Shutting down...')
      await processor.stop()
      process.exit(0)
    })

    process.stdin.resume()
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

void main()
