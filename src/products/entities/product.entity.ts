import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./product-image.entity";
import { User } from "../../auth/entities/users.entity";
import { ApiProperty } from "@nestjs/swagger";


@Entity({ name:'products'})
export class Product {

    @ApiProperty({
        example:'025e675b-d055-4a6d-b4ca-cc4bb2a02c2d',
        description:'Product ID',
        uniqueItems:true
    })
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @ApiProperty({
        example:'T-shirt teslo',
        description:'Product Title',
        uniqueItems:true
    })
    @Column('text',{
        unique:true
    })
    title!:string

    @ApiProperty({
        example:0,
        description:'Product price',
        
    })
    @Column('float',{
        default:0
    })
    price!:number;

    @ApiProperty({
        example:'Description Example',
        description:'Product Description',
        default:null
    })
    @Column({
        type:'text',
        nullable:true
    })
    description!: string;


    @ApiProperty({
        example:'t_shirt_teslo',
        description:'Product Slug',
        uniqueItems:true
    })
    @Column('text',{
        unique:true
    })
    slug!:string;

    @ApiProperty({
        example:10,
        description:'Product Stock',
        default:0
    })
    @Column('int',{
        default:0
    })
    stock!:number;

    @ApiProperty({
        example:['S', 'M', 'L', 'XL'],
        description:'Product Size',
    })
    @Column('text',{
        array:true
    })
    sizes!: string[];

    @ApiProperty({
        example:'Men',
        description:'Product gender',
    })
    @Column('text')
    gender!: string;

    @ApiProperty({
        example: ['shirt', 'clothing'],
        description: 'Product tags',
        type: [String],
    })
    @Column('text',{
        array:true,
        default:[]
    })
    tags!: string[]

    @ApiProperty({
        type: () => [ProductImage],
        description: 'Product images',
    })
    @OneToMany(
        ()=>ProductImage,
        (productImage) => productImage.product,
        {cascade:true, eager:true}

    )
    images?: ProductImage[];

    @ManyToOne(
        ()=>User,
        (user) =>user.product,
        {eager:true}
    )
    user!:User;



    @BeforeInsert()
    checkSlugInsert(){
        if(!this.slug){
            this.slug = this.title
        }
        this.slug = this.slug
            .toLowerCase()
            .replaceAll(' ', '_')
            .replaceAll("'",'')
    }

    @BeforeUpdate()
    checkSlugUpdate(){
        this.slug = this.slug
            .toLowerCase()
            .replaceAll(' ', '_')
            .replaceAll("'",'')
    }


}
