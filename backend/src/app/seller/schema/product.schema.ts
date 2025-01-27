import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({
  timestamps: true,
  tableName: 'products',
})
export class Product extends Model<Product> {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
    field: 'seller_id',
  })
  sellerId: number;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description: string;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
    validate: {
      min: 0,
    },
  })
  price: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
    validate: {
      min: 0,
    },
  })
  originalPrice: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
    validate: {
      min: 0,
    },
  })
  discountPercentage: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      isIn: [['Electronics', 'Clothing', 'Books', 'Home Appliances', 'Sports', 'Other']]
    }
  })
  category: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
    },
    defaultValue: 0,
  })
  stock: number;

  @Column({
    type: DataType.JSONB,
    allowNull: false,
  })
  image: {
    public_id: string;
    url: string;
  }[];

  @Column({
    type: DataType.FLOAT,
    allowNull: true,
    validate: {
      min: 0,
    },
  })
  shippingFee: number;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  hitCount: number;
} 