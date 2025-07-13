import React, { useState } from 'react';
import { 
  Package, 
  Leaf, 
  Calculator, 
  Star, 
  TreePine, 
  Recycle, 
  DollarSign, 
  QrCode,
  ChevronDown,
  Loader2,
  Box,
  Target,
  User,
  MapPin,
  Clock,
  Camera,
  Calendar,
  Truck,
  CheckCircle,
  AlertCircle,
  Gift,
  BarChart3,
  Map,
  List,
  Upload
} from 'lucide-react';

// Mock data structures
const mockPackagingResult = {
  boxSize: "M",
  dimensions: "30x20x15 cm",
  cushioning: "Molded Pulp",
  fillPercentage: 85,
  materialSavings: 0.42,
  co2Reduction: 0.8,
  sustainability: 4,
  treesSaved: 2.3,
  plasticReduced: 1.2,
  carbonOffset: 0.65
};

const mockOrders = [
  {
    id: "WMT-ORD-7890",
    date: "2023-10-15",
    items: 3,
    status: "Return Pending",
    address: "123 Main St",
    reward: 1.25
  },
  {
    id: "WMT-ORD-7891",
    date: "2023-10-12",
    items: 1,
    status: "Delivered",
    address: "123 Main St",
    reward: 0.75
  },
  {
    id: "WMT-ORD-7892",
    date: "2023-10-10",
    items: 2,
    status: "Credited",
    address: "123 Main St",
    reward: 1.50
  }
];

const mockPickups = [
  {
    id: 1,
    address: "456 Oak Ave",
    timeWindow: "2-4 PM",
    boxes: 2,
    status: "Pending",
    lat: 40.7128,
    lng: -74.0060
  },
  {
    id: 2,
    address: "789 Pine St",
    timeWindow: "4-6 PM",
    boxes: 1,
    status: "Collected",
    lat: 40.7589,
    lng: -73.9851
  },
  {
    id: 3,
    address: "321 Elm Dr",
    timeWindow: "6-8 PM",
    boxes: 3,
    status: "Pending",
    lat: 40.7505,
    lng: -73.9934
  }
];

interface ProductData {
  length: string;
  width: string;
  height: string;
  weight: string;
  fragility: number;
  category: string;
  location: string;
}

function App() {
  const [activeTab, setActiveTab] = useState('advisor');
  const [productData, setProductData] = useState<ProductData>({
    length: '',
    width: '',
    height: '',
    weight: '',
    fragility: 5,
    category: '',
    location: ''
  });
  
  const [result, setResult] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showResults, setShowResults] = useState(false);
  
  // Customer Portal State
  const [selectedOrder, setSelectedOrder] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [isScheduling, setIsScheduling] = useState(false);
  
  // Driver App State
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'
  const [selectedPickup, setSelectedPickup] = useState<any>(null);
  const [qrCode, setQrCode] = useState('');
  const [boxCondition, setBoxCondition] = useState('');
  const [boxQuantity, setBoxQuantity] = useState(1);
  const [isCollecting, setIsCollecting] = useState(false);

  const categories = ['Electronics', 'Clothing', 'Groceries', 'Home Goods', 'Others'];
  const locations = ['Bangalore','Delhi', 'Jaipur', 'Ahmedabad', 'Kolkata','Hyderabad','Chennai', 'Mumbai'];
  const timeSlots = ['9-11 AM', '11-1 PM', '1-3 PM', '3-5 PM', '5-7 PM'];
  const boxConditions = ['Pristine', 'Good', 'Damaged'];

  const calculatePackaging = async () => {
    if (!productData.length || !productData.width || !productData.height || !productData.weight || !productData.category || !productData.location) {
      alert('Please fill in all required fields');
      return;
    }

    setIsCalculating(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const volume = parseFloat(productData.length) * parseFloat(productData.width) * parseFloat(productData.height);
    const weight = parseFloat(productData.weight);
    
    const boxSizes = ['XS', 'S', 'M', 'L', 'XL'];
    const boxSizeIndex = Math.min(Math.floor(volume / 1000), 4);
    
    const calculatedResult = {
      ...mockPackagingResult,
      boxSize: boxSizes[boxSizeIndex],
      dimensions: `${Math.ceil(parseFloat(productData.length) * 1.2)} x ${Math.ceil(parseFloat(productData.width) * 1.2)} x ${Math.ceil(parseFloat(productData.height) * 1.2)} cm`,
      fillPercentage: Math.min(85, Math.max(60, 100 - (volume * 0.001))),
      materialSavings: Math.round((weight * 0.5 + volume * 0.001) * 100) / 100,
      co2Reduction: Math.round((weight * 0.3 + volume * 0.0005) * 100) / 100,
    };

    setResult(calculatedResult);
    setIsCalculating(false);
    setShowResults(true);
  };

  const schedulePickup = async () => {
    if (!selectedOrder || !pickupDate || !pickupTime) {
      alert('Please fill in all fields');
      return;
    }
    
    setIsScheduling(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsScheduling(false);
    alert('Pickup scheduled successfully!');
  };

  const collectBox = async () => {
    if (!qrCode || !boxCondition) {
      alert('Please scan QR code and select box condition');
      return;
    }
    
    setIsCollecting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsCollecting(false);
    setSelectedPickup(null);
    alert('Box collected successfully!');
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
      />
    ));
  };

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      'Delivered': 'bg-green-100 text-green-700',
      'Return Pending': 'bg-yellow-100 text-yellow-700',
      'Credited': 'bg-blue-100 text-blue-700',
      'Pending': 'bg-orange-100 text-orange-700',
      'Collected': 'bg-green-100 text-green-700'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusStyles[status as keyof typeof statusStyles]}`}>
        {status}
      </span>
    );
  };

  const renderPackagingAdvisor = () => (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
          PackOptima AI Advisor
        </h1>
        <p className="text-lg text-gray-600">
          Optimize packaging for sustainability
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Input Form */}
        <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8 border border-gray-100">
          <div className="flex items-center space-x-3 mb-6">
            <Calculator className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Product Details</h2>
          </div>

          <div className="space-y-6">
            {/* Dimensions */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Dimensions (L × W × H) in cm
              </label>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <input
                    type="number"
                    placeholder="Length"
                    value={productData.length}
                    onChange={(e) => setProductData({...productData, length: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                  <span className="text-xs text-gray-500 mt-1 block">Length</span>
                </div>
                <div>
                  <input
                    type="number"
                    placeholder="Width"
                    value={productData.width}
                    onChange={(e) => setProductData({...productData, width: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                  <span className="text-xs text-gray-500 mt-1 block">Width</span>
                </div>
                <div>
                  <input
                    type="number"
                    placeholder="Height"
                    value={productData.height}
                    onChange={(e) => setProductData({...productData, height: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                  <span className="text-xs text-gray-500 mt-1 block">Height</span>
                </div>
              </div>
            </div>

            {/* Weight */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Weight (kg)
              </label>
              <input
                type="number"
                step="0.1"
                placeholder="0.0"
                value={productData.weight}
                onChange={(e) => setProductData({...productData, weight: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>

            {/* Fragility Slider */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Fragility Level: {productData.fragility}/10
              </label>
              <div className="px-2">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={productData.fragility}
                  onChange={(e) => setProductData({...productData, fragility: parseInt(e.target.value)})}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #00b140 0%, #00b140 ${productData.fragility * 10}%, #e5e7eb ${productData.fragility * 10}%, #e5e7eb 100%)`
                  }}
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Durable</span>
                  <span>Very Fragile</span>
                </div>
              </div>
            </div>

            {/* Category Dropdown */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Product Category
              </label>
              <div className="relative">
                <select
                  value={productData.category}
                  onChange={(e) => setProductData({...productData, category: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white transition-all"
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>

            {/* Location Dropdown */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Warehouse Location
              </label>
              <div className="relative">
                <select
                  value={productData.location}
                  onChange={(e) => setProductData({...productData, location: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white transition-all"
                >
                  <option value="">Select warehouse location</option>
                  {locations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>

            {/* Calculate Button */}
            <button
              onClick={calculatePackaging}
              disabled={isCalculating}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isCalculating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Calculating...</span>
                </>
              ) : (
                <>
                  <Target className="w-5 h-5" />
                  <span>Calculate</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results Panel */}
        <div className={`space-y-6 transition-all duration-500 ${showResults ? 'opacity-100' : 'opacity-50'}`}>
          {result && (
            <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8 border border-gray-100">
              <div className="flex items-center space-x-3 mb-6">
                <Box className="w-6 h-6 text-green-600" />
                <h2 className="text-2xl font-bold text-gray-900">Recommended Packaging</h2>
              </div>

              {/* 3D Box Wireframe */}
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg p-8 mb-6 flex items-center justify-center">
                <div className="text-center">
                  <Package className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">3D Box Wireframe</p>
                  <p className="text-xs text-gray-400">{result.dimensions}</p>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700">Box Size:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                    result.boxSize === 'XS' ? 'bg-green-100 text-green-700' :
                    result.boxSize === 'S' ? 'bg-blue-100 text-blue-700' :
                    result.boxSize === 'M' ? 'bg-yellow-100 text-yellow-700' :
                    result.boxSize === 'L' ? 'bg-orange-100 text-orange-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {result.boxSize}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700">Cushioning:</span>
                  <span className="text-sm text-gray-600">{result.cushioning}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700">Fill %:</span>
                  <span className="text-sm font-semibold text-green-600">{result.fillPercentage}%</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700">Material Savings:</span>
                  <span className="text-sm font-semibold text-green-600">${result.materialSavings}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700">CO₂ Reduction:</span>
                  <span className="text-sm font-semibold text-green-600">{result.co2Reduction}kg</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700">Sustainability:</span>
                  <div className="flex space-x-1">
                    {renderStars(result.sustainability)}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700">Location:</span>
                  <span className="text-sm text-gray-600">{productData.location}</span>
                </div>
              </div>

              {/* Buy Button */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <button className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center space-x-2">
                  <DollarSign className="w-5 h-5" />
                  <span>Order Packaging Materials</span>
                </button>
                <p className="text-xs text-gray-500 text-center mt-2">
                  Estimated cost: ${(result.materialSavings * 2.5).toFixed(2)} | Delivery: 2-3 business days
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sustainability Dashboard */}
      {showResults && result && (
        <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8 border border-gray-100">
          <div className="flex items-center space-x-3 mb-6">
            <Leaf className="w-6 h-6 text-green-600" />
            <h2 className="text-2xl font-bold text-gray-900">Sustainability Dashboard</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-green-50 rounded-xl p-4 border border-green-100">
              <div className="flex items-center space-x-3">
                <TreePine className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold text-green-700">{result.treesSaved}</p>
                  <p className="text-sm text-green-600">Trees Saved</p>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
              <div className="flex items-center space-x-3">
                <Recycle className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold text-blue-700">{result.plasticReduced}kg</p>
                  <p className="text-sm text-blue-600">Plastic Reduced</p>
                </div>
              </div>
            </div>
            
            <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
              <div className="flex items-center space-x-3">
                <Leaf className="w-8 h-8 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold text-purple-700">{result.carbonOffset}</p>
                  <p className="text-sm text-purple-600">Tons CO₂e Offset</p>
                </div>
              </div>
            </div>
          </div>

          {/* Mini Bar Chart */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Waste Reduction Progress</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600 w-20">Material</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{width: `${Math.min(100, result.fillPercentage)}%`}}></div>
                </div>
                <span className="text-sm font-semibold text-green-600">{Math.min(100, result.fillPercentage)}%</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600 w-20">Space</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{width: `${Math.min(100, result.fillPercentage + 10)}%`}}></div>
                </div>
                <span className="text-sm font-semibold text-blue-600">{Math.min(100, result.fillPercentage + 10)}%</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderCustomerPortal = () => (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            Hello, Sarah Johnson!
          </h1>
          <p className="text-lg text-gray-600">
            Welcome to your sustainable packaging portal
          </p>
        </div>
        <div className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold">
          Balance: $12.75
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Tracking */}
        <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8 border border-gray-100">
          <div className="flex items-center space-x-3 mb-6">
            <Package className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Order Tracking</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-2 font-semibold text-gray-700">Order ID</th>
                  <th className="text-left py-3 px-2 font-semibold text-gray-700">Date</th>
                  <th className="text-left py-3 px-2 font-semibold text-gray-700">Items</th>
                  <th className="text-left py-3 px-2 font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 px-2 font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {mockOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-100">
                    <td className="py-3 px-2 text-sm font-mono">{order.id}</td>
                    <td className="py-3 px-2 text-sm">{order.date}</td>
                    <td className="py-3 px-2 text-sm">{order.items}</td>
                    <td className="py-3 px-2">{getStatusBadge(order.status)}</td>
                    <td className="py-3 px-2">
                      {order.status === 'Return Pending' && (
                        <button className="text-blue-600 hover:text-blue-800 text-sm font-semibold">
                          Schedule Pickup
                        </button>
                      )}
                      {order.status === 'Delivered' && (
                        <button className="text-green-600 hover:text-green-800 text-sm font-semibold">
                          Return Box
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Box Return Scheduling */}
        <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8 border border-gray-100">
          <div className="flex items-center space-x-3 mb-6">
            <Calendar className="w-6 h-6 text-green-600" />
            <h2 className="text-2xl font-bold text-gray-900">Schedule Pickup</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select Order
              </label>
              <div className="relative">
                <select
                  value={selectedOrder}
                  onChange={(e) => setSelectedOrder(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                >
                  <option value="">Choose an order</option>
                  {mockOrders.filter(order => order.status === 'Delivered').map(order => (
                    <option key={order.id} value={order.id}>{order.id} - {order.items} items</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Pickup Date
              </label>
              <input
                type="date"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Time Slot
              </label>
              <div className="relative">
                <select
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                >
                  <option value="">Select time slot</option>
                  {timeSlots.map(slot => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>

            {selectedOrder && pickupDate && pickupTime && (
              <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center">
                <div className="text-center">
                  <QrCode className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Dynamic QR Code</p>
                  <p className="text-xs text-gray-400">Order: {selectedOrder}</p>
                </div>
              </div>
            )}

            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-blue-700">
                <strong>Note:</strong> Leave box with QR visible at doorstep during your selected time slot.
              </p>
            </div>

            <button
              onClick={schedulePickup}
              disabled={isScheduling || !selectedOrder || !pickupDate || !pickupTime}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isScheduling ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Scheduling...</span>
                </>
              ) : (
                <>
                  <Calendar className="w-5 h-5" />
                  <span>Schedule Pickup</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Rewards Dashboard */}
      <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8 border border-gray-100">
        <div className="flex items-center space-x-3 mb-6">
          <Gift className="w-6 h-6 text-purple-600" />
          <h2 className="text-2xl font-bold text-gray-900">Rewards Dashboard</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-green-50 rounded-xl p-4 border border-green-100">
            <div className="flex items-center space-x-3">
              <DollarSign className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-green-700">$12.75</p>
                <p className="text-sm text-green-600">Total Earned</p>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
            <div className="flex items-center space-x-3">
              <Package className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-blue-700">17</p>
                <p className="text-sm text-blue-600">Boxes Returned</p>
              </div>
            </div>
          </div>
          
          <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
            <div className="flex items-center space-x-3">
              <Leaf className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold text-purple-700">8.5kg</p>
                <p className="text-sm text-purple-600">CO₂ Reduced</p>
              </div>
            </div>
          </div>
        </div>

        <button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200">
          Redeem Rewards
        </button>
      </div>
    </div>
  );

  const renderDriverApp = () => (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            Driver #WMT-4521
          </h1>
          <p className="text-lg text-gray-600">
            Today's pickup route
          </p>
        </div>
        <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full">
          <div className="flex items-center space-x-2">
            <div className="w-32 bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{width: '65%'}}></div>
            </div>
            <span className="text-sm font-semibold">65%</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Today's Pickups */}
        <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <MapPin className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">Today's Pickups</h2>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
              >
                <List className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`p-2 rounded-lg ${viewMode === 'map' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
              >
                <Map className="w-5 h-5" />
              </button>
            </div>
          </div>

          {viewMode === 'map' ? (
            <div className="bg-gray-100 rounded-lg p-8 flex items-center justify-center mb-4">
              <div className="text-center">
                <Map className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Interactive Map View</p>
                <p className="text-xs text-gray-400">Pickup locations pinned</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {mockPickups.map((pickup) => (
                <div key={pickup.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="font-semibold text-gray-900">{pickup.address}</span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{pickup.timeWindow}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Package className="w-4 h-4" />
                          <span>{pickup.boxes} boxes</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      {getStatusBadge(pickup.status)}
                      {pickup.status === 'Pending' && (
                        <button
                          onClick={() => setSelectedPickup(pickup)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                        >
                          Collect
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Collection Interface */}
        <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8 border border-gray-100">
          <div className="flex items-center space-x-3 mb-6">
            <QrCode className="w-6 h-6 text-green-600" />
            <h2 className="text-2xl font-bold text-gray-900">Log Collection</h2>
          </div>

          {selectedPickup ? (
            <div className="space-y-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="font-semibold text-blue-900">{selectedPickup.address}</p>
                <p className="text-sm text-blue-700">Expected: {selectedPickup.boxes} boxes</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  QR Code Scanner
                </label>
                <input
                  type="text"
                  placeholder="Scan or enter QR code"
                  value={qrCode}
                  onChange={(e) => setQrCode(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Box Condition
                </label>
                <div className="relative">
                  <select
                    value={boxCondition}
                    onChange={(e) => setBoxCondition(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                  >
                    <option value="">Select condition</option>
                    {boxConditions.map(condition => (
                      <option key={condition} value={condition}>{condition}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  max={selectedPickup.boxes}
                  value={boxQuantity}
                  onChange={(e) => setBoxQuantity(parseInt(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Photo Upload
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Click to upload photo</p>
                </div>
              </div>

              <button
                onClick={collectBox}
                disabled={isCollecting || !qrCode || !boxCondition}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isCollecting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Collecting...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    <span>Submit Collection</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="text-center py-8">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Select a pickup to log collection</p>
            </div>
          )}
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8 border border-gray-100">
        <div className="flex items-center space-x-3 mb-6">
          <BarChart3 className="w-6 h-6 text-purple-600" />
          <h2 className="text-2xl font-bold text-gray-900">Performance Metrics</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-green-50 rounded-xl p-4 border border-green-100">
            <div className="flex items-center space-x-3">
              <Package className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-green-700">24</p>
                <p className="text-sm text-green-600">Boxes Collected</p>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
            <div className="flex items-center space-x-3">
              <Truck className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-blue-700">92%</p>
                <p className="text-sm text-blue-600">Route Efficiency</p>
              </div>
            </div>
          </div>
          
          <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
            <div className="flex items-center space-x-3">
              <DollarSign className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold text-purple-700">$18.50</p>
                <p className="text-sm text-purple-600">Rewards Earned</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Daily Goal Progress</h4>
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-600 w-20">Target: 30</span>
            <div className="flex-1 bg-gray-200 rounded-full h-3">
              <div className="bg-green-500 h-3 rounded-full" style={{width: '80%'}}></div>
            </div>
            <span className="text-sm font-semibold text-green-600">24/30</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b-4 border-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Package className="w-8 h-8 text-blue-600" />
                <span className="text-2xl font-bold text-blue-900">Walmart</span>
              </div>
            </div>
          </div>
          
          {/* Tab Navigation */}
          <div className="mt-6">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('advisor')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'advisor'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                PACKAGING ADVISOR
              </button>
              <button
                onClick={() => setActiveTab('customer')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'customer'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                CUSTOMER PORTAL
              </button>
              <button
                onClick={() => setActiveTab('driver')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'driver'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                DRIVER APP
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'advisor' && renderPackagingAdvisor()}
        {activeTab === 'customer' && renderCustomerPortal()}
        {activeTab === 'driver' && renderDriverApp()}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-6">
              <span className="text-sm">Powered by Walmart AI</span>
              <span className="text-sm">Project Gigaton Initiative</span>
            </div>
            <div className="text-sm text-gray-400">
              © 2025 Walmart Inc. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;