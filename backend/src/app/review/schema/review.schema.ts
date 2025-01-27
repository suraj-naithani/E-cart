import {
    Column,
    DataType,
    Model,
    Table,
    ForeignKey,
    BelongsTo,
} from 'sequelize-typescript';
import { User } from '../../users/schema/user.schema';
import { Product } from 'src/app/seller/schema/product.schema';

@Table({
    timestamps: true,
    tableName: 'reviews',
})
export class Review extends Model<Review> {

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        field: 'userId', 
    })
    userId: number;

    @BelongsTo(() => User)
    user: User; 

    @ForeignKey(() => Product)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        field: 'productId',
        onDelete: 'CASCADE'
    })
    productId: number;

    // @BelongsTo(() => Product)
    // product: Product; 

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 5,
        },
    })
    rating: number;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    comment: string;
}
