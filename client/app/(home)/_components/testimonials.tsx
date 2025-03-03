const Testimonials = () => {
    return (
      <section className="w-full py-20 bg-gray-100 rounded-lg">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-8">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-center">
            <div className="testimonial-card p-4 bg-white rounded shadow text-center">
              <p className="text-lg font-medium mb-4">
                {"This platform changed the way we create TikTok content. Our sales have skyrocketed!"}
              </p>
              <h4 className="font-bold">John Doe</h4>
              <p className="text-sm text-gray-500">TikTok Influencer</p>
            </div>
            <div className="testimonial-card p-4 bg-white rounded shadow text-center">
              <p className="text-lg font-medium mb-4">
                &quot;So easy to use! I had my first viral video within days of using it.&quot;
              </p>
              <h4 className="font-bold">Jane Smith</h4>
              <p className="text-sm text-gray-500">Affiliate Marketer</p>
            </div>
            {/* Add this class to the last testimonial box to span full width when on medium screens */}
            <div className="testimonial-card p-4 bg-white rounded shadow text-center md:col-span-2 lg:col-span-1">
              <p className="text-lg font-medium mb-4">
                {"The best tool for content creators. Highly recommend it!"}
              </p>
              <h4 className="font-bold">Alice Johnson</h4>
              <p className="text-sm text-gray-500">Content Creator</p>
            </div>
          </div>
        </div>
      </section>
    );
  };
  
  export default Testimonials;
  