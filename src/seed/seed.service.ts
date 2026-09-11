import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/seed-data';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/users.entity';
import { Repository } from 'typeorm';


@Injectable()
export class SeedService {

  constructor(
    private readonly productService: ProductsService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ){}

  async runSeed(){
    await this.deleteTable();
    const adminUser = await this.insertUsers();
    await this.insertNewProducts(adminUser);
    return 'SEED EXECUTED'
  }

  private async deleteTable(){

    await this.productService.deleteAllProducts();

    const queryBuilder =  this.userRepository.createQueryBuilder();
    await queryBuilder
      .delete()
      .execute()
  }

  private async insertUsers(){
    const seedUser = initialData.users;

    const users: User[] = [];

    seedUser.forEach(user =>{
      users.push(this.userRepository.create(user))
    });

    const dbUsers = await this.userRepository.save(seedUser);

    return dbUsers[0];


  }



  private async insertNewProducts(user:User){
    await this.productService.deleteAllProducts();

    const products = initialData.products;

    const insertPromises: Promise<any>[] = [];

    products.forEach(product =>{
      insertPromises.push(this.productService.create(product,user))
    });

    await Promise.all(insertPromises);
    return true;
  }
}
