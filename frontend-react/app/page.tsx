
export default function Home() {
  return (
    <div className="bg-white">
      
      {/* HERO SECTION - Modern Fashion Style */}
      <section className="relative h-screen bg-gradient-to-br from-gray-900 via-green-900 to-black overflow-hidden">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative z-10 flex items-center justify-center h-full px-4">
          <div className="text-center text-white max-w-4xl">
            <h1 className="text-7xl md:text-8xl font-thin tracking-wide mb-8">
              RE-FASHION
            </h1>
            <p className="text-xl md:text-2xl font-light mb-12 tracking-wider opacity-90">
              Sustainable Fashion. Conscious Choices. Timeless Style.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <a
                href="/register"
                className="px-12 py-4 bg-white text-black font-medium tracking-wider hover:bg-gray-100 transition-all duration-300 uppercase text-sm"
              >
                Shop Now
              </a>
              <a
                href="#collection"
                className="px-12 py-4 border border-white text-white font-medium tracking-wider hover:bg-white hover:text-black transition-all duration-300 uppercase text-sm"
              >
                Discover
              </a>
            </div>
          </div>
        </div>

        {/* Animated background elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-green-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-10 w-20 h-20 bg-white/10 rounded-full blur-2xl animate-bounce delay-500"></div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Warum Re-Fashion?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Unsere Mission ist es, Mode nachhaltiger und zugänglicher zu machen
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                ),
                title: "Umweltfreundlich",
                description: "Reduziere deinen ökologischen Fußabdruck durch nachhaltigen Modekonsum"
              },
              {
                icon: (
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                ),
                title: "Community",
                description: "Verbinde dich mit Gleichgesinnten und teile deine Liebe zur nachhaltigen Mode"
              },
              {
                icon: (
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: "Fair & Günstig",
                description: "Faire Preise für hochwertige Mode - gut für dich und die Umwelt"
              }
            ].map((feature, index) => (
              <div key={feature.title} className="text-center p-8 bg-green-50 rounded-2xl hover:bg-green-100 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl group" style={{animationDelay: `${index * 100}ms`}}>
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 text-white rounded-full mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COLLECTION CATEGORIES - Zara/Zalando Style */}
      <section id="collection" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-thin tracking-wide text-gray-900 mb-6">
              COLLECTIONS
            </h2>
            <p className="text-lg text-gray-600 font-light tracking-wide">
              Discover sustainable fashion for every style
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[
              {
                title: "WOMEN",
                description: "Dresses, Blouses & More",
                image: "bg-gradient-to-br from-rose-200 to-pink-300",
                textColor: "text-rose-800"
              },
              {
                title: "MEN",
                description: "Shirts, Pants & More", 
                image: "bg-gradient-to-br from-blue-200 to-indigo-300",
                textColor: "text-blue-800"
              },
              {
                title: "KIDS",
                description: "Playful & Comfortable",
                image: "bg-gradient-to-br from-yellow-200 to-orange-300", 
                textColor: "text-orange-800"
              },
              {
                title: "SHOES",
                description: "Sneakers, Boots & More",
                image: "bg-gradient-to-br from-gray-300 to-slate-400",
                textColor: "text-slate-800"
              }
            ].map((category) => (
              <div key={category.title} className="group cursor-pointer">
                <div className="relative overflow-hidden bg-white shadow-xl hover:shadow-2xl transition-all duration-500 rounded-xl">
                  {/* Image placeholder with gradient */}
                  <div className={`h-80 ${category.image} flex items-end p-6 group-hover:scale-105 transition-transform duration-500`}>
                    <div className="bg-white/95 backdrop-blur-sm p-4 w-full rounded-lg shadow-xl text-center">
                      <h3 className={`text-xl font-bold ${category.textColor} tracking-wider mb-2 break-words`}>
                        {category.title}
                      </h3>
                      <p className="text-gray-700 text-sm font-light leading-relaxed">
                        {category.description}
                      </p>
                    </div>
                  </div>
                  
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center rounded-xl">
                    <div className="bg-white text-black px-6 py-3 font-medium tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-300 uppercase text-sm rounded-lg shadow-xl">
                      Shop Now
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS SHOWCASE */}
      <section className="py-24 bg-gradient-to-r from-green-50 via-white to-green-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-thin tracking-wide text-gray-900 mb-6">
              TRENDING NOW
            </h2>
            <p className="text-lg text-gray-600 font-light max-w-2xl mx-auto">
              Discover our most loved sustainable pieces, handpicked for conscious fashion lovers
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Organic Cotton Basics",
                price: "Ab 29€",
                badge: "Bestseller",
                color: "bg-gradient-to-br from-blue-100 to-blue-200"
              },
              {
                title: "Recycled Denim Collection",
                price: "Ab 89€",
                badge: "New",
                color: "bg-gradient-to-br from-indigo-100 to-purple-200"
              },
              {
                title: "Eco-Friendly Sneakers",
                price: "Ab 120€",
                badge: "Limited",
                color: "bg-gradient-to-br from-green-100 to-emerald-200"
              }
            ].map((item, index) => (
              <div key={item.title} className="group cursor-pointer transform hover:scale-105 transition-all duration-300">
                <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500">
                  <div className={`h-64 ${item.color} flex items-center justify-center relative`}>
                    {/* Product placeholder */}
                    <div className="w-32 h-32 bg-white/30 rounded-full backdrop-blur-sm flex items-center justify-center">
                      <svg className="w-16 h-16 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                    
                    {/* Badge */}
                    <div className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                      {item.badge}
                    </div>
                  </div>
                  
                  <div className="p-6 bg-white">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-2xl font-bold text-green-600">
                      {item.price}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SUSTAINABILITY STATEMENT - Minimalist */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-thin tracking-wide text-gray-900 mb-8">
            SUSTAINABLE BY DESIGN
          </h2>
          <p className="text-lg text-gray-600 font-light leading-relaxed mb-12 max-w-2xl mx-auto">
            Every piece tells a story of conscious choices, ethical production, and timeless style. 
            Join us in revolutionizing fashion for a better tomorrow.
          </p>
          
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                number: "100%",
                title: "Sustainable Materials",
                description: "Eco-friendly fabrics and ethical sourcing"
              },
              {
                number: "50%",
                title: "Reduced Carbon Footprint", 
                description: "Through circular fashion and reuse"
              },
              {
                number: "1000+",
                title: "Happy Customers",
                description: "Building a conscious community"
              }
            ].map((stat) => (
              <div key={stat.title} className="text-center">
                <div className="text-5xl font-thin text-green-600 mb-4">
                  {stat.number}
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-3 tracking-wide">
                  {stat.title}
                </h3>
                <p className="text-gray-600 font-light">
                  {stat.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER SECTION */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-emerald-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-thin text-white mb-6 tracking-wide">
            STAY IN THE LOOP
          </h2>
          <p className="text-xl text-green-100 mb-8 font-light">
            Be the first to discover new sustainable collections and exclusive offers
          </p>
          
          <div className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 rounded-lg text-gray-900 placeholder-white focus:outline-none focus:ring-2 focus:ring-white bg-white/20 backdrop-blur-sm"
              />
              <button className="px-8 py-4 bg-white text-green-600 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 whitespace-nowrap">
                Subscribe
              </button>
            </div>
            <p className="text-green-100 text-sm mt-4 opacity-80">
              Join 10,000+ conscious fashion lovers. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION - Zara Style */}
      <section className="py-24 bg-black">
        <div className="max-w-6xl mx-auto text-center px-4">
          <h2 className="text-6xl font-thin text-white mb-8 tracking-wide">
            JOIN THE MOVEMENT
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto font-light">
            Be part of the sustainable fashion revolution. Start your conscious style journey today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <a
              href="/register"
              className="px-12 py-4 bg-white text-black font-medium tracking-wider hover:bg-gray-100 transition-all duration-300 uppercase text-sm"
            >
              Create Account
            </a>
            <a
              href="/login"
              className="px-12 py-4 border border-white text-white font-medium tracking-wider hover:bg-white hover:text-black transition-all duration-300 uppercase text-sm"
            >
              Sign In
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
