import { Card } from "src/components/ui/card";
import { Link } from "wouter";

interface ServiceCardProps {
  title: string;
  description: string;
  icon: string;
  gradient: string;
  href?: string;
}

export default function ServiceCard({ title, description, icon, gradient, href }: ServiceCardProps) {
  const cardContent = (
    <Card 
      className={`bg-gradient-to-br ${gradient} p-6 text-white text-center transform hover:scale-105 transition duration-300 cursor-pointer hover:shadow-xl`}
    >
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-200">{description}</p>
    </Card>
  );

  if (href) {
    return <Link href={href}>{cardContent}</Link>;
  }

  return cardContent;
}
