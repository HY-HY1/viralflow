const Benefits = () => {
    return (
      <section className="w-full py-20 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-8">Why Choose Us?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            <div className="feature-card p-6 bg-white rounded shadow-md">
              <h3 className="text-xl font-bold mb-4">AI Editing</h3>
              <p>Our AI-powered editing tools make creating viral-ready videos effortless.</p>
            </div>
            <div className="feature-card p-6 bg-white rounded shadow-md">
              <h3 className="text-xl font-bold mb-4">Fast Turnaround</h3>
              <p>Get high-quality videos ready to post within minutes, not hours.</p>
            </div>
            {/* Add this class to the last feature card to make it span full width on medium screens */}
            <div className="feature-card p-6 bg-white rounded shadow-md sm:col-span-2 lg:col-span-1">
              <h3 className="text-xl font-bold mb-4">Easy to Use</h3>
              <p>Intuitive platform design ensures anyone can use our tool with no learning curve.</p>
            </div>
          </div>
        </div>
      </section>
    );
  };
  
  export default Benefits;
  