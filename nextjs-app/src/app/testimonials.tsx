interface Testimonial {
  quote: string;
  author: string;
}

const testimonials: Testimonial[] = [
  { quote: "This is a great product!", author: "John Doe" },
  { quote: "I love this app!", author: "Jane Doe" },
];

export default function Testimonials() {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Testimonials</h2>
      <ul className="list-disc list-inside">
        {testimonials.map((testimonial, index) => (
          <li key={index} className="mb-4">
            <p className="text-lg italic">"{testimonial.quote}"</p>
            <p className="text-gray-600">- {testimonial.author}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
