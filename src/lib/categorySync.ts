import { Category } from '@/lib/models/Category';
import { Product } from '@/lib/models/Product';

export const ALL_CATEGORIES_CONFIG = [
  {
    name: '5-Sleeve Jerseys',
    slug: '5-sleeve-jerseys',
    description: 'Oversized heavy-weight streetwear 5-sleeve boxy jerseys.',
    image: '',
  },
  {
    name: 'Baggy',
    slug: 'baggy',
    description: 'Premium raw denim, vintage washed baggy & cargo jeans.',
    image: '',
  },
  {
    name: 'Full-Sleeve Stripes',
    slug: 'full-sleeve-stripes',
    description: 'Relaxed fit drop-shoulder woven & striped shirts.',
    image: '',
  },
  {
    name: 'Socks',
    slug: 'socks',
    description: 'Ribbed vintage cotton crew socks with custom jacquard logos.',
    image: '',
  },
  {
    name: 'Headwear',
    slug: 'headwear',
    description: 'Unstructured dad hats, 5-panel caps & vintage snapbacks.',
    image: '',
  },
  {
    name: 'Accessories',
    slug: 'accessories',
    description: 'Retro acetate sunglasses & anti-blue optical specs.',
    image: '',
  },
  {
    name: 'Shorts',
    slug: 'shorts',
    description: 'Oversized heavyweight streetwear shorts.',
    image: '',
  },
  {
    name: 'T-Shirts',
    slug: 't-shirts',
    description: 'Graphic tees, boxy fit streetwear t-shirts.',
    image: '',
  },
  {
    name: 'Track Pant',
    slug: 'track-pant',
    description: 'Relaxed fit heavyweight track pants & joggers.',
    image: '',
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
      } else {
        const updateDoc: any = {};
        if (existing.name !== cat.name) updateDoc.name = cat.name;
        // Purge fake/Unsplash/Pexels image URLs stored in DB
        if (
          existing.image &&
          (existing.image.includes('unsplash.com') ||
            existing.image.includes('pexels.com') ||
            existing.image.includes('placeholder'))
        ) {
          updateDoc.image = '';
        }
        if (Object.keys(updateDoc).length > 0) {
          await Category.updateOne({ slug: cat.slug }, { $set: updateDoc });
        }
      }
    }

    // 4. Also clean up any other categories that have fake unsplash/pexels images
    await Category.updateMany(
      {
        $or: [
          { image: { $regex: 'unsplash\\.com', $options: 'i' } },
          { image: { $regex: 'pexels\\.com', $options: 'i' } },
          { image: { $regex: 'placeholder', $options: 'i' } },
        ],
      },
      { $set: { image: '' } }
    );
  } catch (err) {
    console.error('Category migration sync error:', err);
  }
}
