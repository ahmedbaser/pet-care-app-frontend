import React from 'react';
import Head from 'next/head';

const About: React.FC = () => {
  return (
    <>
      <Head>
        <title>About Us - Pet Care Tips & Stories</title>
        <meta name="description" content="Learn more about Pet Care Tips & Stories, our mission, and our team." />
      </Head>


    {/* Hero Section */}
     <section className="relative bg-gradient-to-r from-green-400 via-blue-500 to-purple-600  py-20">
        <div className="absolute inset-0 bg-opacity-30 bg-cover bg-center" style={{ backgroundImage: 'url(/images/hero-bg.jpg)' }}></div>
        <div className="relative container mx-auto text-center text-white">
          <h1 className="text-5xl font-extrabold mb-4 drop-shadow-lg">About Us</h1>
          <p className="text-xl mb-8 drop-shadow-md">Learn more about Pet Care Tips & Stories, our mission, and our team.</p>
        </div>
      </section>

      {/* Main Content Section */}
      <main className="container mx-auto py-12 px-6">
        {/* Our Mission Section */}
      <section className="mb-12 text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-6">Our Mission</h2>
          <p className="text-lg text-gray-700 mb-4 max-w-2xl mx-auto">
            At <strong>Pet Care Tips & Stories</strong>, our mission is to empower pet owners with the knowledge and resources they need to give their pets the best care possible. We focus on creating valuable, expert-driven content that helps improve the lives of both pets and their owners.
          </p>
      </section>

      {/* Team Section */}
      <section className="mb-12 text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-6">Meet the Team</h2>
         <div className="container mx-auto px-4 sm:px-8 lg:px-16">
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {["Sarah Johnson", "James Lee", "Emma Martinez"].map((member, index) => (
              <div
                key={index}
                className="w-full max-w-sm rounded-lg shadow-lg bg-white overflow-hidden transform hover:-translate-y-2 transition duration-300 ease-in-out flex flex-col items-center text-center p-8"
              >
                <img
                  src={`/images/team-member-${index + 1}.jpg`}
                  alt={`Team Member ${index + 1}`}
                  className="w-full h-48 object-cover mb-6 rounded-t-lg"
                />
                <h3 className="text-2xl font-semibold text-gray-800">{member}</h3>
                <p className="text-gray-600 mb-4">
                  {member === "Sarah Johnson"
                    ? "Founder & Lead Writer"
                    : member === "James Lee"
                    ? "Veterinarian Consultant"
                    : "Community Manager"}
                </p>
                <p className="text-gray-700">
                  {member === "Sarah Johnson"
                    ? "Passionate about pets and their well-being, Sarah founded Pet Care Tips & Stories to share her knowledge and create a supportive community for pet owners."
                    : member === "James Lee"
                    ? "Dr. James Lee brings expert advice to our platform, providing medical insights to ensure your pets are always in good health."
                    : "Emma helps manage our vibrant community of pet owners, ensuring that everyone feels supported and connected."}
                </p>
              </div>
            ))}
          </div>
         </div>
      </section>


        {/* Mission Statement Section */}
      <section className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 py-16 rounded-lg shadow-xl mb-12">
        <div className="container mx-auto text-center px-4 sm:px-6 lg:px-16">
          {/* Section Title */}
          <h2 className="text-4xl font-bold text-white mb-6">
            Why We Do It
          </h2>
      
          {/* Section Description */}
          <p className="text-lg text-white mx-auto max-w-4xl mb-8 font-light leading-relaxed">
            We are driven by our love for animals and our commitment to helping pets live long, healthy lives. By sharing tips, stories, and resources, we aim to strengthen the bond between humans and their pets, one story at a time.
          </p>
          
          <p className="text-lg text-white mx-auto max-w-3xl font-light leading-relaxed opacity-80">
            Our team is united in our passion for animals, and we’re constantly working to bring you the latest and most useful information to make pet ownership an enriching experience.
          </p>
          
          <div className="mt-8">
            <a
              href="#"
              className="inline-block bg-white text-gray-800 py-2 px-6 rounded-full font-semibold text-lg hover:bg-gray-200 transition duration-300 ease-in-out transform hover:scale-105"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>
   </main>

    </>
    );
  };

export default About;





















