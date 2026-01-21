import React, { useState, useMemo, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Search, TrendingUp, MapPin, Home, Calendar, DollarSign, BarChart3, Upload, Download, AlertCircle, Check, Database } from 'lucide-react';

// Sample PPR-style data (in production, this would come from your database)
const samplePPRData = [
  { id: 1, address: "12 Fitzwilliam Square, Dublin 2", price: 850000, date: "2024-11-15", county: "Dublin", propertyType: "House", size: "Second-Hand" },
  { id: 2, address: "45 Merrion Road, Dublin 4", price: 1200000, date: "2024-10-22", county: "Dublin", propertyType: "House", size: "Second-Hand" },
  { id: 3, address: "Apt 3, Smithfield Square, Dublin 7", price: 425000, date: "2024-11-01", county: "Dublin", propertyType: "Apartment", size: "New" },
  { id: 4, address: "78 South Circular Road, Dublin 8", price: 520000, date: "2024-09-18", county: "Dublin", propertyType: "House", size: "Second-Hand" },
  { id: 5, address: "15 Donnybrook Road, Dublin 4", price: 950000, date: "2024-10-05", county: "Dublin", propertyType: "House", size: "Second-Hand" },
  { id: 6, address: "Apt 12, Grand Canal Dock, Dublin 2", price: 485000, date: "2024-11-20", county: "Dublin", propertyType: "Apartment", size: "New" },
  { id: 7, address: "23 Rathmines Road, Dublin 6", price: 675000, date: "2024-08-30", county: "Dublin", propertyType: "House", size: "Second-Hand" },
  { id: 8, address: "56 Clontarf Road, Dublin 3", price: 720000, date: "2024-09-12", county: "Dublin", propertyType: "House", size: "Second-Hand" },
  { id: 9, address: "Apt 5, Ballsbridge, Dublin 4", price: 550000, date: "2024-10-28", county: "Dublin", propertyType: "Apartment", size: "Second-Hand" },
  { id: 10, address: "89 Rathgar Road, Dublin 6", price: 780000, date: "2024-11-08", county: "Dublin", propertyType: "House", size: "Second-Hand" },
  { id: 11, address: "34 Sandymount Road, Dublin 4", price: 890000, date: "2023-11-15", county: "Dublin", propertyType: "House", size: "Second-Hand" },
  { id: 12, address: "67 Ranelagh Road, Dublin 6", price: 650000, date: "2023-10-22", county: "Dublin", propertyType: "House", size: "Second-Hand" },
  { id: 13, address: "Apt 8, Docklands, Dublin 1", price: 395000, date: "2023-09-18", county: "Dublin", propertyType: "Apartment", size: "New" },
  { id: 14, address: "45 Drumcondra Road, Dublin 9", price: 480000, date: "2023-08-30", county: "Dublin", propertyType: "House", size: "Second-Hand" },
  { id: 15, address: "23 Howth Road, Dublin 5", price: 610000, date: "2023-07-12", county: "Dublin", propertyType: "House", size: "Second-Hand" },
];

// Generate historical trend data
const generateTrendData = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months.map((month, idx) => ({
    month,
    avgPrice: 650000 + (idx * 15000) + (Math.random() * 50000),
    sales: 120 + Math.floor(Math.random() * 80),
  }));
};

const PropertyAnalyzer = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [priceRange, setPriceRange] = useState([0, 2000000]);
  const [activeView, setActiveView] = useState('search'); // search, trends, insights
  
  const trendData = useMemo(() => generateTrendData(), []);
  
  const filteredProperties = useMemo(() => {
    return samplePPRData.filter(property => {
      const matchesSearch = property.address.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedType === 'All' || property.propertyType === selectedType;
      const matchesPrice = property.price >= priceRange[0] && property.price <= priceRange[1];
      return matchesSearch && matchesType && matchesPrice;
    });
  }, [searchTerm, selectedType, priceRange]);
  
  const averagePrice = useMemo(() => {
    if (filteredProperties.length === 0) return 0;
    return Math.round(filteredProperties.reduce((sum, p) => sum + p.price, 0) / filteredProperties.length);
  }, [filteredProperties]);
  
  const priceDistribution = useMemo(() => {
    const ranges = [
      { range: '0-300k', min: 0, max: 300000, count: 0 },
      { range: '300-500k', min: 300000, max: 500000, count: 0 },
      { range: '500-700k', min: 500000, max: 700000, count: 0 },
      { range: '700-900k', min: 700000, max: 900000, count: 0 },
      { range: '900k+', min: 900000, max: Infinity, count: 0 },
    ];
    
    filteredProperties.forEach(p => {
      const range = ranges.find(r => p.price >= r.min && p.price < r.max);
      if (range) range.count++;
    });
    
    return ranges;
  }, [filteredProperties]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Home className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Irish Property Insights</h1>
                <p className="text-sm text-slate-600">Powered by Property Price Register Data</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveView('search')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeView === 'search' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Search className="w-4 h-4 inline mr-2" />
                Search
              </button>
              <button
                onClick={() => setActiveView('trends')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeView === 'trends' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <TrendingUp className="w-4 h-4 inline mr-2" />
                Trends
              </button>
              <button
                onClick={() => setActiveView('insights')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeView === 'insights' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <BarChart3 className="w-4 h-4 inline mr-2" />
                Insights
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search View */}
        {activeView === 'search' && (
          <div className="space-y-6">
            {/* Search and Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Search by Address
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Enter street name, area, or postcode..."
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Property Type
                  </label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="All">All Types</option>
                    <option value="House">Houses</option>
                    <option value="Apartment">Apartments</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Price Range: €{priceRange[0].toLocaleString()} - €{priceRange[1].toLocaleString()}
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="range"
                    min="0"
                    max="2000000"
                    step="50000"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                    className="flex-1"
                  />
                  <input
                    type="range"
                    min="0"
                    max="2000000"
                    step="50000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 font-medium">Total Sales</p>
                    <p className="text-3xl font-bold text-slate-900 mt-1">{filteredProperties.length}</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Home className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 font-medium">Average Price</p>
                    <p className="text-3xl font-bold text-slate-900 mt-1">€{(averagePrice / 1000).toFixed(0)}k</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-lg">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 font-medium">Market Status</p>
                    <p className="text-3xl font-bold text-green-600 mt-1">+12.5%</p>
                    <p className="text-xs text-slate-500 mt-1">vs last year</p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Results List */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200">
              <div className="p-6 border-b border-slate-200">
                <h2 className="text-lg font-bold text-slate-900">Recent Sales</h2>
                <p className="text-sm text-slate-600 mt-1">
                  Showing {filteredProperties.length} properties
                </p>
              </div>
              <div className="divide-y divide-slate-200">
                {filteredProperties.slice(0, 8).map((property) => (
                  <div key={property.id} className="p-6 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-slate-400" />
                          <h3 className="font-semibold text-slate-900">{property.address}</h3>
                        </div>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-slate-600">
                          <span className="flex items-center">
                            <Home className="w-4 h-4 mr-1" />
                            {property.propertyType}
                          </span>
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date(property.date).toLocaleDateString('en-IE', { 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            property.size === 'New' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            {property.size}
                          </span>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-2xl font-bold text-slate-900">
                          €{(property.price / 1000).toFixed(0)}k
                        </p>
                        <p className="text-sm text-slate-500 mt-1">Sale Price</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Trends View */}
        {activeView === 'trends' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Average Price Trends - 2024</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                    formatter={(value) => `€${(value / 1000).toFixed(0)}k`}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="avgPrice" 
                    stroke="#2563eb" 
                    strokeWidth={3}
                    name="Average Price"
                    dot={{ fill: '#2563eb', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Sales Volume by Month</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                  />
                  <Legend />
                  <Bar dataKey="sales" fill="#10b981" name="Number of Sales" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Insights View */}
        {activeView === 'insights' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Price Distribution</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={priceDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="range" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                  />
                  <Bar dataKey="count" fill="#8b5cf6" name="Properties" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-sm p-6 text-white">
                <h3 className="text-lg font-bold mb-2">Market Insight</h3>
                <p className="text-blue-100 text-sm mb-4">
                  Based on recent sales data in your search area
                </p>
                <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                  <p className="text-sm leading-relaxed">
                    Properties in Dublin 4 are selling 15% faster than the city average, with an average time on market of just 3.2 weeks. The area shows strong demand for 2-3 bedroom apartments.
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-sm p-6 text-white">
                <h3 className="text-lg font-bold mb-2">Investment Opportunity</h3>
                <p className="text-purple-100 text-sm mb-4">
                  Emerging areas with growth potential
                </p>
                <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                  <p className="text-sm leading-relaxed">
                    Dublin 8 shows the highest growth trajectory with prices up 18.5% year-on-year. New developments and infrastructure improvements are driving demand in this area.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Key Statistics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">€782k</p>
                  <p className="text-sm text-slate-600 mt-1">Median Price</p>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">23 days</p>
                  <p className="text-sm text-slate-600 mt-1">Avg. Time to Sale</p>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">92%</p>
                  <p className="text-sm text-slate-600 mt-1">Of Asking Price</p>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <p className="text-2xl font-bold text-orange-600">156</p>
                  <p className="text-sm text-slate-600 mt-1">Sales This Month</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyAnalyzer;