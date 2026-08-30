function CategoryNav() {
  const categories = [
    'Grocery',
    'Mobiles',
    'Fashion',
    'Electronics',
    'Home',
    'Appliances',
    'Travel',
    'Beauty, Toys & More',
    'Two Wheelers',
  ]

  return (
    <nav className="category-nav">
      {categories.map((category) => (
        <div className="category-item" key={category}>
          <span>{category}</span>
          <span className="arrow">⌄</span>
        </div>
      ))}
    </nav>
  )
}

export default CategoryNav