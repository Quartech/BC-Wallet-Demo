import { eq } from 'drizzle-orm'
import { NotFoundError } from 'routing-controllers'
import { Service } from 'typedi'

import DatabaseService from '../../services/DatabaseService'
import { Asset, NewAsset, RepositoryDefinition } from '../../types'
import { assets } from '../schema'

@Service()
class AssetRepository implements RepositoryDefinition<Asset, NewAsset> {
  public constructor(private readonly databaseService: DatabaseService) {}

  public async create(asset: NewAsset): Promise<Asset> {
    const [result] = await (await this.databaseService.getConnection()).insert(assets).values(asset).returning()

    return result
  }

  public async delete(id: string): Promise<void> {
    await this.findById(id)
    await (await this.databaseService.getConnection()).delete(assets).where(eq(assets.id, id))
  }

  public async update(id: string, asset: NewAsset): Promise<Asset> {
    await this.findById(id)
    const [result] = await (await this.databaseService.getConnection())
      .update(assets)
      .set(asset)
      .where(eq(assets.id, id))
      .returning()

    return result
  }

  public async findById(id: string): Promise<Asset> {
    const [result] = await (await this.databaseService.getConnection()).select().from(assets).where(eq(assets.id, id))

    if (!result) {
      return Promise.reject(new NotFoundError(`No asset found for id: ${id}`))
    }

    return result
  }

  public async findAll(): Promise<Asset[]> {
    return (await this.databaseService.getConnection()).select().from(assets)
  }
}

export default AssetRepository
