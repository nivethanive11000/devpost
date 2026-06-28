export default function Home() {
  return (
    <div className="space-y-12 py-12">
      {/* Hero Section */}
      <section className="text-center space-y-6 py-20">
        <h1 className="text-5xl font-bold text-gray-900">
          Welcome to <span className="text-primary">TaskFlow</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Post tasks and find talented workers, or complete tasks and earn money.
          Build your reputation and grow your skills on our marketplace.
        </p>
        <div className="space-x-4">
          <a href="/tasks" className="inline-block btn-primary text-lg">Browse Tasks</a>
          <a href="/auth/signup" className="inline-block btn-secondary text-lg">Join Now</a>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="card">
          <div className="text-4xl mb-4">📋</div>
          <h3 className="text-xl font-bold mb-2">Post Tasks</h3>
          <p className="text-gray-600">
            Describe your task, set a budget, and connect with talented professionals
            who can help you get things done.
          </p>
        </div>

        <div className="card">
          <div className="text-4xl mb-4">💼</div>
          <h3 className="text-xl font-bold mb-2">Find Work</h3>
          <p className="text-gray-600">
            Browse available tasks, submit proposals with your best rates,
            and start earning money on your own schedule.
          </p>
        </div>

        <div className="card">
          <div className="text-4xl mb-4">⭐</div>
          <h3 className="text-xl font-bold mb-2">Build Reputation</h3>
          <p className="text-gray-600">
            Complete tasks successfully, earn 5-star reviews, and build
            a trusted profile that opens more opportunities.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-primary to-secondary text-white rounded-lg p-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold">1000+</div>
            <p className="text-blue-100">Active Tasks</p>
          </div>
          <div>
            <div className="text-4xl font-bold">500+</div>
            <p className="text-blue-100">Verified Workers</p>
          </div>
          <div>
            <div className="text-4xl font-bold">$50K+</div>
            <p className="text-blue-100">Total Earnings Paid</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center space-y-4 py-12">
        <h2 className="text-3xl font-bold">Ready to get started?</h2>
        <a href="/auth/signup" className="inline-block btn-primary text-lg">Create Your Account Today</a>
      </section>
    </div>
  );
}
