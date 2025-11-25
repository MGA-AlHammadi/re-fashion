
export default function Home() {
  return (
    <div className="bg-white">
      
      {/* HERO SECTION - Ultra Modern Fashion Style */}
      <section className="relative h-screen bg-gradient-to-br from-gray-900 via-green-900 to-black overflow-hidden">
        <div className="absolute inset-0 bg-black/40"></div>
        
        {/* Multiple animated gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-500/20 to-transparent animate-pulse"></div>
        <div className="absolute inset-0 bg-gradient-to-l from-emerald-400/10 via-transparent to-green-600/10 animate-pulse" style={{animationDelay: '1s'}}></div>
        
        {/* Floating sustainability symbols */}
        {/* Recycling symbol */}
        <div className="absolute top-10 left-10 w-8 h-8 opacity-20 animate-pulse" style={{animationDelay: '0.5s'}}>
          <svg fill="currentColor" className="text-green-400" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.5 15L7 13.5l1.41-1.41 2.09 2.09 4.59-4.59L16.5 11 10.5 17z"/>
          </svg>
        </div>
        
        {/* Eco leaf */}
        <div className="absolute top-32 right-24 w-6 h-6 opacity-30 animate-bounce" style={{animationDelay: '2s'}}>
          <svg fill="currentColor" className="text-emerald-400" viewBox="0 0 24 24">
            <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z"/>
          </svg>
        </div>
        
        {/* Cotton/fabric symbol */}
        <div className="absolute bottom-40 left-16 w-10 h-10 opacity-25 animate-pulse" style={{animationDelay: '1.5s'}}>
          <svg fill="currentColor" className="text-white" viewBox="0 0 24 24">
            <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6M12,8A4,4 0 0,0 8,12A4,4 0 0,0 12,16A4,4 0 0,0 16,12A4,4 0 0,0 12,8Z"/>
          </svg>
        </div>
        
        {/* Heart for sustainable love */}
        <div className="absolute top-20 right-12 w-6 h-6 opacity-30 animate-ping" style={{animationDelay: '3s'}}>
          <svg fill="currentColor" className="text-green-300" viewBox="0 0 24 24">
            <path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5 2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z"/>
          </svg>
        </div>
        
        <div className="relative z-10 flex items-center justify-center h-full px-4">
          <div className="text-center text-white max-w-4xl">
            {/* Title with advanced animations */}
            <div className="relative mb-8">
              <h1 className="text-7xl md:text-8xl font-thin tracking-wide animate-pulse hover:animate-none transition-all duration-1000 transform hover:scale-105 relative z-10">
                RE-FASHION
              </h1>
              {/* Eco-friendly shadow effect */}
              <h1 className="absolute top-0 left-0 text-7xl md:text-8xl font-thin tracking-wide text-emerald-400/40 transform translate-x-1 translate-y-1 -z-10">
                RE-FASHION
              </h1>
            </div>
            
            {/* Subtitle with typewriter effect simulation */}
            <p className="text-xl md:text-2xl font-light mb-12 tracking-wider opacity-0 animate-pulse transition-all duration-2000 hover:opacity-100" style={{animationDelay: '0.5s', opacity: 0.9}}>
              <span className="inline-block animate-pulse" style={{animationDelay: '0.8s'}}>Sustainable</span>{' '}
              <span className="inline-block animate-pulse" style={{animationDelay: '1.2s'}}>Fashion.</span>{' '}
              <span className="inline-block animate-pulse" style={{animationDelay: '1.6s'}}>Conscious</span>{' '}
              <span className="inline-block animate-pulse" style={{animationDelay: '2.0s'}}>Choices.</span>{' '}
              <span className="inline-block animate-pulse" style={{animationDelay: '2.4s'}}>Timeless</span>{' '}
              <span className="inline-block animate-pulse" style={{animationDelay: '2.8s'}}>Style.</span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center" style={{animationDelay: '3.2s'}}>
              {/* Premium Shop Now Button */}
              <a
                href="/register"
                className="group relative px-12 py-4 bg-white text-black font-medium tracking-wider transition-all duration-700 uppercase text-sm overflow-hidden hover:scale-110 hover:shadow-2xl hover:shadow-green-500/25 rounded-sm"
              >
                {/* Glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-emerald-500 opacity-0 group-hover:opacity-75 transition-opacity duration-700 blur-sm rounded-sm"></div>
                
                <span className="relative z-20">Shop Now</span>
                
                {/* Sliding gradient background */}
                <div className="absolute inset-0 bg-gradient-to-r from-green-600 via-emerald-600 to-green-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left"></div>
                
                {/* White text overlay */}
                <span className="absolute inset-0 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-30 font-medium tracking-wider uppercase text-sm">Shop Now</span>
                
                {/* Sustainable sparkle effects */}
                <div className="absolute top-2 right-2 w-3 h-3 opacity-0 group-hover:opacity-60 transition-opacity duration-500 animate-ping">
                  <svg fill="currentColor" className="text-white" viewBox="0 0 24 24">
                    <path d="M12,2L13.09,8.26L20,7L14.74,12.5L20,18L13.09,16.74L12,23L10.91,16.74L4,18L9.26,12.5L4,7L10.91,8.26L12,2Z"/>
                  </svg>
                </div>
                <div className="absolute bottom-2 left-2 w-2 h-2 opacity-0 group-hover:opacity-40 transition-opacity duration-500 animate-pulse" style={{animationDelay: '0.3s'}}>
                  <div className="w-full h-full bg-emerald-200 rounded-full"></div>
                </div>
              </a>
              
              {/* Premium Discover Button */}
              <a
                href="#collection"
                className="group relative px-12 py-4 border-2 border-white text-white font-medium tracking-wider transition-all duration-700 uppercase text-sm overflow-hidden hover:scale-110 hover:shadow-2xl hover:shadow-white/25 backdrop-blur-sm rounded-sm"
              >
                {/* Outer glow */}
                <div className="absolute -inset-2 bg-white/20 opacity-0 group-hover:opacity-50 transition-opacity duration-700 blur-lg rounded-sm"></div>
                
                <span className="relative z-20 group-hover:text-black transition-colors duration-700">Discover</span>
                
                {/* Fill animation */}
                <div className="absolute inset-0 bg-gradient-to-r from-white via-gray-100 to-white transform scale-y-0 group-hover:scale-y-100 transition-transform duration-700 origin-bottom"></div>
                
                {/* Border glow effect */}
                <div className="absolute inset-0 border-2 border-green-400/0 group-hover:border-green-400/60 transition-colors duration-700 rounded-sm"></div>
              </a>
            </div>
          </div>
        </div>

        {/* Sustainable background elements */}
        {/* Organic shapes representing nature */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-green-500/20 rounded-full blur-3xl animate-pulse" style={{clipPath: 'ellipse(60% 40% at 50% 50%)'}}></div>
        <div className="absolute bottom-20 left-20 w-48 h-48 bg-emerald-500/15 blur-3xl animate-pulse delay-1000" style={{borderRadius: '60% 40% 40% 60%'}}></div>
        <div className="absolute top-1/2 left-10 w-20 h-20 bg-white/15 blur-2xl animate-bounce delay-500" style={{borderRadius: '50% 70% 30% 50%'}}></div>
        
        {/* Subtle leaf patterns */}
        <div className="absolute top-1/3 right-1/4 opacity-5 animate-pulse">
          <svg width="60" height="60" fill="currentColor" className="text-green-400">
            <path d="M30,5C15,10 10,25 5,35L8,36L10,32C12,33 15,33 18,33C35,33 40,5 40,5C38,8 25,8 15,10C5,12 2,20 2,25C2,30 5,35 5,35C15,15 30,5 30,5Z"/>
          </svg>
        </div>
        
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
