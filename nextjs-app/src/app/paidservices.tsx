import React from "react";
import Link from "next/link";

const PaidServices = () => {
  const services = [
    {
      title: "Calling Assistant",
      description:
        "Makes calls on behalf of users and provides a transcript of the call.",
      price: "$9.99/month",
      link: "/calling-assistant",
    },
    {
      title: "Training Plan Pro",
      description:
        "Advanced learning plan and curriculum development with personalized recommendations.",
      price: "$19.99/month",
      link: "/training-plan",
    },
    {
      title: "Knowledge GPT Plus",
      description:
        "Premium access to expert teaching and curated knowledge materials.",
      price: "$14.99/month",
      link: "/knowledge-gpt",
    },
    {
      title: "Competency Manager Pro",
      description:
        "Advanced competency framework development with industry-specific templates.",
      price: "$24.99/month",
      link: "/competency-manager",
    },
  ];

  return (
    <section id="paid-services" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
          Premium Services
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-lg p-6 transition-transform hover:scale-105"
            >
              <h3 className="text-xl font-semibold mb-3 text-gray-800">
                {service.title}
              </h3>
              <p className="text-gray-600 mb-4">{service.description}</p>
              <p className="text-2xl font-bold text-blue-600 mb-4">
                {service.price}
              </p>
              <Link
                href={service.link}
                className="block w-full text-center bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Learn More
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PaidServices;
