import { Category } from '@/lib/models/Category';
import { Product } from '@/lib/models/Product';

export const ALL_CATEGORIES_CONFIG = [
  {
    name: '5-Sleeve',
    slug: '5-sleeve-jerseys',
    description: 'Oversized heavy-weight streetwear 5-sleeve boxy jerseys.',
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Baggy',
    slug: 'baggy',
    description: 'Premium raw denim, vintage washed baggy & cargo jeans.',
    image: 'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Full-Sleeve Stripes',
    slug: 'full-sleeve-stripes',
    description: 'Relaxed fit drop-shoulder woven & striped shirts.',
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Socks',
    slug: 'socks',
    description: 'Ribbed vintage cotton crew socks with custom jacquard logos.',
    image: 'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Headwear',
    slug: 'headwear',
    description: 'Unstructured dad hats, 5-panel caps & vintage snapbacks.',
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Accessories',
    slug: 'accessories',
    description: 'Retro acetate sunglasses & anti-blue optical specs.',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Shorts',
    slug: 'shorts',
    description: 'Oversized heavyweight streetwear shorts.',
    image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'T-Shirts',
    slug: 't-shirts',
    description: 'Graphic tees, boxy fit streetwear t-shirts.',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Track Pant',
    slug: 'track-pant',
    description: 'Relaxed fit heavyweight track pants & joggers.',
    image: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&w=800&q=80',
  },
];

let syncDone = false;

export async function ensureCategoryMigration() {
  try {
    // 1. Rename existing categories in Category collection if old slugs exist
    await Category.updateOne(
      { slug: 'jeans' },
      { $set: { name: 'Baggy', slug: 'baggy', description: 'Premium raw denim, vintage washed baggy & cargo jeans.' } }
    );
    await Category.updateOne(
      { slug: 'caps' },
      { $set: { name: 'Headwear', slug: 'headwear', description: 'Unstructured dad hats, 5-panel caps & vintage snapbacks.' } }
    );
    await Category.updateOne(
      { slug: 'glasses' },
      { $set: { name: 'Accessories', slug: 'accessories', description: 'Retro acetate sunglasses & anti-blue optical specs.' } }
    );
    await Category.updateOne(
      { $or: [{ slug: 'full-sleeve-shirts' }, { slug: 'full-sleeve' }] },
      { $set: { name: 'Full-Sleeve Stripes', slug: 'full-sleeve-stripes', description: 'Relaxed fit drop-shoulder woven & striped shirts.' } }
    );

    // 2. Migrate category fields on existing products
    await Product.updateMany({ category: 'jeans' }, { $set: { category: 'baggy' } });
    await Product.updateMany({ category: 'caps' }, { $set: { category: 'headwear' } });
    await Product.updateMany({ category: 'glasses' }, { $set: { category: 'accessories' } });
    await Product.updateMany(
      { $or: [{ category: 'full-sleeve-shirts' }, { category: 'full-sleeve' }, { category: 'Full Sleeve' }, { category: 'Full-Sleeve Shirts' }] },
      { $set: { category: 'full-sleeve-stripes' } }
    );

    // Also migrate if product category stored as name string
    await Product.updateMany({ category: 'Jeans' }, { $set: { category: 'baggy' } });
    await Product.updateMany({ category: 'Caps' }, { $set: { category: 'headwear' } });
    await Product.updateMany({ category: 'Glasses' }, { $set: { category: 'accessories' } });

    // 3. Upsert all 9 categories
    for (const cat of ALL_CATEGORIES_CONFIG) {
      const existing = await Category.findOne({ slug: cat.slug });
      if (!existing) {
        await Category.create({ ...cat, isActive: true });
      } else if (existing.name !== cat.name) {
        await Category.updateOne({ slug: cat.slug }, { $set: { name: cat.name } });
      }
    }
  } catch (err) {
    console.error('Category migration sync error:', err);
  }
}
