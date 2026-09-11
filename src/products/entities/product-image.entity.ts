import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";


@Entity({name:'product_images'})
export class ProductImage{

    @ApiProperty({
        example: 1,
        description: 'Image ID',
    })
    @PrimaryGeneratedColumn()
    id!:number;

    @ApiProperty({
        example: '1733884-00-A_0_2000.jpg',
        description: 'Product image filename or URL',
    })
    @Column('text')
    url!:string;

    @ManyToOne(
        ()=> Product,
        (product)=> product.images,
        {onDelete:'CASCADE'}
    )
    product!:Product
}