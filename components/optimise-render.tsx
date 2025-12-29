'use client';
import { useState, useRef, useEffect, useMemo, memo } from 'react';
import { Zap, Turtle, Search, Filter, ArrowUpDown } from 'lucide-react';

type Category = 'Electronics' | 'Books' | 'Clothing' | 'Food' | 'Toys';
type Status = 'Active' | 'Pending' | 'Inactive';

interface ProductItem {
  id: number;
  name: string;
  category: Category;
  price: string; // formatted string like "123.45"
  stock: number;
  status: Status;
  description: string;
}

type SortByKey = 'id' | 'name' | 'price' | 'stock';

// Generate large dataset
const generateData = (count: number): ProductItem[] => {
  const categories: Category[] = [
    'Electronics',
    'Books',
    'Clothing',
    'Food',
    'Toys',
  ];
  const statuses: Status[] = ['Active', 'Pending', 'Inactive'];

  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `Product ${i + 1}`,
    category: categories[i % categories.length],
    price: (Math.random() * 1000).toFixed(2),
    stock: Math.floor(Math.random() * 500),
    status: statuses[i % statuses.length],
    description: `This is a detailed description for product ${
      i + 1
    } with various features and specifications.`,
  }));
};

// Memoized list item to prevent unnecessary re-renders
interface ListItemProps {
  item: ProductItem;
  style?: React.CSSProperties;
  isVirtual?: boolean;
}

function ListItemComponent({
  item,
  style,
  isVirtual: _isVirtual,
}: ListItemProps) {
  void _isVirtual;
  return (
    <div
      style={style}
      className="border-b border-gray-200 hover:bg-blue-50 transition-colors"
    >
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-100">{item.name}</h3>
            <p className="text-sm text-gray-400">{item.description}</p>
          </div>
          <span
            className={`ml-4 px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${
              item.status === 'Active'
                ? 'bg-green-100 text-green-800'
                : item.status === 'Pending'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {item.status}
          </span>
        </div>
        <div className="flex gap-4 text-sm text-gray-400">
          <span>
            Category: <span className="font-medium">{item.category}</span>
          </span>
          <span>
            Price:{' '}
            <span className="font-medium text-green-600">${item.price}</span>
          </span>
          <span>
            Stock: <span className="font-medium">{item.stock}</span>
          </span>
        </div>
      </div>
    </div>
  );
}

const ListItem = memo(ListItemComponent);
ListItem.displayName = 'ListItem';

// Virtual List Component
interface VirtualListProps {
  items: ProductItem[];
  height?: number;
  itemHeight?: number;
}

const VirtualList: React.FC<VirtualListProps> = ({
  items,
  height = 600,
  itemHeight = 100,
}) => {
  const [scrollTop, setScrollTop] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  // Calculate visible range
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - 5); // 5 items buffer above
  const endIndex = Math.min(
    items.length,
    Math.ceil((scrollTop + height) / itemHeight) + 5 // 5 items buffer below
  );

  const visibleItems = items.slice(startIndex, endIndex);
  const totalHeight = items.length * itemHeight;
  const offsetY = startIndex * itemHeight;

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="overflow-auto border border-gray-300 rounded-lg "
      style={{ height: `${height}px` }}
    >
      <div style={{ height: `${totalHeight}px`, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map(item => (
            <ListItem
              key={item.id}
              item={item}
              style={{ height: `${itemHeight}px` }}
              isVirtual={true}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Standard List Component (for comparison)
interface StandardListProps {
  items: ProductItem[];
  height?: number;
}

const StandardList: React.FC<StandardListProps> = ({ items, height = 600 }) => {
  return (
    <div
      className="overflow-auto border border-gray-300 rounded-lg "
      style={{ height: `${height}px` }}
    >
      {items.map(item => (
        <ListItem
          key={item.id}
          item={item}
          style={{ minHeight: '100px' }}
          isVirtual={false}
        />
      ))}
    </div>
  );
};

// Main App Component
const MainApp = () => {
  const [itemCount, setItemCount] = useState<number>(10000);
  const [useVirtualization, setUseVirtualization] = useState<boolean>(true);
  const [renderTime, setRenderTime] = useState<string>('0.00');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<SortByKey>('id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Generate data
  const allData = useMemo<ProductItem[]>(
    () => generateData(itemCount),
    [itemCount]
  );

  // Filter and sort data
  const processedData = useMemo(() => {
    let filtered = allData;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        item =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (filterCategory !== 'All') {
      filtered = filtered.filter(item => item.category === filterCategory);
    }

    // Sort (type-safe)
    const getValue = (p: ProductItem, key: SortByKey): number | string => {
      if (key === 'price') return parseFloat(p.price);
      if (key === 'stock') return p.stock;
      if (key === 'id') return p.id;
      return p.name;
    };

    filtered.sort((a, b) => {
      const aVal = getValue(a, sortBy);
      const bVal = getValue(b, sortBy);

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
      }

      const aStr = String(aVal).toLowerCase();
      const bStr = String(bVal).toLowerCase();
      if (aStr === bStr) return 0;
      return sortOrder === 'asc'
        ? aStr > bStr
          ? 1
          : -1
        : aStr < bStr
        ? 1
        : -1;
    });

    return filtered;
  }, [allData, searchTerm, filterCategory, sortBy, sortOrder]);

  // Measure render time
  useEffect(() => {
    const start = performance.now();
    requestAnimationFrame(() => {
      const end = performance.now();
      setRenderTime((end - start).toFixed(2));
    });
  }, [processedData, useVirtualization]);

  const categories = [
    'All',
    'Electronics',
    'Books',
    'Clothing',
    'Food',
    'Toys',
  ];

  return (
    <div className="min-h-screen  p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-100 mb-2">
            List Rendering Optimization Demo
          </h1>
          <p className="text-gray-400">
            Comparing virtualized vs standard rendering with{' '}
            {itemCount.toLocaleString()} items
          </p>
        </div>

        {/* Controls */}
        <div className=" rounded-lg shadow-md p-6 mb-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Item Count */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Number of Items
              </label>
              <select
                value={itemCount}
                onChange={e => setItemCount(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value={1000}>1,000</option>
                <option value={5000}>5,000</option>
                <option value={10000}>10,000</option>
                <option value={25000}>25,000</option>
                <option value={50000}>50,000</option>
              </select>
            </div>

            {/* Rendering Mode */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Rendering Mode
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setUseVirtualization(true)}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                    useVirtualization
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <Zap className="w-4 h-4" />
                  Virtual
                </button>
                <button
                  onClick={() => setUseVirtualization(false)}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                    !useVirtualization
                      ? 'bg-orange-600 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <Turtle className="w-4 h-4" />
                  Standard
                </button>
              </div>
            </div>

            {/* Performance Stats */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Render Time
              </label>
              <div
                className={`px-4 py-2 rounded-lg font-bold text-lg ${
                  useVirtualization
                    ? 'bg-green-100 text-green-800'
                    : 'bg-orange-100 text-orange-800'
                }`}
              >
                {renderTime}ms
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Search className="w-4 h-4 inline mr-1" />
                Search
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search products..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Filter className="w-4 h-4 inline mr-1" />
                Category
              </label>
              <select
                value={filterCategory}
                onChange={e => setFilterCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <ArrowUpDown className="w-4 h-4 inline mr-1" />
                Sort By
              </label>
              <div className="flex gap-2">
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as SortByKey)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="id">ID</option>
                  <option value="name">Name</option>
                  <option value="price">Price</option>
                  <option value="stock">Stock</option>
                </select>
                <button
                  onClick={() =>
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg hover: transition-colors"
                >
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </button>
              </div>
            </div>
          </div>

          <div className="text-sm text-gray-400 pt-2 border-t">
            Showing {processedData.length.toLocaleString()} of{' '}
            {itemCount.toLocaleString()} items
            {!useVirtualization && itemCount > 5000 && (
              <span className="ml-2 text-orange-600 font-medium">
                ⚠️ Warning: Standard rendering may be slow with this many items
              </span>
            )}
          </div>
        </div>

        {/* List Display */}
        <div className=" rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-100">
              Product List
            </h2>
            <div className="flex items-center gap-2">
              {useVirtualization ? (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  <Zap className="w-4 h-4 inline mr-1" />
                  Virtualized (Only renders ~20 visible items)
                </span>
              ) : (
                <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                  <Turtle className="w-4 h-4 inline mr-1" />
                  Standard (Renders all {processedData.length} items)
                </span>
              )}
            </div>
          </div>

          {useVirtualization ? (
            <VirtualList items={processedData} height={600} itemHeight={100} />
          ) : (
            <StandardList items={processedData} height={600} />
          )}
        </div>

        {/* Performance Tips */}
        <div className="mt-6 bg-blue-900 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-50 mb-3">
            💡 Performance Comparison
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-200">
            <div>
              <strong>Virtualized Rendering:</strong>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Renders only ~20 visible items</li>
                <li>Constant memory usage</li>
                <li>Smooth scrolling at any scale</li>
                <li>Sub-50ms render times</li>
              </ul>
            </div>
            <div>
              <strong>Standard Rendering:</strong>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Renders ALL items to DOM</li>
                <li>Memory grows with item count</li>
                <li>Sluggish with 10,000+ items</li>
                <li>Can freeze browser at 50,000+</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainApp;
