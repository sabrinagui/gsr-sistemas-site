import configPromise from '@payload-config'
import { getPayload, type Payload } from 'payload'

/**
 * Instância única do Payload no processo. Em dev, o Next recarrega módulos a
 * cada alteração; sem o cache, cada recarga abriria um novo pool de conexões
 * contra o Neon.
 */
let cached: Promise<Payload> | null = null

export const getPayloadClient = (): Promise<Payload> => {
  if (!cached) cached = getPayload({ config: configPromise })
  return cached
}
