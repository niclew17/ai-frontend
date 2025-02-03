import prismadb from "@/lib/prismadb";
import { BotForm } from "./components/bot-form";

interface CarIdPageProps {
  params: {
    carId: string;
  };
}

const CarIdPage = async ({ params }: CarIdPageProps) => {
  // TODO: Check subscription
  const car = await prismadb.bot.findUnique({
    where: {
      id: params.carId,
    },
  });

  const categories = await prismadb.category.findMany();

  return <BotForm initialData={car} categories={categories} />;
};

export default CarIdPage;
