import { Column, Model, Table, DataType } from 'sequelize-typescript';

@Table({ timestamps: true })
export class Order extends Model<Order> {
    @Column({
        type: DataType.JSONB,
        allowNull: false,
    })
    shippingInfo: {
        address: string;
        city: string;
        state: string;
        country: string;
        pinCode: number;
    };

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        },
    })
    userId: number;

    @Column({
        type: DataType.FLOAT,
        allowNull: false,
    })
    shippingCharges: number;

    @Column({
        type: DataType.FLOAT,
        allowNull: false,
    })
    discount: number;

    @Column({
        type: DataType.FLOAT,
        allowNull: false,
    })
    total: number;

    @Column({
        type: DataType.ENUM('Processing', 'Shipped', 'Delivered'),
        defaultValue: 'Processing',
        allowNull: false,
    })
    status: 'Processing' | 'Shipped' | 'Delivered';

    @Column({
        type: DataType.JSONB,
        allowNull: false,
    })
    orderItem: {
        name: string;
        photo: string;
        price: number;
        quantity: number;
    };

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        references: {
            model: 'products',
            key: 'id',
        },
    })
    productId: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        },
    })
    sellerId: number;
} 