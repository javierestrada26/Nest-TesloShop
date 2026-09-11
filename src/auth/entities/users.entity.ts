import { ApiProperty } from "@nestjs/swagger";
import { Product } from "../../products/entities";
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn,  } from "typeorm";


@Entity('users')
export class User {

    @ApiProperty({
        example: 'e3f01c87-8d9e-4bfa-b9a1-5d9f041b6c7a',
        description: 'User ID (UUID)',
        uniqueItems: true,
    })
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @ApiProperty({
        example: 'user@google.com',
        description: 'User email address',
        uniqueItems: true,
    })
    @Column('text',{
        unique:true
    })
    email!:string;

    @Column('text',{
        select:false
    })
    password?:string;

    @ApiProperty({
        example: 'John Doe',
        description: 'User full name',
    })
    @Column('text')
    fullName!:string;

    @ApiProperty({
        example: true,
        description: 'Is user active status',
        default: true,
    })
    @Column('bool',{
        default:true
    })
    isActive!:boolean;

    @ApiProperty({
        example: ['user', 'admin'],
        description: 'User assigned roles',
        default: ['user'],
    })
    @Column('text',{
        array:true,
        default:['user']
    })
    roles!: string[];

    @OneToMany(
        ()=>Product,
        (product) => product.user
    )
    product!: Product

    @BeforeInsert()
    checkFieldsBeforeInsert(){
        this.email = this.email.toLowerCase().trim();
    }

    @BeforeUpdate()
    checkFieldBeforeUpdate(){
        this.checkFieldsBeforeInsert();
    }
}
