import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { User } from 'src/app/users/schema/user.schema';

@Table({ timestamps: true })
export class Cart extends Model<Cart> {
    @Column({
        type: DataType.INTEGER,
        references: {
            model: User,
            key: 'id',
        },
        allowNull: false,
    })
    userId: number;

    @Column({
        type: DataType.JSONB,
        allowNull: false,
        defaultValue: [],
    })
    items: Array<{
        productId: number;
        quantity: number;
    }>;
}
